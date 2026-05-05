-- =============================================================================
-- Import: project resources from app-contract-review-saas → "Contract Review SaaS"
-- Generated: 2026-05-05T17:58:58.685Z
-- Run:  wrangler d1 execute ascend-db --remote --file=worker/db/seeds/2026-05-05-import-app-contract-review-saas.sql
--
-- 5 resources found.
-- =============================================================================

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'Market Research', '# MARKET-RESEARCH.md — AI Contract Review for Subcontractors

## 6. The Wedge (lead)

**Document Crunch is the only credible direct competitor, and they sell up — to Balfour Beatty, PCL, Haskell. Their pricing is opaque-enterprise. Spellbook, Robin AI, and Ivo are built for lawyers ($99–$500/seat/month). Procore touches contracts but doesn''t review them, and Levelset only handles lien waivers downstream of signing.**

The wedge: **a fixed-price ($999/yr), no-seat-math, sub-side advocacy tool that flags the eight clauses that actually screw a 5–50 employee specialty contractor in a specific state — pay-if-paid, retainage above 5%, indemnification beyond comparative fault, lien waiver timing, scope creep, no-damage-for-delay, flow-down, termination-for-convenience — and drafts the GC kickback email for them in 30 seconds.** Spellbook will not vertical down into trades; Document Crunch will not price down to a 12-truck masonry crew. The defensible moat is the clause library tuned per trade × per state, the kickback email generator (a workflow Document Crunch does not have), and the price point that lets a $400k-revenue sub buy without a procurement conversation.

Brian''s existing build (`app-masonry-contract-review`) already ships the AI engine, NC-tuned clause library, kickback email generation, and e-sign. Pivoting it to multi-tenant + multi-trade is a re-skin and a clause library expansion, not a rebuild.

---

## 1. Market Sizing

Per BLS NAICS 238 (Specialty Trade Contractors) and 2022 Economic Census: roughly **730,000–815,000 specialty trade establishments in the US** with paid employees (the broader 3.7M includes sole-prop / no-employee firms; the ICP filter "5–50 employees" lands somewhere in the 250,000–350,000 range nationally — Census tables suggest ~40% of 238 establishments have ≥5 employees). Trade breakdown rough order of magnitude: electrical (~75k establishments), plumbing/HVAC (~120k combined), drywall/insulation (~25k), roofing (~35k), masonry/concrete (~30k), painting (~50k), framing/carpentry (~60k).

**TAM math:** 300,000 US shops × $999/yr = **$299M ARR ceiling** if everyone bought, which they will not.

**SAM (NC + SC, GA, VA, TN, FL — 6 SE states, first 12 months):** SE region holds ~22% of US construction establishments. ~66,000 specialty firms in the 5–50 size band → at $999 × 1% adoption = **$660K ARR realistic ceiling** for year 1 if execution is strong. NC alone Census 2022 reports ~25,000 specialty trade establishments; the 5–50 employee slice is roughly ~9,000.

**Note on uncertainty:** the 5–50 employee filter is interpolated from Census size-class buckets, not a clean published number. Treat all SAM math as order-of-magnitude.

---

## 2. Competitive Landscape

### Direct AI contract review (legal-tech)

| Competitor | URL | Audience | Pricing | Gap |
|---|---|---|---|---|
| **Spellbook** | spellbook.legal | Transactional lawyers in MS Word | $99–$199/user/mo, annual; 10-seat min on Enterprise | Lawyer tool, not subcontractor tool. Generic clauses. No construction vertical. |
| **Robin AI** | robinai.com | Enterprise legal teams | Custom (Free starter); collapsed late 2025, services arm acquired by Scissero, eng team to Microsoft | Effectively dead as a direct buy. |
| **Ivo** | ivo.ai | Fortune 500 in-house legal | ~$6,000/user/yr, sales-led | Wrong buyer. Wrong price. Wrong vertical. |
| **Lawgeex / Pincites / Definely / ContractPodAi / Ironclad** | various | Enterprise legal ops | $20k–$100k+/yr | Procurement-heavy enterprise sales. Not a fit. |

**Verdict:** legal-tech is priced and positioned for in-house counsel. None of them will do "show me the lien waiver risk in this NC subcontract" out of the box, and none will sell to a 22-person plumbing shop.

### Construction-specific tools

| Competitor | URL | What they do | Pricing | Gap |
|---|---|---|---|---|
| **Document Crunch** | documentcrunch.com | AI contract review built for construction. Reviews GC contracts, subs, specs. Series B $21.5M Oct 2024. | Not public; enterprise. | **THE bullseye competitor.** But customer logos (Balfour Beatty, PCL, Boldt, Haskell) are all top-200 GCs. They sell to GC risk teams and large subs, not to 5–50 employee shops. Pricing is sales-led. |
| **Procore** | procore.com | Project management. Has commitments / SOV / invoice review for subcontractors but **does not review the contract itself** for risk. | $375+/mo, scaled by volume | Procore is the GC''s tool. Subs are recipients, not buyers. No risk-clause analysis. |
| **Levelset (Procore)** | levelset.com | Lien waivers + payment notices | Bundled into Procore Pay; some free tools | Downstream of contract signing. Doesn''t review the contract. |
| **Buildertrend / JobTread / RedTeam / BuildOps** | various | Residential / commercial PM | $99–$399/mo | None do clause-level risk review. |
| **ConstructConnect** | constructconnect.com | Bid management / takeoff | Custom | Pre-bid, not post-bid contract. |

**Verdict:** Document Crunch is the threat. Everyone else solves adjacent problems (PM, payments, bidding). Document Crunch has not (yet) shipped a low-friction self-serve product priced for the SMB sub.

### Legal services aimed at subs

| Competitor | URL | Pricing | Gap |
|---|---|---|---|
| **LegalShield Small Business** | legalshield.com | $49–$169/mo ($588–$2,028/yr) | Generic legal access. Not construction-specific. Lawyer reviews only when you call. |
| **Rocket Lawyer Business** | rocketlawyer.com | $34.99/mo (~$420/yr) | Document templates + on-demand attorney. Not AI. Not construction-tuned. |
| **ContractsCounsel / UpCounsel** | contractscounsel.com | Avg subcontract review: **$287 flat fee**, contractor agreement: **$450 flat fee**. Construction lawyer hourly: $200–$500. | Per-contract, not per-year. Slow (24–72hr turnaround). Quality varies. |
| **Construction law firms (Bradley, Smith Anderson NC, Cromeens)** | various | $300–$500/hr | Fast → expensive. Cheap → 1–2 week wait. No SaaS option. |

**Verdict:** today the sub either (a) doesn''t review and signs blind, (b) pays $287–$1,000 per contract to a lawyer, or (c) keeps a $588–$2,028/yr LegalShield plan that is generic. **$999/yr beats option (b) after 2–3 contracts and beats option (c) on construction relevance.**

---

## 3. Buyer Pain Points (hypotheses to validate)

**Who reviews contracts today at a 5–50 employee sub?**
- Owner reads it themselves on the truck (most common)
- Owner''s spouse / office manager skims for payment terms
- Owner pays a construction lawyer for the first contract with a new GC, then stops
- Owner just signs. This is the modal answer.

**What goes wrong:**
- **Pay-if-paid** clauses: enforceable in most states (NC included); unenforceable in CA, NY, SC. Sub fronts labor + materials; if owner stiffs GC, sub eats the loss.
- **Retainage** above 10% or held past punchlist: cash-flow killer
- **Indemnification** clauses requiring sub to defend GC against GC''s own negligence
- **Lien waivers** signed unconditionally before payment received (common screw-up)
- **No-damage-for-delay** clauses removing schedule recovery
- **Flow-down** clauses dragging subs into prime contract terms they never read

**Buying triggers:**
- Got burned on a six-figure pay-if-paid loss (most common — talk to any sub at a bar)
- Hired a new ops manager who came from a bigger shop and asks "who reviews these?"
- Joined ABC Carolinas / NUCA / state masonry / electrical association and saw a peer talk about it
- Lost a lien claim because waiver was signed too early

**Where they congregate:**
- r/Construction (~1.5M), r/Plumbing, r/Electricians, r/HVAC, r/ConcreteandConstruction
- Facebook groups: "Contractors Talk", state-specific ABC/NUCA chapter groups, trade-specific (Mason Contractors Association, NECA local chapters)
- ABC Carolinas, NUCA-NC, PHCC-NC chapter events
- Construction Junkie newsletter, ConstructConnect Insight, ENR

---

## 4. Channel Hypothesis (90 days)

| Channel | Why | First action |
|---|---|---|
| **ABC Carolinas member discount** | 1,000+ NC members, mostly merit-shop subs. They publish a vendor benefit catalog. | Email Carolyn Floyd (membership) with a $799 member rate offer, in exchange for newsletter feature |
| **NUCA-NC + state masonry/electrical/plumbing chapters** | Smaller, more concentrated. Mike (Carolina Masonry) likely a member already → warm intro. | Mike ships a peer testimonial; offer 30% chapter discount |
| **Direct outbound — top 50 NC subs per trade** | Census + state license board gives the list. Cold email + LinkedIn DM, owner-to-owner, mention Mike. | Build the list week 1, send 100 emails/week |
| **Reddit r/Construction, r/Plumbing, r/Electricians** | Free, but conversion is slow. Useful for content credibility. | Post "the 8 clauses that screw subs" weekly |
| **LinkedIn — construction founders** | Office-side decision makers live here. | Brian posts 3x/week, case study format ("how a 22-person mason shop caught a $40k indemnity bomb") |
| **Trade podcasts** | Construction Brothers, Bridging the Gap, The Construction Leading Edge — all take guest pitches | Pitch one per week, lead with Mike''s story |

Skip first 90 days: paid ads, SEO, trade magazines (12-week lead time), conferences.

---

## 5. Pricing Benchmark

| Anchor | Price | Comparison to $999/yr |
|---|---|---|
| Single subcontract review by a lawyer | $287 flat / $450 flat (ContractsCounsel) | $999 = 2.2–3.5 contracts |
| Construction lawyer hourly | $200–$500/hr | $999 = 2–5 hours |
| LegalShield Small Business | $588–$2,028/yr | $999 sits in the middle, and is construction-specific |
| Rocket Lawyer | $420/yr | Cheaper, but generic |
| Spellbook (lawyer tool) | $1,188–$2,388/seat/yr | We are 50–80% cheaper |
| Document Crunch | Enterprise, opaque | Out of reach for SMB subs — that''s our opening |

**Verdict on $999/yr:** correct. It beats one and a half lawyer reviews. It is below LegalShield''s mid-tier. It is well below Spellbook. It is plausibly impulse-purchase territory for an owner who just got burned.

**Tiering recommendation:**
- **Solo / Small** ($999/yr): up to 3 users, 50 contracts/yr, 1 trade × 1 state
- **Crew** ($1,999/yr): up to 10 users, unlimited contracts, multi-state
- **Multi-office** ($3,999/yr): unlimited users, custom playbook, priority support

Annual only for v1. Monthly billing introduces churn and discounts urgency to use.

---

## 7. Risks & Kill Criteria

**Kill at 90 days if any of these are true:**

1. **Mike doesn''t use his free version after 30 days.** If the founding customer doesn''t pull the tool out for every new GC contract, the workflow hypothesis is wrong.
2. **Fewer than 5 paying customers after 90 days of weekly outreach.** That''s 12+ outreach weeks, ~500 cold emails, ~3 association partnerships. If conversion is below 1%, the wedge isn''t sharp.
3. **Document Crunch ships a self-serve SMB tier under $2k/yr.** They have the brand, the data, and $21.5M in funding. We must be in-market and have customers before they notice.
4. **A free option (Procore, AIA, ConsensusDocs) ships AI contract review natively.** Lower probability but worth monitoring.
5. **NPS / churn signal:** if any of the first 5 customers doesn''t renew or refer, the value isn''t sticking.

**Risks worth tracking but not killing for:**
- State law variance (50 states × 8 trades = 400 clause profiles). Solve by launching with NC + 5 SE states only.
- Liability: tool gives "guidance not legal advice." Boilerplate disclaimer + E&O insurance.
- AI hallucination on clause flagging. Mitigation: every flag links back to the source clause text in the doc, never a paraphrase.

---

## Sources

- BLS NAICS 238 Specialty Trade Contractors — bls.gov/iag/tgs/iag238.htm
- Construction Coverage US Construction Industry Data 2026
- Census County Business Patterns 2022
- Spellbook Pricing 2026 (aivortex.io)
- Robin AI G2 Pricing
- Ivo G2 Reviews 2026
- Document Crunch Series B announcement (BusinessWire, Oct 2024)
- Document Crunch — Subcontractors page
- Procore Subcontractor Management
- Levelset + Procore lien waivers
- ContractsCounsel — Contract Review Cost
- LegalShield Small Business Plans
- Rocket Lawyer Pricing
- Bradley — Pay-If-Paid Means What It Says
- Levelset — Pay-If-Paid vs Pay-When-Paid
- ABC Carolinas
', 30, 'app-contract-review-saas/tasks/MARKET-RESEARCH.md'
FROM projects WHERE name = 'Contract Review SaaS' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'Design Brief', '# DESIGN-BRIEF.md — Contract Review SaaS for Subcontractors

> Date: 2026-05-05 · Pairs with PRD.md, MARKET-RESEARCH.md, TECHNICAL-SPEC.md, MARKETING-PLAN.md
> Project: Contract Review SaaS · Founding customer: Carolina Masonry & Concrete (cousin Mike) · Pricing: $999/yr · Timeline: 90 days to first paying customer

This brief defines the look, voice, and experience of the new SaaS. The reference build at `/Users/jbm/new-project/app-masonry-contract-review/` is a single-tenant tool for Carolina Masonry — its maroon-and-charcoal brand belongs to that customer, not to this product. The new SaaS gets its own neutral, trade-agnostic identity that any subcontractor (mason, electrician, HVAC, framer, plumber) sees as built for them.

---

## 1. Brand Posture

**The trade journeyman who happens to read contracts.** This is the tool a smart sub uses on a Tuesday afternoon between estimates — not a SaaS designed for a Fortune 500 procurement department. The product knows what an indemnification clause does, what a pay-when-paid clause costs you, and what to write back to the GC without lighting the relationship on fire. It speaks plainly. It does not say "leverage" or "stakeholder." It does not show a hero illustration of a hard-hat handshake. It looks like the tool you''d expect from someone who has actually sat at a job-site trailer table and read 100 contracts. Trustworthy because it is sub-side, not GC-side. No corporate gloss. No legal-pad lawyer fonts. A workshop, not a courtroom.

---

## 2. Voice & Tone

**Voice principles**
1. Plain English. Eighth-grade reading level. Subs are smart, not academic.
2. Short sentences. Direct verbs.
3. Specifics over abstractions. "Section 7.3 makes you eat the GC''s mistakes" beats "potential liability exposure."
4. We are on the sub''s side. "They''re trying to push the risk to you" is the right framing.
5. No exclamation marks. No emojis except functional checkmarks (✓) and arrows (→).
6. We never say "AI" in the UI even though the analysis is AI. We say "the review," "the report," "the analysis."
7. We never say "leverage," "stakeholder," "synergize," "robust," "seamless," "journey," "empower."

**Sample microcopy** (developers, match this tone)

| State | Copy |
|---|---|
| Upload prompt (empty) | `Drop a contract here. PDF or Word. We''ll have a review in about 90 seconds.` |
| Upload in progress | `Reading your contract. About 60 seconds left.` |
| Analysis complete (toast/email) | `Your review is ready. 4 high-risk clauses flagged. Open the report →` |
| Error state (upload failed) | `That file didn''t go through. Try again, or send it to support@[domain] and we''ll handle it.` |
| Error state (unsupported format) | `We need a PDF or Word file. Photos of contracts don''t work yet.` |
| Empty dashboard | `No contracts yet. Upload your first one — we''ll show you what''s hiding in it.` |
| Billing reminder (renewal -7) | `Your subscription renews next Friday. $999 for the year. Nothing to do — we''ll send the receipt.` |
| Billing failure | `Card on file got declined. Update it here and we''ll retry. No contracts get locked out for 7 days.` |
| Subscription canceled | `You''re canceled. Your reviews stay available through [date]. Come back anytime — we keep your history.` |

---

## 3. Visual System

### Color palette

Ground-truthy. No gradients. No SaaS-purple. The color of a clean job-site trailer with a single fluorescent jacket on the chair.

| Role | Token | Hex | Notes |
|---|---|---|---|
| Background primary | `--bg` | `#F7F6F3` | Warm off-white. Not pure white. |
| Background mid | `--bg-mid` | `#EFEDE7` | Section variation, table headers. |
| Surface (cards) | `--surface` | `#FFFFFF` | Pure white only on cards against bg. |
| Ink primary | `--ink` | `#0F1720` | Near-black with steel undertone. Body text + headlines. |
| Ink-2 | `--ink-2` | `#2B3441` | Body copy on bg. |
| Ink-3 (muted) | `--ink-3` | `#5B6573` | Labels, secondary metadata. |
| **Steel** (primary brand) | `--steel` | `#1F3A5F` | Deep navy/steel. Headers, primary buttons, brand mark. |
| Steel-d | `--steel-d` | `#142A47` | Hover state on primary. |
| **Hi-Vis** (accent) | `--hivis` | `#F26B1F` | Single accent. CTAs, risk-high badges, brand spark. Borrowed from safety vests, not from Stripe. |
| Risk-high | `--risk-h` | `#C62828` | Severe risk only. Brick red, not Crayola red. |
| Risk-med | `--risk-m` | `#B45309` | Caution amber. |
| Risk-low | `--risk-l` | `#2E7D32` | Forest green. Not lime. |
| Rule | `--rule` | `#D8D5CD` | Borders, dividers, table gridlines. |

**Why these:** steel + hi-vis is the actual color story of construction. It doesn''t apologize for being a blue-collar tool. The bg is warm so the dashboard doesn''t read as cold/clinical. Risk colors are muted versions of the obvious choices because the dashboard shows them next to dense text and they need to live there all day without screaming.

### Typography

A workhorse pairing. Headlines have weight, UI is clean, code/numerals are mono.

| Use | Font | Notes |
|---|---|---|
| Headlines (H1, H2) | **IBM Plex Sans** 600/700 | Slightly more serious than Inter. Reads as engineered, not startup-y. |
| Body + UI | **Inter** 400/500/600 | Workhorse. Don''t overthink it. |
| Mono (clause IDs, contract section refs, dollar amounts in tables) | **IBM Plex Mono** 400/500 | Anchors numbers and code-like references. |

Avoid: Playfair, EB Garamond, Fraunces, Libre Baskerville, anything with serifs in the UI. Those work for ministry, restaurants, weddings — not contracts. A serif on a contract-review page reads like the lawyer is selling, not helping.

### Iconography

Lucide icons only. 1.5px stroke. No filled shapes. No decorative illustration.

Recurring icons:
- `upload-cloud` — file upload zone
- `file-text` — contract list rows
- `alert-triangle` — high-risk badge
- `alert-circle` — medium-risk badge
- `check-circle` — low-risk / clean clauses
- `pen-tool` — signature / e-sign references
- `mail` — kickback email block
- `download` — print/export report
- `building-2` — GC entity references
- `hard-hat` — used once (account avatar default), never decoratively

### Density

Stripe Dashboard density, not Linear. Subs want to scan a 12-page contract review fast — not look at marketing-style hero spacing inside the app. Tables with row dividers. 14px body in dense areas, 16px in marketing. Generous tap targets on mobile (44px) but desktop is the primary canvas.

### Photography vs illustration

Photography of real construction sites + tools, used sparingly on the marketing page only. In-app: zero photography. Zero illustration. The product is the report.

**Allowed photography (marketing only):**
- Concrete being poured. A weathered tape measure on a rebar mat. A clipboard of paperwork on a tailgate. A truck cab dashboard with a contract folder on the seat.
- Shot in natural light. No black-and-white. No tilt-shift.

**Banned tropes:**
- Hard-hat handshake
- Pointing at a tablet on a job site
- Three diverse coworkers laughing at a laptop
- Hands typing on a MacBook with a coffee cup
- Anything with a model release form

---

## 4. Key Screens

### 4.1 Marketing landing page

Five sections, in order:

1. **Hero.** Headline hypothesis: `Stop signing contracts that bury you in the fine print.` Sub: `Upload any contract from a GC. Get a plain-English risk report and a kickback email in 90 seconds. Built for subs, by someone who''s read 100 of them.` CTA: `Start a free review` (no credit card).
2. **The free review** — the wedge. "Drop a contract. We''ll send a sample report to your email. If it doesn''t save you a fight, you owe us nothing." Visual: a screenshot of the actual report page.
3. **What gets flagged** — six clause types subs lose money on (pay-when-paid, indemnification, no-damage-for-delay, retainage, change-order procedure, termination for convenience). One sentence each.
4. **The kickback email** — show the actual email the tool generates. This is the differentiator.
5. **Pricing + founder note.** $999/year, unlimited contracts, all trades. Short note from Brian: "I built this with my cousin Mike. He runs a masonry crew. He''d been signing GC contracts that ate 8% of his margin and didn''t know it. This is the tool we wished he had."

Footer: terms, privacy, contact, an actual phone number subs can call.

### 4.2 Signup → onboarding (3 steps max)

1. **Trade selection.** Big tile picker: Masonry · Concrete · Framing · Electrical · HVAC · Plumbing · Roofing · Drywall · Sitework · Other. The selection sets the clause library and language used in commentary. This is the most important step — drives everything downstream.
2. **State.** Single dropdown. NC default. Sets state-law-specific commentary (NC lien law differs from SC, etc.).
3. **Company info.** Company name, your name, email, phone. That''s it. No "what''s your company size" / "how did you hear about us" forms — a sub closing the laptop is a conversion lost.

After step 3 → land directly on empty dashboard with a single visible CTA: "Upload your first contract."

### 4.3 Empty dashboard (first contract not yet uploaded)

A single card, centered. Steel-headed.

> **Drop your first contract.**
> Pull a PDF off your email or your hard drive. We''ll have a review in your inbox in about 90 seconds. If you want to test us first, here''s a sample contract → [Try it on a sample]

Below: three "what we''ll find" thumbnails (real screenshots of past report sections, blurred customer name) — pay-when-paid, indemnification, kickback email. This shows what a finished review looks like before they upload.

No tutorial videos. No checklist of "complete your profile." Subs do not want onboarding gamification.

### 4.4 Contract analysis report page (the most important screen)

The only screen the customer comes back for. Optimized for laptop reading, print-friendly (single CSS print stylesheet — no nav, no buttons, full-width).

Layout (top to bottom):

1. **Header band.** Contract name, GC name, date received, total page count. Right side: print button, "kickback email" button (jumps to bottom).
2. **Risk summary card.** A horizontal bar: 4 high · 7 medium · 12 low · 23 standard. Click any bucket → filters list below. Includes a one-paragraph plain-English overall verdict ("This contract is heavily GC-favored. The pay-when-paid clause and the no-damages-for-delay clause are the two you should fight before signing.").
3. **Clause-by-clause table.** Each row:
   - Risk badge (high/med/low/standard) — colored chip
   - Clause name + section reference (mono)
   - One-sentence sub-side commentary
   - Expandable: full clause text + "what this means for you" + "what to ask the GC for"
4. **Money-at-risk callout.** If the analyzer can estimate dollar exposure (retainage %, change-order delay clauses), show a steel-bordered card with the rough number and how it was calculated.
5. **Kickback email.** A copy-paste-ready email at the bottom. Greeting, three asks ranked by importance, plain-English explanation of why each ask is reasonable, professional sign-off. `Copy email` button. Editable in place. This is the single feature subs will tell other subs about.
6. **Footer:** disclaimer (this is not legal advice), date of analysis, "regenerate with new info" button.

Print: hides nav, buttons, kickback-email button. The kickback email itself prints. The clause table prints with all expansions open. One report = one PDF a sub can hand to their lawyer.

### 4.5 Settings / billing

Minimal. One page. Three sections.

1. **Account** — name, email, company name, trade, state. Inline-editable.
2. **Subscription** — "Active. $999/year. Renews [date]." Buttons: `Update card` · `Cancel subscription`. Cancel flow: one confirmation, one optional reason dropdown (no exit survey, no retention offer). They keep access through the end of the billing period.
3. **Data** — `Download all my contracts` (zip). `Delete my account` (with 7-day grace).

### 4.6 Admin dashboard (Brian''s view)

Multi-tenant operator view at `/admin`. Cloudflare Access protected.

Top bar: total customers · MRR · contracts processed (7d / 30d / all-time) · churn risk count.

Customer list table (sortable):
- Company name + trade + state
- Signup date
- Subscription status (active / past-due / canceled)
- Contracts processed (count + last-uploaded date)
- Renewal date
- A "churn signal" flag (no contracts in 30 days = yellow, no contracts in 60 days = red)

Click a row → customer detail: contract history, support notes (free-text field for Brian), "log in as this customer" (dev-mode only).

No charts on the admin dashboard. Brian gets the data, not a vanity dashboard.

---

## 5. Mobile Posture

Subs use phones in the field, but contracts are read on laptops. Mobile is for:
- Receiving the "your review is ready" email and tapping the link
- Glancing at the risk summary in the truck cab
- Forwarding the kickback email to the GC

Mobile is not for: reading clause-by-clause breakdowns, full contract upload flows, billing changes. Make those screens responsive (no horizontal scroll, no broken tables) but don''t invest in mobile-first refinement. The product earns money on the laptop.

Specifically:
- The contract analysis report on mobile collapses the clause table into a vertical card stack
- The kickback email is mobile-tap-to-copy
- Upload on mobile is supported but de-emphasized — show a small note "Upload from your laptop for the best experience."

---

## 6. What to Throw Out (from Carolina Masonry build)

Concrete carryover deletions:

- **Maroon brand color (`#5C1A2A`)** — Carolina Masonry''s, not ours. Replaced by steel (`#1F3A5F`) + hi-vis (`#F26B1F`).
- **Space Grotesk display font** — too startup-y. Replaced by IBM Plex Sans.
- **Single-tenant assumptions** everywhere — hardcoded company name in headers, single login, no trade selection. The new SaaS is multi-tenant from line one.
- **Hardcoded "NC construction law" commentary** — must be configurable per state and per trade. The clause library is keyed on `(state, trade)`, not hardcoded.
- **The radial-gradient hero with grain overlay** — that''s a single-customer decorative flourish. Marketing landing page is flat, white, with a screenshot of the actual report.
- **The white-on-maroon login card** — replaced by a clean steel/cream login that works for any sub regardless of brand.
- **`/redline/` and `/sign/` routes** — those are Mike''s specific workflow. The SaaS does not redline or e-sign in v1. It analyzes and reports. Stay focused.

What to keep:
- The clause analysis prompt structure (rewrite as trade-agnostic)
- Risk-level colors/concept — but retune the hex values
- The kickback email idea — that''s the killer feature

---

## 7. Inspiration & Anti-Inspiration

**Inspiration**
- **Stripe Dashboard** — clarity, density, table design, plain-English error states
- **Linear** — keyboard-first, fast feel (use sparingly — subs are not keyboard power users)
- **Levelset** — proves the construction-vertical SaaS pattern; copy their plain-English explainer style
- **Procore** — proves the audience pays for software; do NOT copy their UI complexity
- **Construction Dive** — trade-press tone for the marketing page

**Anti-inspiration**
- **LegalZoom / Rocket Lawyer** — too consumer, too much hand-holding, too cute
- **Ironclad / ContractPodAi** — enterprise procurement aesthetic, "request a demo" mentality, designed for legal departments
- **Houzz Pro** — retail/marketplace aesthetic, designed for homeowners
- **Generic SaaS landing pages** — purple gradients, abstract 3D blobs, isometric illustrations of laptops
- **Lawyer websites** — gold-foil serifs, courthouse photography, scales-of-justice icons

---

## 8. Naming Options

Working name "Contract Review SaaS" needs replacing. Domain availability — check `.com` first, then `.co`, then `app`. Brian to verify before committing.

| Name | Vibe | Pros | Cons | Domain to check |
|---|---|---|---|---|
| **Subline** | Direct. "Sub-side" + "bottom line." Reads as "the sub''s line in the contract." | Short. Memorable. Sub-side is in the name. Easy to say on a phone. Wordmark looks clean. | Some people hear "subline" as a typo for "sublime." Crowded namespace (substack, sublime, etc.). | subline.com / getsubline.com / subline.co |
| **Trade Counsel** | The journeyman lawyer. Two words, both ground-truthy. | Names the audience (trade) and the function (counsel) in one breath. Reads as serious without being legal-y. | Two-word domains harder to find. "Counsel" leans toward lawyer-coded. | tradecounsel.com / tradecounsel.co |
| **Subcontract** | Just the word. Most direct possible. | Impossible to misunderstand. SEO-perfect. Memorable. | Very likely taken. Could feel generic. Not differentiating on its own. | subcontract.com / subcontract.app |
| **Foreman** | The person on the jobsite who reads the contract. | Strong association with the buyer. One word. Construction-native. Sounds like a tool, not a SaaS. | Trademark risk in HR-software space (there''s a "Foreman" payroll product). | foreman.app / forecontract.com |
| **Plumb** | Plumb line — what''s true and straight. Construction term every trade knows. | One word. Construction-native. Universal across trades. Memorable. Easy to logo. | Crowded — Plumb the company exists. Could feel abstract until explained. | plumbcontracts.com / plumbreview.com |
| **Crewline** | The line your crew works above. Plus echoes "deadline" / "bottom line." | New-feeling. Differentiated. Crew-oriented. Works for any trade. | Made-up word — needs explanation the first time. | crewline.com / crewline.app |

Brian''s call. The recommendation is **Subline** if the .com is gettable, **Trade Counsel** if not. Both are plain-spoken, sub-side, and don''t need to be explained twice.

---

## 9. Brand Promises (write these on the wall)

1. We are sub-side. We never build a feature that helps GCs.
2. We never give legal advice. We give plain-English explanations a sub can take to their lawyer.
3. We never use the word "AI" in the UI. The customer paid for a review, not a chatbot.
4. We never charge twice. $999/year, unlimited contracts, no per-seat, no per-contract.
5. We never sell a sub''s data. Their contracts are their contracts.
', 31, 'app-contract-review-saas/tasks/DESIGN-BRIEF.md'
FROM projects WHERE name = 'Contract Review SaaS' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'Technical Spec', '# Technical Spec: Contract Review SaaS

> [!info] Pairs with `PRD.md`, `MARKET-RESEARCH.md`, `DESIGN-BRIEF.md`. This document is the contract a fresh agent reads to wire up the multi-tenant build without re-deriving decisions. The existing single-tenant tool at `/Users/jbm/new-project/app-masonry-contract-review/` is the donor codebase — reuse, don''t restart.

---

## 1. Migration Approach

Two paths considered.

**Path A — Multi-tenant the existing app.** Modify `app-masonry-contract-review` in place: add `organizations` and `users.org_id`, retrofit every D1 query with an `org_id` scope, swap branding to neutral, push out as the SaaS. Pros: 100% code reuse, one deploy target, Mike auto-migrates because his login becomes org #1. Cons: refactor risk on every existing endpoint; the brand "Carolina Masonry" is wired into copy, emails, and seeded standard positions.

**Path B — Fresh app, port the AI core.** Spin up `app-subready` (or final brand), copy `src/lib/ai.ts`, `src/lib/parse.ts`, `src/lib/analyze-contract.ts`, the Claude prompts, and the schema as a starting point. Pros: clean separation, Mike''s tool stays untouched as a fallback during cutover. Cons: two repos to maintain, branding work happens twice if we ever rebrand again.

**Recommendation: Path A — multi-tenant the existing app, rename the repo to `app-contract-review-saas`.**

Rationale: the donor codebase already absorbed the expensive lessons (unpdf instead of pdf-parse, waitUntil for large contracts, AbortController on Claude calls, mammoth''s `arrayBuffer` quirk, CF''s 30-second gateway timeout). Rebuilding that scar tissue from scratch costs 2-3 weeks. The retrofit risk is bounded — there are ~10 endpoints, each gets the same `org_id` middleware treatment. Mike''s data lives in the same D1; on cutover his single user becomes `org_id=''org_carolina_masonry''` and nothing breaks for him. Brand strings move into a per-org `settings` table so the app shows his branding when he''s logged in and neutral SaaS branding to everyone else.

This gets us to "Mike using it as the SaaS" the same week we ship — which is the only milestone that matters in the trio''s lesson.

---

## 2. Architecture Overview

```
┌─────────────────────────┐    ┌───────────────────────────┐    ┌──────────────┐
│ Cloudflare Pages        │───▶│ Pages Functions           │───▶│ D1           │
│ (Astro + React islands) │    │ /api/* routed via Astro   │    │ (tenant data)│
│ app.<brand>.com         │    │ - auth, contracts, billing│    └──────────────┘
└─────────────────────────┘    │ - waitUntil background AI │    ┌──────────────┐
                               │ - Stripe + SendGrid       │───▶│ R2 (uploads) │
                               └───────────┬───────────────┘    └──────────────┘
                                           │
                                           ▼
                              ┌───────────────────────────┐
                              │ Claude API (Sonnet 4.6)   │
                              │ claude-sonnet-4-6         │
                              └───────────────────────────┘
```

**Stack:**
- Cloudflare **Pages** (not Workers) running Astro 5 + Tailwind v4. Pages Functions handle all `/api/*` routes — same model as the Masonry tool.
- D1 database (single instance, multi-tenant by `org_id`)
- R2 with **remote bindings only** (per monorepo CLAUDE.md). Bucket `contracts-saas-files`.
- Anthropic SDK calling `claude-sonnet-4-6` for analysis. Prompt caching on the system prompt + clause library block.
- Stripe for billing, single $999/yr product, customer portal for self-serve.
- SendGrid (existing 50k/mo free tier) for transactional email — magic links, analysis-complete, GC kickbacks.
- Sentry free tier for browser + Pages Function exceptions; Cloudflare Workers Analytics for request volumes.

**Banned (per monorepo CLAUDE.md):** pdf-parse, mammoth (`arrayBuffer` workaround is fragile — see Open Questions), nanoid tokens with `__`. Cloudflare Pages reserves `__` in URL paths.

---

## 3. Database Schema (D1)

Multi-tenant by `org_id` on every row. **Every D1 query MUST be scoped by `org_id` via middleware (no exceptions).** Admin role bypasses scoping for Brian''s cross-tenant views.

Tables: `organizations`, `users`, `sessions`, `magic_links`, `contracts`, `analyses`, `flagged_clauses`, `clauses_library`, `sub_agreements`, `gc_referrals`, `subscriptions`, `events`, `settings`.

The four most important `CREATE TABLE` statements:

```sql
-- 0001_organizations.sql
CREATE TABLE organizations (
  id TEXT PRIMARY KEY,                    -- org_<nanoid no underscores>
  name TEXT NOT NULL,
  trade TEXT NOT NULL,                    -- masonry|drywall|electrical|plumbing|roofing|concrete|framing|hvac|other
  state TEXT NOT NULL,                    -- 2-letter, e.g. NC
  plan TEXT NOT NULL DEFAULT ''trial'',     -- trial|active|past_due|canceled
  trial_ends_at INTEGER,                  -- unix seconds
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  branding_json TEXT,                     -- {logo_url, primary_color, sender_email}
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX idx_orgs_stripe_customer ON organizations(stripe_customer_id);
CREATE INDEX idx_orgs_plan ON organizations(plan);

-- 0002_users.sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT ''member'',    -- owner|member|admin (admin = Brian only)
  email_notifications INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
  UNIQUE (email)                          -- one account per email globally
);
CREATE INDEX idx_users_org ON users(org_id);

-- 0003_contracts.sql
CREATE TABLE contracts (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  uploader_id TEXT NOT NULL,
  r2_key TEXT NOT NULL,                   -- contracts/{org_id}/{contract_id}/original.{ext}
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL,                -- pdf|docx
  status TEXT NOT NULL DEFAULT ''processing'', -- processing|extracted|analyzing|analyzed|error
  extracted_text TEXT,
  uploaded_at INTEGER NOT NULL,
  analysis_completed_at INTEGER,
  FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (uploader_id) REFERENCES users(id)
);
CREATE INDEX idx_contracts_org ON contracts(org_id, uploaded_at DESC);
CREATE INDEX idx_contracts_status ON contracts(status);

-- 0004_analyses.sql
CREATE TABLE analyses (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  contract_id TEXT NOT NULL,
  risk_score INTEGER NOT NULL,            -- 1-10
  recommendation TEXT NOT NULL,           -- sign|negotiate|reject|attorney_review
  summary TEXT,
  clauses_json TEXT NOT NULL,             -- normalized clause array, also denormalized into flagged_clauses
  raw_response TEXT,                      -- full Claude response for debugging
  model TEXT NOT NULL,                    -- claude-sonnet-4-6
  input_tokens INTEGER,
  output_tokens INTEGER,
  cost_cents INTEGER,                     -- rounded for COGS tracking
  created_at INTEGER NOT NULL,
  FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);
CREATE INDEX idx_analyses_contract ON analyses(contract_id);
CREATE INDEX idx_analyses_org ON analyses(org_id, created_at DESC);
```

Other tables (sketched, not full DDL):

- `sessions` — `(id, user_id, token, expires_at)` for cookie auth (existing pattern)
- `magic_links` — `(token, email, org_id NULLABLE, expires_at, used_at)` 15-min TTL
- `flagged_clauses` — denormalized from `analyses.clauses_json` for filterable queries (existing structure from Masonry tool, add `org_id`)
- `clauses_library` — `(id, trade, state, clause_name, sub_side_position, kickback_email_template)` — global, not tenant-scoped
- `sub_agreements` + `gc_referrals` — port from Masonry schema, add `org_id`
- `subscriptions` — Stripe mirror: `(id, org_id, stripe_subscription_id, status, current_period_end, ...)`
- `events` — audit log: `(id, org_id, user_id, kind, payload_json, ts)`
- `settings` — per-org key/value (replaces global `settings` table from Masonry tool)

Indexes follow the rule: `(org_id, <sort_or_filter_key>)` on every queryable table.

---

## 4. API Surface

All routes live under `src/pages/api/` as Astro endpoints (Pages Functions). Auth middleware in `src/middleware.ts` enforces session + injects `org_id` into `locals`.

**Auth**
- `POST /api/auth/magic-link` — `{email}` → emails one-time link (no enumeration: always returns 200)
- `GET /api/auth/verify/:token` — consumes magic link, sets session cookie, redirects to `/dashboard`
- `POST /api/auth/logout` — clears cookie

**Contracts**
- `POST /api/contracts` — multipart upload → R2 PUT → D1 insert → returns 201, kicks off `waitUntil` extraction + analysis
- `GET /api/contracts` — list (org-scoped, paginated, filterable by status)
- `GET /api/contracts/:id` — detail with current analysis
- `POST /api/contracts/:id/retry` — re-trigger analysis
- `GET /api/contracts/:id/download` — signed R2 GET URL

**Analyses**
- `GET /api/analyses/:contract_id` — risk score + clauses + kickback email draft
- `POST /api/analyses/:contract_id/send-to-gc` — selected clauses + kickback email

**Org / billing**
- `GET /api/me` — current user + org + plan status
- `POST /api/billing/checkout` — Stripe Checkout session for $999/yr
- `POST /api/billing/portal` — Stripe Customer Portal redirect
- `POST /api/webhooks/stripe` — subscription.* + invoice.*, mirrors to D1

**Admin (Brian only, `role=''admin''`)**
- `GET /api/admin/orgs` — all orgs with plan + last activity
- `GET /api/admin/contracts` — cross-tenant
- `GET /api/admin/analyses` — cross-tenant
- `GET /api/admin/health` — daily-check endpoint (queue depth, error rate, AI cost MTD)

---

## 5. AI Pipeline

Donor code: `src/lib/parse.ts`, `src/lib/ai.ts`, `src/lib/analyze-contract.ts`. Reuse as-is, change three things:

1. **Prompt becomes parameterized by trade + state.** The current system prompt hard-codes "NC construction law" and "masonry-specific" framing. Refactor into a template that reads:
   ```
   You are reviewing a {trade} subcontractor agreement under {state} construction law.
   Apply these mandatory rules: {load from clauses_library WHERE trade=? AND state=?}
   ```
2. **Clause library lookup before the Claude call.** Pull the relevant `clauses_library` rows for `(trade, state)`, format as a system-prompt block, **cache it via Anthropic prompt caching** (`cache_control: {type: "ephemeral"}`). Hit rate will be near-100% within a tenant.
3. **Model upgrade.** Move from current Sonnet build to `claude-sonnet-4-6` (latest per global CLAUDE.md). Output schema unchanged — JSON with `{overall_risk_score, recommendation, summary, clauses[], kickback_email_draft}`.

**Pipeline (unchanged from Masonry tool, already battle-tested):**

1. `POST /api/contracts` → R2 PUT → D1 insert with `status=''processing''` → return 201 in <1s
2. `waitUntil`: fetch from R2 → unpdf or mammoth extract → write `extracted_text`, set `status=''extracted''`
3. `waitUntil`: trigger `/api/analyze/:id` (separate Function invocation gets its own 30s+ budget) → Claude call with 90s AbortController → write `analyses` row + `flagged_clauses` rows → set `status=''analyzed''`
4. Frontend polls `GET /api/contracts/:id` every 3s during analyzing state

**Cost ceiling.** Sonnet 4.6 at ~$3/M input, ~$15/M output. Average contract: 30 pages ≈ 12k input tokens; output ≈ 4k tokens. Per-contract: ~$0.04 input + ~$0.06 output = **~$0.10 / contract**. With prompt caching on the clause library, input cost drops further. At 12 contracts/customer/year, COGS = ~$1.20/customer/year. Well under the $0.30/contract ceiling.

---

## 6. Auth & Multi-tenancy

- **Magic link only.** No passwords (kills support burden, kills credential phishing). Same pattern as Ascend Systems CRM.
- Token format: 64-char URL-safe random (Web Crypto), 15-min expiry, single-use. **No double-underscores** anywhere in the URL path.
- Session cookie: `cr_session`, HttpOnly, Secure, SameSite=Lax, 30-day expiry. JWT signed via Web Crypto with rotated `JWT_SECRET`.
- **Middleware enforces tenant scoping.** `src/middleware.ts` resolves `(user_id, org_id)` from session and writes them to `Astro.locals`. Every D1 query in route handlers reads `org_id` from locals — never from a query param or body. A unit test asserts no route reaches D1 without first reading `locals.org_id` (or being explicitly admin-flagged).
- Admin role (`users.role=''admin''`) bypasses scoping. Only Brian''s email gets it, seeded manually.

---

## 7. Billing (Stripe)

- One product: `Contract Review SaaS — Annual` at $999/yr. Single price ID stored as `STRIPE_PRICE_ANNUAL`.
- **14-day trial, no card required.** Customer Portal opt-in mid-trial converts to paid.
- Trial reminders (Day 7, 12, 14) sent via SendGrid from a daily Pages Function cron.
- Customer Portal handles upgrade/cancel/payment-method updates. No support ticket required.
- Webhook events handled in `POST /api/webhooks/stripe` (Stripe signature verification mandatory):
  - `checkout.session.completed` → flip `organizations.plan=''active''`, store `stripe_subscription_id`
  - `customer.subscription.updated` → mirror status to `subscriptions` row + `organizations.plan`
  - `customer.subscription.deleted` → `plan=''canceled''`, retain data 90 days
  - `invoice.paid` → no-op
  - `invoice.payment_failed` → email org owner, set `plan=''past_due''`

---

## 8. File Handling

- Accept `application/pdf` and `application/vnd.openxmlformats-officedocument.wordprocessingml.document` only.
- **Magic-byte validation on upload** (PDF `%PDF-`, DOCX `PK\x03\x04`) — same check the Masonry tool ships with.
- Reject scanned-image-only PDFs in v1: if unpdf returns <500 chars from a >1-page PDF, mark `status=''error''` with message "Contract appears to be a scanned image. v1 supports text-extractable PDFs only."
- Max 10 MB per upload. Enforced on the Pages Function before R2 PUT.
- R2 keys: `contracts/{org_id}/{contract_id}/original.{ext}`. Original filename stored in D1 + R2 customMetadata. **No public access.** Signed GET URLs only, 15-min expiry.
- Retention: forever for paid orgs (the analyses are part of the product). 90-day auto-delete after trial cancellation, surfaced in Customer Portal copy and signup ToS.

---

## 9. Security

- Magic-link tokens: 64 chars, 15-min expiry, single-use. Tokens deleted on use.
- All R2 objects encrypted at rest (CF default).
- No public R2 access; signed downloads only.
- Rate limits: **5 contracts / minute per org**, **20 magic-link requests / hour per IP** (CF WAF rule, not application-level).
- E&O liability: every analysis response includes a "Not legal advice. Consult a licensed attorney for binding decisions." footer block. ToS click-through gate on signup (single checkbox + version string stored on `users` row).
- Audit log: every analysis read writes to `events` (`kind=''analysis_viewed''`). Compliance posture for future enterprise tiers.
- CSP headers via Astro middleware: `default-src ''self''`, no inline scripts in production.

---

## 10. Observability

- **Cloudflare Workers Analytics dashboard** for request volumes + p95 latency + error rate. Free.
- **Sentry free tier** for frontend (React error boundary) + Pages Function exceptions. DSN in env.
- **`GET /api/admin/health`** returns `{queued, processing, errored, cost_mtd_cents, signups_24h}` — Brian hits this daily.
- **Daily digest email** to Brian: new signups, trials starting, trials converting, cancellations, contracts analyzed, total Claude spend MTD. Sent via Pages Function cron at 8am ET.
- Structured `console.log` JSON events at: upload received, extraction complete, analysis started, analysis complete, Stripe webhook received, magic-link issued. Pipe to `wrangler pages deployment tail` during launch month.

---

## 11. Build Order (90 days)

| Week | Goal | Output |
|---|---|---|
| 1 | Brand + repo decision (Path A confirmed), neutral branding pass, schema migrations 0001–0004 applied, magic-link auth scaffolded, R2 binding renamed | Repo renamed, login flow works |
| 2 | Multi-tenant retrofit on every existing endpoint (`org_id` middleware, queries scoped, tests added) | Mike''s data lives under `org_carolina_masonry`, no cross-tenant leaks |
| 3 | Trade + state parameterization on the Claude prompt; `clauses_library` seeded for masonry-NC (port from existing standard_positions) | First non-masonry contract analysis works end-to-end |
| 4 | Clause library seeded for Trade #2 (drywall or electrical per market research) and 1 second state | Two-trade, two-state coverage |
| 5 | Stripe wired: $999/yr product, 14-day no-card trial, Customer Portal, webhook handler, subscription mirror table | Org can self-serve upgrade and cancel |
| 6 | Marketing landing page (1 page Astro), free risk-score lead magnet, GA4, magic-link signup live | Public URL accepting signups |
| 7 | Mike migrates: his single-tenant tool data is the same DB, login flips to magic-link, branding goes neutral | Mike using the SaaS as his daily tool |
| 8-9 | Outbound to first 50 trial users (per marketing plan) | 5-15 trials active |
| 10-11 | Trial-to-paid sequence (Day 7/12/14 emails + Customer Portal nudge) | First 3-5 paying customers |
| 12-13 | Stress test, fix, iterate. Add Trade #3 if a paying customer needs it. | $3k+ ARR booked |

---

## 12. NOT in v1 (build later)

- Native mobile app — laptop primary, web responsive only
- Word redlining (.docx output) — copy-paste from analysis report is fine v1
- Multi-language — English only
- Project tracking, scheduling, change orders — that''s Procore territory
- Scanned-PDF OCR — reject at upload, require text-extractable
- Custom AI training on customer data — defer until 50+ paying
- SSO / SAML — defer until first enterprise deal
- Per-seat billing — org-level only in v1

---

## 13. Open Technical Questions (Brian decides before Week 1)

1. **Repo path:** confirm Path A (rename `app-masonry-contract-review` → `app-contract-review-saas`). Recommend yes.
2. **Brand name + domain:** needed before Week 1 marketing landing page. Recommendation in `MARKET-RESEARCH.md`.
3. **Workspace billing model:** org-level flat $999/yr (recommended for v1) vs per-seat. Recommend org-level — kills accounting complexity for 5-50 employee shops.
4. **DOCX extraction without mammoth:** mammoth ships and works in CF Workers via the `arrayBuffer` workaround, but the monorepo CLAUDE.md flags it as risky. Options: (a) keep mammoth with the workaround (currently shipping, no failures reported), (b) switch to `docx4js` or a CF-friendly fork, (c) reject DOCX in v1 and require PDF only. Recommend (a) — it works, don''t fix what isn''t broken.
5. **Auth fallback:** magic-link only (recommended) or add password as backup for users who hate email-based login? Recommend magic-link only — every password is a support ticket waiting to happen.
6. **Trial card requirement:** no card (recommended, friction-free) or card-up-front (higher conversion, lower trial volume)? Recommend no-card for first 50 trials, then revisit based on conversion rate.
7. **Data export on cancellation:** offer CSV/JSON dump of all contracts + analyses? Recommend yes — it''s a 4-hour build and kills "I can''t leave you" objections.
8. **Sub-agreement + GC kickback features in v1:** the Masonry tool ships these, do they make it into the SaaS launch? Recommend yes — they''re already built and Mike''s #1 reason for using the tool. Keep them on Trade #1, port to other trades as customers ask.
', 32, 'app-contract-review-saas/tasks/TECHNICAL-SPEC.md'
FROM projects WHERE name = 'Contract Review SaaS' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'PRD', '# PRD: Contract Review SaaS (working title)

> [!info] Status: **New product. Multi-tenant rebuild of `app-masonry-contract-review`.**
> Owner: Brian Mangum / LIGHTHOUSE 27 LLC · Created: 2026-05-04
> Predecessor: [`app-masonry-contract-review`](../../app-masonry-contract-review/) — single-tenant tool for Mike at Carolina Masonry & Concrete. Demo at `app-masonry-contract-review.pages.dev`. Already does upload, NC-tuned AI risk analysis, GC kickback emails, sub-agreement drafts, e-sign.

---

## TL;DR

A trade-agnostic contract review SaaS for subcontractors — upload a GC contract, get an AI risk report tuned to their trade and state, plus a soft-toned redline email to send the GC. Buyer is the owner or office manager of a 5–50 employee sub shop ($1M–$20M revenue). It wins because no one else builds for the sub side of the table — every adjacent tool (LinkSquares, Ironclad, Spellbook) is priced and positioned for the GC, the developer, or the law firm.

---

## Problem

Subcontractors sign contracts they shouldn''t, miss traps that cost them five figures, and pay $300–500/hr to attorneys for review they only do half the time. Examples from Mike''s deal flow:

- **Pay-if-paid clauses** — unenforceable in NC but written into ~60% of GC contracts. Sub signs, GC''s owner stiffs the GC, sub eats the loss thinking it''s legit.
- **Retainage above 5%** held indefinitely — on a $400k contract, 10% retainage held a year past completion = $40k frozen working capital.
- **Indemnification overreach** — broad-form indemnification is void in NC but signed weekly by subs who didn''t read clause 14.
- **Lien waivers signed before payment hits** — once signed unconditionally, the sub surrenders its only leverage on slow-paying GCs.
- **Change-order traps** — 7-day notice windows with deemed-waiver language. Miss the window, lose the right to charge. Mike got burned for $60k.
- **Plan revisions buried in addenda** — bid off June 1 plans, contract references "latest revision" dated August 15 with $80k of added scope.
- **Unbalanced change-order pricing** — markups capped on additive, no floor on deductive. Heads-they-win.

Cost of one clause going wrong: **$10k–$80k.** Cost of one attorney review: **$1,000–$2,500.** Cost of this product: **$999/year for unlimited reviews.**

Audience: ~700,000 subcontractor businesses in the US. The 5–50 employee band is the sweet spot — weekly contract flow, no in-house lawyer.

> Cheapest validation test: 5 phone calls to non-Mike NC subs. If <3 say "yes, can I see it now," the pain isn''t what we think.

---

## ICP

**Primary buyer.**

| Attribute | Detail |
|---|---|
| Trade | Any specialty trade — masonry, drywall, electrical, plumbing, roofing, concrete, framing, HVAC. Launch: masonry + 2 others by month 6. |
| Shop size | 5–50 employees, $1M–$20M revenue |
| Role | Owner-operator or office manager. Owner buys, office manager runs the daily upload. |
| Geography | NC at launch, multi-state from day 1 (Mike works projects in SC; trades cross state lines constantly) |
| Tech comfort | Uses Procore or QuickBooks. Has email, can upload a PDF, can''t write a system prompt. |
| Contract volume | 3–15 contracts/month |
| Where they hang out | NUCA (utility contractors), AGC chapters, ASA (American Subcontractors Association), trade-specific Facebook groups, Procore user community, local mason/electrician/plumber associations |
| Why they don''t have this already | Off-the-shelf legal AI is built for GCs or law firms. ChatGPT misses state law. Their attorney is fast but expensive. |

**Disqualified:** GCs (different needs, different price point), law firms (different software entirely), residential remodelers (deal sizes too small), sole proprietors (volume too low).

> Cheapest validation test: post a clipped, redacted sample report in r/Construction or r/Contractors before writing a single line of multi-tenant code. If the comments are "where do I sign up," the ICP is real.

---

## JTBD

1. **When a GC sends me a 50-page contract, I want a risk report in 5 minutes, so I can decide whether to push back, sign, or walk before the bid window closes.**
2. **When I spot a clause that smells off, I want exact counter-language I can paste into an email to the GC, so I can negotiate without paying my attorney $400 for one paragraph.**
3. **When the GC sends a revised contract, I want to know what changed, so I don''t have to re-read 50 pages to find the buried edits.**
4. **When I hire my own subs, I want to generate a sub-agreement that flows down GC terms plus my safety/equipment standards, so I''m not exposed if they screw up onsite.**
5. **When my attorney is reviewing flagged items, I want to send him a clean summary with the contract attached, so I''m paying for his judgment, not for him to read 50 pages.**

---

## Product (multi-tenant rebuild requirements)

The single-tenant masonry tool is ~80% reusable. The rebuild adds the multi-tenant layer, trade abstraction, billing, and self-serve onboarding. **Do not rewrite working AI logic, parsing, or e-sign.**

### Workspace / org model
- D1 sketch: `orgs` (id, name, trade_primary, state_primary, plan, stripe_customer_id, created_at) → `users` (id, org_id, email, role) → existing `contracts`, `flagged_clauses`, `sub_agreements` get `org_id` FK
- Every existing query gets `AND org_id = ?`. Audited by a `grep` test in CI.
- Roles: Owner (billing + invites), Reviewer (upload/analyze/send), Viewer (read-only)

### Auth
- **Magic link** — no passwords. Subs aren''t security pros; reset tickets would eat us alive.
- SSO deferred to month 6 — only if a paying customer asks.

### Trade selection at signup
- User picks 1 primary trade + up to 2 secondary during onboarding
- Trade loads matching clause library + system prompt overlays
- Trade-change supported but logged

### Clause library architecture
- Per-trade × per-state matrix, versioned. Markdown files in repo, not DB rows — easier to diff and ship.
- Structure: `clause-library/{trade}/{state}/{clause-type}.md` — each has rule, default risk level, citation, counter-language template
- Base state layer loads for every trade in that state; trade overlay loads on top
- Adding a state or trade = drop in a folder. No code change.

### Analysis report customization per trade
- Trade-specific risk categories surface higher (scaffolding indemnity for masonry, moisture warranty for roofing)
- Plan-revision-date and hidden-clause detection stay — universal
- Risk score, recommendation, redline view: identical UX across trades

### Billing
- Stripe annual $999/yr, Customer Portal for self-serve cancel/upgrade
- 14-day free trial, **card required at start** (LoveNotes lesson)
- Referral codes: `MIKE99` → 10% off first year, referrer gets $99 credit
- Annual lockup only in V1. Monthly tier only if churn justifies it.

### Self-serve onboarding
- Sign up → magic link → trade + state pick → upload first contract → first analysis in <5 min
- Onboarding ends at first risk report seen, not at account creation
- North star: time-to-first-report. If >10 min for a real user, fix before anything else.

### Admin dashboard (Brian''s view)
- Auth-gated `/admin`, owner-only
- Per-org: signup, last analysis, # contracts, MRR, NPS
- Across-org: cohort retention, churn warning list (no analysis in 21 days)
- Ugly table is fine. Not a customer surface.

### Customer dashboard
- Inherit from masonry tool: contract list, status, risk badges, sub-agreement count
- Add: org usage stats ("14 contracts reviewed YTD, $X in attorney spend avoided")

### E-sign + GC kickback emails
- Port verbatim from masonry tool. They work. No rebuild.
- One change: "from" becomes `{org-name}@notifications.[brand].app` instead of hardcoded.

> Cheapest validation test per feature: ship smallest version that works for Mike, watch next 2 trial users before fancier version. The masonry tool already proved the engine.

---

## Pricing & Tiers

**Recommendation: stay flat at $999/year for V1. Do not introduce tiers until churn or willingness-to-pay data forces the question.**

| Tier | Price | Why we''re not doing it yet |
|---|---|---|
| Solo | $499/yr | Adds support burden, doesn''t move the needle. Subs at this price band probably aren''t ICP. |
| Crew (V1) | **$999/yr** | One simple price. Unlimited reviews. Up to 5 seats. |
| Multi-office | $2,999/yr | Premature. Build it when a customer asks. |

**Free trial:** 14 days, **card required at signup**. Aligns with LoveNotes'' resolved decision — free destroys the cognitive trigger. The trial is "feel one full review cycle before the card hits."

**Founding-customer pricing (first 10 paying customers):** $599/yr lifetime lock. They become the testimonials. Mike does NOT count toward this — he''s a free validator, not a customer.

**Partner / referral pricing:**
- NUCA member discount: 15% off first year ($849) if we can get an endorsement letter — cheap test, big logo
- Trade association affiliate: 10% rev share to associations that send signups (track with referral codes)
- Insurance broker referral: brokers serving subs get a $100 spiff per closed account

> Cheapest validation test for pricing: post the price publicly on the landing page and watch trial start rate. If trial-starts-per-visit < 2%, the price is wrong or the messaging is wrong. Don''t run a survey.

---

## Kill Criteria

Evaluated weekly. These are the numbers that decide, not vibes.

| Day | Threshold | Action |
|---|---|---|
| **30** | <10 free trials started | **Hard kill.** ICP isn''t reachable, message isn''t landing, or we''re invisible. Stop building. |
| **30** | 10–20 trials, <2 actively analyzing contracts (not just signed up) | Soft warning — the trial UX is broken. Fix or kill at 60. |
| **60** | <3 paying customers (post-trial conversion) | **Hard kill.** Trial-to-paid is broken or the product doesn''t earn $999. |
| **60** | 3–5 paying, <60% NPS positive | Soft warning — product gap. One more month to fix. |
| **90** | <$1,500 MRR (≈18 paying annual at $999) | **Hard kill.** Move budget to next portfolio bet. |
| **90** | $1,500+ MRR + retention signal | Continue, double down on trade #2 expansion. |

These are written here so we don''t fall in love with the build. The masonry tool taught us building is easy. Selling is the test.

---

## 6-Month Plan

| Month | Goal | Deliverables |
|---|---|---|
| **M1** (May) | Multi-tenant rebuild + Mike migrates over | `orgs` schema + `org_id` everywhere, magic-link auth, trade picker, masonry clause library externalized, Mike''s data migrated, billing dormant. Mike formally agrees to use the SaaS version (this starts the 90-day clock). |
| **M2** (June) | Self-serve onboarding + 5 free trial users | Stripe live ($999/yr, 14-day trial, card required), onboarding flow, time-to-first-report < 5 min, landing page, 5 trial signups from cold outreach to NC subs |
| **M3** (July) | First 3 paying + trade #2 starts | Convert 3 trials to paid (founding pricing $599 lifetime), pick trade #2 from research signal (drywall vs electrical vs roofing — TBD), build that clause library |
| **M4** (Aug) | Trade #2 live + 6 paying total | Trade #2 launches publicly, target 3 more paid signups in trade #2, NUCA outreach starts |
| **M5** (Sep) | Trade #3 + 10 paying | Trade #3 added (whichever ICP signal is strongest from M3–M4), 10 paying total, attorney redline training pipeline live (Story 17 from masonry tool) |
| **M6** (Oct) | Trade #4 + 25 paying / ~$2,500 MRR | Trade #4, association partnership signed (NUCA or AGC chapter), version-comparison feature shipped (Story 14), 25 paying at blended ~$800 average = $1,650+ MRR. Decision: continue or kill. |

---

## Resolved Decisions

| # | Decision | Why |
|---|---|---|
| 1 | **Multi-state from day 1** | Subs work across state lines. Per-state buildout is dead time. State logic lives in the clause library, not in code. |
| 2 | **Annual subscription, not per-contract** | Per-contract pricing makes the buyer flinch on every upload. Annual = budget once, use freely. Lower cognitive friction = higher usage = stickier. |
| 3 | **Trade-agnostic with per-trade clause libraries** | One product, many trades. Clause library is the moat — code is the substrate. |
| 4 | **Mike is validator, not customer** | He gets free access for life. He owes us testimonials, intros, and brutal feedback. He does not owe us $999. |
| 5 | **90-day clock starts after Mike formally agrees to use the rebuilt SaaS version** | Migration risk is real. We don''t start counting until he''s actually on the new system. |
| 6 | **Magic link auth, no passwords** | Subs aren''t security pros. Password reset tickets would consume support. |
| 7 | **Card required at trial start** | LoveNotes proved free is a trigger killer. Friction filters serious buyers in. |
| 8 | **Port masonry tool''s analysis engine, e-sign, GC email — do not rewrite** | They work. Mike validated them. Rewriting is gold-plating. |

---

## Open Questions for Brian

These need answers BEFORE writing more code:

1. **Brand name.** "Contract Review SaaS" is the working title. Candidates: SubShield, RedlineSub, ClauseGuard, SubContractIQ. **Cheapest test:** buy the top 2 domains, run a 1-week landing page split test on $50 of Reddit ads, pick the one with higher click-to-trial-start rate.
2. **Domain.** Tied to brand pick. Avoid `.io` (signals dev tool, not contractor tool). Prefer `.com` or `.app`. Budget: ~$2k for a clean .com.
3. **LLC / business entity.** Stand it up under Lighthouse 27 LLC as a DBA, or spin a new LLC for liability isolation? **Recommendation:** new LLC. AI legal-adjacent product = real liability surface. Cost: ~$125 NC filing + $400 attorney review = trivial vs. exposure.
4. **Insurance — E&O coverage.** Almost certainly yes. Quote first from Hiscox or Next Insurance — tech E&O policies for AI products run ~$1,200–2,500/yr. **Do not launch billing without a bound policy.**
5. **Disclaimer language.** "Not a lawyer; not legal advice; output is informational only; consult licensed counsel." Run pre-launch through a NC construction attorney (1 hr at $400 = $400 sunk cost, kills 90% of liability). Display in onboarding, in every analysis report header, in the footer of every email.
6. **Trade #2 priority.** Drywall vs. electrical vs. roofing first? **Cheapest test:** post the same offer ("AI contract review for [trade] subs, NC, $999/yr") in three trade-specific Facebook groups. Whichever generates the most replies/DMs in 7 days wins. Don''t pick on instinct — let signal pick.
7. **Mike commitment.** Does he sign anything? **Recommendation:** yes, a one-page free-tier user agreement. Spells out: he gets it free for life, he owes us 1 testimonial + 1 referral intro per quarter, he agrees to use it for 6 months minimum, his data stays his. Protects both sides. Friendly to sign.

---

> [!tip] **Bottom line**
> The masonry tool is the proof. The SaaS rebuild is the business. The hard part isn''t multi-tenant code — it''s selling 25 sub shops on $999/yr in 90 days. Every section above names the cheapest test before the build, because the lesson from LoveNotes V1 is that building before validating costs months and $0 in MRR. Decisions get made by the kill-criteria table on day 30, 60, and 90 — not by how much we love the product.
', 33, 'app-contract-review-saas/tasks/PRD.md'
FROM projects WHERE name = 'Contract Review SaaS' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'Marketing Plan', '# MARKETING-PLAN.md — Contract Review SaaS

**Audience:** Subcontractor business owner / office manager, 5-50 employee shops, any trade.
**Geography:** NC at launch, SE US (NC/SC/GA/VA/FL/TN) by Day 60, multi-state day one.
**Pricing:** $999/yr.
**Founding validator:** Carolina Masonry & Concrete (Mike — free).
**Goal:** 50 free-trial signups (Day 45) → 5 paying customers (Day 90) → product-market signal.
**Resource budget:** 5 hr/wk. Reuse SCDMV press playbook + RecordStops drip stack + email-outreach-agent skill.

---

## Phase 1 — Foundation (Weeks 1-2, before any outbound)

### Brand decisions

Top 5 domain candidates (all .com or .ai — check availability before deciding):

| Name | Reasoning |
|---|---|
| **subclause.com** | Two-syllable, memorable, says exactly what it does (sub + clause). |
| **rebar.legal** | Construction metaphor ("rebar in your contract"); .legal TLD signals authority without claiming legal practice. |
| **paywhenpaid.com** | Owns the most-feared clause as the brand; high SEO match. |
| **contractsentry.com** | "Sentry" = guard; clear function. |
| **trade-armor.com** | Direct: armor for the trades. Memorable, slight risk of feeling defensive. |

**Recommendation:** `subclause.com` if available; `paywhenpaid.com` as fallback (it''s a search-magnet brand).

Brand voice: stoic, direct, blue-collar professional. No "AI-powered platform" language anywhere. Speak like the foreman who reads contracts at the kitchen table on Sunday night.

### Landing page (single page, no full site yet)

Five sections, in order:

1. **Hero** — Headline: "Read your contract before it reads you." Sub: "AI catches the clauses that cost subs money — pay-when-paid, indemnification, retainage traps. 30 seconds, free." CTA: "Score my contract free →"
2. **Live risk-score demo** — drag-drop a PDF, get color-coded clause callouts in 30 sec. The lead magnet is the hero, not a separate page.
3. **The seven clauses that hurt small shops** — short, scrollable list with one-line plain-English explanations. SEO juice + proof of authority.
4. **Founder + Mike** — single paragraph: "Built with my cousin''s masonry shop after a $40K change-order dispute. Now any subcontractor can run a contract through it." One photo. No corporate-team-stock-photo grid.
5. **Pricing + email capture** — $999/yr, single tier. Free trial: 3 contracts reviewed before card required. Logos of trade associations as soon as we have them.

### Lead magnet

**Free Contract Risk Score in 30 seconds.** Upload a PDF, get a single 0-100 score + the top 3 risk flags inline. Email gate to unlock the full clause-by-clause report. This converts at 5-10x a free-trial CTA because it delivers value before signup. Use it everywhere — Reddit posts, Twitter threads, association emails, podcast pitches.

### Tracking & legal

- GA4 + Google Search Console wired Day 1
- Meta Pixel + LinkedIn Insight tag installed even before paid spend (data hygiene)
- PostHog or Plausible for product event tracking (upload, score viewed, email captured, trial-start, trial-end, paid)
- Disclaimer on every report and on landing page footer: **"This tool is for informational purposes and does not constitute legal advice. Consult a licensed attorney before signing any contract."** Same line in every email. Same line in the report footer.

---

## Phase 2 — Launch (Weeks 3-6, target 50 free-trial signups)

### A. Trade association partnerships (highest leverage)

State chapters in NC/SC/GA/VA/FL/TN for: NUCA, ABC, NRCA, MCAA, NECA, PHCC, SMACNA. ~40 chapters total.

The play: free 1-year membership for the first 50 partner-channel signups in exchange for one newsletter mention + association logo on landing page. Frame it as "we''re vetting with your members, not selling to them yet."

**Sized actions:**
- 2 hrs (Week 1) — research executive director email for each chapter, build CSV
- 1 hr/wk Weeks 2-12 — 10 personalized emails per week (50 hrs of leverage capacity, 5 hrs of work)
- **Kill if:** zero association responses by Day 60 → drop to 1 outreach hr/mo, focus elsewhere.

### B. Reddit + niche communities

Trade-by-trade post shape (avoid the "I built a thing" tone):

| Sub | Post shape that works |
|---|---|
| r/Construction (1.4M) | Clause teardown thread: "Read 100 sub contracts. Here are the 7 lines that hurt small shops the most." Image of redacted contract clauses, plain-English breakdown in comments. |
| r/Plumbing | "Why your pay-when-paid clause is killing your cash flow (and the one-line edit that fixes it)." |
| r/Electricians | "The indemnification clause that GCs slip into 80% of electrical sub contracts." |
| r/HVAC | "Retainage 101: how to negotiate the 10% your GC is holding hostage." |
| r/Roofing | "Change-order language that gets roofers paid (or doesn''t)." |
| r/Carpentry | "Liquidated damages — read this before you sign your next framing contract." |

Same post shape: useful clause teardown first, link to free risk score in last line ("If you want to run your own contract through the tool I built for this, link''s in my profile"). Lurk, build karma, post Tuesday-Wednesday mornings.

Find 10 trade-state Facebook groups (e.g., "NC Plumbers and Pipefitters", "Carolina HVAC Contractors") — same clause-teardown pattern, no link in first post.

**Sized:** 2 hrs/wk for posts + replies. **Kill if:** <5 trial signups attributable to Reddit by Day 60.

### C. SEO programmatic (long-tail, compounds)

Two templates, generated from a small data table:

**Template 1 — Trade × State landing pages.** Slug: `/[trade]-subcontractor-contract-review-[state]/`. 8 trades × 6 states = 48 pages. Each 600-900 words, includes state-specific clause notes (NC mechanics'' lien rules, FL pay-when-paid statute, etc.) + sample risk-score embed. Real value, not thin.

**Template 2 — Clause glossary.** Slug: `/clauses/[clause-name]/`. 12 high-search clause terms: pay-if-paid, pay-when-paid, retainage, indemnification, lien waiver, change order, liquidated damages, no-damages-for-delay, flow-down, additional insured, mutual waiver of subrogation, mechanics lien. Each 800-1,200 words: plain English → why it hurts subs → sample edit → state variations.

**Target:** 50 pages indexed by Day 60. Build in batches of 10 over 5 weeks. Schema.org `LegalService` + `FAQPage` markup on every page. **Kill if:** zero indexed by Day 30 (means technical SEO is broken, fix before more pages).

### D. Direct outbound — the SCDMV playbook

NC Licensing Board (`nclbgc.org`) lets you export licensee lists. Pull the 50 largest subs across our 8 trades — sort by license type and city, filter to companies with >5 employees (proxy via online presence).

Email template (proven shape from SCDMV pitch — "developer with [industry] ties"):

> **Subject:** Free contract review for [Company name] — quick favor
>
> Hi [Name],
>
> My cousin Mike runs Carolina Masonry & Concrete in [Mike''s city]. Last year he got hit with a $40K change-order dispute he could''ve caught upfront if he''d flagged one clause.
>
> So I built a tool that reads subcontractor contracts in 30 seconds and flags the clauses that cost small shops money — pay-when-paid, indemnification, retainage, the usual suspects.
>
> I''m giving the first 50 NC subs a free year while we calibrate it on real contracts. No card, no demo call. Just upload a contract you''ve signed and see what it catches.
>
> [Link]
>
> If it''s useful, tell me. If it''s not, tell me what''s missing.
>
> — Brian
> Built with subcontractors, not at them.

5 emails/day × 50 days = 250 sent. Use the email-outreach-agent skill for personalization at scale. Track replies in a Google Sheet (same shape as RecordStops outreach log).

**Sized:** 30 min/day. **Kill if:** <5% reply rate by Day 30 (industry baseline is 8-12% for personalized B2B; below 5% means the pitch is wrong).

### E. Press & podcast

Trade pubs to pitch:
- **ENR (Engineering News-Record)** — tech beat reporter
- **Construction Dive** — small-business / labor beat
- **ConstructConnect News** — contracts & legal section
- **NC Builder magazine** (NCHBA) — local angle
- **For Construction Pros** — trade-tech vertical

Construction-tech podcasts:
- **The Construction Tech Talk**
- **Bridging the Gap (BIM-focused but covers tech)**
- **IBSx Daily**
- **The ConTechCrew**
- **ConTechTrio**

Pitch angle (single shape, customize per pub):

> **Subject:** Cousin built free legal-review tool for cousin''s masonry shop — now used by [X] trades
>
> [Reporter],
>
> A subcontractor owner watches a $40K change-order dispute unfold. His cousin happens to build software. Six months later, the tool reading his contract is reading contracts for [X] subs across [Y] trades.
>
> The story isn''t the AI — every founder pitches AI. The story is what 100 subcontractor contracts told us about what''s broken in commercial construction. Pay-when-paid is in 80%+. Indemnification is buried in legalese. Small shops sign because they need the work.
>
> I have the data, the redacted clause examples, and Mike (the cousin) on standby for an interview.
>
> Worth 15 minutes?

**Sized:** 1 hr to write the pitch, 30 min/wk to send 3 personalized versions. **Kill if:** zero responses by Day 60.

### F. Founder content — Brian''s existing channels

- **X thread (Crown & Compass + jbmangum.com):** "I read 100 subcontractor contracts. Here are the 7 clauses that hurt small shops." One clause per tweet, one chart per clause. End: link to free risk score. **Schedule for Tuesday 9 AM ET.**
- **LinkedIn long-form:** Same content, repurposed. Lead with Mike''s story. Ends with the risk-score link.
- **Substack:** "We Reviewed 100 Construction Contracts" — full teardown. 1,500-2,000 words. Becomes the canonical asset everything else points to.

**Sized:** 4 hrs to write the substack post (the parent asset). 30 min each to repurpose into thread + LinkedIn. Repost every 30 days with updated stats.

---

## Phase 3 — Convert (Weeks 7-12, target 5 paying)

### Trial-to-paid sequence (7 emails / 14 days)

| # | Day | Subject | Summary |
|---|---|---|---|
| 1 | 0 | Your contract score is in | Deliver score + top 3 flags + CTA to read full report |
| 2 | 2 | The clause your GC hopes you don''t catch | Education piece — pay-when-paid deep dive |
| 3 | 4 | Mike''s $40K mistake (and the fix) | Founder story, social proof |
| 4 | 7 | 3 contracts down, 7 to go this year | Volume framing — show ROI of reviewing every contract |
| 5 | 10 | What $999/yr buys vs. one bad contract | Direct math: avg dispute cost vs. annual fee |
| 6 | 12 | Trial ends in 48 hours | Soft urgency, what they lose |
| 7 | 14 | Last call + 30-day money back | Reverse risk, single CTA |

### Mike''s case study

After 30 days of Mike using the tool: redact a real contract he flagged, write up what was caught, what the dispute would''ve cost, what he negotiated instead. One-page PDF + 600-word web version. Hosted on landing page. Linked in every cold email after Day 30.

### Win-back sequence (4 emails / 30 days)

| # | Day | Subject |
|---|---|---|
| 1 | T+7 | Did the tool miss something? |
| 2 | T+14 | Here''s what we shipped this month |
| 3 | T+21 | One contract, one year of reviews — $99 trial |
| 4 | T+30 | Closing your account unless you say otherwise |

The $99 win-back is the only price discount we run. Don''t discount the annual rate publicly.

---

## Phase 4 — Scale (Months 4-6, $5K MRR target)

The doubled-down channel will be whichever one cleared CAC < $200 in Phase 2. Best bets based on the SCDMV / RecordStops experience:

1. **Direct outbound** — SCDMV''s press shape converted because it was specific, personal, and asked for nothing. Same shape works for B2B subcontractor outreach.
2. **Trade association** — if even one chapter says yes, the newsletter blast is a 10x lever (associations have 500-5,000 member shops each).
3. **Programmatic SEO** — slow build but compounds. By Month 6, 100+ pages indexed = ongoing free trial flow.

**Affiliate program for trade associations:** $200/customer for any association that drives 5+ paying members in a calendar quarter. Soft launch in Month 4, only after we have proof of a single chapter generating signups organically.

**Multi-trade content library:** the glossary becomes the SEO moat. Every clause page links to every relevant trade page and back. By Month 6, target 200 indexed URLs.

---

## Channel ranking by expected $/hr (first 90 days)

| Rank | Channel | Why this rank |
|---|---|---|
| 1 | Direct outbound (50 NC subs) | SCDMV proved it. 5 hrs of personalized emails landed press, signups, and one paid customer. Reproducible. |
| 2 | Trade association partnerships | Single yes = 1,000-shop newsletter. 10x leverage on each accepted email. |
| 3 | Founder content (Substack + X thread) | Compounds. The 100-contract teardown is an asset that can be reposted, podcast-pitched, and quoted for years. |
| 4 | SEO programmatic | Slowest payoff, highest ceiling. Don''t expect signups until Day 90+. |
| 5 | Reddit + Facebook groups | Real but inconsistent. Spike-and-fade. |
| 6 | Press / podcast | Lottery ticket. One ENR feature changes everything; expected value is low until Mike''s case study exists. |

---

## Skip list (don''t bother)

- **Paid Google Ads.** CAC for B2B SaaS in legal-tech runs $300-600/lead pre-product-market-fit. We don''t have the conversion data to make ads pay back at $999/yr until Month 4+.
- **TikTok / Instagram Reels.** Audience mismatch. Subcontractor owners are on Facebook groups and email — not TikTok.
- **Generic SaaS directories** (Capterra, G2, GetApp). Pay-to-play for low-intent traffic. Revisit at $50K MRR when reviews matter.
- **Cold LinkedIn DMs.** Lower reply rate than email for this audience. Use LinkedIn for content, not outbound.
- **Conferences (CONEXPO, World of Concrete) until Year 2.** $5K-$15K booth costs, no ROI without case studies.
- **Building a partner ecosystem (Procore, Buildertrend integrations).** Premature. No customers = no leverage in those conversations.

---

## KPIs (weekly tracking — single Notion table)

| Metric | Why | Target by Day 90 |
|---|---|---|
| Free trial signups | North star top-of-funnel | 50 |
| Lead magnet → trial % | Funnel hygiene | 30% |
| Trial → paid % | Product-market signal | 10% |
| Paying customers | Truth | 5 |
| MRR | Truth (annualized) | $416/mo equivalent |
| CAC by channel | Channel efficiency | <$200 anywhere paid is on |
| LTV / churn | Track from Day 1 | n/a yet, but log every cancel reason |
| Cold email reply rate | Pitch fitness | 8-12% |
| Indexed SEO pages | Content engine | 50 |
| Pages with impressions in GSC | Search visibility | 25 |

Review every Monday morning. 30-min standup with myself.

---

## One-page launch checklist (paste as separate CRM resource)

### Pre-launch (Weeks 1-2)
- [ ] Domain registered + DNS pointing
- [ ] Landing page live with 5 sections
- [ ] Risk-score lead magnet functional end-to-end (upload → score → email gate → full report)
- [ ] GA4 + Search Console + Pixel installed
- [ ] Disclaimer on landing page, report, all emails
- [ ] Mike''s onboarding done — first 5 of his contracts scored
- [ ] Cold email template approved
- [ ] CRM tracking sheet built (50 NC subs, 40 association chapters)
- [ ] Substack draft of "100 Contracts" post

### Launch week (Week 3)
- [ ] Substack "100 Contracts" published Tuesday
- [ ] X thread same Tuesday 9 AM ET
- [ ] LinkedIn long-form same week
- [ ] First 10 cold emails sent (NC subs)
- [ ] First 5 trade association emails sent
- [ ] First Reddit clause teardown post (r/Construction)

### Post-launch (Weeks 4-6)
- [ ] 50 cold emails/wk maintained
- [ ] 10 association emails/wk
- [ ] 1 Reddit post per trade per week
- [ ] 10 SEO pages indexed
- [ ] First press pitch sent (ENR + Construction Dive)
- [ ] First podcast pitch sent (3 shows)
- [ ] First trial-to-paid sequence triggered

### Steady state (Weeks 7-12)
- [ ] Mike case study published Day 45
- [ ] 50 SEO pages live by Day 60
- [ ] Monday metrics review every week
- [ ] Win-back sequence running for expired trials
- [ ] Channel kill-or-double decision Day 60
- [ ] First paying customer by Day 75
- [ ] 5 paying customers by Day 90

---

*Compiled May 4, 2026. Review and revise Day 30, Day 60, Day 90.*
', 34, 'app-contract-review-saas/tasks/MARKETING-PLAN.md'
FROM projects WHERE name = 'Contract Review SaaS' LIMIT 1;
