// Voice platform health checks — run from the 15-minute cron.
//
// THE FAILURE THIS EXISTS FOR
//   A voice agent that has lost its tool connection keeps answering the phone.
//   It talks, it sounds completely normal, the caller hangs up satisfied — and
//   nothing is written. Nobody reports it, because from the caller's side
//   nothing went wrong. You find out when a client asks why last week was quiet.
//
//   We hit exactly this during the c00 build: an API-request tool pointed at the
//   wrong base URL returned a bare 401, the agent swallowed it, and a
//   perfect-sounding call captured nothing. It was invisible until someone
//   queried the database by hand.
//
//   With one demo tenant that is an annoyance. With ten paying clients it is a
//   week of lost leads and a very bad phone call.

import type { Bindings } from "../types";

export type VoiceIssue = {
  agent: string;
  tenant: string | null;
  severity: "critical" | "warning";
  problem: string;
  detail: string;
};

type AgentRow = {
  key: string;
  label: string;
  tenant_name: string | null;
  db_binding: string;
  scope: string;
};

/** Quiet hours and weekends are not evidence of a fault. */
function isBusinessHoursNow(): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const day = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0") % 24;
  if (day === "Sat" || day === "Sun") return false;
  return hour >= 9 && hour < 17;
}

/**
 * Look for tenants that USED to capture leads and have suddenly stopped.
 *
 * Deliberately conservative. A brand-new tenant with no history is not alerted
 * on, and neither is a genuinely quiet business — the signal is a tenant with a
 * recent baseline that has gone silent. A noisy check gets muted, and a muted
 * check is worse than none.
 */
export async function checkVoiceHealth(env: Bindings): Promise<VoiceIssue[]> {
  const issues: VoiceIssue[] = [];

  const { results: agents } = await env.DB.prepare(
    `SELECT key, label, tenant_name, db_binding, scope
       FROM voice_agents
      WHERE active = 1 AND scope IN ('client','receptionist')`
  ).all<AgentRow>();

  for (const agent of agents) {
    const db = (env as unknown as Record<string, unknown>)[agent.db_binding] as
      | D1Database
      | undefined;

    // A binding that no longer exists means every call for this tenant is
    // currently failing. That is critical regardless of the hour.
    if (!db || typeof db.prepare !== "function") {
      issues.push({
        agent: agent.key,
        tenant: agent.tenant_name,
        severity: "critical",
        problem: "Database binding missing",
        detail: `Agent points at "${agent.db_binding}", which this deploy does not have. Every tool call is returning 503.`,
      });
      continue;
    }

    let row: { last_30d: number; last_24h: number; last_at: string | null } | null = null;
    try {
      row = await db
        .prepare(
          `SELECT
             (SELECT COUNT(*) FROM leads WHERE created_at >= datetime('now','-30 day')) AS last_30d,
             (SELECT COUNT(*) FROM leads WHERE created_at >= datetime('now','-24 hour')) AS last_24h,
             (SELECT MAX(created_at) FROM leads) AS last_at`
        )
        .first();
    } catch (err) {
      issues.push({
        agent: agent.key,
        tenant: agent.tenant_name,
        severity: "critical",
        problem: "Tenant database unreadable",
        detail: err instanceof Error ? err.message : String(err),
      });
      continue;
    }
    if (!row) continue;

    // Needs an established baseline before silence means anything. Under ~8
    // leads a month, a quiet day is just a quiet day.
    const hasBaseline = row.last_30d >= 8;
    if (hasBaseline && row.last_24h === 0 && isBusinessHoursNow()) {
      issues.push({
        agent: agent.key,
        tenant: agent.tenant_name,
        severity: "critical",
        problem: "No leads captured in 24 hours",
        detail:
          `This tenant averaged ${(row.last_30d / 30).toFixed(1)} leads/day over the last 30 days ` +
          `and has captured none since ${row.last_at ?? "never"}. The agent may be answering ` +
          `calls and silently failing to write. Check the tool URLs and the xAI credit balance.`,
      });
    }
  }

  return issues;
}

/** Plain-text alert body. Kept short — it is read on a phone. */
export function formatVoiceAlert(issues: VoiceIssue[]): string {
  const lines = [
    `${issues.length} voice issue${issues.length === 1 ? "" : "s"} need attention.`,
    "",
  ];
  for (const i of issues) {
    lines.push(
      `[${i.severity.toUpperCase()}] ${i.tenant ?? i.agent} — ${i.problem}`,
      `   ${i.detail}`,
      ""
    );
  }
  lines.push(
    "Triage: one tenant affected = that tenant's config (credit balance, tool URLs,",
    "forwarding). All tenants = the Worker or xAI. See docs/voice-tenant-onboarding.md."
  );
  return lines.join("\n");
}
