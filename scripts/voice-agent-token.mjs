#!/usr/bin/env node
// =============================================================================
// voice-agent-token.mjs — mint a bearer token for a voice agent.
//
// The token is printed ONCE, here, and never stored. What goes into D1 is its
// SHA-256 hash, which is what worker/src/routes/mcp.ts matches against. So a
// database dump does not yield a working credential.
//
// Usage:
//   node scripts/voice-agent-token.mjs receptionist "Ascend Receptionist"
//   node scripts/voice-agent-token.mjs assistant    "Brian Assistant"
//
// Then:
//   1. Paste the printed SQL into:
//        cd worker && npx wrangler d1 execute ascend-db --remote --command "<SQL>"
//   2. Paste the printed TOKEN into the xAI Voice Agent Builder console:
//        Tools → Add MCP server → Authorization: Bearer <TOKEN>
//   3. Close this terminal. The token is not recoverable — re-run to rotate.
// =============================================================================

import { randomBytes, createHash } from "node:crypto";

const VALID_SCOPES = {
  receptionist: "Caller-facing. 4 tools: create_lead, log_call_activity, check_availability, book_meeting.",
  assistant: "Brian's own voice. All 10 tools, including pipeline and invoices.",
};

const key = process.argv[2];
const label = process.argv[3];

if (!key || !VALID_SCOPES[key]) {
  console.error(
    `\nUsage: node scripts/voice-agent-token.mjs <${Object.keys(VALID_SCOPES).join("|")}> "<label>"\n\n` +
      Object.entries(VALID_SCOPES)
        .map(([k, d]) => `  ${k.padEnd(14)} ${d}`)
        .join("\n") +
      "\n"
  );
  process.exit(1);
}
if (!label) {
  console.error("\nA label is required — it shows up in /admin/calls.\n");
  process.exit(1);
}

// 32 bytes of CSPRNG, base64url. Prefixed so it is recognisable in a console
// field and greppable if it ever leaks.
const token = `ascend_voice_${randomBytes(32).toString("base64url")}`;
const hash = createHash("sha256").update(token).digest("hex");

// Receptionist gets a spend ceiling; the assistant is Brian talking to himself.
const ceiling = key === "receptionist" ? 500 : 0;

const sql =
  `INSERT INTO voice_agents (key, label, scope, token_hash, daily_cost_ceiling_cents, active) ` +
  `VALUES ('${key}', '${label.replace(/'/g, "''")}', '${key}', '${hash}', ${ceiling}, 1) ` +
  `ON CONFLICT(key) DO UPDATE SET token_hash = excluded.token_hash, label = excluded.label, ` +
  `updated_at = datetime('now');`;

console.log(`
┌─ TOKEN (shown once — copy it now) ────────────────────────────────────────────

  ${token}

└───────────────────────────────────────────────────────────────────────────────

Scope: ${key} — ${VALID_SCOPES[key]}
Daily spend ceiling: ${ceiling === 0 ? "none" : `$${(ceiling / 100).toFixed(2)}`}

STEP 1 — register the hash in D1 (run from worker/):

npx wrangler d1 execute ascend-db --remote --command "${sql.replace(/"/g, '\\"')}"

STEP 2 — paste the token into the xAI Voice Agent Builder console:

  Tools → Add remote MCP server
    Server URL:     https://ascend-api.bmangum1.workers.dev/api/mcp
    Server label:   ascend
    Authorization:  Bearer ${token}

STEP 3 — verify it from your machine before trusting the console:

curl -s -X POST https://ascend-api.bmangum1.workers.dev/api/mcp \\
  -H "Authorization: Bearer ${token}" \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

Expected: ${key === "receptionist" ? "4" : "10"} tools. Anything else means the hash did not land.

Rotating: re-run this command. The ON CONFLICT clause replaces the old hash, so
the previous token stops working the moment step 1 runs.
`);
