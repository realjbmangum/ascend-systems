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
  receptionist: "Ascend's own caller-facing line. 4 tools, writes to ascend-db.",
  assistant: "Brian's own voice. All 10 tools, including pipeline and invoices.",
  client: "A tenant's line. 4 tools, writes to that tenant's own database. Requires --code.",
};

const argv = process.argv.slice(2);
const codeFlag = argv.indexOf("--code");
const code = codeFlag !== -1 ? argv[codeFlag + 1] : null;
const positional = argv.filter((a, i) => a !== "--code" && i !== codeFlag + 1);
const scope = positional[0];
const label = positional[1];

function usage(msg) {
  console.error(
    `\n${msg}\n\n` +
      `Usage:\n` +
      `  node scripts/voice-agent-token.mjs receptionist "Ascend Receptionist"\n` +
      `  node scripts/voice-agent-token.mjs assistant    "Ascend Personal Assistant"\n` +
      `  node scripts/voice-agent-token.mjs client       "Imperial Climate Control" --code c00\n\n` +
      Object.entries(VALID_SCOPES)
        .map(([k, d]) => `  ${k.padEnd(14)} ${d}`)
        .join("\n") +
      "\n"
  );
  process.exit(1);
}

if (!scope || !VALID_SCOPES[scope]) usage("Unknown or missing scope.");
if (!label) usage("A label is required — it shows up in the asset register.");
if (scope === "client" && !/^c\d{2}$/.test(code ?? "")) {
  usage("A client agent needs --code cNN (e.g. --code c00) so it routes to the right database.");
}
if (scope !== "client" && code) usage("--code only applies to a client agent.");

// Ascend's own agents use the main database; a tenant uses its own binding.
const agentKey = scope === "client" ? code : scope;
const dbBinding = scope === "client" ? `DB_${code.toUpperCase()}` : "DB";

// 32 bytes of CSPRNG, base64url. Prefixed so it is recognisable in a console
// field and greppable if it ever leaks.
const token = `ascend_voice_${randomBytes(32).toString("base64url")}`;
const hash = createHash("sha256").update(token).digest("hex");

// Caller-facing lines get a spend ceiling; the assistant is Brian talking to
// himself and needs no cap.
const ceiling = scope === "assistant" ? 0 : 500;
const esc = (s) => String(s).replace(/'/g, "''");

const sql =
  `INSERT INTO voice_agents (key, label, scope, token_hash, daily_cost_ceiling_cents, active, db_binding, tenant_name) ` +
  `VALUES ('${agentKey}', '${esc(label)}', '${scope}', '${hash}', ${ceiling}, 1, '${dbBinding}', '${esc(label)}') ` +
  `ON CONFLICT(key) DO UPDATE SET token_hash = excluded.token_hash, label = excluded.label, ` +
  `scope = excluded.scope, db_binding = excluded.db_binding, tenant_name = excluded.tenant_name, ` +
  `updated_at = datetime('now');`;

console.log(`
┌─ TOKEN (shown once — copy it now) ────────────────────────────────────────────

  ${token}

└───────────────────────────────────────────────────────────────────────────────

Scope: ${agentKey} — ${VALID_SCOPES[scope]}
Daily spend ceiling: ${ceiling === 0 ? "none" : `$${(ceiling / 100).toFixed(2)}`}

STEP 1 — register the hash in D1 (run from worker/):

npx wrangler d1 execute ascend-db --remote --command "${sql.replace(/"/g, '\\"')}"

STEP 2 — add the MCP server in the xAI console.

  The console has NO field for a bearer token — it only offers OAuth client
  credentials. So the token goes in the URL instead. Paste this as the Server
  URL and leave every auth field blank:

  https://ascend-api.bmangum1.workers.dev/api/mcp/t/${token}

    Server label:  ascend
    Auth:          leave empty — do NOT fill in the OAuth form

  If the console still asks for OAuth, you used the plain /api/mcp URL. The
  /t/<token> form is what stops it probing for OAuth.

STEP 3 — verify it from your machine before trusting the console:

curl -s -X POST https://ascend-api.bmangum1.workers.dev/api/mcp \\
  -H "Authorization: Bearer ${token}" \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

Expected: ${scope === "assistant" ? "10" : "4"} tools. Anything else means the hash did not land.

Rotating: re-run this command. The ON CONFLICT clause replaces the old hash, so
the previous token stops working the moment step 1 runs.
`);
