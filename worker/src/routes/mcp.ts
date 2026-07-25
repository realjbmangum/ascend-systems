// Remote MCP server for the voice agents.
//
// xAI's Voice Agent API can call remote MCP servers directly, server-to-server:
//   { "type": "mcp", "server_url": "https://ascend-api.../api/mcp",
//     "server_label": "ascend", "authorization": "Bearer <token>" }
//
// That is why this is a plain streamable-HTTP JSON-RPC endpoint and not the
// Cloudflare Agents SDK: we need exactly four methods and no session state, so
// hand-rolling it keeps the Worker's dependency list at "hono" and matches the
// style of the rest of these routes. The transport spec permits a plain
// application/json response when the server never pushes to the client, which
// this one doesn't.
//
// Auth is a bearer token per agent, hashed into voice_agents.token_hash. The
// row's scope decides which tools exist as far as that caller is concerned —
// tools/list filters, and tools/call re-checks.

import { Hono } from "hono";
import type { Bindings, Variables } from "../types";
import {
  findTool,
  toolsForScope,
  type ToolCtx,
  type ToolScope,
  type VoiceAgentRow,
} from "../lib/voice-tools";

const mcp = new Hono<{ Bindings: Bindings; Variables: Variables }>();

const PROTOCOL_VERSION = "2025-06-18";
const SERVER_INFO = { name: "ascend-voice-tools", version: "1.0.0" };

// JSON-RPC 2.0 error codes.
const PARSE_ERROR = -32700;
const INVALID_REQUEST = -32600;
const METHOD_NOT_FOUND = -32601;
const INTERNAL_ERROR = -32603;

type RpcRequest = {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, any>;
};

export async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token)
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function authenticate(
  db: D1Database,
  header: string | undefined
): Promise<VoiceAgentRow | null> {
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  if (!match) return null;
  const row = await db
    .prepare(
      `SELECT id, key, label, scope, client_id, daily_cost_ceiling_cents,
              db_binding, tenant_name
         FROM voice_agents
        WHERE token_hash = ? AND active = 1`
    )
    .bind(await hashToken(match[1]))
    .first<VoiceAgentRow>();
  return row ?? null;
}

/**
 * Resolve the agent's tenant database from its binding name.
 *
 * D1 bindings are static in wrangler.toml, so a tenant's database is reached by
 * looking its binding up on env by name — `DB_C00` for the Imperial demo, `DB`
 * for Ascend's own agents. Onboarding a tenant therefore means adding a binding
 * and redeploying, which is deliberate: a database this Worker was never granted
 * cannot be reached by guessing a token.
 */
function resolveTenantDb(env: Bindings, agent: VoiceAgentRow): D1Database | null {
  const binding = agent.db_binding || "DB";
  const db = (env as unknown as Record<string, unknown>)[binding];
  // Duck-type rather than instanceof — D1Database is an interface at runtime.
  if (!db || typeof (db as D1Database).prepare !== "function") return null;
  return db as D1Database;
}

function rpcError(id: RpcRequest["id"], code: number, message: string) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

function rpcResult(id: RpcRequest["id"], result: unknown) {
  return { jsonrpc: "2.0", id: id ?? null, result };
}

async function dispatch(
  req: RpcRequest,
  agent: VoiceAgentRow,
  ctx: ToolCtx
): Promise<unknown | null> {
  const { method, id } = req;

  // Notifications carry no id and expect no response body.
  const isNotification = id === undefined || id === null;

  switch (method) {
    case "initialize":
      return rpcResult(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
      });

    case "notifications/initialized":
    case "notifications/cancelled":
      return null;

    case "ping":
      return rpcResult(id, {});

    case "tools/list":
      return rpcResult(id, {
        tools: toolsForScope(agent.scope).map((t) => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
        })),
      });

    case "tools/call": {
      const name = String(req.params?.name ?? "");
      const args = (req.params?.arguments ?? {}) as Record<string, any>;
      const tool = findTool(name, agent.scope);
      if (!tool) {
        // Deliberately identical whether the tool doesn't exist or is out of
        // scope — a receptionist token learns nothing about the assistant's
        // toolset by guessing names.
        return rpcResult(id, {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        });
      }
      try {
        const output = await tool.handler(args, ctx);
        return rpcResult(id, {
          content: [{ type: "text", text: JSON.stringify(output) }],
          isError: false,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`MCP tool ${name} failed`, message);
        // Tool failures are reported in-band so the model can recover and
        // rephrase to the caller, rather than as a transport-level error.
        return rpcResult(id, {
          content: [{ type: "text", text: `Tool failed: ${message}` }],
          isError: true,
        });
      }
    }

    default:
      if (isNotification) return null;
      return rpcError(id, METHOD_NOT_FOUND, `Unknown method: ${method}`);
  }
}

mcp.post("/", async (c) => {
  const agent = await authenticate(c.env.DB, c.req.header("Authorization"));
  if (!agent) {
    return c.json({ error: "unauthorized" }, 401, {
      "WWW-Authenticate": "Bearer",
    });
  }

  let body: RpcRequest | RpcRequest[];
  try {
    body = await c.req.json();
  } catch {
    return c.json(rpcError(null, PARSE_ERROR, "Invalid JSON"), 400);
  }

  const tenantDb = resolveTenantDb(c.env, agent);
  if (!tenantDb) {
    // The agent row points at a binding this deploy does not have. Fail loudly
    // rather than silently falling back to ascend-db — writing a tenant's caller
    // into Ascend's CRM is worse than returning an error.
    console.error(
      `voice agent ${agent.key} references missing D1 binding "${agent.db_binding}"`
    );
    return c.json({ error: "tenant database unavailable" }, 503);
  }

  const ctx: ToolCtx = {
    env: c.env,
    agent,
    db: tenantDb,
    waitUntil: (p) => c.executionCtx.waitUntil(p.then(() => undefined)),
  };

  // Batching was dropped in the 2025-06-18 spec, but tolerate an array so an
  // older client doesn't get a confusing parse error.
  const requests = Array.isArray(body) ? body : [body];
  const responses: unknown[] = [];
  for (const req of requests) {
    if (req?.jsonrpc !== "2.0") {
      responses.push(rpcError(req?.id, INVALID_REQUEST, "jsonrpc must be '2.0'"));
      continue;
    }
    try {
      const res = await dispatch(req, agent, ctx);
      if (res !== null) responses.push(res);
    } catch (err) {
      console.error("MCP dispatch error", err);
      responses.push(rpcError(req?.id, INTERNAL_ERROR, "Internal error"));
    }
  }

  // All-notification payload: acknowledge with no content.
  if (responses.length === 0) return c.body(null, 202);
  return c.json(Array.isArray(body) ? responses : responses[0]);
});

// This server never initiates messages, so it has no SSE stream to offer.
mcp.get("/", (c) => c.json({ error: "method not allowed" }, 405));

export default mcp;
