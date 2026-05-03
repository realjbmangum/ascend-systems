# Proposal Workflow Design

Authored 2026-05-03. Greenfield design for the Ascend Systems CRM. Builds on the existing D1 schema (leads → clients → projects), Hono Worker, magic-link auth, and MailChannels email pattern already established in `worker/src/`.

---

## 1. Goals & Non-Goals

**Goals (MVP)**
- Admin drafts a proposal tied to a client (and optionally a project).
- Admin sends proposal → client receives email with secure link.
- Client reviews HTML proposal in-browser, types name + checks acceptance box → signed.
- Signed snapshot (HTML + signature metadata) is rendered to PDF and stored in R2.
- Status transitions auto-advance the lead/project (e.g. on sign → project status `in_progress`).

**Non-goals (MVP)**
- Cryptographic e-signatures (DocuSign-style PKI). We capture typed name + IP + UA + timestamp.
- Rich WYSIWYG editor. Markdown or raw HTML textarea is enough for v1.
- Multi-party signing. One signer (the client contact) only.
- Versioning / redlines. A new proposal supersedes the previous; old ones are archived by status.

---

## 2. Data Model

### `proposals`
| column | type | notes |
|---|---|---|
| `id` | INTEGER PK | |
| `client_id` | INTEGER NOT NULL → clients(id) | required |
| `project_id` | INTEGER NULL → projects(id) | optional — proposals can predate a project |
| `lead_id` | INTEGER NULL → leads(id) | optional pointer to original lead |
| `title` | TEXT NOT NULL | shown in admin list + email subject |
| `content_html` | TEXT NOT NULL | the rendered proposal body (sanitized server-side) |
| `content_markdown` | TEXT | optional — source markdown the admin authored |
| `amount_cents` | INTEGER | total proposal value (informational) |
| `status` | TEXT NOT NULL DEFAULT 'draft' | see §3 |
| `access_token` | TEXT UNIQUE | per-proposal signing token (used in client URL) |
| `sent_at` | TEXT | |
| `viewed_at` | TEXT | first time client opened the link |
| `signed_at` | TEXT | |
| `signed_by_name` | TEXT | typed name |
| `signed_by_email` | TEXT | client email at time of signing |
| `signature_ip` | TEXT | request IP from CF headers |
| `signature_user_agent` | TEXT | |
| `expires_at` | TEXT | default = sent_at + 30 days |
| `r2_key` | TEXT | path to signed PDF in R2 |
| `created_by` | TEXT NOT NULL | admin email from session |
| `created_at` | TEXT NOT NULL DEFAULT now |
| `updated_at` | TEXT NOT NULL DEFAULT now |

Indexes: `client_id`, `project_id`, `status`, UNIQUE(`access_token`).

### `proposal_events` (audit trail)
| column | type | notes |
|---|---|---|
| `id` | INTEGER PK | |
| `proposal_id` | INTEGER NOT NULL → proposals(id) ON DELETE CASCADE | |
| `event_type` | TEXT NOT NULL | `created`, `sent`, `viewed`, `signed`, `rejected`, `expired`, `voided` |
| `actor` | TEXT | admin email or `client` |
| `metadata_json` | TEXT | IP, UA, etc. |
| `created_at` | TEXT NOT NULL DEFAULT now | |

Index on `proposal_id`.

We deliberately do **not** create a separate `proposal_signatures` table — one signer per proposal, signature fields live on `proposals`. The audit log handles every other event.

---

## 3. Statuses & Transitions

```
draft ──(send)──▶ sent ──(view)──▶ viewed ──(sign)──▶ signed
   │                │                  │                 │
   │                ├──(reject)──▶ rejected              │
   │                ├──(expire)──▶ expired               │
   └──(delete)──▶  voided  ◀───(admin void)──────────────┘
```

- `draft` — admin still editing. No client access.
- `sent` — email dispatched, link active.
- `viewed` — client opened link at least once. (Auto-set on first GET of signing page.)
- `signed` — client accepted. PDF rendered + uploaded. Triggers project creation/advance.
- `rejected` — client clicked "Decline". Captured optional reason.
- `expired` — past `expires_at` and not signed. Cron sweeps daily.
- `voided` — admin canceled. Token invalidated.

Side effects on `signed`:
- If proposal has no `project_id`, create a project from `client_id` with status `in_progress`.
- If lead has status `proposal_sent`, advance to `won`.
- Create a `task` for Brian: "Kickoff: {project name}".

---

## 4. Signing Flow

1. **Admin drafts** at `/admin/proposals/new?client_id=X` → POST `/api/proposals` (status `draft`).
2. **Admin reviews + sends** → POST `/api/proposals/:id/send`.
   - Generates a 32-byte URL-safe `access_token`.
   - Sets `sent_at`, `expires_at = sent_at + 30 days`, status = `sent`.
   - Sends email (MailChannels) to client contact with link `${APP_ORIGIN}/proposal/:access_token`.
3. **Client opens link** (no auth required — token is the auth).
   - GET `/api/public/proposals/:token` returns proposal HTML + status.
   - First open marks `viewed_at` and inserts `viewed` event.
4. **Client signs** by typing their name and checking "I accept".
   - POST `/api/public/proposals/:token/sign` with `{ name, accepted: true }`.
   - Worker validates token, status, expiry. Captures IP from `CF-Connecting-IP`, UA from header.
   - Worker renders signed snapshot → PDF (see §6) → uploads to R2.
   - Worker updates row: `status='signed'`, `signed_at`, `signed_by_*`, `r2_key`.
   - Emits side-effects (§3) and sends confirmation emails (§7).
5. **Client declines** → POST `/api/public/proposals/:token/reject` with optional reason. Status → `rejected`.

The token is single-purpose (signing) and tied to one proposal. After `signed`/`rejected`/`expired`/`voided`, the token still GETs (read-only) but cannot POST.

---

## 5. R2 Storage

Binding to add to `wrangler.toml`:
```toml
[[r2_buckets]]
binding = "R2"
bucket_name = "ascend-proposals"
```

**Key structure:**
```
proposals/{client_id}/{proposal_id}/signed-{YYYY-MM-DD}.pdf
proposals/{client_id}/{proposal_id}/snapshot.html   # raw signed HTML for audit
```

**Access pattern:**
- Client downloads via authenticated endpoint, not directly. We sign a short-lived URL on demand:
  - GET `/api/public/proposals/:token/pdf` → Worker fetches from R2 and streams it back with `Content-Disposition: attachment`.
  - Admin: GET `/api/proposals/:id/pdf` (auth required).
- We don't expose the bucket publicly. No need for presigned URLs since the Worker proxies.

**Retention:** indefinite. Bucket lifecycle rule can be added later.

---

## 6. PDF Generation

**Decision: Option B — server-rendered HTML snapshot, PDF generated by browser-side library at sign time, uploaded back.**

Reasoning:
- Puppeteer is heavy and not natively supported on Workers (would need Browser Rendering API — adds cost and latency).
- A pure-Worker HTML→PDF library has poor CSS fidelity.
- Generating PDF in the client's browser at the moment of signing is fast, gives us a faithful render, and the PDF is "the thing the client saw".

**Mechanics:**
1. Client signing page bundles `html2pdf.js` (or `jspdf` + `html2canvas`).
2. On submit: client renders the visible proposal DOM to a PDF blob.
3. POST to `/api/public/proposals/:token/sign` as `multipart/form-data` with `{ name, accepted, pdf: Blob }`.
4. Worker validates blob (MIME, size cap ~5MB), uploads to R2 via `env.R2.put(key, blob)`.
5. If PDF upload fails, we still mark signed (the signature is the legal artifact, the PDF is a render of it). Log a task for Brian to regenerate.

**Fallback:** if the browser can't generate (very old client), Worker stores `snapshot.html` only and a task is created to re-render later.

---

## 7. Email Notifications

All sends go through the existing `email.ts` MailChannels wrapper.

| Trigger | To | Subject | Body |
|---|---|---|---|
| Proposal sent | client contact | "Proposal: {title}" | Personalized intro + link to `/proposal/:token` + 30-day expiry note |
| Proposal viewed | admin (`ADMIN_EMAILS`) | "{client} opened proposal: {title}" | timestamp + link to admin view |
| Proposal signed | admin + client | "Signed: {title}" | client gets PDF attachment; admin gets summary + link |
| Proposal rejected | admin | "{client} declined: {title}" | reason if provided |
| Expiring soon | client (T-3 days) | "Reminder: your proposal expires soon" | optional, cron-driven |

Cron `*/15 * * * *` already exists. Add to its dispatcher:
- Sweep `sent`/`viewed` proposals where `expires_at < now` → `expired` + admin task.
- T-3 reminder emails (idempotent via a `metadata_json.reminder_sent` flag in the audit log).

---

## 8. Admin UI

New pages under `src/pages/admin/`:

| Page | Route | Purpose |
|---|---|---|
| `Proposals.tsx` | `/admin/proposals` | List all proposals with filters by status/client |
| `ProposalEditor.tsx` | `/admin/proposals/new`, `/admin/proposals/:id/edit` | Draft/edit form: title, client picker, project picker (optional), markdown body, amount, send button |
| `ProposalDetail.tsx` | `/admin/proposals/:id` | Read-only view post-send: status timeline (events), client view link (copy), download signed PDF, void button |

Inline integration:
- `ClientDetail.tsx` — add a "Proposals" tab listing proposals for the client + "New Proposal" button.
- `ProjectDetail.tsx` — same, scoped to project.
- `LeadDetail.tsx` — add "Convert to Proposal" CTA that pre-fills client info (creating a client if needed).
- `Dashboard.tsx` — add a "Proposals" stat card (sent / awaiting signature / signed this month).

Templating: a small library of canned section snippets (Scope, Timeline, Pricing, Terms) the admin can insert.

---

## 9. Client Portal UI

New routes (no auth required, token-gated):

| Page | Route | Purpose |
|---|---|---|
| `SignProposal.tsx` | `/proposal/:token` | Renders proposal, shows accept/decline form, generates PDF on submit |
| `ProposalSigned.tsx` | `/proposal/:token/signed` | Thank-you page with download link to signed PDF |
| `ProposalUnavailable.tsx` | `/proposal/:token` (when expired/voided/already-signed) | Graceful state explaining what happened |

Existing client portal (logged-in via magic link) gets a "Documents" tab listing all proposals + invoices for the client.

---

## 10. Backend Endpoints

All under Hono in `worker/src/routes/proposals.ts`.

**Admin (requireAuth('admin')):**
- `GET    /api/proposals` — list with filters
- `GET    /api/proposals/:id` — detail with events
- `POST   /api/proposals` — create draft
- `PATCH  /api/proposals/:id` — edit draft (only when status=draft)
- `POST   /api/proposals/:id/send` — generate token + email
- `POST   /api/proposals/:id/void` — void
- `GET    /api/proposals/:id/pdf` — stream signed PDF from R2
- `GET    /api/proposals/:id/events` — audit log

**Public (token-gated, no session):**
- `GET    /api/public/proposals/:token` — fetch proposal for signing
- `POST   /api/public/proposals/:token/sign` — accept (multipart with PDF)
- `POST   /api/public/proposals/:token/reject` — decline
- `GET    /api/public/proposals/:token/pdf` — download signed PDF (after sign)

Mount in `worker/src/index.ts`:
```ts
import proposals from "./routes/proposals";
app.route("/api/proposals", proposals.admin);
app.route("/api/public/proposals", proposals.public);
```

---

## 11. Implementation Phases

### Phase 1 — Foundation (schema + plumbing)
- Apply `migration_002.sql` (proposals + proposal_events tables).
- Add R2 binding to `wrangler.toml`, create `ascend-proposals` bucket.
- Stub `worker/src/routes/proposals.ts` with admin CRUD only (draft + list + detail).
- Admin page: `Proposals.tsx` list + `ProposalEditor.tsx` draft form. No sending yet.

### Phase 2 — Send + sign (MVP)
- Token generation, send endpoint, MailChannels email.
- Public `SignProposal.tsx` page with html2pdf.js bundle.
- Sign endpoint with multipart PDF upload to R2.
- Signed/rejected confirmation emails.

### Phase 3 — Lifecycle + integrations
- Status side-effects (project advance, lead → won, kickoff task).
- Cron sweep for expiry + T-3 reminders.
- Audit log UI on `ProposalDetail.tsx`.
- "Convert to Proposal" from lead.

### Phase 4 — Polish
- Templated section library.
- Branding (logo, colors) on rendered HTML.
- Client portal "Documents" tab.
- Stat card on dashboard.
- Optional: re-send / clone-as-new-version flows.

---

## 12. Open Questions

1. **Branding header** — pull from a settings table or hard-code Ascend branding? (Hard-code for v1.)
2. **Tax / line items** — do proposals need structured pricing (line items) or is `amount_cents` + free-form HTML enough? (Free-form for v1, line items can mirror invoices later.)
3. **Counter-signature by Brian** — do we want Brian to also sign, or is admin-sent = pre-signed by us? (Sent = pre-signed.)
4. **Legal language** — terms & conditions copy needs review before first real send.
