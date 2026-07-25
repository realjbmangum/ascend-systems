// Plain HTTP endpoints for the voice tools.
//
// WHY THIS EXISTS ALONGSIDE /api/mcp
//   xAI does not hand an agent its MCP tools directly. They sit behind a
//   `search_connected_tools` meta-tool, so the agent has to FIND a tool before
//   it can call one — and in practice it repeatedly failed to find most of
//   them, telling callers "I'm having trouble locating the create_lead tool".
//
//   The console's native "API request" tool type has no such indirection: it
//   attaches straight to the agent next to end_call and web_search, and is
//   always present. So every tool is also reachable as one POST.
//
//   Same handlers, same auth, same tenant routing as the MCP path — this is a
//   second door onto the identical logic, not a fork of it. If xAI's tool search
//   improves, /api/mcp still works and nothing here needs unwinding.
//
// URL SHAPE
//   POST /api/voice/t/<token>/<tool_name>
//   body: the tool's arguments as flat JSON, e.g. {"name":"Wedge Antilles"}
//
// The token is in the path for the same reason as the MCP route: the console
// offers no field for a bearer token. See routes/mcp.ts for the trade-off.

import { Hono } from "hono";
import type { Bindings, Variables } from "../types";
import { findTool, toolsForScope, type ToolCtx, type VoiceAgentRow } from "../lib/voice-tools";
import { hashToken } from "./mcp";

const voiceHttp = new Hono<{ Bindings: Bindings; Variables: Variables }>();

async function resolve(
  c: any,
  token: string
): Promise<{ agent: VoiceAgentRow; db: D1Database } | Response> {
  const db0 = c.env.DB as D1Database;
  const agent = (await db0
    .prepare(
      `SELECT id, key, label, scope, client_id, daily_cost_ceiling_cents,
              db_binding, tenant_name
         FROM voice_agents
        WHERE token_hash = ? AND active = 1`
    )
    .bind(await hashToken(token))
    .first()) as VoiceAgentRow | null;
  if (!agent) return c.json({ error: "unauthorized" }, 401);

  const binding = agent.db_binding || "DB";
  const db = (c.env as Record<string, unknown>)[binding] as D1Database | undefined;
  if (!db || typeof db.prepare !== "function") {
    console.error(`voice-http: agent ${agent.key} references missing binding "${binding}"`);
    return c.json({ error: "tenant database unavailable" }, 503);
  }
  return { agent, db };
}

/** Human-readable index — paste this URL in a browser to see every endpoint. */
voiceHttp.get("/t/:token", async (c) => {
  const got = await resolve(c, c.req.param("token"));
  if (got instanceof Response) return got;
  const base = new URL(c.req.url).origin + `/api/voice/t/${c.req.param("token")}`;
  return c.json({
    ok: true,
    agent: got.agent.key,
    tenant: got.agent.tenant_name,
    how_to_use:
      "In the xAI console add an 'API request' tool for each endpoint below. Method POST, JSON body of the listed arguments.",
    endpoints: toolsForScope(got.agent.scope).map((t) => ({
      tool: t.name,
      method: "POST",
      url: `${base}/${t.name}`,
      description: t.description,
      arguments: Object.fromEntries(
        Object.entries(t.inputSchema.properties).map(([k, v]) => [
          k,
          (v as { description?: string }).description ?? "",
        ])
      ),
      required: t.inputSchema.required ?? [],
    })),
  });
});

voiceHttp.post("/t/:token/:tool", async (c) => {
  const got = await resolve(c, c.req.param("token"));
  if (got instanceof Response) return got;
  const { agent, db } = got;

  const name = c.req.param("tool");
  const tool = findTool(name, agent.scope);
  if (!tool) {
    return c.json(
      { error: `Unknown tool: ${name}`, available: toolsForScope(agent.scope).map((t) => t.name) },
      404
    );
  }

  let args: Record<string, any> = {};
  try {
    const raw = await c.req.text();
    if (raw.trim()) args = JSON.parse(raw);
  } catch {
    return c.json({ error: "body must be JSON" }, 400);
  }

  const ctx: ToolCtx = {
    env: c.env,
    agent,
    db,
    waitUntil: (p) => c.executionCtx.waitUntil(p.then(() => undefined)),
  };

  try {
    const output = await tool.handler(args, ctx);
    console.log(
      `[voice-http] ${agent.key} ${name} OK -> ${JSON.stringify(output).slice(0, 160)}`
    );
    return c.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[voice-http] ${agent.key} ${name} FAILED: ${message}`);
    // 200 with an error field, not a 4xx — a voice agent recovers far better
    // from a readable message than from an HTTP failure it cannot interpret.
    return c.json({ error: message, hint: "Fix the arguments and try again." });
  }
});

export default voiceHttp;
