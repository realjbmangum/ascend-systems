// The OAuth consent screen for the MCP server.
//
// This is the whole reason the OAuth path is nicer than a token in a URL: the
// human approving the connection is also the person who knows WHICH agent it is
// for. So the consent screen is an agent picker, and the choice rides along on
// the grant as `props`. One MCP URL serves every tenant and every department.
//
// Access control: only ADMIN_EMAILS may approve, proven by the existing
// ascend_session cookie. An unauthenticated visitor is sent to the admin login
// rather than shown a list of client names.

import type { Bindings } from "../types";

type AgentOption = {
  key: string;
  label: string;
  tenant_name: string | null;
  department: string | null;
  scope: string;
  tools_allow: string | null;
};

function esc(s: string): string {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

/** Is the browser carrying a valid ADMIN session? */
async function currentAdmin(request: Request, env: Bindings): Promise<string | null> {
  const cookie = request.headers.get("Cookie") ?? "";
  const match = /ascend_session=([^;]+)/.exec(cookie);
  if (!match) return null;
  const row = await env.DB.prepare(
    `SELECT email, role FROM sessions WHERE session_token = ? AND expires_at > datetime('now')`
  )
    .bind(match[1])
    .first<{ email: string; role: string }>();
  if (!row || row.role !== "admin") return null;
  return row.email;
}

const PAGE_CSS = `
  :root{color-scheme:light dark}
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:28px;
    background:#F5F3F0;color:#1E2A32;
    font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
  @media(prefers-color-scheme:dark){body{background:#10171C;color:#E9E5DF}}
  .card{width:100%;max-width:560px;background:#fff;border:1px solid #DBD6CF;border-radius:8px;overflow:hidden}
  @media(prefers-color-scheme:dark){.card{background:#18222A;border-color:#2C3841}}
  .head{padding:22px 26px 18px;border-bottom:1px solid #DBD6CF}
  @media(prefers-color-scheme:dark){.head{border-color:#2C3841}}
  .kicker{font:600 10px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;text-transform:uppercase;color:#C1551F;margin:0 0 10px}
  @media(prefers-color-scheme:dark){.kicker{color:#E8813F}}
  h1{font-size:1.25rem;margin:0 0 6px;letter-spacing:-.02em}
  .sub{margin:0;font-size:.9rem;opacity:.7}
  form{padding:20px 26px 24px}
  fieldset{border:0;margin:0;padding:0}
  legend{font:600 10px/1 ui-monospace,Menlo,monospace;letter-spacing:.15em;text-transform:uppercase;opacity:.5;padding:0 0 10px}
  label.opt{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border:1px solid #DBD6CF;
    border-radius:6px;margin-bottom:8px;cursor:pointer}
  @media(prefers-color-scheme:dark){label.opt{border-color:#2C3841}}
  label.opt:hover{border-color:#C1551F}
  label.opt input{margin-top:3px}
  .nm{font-weight:650}
  .meta{font:11px/1.5 ui-monospace,Menlo,monospace;opacity:.55;margin-top:2px}
  .btns{display:flex;gap:10px;margin-top:18px}
  button{flex:1;padding:11px 16px;border-radius:6px;border:1px solid transparent;cursor:pointer;
    font:600 13px/1 inherit}
  .go{background:#C1551F;color:#fff}
  .no{background:transparent;border-color:#B4ACA2;color:inherit}
  button:focus-visible{outline:2px solid #C1551F;outline-offset:2px}
  .warn{margin:16px 0 0;padding:12px 14px;border-left:3px solid #B26A12;background:rgba(178,106,18,.08);
    font-size:.85rem;border-radius:0 4px 4px 0}
`;

function shell(title: string, inner: string): Response {
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8">
     <meta name="viewport" content="width=device-width,initial-scale=1">
     <meta name="robots" content="noindex,nofollow">
     <title>${esc(title)}</title><style>${PAGE_CSS}</style></head>
     <body><div class="card">${inner}</div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

/** GET /authorize — show the picker. */
export async function renderConsent(request: Request, env: Bindings): Promise<Response> {
  const admin = await currentAdmin(request, env);
  if (!admin) {
    // Don't leak client names to an anonymous visitor.
    const back = encodeURIComponent(new URL(request.url).pathname + new URL(request.url).search);
    return Response.redirect(
      `${env.ADMIN_ORIGIN ?? "https://admin.ascendsystems.ai"}/admin/login?next=${back}`,
      302
    );
  }

  const info = await env.OAUTH_PROVIDER.parseAuthRequest(request);
  const client = await env.OAUTH_PROVIDER.lookupClient(info.clientId).catch(() => null);
  const clientName = client?.clientName || client?.client_name || info.clientId;

  const { results } = await env.DB.prepare(
    `SELECT key, label, tenant_name, department, scope, tools_allow
       FROM voice_agents WHERE active = 1 ORDER BY key`
  ).all<AgentOption>();

  const options = results
    .map((a) => {
      let count = "all tools for its scope";
      try {
        const parsed = a.tools_allow ? JSON.parse(a.tools_allow) : null;
        if (Array.isArray(parsed) && parsed.length) count = parsed.join(", ");
      } catch { /* fall through to the default */ }
      return `<label class="opt">
        <input type="radio" name="agent_key" value="${esc(a.key)}" required>
        <span>
          <span class="nm">${esc(a.label)}</span>
          <span class="meta">${esc(a.key)}${a.department ? ` · ${esc(a.department)}` : ""} — ${esc(count)}</span>
        </span>
      </label>`;
    })
    .join("");

  return shell(
    "Authorize MCP connection",
    `<div class="head">
       <p class="kicker">Ascend Systems · MCP</p>
       <h1>${esc(clientName)} wants to connect</h1>
       <p class="sub">Signed in as ${esc(admin)}. Choose which agent this connection is for —
          it decides which client's data and which tools it can reach.</p>
     </div>
     <form method="POST">
       <input type="hidden" name="state" value="${esc(btoa(JSON.stringify(info)))}">
       <fieldset>
         <legend>Grant access as</legend>
         ${options || "<p>No active agents. Mint one first.</p>"}
       </fieldset>
       <div class="warn">This grant lasts until you revoke it. Approve only a client you
         recognise — the connection will be able to read and write that agent's data.</div>
       <div class="btns">
         <button type="submit" name="decision" value="approve" class="go">Approve</button>
         <button type="submit" name="decision" value="deny" class="no">Cancel</button>
       </div>
     </form>`
  );
}

/** POST /authorize — record the decision and hand back a code. */
export async function submitConsent(request: Request, env: Bindings): Promise<Response> {
  const admin = await currentAdmin(request, env);
  if (!admin) return new Response("Not authorized", { status: 403 });

  const form = await request.formData();
  if (form.get("decision") !== "approve") {
    return shell(
      "Cancelled",
      `<div class="head"><p class="kicker">Ascend Systems · MCP</p>
       <h1>Connection cancelled</h1><p class="sub">Nothing was granted. You can close this tab.</p></div>`
    );
  }

  const agentKey = String(form.get("agent_key") ?? "");
  if (!agentKey) return new Response("Pick an agent", { status: 400 });

  // Confirm the agent is real and still active before binding a grant to it.
  const agent = await env.DB.prepare(
    `SELECT key, label FROM voice_agents WHERE key = ? AND active = 1`
  )
    .bind(agentKey)
    .first<{ key: string; label: string }>();
  if (!agent) return new Response("Unknown agent", { status: 400 });

  const info = JSON.parse(atob(String(form.get("state"))));

  const { redirectTo } = await env.OAUTH_PROVIDER.completeAuthorization({
    request: info,
    // One grant per admin+agent pair, so re-approving replaces cleanly.
    userId: `${admin}:${agentKey}`,
    metadata: { approvedBy: admin, agent: agentKey, at: new Date().toISOString() },
    scope: info.scope ?? [],
    // This is the payload that reaches the MCP handler on every later request.
    props: { agent_key: agentKey },
  });

  console.log(`[oauth] ${admin} granted MCP access as agent "${agentKey}"`);
  return Response.redirect(redirectTo, 302);
}
