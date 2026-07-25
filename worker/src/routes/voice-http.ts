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
import { toolsForAgent, findToolForAgent, type ToolCtx, type VoiceAgentRow } from "../lib/voice-tools";
import { hashToken } from "./mcp";
import { checkVoiceHealth } from "../lib/voice-health";

const voiceHttp = new Hono<{ Bindings: Bindings; Variables: Variables }>();

async function resolve(
  c: any,
  token: string
): Promise<{ agent: VoiceAgentRow; db: D1Database } | Response> {
  const db0 = c.env.DB as D1Database;
  const agent = (await db0
    .prepare(
      `SELECT id, key, label, scope, client_id, daily_cost_ceiling_cents,
              db_binding, tenant_name, tools_allow, department
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
    endpoints: toolsForAgent(got.agent).map((t) => ({
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
  const tool = findToolForAgent(name, agent);
  if (!tool) {
    return c.json(
      { error: `Unknown tool: ${name}`, available: toolsForAgent(agent).map((t) => t.name) },
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
    // Log the ARGUMENTS as well as the result. Seeing only the result hid a
    // cross-customer leak for a whole call: we could see WO-4471 come back but
    // not that it had been asked for by status alone.
    console.log(
      `[voice-http] ${agent.key} ${name} args=${JSON.stringify(args).slice(0, 140)} -> ${JSON.stringify(output).slice(0, 140)}`
    );
    return c.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[voice-http] ${agent.key} ${name} args=${JSON.stringify(args).slice(0, 140)} FAILED: ${message}`
    );
    // 200 with an error field, not a 4xx — a voice agent recovers far better
    // from a readable message than from an HTTP failure it cannot interpret.
    return c.json({ error: message, hint: "Fix the arguments and try again." });
  }
});

/**
 * Health check on demand — same logic the hourly cron runs, but returns the
 * issues instead of emailing them. Token-gated like the tools so it can be
 * curled during an incident without a session cookie.
 */
voiceHttp.get("/t/:token/health", async (c) => {
  // Authenticate the TOKEN only — deliberately not resolve(), which also
  // requires the caller's own tenant database. A diagnostic that fails whenever
  // the thing it diagnoses is broken is useless exactly when you need it.
  const db0 = c.env.DB as D1Database;
  const agent = await db0
    .prepare(`SELECT key FROM voice_agents WHERE token_hash = ? AND active = 1`)
    .bind(await hashToken(c.req.param("token")))
    .first();
  if (!agent) return c.json({ error: "unauthorized" }, 401);

  const issues = await checkVoiceHealth(c.env);
  return c.json({
    checked_at: new Date().toISOString(),
    healthy: issues.length === 0,
    issue_count: issues.length,
    issues,
  });
});

/**
 * PUBLIC read-only demo feed — no token, no auth.
 *
 * Safe to expose because it is hardcoded to the DEMO tenant binding and can
 * never reach a real client's database, whatever anyone puts in the URL. Every
 * name in it is a fictional character; nothing here belongs to a person.
 *
 * Exists so a prospect can watch rows appear on a screen while Brian calls the
 * number in front of them. That moment — hearing the call, then seeing what it
 * wrote — is the entire pitch, and it cannot happen behind a login.
 */
voiceHttp.get("/demo", async (c) => {
  const db = (c.env as unknown as Record<string, unknown>).DB_C00 as D1Database | undefined;
  if (!db || typeof db.prepare !== "function") {
    return c.json({ error: "demo tenant unavailable" }, 503);
  }

  const [leads, customers, workOrders, activities, daily, statuses, totals] = await Promise.all([
    db
      .prepare(
        `SELECT id, name, phone, company, message, status, created_at
           FROM leads ORDER BY id DESC LIMIT 12`
      )
      .all(),
    db
      .prepare(
        `SELECT id, name, phone, account_ref, site_name, service_plan
           FROM customers ORDER BY id LIMIT 12`
      )
      .all(),
    db
      .prepare(
        `SELECT w.reference, w.summary, w.status, w.priority, w.technician,
                w.scheduled_for, c.name AS customer
           FROM work_orders w LEFT JOIN customers c ON c.id = w.customer_id
          ORDER BY w.id DESC LIMIT 12`
      )
      .all(),
    db
      .prepare(
        `SELECT a.id, a.type, a.subject, a.duration_minutes, a.due_at, a.created_at,
                l.name AS lead
           FROM lead_activities a LEFT JOIN leads l ON l.id = a.lead_id
          ORDER BY a.id DESC LIMIT 12`
      )
      .all(),
    // Seven-day activity, zero-filled below so quiet days render as gaps rather
    // than vanishing and compressing the axis.
    db
      .prepare(
        `SELECT date(created_at) AS day, COUNT(*) AS n
           FROM leads WHERE created_at >= date('now','-6 day')
          GROUP BY day`
      )
      .all(),
    db
      .prepare(
        `SELECT status, COUNT(*) AS n FROM work_orders GROUP BY status`
      )
      .all(),
    db
      .prepare(
        `SELECT
           (SELECT COUNT(*) FROM leads WHERE created_at >= date('now','-6 day')) AS leads_7d,
           (SELECT COUNT(*) FROM lead_activities WHERE type='meeting') AS bookings,
           (SELECT COUNT(*) FROM work_orders WHERE status IN ('scheduled','dispatched')) AS open_jobs,
           (SELECT COUNT(*) FROM customers) AS customers,
           (SELECT COALESCE(SUM(duration_minutes),0) FROM lead_activities WHERE type='call') AS call_minutes`
      )
      .first(),
  ]);

  // Zero-fill the last 7 days in business-local terms.
  const byDay = new Map(
    (daily.results as Array<{ day: string; n: number }>).map((r) => [r.day, r.n])
  );
  const bookingsByDay = new Map(
    (activities.results as Array<{ type: string; created_at: string }>)
      .filter((a) => a.type === "meeting")
      .reduce((m, a) => {
        const d = String(a.created_at).slice(0, 10);
        m.set(d, (m.get(d) ?? 0) + 1);
        return m;
      }, new Map<string, number>())
  );
  const series: Array<{ day: string; label: string; leads: number; bookings: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000);
    const key = d.toISOString().slice(0, 10);
    series.push({
      day: key,
      label: new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" }).format(d),
      leads: byDay.get(key) ?? 0,
      bookings: bookingsByDay.get(key) ?? 0,
    });
  }

  return c.json(
    {
      tenant: "Imperial Climate Control",
      metrics: totals,
      series,
      statuses: statuses.results,
      note: "Demonstration data. Every name is fictional and no service is dispatched.",
      leads: leads.results,
      customers: customers.results,
      work_orders: workOrders.results,
      activities: activities.results,
    },
    200,
    { "Cache-Control": "no-store" }
  );
});

export default voiceHttp;
