-- =============================================================================
-- Import: project resources from app-spamblocker → "Ringdocket"
-- Generated: 2026-05-05T16:23:35.334Z
-- Run:  wrangler d1 execute ascend-db --remote --file=worker/db/seeds/2026-05-05-import-app-spamblocker.sql
--
-- 9 resources found.
-- =============================================================================

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'PRD', '# Ringdocket — Spam Call Blocker PRD

**Working name:** Ringdocket (final domain TBD — see §22 Open Questions)
**Owner:** Brian Mangum
**Status:** Pre-development — PRD locked April 18, 2026
**Build ready to start:** Yes, pending answers to §22 Open Questions
**Document version:** v2.0 (supersedes v1.0 / 2026-04-18)

> [!info] How to read this document
> This PRD is the consolidated output of a four-phase process:
> - **Phase A** — Foundation (competitive research, stack architecture, PRD clarifications, domain, pricing, verification).
> - **Phase B** — Concept hardening (marketing psychology, security/privacy review, marketing plan, owner decisions).
> - **Phase C** — Design (aesthetic direction, Forensic Ledger Light design system, iPhone mockups).
> - **Phase D** — Assembly (this document).
>
> Supporting artifacts live at `/Users/jbm/new-project/app-spamblocker/prd-build/` and `/Users/jbm/new-project/app-spamblocker/.flowy/`. When this PRD summarizes a longer artifact, the artifact is the source of truth for the fine detail. When this PRD decides something, this PRD is the source of truth.

---

## 1. Vision

A spam blocker that shows users what scam a blocked call was part of, who else got hit by it, and what is being done about it. Users subscribe for peace of mind from unlimited blocking. They stay for the ledger — a civic record of named campaigns, corroborated reports, carrier attribution, and enforcement status that no competitor surfaces.

The internal strategic frame is a civic accountability product packaged as a consumer utility. The external frame, in all user-facing surfaces, is utility first. The word "disguised" never appears in copy. The civic identity is something the user grows into, not something we recruit them into.

## 2. Problem Statement

Americans receive billions of spam and scam calls a year. Every major blocker — Truecaller, Hiya, RoboKiller, YouMail, Nomorobo, Call Control — markets on unverifiable block-rate claims ("stops 99% of robocalls"). Users report spam numbers into these apps and never hear back. No competitor closes the loop. No competitor tells the user which scam campaign a blocked call belongs to, which carrier routed it, or whether a report contributed to anything.

The public data that would answer those questions — FTC Do Not Call complaint feed, FCC Robocall Mitigation Database, Industry Traceback Group public records, FCC enforcement press releases — is freely available and consumer-invisible. The product opportunity is not detection; it is surface.

## 3. Target User

**Primary:** US adults ages 30 to 65 who receive frequent spam calls, have tried at least one blocker app already, and are frustrated that their reports disappear into a black box. Skews iOS for V1 because iOS users pay more for subscriptions and the platform surface is smaller to harden.

**Secondary:** The roughly 20% "power reporter" segment — civically minded, privacy-aware, comfortable with data — who would actively report spam and want recognition for doing so. This segment is too narrow to price for alone, but it is where press, organic growth, and product momentum come from.

**Tertiary:** Privacy and data rights enthusiasts (HN, r/privacy audience) who respond to the on-device architecture story and the "we don''t upload your contacts, we don''t intercept your calls" posture.

## 4. Differentiation

Competitors compete on block-rate theater. Ringdocket competes on three surfaces that are genuinely empty across the category:

1. **Campaign-level narrative.** Each spam call is clustered into a named campaign ("The Medicare Card Renewal Ring," "The IRS Threat Caller"). Users see the story, not a single-integer spam count.
2. **Carrier attribution as consumer feature.** Originating and gateway carriers are surfaced from the FCC Robocall Mitigation Database. Hiya has this data and does not ship it. We do.
3. **Closed-loop reporting.** Every report that meets the corroboration threshold produces a user-facing outcome within 48 hours — first-flag credit, campaign attribution, or network-block confirmation. Campaign takedowns (FTC/FCC action or inferred retirement) fire separate notifications when they happen.

Supporting differentiators: a three-timescale retention content layer (weekly digest, monthly impact report, quarterly Takedown Report PDF), a Founding Flagger badge for the first 500 annual subscribers, and a design system (Forensic Ledger Light) that visually encodes "we show our work."

## 5. MVP Scope (V1)

### In scope

- **iOS mobile app** (native Swift + SwiftUI) with Call Directory Extension integration, block list sync, one-tap report flow, on-device personal stats.
- **Web dashboard** (Astro + React islands on Cloudflare Pages) with personal stats, trending campaigns, campaign detail pages, My Reports timeline, account management.
- **Backend** (Cloudflare Workers + Supabase Postgres) handling report ingestion, reputation scoring, corroboration promotion, nightly block list generation to R2.
- **Email infrastructure** for transactional auth mail, the weekly "Public Enemy #1" digest, the monthly personal impact report, and the quarterly Takedown Report PDF delivery.
- **Public-source ingestion jobs** — daily FTC Do Not Call complaint feed, FCC enforcement press releases (RSS/scrape), Industry Traceback Group public traceback list, FTC consumer sentinel if accessible. Plus activity-decay detection for inferred campaign retirement.
- **3-account / 14-day corroboration system** with a `pending_reports` queue and nightly promotion job.
- **Delist / appeal form** at `/report-an-error` with an inbound ticket queue (human review is Brian-in-inbox for V1).
- **Seeded dashboard** — 12+ historical named campaigns curated from FTC complaint data, populated before first user login so the dashboard is never empty.
- **Takedown Report PDF** — quarterly, personalized, framed as "campaigns you helped take down" (not "calls you received"), civic-certificate aesthetic.
- **Subscription billing** — RevenueCat for iOS StoreKit, Stripe for web.
- **Basic gamification** — first-flag counter, public Impact Score formula, three starter badges (First Report, First Flag, Founding Flagger), campaign attribution notifications, variable-ratio "your flag triggered a network block" payoff notifications.
- **Observability** — PostHog (product), Sentry (errors with phone-number/UUID scrubbing), Cloudflare Logpush to R2 (audit).

### Out of scope

- Android app (V2).
- AI call screening, call recording, Answer Bot-style features (not our thesis, not our brand).
- Licensed data from Hiya, TNS, or First Orion (build our own via FTC feed + user reports).
- Formal Industry Traceback Group integration (V1 uses their public records; formal integration is V2).
- Reverse phone number lookup SEO pages.
- SMS notifications (Twilio verification is separately problematic across the portfolio).
- Leaderboards, streaks, daily engagement mechanics (psychologically wrong for intermittent behavior; hold for V2 re-evaluation).
- Category Diversity badge and any "busywork" badges (cut per Phase B review).
- Full public first-flagger attribution on campaign detail pages (first-flag is shown to the user who made it; public attribution by handle is a future opt-in feature).
- Metabase analytics access for anyone other than Brian.
- Regional pricing and non-US market launch (US-centric data sources).

### Out of scope — call interception

Call path interception requires carrier registration, CPNI compliance, CALEA obligations, and FCC voice service provider registration. On-device blocking via iOS Call Directory Extension avoids all of that. We push a list to the phone; the OS handles the block. This decision is not revisited in V1.

## 6. Architecture & Stack

### Stack decisions

| Layer | Tool | Rationale |
|-------|------|-----------|
| Web dashboard | Astro + React islands on Cloudflare Pages | Read-heavy dashboard with ~4 interactive surfaces. First-party Cloudflare support. Matches portfolio baseline. `@cloudflare/next-on-pages` is deprecated as of early 2026. |
| API / backend logic | Cloudflare Workers | Cheap, edge-local, portfolio-aligned. `event.waitUntil()` for non-blocking logging. |
| Database + auth | Supabase (Postgres) | RLS, full-text search (`tsvector` + `pg_trgm`), materialized views for trending-campaign aggregates, managed auth with Apple Sign-In support. D1 lacks RLS and built-in auth; revisit as an edge read cache in V2 only. |
| File storage | Cloudflare R2 | Block list snapshots + deltas, Takedown Report PDFs. Zero egress to Cloudflare network. |
| Mobile | Native Swift + SwiftUI (iOS) | CDE is Swift-only. React Native would require a Swift bridge for the hardest 30% of the app while inflating binary size in the second-most-scrutinized App Store category. |
| Payments | RevenueCat (iOS) + Stripe (web) | Standard split. Single source of entitlement truth is Supabase `subscriptions` table, populated by webhook. |
| Product analytics | PostHog (cloud) | No session replay on authenticated routes. Anonymous pre-login; identified by Supabase `user_id` post-login. |
| Error monitoring | Sentry (`@sentry/astro`, `@sentry/cloudflare`, `sentry-cocoa`) | `beforeSend` hooks strip phone numbers (E.164 regex) and UUIDs from breadcrumbs before transmission. |
| Audit logging | Cloudflare Logpush → R2 (JSONL) | 90-day rolling audit trail for subpoena / support / TCPA inquiry response. Set up in week 1. |
| Internal analytics | Metabase connected to a read-only Postgres user with access to aggregate views only | Behind Cloudflare Access with MFA. No row-level access to `users`, `reports`, or `ftc_complaints`. |
| Email | SendGrid | Unsubscribe groups handle CAN-SPAM list management. Portfolio already on 50k/mo plan. |
| PDF generation | Self-hosted Puppeteer OR DocRaptor — **decision pending**, see §22 | Self-hosted avoids a third-party data processor for the Takedown Report. |
| Block list delivery | R2 + Worker manifest with daily full snapshots and hourly deltas | Full snapshot + manifest + delta pattern. Area-code segmentation field present from day one, activated only when the full list exceeds ~20 MB gzipped. |

### Architectural rationale (condensed)

Full detail in `/Users/jbm/new-project/app-spamblocker/prd-build/phase-a-software-architecture.md`.

- **Astro over Next.js.** Dashboard is 80% read-rendered cards and tables with four interactive islands. Astro ships static HTML and hydrates only what needs JS. Next-on-Pages is deprecated; OpenNext for Cloudflare is less tested on Pages and adds a maintenance burden a solo builder does not need.
- **Native Swift over React Native.** The Call Directory Extension runs in its own process and is Swift-only. RN would add a bridge for ~5 screens while keeping every review risk in the call-blocker category. CDE memory ceiling is ~5 MB working (not the ~12 MB hedged in earlier drafts), which makes streaming/autoreleasepool discipline mandatory — easier in native Swift.
- **Supabase over D1.** Auth, RLS, and materialized views for trending campaigns are all doing real work. D1 has no built-in auth and no RLS as of April 2026. D1 becomes interesting as an edge read replica of the block list in V2, not as the primary store.
- **Block list distribution.** Manifest at `r2://block-lists/manifest.json`. Full snapshot at `full/YYYY-MM-DD.v{N}.json.gz`. Deltas at `delta/{from}-{to}.json.gz`. Client fetches manifest first, then a delta or a full snapshot as needed. Signed URLs are not required in V1 because the free tier gets the same block list as paid (the block list is not a paywall surface — see §14 Finding 11 context).
- **Block-list budget.** Each CDE entry is roughly 8 bytes + optional label. Design for ≤200k entries in V1, with area-code segmentation ready to activate at 500k–1M. Maximum supported per Apple is ~2M but practical memory ceiling sits well below that.
- **Observability triangle.** Sentry (errors) + PostHog (behavior) + Logpush (audit) covers what a Next-on-Vercel setup would give for free. Add a `request_id` header at the edge, propagate through dashboard → Worker → iOS, log everywhere.

## 7. Core Features (V1)

### 7.1 iOS mobile app (native Swift + SwiftUI)

- **Onboarding.** Walks the user through installing the Call Directory Extension, granting permission, and creating an account. Permission screen includes explicit Apple-reviewer language: "This app uses Apple''s Call Directory Extension to block calls on your device. The block list is stored locally. Call audio is never transmitted. The app does not intercept, record, or analyze calls."
- **Pre-account value.** The block list syncs and the user gets passive blocking without an account. Account creation is only required to submit a report or access the dashboard. This is an explicit psychological decision — reciprocity before commitment.
- **Block list sync.** Fetches manifest, pulls deltas or a fresh snapshot, writes to the App Group shared container, calls `CXCallDirectoryManager.reloadExtension`. Daily full + hourly delta cadence. Background sync via `BGTaskScheduler`.
- **Report a number.** One-tap from the app. Category picker (auto warranty, IRS, Medicare, utility, debt collection, tech support, unknown, other). Optional notes field capped at **280 characters**, client-side and API-side. Device fingerprint captured (iOS install UUID from Keychain) and sent with the report.
- **Home screen.** Persistent ledger strip below the nav showing impact score, today''s flag count, and blocks in mono type. Narrative hero leads with prose ("This week, you flagged 4 numbers in the Medicare Card Renewal Ring. Two more reports and it crosses the corroboration threshold."). 60/40 asymmetric tile row below with primary CTA left and an impact stat right. Three recent-activity rows as mono evidence rows with state chips.
- **Deep links to dashboard.** Campaign names, "view full evidence ledger," and the Takedown Report all open the web dashboard in Safari.
- **Settings.** Subscription management (via RevenueCat → StoreKit portal), notification preferences, email digest opt-in toggles, account deletion.

### 7.2 Web dashboard (Astro + React islands on Cloudflare Pages)

- **Home (authenticated).** Narrative-led hero — "This week, you stopped 47 calls. 31 were part of the Medicare Card Renewal Ring — a campaign we''re tracking with 12,000+ other reporters." Progressive disclosure to the right with a live Network Ledger of recent flags across the user base. No stat grid above the fold.
- **Trending campaigns.** List of current named campaigns ordered by 7-day report volume, with unique number count, originating carrier chain, geographic hotspot, escalation status. Click through to campaign detail.
- **Campaign detail (the transparency screen).** Bricolage display title, Newsreader byline with attribution chain, 3–4 sentence narrative summary, state chips (corroborated / pending-traceback / first-flag-you), full evidence ledger of reports with mono phone numbers, timestamps, and state. Source chip at the bottom citing data lineage ("Data: FTC DNC feed + 412 user reports · Last updated 12 min ago · Corroboration threshold: 3/14d"). Delist / appeal link visible from every campaign detail page.
- **My Impact** (replaces "My Reports" framing). Chronological timeline. Stats as line items, never hero numerals. First-flag credit as an Inter Tight uppercase label with accent dot — no trophy icons, no confetti.
- **Account management.** Subscription, payment method, notification preferences, email digest opt-ins, account deletion (triggers the cascade in §14 Finding 4).
- **Delist / appeal form** at `/report-an-error`. Public, no auth required. Submits to an inbound ticket queue.
- **Seeded dashboard content.** At launch, 12+ historical named campaigns curated from FTC data are live so a new user never sees an empty ledger.
- **Dark mode.** Opt-in "Investigator mode" toggle, not `prefers-color-scheme`. See §16.
- **PostHog instrumentation from day one.** Dashboard weekly-active rate on paid tier is the V1 north-star KPI; if it drops below 40% by day 30, the civic thesis is re-examined (see §18).

### 7.3 Backend (Cloudflare Workers + Supabase)

- **Public-source ingestion.**
  - FTC Do Not Call complaint feed — daily Workers cron, writes to `ftc_complaints` raw table, derived rows feed `numbers` and `campaigns`.
  - FCC enforcement press releases — RSS scrape daily, linked to campaigns when a citation matches.
  - Industry Traceback Group public traceback list — daily scrape, linked to campaigns by number overlap.
  - FTC consumer sentinel — if accessible.
- **Report API.** Accepts user-submitted reports from the iOS app. Captures user_id, phone number (E.164), category, optional notes (≤280 chars, PII/profanity filtered at Worker layer), device fingerprint, IP /24 at report time. Rate limited (see §14 Finding 9).
- **Corroboration engine.** Nightly job promotes numbers from `pending_reports` to the public block list when the threshold is met — **3 distinct verified accounts, no two sharing device fingerprint or IP /24, reporting within a rolling 14-day window.** Stale pending reports (>14 days with no new corroboration) are expired.
- **Reputation scoring.** Composite of volume, velocity, geographic spread, cross-reference with FTC data, and account-age weighting (older accounts with clean history weigh more). Corroborated reports contribute full weight; pending reports contribute zero until promoted.
- **Campaign clustering.** Simple heuristics in V1 — area-code + category + temporal clustering. ML clustering deferred to V2.
- **Activity decay detection.** A number reporting activity drops to zero across 100+ users for 30+ days → flag as "likely retired." If that number was part of a named campaign, mark the campaign "potentially retired." Copy discipline: **"attributed takedown"** only when a public source confirms; **"likely retired"** when inferred only. Never conflate.
- **Block list generation.** Nightly full snapshot + hourly deltas written to R2. Manifest updated atomically. iOS app pulls via the manifest pattern described in §6.
- **Gamification engine.** Tracks first-flags with retroactive credit (you first-flagged a number that LATER got corroborated earns credit when the corroboration fires). Updates impact scores on a public formula. Awards badges. Fires variable-ratio payoff notifications ("Your flag triggered a network-wide block") when backend thresholds cross.
- **Email digests.** Weekly "Public Enemy #1" Monday blast (templated from trending campaigns). Monthly personal impact report. Quarterly Takedown Report PDF via the render path below.
- **PDF rendering.** Self-hosted Puppeteer in a Worker or container (decision pending, §22). Output stored in R2 at `reports/pdf/{uuid}.pdf`, served via short-lived signed URLs. Never sequential or user-id-based paths.
- **Notes hardening.** Worker-layer regex filter for E.164 phone patterns and a lightweight profanity word list. Reject or strip before writing to Postgres. Notes are **never** displayed on public pages or analytics surfaces — internal moderation use only.

## 8. Data Sources

| Source | Purpose | Cadence | V1 |
|--------|---------|---------|-----|
| FTC Do Not Call complaint feed | Seed reputation + campaign clustering | Daily | Yes |
| FCC enforcement press releases (RSS/scrape) | Attributed takedown signal | Daily | Yes |
| Industry Traceback Group public tracebacks | Carrier chain + case citation | Daily | Yes |
| FCC Robocall Mitigation Database | Carrier attribution | On demand | Yes |
| FTC Consumer Sentinel | Cross-reference enrichment | If accessible | Best-effort |
| User-submitted reports | Corroboration engine | Real time | Yes |

**V2 additions:** formal ITG integration (if made available), licensed data from Hiya/TNS/First Orion (only if user reports + FTC feed scale prove insufficient), international complaint feeds for future non-US expansion.

**FTC reuse terms.** Must be verified before Phase 1 ingestion begins. Confirm (a) commercial use is permitted, (b) whether attribution is required on any page displaying derived data, (c) whether the feed terms prohibit claiming FTC data as proprietary. If attribution is required, add "Includes data from the FTC National Do Not Call Registry" to the footer of any page displaying campaign or number data. Same verification for FCC scrapes. See §22.

## 9. Data Model & RLS Policy

Every Supabase table has RLS enabled explicitly. Default deny, grant selectively. Any table created without a matching `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` ships as a full bypass for any leaked service-role key, and that is an unacceptable default.

### Tables (V1)

| Table | Purpose | Client access |
|-------|---------|----------------|
| `users` | Account record (Supabase Auth handles creation) | Own row only |
| `devices` | iOS install UUIDs per user | Own rows |
| `subscriptions` | RevenueCat + Stripe-synced entitlement state | Own row (read) |
| `numbers` | Canonical phone number record with reputation | Public read |
| `reports` | User-submitted report events (immutable) | Own rows (read + insert) |
| `pending_reports` | Reports awaiting corroboration | Service-role only |
| `campaigns` | Clustered scam campaigns with narrative | Public read |
| `badges` | Badge definitions | Public read |
| `user_badges` | Awarded badges per user | Own rows |
| `ftc_complaints` | Raw ingested FTC feed | Service-role only |

### RLS Starter Pack (authoritative)

```sql
-- USERS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
-- Insert handled by Supabase Auth trigger (service role), not client

-- REPORTS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports_select_own" ON reports
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "reports_insert_own" ON reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);
-- No user UPDATE or DELETE; reports are immutable. Status updates via service role only.

-- NUMBERS (block list record)
ALTER TABLE numbers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "numbers_select_public" ON numbers
  FOR SELECT USING (true);
-- No client writes

-- CAMPAIGNS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaigns_select_public" ON campaigns
  FOR SELECT USING (true);

-- BADGES (definitions)
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "badges_select_public" ON badges
  FOR SELECT USING (true);

-- USER_BADGES (awarded)
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_badges_select_own" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);
-- No client inserts; gamification engine (service role) awards badges

-- FTC_COMPLAINTS
ALTER TABLE ftc_complaints ENABLE ROW LEVEL SECURITY;
-- No client policies at all; RLS enabled with zero policies locks the table

-- DEVICES
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "devices_select_own" ON devices
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "devices_insert_own" ON devices
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "devices_delete_own" ON devices
  FOR DELETE USING (auth.uid() = user_id);

-- SUBSCRIPTIONS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subscriptions_select_own" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);
-- No client writes; RevenueCat webhook writes via service role
```

> [!tip] Service-role discipline
> All Worker endpoints that write data (report ingestion, gamification, block list generation, subscription updates) use the Supabase service-role key. The key is a runtime secret only — never in `wrangler.toml`, never in a build artifact. Client dashboard and mobile app always use the anon key with the authenticated user''s JWT.

## 10. Gamification

Phase B de-emphasized badges because extrinsic-motivator gamification decays sharply at 60–90 days. The retention load is carried by the three-timescale content surface (§11) and by variable-ratio payoff notifications, not the badge shelf.

**V1 mechanics:**

1. **First Flag credit.** Tracked per number, including retroactive credit (you flagged a number before corroboration and it later crosses threshold).
2. **Public Impact Score formula.** `Score = (reports × novelty_weight) + (first_flags × 5) + (campaigns_contributed × 10)`. Formula is displayed on the dashboard and users can see how it moves. IKEA Effect — if it is a black box, they ignore it.
3. **Campaign attribution notifications.** Push + in-app when the user''s report feeds into a named campaign.
4. **Variable-ratio payoff notifications.** When a backend threshold fires ("your flag triggered a network-wide block against X," "the Medicare Card Renewal Ring just crossed 500 reports"), an unscheduled push goes out. Variable-ratio reinforcement is psychologically much stickier than scheduled rewards.
5. **Three starter badges.** First Report, First Flag, Founding Flagger (first 500 annual subs). No "Category Diversity" badge — cut as busywork. No streaks (wrong mechanic for intermittent reporting behavior). No leaderboards in V1.

**Out of scope for V1:** tiers, streaks, leaderboards, public handles on campaign evidence rows, gamified public reporter profiles.

## 11. Retention Hooks

Three staggered retention surfaces — weekly, monthly, quarterly — do the bulk of the retention work. Every paid user should experience a meaningful touchpoint at each cadence.

### Weekly — "Public Enemy #1" digest

- Monday email + Substack + in-app banner.
- Names the single most-reported campaign of the previous 7 days.
- Includes: campaign name (newsroom framing), unique numbers this week, estimated affected users, originating carrier, geographic hotspot, escalation status (if any), and a personalized cell — "Your reports contributing: 4."
- Subject-line convention: "This week''s Public Enemy #1: The Medicare Card Renewal Ring." Not "Your weekly spam report."
- Opt-in at account creation. Unsubscribe via SendGrid unsubscribe group.

### Monthly — personal impact report

- First Monday of each month.
- "Here''s what you did in April" — reports submitted, first flags earned, campaigns contributed to, impact score trajectory.
- Narrative-forward. Mono stats as line items, never a Spotify-Wrapped hero numeral.

### Quarterly — the Takedown Report (PDF)

- Sent to paid subscribers at the end of each calendar quarter.
- **Hero framing:** "You helped flag N numbers across M scam campaigns this quarter. X are now under FCC investigation." Never "You received 47 spam calls" — that framing was rejected as negative identity signaling (see Phase B marketing psychology review).
- Civic-certificate aesthetic: warm paper, Bricolage 800 masthead, hairline rule in accent-signal, seal-of-record bottom right, case citation footer.
- Shareable. A tap-to-share-to-X/Facebook/Instagram affordance in the app. LinkedIn is not the default share platform — wrong demographic fit.
- **Prerequisite:** takedown detection must ship before the first PDF. A Takedown Report that says "0 campaigns taken down" is worse than not shipping.

## 12. Monetization

### Free tier

- **Unlimited blocking** (required for iOS to be useful at all).
- **5 reports / month** cap enforced at the Worker layer via Cloudflare KV (`{user_id}:report_count:{YYYY-MM}` with monthly TTL).
- **Home-screen stats only** on mobile. No access to the web dashboard beyond a preview tour mode on unauthenticated pages.
- **No trending campaigns view, no campaign detail, no badges, no digest.**
- **Account required** (email verified) to submit reports. No anonymous reporting path.
- **The free tier is the network flywheel.** The block list in every free user''s pocket is the moat. Paid is monetization on top.

### Paid tier

**$3.99 / month or $29.99 / year. Single tier. No Good-Better-Best.**

- Unlimited reports.
- Full dashboard — trending campaigns, campaign detail, My Impact, carrier attribution.
- All three retention hooks (weekly digest, monthly impact, quarterly Takedown Report).
- All badges and public Impact Score.
- Priority report weighting (account-age weighting favors paid users'' history).
- Investigator mode (dark dashboard).

The annual rate is 37% off monthly-×-12, matching the Truecaller and Hiya annual mainstream band and leaving headroom for the V2 price raise without forfeiting charm pricing. $3.99 is deliberately above Nomorobo''s $2.99 bargain floor and below RoboKiller''s $4.99 — it signals "serious product" without triggering "too expensive for a blocker."

### Founding Flagger launch offer

**$19.99 / year, lifetime-locked for the first 500 annual subscribers.**

- 33% off the regular annual. Capped, not time-bound.
- Perpetual "Founding Flagger" badge on the account. Permanent status.
- Annual-only. Monthly subscribers cannot claim Founding pricing (filter for commitment, push cash forward).
- Lifetime lock: the price stays $19.99/year for as long as the subscription remains continuously active. Cancel-and-resubscribe forfeits the lock.
- **Cap is 500, not 1,000.** Phase B locked this for tighter scarcity and a more narratively achievable "cap filled" PR beat.
- Live counter on the pricing page ("312 of 500 Founding Flagger spots claimed"). Counter IS the marketing.
- Loss-aversion framing: "Lock in $19.99/yr forever before the first 500 spots close. Regular price at launch: $29.99/yr." Never "Save 33%!"
- When the cap fills, publish the Founding Flagger roster (opt-in) as a public wall on the marketing site.

### Price increase roadmap

Raise to **$4.99 / month, $39.99 / year** when either trigger hits first:

1. **2,000 paid subscribers** — retention patterns stabilize, the offer is validated, and the "free users who haven''t converted yet" pool is large enough that raising is a conversion forcing function.
2. **V2 Android launch** — doubles the addressable market, justifies repricing with a clean narrative.

**Grandfathering: forever.** Every pre-raise subscriber keeps their original price for as long as the subscription stays active. Killing grandfathering is a guaranteed churn event and a review-bomb trigger. Announce 30 days before the raise.

### Pricing page layout

Three visual anchors left to right: Free → **Annual ($29.99, "Most popular")** → Monthly ($3.99). Founding Flagger appears as a banner above the three cards with the live counter, not as a fourth pricing option. Collapses to two visual choices (Free | Paid) on mobile.

## 13. Regulatory & Compliance

### Privacy compliance (CCPA, VCDPA, CPA, CTDPA)

California, Virginia, Colorado, and Connecticut residents all have rights to know, delete, and correct. V1 handles these rights via:

- **Right to know / access:** users email `privacy@{domain}`. 45-day response SLA. V1 is manual; V2 adds a DSAR portal.
- **Right to delete:** account deletion via the dashboard triggers the cascade in §14 Finding 4. For specific record deletion, email `privacy@{domain}`.
- **Do not sell/share:** this product does not sell or share personal data for advertising. Stated explicitly in the privacy policy.

### Privacy policy checklist

The V1 privacy policy must enumerate:

- What is collected: email, iOS install UUID, subscription status, reported phone numbers + categories + timestamps, anonymous PostHog usage, Sentry crash data.
- What is NOT collected: call audio, call content, IDFA, location, contact book.
- How it is used: block list operation, gamification, product communications (consented), service improvement.
- Third-party processors: Supabase, Cloudflare, Stripe, RevenueCat, PostHog, Sentry, SendGrid.
- Retention: active account → retained while active. Deleted account → PII deleted within 30 days; anonymized report signals retained indefinitely as aggregate.
- CCPA / VCDPA / CPA / CTDPA rights section.
- Do not sell/share statement.
- Block list disclosure: numbers reported as spam; no personal information about number owners stored; derived from community reports + public government data.
- FTC data attribution sentence (if required by FTC terms — see §8 and §22).
- Notification of changes: 30-day email notice before material changes.
- Contact: `privacy@{domain}` + physical mailing address (see §22).
- Effective date and version number.

### CAN-SPAM

- Weekly digest is a marketing communication. Opt-in checkbox at account creation, unchecked by default. Monthly impact and quarterly Takedown are opt-in by default (tied directly to paid product value).
- Every email footer includes: physical mailing address (registered agent or PO Box — see §22), sender identification, unsubscribe link via SendGrid unsubscribe groups.
- Transactional mail (auth, receipts, password reset) is exempt from opt-in but follows the same footer discipline.

### iOS App Store requirements

**Privacy Nutrition Label:**

- *Data Used to Track You:* **None.** No IDFA, no cross-app tracking. Document decision.
- *Data Linked to You:* Email Address (Contact Info), User ID (Identifiers — Supabase auth UUID), Product Interaction (Usage — PostHog post-login), Crash Data (Diagnostics — Sentry).
- *Data Not Linked to You:* Performance Data (Sentry anonymous pre-login).

**ATT (App Tracking Transparency):** no prompt shown. No IDFA, no cross-app tracking. App Store review notes: "This app does not use the Advertising Identifier (IDFA) and does not track users across apps or websites. No ATT prompt is displayed."

**Call Directory Extension disclosure:** in the App Store listing and in onboarding, state explicitly:
- "This app uses Apple''s Call Directory Extension to block calls on your device."
- "The block list is stored locally on your device. Call audio is never transmitted to our servers."
- "The app does not intercept, record, or analyze your calls."

**Privacy Manifest (PrivacyInfo.xcprivacy):** required under iOS 17. PostHog and Sentry iOS SDKs ship their own manifests that must merge into the app''s. Xcode build process validates this. Missing or incomplete privacy manifests are a common App Store rejection cause in 2025–2026.

### FTC data attribution

See §8. Verify commercial-reuse and attribution requirements before ingestion begins. If required, add "Includes data from the FTC National Do Not Call Registry" to the footer of any page displaying campaign or number data.

### Copy discipline (legal-adjacent)

- Never say "confirmed spam" or "this number is a scam." Say "reported by N users as spam" and link to the FTC complaint feed where relevant.
- Never say "campaign shut down" when inferred. Say "campaign attributed to [enforcement action]" when a public source confirms, and "campaign likely retired" when inferred only.
- Never imply partnership with FTC / FCC / ITG. We use their public data. That is the extent of the relationship.

## 14. Security Design Requirements

These are the hardening requirements from the Phase B security review, preserved as specific controls. Each cites the finding number for traceability.

### Defamation shield (3-account corroboration) — Finding 1

- A number enters the public block list only when **3+ independent verified accounts** have reported it, with **no two sharing device fingerprint or IP /24**, within a rolling **14-day window**.
- 1–2 reports sit in `pending_reports`, visible only to the reporting users on their personal stats.
- Notes are internal only. Never displayed on campaign pages, trending views, or public block list metadata.
- Copy discipline per §13.

### Delist / appeal flow — Finding 1

- Public form at `/report-an-error`. No auth required.
- Submissions create a ticket in an inbound queue. V1 review is Brian-in-inbox; automated resolution and SLA tracking are V2.
- A visible link appears on every campaign detail page and on every public number detail page.
- **Delist SLA is an open question (§22).**

### Notes field hardening — Finding 3

- Client-side and API-side cap at **280 characters**.
- Worker-layer regex filter for E.164 phone patterns and a lightweight profanity word list. Reject or strip before the Postgres insert.
- Notes excluded from any analytics pipeline visible outside the service role.
- Notes deleted on account deletion regardless of the report anonymization policy.

### Account deletion cascade — Finding 4

Implemented as a confirmed Supabase Edge Function triggered from the dashboard. On deletion:

- `users` row deleted.
- `user_badges` rows deleted.
- `devices` rows deleted.
- `subscriptions` rows deleted.
- `reports` rows — `user_id` set to NULL, `notes` deleted. The anonymous signal persists (phone number, category, timestamp) so the block list does not degrade.
- Email address scrubbed from all Sentry/PostHog systems via their respective APIs.

Privacy policy documents this explicitly. Supabase''s built-in auth deletion only removes the auth record — it does not delete application data, so the cascade must be custom. **Final decision on anonymize-vs-delete is Option B (anonymize) — see §22 to confirm.**

### Rate limiting — Finding 9

- **Cloudflare built-in rate limiting rule** on `POST /api/reports`: 30 req/min per IP, regardless of auth status.
- Free-tier 5/month cap enforced in the Worker via Cloudflare KV before the Postgres insert.
- Paid-tier velocity-based soft limit: >20 reports in any rolling 1-hour window → reports are accepted and stored but flagged `hold_for_review`, weighted at zero until a background job clears them.
- Users are never told their report was held. Silent hold prevents abuse-pattern tuning.

### Secrets classification — Finding 5

| Variable | Class | Why |
|----------|-------|-----|
| `SUPABASE_URL` | Build-time (public) | Project URL, not a secret |
| `SUPABASE_ANON_KEY` | Build-time (public) | Designed public; RLS enforces access |
| `SUPABASE_SERVICE_ROLE_KEY` | Runtime Secret only | Full DB bypass |
| `STRIPE_PUBLISHABLE_KEY` | Build-time (public) | Designed public |
| `STRIPE_SECRET_KEY` | Runtime Secret only | Never in build artifact |
| `STRIPE_WEBHOOK_SECRET` | Runtime Secret only | Signature verification |
| `REVENUECAT_WEBHOOK_SECRET` | Runtime Secret only | Signature verification |
| `POSTHOG_API_KEY` | Build-time (public) | Client-side key |
| `SENTRY_DSN` | Build-time (public) | Client-side DSN |
| `SENTRY_AUTH_TOKEN` | CI/CD Secret only | Source map upload only |

All runtime secrets stored via `wrangler secret put` or the Cloudflare dashboard Secrets store. Never in `wrangler.toml`, `.env` checked into git, or plain-text Pages environment variables.

### Sentry scrubbing — Finding 10

- `beforeSend` hook on Web, iOS, and Worker Sentry integrations.
- Scrub strings matching E.164 format (`\+?1?\d{10}`) from breadcrumb and extra-context payloads.
- Scrub strings matching UUID format.
- iOS app maps all raw Supabase/network errors to user-facing strings via a centralized error handler. Never display raw error messages.
- Astro Worker endpoints catch Supabase errors and return generic client responses; full error goes to Sentry via `beforeSend`.

### Metabase read-only user — Finding 12

- Dedicated read-only Postgres user for Metabase.
- Access limited to aggregate analytics views (no access to `users`, `reports`, `devices`, `ftc_complaints` raw).
- Views expose aggregated data only — no `user_id`, no individual report rows, no email addresses.
- Metabase instance behind Cloudflare Access with MFA on the identity provider.
- **Hosting — self vs cloud — is an open question (§22).**

### PostHog session replay — Finding 14

- Session replay is **disabled on all authenticated routes** in the dashboard.
- Enabled only on unauthenticated marketing pages (landing, pricing, onboarding funnel pre-login).
- If session replay on auth routes is later needed for debugging, mask all phone-number, email, and report-content elements with `data-ph-mask`.

### Block list signed URLs — Finding 11

Reconfirmed decision: **free and paid users receive the same block list.** Free tier''s value is unlimited blocking; paid tier''s value is the dashboard + content + gamification. The block list URL is public and cacheable from R2 directly; signed URLs are not required in V1. The manifest + delta Worker does not sit in the data path for the bytes. Reserve the signed-URL pattern for any future paid-only premium list.

### Takedown Report PDF exposure — Finding 8

- Self-hosted Puppeteer preferred (avoids a third-party data processor). Decision pending — §22.
- Stored in R2 at `reports/pdf/{uuid}.pdf`. Never sequential or user-id-based paths.
- Served via short-lived signed URLs (5-minute TTL).
- Carrier attribution copy: "calls routed through carrier infrastructure associated with [carrier name] according to FCC STIR/SHAKEN attestation records." Distinguishes originating vs gateway carriers. Never implies complicity.

## 15. Incident Response

Minimum viable breach response for a solo builder:

- **PII at material risk in this system:** email addresses (`users`), report history (`reports` — phone numbers + categories), subscription payment status (card numbers live in Stripe, not our DB).
- **Notification threshold:** any unauthorized access to `users` or `reports`, regardless of record count, is treated as a notifiable event given data sensitivity.
- **Breach response template** kept in a private doc: who to notify (affected users via email; CA AG if >500 California residents; other state AGs per local law), what to say, the timeline.
- **Point-in-Time Recovery** enabled on Supabase from day one. Lets us determine database state at the time of a breach.
- **Cloudflare Logpush to R2** provides 90 days of Worker audit trail for forensics.
- **Response timeline commitment:** disclosure drafted within 72 hours of discovery; user notification within 30 days; AG notification where applicable within legally required windows (CCPA: "expedient time").

## 16. Design System Reference

The full design system lives at `/Users/jbm/new-project/app-spamblocker/prd-build/phase-c-design-system.md`. The aesthetic rationale is at `/Users/jbm/new-project/app-spamblocker/prd-build/phase-c-aesthetic-direction.md`. iPhone mockups are at `/Users/jbm/new-project/app-spamblocker/.flowy/` (home, campaign-detail, my-reports) with viewer at `mockup-viewer.html`.

### Locked direction: **Forensic Ledger (Light)**

Warm cream paper surface, editorial authority, a single accent stamp, four type voices in role-coherent assignments. Threads the Phase B split between utility-first acquisition (approachable light surface) and civic-first retention (investigative ledger depth).

### Palette

| Token | Value | Use |
|-------|-------|-----|
| `--surface-paper` | `#F7F3EA` | Warm cream base. The "document." |
| `--surface-raised` | `#FFFFFF` | Cards above paper. |
| `--surface-inset` | `#EEE8DA` | Input fields, recessed rows. |
| `--rule` | `#D8D0BE` | 1px hairlines, ledger rules. |
| `--ink-primary` | `#1B1F27` | Body text. |
| `--ink-secondary` | `#5C5D5F` | Supporting body. |
| `--ink-byline` | `#8D8875` | Timestamps, bylines, metadata. |
| `--ink-mono` | `#3A3D44` | Monospace data color. |
| `--signal-flag` | `#D97742` | Burnt orange — YOU flagged this. |
| `--signal-corroborated` | `#2F6B4A` | Deep moss — on block list. |
| `--muted-pending` | `#A89E85` | Olive-tan — awaiting corroboration (dashed border). |
| **`--accent-signal`** | **`#C2370A`** | **The one color. Used as a stamp, never as a CTA.** |
| `--destructive` | `#8B2B1F` | Oxblood — delist / dispute. |

Accent-signal usage is strict: the Ringdocket wordmark period, the corroborated seal next to block-listed numbers, the first-flag indicator on evidence rows, the Takedown Report PDF masthead, and a single hero hairline rule. Nowhere else. If a screen has 3+ accent-signal touches, it is broken.

A dark "Investigator mode" exists as an opt-in toggle on the dashboard — not `prefers-color-scheme`. Default for everyone is light.

### Type system (four families, four jobs)

| Role | Family | Weights | Scope |
|------|--------|---------|-------|
| Display | **Bricolage Grotesque** (variable) | 700, 800 | Hero, campaign names, section titles |
| Narrative | **Newsreader** (variable serif) | 400, 500 | Body paragraphs, editorial content, digest emails, Takedown PDF |
| Utility | **Inter Tight** | 400, 500, 600 | Buttons, chips, form labels, filters, nav |
| Evidence | **JetBrains Mono** | 400, 500 | Phone numbers, UUIDs, timestamps, case IDs, reputation scores |

Role boundaries are non-negotiable. Bricolage never in body copy. Newsreader never on buttons. Inter Tight never on paragraph prose. JetBrains Mono exclusively on data-as-data — numbers embedded in prose sentences stay in Newsreader humanist numerals.

All fonts self-hosted via Cloudflare R2 (or Fontshare/Bunny Fonts fallback). No hotlinking Google Fonts.

### Atmosphere layers

Every page composites three layers, never flat:

1. **Ledger rules** — 1px horizontal rule every 32px at ~6% effective opacity. Evokes ruled paper.
2. **Paper fiber noise** — SVG fractal noise at 3% opacity.
3. **Accent radial** (hero only) — very subtle warm glow from the top-left at 4% accent-signal opacity.

Campaign detail evidence columns carry a 1px vertical hairline at 15% accent-signal (the single approved accent-signal exception).

### Motion

One orchestrated entrance per page (not many micro-animations). Reduced-motion preference disables all non-essential motion. Never animate type size, letter spacing, or color on data.

### Mockups

iPhone device-frame mockups of home, campaign detail, and my-reports live in `/Users/jbm/new-project/app-spamblocker/.flowy/`. They are faithful to the Forensic Ledger Light tokens and should be used as visual references (not pixel specs) for the iOS build.

## 17. Marketing & GTM

Full plan at `/Users/jbm/new-project/app-spamblocker/prd-build/phase-b-marketing-plan.md`. Condensed below.

### Positioning

**One-sentence value prop:** "Ringdocket is the first spam blocker that shows you the scam campaign behind every blocked call, names the carrier that routed it, and tells you when your report contributed to a takedown."

**Acquisition copy = utility first.** Landing page, App Store description, ad copy all lead with "The only spam blocker that tells you who called, what scam, and what''s being done about it." Civic framing comes in paragraph three, not the headline. Reactance and crusade-fatigue in the 30–65 demographic kill civic-led headlines.

**Retention copy = civic first.** Email digests, dashboard home narratives, Takedown Report all lean into civic identity for users already engaged.

**Banned copy:** block-rate claims, "stop all spam forever," Answer Bot / revenge framing, fake urgency / countdown timers, "AI-powered" puffery, "campaign shut down" where "likely retired" is accurate, "join the fight" language, "disguised as a utility" in any surface ever.

### ORB channel strategy

- **Owned.** Substack founder journal (weekly pre-launch, bi-weekly post), cross-promo footer ads on LoveNotes / SCDMV Alerts / RecordStops (~200 email list), Twitter/X build-in-public thread, LinkedIn thought-leader posts on carrier accountability. Post-launch: monthly newsletter.
- **Rented.** Budget $500–1K total. Apple Search Ads 2-week experiment ($200). Design assets ($150). ASO tooling ($99). Newsletter tools ($100). Reserve ($300). No Reddit promoted posts, no Twitter paid.
- **Borrowed.** 70% of marketing time lives here. Reddit (r/robocalls, r/scams, r/privacy, r/apple, r/iphone, r/SideProject, r/consumerprotection), Hacker News (Show HN + data-journalism posts), Product Hunt, podcast circuit (Darknet Diaries, Reply All alumni, Scam Goddess, IRL, Naomi Brockwell, Techlore), earned press (Wirecutter, The Verge, Ars Technica dream list + Tier 2/3 fallbacks).

### 5-phase launch (14-week plan)

1. **Internal (weeks 1–3)** — positioning, landing page + waitlist, social accounts, PH profile, press list, Substack series outline, Reddit lurk.
2. **Alpha (weeks 8–11)** — 10–20 hand-picked testers from Brian''s customer base, personal network, and Reddit-sourced power users. Incentive: free Founding Flagger slot + permanent "Alpha Flagger" badge (only 20 people ever).
3. **Beta (weeks 11–13)** — 100–200 users from the email list + waitlist + Reddit soft posts. Target ~10% Founding Flagger conversion before PH. Incentive: Founding Flagger price + "Beta Flagger" badge.
4. **Early Access / Product Hunt launch (weeks 13–14)** — Tuesday 12:01am PT. PH primary, Show HN 7am ET, email blast 7am ET, Substack launch 6am ET, X thread 8am ET, LinkedIn 9am ET, staggered Reddit launch posts 9–11am ET.
5. **Full launch + momentum (week 14+)** — weekly "Public Enemy #1" Monday, mid-week data journalism piece, Friday build-in-public update. Press rhythm targeting named-campaign case studies monthly.

### Product Hunt specifics

Full playbook in phase-b-marketing-plan.md §"Product Hunt Playbook." Summary: Tuesday launch, self-hunt by default (unless Chris Messina or Kevin William David bites by T-10), pre-scheduled cross-channel assets, reply to every comment, 10-hour active presence on launch day.

### Content calendar (90 days)

- Weeks 1–13: one Substack post / one X thread / one LinkedIn post per week, building the "Why I''m building" arc through "Meet the Medicare Card Renewal Ring" into the PH launch.
- Weeks 14–26: Monday digest, mid-week data piece, Friday retro. Q1 Takedown Report ships week 23 (March 31, roughly).

### Budget allocation

| Bucket | Allocation |
|--------|------------|
| Apple Search Ads 2-week experiment | $200 |
| Design assets | $150 |
| ASO tooling | $99 |
| Newsletter + email tools | $100 |
| PDF rendering (one-time) | $100 |
| PH launch day extras | $50 |
| Brand domain registration | $15–50 |
| Reserve / experiment | $300 |
| **Total** | **~$1,000** |

Under-$500 mode: kill ASA and design assets first. Iterate on free tiers.

### Kill criteria

| Signal | Milestone | Trigger |
|--------|-----------|---------|
| Time-on-dashboard <20 sec | Day 30 | Reframe to "peace of mind with a story," downgrade dashboard investment |
| Free → paid conversion <3% | Day 60 | Tighten free tier OR strengthen paid signals |
| PH launch outside top 15 | Day 1 | Rewrite positioning, retry ancillary channels |
| No press pickup | Day 60 | Pivot to data-journalism-first content strategy |
| Paid monthly churn >10% | Day 60 | Pause acquisition, fix product |
| Founding Flagger <10% filled | Day 60 | Reassess cap size or discount depth |
| Weekly digest OR <25% | Day 45 | Overhaul digest format before scaling |

## 18. Success Metrics

### Product (V1 launch + 90 days)

- **3,000 iOS downloads** by day 90.
- **350 paying subscribers** by day 90 (150 by day 60, 50 by day 30).
- **500 Founding Flagger claims** — cap hit or nearly hit by day 90.
- **25% of active users submit ≥1 report per month** (note: this is aspirational per Phase B''s 9-1-90 rule; 10% is a more realistic ceiling and should be treated as the floor).
- **Average 3 first-flags per active reporter.**

### Business (12 months)

- $50K ARR.
- Under 5% monthly paid churn.
- CAC under $15.
- 4.5+ App Store rating.

### North-star and civic-promise KPIs (new)

- **Dashboard weekly active rate on paid tier — target ≥60% by day 30.** Below 40% triggers thesis re-evaluation. This is the single most important signal that transparency matters to users.
- **Report payoff notification fire rate — target ≥90% of reports receive a within-48h update** (first-flag, campaign attribution, or network-block event). This is the civic-promise SLA. If it slips, learned helplessness compounds and the civic identity collapses.
- **Annual share of paid subscribers — target ≥60%.** Annual auto-renew inertia is the main retention lever.

## 19. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Cold start on block list quality | High | Medium | FTC feed seeds with pre-corroborated numbers. 12+ seeded campaigns at launch. |
| App Store rejection cycles eat 3–4 weeks | High | High | Submit week 11, not week 13. Follow Apple guidelines literally. CDE onboarding disclosure copy in §7.1. |
| iOS CDE memory limits (5 MB working) | Medium | Medium | Streaming load with autoreleasepool. Area-code segmentation field present from day one; activate before 500k entries. |
| Hiya copies the transparency surface | Medium | High | Lock community identity fast. Badges, Founding Flagger, first-flag attribution. Feature-copy is cheap; community-copy is not. |
| Carriers launch transparent first-party blockers | Low | Catastrophic | Carriers move slowly and are conflicted economically. Monitor. Not mitigable. |
| Learned helplessness — enforcement feedback loop does not fire | Medium | High | Variable-ratio payoff notifications within 48h of every report. Seeded dashboard prevents empty experience. Network-wins ticker shows activity even without enforcement events. |
| Negative identity signaling on shared Takedown Reports | Medium | High | Hero framing inverted to "campaigns you helped take down," not "calls received." Takedown detection must ship before first PDF. |
| Reactance on civic framing during acquisition | Medium | High | Utility-first headlines. Civic framing lives in paragraph 3 and downstream of the utility promise. |
| PH launch outside top 10 | Medium | Medium-high | Pre-brief supporters, pre-schedule assets, hunter outreach hedges. |
| Founding Flagger counter stalls at low fill rate | Medium | Medium | 500 cap (down from 1,000) keeps psychological scarcity tight. Reassess at day 60. |
| Users unblock legitimate calls, degrade reputation | Medium | Medium | Track unblocks as signal. 3-account corroboration prevents single-reporter mistakes from going network-wide. |
| Brian burns out doing this solo | High | Existential | Pre-schedule social + content. Batch writing. Hard 15 hr/week marketing ceiling. |
| Cross-promo to LoveNotes / SCDMV / RecordStops backfires | Low | Low-medium | Soft voice-in-character email once. Don''t repeat. |

## 20. Phased Build Order

Roughly 13 weeks from foundation to App Store submission, matching the Phase B marketing plan''s launch cadence.

### Phase 1 — Foundation (weeks 1–3)

- Supabase project, schema (users, devices, subscriptions, numbers, reports, pending_reports, campaigns, badges, user_badges, ftc_complaints), RLS policies from §9.
- Cloudflare Pages + Workers + R2 + KV setup.
- Cloudflare Logpush → R2 live.
- Astro scaffold with `@supabase/ssr`, Forensic Ledger Light tokens wired per §16.
- Font self-hosting on R2.
- Basic Metabase setup with read-only user and aggregate views.
- FTC feed ingestion running daily.
- `/report-an-error` form live (even without auth behind it — the URL being live is what matters).
- Secrets classified per §14 Finding 5. All runtime secrets in `wrangler secret put`.

### Phase 2 — Core backend (weeks 4–6)

- Report API endpoint with KV-backed free-tier cap + Cloudflare rate limiting + velocity soft-limit.
- Notes hardening (280-char cap, PII/profanity filter).
- Corroboration engine (nightly promote pending → block list, 14-day expiry).
- Reputation scoring + account-age weighting.
- Simple campaign clustering heuristics.
- Activity decay detection.
- Public-source ingestion: FCC press releases, ITG public tracebacks.
- Block list generation (manifest + full snapshot + deltas) to R2.
- Gamification engine — first-flag tracking (retroactive credit), impact score, three badges, variable-ratio payoff triggers.
- Sentry `beforeSend` scrubbing live on the Workers side.

### Phase 3 — Web dashboard (weeks 6–8)

- Astro routes: `/` (marketing), `/pricing` (with Founding Flagger counter), `/login`, `/app/home`, `/app/campaigns`, `/app/campaigns/[slug]`, `/app/my-impact`, `/app/settings`, `/report-an-error`.
- Magic-link auth flow (or Apple Sign-In depending on §22 decision).
- Stripe Customer Portal integration for subscription management.
- Public first-flag UI conventions per §7.2.
- Dashboard seeded with 12+ historical named campaigns before first login.
- PostHog instrumentation from day one — landing → signup → first report → paid conversion funnel.
- Account deletion cascade implemented as Supabase Edge Function.

### Phase 4 — iOS app (weeks 8–11)

- Swift + SwiftUI project. Call Directory Extension target.
- Block list sync via App Group container + `CXCallDirectoryManager.reloadExtension`. Streaming load with `autoreleasepool`.
- Onboarding flow with explicit CDE disclosure copy.
- Report flow with 280-char notes cap + device fingerprint capture.
- Home screen per §7.1 and Phase C mockups.
- RevenueCat integration for StoreKit.
- Settings + deep links to web dashboard.
- Sentry `beforeSend` on iOS.

### Phase 5 — Polish and submit (weeks 11–13)

- PostHog + Sentry coverage audit.
- PrivacyInfo.xcprivacy validation (PostHog + Sentry SDK manifests merged).
- App Store listing — screenshots (per §16), preview video, description, keyword research via ASO tool.
- Privacy Nutrition Label configured per §13.
- ATT decision documented in App Store review notes.
- Onboarding copy, privacy policy published at `/privacy`, terms of service at `/terms`.
- Internal testing (TestFlight to Alpha group).
- App Store submission (budget 2 review cycles).
- Takedown Report PDF rendering pipeline live and tested end-to-end.
- Email infrastructure wired (SendGrid unsubscribe groups, transactional templates, weekly digest template).

### Phase 6 — Launch and iterate (week 13+)

- Soft launch to Beta group.
- PH launch day (see §17).
- Monitor dashboard-weekly-active, payoff-notification fire rate, Founding Flagger cap fill.
- Weekly digest Monday cadence starts week 15.
- First quarterly Takedown Report ships at the end of the first full calendar quarter post-launch.
- V2 planning based on real usage data.

## 21. Competitive Positioning

Full analysis at `/Users/jbm/new-project/app-spamblocker/prd-build/phase-a-competitive-analysis.md` (and verification at `phase-a-verification-update.md`). Condensed:

| Competitor | Price (verified Apr 2026) | Transparency | Community | Threat Level |
|------------|---------------------------|--------------|-----------|---------------|
| Truecaller | $3.99/mo, $29.99/yr | Partial (caller name, tag counts) | Input only | Medium-high |
| Hiya | $3.99/mo, $14.99/yr | Minimal (category label) | Input only | **High** — has the data, not the product vision |
| RoboKiller | $4.99/mo, $39.99/yr | Minimal (call recording) | None | Low-medium |
| YouMail | $5.99–$27.99/mo | Publishes external Robocall Index | None in-app | Low |
| Nomorobo | $1.99–$2.99/mo | None | None | Very low |
| Call Control | $29.99/yr or $9.99/quarter | Minimal | Input only, no feedback | Medium — owns "community" keyword |

**Category-wide gaps (our territory):**

1. Campaign-level narrative ("The Medicare Card Renewal Ring," not "47 flags").
2. Carrier attribution surfaced to consumers (Hiya has the data, does not ship).
3. Closed-loop reporting with 48-hour payoff notifications.
4. Enforcement visibility (FCC action, ITG tracebacks, FTC cases as consumer features).

**Main threat: Hiya.** They already have the underlying data our thesis depends on. If we get traction and attract press, Hiya can ship a consumer dashboard in a quarter. Our moat is not data — it is community identity. Ten thousand engaged reporters is harder to copy than a dashboard.

**Pricing position:** $3.99/mo lands on the Truecaller / Hiya mainstream band. Nomorobo undercuts by design; RoboKiller overprices. We win on feature depth at parity price.

## 22. Open Questions

Questions deliberately left open at PRD lock. Each must resolve before the relevant build phase begins; resolution path is noted where clear.

1. **Product / brand name + domain.** Ringdocket is the working name. All five shortlist `.com`s are registered. Options:
   - A. Pursue `ringdocket.com` acquisition (budget $1–5K via GoDaddy Domain Broker or Sedo).
   - B. Accept `ringdocket.app` or `ringdocket.ai` as primary. `.app` is HSTS-preloaded and app-native; `.ai` is overloaded.
   - C. Second naming round for clean-`.com` candidates.
   - D. Alt-form `.com` — `getringdocket.com`, `useringdocket.com` — plus `ringdocket.app`.
   - **Deferred to post-brand-standards decision. Resolve before domain registration in Phase 1.**

2. **Auth method.** Apple Sign-In only vs email magic link vs both.
   - Recommendation from Phase A: magic link + Apple Sign-In. Zero passwords, zero SMS dependency. Apple Sign-In is the fastest App Store review path. Confirm.

3. **PDF generation service.** Self-hosted Puppeteer (Worker or container) vs DocRaptor.
   - Self-hosted avoids a third-party data processor receiving user report history.
   - DocRaptor is faster to set up but requires a Data Processing Agreement under CCPA.
   - **Resolve before Takedown Report rendering pipeline build (Phase 5).**

4. **Delist / appeal SLA.** When a business challenges their number being on the block list:
   - What is the response SLA? 48 hours? 7 days?
   - Who reviews in V1 (just Brian)?
   - Is there an automated delisting trigger (e.g., report volume drops to zero for 30 days → auto-delist)?
   - **Resolve before `/report-an-error` goes live in Phase 1.**

5. **Physical mailing address for CAN-SPAM.** A registered agent address or PO Box is required in every marketing email footer. Hard CAN-SPAM requirement, cannot be deferred.
   - **Resolve before the first email goes out.**

6. **Metabase hosting.** Self-hosted behind Cloudflare Access vs Metabase Cloud.
   - Either works. Self-hosted is cheaper; Cloud has less ops.
   - **Resolve before Phase 1 Metabase setup.**

7. **Account deletion scope — Option A vs B.**
   - A: delete reports entirely. Block list degrades for numbers with few reports.
   - B: anonymize reports (`user_id = NULL`, notes deleted, anonymous signal persists). Block list does not degrade.
   - Tentative choice is B per Phase B security review. Confirm.

8. **Founding Flagger cap resolution event.** If the 500 cap fills in under 48 hours, do we:
   - Leave it closed permanently (preserves scarcity story), or
   - Announce a separately-named "Second Wave" tier ($24.99/yr, slots 501–1,000) as a post-launch expansion?
   - Recommendation: close permanently, do not reopen. Scarcity is the whole point.
   - **Resolve only if cap fills fast; deferred.**

9. **Corroboration threshold in cold start.** 3 accounts / 14 days is locked. But the FTC-seed-only cold-start window may have very few user-corroborated numbers in the first 60 days. Do we:
   - Hold the line (block list grows slower, thesis integrity preserved), or
   - Temporarily drop to 2 accounts for the first 30 days with a manual-review compensating control?
   - Recommendation: hold the line. FTC seed numbers already meet the corroboration-equivalent bar by having dozens of independent filers.
   - **Defer to day-30 review.**

10. **Tax handling.** Stripe Tax at $5/mo overhead — enable from day one.
    - Recommended yes. Confirm.

11. **Regional pricing.** US-only for V1 vs opt into App Store / RevenueCat automatic regional tiers.
    - Recommended US-only. Confirm.

## 23. Reference Links & Inputs

### Regulatory + data sources

- FTC Do Not Call Registry — https://www.donotcall.gov
- FTC complaint feed docs — https://www.ftc.gov/policy-notices/open-government/data-sets/do-not-call-data
- FCC TRACED Act overview — https://www.fcc.gov/TRACEDAct
- FCC Robocall Mitigation Database — https://www.fcc.gov/robocall-mitigation-database
- Industry Traceback Group — https://tracebacks.org

### Platform docs

- Apple Call Directory Extension — https://developer.apple.com/documentation/callkit/cxcalldirectoryextensioncontext
- Apple Developer Forums (CDE memory ceiling) — https://developer.apple.com/forums/thread/731325 and /51155
- `@astrojs/cloudflare` adapter — https://docs.astro.build/en/guides/integrations-guide/cloudflare/
- `@cloudflare/next-on-pages` (deprecated) — https://www.npmjs.com/package/@cloudflare/next-on-pages
- OpenNext for Cloudflare — https://opennext.js.org/cloudflare
- Cloudflare D1 — https://developers.cloudflare.com/d1/
- Supabase (auth, RLS, FTS, pg_trgm) — https://supabase.com/docs

### Competitor references (pricing verified April 2026)

- Truecaller — https://www.getapp.com/security-software/a/truecaller/
- Hiya Premium — https://blog.hiya.com/what-you-should-know-about-hiya-premium/
- RoboKiller plans — https://app.robokiller.com/plans
- YouMail pricing — https://www.g2.com/products/youmail/pricing
- Nomorobo — https://www.nomorobo.com/pricing/
- Call Control Premium — https://www.callcontrol.com/call-control-premium/

### Typography + design references

- Bricolage Grotesque — https://fonts.google.com/specimen/Bricolage+Grotesque
- Newsreader — https://fonts.google.com/specimen/Newsreader
- Inter Tight — https://fonts.google.com/specimen/Inter+Tight
- JetBrains Mono — https://fonts.google.com/specimen/JetBrains+Mono
- The Markup — https://themarkup.org/
- Rest of World — https://restofworld.org/
- Mercury dashboard — https://mercury.com/
- Pudding — https://pudding.cool/
- Stripe monitoring — https://stripe.com/docs/observability

### Phase artifacts (full detail)

- [[prd-build/phase-a-competitive-analysis.md|Phase A — Competitive Analysis]]
- [[prd-build/phase-a-software-architecture.md|Phase A — Software Architecture]]
- [[prd-build/phase-a-prd-clarifications.md|Phase A — PRD Clarifications (Q1–Q5)]]
- [[prd-build/phase-a-domain-brainstorm.md|Phase A — Domain & Name Brainstorm]]
- [[prd-build/phase-a-pricing-strategy.md|Phase A — Pricing Strategy]]
- [[prd-build/phase-a-verification-update.md|Phase A — Verification Update]]
- [[prd-build/phase-b-marketing-psychology.md|Phase B — Marketing Psychology Review]]
- [[prd-build/phase-b-security-review.md|Phase B — Security & Privacy Review]]
- [[prd-build/phase-b-marketing-plan.md|Phase B — Marketing Plan]]
- [[prd-build/phase-b-decisions.md|Phase B — Owner Decisions (QB1–QB3)]]
- [[prd-build/phase-c-aesthetic-direction.md|Phase C — Aesthetic Direction]]
- [[prd-build/phase-c-design-system.md|Phase C — Design System]]
- [[prd-build/phase-c-ui-mockups.md|Phase C — iPhone UI Mockups]]
- [[.flowy/home.json|Flowy — Home mockup]]
- [[.flowy/campaign-detail.json|Flowy — Campaign detail mockup]]
- [[.flowy/my-reports.json|Flowy — My Reports mockup]]

---

## Appendix A — Cross-reference map (Phase artifact → PRD section)

| PRD section | Primary Phase sources |
|-------------|-----------------------|
| §1 Vision | Phase B marketing psychology (§"Claim 6"), Phase B decisions |
| §2 Problem Statement | Phase A competitive analysis (Executive Summary) |
| §3 Target User | Phase A competitive analysis + Phase B marketing psychology |
| §4 Differentiation | Phase A competitive analysis (§"Gaps & Opportunities"), Phase B marketing plan (§"Positioning") |
| §5 MVP Scope | Phase A clarifications (Q1–Q5), Phase B decisions (QB1–QB3), Phase B security review |
| §6 Architecture | Phase A software architecture (Decisions 1–5), Phase A verification update |
| §7.1 iOS app | Phase A software architecture (Decision 2), Phase C design system, Phase C mockups |
| §7.2 Web dashboard | Phase A software architecture (Decision 1), Phase B marketing psychology (§"Claim 2"), Phase C design system |
| §7.3 Backend | Phase A clarifications (Q1, Q2), Phase B decisions (QB2), Phase B security review (Findings 1, 3, 9) |
| §8 Data Sources | Phase A clarifications (Q2), Phase B security review (Finding 6) |
| §9 Data Model & RLS | Phase B security review (Finding 2 + RLS Starter Pack) |
| §10 Gamification | Phase A PRD (original), Phase B marketing psychology (§"Claim 1") |
| §11 Retention Hooks | Phase A clarifications (Q1), Phase B decisions (QB1), Phase B marketing psychology (§"Claim 3") |
| §12 Monetization | Phase A pricing strategy, Phase B decisions (QB3) |
| §13 Regulatory | Phase B security review (Findings 6, 7, 13, 15), Phase A clarifications (Q5) |
| §14 Security | Phase B security review (all findings) |
| §15 Incident Response | Phase B security review (Finding 15) |
| §16 Design System | Phase C aesthetic direction, Phase C design system, Phase C mockups |
| §17 Marketing | Phase B marketing plan |
| §18 Success Metrics | Original PRD + Phase B marketing psychology (north-star KPIs) |
| §19 Risks | Phase A competitive analysis (§"Threats"), Phase B marketing psychology (§"Hidden Psychology Risks") |
| §20 Phased Build Order | Phase A software architecture + Phase A clarifications + Phase B marketing plan launch timeline |
| §21 Competitive Positioning | Phase A competitive analysis + Phase A verification update |
| §22 Open Questions | Phase A clarifications + Phase B decisions + Phase B security review (Open Questions sections) |

---

*PRD locked April 18, 2026. Update as decisions in §22 resolve. Do not delete content — amend with new session entries. Source of truth for the build going forward.*
', 33, 'app-spamblocker/ringdocket/docs/PRD.md'
FROM projects WHERE name = 'Ringdocket' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'README', '# Ringdocket

> **Note:** This repo was scaffolded at `/Users/jbm/new-project/app-spamblocker/ringdocket/` as a staging location (the session sandbox blocked creation at the requested `/Users/jbm/ringdocket/` and `/Users/jbm/new-project/ringdocket/` paths). Move to the final location before committing:
>
> ```bash
> mv /Users/jbm/new-project/app-spamblocker/ringdocket /Users/jbm/ringdocket
> cd /Users/jbm/ringdocket
> git init
> ```

A spam call blocker that shows users what scam a blocked call was part of, who else got hit by it, and what is being done about it. Users subscribe for peace of mind from unlimited blocking. They stay for the ledger — a civic record of named campaigns, corroborated reports, carrier attribution, and enforcement status that no competitor surfaces.

The internal strategic frame is a civic accountability product packaged as a consumer utility. The external frame, in all user-facing surfaces, is utility first. The word "disguised" never appears in copy. The civic identity is something the user grows into, not something we recruit them into.

## Stack

- **Web dashboard:** Astro + React islands on Cloudflare Pages
- **API / backend:** Cloudflare Workers
- **Database + auth:** Supabase (Postgres, RLS, materialized views)
- **File storage:** Cloudflare R2 (block list snapshots, Takedown Report PDFs)
- **iOS app:** Native Swift + SwiftUI (scaffolded in Phase 4)
- **Payments:** Stripe (web) + RevenueCat (iOS)
- **Email:** SendGrid
- **Observability:** Sentry + PostHog + Cloudflare Logpush

See [docs/PRD.md](docs/PRD.md) §6 for architectural rationale.

## Setup

```bash
# 1. Use Node 20
nvm use

# 2. Install workspace deps
npm install

# 3. Copy env template and fill in values
cp .env.example .env
# Then fill SUPABASE_URL, SUPABASE_ANON_KEY, etc.

# 4. Run the web app
npm run dev
# → http://localhost:4321
```

Before first deploy:

1. Download variable fonts into `apps/web/public/fonts/` — see [apps/web/public/fonts/README.md](apps/web/public/fonts/README.md)
2. Create Supabase project, apply migrations from `supabase/migrations/`
3. Create Cloudflare R2 bucket (`ringdocket-blocklist`) + KV namespace (rate limit), paste IDs into `packages/worker/wrangler.toml`
4. Set runtime secrets via `wrangler secret put` (see `packages/worker/wrangler.toml` comments)
5. Run the Cloudflare preflight audit: `/Users/jbm/new-project/skills/development/cloudflare-preflight.md`

## Docs

- [docs/PRD.md](docs/PRD.md) — product requirements (v2.0, locked)
- [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) — Forensic Ledger (Light) tokens + rules
- [docs/legal/](docs/legal/) — privacy policy, terms, CAN-SPAM footer, delist playbook

## Contributing

See [CLAUDE.md](CLAUDE.md) for project-specific guidance. Follow the Plan → Work → Review → Compound loop. Run the design + code + security reviews appropriate to what changed before finishing any task.

## License

Proprietary — LIGHTHOUSE 27 LLC. All rights reserved.
', 90, 'app-spamblocker/ringdocket/README.md'
FROM projects WHERE name = 'Ringdocket' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'README', '# Ringdocket iOS

Phase 4a — "Block list on my phone" MVP.

One screen, one button. Tap **Sync block list** → app downloads the current Ringdocket block list (~24k corroborated spam numbers) → hands it to iOS via the Call Directory Extension → those numbers never ring.

No auth, no reporting, no in-app subscription yet. That''s Phase 4b.

---

## Prerequisites

1. **Xcode 15+** (App Store, free, ~10 GB). Open it once after install to accept the license + install simulators.
2. **XcodeGen**:
   ```bash
   brew install xcodegen
   ```
3. **Apple ID** — any Apple ID is fine for personal-device testing. Free-tier signed builds expire after 7 days; you re-deploy from Xcode to refresh.
4. **A physical iPhone + cable.** Call Directory Extensions don''t run in the iOS Simulator (no Phone app there). You must test on a real device.

You do **not** need the $99/yr Apple Developer Program enrollment for this phase. That comes later for TestFlight + App Store submission.

---

## First-time setup

```bash
cd /Users/jbm/new-project/app-spamblocker/ringdocket/apps/ios
xcodegen generate
open Ringdocket.xcodeproj
```

Xcode opens. You''ll see two targets in the project navigator:

- **Ringdocket** — the iOS app (one screen, one button)
- **RingdocketBlockList** — the Call Directory Extension that installs the block list

### Configure signing (one-time per Mac)

For both targets:

1. Click the project root in Xcode → select the **Ringdocket** target → **Signing & Capabilities** tab
2. Toggle on **Automatically manage signing**
3. **Team:** pick your personal Apple ID team (it''ll appear after you sign in to Xcode → Settings → Accounts)
4. Bundle Identifier should already read `com.lighthouse27.ringdocket` — but if Apple complains it''s taken, change the prefix in `project.yml`:
   ```yaml
   options:
     bundleIdPrefix: com.<your-handle>
   ```
   Then re-run `xcodegen generate`.
5. Repeat for the **RingdocketBlockList** target.

### Configure App Groups (one-time per Apple Developer account)

The app and the extension share data via an **App Group container**. iOS won''t let either target access it until the App Group is registered with your Apple Developer account.

For both targets:

1. **Signing & Capabilities** → **+ Capability** → **App Groups**
2. **+** under the App Groups list → enter `group.com.lighthouse27.ringdocket` (or match your bundle prefix)
3. Check the box next to it
4. The same App Group must be ticked on **both** targets — that''s the whole point.

Xcode auto-registers the App Group with Apple''s developer portal under your team.

### Run on your phone

1. Connect your iPhone with a cable. Trust the computer when prompted.
2. In Xcode top bar: pick your iPhone as the target device (instead of the simulator).
3. **Cmd+R** — Xcode builds, signs, and launches Ringdocket on your phone.
4. First launch: iOS will refuse to open the app because it''s signed by a personal Apple ID. Go to **Settings → General → VPN & Device Management** → tap your Apple ID → **Trust**. Then re-launch from the home screen.

### Enable the Call Directory Extension

iOS doesn''t auto-enable extensions. The user has to opt in:

**Settings → Phone → Call Blocking & Identification → toggle Ringdocket on.**

The app''s status text reminds you to do this if it detects the extension is installed but disabled.

### Test it

1. Tap **Sync block list** in the app
2. Status flips to "Syncing… → Reloading extension… → Synced and active"
3. The 24k+ corroborated numbers are now installed in iOS''s call-blocking database
4. To verify a specific block: pick any number from `https://blocklist.ringdocket.com/current.json`, ask a friend to call from that number — your phone won''t ring
5. (Easier verification on a clean device: temporarily put a number you can call from into the local payload at `~/Library/Group Containers/group.com.lighthouse27.ringdocket/blocklist.json` via a debug-mode override — Phase 4b will add a developer toggle for this.)

---

## File layout

```
apps/ios/
├── project.yml                         # XcodeGen config — source of truth
├── README.md                           # this file
├── .gitignore                          # ignores xcodeproj (regenerated)
├── Ringdocket/                         # iOS app target
│   ├── RingdocketApp.swift             # @main app entry point
│   ├── ContentView.swift               # the one screen
│   ├── BlockListSync.swift             # actor — downloads + writes JSON
│   ├── Brand.swift                     # Forensic Ledger color tokens
│   ├── Ringdocket.entitlements         # App Group capability
│   └── Assets.xcassets/                # AppIcon + AccentColor
└── RingdocketBlockList/                # Call Directory Extension target
    ├── CallDirectoryHandler.swift      # CXCallDirectoryProvider impl
    ├── Info.plist                      # NSExtensionPointIdentifier
    └── RingdocketBlockList.entitlements
```

---

## What''s next (Phase 4b)

After the block list is verified working on a phone, we layer:

- Sign-in flow (Supabase magic link via `ASWebAuthenticationSession`)
- Home screen with personal stats (mirrors `app.ringdocket.com/app/home`)
- Report-a-call form (`POST /api/report` to the worker)
- Settings (deep links to the web dashboard for billing)
- Background block list refresh (BGAppRefreshTask, daily)
- App icon (currently placeholder — needs a real icon designed per the brand guide)
- TestFlight + App Store enrollment ($99/yr)

See [docs/ios-brand-guide.md](../../docs/ios-brand-guide.md) for the 9-screen V1 spec.

---

## Troubleshooting

**"App Group container missing" error in the app**
→ The App Group capability isn''t enabled on one or both targets. Re-check Signing & Capabilities for both Ringdocket AND RingdocketBlockList. The App Group ID has to be ticked on both with the same string.

**"Synced, but the extension is disabled"**
→ Settings → Phone → Call Blocking & Identification → toggle Ringdocket on. iOS requires the user to opt in; this can''t be done programmatically.

**Build fails with code-signing errors**
→ In Xcode: Settings → Accounts → make sure your Apple ID is signed in. Project root → Signing & Capabilities → "Automatically manage signing" + pick your personal team.

**"Could not find module ''CallKit''"**
→ Wrong target. The CallKit import in `CallDirectoryHandler.swift` only resolves under the Extension target. Run via the **Ringdocket** scheme, which builds both.

**Numbers I expect to be blocked still ring**
→ iOS''s CDE consults the database before ringing. If the database doesn''t include a specific number, the call rings. Check whether that number is on `https://blocklist.ringdocket.com/current.json` — if not, it''s not in our list (see the "FTC feed coverage" note in `progress.txt`).
', 90, 'app-spamblocker/ringdocket/apps/ios/README.md'
FROM projects WHERE name = 'Ringdocket' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'README', '# Fonts

The app self-hosts five variable font files across four families. Files are in `.ttf` format as a dev expedient — convert to `.woff2` before first production deploy (see "Optimization" below) for ~60% smaller downloads.

## Installed files

| Filename | Family | Role | License | Size |
|----------|--------|------|---------|------|
| `bricolage-grotesque-variable.ttf` | Bricolage Grotesque | Display (hero, section titles) | OFL | ~408 KB |
| `newsreader-variable.ttf` | Newsreader | Narrative / body prose | OFL | ~449 KB |
| `newsreader-italic-variable.ttf` | Newsreader Italic | Narrative emphasis (inside display) | OFL | ~493 KB |
| `inter-tight-variable.ttf` | Inter Tight | UI chrome (buttons, chips, nav) | OFL | ~581 KB |
| `jetbrains-mono-variable.ttf` | JetBrains Mono | Evidence / data (phones, timestamps, IDs) | OFL | ~189 KB |

Total: ~2.1 MB. Browsers cache these on first visit.

## Role rules (enforce in component library)

- **Bricolage Grotesque** — never in body paragraphs, never in UI chrome. Display only.
- **Newsreader** — never in buttons, never in numeric data. Narrative only. Italic face used for emphasis inside Bricolage display headlines.
- **Inter Tight** — never in paragraph-length copy (>2 sentences). Utility only.
- **JetBrains Mono** — exclusively for data-as-data: phone numbers, UUIDs, timestamps, case IDs, reputation scores.

## Sources

All four families are on Google Fonts, Open Font License:

- Bricolage Grotesque: https://fonts.google.com/specimen/Bricolage+Grotesque
- Newsreader: https://fonts.google.com/specimen/Newsreader
- Inter Tight: https://fonts.google.com/specimen/Inter+Tight
- JetBrains Mono: https://fonts.google.com/specimen/JetBrains+Mono

## Optimization — convert to .woff2 before production

The current `.ttf` files work in every modern browser but are ~60% larger than the equivalent `.woff2`. Before first production deploy, convert:

```bash
pip install fonttools brotli
cd apps/web/public/fonts/

# Example for one family — repeat per file
pyftsubset bricolage-grotesque-variable.ttf \
  --flavor=woff2 \
  --output-file=bricolage-grotesque-variable.woff2 \
  --layout-features=''*'' \
  --unicodes=''U+0000-00FF,U+2000-206F,U+2070-209F,U+20A0-20CF''
```

After conversion, update `src/styles/global.css` `@font-face` declarations:
- Change `url(''/fonts/[name].ttf'')` → `url(''/fonts/[name].woff2'')`
- Change `format(''truetype-variations'')` → `format(''woff2-variations'')`

And `src/layouts/Base.astro` `<link rel="preload">` hints:
- Change `.ttf` → `.woff2` and `type="font/ttf"` → `type="font/woff2"`

## Privacy

Do NOT hotlink Google Fonts in production. Self-hosting is required for privacy + latency + the Cloudflare portfolio convention. See `docs/DESIGN-SYSTEM.md` §3 "Web font loading."
', 90, 'app-spamblocker/ringdocket/apps/web/public/fonts/README.md'
FROM projects WHERE name = 'Ringdocket' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'README', '# Ringdocket — Brand Guide

The authoritative brand reference. Read the section that matches your work; each file stands on its own.

---

## Five sections

1. **[01-foundation.md](./01-foundation.md)** — Purpose, mission, vision, values, positioning, category frame, audience personas, origin narrative, brand essence.

2. **[02-voice-tone.md](./02-voice-tone.md)** — Voice principles, tone modulation by context, anti-patterns with replacements, structural patterns, vocabulary (allowed + forbidden + legal-sensitive), emoji and punctuation policy, 15 gold-standard exemplars.

3. **[03-visual-identity.md](./03-visual-identity.md)** — Identity philosophy, wordmark system (variants, clear space, don''ts, co-brand lockup), corroboration seal SVG spec, color meaning beyond tokens, iconography framework, motion vocabulary, printable do/don''t checklist.

4. **[04-messaging.md](./04-messaging.md)** — Elevator pitches (3 lengths), five value pillars, competitive matrix, audience-specific messaging, 16 headline patterns, 30+ copy library entries (taglines, social bios, App Store listing, email subjects, push notifications, 404/maintenance copy), objection handling, proof-point bank with as-of dates, 30+ CTAs, 5 GTM press angles.

5. **[05-applications.md](./05-applications.md)** — How the brand shows up on 15 touchpoints: marketing site, web dashboard, iOS app, transactional email, editorial digests, push notifications, social, press kit, App Store listing, Stripe receipts, support, legal pages, error states, founder communications, co-brand. Closes with 32 absolute "things we''ll never do."

---

## Related docs (not in this folder — older foundation)

- **[../DESIGN-SYSTEM.md](../DESIGN-SYSTEM.md)** — Tokens, component patterns, Tailwind config. Source of truth for implementation-level visual specs.
- **[../ios-brand-guide.md](../ios-brand-guide.md)** — iOS-specific adaptations (Xcode color sets, touch targets, Dynamic Type, SF Symbols policy, 9 V1 screens).
- **[../ios-mockup-prompt.md](../ios-mockup-prompt.md)** — Copy-paste prompt for generating iOS mockups in design tools.
- **[../PRD.md](../PRD.md)** — Product requirements. §1 Vision, §4 Differentiation, §13 Regulatory/legal copy rails, §17 Marketing & GTM.

---

## When to read which file

| You''re about to… | Read this first |
|---|---|
| Hire a designer | 01 + 03 + 05 |
| Brief a journalist | 01 + 04 (§GTM hooks) |
| Write a marketing email | 02 + 04 + 05 |
| Build a new product surface | 03 + 05 + DESIGN-SYSTEM.md |
| Write App Store copy | 04 (§copy library) + 05 (§App Store) |
| Train a support rep | 02 + 05 (§support) |
| Run a competitive teardown | 01 (§positioning) + 04 (§positioning matrix) |
| Pitch a partnership | 01 + 05 (§co-brand) |
| Respond to a delist appeal | 02 (§delist tone) + 05 (§support templates) |
| Draft a press release | 01 + 04 + 05 (§press kit) |

---

## Ringdocket voice, in one sentence

*A public ledger for the spam economy, written like a case file — direct, stoic, citing its own evidence.*

If something you''re writing doesn''t fit that sentence, it''s not in voice.
', 90, 'app-spamblocker/ringdocket/docs/brand/README.md'
FROM projects WHERE name = 'Ringdocket' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'README', '# Email Templates

Branded HTML email templates for Ringdocket. Built to preview in the browser today and ship through SendGrid (and Supabase, for magic links) later.

## What''s here

### Supabase auth templates (production HTML)

These are the 6 templates Supabase sends from the Authentication → Email Templates dashboard. Each lives as production-ready HTML with Supabase placeholder tokens preserved. Paste each into the matching Supabase template slot — no build step or "view source" needed.

| Supabase slot | Production HTML | Plain-text | Tokens used | Subject |
|---------------|-----------------|------------|-------------|---------|
| Magic Link | `apps/web/public/email-templates/magic-link.html` | `magic-link.txt` | `{{ .ConfirmationURL }}` | Your Ringdocket sign-in link |
| Confirm sign up | `apps/web/public/email-templates/confirm-signup.html` | `confirm-signup.txt` | `{{ .ConfirmationURL }}` | Confirm your Ringdocket sign-up |
| Invite user | `apps/web/public/email-templates/invite-user.html` | `invite-user.txt` | `{{ .ConfirmationURL }}` | You''re invited to Ringdocket |
| Change email address | `apps/web/public/email-templates/change-email.html` | `change-email.txt` | `{{ .ConfirmationURL }}`, `{{ .NewEmail }}` | Confirm your new Ringdocket email |
| Reset password | `apps/web/public/email-templates/reset-password.html` | `reset-password.txt` | `{{ .ConfirmationURL }}` | Reset your Ringdocket password |
| Reauthentication | `apps/web/public/email-templates/reauthentication.html` | `reauthentication.txt` | `{{ .Token }}` | Your Ringdocket verification code |

### Transactional (SendGrid) templates

Custom emails sent from a Cloudflare Worker via SendGrid in Phase 5. Built as Astro previews with realistic dummy data. The `magic-link.astro` Astro preview is also kept for visual review.

| Template | Source (Astro) | Plain-text fallback | Subject |
|----------|----------------|---------------------|---------|
| Welcome | `apps/web/src/pages/email-preview/welcome.astro` | `welcome.txt` | Welcome to the ledger |
| Weekly Digest | `apps/web/src/pages/email-preview/weekly-digest.astro` | `weekly-digest.txt` | Public Enemy #1 — week of [date] |
| Monthly Impact | `apps/web/src/pages/email-preview/monthly-impact.astro` | `monthly-impact.txt` | Your Ringdocket impact — [Month] |
| Index (admin) | `apps/web/src/pages/email-preview/index.astro` | — | (not an email — directory page) |

## How to preview

```bash
cd apps/web
npm run dev
```

Then visit:

- **`http://localhost:4321/email-preview`** — admin index, links to everything
- Each Supabase template''s HTML is at `http://localhost:4321/email-templates/<name>.html` (open in browser to view)
- Astro previews for transactional emails are at `http://localhost:4321/email-preview/<name>`

## How to install Supabase templates

For each of the 6 templates above:

1. Open the production HTML file in your editor or browser (e.g., `apps/web/public/email-templates/magic-link.html`)
2. Copy the entire file contents
3. Open Supabase Dashboard → **Authentication** → **Email Templates** → pick the matching slot (Magic Link, Confirm sign up, Invite user, Change Email Address, Reset Password, Reauthentication)
4. Set the **Subject** to the value in the table above
5. Paste the HTML into the **Message body**
6. Confirm the placeholder tokens (`{{ .ConfirmationURL }}`, `{{ .NewEmail }}`, or `{{ .Token }}`) appear in the body — Supabase substitutes these at send time
7. Save
8. Send a test (Magic Link is the easiest one to test — request a sign-in link to your own address)

> **Note:** The HTML files in `public/email-templates/` are hand-written, NOT generated by `npm run build`. The Astro static build would bake placeholder URLs into the output and lose the `{{ .ConfirmationURL }}` tokens. Always paste from the `.html` files directly.

## Plain-text fallbacks

Each `.txt` file mirrors the HTML email. SendGrid will send these alongside the HTML automatically — clients that prefer plain (and spam filters scoring multipart/alternative) get a clean version.

When you wire SendGrid templating, hand SendGrid both bodies (HTML + plaintext) per send.

## TODO list — must address before sending

- [ ] **Mailing address** — every template currently shows `[TODO: Add LIGHTHOUSE 27 LLC mailing address]` in the footer. CAN-SPAM (15 U.S.C. §7704(a)(5)(A)(iii)) requires a valid physical postal address in every commercial email. See `apps/web/src/pages/can-spam.astro` §2 for the format.
- [ ] **Unsubscribe URLs** — placeholders in `welcome`, `weekly-digest`, and `monthly-impact` (`[TODO: unsubscribe_url_group_*]`). Replace with SendGrid `{{unsubscribe}}` substitution tags once unsubscribe groups are configured. See `apps/web/src/pages/can-spam.astro` §7 for the four planned groups.
- [ ] **Dynamic data templating** — weekly-digest and monthly-impact currently use realistic dummy data baked into the Astro files. When SendGrid is wired (Phase 5 per PRD §11), replace dummy values with SendGrid Handlebars (`{{phone}}`, `{{campaign_name}}`, etc.) — or better, render the HTML on a Worker and POST to SendGrid''s send endpoint with the final body inline.
- [ ] **Email preferences page** — every footer links to `https://ringdocket.com/account/email-preferences`. That page doesn''t exist yet (per `can-spam.astro` §8, it''s planned). Build it before any marketing send.
- [ ] **Branded fonts** (optional) — Bricolage Grotesque + Newsreader could be re-added via Google Fonts `<link>` tags in each `<head>`. Trade-offs: a network fetch on email open (privacy/latency) and Outlook strips `<link rel=stylesheet>` anyway. Web-safe Georgia + system-sans is the safer default; Brian can revisit after deliverability is established.

## What this session did NOT deliver

- **No sending pipeline.** The weekly digest and monthly impact emails aren''t wired to a sender. SendGrid integration is Phase 5 work (per PRD §11). This session shipped templates + previews only.
- **No queue / scheduler.** A Cloudflare Worker cron will eventually trigger the weekly Monday send and the monthly 1st-of-the-month send. Not built.
- **No data layer.** Dummy values in weekly-digest and monthly-impact need to be backed by Supabase queries (top-5 corroborated, user''s own report counts, first-flag credits, pending expiry).

## Constraints honored in the templates

- **Inline CSS only.** `style="..."` on every element. No `<style>` blocks. Gmail/Outlook strip those.
- **Table-based layout.** Single-column 600px-wide centered table. Works in legacy Outlook.
- **Web-safe fonts only.** Georgia for prose, system-sans for chrome.
- **No JS, no forms, no inputs.** Static HTML.
- **Mobile-first single column.** Fluid 600px max-width with `width:100%`.
- **Plain-text fallback** present for every HTML email.
- **Accent color (`#C2370A`) is a stamp** — used only on the wordmark period and a single 2px hairline on hero sections. Buttons are `ink-primary` (`#1B1F27`). No accent on links or CTAs.

## File-tree summary

```
apps/web/
  src/pages/email-preview/
    index.astro            ← admin directory (not branded)
    magic-link.astro       ← Astro preview kept for visual review
    welcome.astro
    weekly-digest.astro
    monthly-impact.astro
  public/email-templates/
    magic-link.html        ← Supabase auth — production HTML (paste-ready)
    magic-link.txt
    confirm-signup.html
    confirm-signup.txt
    invite-user.html
    invite-user.txt
    change-email.html
    change-email.txt
    reset-password.html
    reset-password.txt
    reauthentication.html
    reauthentication.txt
    welcome.txt            ← SendGrid plain-text
    weekly-digest.txt
    monthly-impact.txt
docs/email-templates/
  README.md                ← this file
```
', 90, 'app-spamblocker/ringdocket/docs/email-templates/README.md'
FROM projects WHERE name = 'Ringdocket' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'README', '# @ringdocket/shared

Zod schemas + TypeScript types shared across the Ringdocket worker, web, and iOS codebases.

## What lives here

- **Postgres enums** — `ScamCategory`, `NumberState`, `SubscriptionTier`, etc. Must match `001_initial_schema.sql`.
- **Primitives** — `E164Phone`, `Uuid`, `Timestamp`, `IpSubnet`, `DeviceFingerprint`.
- **DB row shapes (snake_case)** — `PendingReportRow`, `ReportRow`, `PhoneNumberRow`, `CampaignRow`, etc.
- **API shapes (camelCase)** — `ReportInput`, `ReportAcceptedResponse`, `BlockListManifest`, `DelistAppealInput`.
- **Constants** — corroboration thresholds, rate limit caps, quota values.

## Casing rule

- **API boundaries** (request/response bodies between worker ↔ iOS or worker ↔ web): `camelCase`
- **DB row shapes** (mirror Postgres columns): `snake_case`
- Mappers do conversion at the Worker layer. This is deliberate: the DB uses snake_case, the TypeScript/JavaScript ecosystem uses camelCase.

## Usage in the worker

```ts
import {
  ReportInputSchema,
  ReportAcceptedResponseSchema,
  ApiErrorResponseSchema,
} from ''@ringdocket/shared'';

const parsed = ReportInputSchema.safeParse(await req.json());
if (!parsed.success) {
  return Response.json(
    {
      error: ''Invalid report payload'',
      code: ''invalid_input'',
      details: { issues: parsed.error.issues },
    } satisfies z.infer<typeof ApiErrorResponseSchema>,
    { status: 400 },
  );
}
```

## Usage in the iOS app (future)

The Swift app will regenerate equivalents from this package via codegen. V1 will hand-maintain parallel Swift types; V2 can automate with e.g. `quicktype` against the Zod → JSON Schema output.

## Don''t do this

- Don''t import from relative paths in consumers — always `@ringdocket/shared`.
- Don''t add runtime dependencies beyond `zod`. This package is the lightweight contract layer — no HTTP clients, no Supabase, no framework code.
- Don''t duplicate schemas across packages. If a type is used in more than one place, it lives here.
', 90, 'app-spamblocker/ringdocket/packages/shared/README.md'
FROM projects WHERE name = 'Ringdocket' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'README', '# Ringdocket Supabase Migrations

This directory contains the initial V1 schema, RLS policies, triggers, and
seed data for the Ringdocket spam-blocker product. These migrations are
schema-only. No secrets, no app code.

## File order

Migrations run in filename order. Do not reorder. Do not skip.

1. **`001_initial_schema.sql`** — Extensions, enum types, tables, indexes,
   CHECK constraints, foreign keys.
2. **`002_rls_policies.sql`** — Enables RLS on every table and installs
   the policy pack from the Phase B security review.
3. **`003_triggers_and_functions.sql`** — Corroboration promotion,
   activity decay detection, account deletion cascade, Founding Flagger
   cap enforcement, pending-report expiry, and the auth -> public.users
   bootstrap trigger.
4. **`004_seed_data.sql`** — Badge catalog, Founding Flagger counter
   singleton, FTC system-user sentinel.

## How to apply

Once the Supabase project exists locally or remotely, apply from the
project root (`app-spamblocker/`):

```bash
# Apply any pending migrations (local dev or linked remote project)
supabase migration up

# Or: push local migrations to the linked remote project
supabase db push
```

For a clean rebuild of a local dev stack:

```bash
supabase db reset
```

`supabase db reset` drops the local DB and reapplies all migrations in
order, then runs `004_seed_data.sql` as the last migration. This is the
recommended local workflow during development.

## Idempotency

Every migration in this directory is idempotent:

| File | Idempotency mechanism |
|------|------------------------|
| 001  | `CREATE EXTENSION IF NOT EXISTS`, `CREATE TYPE ... EXCEPTION WHEN duplicate_object`, `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`. |
| 002  | `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` is a no-op if already on. Each policy is wrapped with `DROP POLICY IF EXISTS` then `CREATE POLICY`. |
| 003  | `CREATE OR REPLACE FUNCTION` for all functions; `DROP TRIGGER IF EXISTS ... ; CREATE TRIGGER` for all triggers. |
| 004  | `INSERT ... ON CONFLICT (slug/id) DO UPDATE` or `DO NOTHING`. |

Rerunning the set against an already-migrated database is safe.

## What lives outside these migrations

- **`auth.*` schema** — Supabase-managed. `public.users` joins to
  `auth.users(id) ON DELETE CASCADE`, but we do not create tables, policies,
  or functions in the `auth` schema. The one exception is the
  `on_auth_user_created` trigger declared on `auth.users`, which is the
  standard Supabase-blessed pattern and is created via `SECURITY DEFINER`.
- **Cloudflare KV counters** — Free-tier report cap (`{user_id}:report_count:{YYYY-MM}`)
  lives in Cloudflare KV, not Postgres. It is checked in the Worker before
  hitting Supabase.
- **Cloudflare Rate Limiting rules** — `POST /api/reports` rate limits
  are configured in the Cloudflare dashboard, not in SQL.
- **Edge Functions** — Account deletion is triggered from a Supabase Edge
  Function that calls the `handle_user_deletion(uuid)` function here.
  The Edge Function itself is not in this directory.
- **Read-only Metabase role** — Created manually post-deploy per Finding 12
  of the security review. Not in migrations because it requires a
  password that should be set outside source control.

## Verify-after-apply checklist

After running migrations against a Supabase project, verify in the
Supabase dashboard (or via `psql`):

- [ ] **RLS is enabled on every `public.*` table.** Run:
  ```sql
  SELECT tablename, rowsecurity
  FROM pg_tables
  WHERE schemaname = ''public''
  ORDER BY tablename;
  ```
  Every row should show `rowsecurity = true`.
- [ ] **All 10 tables exist:** `users`, `numbers`, `pending_reports`,
  `reports`, `campaigns`, `badges`, `user_badges`, `devices`,
  `subscriptions`, `ftc_complaints`, `founding_flagger_counter`,
  `delist_appeals`.
- [ ] **All enum types exist:** `number_state`, `retired_reason`,
  `report_category`, `device_platform`, `subscription_status`,
  `subscription_tier`, `delist_appeal_status`, `takedown_source`.
- [ ] **All triggers are present:**
  ```sql
  SELECT tgname, tgrelid::regclass AS table
  FROM pg_trigger
  WHERE NOT tgisinternal
    AND tgname IN (
      ''on_auth_user_created'',
      ''trg_promote_corroborated_reports'',
      ''trg_enforce_founding_flagger_cap''
    );
  ```
  All three should be present.
- [ ] **All functions are present:**
  ```sql
  SELECT proname FROM pg_proc
  WHERE pronamespace = ''public''::regnamespace
    AND proname IN (
      ''handle_new_auth_user'',
      ''promote_corroborated_reports'',
      ''detect_retired_campaigns'',
      ''handle_user_deletion'',
      ''enforce_founding_flagger_cap'',
      ''expire_stale_pending_reports''
    );
  ```
- [ ] **Seed data is present:**
  ```sql
  SELECT COUNT(*) FROM public.badges;          -- expect 8
  SELECT claimed, cap FROM public.founding_flagger_counter;  -- expect 0, 500
  ```
- [ ] **E.164 CHECK constraint rejects bad input:**
  ```sql
  INSERT INTO public.numbers (phone) VALUES (''not-a-phone'');
  -- expect: ERROR: new row ... violates check constraint "numbers_phone_check"
  ```
- [ ] **Client key (anon) cannot read `ftc_complaints`, `pending_reports`,
  `founding_flagger_counter`, or `delist_appeals`.** These tables have
  RLS enabled with zero user-facing policies; default-deny returns zero
  rows through the anon key.

## Design notes

- **Founding Flagger cap** — Implemented as a single-row table with a
  `CHECK (id = 1)` constraint plus a `CHECK (claimed <= cap)` guard. A
  BEFORE INSERT/UPDATE trigger on `subscriptions` atomically increments
  the counter; the CHECK constraint rejects the 501st founding sub. The
  counter is decremented only on account deletion (inside
  `handle_user_deletion`), not on tier downgrade — slots are claimed by
  the account, not the current subscription state.
- **Account deletion** — Option B (anonymize). Reports persist with
  `user_id = NULL` and `notes = NULL`; all other per-user rows are
  hard-deleted. `numbers.first_flag_user_id` is nulled for any numbers
  the deleted user first-flagged.
- **Corroboration** — A trigger on `pending_reports` insert checks
  distinctness across `user_id`, `device_fingerprint`, and `ip_subnet`
  within a rolling 14-day window. Threshold is 3. When met, all
  qualifying pending rows are promoted into `reports` (immutable) and
  deleted from `pending_reports`.
- **FTC system user** — Sentinel UUID `00000000-0000-0000-0000-000000000001`
  exists so FTC-seeded numbers have a non-null attribution without
  conflating them with deleted-user NULLs.

## References

- PRD: `/Users/jbm/new-project/app-spamblocker/spam-blocker-prd.md` §9, §14
- Security review: `/Users/jbm/new-project/app-spamblocker/prd-build/phase-b-security-review.md`
- Phase A decisions: `/Users/jbm/new-project/app-spamblocker/prd-build/phase-a-prd-clarifications.md`
- Phase B decisions: `/Users/jbm/new-project/app-spamblocker/prd-build/phase-b-decisions.md`
', 90, 'app-spamblocker/ringdocket/supabase/migrations/README.md'
FROM projects WHERE name = 'Ringdocket' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'README', '# Ringdocket Supabase Migrations

This directory contains the initial V1 schema, RLS policies, triggers, and
seed data for the Ringdocket spam-blocker product. These migrations are
schema-only. No secrets, no app code.

## File order

Migrations run in filename order. Do not reorder. Do not skip.

1. **`001_initial_schema.sql`** — Extensions, enum types, tables, indexes,
   CHECK constraints, foreign keys.
2. **`002_rls_policies.sql`** — Enables RLS on every table and installs
   the policy pack from the Phase B security review.
3. **`003_triggers_and_functions.sql`** — Corroboration promotion,
   activity decay detection, account deletion cascade, Founding Flagger
   cap enforcement, pending-report expiry, and the auth -> public.users
   bootstrap trigger.
4. **`004_seed_data.sql`** — Badge catalog, Founding Flagger counter
   singleton, FTC system-user sentinel.

## How to apply

Once the Supabase project exists locally or remotely, apply from the
project root (`app-spamblocker/`):

```bash
# Apply any pending migrations (local dev or linked remote project)
supabase migration up

# Or: push local migrations to the linked remote project
supabase db push
```

For a clean rebuild of a local dev stack:

```bash
supabase db reset
```

`supabase db reset` drops the local DB and reapplies all migrations in
order, then runs `004_seed_data.sql` as the last migration. This is the
recommended local workflow during development.

## Idempotency

Every migration in this directory is idempotent:

| File | Idempotency mechanism |
|------|------------------------|
| 001  | `CREATE EXTENSION IF NOT EXISTS`, `CREATE TYPE ... EXCEPTION WHEN duplicate_object`, `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`. |
| 002  | `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` is a no-op if already on. Each policy is wrapped with `DROP POLICY IF EXISTS` then `CREATE POLICY`. |
| 003  | `CREATE OR REPLACE FUNCTION` for all functions; `DROP TRIGGER IF EXISTS ... ; CREATE TRIGGER` for all triggers. |
| 004  | `INSERT ... ON CONFLICT (slug/id) DO UPDATE` or `DO NOTHING`. |

Rerunning the set against an already-migrated database is safe.

## What lives outside these migrations

- **`auth.*` schema** — Supabase-managed. `public.users` joins to
  `auth.users(id) ON DELETE CASCADE`, but we do not create tables, policies,
  or functions in the `auth` schema. The one exception is the
  `on_auth_user_created` trigger declared on `auth.users`, which is the
  standard Supabase-blessed pattern and is created via `SECURITY DEFINER`.
- **Cloudflare KV counters** — Free-tier report cap (`{user_id}:report_count:{YYYY-MM}`)
  lives in Cloudflare KV, not Postgres. It is checked in the Worker before
  hitting Supabase.
- **Cloudflare Rate Limiting rules** — `POST /api/reports` rate limits
  are configured in the Cloudflare dashboard, not in SQL.
- **Edge Functions** — Account deletion is triggered from a Supabase Edge
  Function that calls the `handle_user_deletion(uuid)` function here.
  The Edge Function itself is not in this directory.
- **Read-only Metabase role** — Created manually post-deploy per Finding 12
  of the security review. Not in migrations because it requires a
  password that should be set outside source control.

## Verify-after-apply checklist

After running migrations against a Supabase project, verify in the
Supabase dashboard (or via `psql`):

- [ ] **RLS is enabled on every `public.*` table.** Run:
  ```sql
  SELECT tablename, rowsecurity
  FROM pg_tables
  WHERE schemaname = ''public''
  ORDER BY tablename;
  ```
  Every row should show `rowsecurity = true`.
- [ ] **All 10 tables exist:** `users`, `numbers`, `pending_reports`,
  `reports`, `campaigns`, `badges`, `user_badges`, `devices`,
  `subscriptions`, `ftc_complaints`, `founding_flagger_counter`,
  `delist_appeals`.
- [ ] **All enum types exist:** `number_state`, `retired_reason`,
  `report_category`, `device_platform`, `subscription_status`,
  `subscription_tier`, `delist_appeal_status`, `takedown_source`.
- [ ] **All triggers are present:**
  ```sql
  SELECT tgname, tgrelid::regclass AS table
  FROM pg_trigger
  WHERE NOT tgisinternal
    AND tgname IN (
      ''on_auth_user_created'',
      ''trg_promote_corroborated_reports'',
      ''trg_enforce_founding_flagger_cap''
    );
  ```
  All three should be present.
- [ ] **All functions are present:**
  ```sql
  SELECT proname FROM pg_proc
  WHERE pronamespace = ''public''::regnamespace
    AND proname IN (
      ''handle_new_auth_user'',
      ''promote_corroborated_reports'',
      ''detect_retired_campaigns'',
      ''handle_user_deletion'',
      ''enforce_founding_flagger_cap'',
      ''expire_stale_pending_reports''
    );
  ```
- [ ] **Seed data is present:**
  ```sql
  SELECT COUNT(*) FROM public.badges;          -- expect 8
  SELECT claimed, cap FROM public.founding_flagger_counter;  -- expect 0, 500
  ```
- [ ] **E.164 CHECK constraint rejects bad input:**
  ```sql
  INSERT INTO public.numbers (phone) VALUES (''not-a-phone'');
  -- expect: ERROR: new row ... violates check constraint "numbers_phone_check"
  ```
- [ ] **Client key (anon) cannot read `ftc_complaints`, `pending_reports`,
  `founding_flagger_counter`, or `delist_appeals`.** These tables have
  RLS enabled with zero user-facing policies; default-deny returns zero
  rows through the anon key.

## Design notes

- **Founding Flagger cap** — Implemented as a single-row table with a
  `CHECK (id = 1)` constraint plus a `CHECK (claimed <= cap)` guard. A
  BEFORE INSERT/UPDATE trigger on `subscriptions` atomically increments
  the counter; the CHECK constraint rejects the 501st founding sub. The
  counter is decremented only on account deletion (inside
  `handle_user_deletion`), not on tier downgrade — slots are claimed by
  the account, not the current subscription state.
- **Account deletion** — Option B (anonymize). Reports persist with
  `user_id = NULL` and `notes = NULL`; all other per-user rows are
  hard-deleted. `numbers.first_flag_user_id` is nulled for any numbers
  the deleted user first-flagged.
- **Corroboration** — A trigger on `pending_reports` insert checks
  distinctness across `user_id`, `device_fingerprint`, and `ip_subnet`
  within a rolling 14-day window. Threshold is 3. When met, all
  qualifying pending rows are promoted into `reports` (immutable) and
  deleted from `pending_reports`.
- **FTC system user** — Sentinel UUID `00000000-0000-0000-0000-000000000001`
  exists so FTC-seeded numbers have a non-null attribution without
  conflating them with deleted-user NULLs.

## References

- PRD: `/Users/jbm/new-project/app-spamblocker/spam-blocker-prd.md` §9, §14
- Security review: `/Users/jbm/new-project/app-spamblocker/prd-build/phase-b-security-review.md`
- Phase A decisions: `/Users/jbm/new-project/app-spamblocker/prd-build/phase-a-prd-clarifications.md`
- Phase B decisions: `/Users/jbm/new-project/app-spamblocker/prd-build/phase-b-decisions.md`
', 90, 'app-spamblocker/supabase/migrations/README.md'
FROM projects WHERE name = 'Ringdocket' LIMIT 1;
