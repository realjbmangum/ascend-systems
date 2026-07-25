// OAuth 2.1 protected MCP server at /mcp.
//
// WHY THIS EXISTS ALONGSIDE THE OTHER TWO DOORS
//   /api/mcp    — MCP with the token in the URL path. Works, but the secret ends
//                 up in xAI's stored config and any log that records paths.
//   /api/voice  — one plain HTTP endpoint per tool. Works, but every tool must
//                 be added by hand in the console for every agent: roughly 16
//                 fields per client, 160 across ten.
//   /mcp        — this. One URL per client, no secret in it, and the console's
//                 own OAuth form is what it was built for.
//
// THE IDEA THAT MAKES IT CLEAN
//   OAuth grants carry `props` from the consent step through to every later
//   request. So the consent screen asks WHICH AGENT this connection is for, and
//   the answer rides along on the grant. One URL serves every tenant and every
//   department; the grant decides what it can see. Nothing identifying is in the
//   URL at all.
//
// Everything else is unchanged: the same tool handlers, the same per-agent
// allow-lists, the same per-tenant database routing.

import type { Bindings } from "../types";
import {
  toolsForAgent,
  findToolForAgent,
  type ToolCtx,
  type VoiceAgentRow,
} from "../lib/voice-tools";

const PROTOCOL_VERSION = "2025-06-18";
const SERVER_INFO = { name: "ascend-voice-tools", version: "2.0.0" };
const METHOD_NOT_FOUND = -32601;

type RpcRequest = {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, any>;
};

/** What the consent screen stores on the grant. */
export type GrantProps = { agent_key: string };

function rpcResult(id: RpcRequest["id"], result: unknown) {
  return { jsonrpc: "2.0", id: id ?? null, result };
}
function rpcError(id: RpcRequest["id"], code: number, message: string) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

async function loadAgent(db: D1Database, key: string): Promise<VoiceAgentRow | null> {
  const row = await db
    .prepare(
      `SELECT id, key, label, scope, client_id, daily_cost_ceiling_cents,
              db_binding, tenant_name, tools_allow, department
         FROM voice_agents
        WHERE key = ? AND active = 1`
    )
    .bind(key)
    .first();
  return (row as VoiceAgentRow | null) ?? null;
}

/**
 * The API handler. The OAuth provider only calls this once it has validated an
 * access token, and hands us the grant's props — so by the time we run, WHICH
 * agent this is has already been decided and cannot be forged from the request.
 */
export function createMcpApiHandler() {
  return {
    async fetch(request: Request, env: Bindings, ctx: ExecutionContext & { props?: GrantProps }) {
      const props = ctx.props;
      if (!props?.agent_key) {
        return Response.json({ error: "grant carries no agent" }, { status: 403 });
      }

      const agent = await loadAgent(env.DB, props.agent_key);
      if (!agent) {
        // The grant outlived the agent row — revoked, renamed or deactivated.
        return Response.json(
          { error: `agent "${props.agent_key}" is no longer active` },
          { status: 403 }
        );
      }

      const db = (env as unknown as Record<string, unknown>)[agent.db_binding || "DB"] as
        | D1Database
        | undefined;
      if (!db || typeof db.prepare !== "function") {
        console.error(`[mcp-oauth] ${agent.key} → missing binding "${agent.db_binding}"`);
        return Response.json({ error: "tenant database unavailable" }, { status: 503 });
      }

      // GET is the SSE leg. We never push, but a client that opens it first and
      // gets a 405 can conclude the endpoint is unusable — so answer properly.
      if (request.method === "GET") {
        const enc = new TextEncoder();
        let timer: number | undefined;
        const stream = new ReadableStream({
          start(c) {
            c.enqueue(enc.encode(": connected\n\n"));
            timer = setInterval(() => {
              try { c.enqueue(enc.encode(": keepalive\n\n")); } catch { if (timer) clearInterval(timer); }
            }, 25_000) as unknown as number;
          },
          cancel() { if (timer) clearInterval(timer); },
        });
        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-store",
            "X-Accel-Buffering": "no",
          },
        });
      }

      if (request.method !== "POST") {
        return Response.json({ error: "method not allowed" }, { status: 405 });
      }

      let body: RpcRequest | RpcRequest[];
      try {
        body = await request.json();
      } catch {
        return Response.json(rpcError(null, -32700, "Invalid JSON"), { status: 400 });
      }

      const toolCtx: ToolCtx = {
        env,
        agent,
        db,
        waitUntil: (p) => ctx.waitUntil(p.then(() => undefined)),
      };

      const requests = Array.isArray(body) ? body : [body];
      const out: unknown[] = [];

      for (const req of requests) {
        const { method, id } = req ?? {};
        if (id === undefined || id === null) {
          // notification — no response
          continue;
        }
        switch (method) {
          case "initialize":
            console.log(`[mcp-oauth] ${agent.key} initialize`);
            out.push(
              rpcResult(id, {
                protocolVersion: PROTOCOL_VERSION,
                capabilities: { tools: { listChanged: false } },
                serverInfo: SERVER_INFO,
              })
            );
            break;

          case "ping":
            out.push(rpcResult(id, {}));
            break;

          case "tools/list": {
            const listed = toolsForAgent(agent);
            console.log(`[mcp-oauth] ${agent.key} tools/list -> ${listed.length}`);
            out.push(
              rpcResult(id, {
                tools: listed.map((t) => ({
                  name: t.name,
                  description: t.description,
                  inputSchema: t.inputSchema,
                })),
              })
            );
            break;
          }

          case "tools/call": {
            const name = String(req.params?.name ?? "");
            const args = (req.params?.arguments ?? {}) as Record<string, any>;
            const tool = findToolForAgent(name, agent);
            if (!tool) {
              out.push(
                rpcResult(id, {
                  content: [{ type: "text", text: `Unknown tool: ${name}` }],
                  isError: true,
                })
              );
              break;
            }
            try {
              const result = await tool.handler(args, toolCtx);
              console.log(
                `[mcp-oauth] ${agent.key} ${name} args=${JSON.stringify(args).slice(0, 120)} OK`
              );
              out.push(
                rpcResult(id, {
                  content: [{ type: "text", text: JSON.stringify(result) }],
                  isError: false,
                })
              );
            } catch (err) {
              const msg = err instanceof Error ? err.message : String(err);
              console.error(`[mcp-oauth] ${agent.key} ${name} FAILED: ${msg}`);
              out.push(
                rpcResult(id, {
                  content: [{ type: "text", text: `Tool failed: ${msg}` }],
                  isError: true,
                })
              );
            }
            break;
          }

          default:
            out.push(rpcError(id, METHOD_NOT_FOUND, `Unknown method: ${method}`));
        }
      }

      if (out.length === 0) return new Response(null, { status: 202 });
      return Response.json(Array.isArray(body) ? out : out[0]);
    },
  };
}
