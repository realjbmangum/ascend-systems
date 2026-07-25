# Ascend Systems — Ascend Voice build parameters

Tenant **`ascend`**. First named tenant, and the model every later client is
copied from.

Produced by running `skills/development/ascend-voice-onboarding.md` against what
the repo already knows, then answered by Brian on 25 Jul. **All seven open
questions are now closed** — see the bottom. Remaining 🟡 are minor assumptions
nobody has objected to.

---

## 1 · The business

| | |
|---|---|
| **Trading name** | Ascend Systems |
| **Legal entity** | LIGHTHOUSE 27 LLC |
| **Answers as** | "Ascend Systems" |
| **What they do** | Custom software and AI for owner-operated businesses — the internal tools and systems a company runs on |
| **What they are NOT** | Not a staffing agency, not a marketing agency, not a website shop. No consumer work. No one-truck operators under $1M revenue. |
| **Size** | Solo principal + contractors. Charlotte NC, serving the Carolinas and remote. |
| **Phone** | (980) 577-1231 |

**ICP (already locked in `docs/marketing-strategy.html`):** Charlotte-metro,
$1M–$50M revenue, 10–250 staff, owner or founder decides. Ranked: property
management, professional services, multi-location services, trades above $5M,
small healthcare and dental, light manufacturing.

## 2 · The calls being missed

🟡 **Assumed from the current setup.** Today the only inbound path is the website
form. The phone number is published on the site, in the footer, and in
LocalBusiness schema — so it rings and there is nothing behind it.

- Nobody answers → caller hits voicemail or hangs up
- Highest-value miss: **an inbound referral.** Someone sent by a past client, who
  will not fill in a form and will not call twice.
- ✅ **About 10 calls a week.** Enough that this is not only about referrals —
  roughly 40 calls a month currently going unanswered or to voicemail.
  At ~3 minutes each that is ~120 minutes, about **$7 a month** in xAI cost.

**The one call to demo:** a referral rings, describes a manual process eating
their week, and leaves enough for Brian to call back prepared.

## 3 · Vocabulary

| Generic | Ascend's word |
|---|---|
| Job / work order | **Project** (and *engagement* for the commercial wrapper) |
| Customer | **Client** |
| New enquiry | **Lead** |
| Appointment | **Discovery call** |
| Account number | 🟡 none — clients are known by name, not a reference |

**Service lines — the five, locked 18 Jul:** custom SaaS development · internal
tools · legacy modernization · AI integrations · fractional CTO.

**Pricing the agent may state** (already public on the site): discovery sprint
**from $5,000**, two weeks, refundable · typical build **$15,000–$50,000+** ·
retainers monthly and month-to-month.

## 4 · Hours and escalation

| | |
|---|---|
| Hours 🟡 | Mon–Fri, 9:00–17:00 Eastern |
| Timezone | America/New_York |
| Out of hours 🟡 | Capture and promise a callback next business morning |

✅ **There IS an escalation path.** An existing client reporting production down
transfers live to **704-425-3582**.

Everything else — new enquiries, pricing questions, "can someone call me back" —
is captured and promised a callback. The agent must be strict about the
difference: "our system is down" transfers; "I want to talk about a project"
does not, at any hour.

✅ **24/7.** Outages do not keep office hours, so the transfer is always live.

## 5 · Hard limits

🟡 **Drawn from the site's own copy and this session's findings.**

The agent must never:

- **Quote a price for a specific project.** Ranges are public and may be stated;
  a number for *their* project needs discovery. This is the trust moment.
- **Commit to a timeline or a start date.**
- **Name a client.** Only what is already public in the case studies. Concord,
  Suite Manager and the masonry contractor are not public.
- **Discuss another lead, or anything in the pipeline.**
- **Discuss an invoice or a balance** — email the address on file instead.
- **Give legal advice about the MSA.** Summarise, never interpret.
- **Claim work Ascend has not done.** The July 18 cleanup removed exactly this
  kind of claim; the KB firewall now blocks the file it came from.
- **Compare Ascend to a competitor.**

✅ **Capture only.** Name, number, what they want, book a call. The agent does
NOT ask for budget or timeline — that is qualification, and an owner who rang
once will not enjoy being screened by a robot. Qualify on the callback.

## 6 · Systems

| | |
|---|---|
| Data | **`ascend-db`** — the exception. Ascend's business already lives in the platform database and copying it would be worse. No `voice-ascend` D1. |
| Calendar (business) | Microsoft 365 via Graph — `book_meeting` already writes to it |
| Calendar (personal) | Google, on the existing assistant's connectors |
| CRM | `/admin` — leads, clients, projects, invoices. Live. |
| Existing client list | `clients` table, 4 rows — see the schema gap below |
| Number control | Brian. Conditional forwarding only — never ported. |

✅ **Microsoft 365 is primary** — the Ascend tenant's calendar and email both
live there, and `book_meeting` already writes to it. Google stays connected to
the assistant for personal context but is not where client meetings land.

---

### 🔴 SCHEMA GAP — found while confirming answer 5

`ascend-db` has **`clients`** and **`projects`**. It has **no `customers` table
and no `work_orders`** — those exist only in the tenant schema. So
`lookup_customer` and `get_work_orders` would both fail against Ascend today.

Worse: the four client rows have **empty phone numbers**, so phone recognition
has nothing to match on even once the tables resolve.

✅ **DONE — views, not new tables.** Applied 25 Jul, no code change, no
duplicated data. Verified end to end against the live tools:

```
lookup_customer {"name":"Suite Manager"}  -> Suite Manager LLC · CL-0002 · ask for Chris Rutherford
lookup_customer {"account_ref":"CL-0005"} -> City of Charlotte
get_work_orders {"customer_id":2}         -> PRJ-0002 completed · PRJ-0038 completed
                                             PRJ-0039 in_progress "CTO WORK"
```

The migration as applied:

```sql
CREATE VIEW customers AS
  SELECT id, company_name AS name, phone, contact_name,
         'CL-' || id AS account_ref, NULL AS site_name, NULL AS address,
         NULL AS service_plan, 0 AS balance_cents, notes
    FROM clients;

CREATE VIEW work_orders AS
  SELECT id, client_id AS customer_id, 'PRJ-' || id AS reference,
         name AS summary, status, 'normal' AS priority, NULL AS technician,
         started_at AS scheduled_for, completed_at, notes
    FROM projects;
```

The tools query `customers` and `work_orders` and neither knows the difference.

**This validates the platform thesis rather than breaking it:** the shape is
fixed, the noun differs, and a view reconciles them. Ascend calls a job a
*project*; Imperial calls it a *work order*; the tool does not care.

**Still needs doing either way:** populate `clients.phone`. Recognition is
worthless without it.

## 7 · Agents

Two, not three. Client service folds into "we'll email it to the address on
file," which needs no separate persona.

### `ascend` — receptionist
- **Channel:** (980) 577-1231, forwarded on busy / no-answer / after-hours, **and**
  the homepage chat widget — same agent, typed instead of spoken
- **Voice:** ✅ **Carina**, speed 1.0. Set in the console by Brian — not one of
  the five voices the API docs list, so it comes from the console's larger set.
- **Tools:** `create_lead` · `check_availability` · `book_meeting` · `log_call_activity`
- **Knowledge base:** ✅ **already built** — `npm run voice:kb`, 14 documents from
  services, case studies and the MSA, with the firewall keeping the target list
  and the retracted CallSteady copy out
- **Sees:** existing clients by name and phone (via the `customers` view) so a
  returning client is greeted properly — but **nothing** about the pipeline,
  other leads, invoices or money
- **Transfers:** production-down only, to 704-425-3582

### `ascend-assistant` — Brian's own
- **Channel:** you call in, or talk to it from the app
- **Voice 🟡:** `rex`, speed 1.0
- **Tools:** all ten — `list_leads` · `lookup_lead` · `list_projects` ·
  `get_invoice_status` · `get_seo_summary` · `create_task` + the four above
- **Status:** ✅ **the tools already work against `ascend-db` today.** This is the
  shortest path of anything here — it needs a token and console wiring, not code.
- 🔴 **No phone number.** Anyone who dials it is you, as far as the system is
  concerned. Keep it off the phone network until there is a reason not to.

---

## What already exists

| | |
|---|---|
| Knowledge base | ✅ 14 docs, firewall-tested, 19/19 |
| Assistant tools | ✅ 10 tools live against `ascend-db` |
| Receptionist tools | ✅ 4 tools, same as Imperial |
| Database | ✅ `ascend-db` — no new D1 needed |
| Calendar booking | ✅ M365 Graph |
| Health monitoring | ✅ hourly zero-lead check |

## What is genuinely new

1. The receptionist prompt — Ascend's voice, its limits, its disclosure
2. `email_account_update` — the tool that emails the address **on file**, never
   one a caller supplies. The security property: an impersonator triggers a
   message to the real client.
3. ✅ **The homepage chat widget — in scope now.** Same agent, text channel.
   Needs rate limiting per IP, a per-conversation message cap, a daily spend
   ceiling that disables rather than silently draining credits, and probably
   Turnstile before the first message. It is a public endpoint that costs money
   per message.
4. The `customers` / `work_orders` views over `clients` / `projects`
5. Console setup for two agents

---

## Answers — closed 25 Jul

| # | Question | Answer |
|---|---|---|
| 1 | Calls a week today? | **~10** (~40/month, ~$7/mo in xAI cost) |
| 2 | Emergency path? | **Yes** — production down transfers to **704-425-3582** |
| 3 | Qualify or capture? | **Capture only** |
| 4 | Which calendar? | **M365** primary; Google stays for personal context |
| 5 | Recognise existing clients? | **Yes** — via views over `clients` |
| 6 | Receptionist voice | **Carina** |
| 7 | Chat widget | **Now** |

## Open before build

- [ ] Populate `clients.phone` — 4 rows, all currently empty. Recognition does
      not work without it.
- [x] ~~Confirm the emergency transfer window~~ — **24/7 confirmed.** Outages do
      not keep office hours.
- [x] ~~Create the `customers` / `work_orders` views in `ascend-db`~~ — done, verified
