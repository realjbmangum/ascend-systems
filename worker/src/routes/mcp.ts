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
  toolsForAgent,
  findToolForAgent,
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

/**
 * Look up an agent by raw token.
 *
 * The token arrives one of two ways:
 *
 *   1. `Authorization: Bearer <token>` — correct, and what curl and any client
 *      that lets you set a header should use.
 *   2. In the URL path, `/api/mcp/t/<token>` — because the xAI console has no
 *      field for a bearer token when adding a remote MCP server. It offers only
 *      OAuth client credentials, so a header-authenticated server simply cannot
 *      be configured there.
 *
 * Path tokens are a real trade-off: the secret ends up in xAI's stored config
 * and in any request log that records full paths. It is mitigated by HTTPS (the
 * path is inside the encrypted body, not the TLS handshake), by per-tenant
 * scoping — a leaked c00 token reaches c00's four tools and nothing else — and
 * by one-command rotation. Never log the path of this route.
 *
 * The proper fix is an OAuth 2.1 + PKCE shim so the console's own form works.
 * See docs/voice-tenant-onboarding.md.
 */
async function lookupAgent(
  db: D1Database,
  rawToken: string | undefined
): Promise<VoiceAgentRow | null> {
  if (!rawToken) return null;
  const row = await db
    .prepare(
      `SELECT id, key, label, scope, client_id, daily_cost_ceiling_cents,
              db_binding, tenant_name, tools_allow, department
         FROM voice_agents
        WHERE token_hash = ? AND active = 1`
    )
    .bind(await hashToken(rawToken))
    .first<VoiceAgentRow>();
  return row ?? null;
}

function tokenFromHeader(header: string | undefined): string | undefined {
  if (!header) return undefined;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match ? match[1] : undefined;
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
  ctx: ToolCtx,
  sessionSeen?: string,
  protoSeen: string = "-"
): Promise<unknown | null> {
  const { method, id } = req;

  // Notifications carry no id and expect no response body.
  const isNotification = id === undefined || id === null;

  switch (method) {
    case "initialize":
      console.log(`[mcp] ${agent.key} initialize (client-session=${sessionSeen ?? "none"} proto=${protoSeen})`);
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

    case "tools/list": {
      const listed = toolsForAgent(agent);
      console.log(`[mcp] ${agent.key} tools/list -> ${listed.length} tools`);
      return rpcResult(id, {
        tools: listed.map((t) => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
        })),
      });
    }

    case "tools/call": {
      const name = String(req.params?.name ?? "");
      const args = (req.params?.arguments ?? {}) as Record<string, any>;
      const tool = findToolForAgent(name, agent);
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
        // Log successes too. Without this there is no way to tell a working
        // agent from one that connects, handshakes, and never calls anything —
        // which is the silent failure that loses leads without anyone noticing.
        console.log(
          `[mcp] ${agent.key} tools/call ${name} OK -> ${JSON.stringify(output).slice(0, 160)}`
        );
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

async function handleRpc(c: any, rawToken: string | undefined) {
  // Temporary diagnostic: what does the client actually send us? Specifically,
  // does it echo an Mcp-Session-Id back after initialize?
  const seenSession = c.req.header("Mcp-Session-Id") ?? c.req.header("mcp-session-id");
  const proto = c.req.header("MCP-Protocol-Version") ?? "-";
  const agent = await lookupAgent(c.env.DB, rawToken);
  if (!agent) {
    // Deliberately NO `WWW-Authenticate: Bearer` header. Under the MCP
    // authorization spec that is an OAuth challenge — xAI's console probes the
    // endpoint, sees it, and switches to demanding OAuth client credentials we
    // do not have. A bare 401 keeps the console on the simple path.
    return c.json({ error: "unauthorized" }, 401);
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
      const res = await dispatch(req, agent, ctx, seenSession, proto);
      if (res !== null) responses.push(res);
    } catch (err) {
      console.error("MCP dispatch error", err);
      responses.push(rpcError(req?.id, INTERNAL_ERROR, "Internal error"));
    }
  }

  // Streamable HTTP: the server MAY assign a session id at initialize, and a
  // client that expects one will otherwise re-initialize forever rather than
  // ever calling a tool. We are stateless, so the id is a correlation handle —
  // any value the client returns is accepted.
  const sessionId = seenSession ?? `s_${agent.key}_${crypto.randomUUID()}`;
  const headers = { "Mcp-Session-Id": sessionId };

  // All-notification payload: acknowledge with no content.
  if (responses.length === 0) return c.body(null, 202, headers);
  return c.json(Array.isArray(body) ? responses : responses[0], 200, headers);
}

// Header auth — correct, and what curl and any header-capable client should use.
mcp.post("/", (c) => handleRpc(c, tokenFromHeader(c.req.header("Authorization"))));

// Path auth — for the xAI console, which offers no bearer-token field.
// The header still wins if both are somehow present.
mcp.post("/t/:token", (c) =>
  handleRpc(c, tokenFromHeader(c.req.header("Authorization")) ?? c.req.param("token"))
);

/**
 * GET = the SSE leg of streamable HTTP.
 *
 * We never push server-initiated messages, and the spec allows answering 405.
 * But xAI documents support for "Streaming HTTP and SSE transports" only, and a
 * client that opens this stream first and gets 405 can reasonably conclude the
 * endpoint is unusable — or that it must be an auth problem, which is how a
 * console with only an OAuth form ends up showing you an OAuth form.
 *
 * So: authenticate, then open a real, valid, empty SSE stream. A keepalive
 * comment every 25 seconds holds it open without ever sending an MCP message.
 */
async function handleSse(c: any, rawToken: string | undefined) {
  const agent = await lookupAgent(c.env.DB, rawToken);
  if (!agent) return c.json({ error: "unauthorized" }, 401);

  const encoder = new TextEncoder();
  let timer: number | undefined;
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(": connected\n\n"));
      timer = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keepalive\n\n"));
        } catch {
          if (timer) clearInterval(timer);
        }
      }, 25_000) as unknown as number;
    },
    cancel() {
      if (timer) clearInterval(timer);
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-store",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

mcp.get("/", (c) => handleSse(c, tokenFromHeader(c.req.header("Authorization"))));

/**
 * Wrong-base-URL guard.
 *
 * The plain-HTTP tools live at /api/voice/t/<token>/<tool>, not under /api/mcp.
 * Configuring an API-request tool with the MCP base URL previously fell through
 * to the admin auth gate and returned a bare 401, which a voice agent swallows
 * silently — the call sounds fine and nothing is ever written. Say what is wrong
 * and where to go instead.
 */
mcp.all("/t/:token/:tool", (c) => {
  const correct = `${new URL(c.req.url).origin}/api/voice/t/${c.req.param("token")}/${c.req.param("tool")}`;
  console.error(`[mcp] wrong base URL for tool "${c.req.param("tool")}" — should be /api/voice`);
  return c.json(
    {
      error: "Wrong base URL for a tool call.",
      you_used: "/api/mcp/t/<token>/<tool>",
      use_instead: correct,
      note: "/api/mcp is the MCP JSON-RPC endpoint. Individual tools are under /api/voice.",
    },
    404
  );
});

/**
 * Diagnostic — paste `<your server URL>/check` into a browser.
 *
 * Answers the only question that matters when the console is misbehaving: is
 * this exact URL a working, authenticated MCP endpoint? Returns the agent and
 * its tool count, never the token, and never any caller data.
 */
mcp.get("/t/:token/check", async (c) => {
  const agent = await lookupAgent(c.env.DB, c.req.param("token"));
  if (!agent) {
    return c.json(
      {
        ok: false,
        problem: "That token is not registered, or the agent row is inactive.",
        fix: "Re-run scripts/voice-agent-token.mjs and make sure you ran the STEP 1 SQL against ascend-db.",
      },
      401
    );
  }
  const db = resolveTenantDb(c.env, agent);
  if (!db) {
    return c.json(
      {
        ok: false,
        agent: agent.key,
        problem: `Agent points at D1 binding "${agent.db_binding}", which this deploy does not have.`,
        fix: "Add the binding to wrangler.toml and redeploy.",
      },
      503
    );
  }
  return c.json({
    ok: true,
    agent: agent.key,
    tenant: agent.tenant_name,
    scope: agent.scope,
    database: agent.db_binding,
    tools: toolsForAgent(agent).map((t) => t.name),
    next: "This URL works. In the xAI console paste the same URL WITHOUT /check, and leave every OAuth field blank.",
  });
});

mcp.get("/t/:token", (c) =>
  handleSse(c, tokenFromHeader(c.req.header("Authorization")) ?? c.req.param("token"))
);

export default mcp;
