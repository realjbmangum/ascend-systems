# Ascend Systems — Ascend Voice build parameters

Tenant **`ascend`**. First named tenant, and the model every later client is
copied from.

Produced by running `skills/development/ascend-voice-onboarding.md` against what
the repo already knows. **Everything marked 🟡 is my assumption — correct it
rather than compose from scratch.** Everything marked 🔴 is a genuine gap I
cannot infer and need an answer on.

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
- 🔴 **How many calls a week does the number actually get today?** If it is two,
  this is about not losing referrals. If it is twenty, it is a different build.

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

🔴 **What counts as an emergency for a consultancy?**

My read: **nothing does.** A software consultancy has no burst pipe. An existing
client with production down is the closest thing, and even that is an email or a
text, not a switchboard transfer.

Proposal — no emergency path at all. The agent captures, promises a callback,
and never transfers. Simpler, and honest.

🔴 **Unless:** should an existing client saying "our system is down" reach you
live? If yes, on what number, and at what hours?

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

🔴 **Does the receptionist qualify, or just capture?** Two options:

- **Capture only** — name, number, what they want, book a call. Warmer, shorter,
  more calls captured.
- **Qualify lightly** — also ask budget band and timeline, matching the contact
  form's `$5k–15k / $15k–50k / $50k+`.

My instinct is **capture only.** An owner who rang once will not enjoy being
screened by a robot, and you can qualify on the callback. But the form already
asks, so it is a real choice.

## 6 · Systems

| | |
|---|---|
| Data | **`ascend-db`** — the exception. Ascend's business already lives in the platform database and copying it would be worse. No `voice-ascend` D1. |
| Calendar (business) | Microsoft 365 via Graph — `book_meeting` already writes to it |
| Calendar (personal) | Google, on the existing assistant's connectors |
| CRM | `/admin` — leads, clients, projects, invoices. Live. |
| Existing client list | 🟡 in `clients`, but **not** in a `customers` table, so `lookup_customer` will not find anyone until that is decided |
| Number control | Brian. Conditional forwarding only — never ported. |

🔴 **Which calendar should the assistant book into?** M365 is the business one
and already wired. Google is where your actual day lives. Splitting them means
the agent guesses.

## 7 · Agents

Two, not three. Client service folds into "we'll email it to the address on
file," which needs no separate persona.

### `ascend` — receptionist
- **Channel:** (980) 577-1231, forwarded on busy / no-answer / after-hours, **and**
  the homepage chat widget — same agent, typed instead of spoken
- **Voice 🟡:** `eve`, speed 1.0. Warm and quick. Not Vader.
- **Tools:** `create_lead` · `check_availability` · `book_meeting` · `log_call_activity`
- **Knowledge base:** ✅ **already built** — `npm run voice:kb`, 14 documents from
  services, case studies and the MSA, with the firewall keeping the target list
  and the retracted CallSteady copy out
- **Sees:** nothing about existing clients, the pipeline, or money

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
3. The homepage chat widget — same agent, text channel, plus rate limiting,
   a per-conversation cap and a daily spend ceiling. It is a public endpoint
   that costs money per message.
4. Console setup for two agents

## The seven answers I need

1. Calls a week on (980) 577-1231 today?
2. Emergency path — none, or does a client with production down reach you live?
3. Receptionist: capture only, or qualify lightly?
4. Assistant: M365 or Google?
5. Populate `customers` from `clients` so the agent recognises existing clients,
   or leave the receptionist blind to them?
6. Receptionist voice — `eve`, or something else?
7. Chat widget now, or after the phone side is proven?
