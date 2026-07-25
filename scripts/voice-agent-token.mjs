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
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VALID_SCOPES = {
  receptionist: "Ascend's own caller-facing line. 4 tools, writes to ascend-db.",
  assistant: "Brian's own voice. All 10 tools, including pipeline and invoices.",
  client: "A tenant's line. 4 tools, writes to that tenant's own database. Requires --code.",
};

const argv = process.argv.slice(2);
const flagValue = (name) => {
  const i = argv.indexOf(name);
  return i !== -1 ? argv[i + 1] : null;
};
const code = flagValue("--code");
const department = flagValue("--department");
const toolsCsv = flagValue("--tools");
const FLAGS = ["--code", "--department", "--tools"];
const skip = new Set();
FLAGS.forEach((f) => {
  const i = argv.indexOf(f);
  if (i !== -1) { skip.add(i); skip.add(i + 1); }
});
const positional = argv.filter((_, i) => !skip.has(i));
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

// An allow-list can only ever NARROW what the scope already grants.
const toolsAllow = toolsCsv
  ? JSON.stringify(toolsCsv.split(",").map((t) => t.trim()).filter(Boolean))
  : null;

// Ascend's own agents use the main database; a tenant uses its own binding.
const agentKey =
  scope === "client" ? (department ? `${code}-${department}` : code) : scope;
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
  `INSERT INTO voice_agents (key, label, scope, token_hash, daily_cost_ceiling_cents, active, db_binding, tenant_name, department, tools_allow) ` +
  `VALUES ('${agentKey}', '${esc(label)}', '${scope}', '${hash}', ${ceiling}, 1, '${dbBinding}', '${esc(label)}', ` +
  `${department ? `'${esc(department)}'` : "NULL"}, ${toolsAllow ? `'${esc(toolsAllow)}'` : "NULL"}) ` +
  `ON CONFLICT(key) DO UPDATE SET token_hash = excluded.token_hash, label = excluded.label, ` +
  `scope = excluded.scope, db_binding = excluded.db_binding, tenant_name = excluded.tenant_name, ` +
  `department = excluded.department, tools_allow = excluded.tools_allow, ` +
  `updated_at = datetime('now');`;


const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORKER = path.join(ROOT, "worker");
const BASE = "https://ascend-api.bmangum1.workers.dev/api/mcp";
const url = `${BASE}/t/${token}`;

// Register the HASH (never the token) against both databases. Doing this here
// rather than printing SQL for a human to copy removes the step that silently
// fails and then shows up as "the console is asking me for OAuth".
function register(target) {
  try {
    execFileSync(
      "npx",
      ["wrangler", "d1", "execute", "ascend-db", `--${target}`, "--command", sql],
      { cwd: WORKER, stdio: "pipe", maxBuffer: 10 * 1024 * 1024 }
    );
    return { ok: true };
  } catch (err) {
    const out = `${err.stdout ?? ""}${err.stderr ?? ""}`;
    return { ok: false, msg: out.split("\n").filter((l) => /error/i.test(l))[0] ?? err.message };
  }
}

console.log(`
┌─ TOKEN (shown once — copy it now) ────────────────────────────────────────────

  ${token}

└───────────────────────────────────────────────────────────────────────────────

  agent      ${agentKey}
  scope      ${scope}
  database   ${dbBinding}
  ceiling    ${ceiling === 0 ? "none" : `$${(ceiling / 100).toFixed(2)}/day`}
`);

process.stdout.write("Registering in D1 (remote) ... ");
const remote = register("remote");
console.log(remote.ok ? "done" : `FAILED\n  ${remote.msg}`);

process.stdout.write("Registering in D1 (local)  ... ");
const local = register("local");
console.log(local.ok ? "done" : `skipped (${local.msg})`);

if (!remote.ok) {
  console.log(`
The remote write failed, so the token is NOT live. Run this yourself from worker/:

npx wrangler d1 execute ascend-db --remote --command "${sql.replace(/"/g, '\\"')}"
`);
  process.exit(1);
}

// Verify against the live endpoint. D1 takes a few seconds to reach the Worker.
process.stdout.write("Verifying against production ");
let verified = null;
for (let i = 0; i < 10; i++) {
  process.stdout.write(".");
  await new Promise((r) => setTimeout(r, 2000));
  try {
    const res = await fetch(`${url}/check`);
    const body = await res.json();
    if (body.ok) { verified = body; break; }
  } catch { /* keep trying */ }
}
console.log("");

if (!verified) {
  console.log(`
Registered, but production did not confirm it within 20 seconds. Check by hand:

  ${url}/check
`);
  process.exit(1);
}

console.log(`
✓ LIVE — ${verified.tenant} · ${verified.tools.length} tools · writes to ${verified.database}
  ${verified.tools.join(", ")}

┌─ PASTE THIS INTO THE xAI CONSOLE ─────────────────────────────────────────────

  Tools → Add remote MCP server

  Server URL   ${url}
  Label        ascend
  Auth         LEAVE EVERY OAUTH FIELD BLANK

└───────────────────────────────────────────────────────────────────────────────

The token is in the URL because the console has no bearer-token field. If it
still shows an OAuth form, you pasted ${BASE} instead of the full URL above.

Rotating: re-run this command. The old token stops working immediately.
`);
