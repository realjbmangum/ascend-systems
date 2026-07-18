---
title: "Building Ringdocket — A Community-Sourced Spam Block List That Actually Runs on Your iPhone"
slug: ringdocket
client: "Self / Lighthouse 27"
clientType: "Internal product"
industry: "Consumer / Telecom"
engagementStart: "2026-04-18"
status: "live"
stack:
  - "Swift + SwiftUI"
  - "iOS Call Directory Extension"
  - "Astro + React islands"
  - "Cloudflare Pages"
  - "Cloudflare Workers"
  - "Cloudflare R2"
  - "Cloudflare KV"
  - "Supabase Postgres + RLS + Auth"
metrics:
  - "28,546 numbers on the block list"
  - "86,519 FTC complaints ingested"
  - "15,049 programmatic SEO pages live"
  - "13 named campaigns clustered"
  - "59 worker tests passing"
seoTitle: "Ringdocket Case Study | Building a Community Spam Block List on Cloudflare + Supabase"
seoDescription: "How I built Ringdocket — a community-sourced iOS call-blocking app with an FTC-seeded block list, 3-account corroboration, and a Cloudflare + Supabase backend that ships block lists to real phones."
publishDate: "2026-05-13T21:52:36-04:00"
updatedDate: "2026-05-13T21:52:36-04:00"
---

## TL;DR

Ringdocket is a community-sourced spam-call block list with a native iOS app and a public web dashboard at [ringdocket.com](https://ringdocket.com). I built it solo as a Lighthouse 27 product, starting with a four-phase PRD on April 18 and validating end-to-end blocking on my own iPhone eleven days later. The backend is a Cloudflare Worker against Supabase Postgres, seeded by a daily FTC complaints cron and grown by user reports that require three-account corroboration inside a 14-day window. The iOS app is native Swift with a Call Directory Extension that reads the same block list every other user reads. As of the snapshot for this write-up: **28,546 numbers on the public block list, 86,519 FTC complaints ingested, 15,049 programmatic SEO pages indexed, 13 clustered campaigns, and one real corroborated report from my own iPhone** — a number that does not exist in the FTC feed, which is exactly the coverage gap user reports are designed to close.

## The problem

I get spam calls every day. Most people do. The carrier-level answers — Verizon Call Filter, T-Mobile Scam Shield, AT&T ActiveArmor — work, sort of, on numbers the carriers already know about. They miss rotating spoofers. They miss campaigns that move from one number to the next every 48 hours. They miss anything a real human reported yesterday but hasn't yet shown up in a carrier's threat-intel feed.

The public FTC Do-Not-Call complaints database is open and well-documented, but it has its own gaps. It is a passive intake system — people who already know to file complaints, file them. Rotating spoofers are usually filed under the spoofed number, not the originator. And the FTC publishes complaints with a 1–2 day lag on `created-date` and a wildly unreliable `violation-date` that can stretch years stale.

The closest thing to a real community feed — the Industry Traceback Group's public traceback data — is intentionally thin. The rich version is industry-only. FCC enforcement actions target carriers, not numbers; useful for attribution badges, not for sourcing new numbers to block.

So the bet I made with Ringdocket was straightforward. Seed an opening block list from the public FTC feed. Build a corroboration-gated reporting flow so any user with the app can add numbers the FTC doesn't see. Ship that list to a real iOS Call Directory Extension so it actually stops the phone from ringing. Make every step of how a number got on the list visible on the web so the product feels like a public ledger, not a black box.

The hard rule from PRD §14 that everything is built around: **a user report only graduates from `pending_reports` to the public block list when three distinct verified accounts — no two sharing a device fingerprint or an IP /24 — report the same number within a rolling 14-day window.** FTC complaints bypass that threshold and hydrate directly. User reports never do.

## The technical approach

Three runtime services, one database, one block list.

**Web (Astro + React islands on Cloudflare Pages).** The marketing site at `ringdocket.com` and the authenticated dashboard at `app.ringdocket.com` are the same Astro project deployed to Pages, split by subdomain and `_redirects` rules. Astro for the static marketing surface (and 15,049 programmatic `/number/[phone]` SEO pages), React islands for the authenticated app shell, AuthGuard, search, and campaign drill-downs. Client-side auth via the Supabase JS client under `localStorage` storageKey `ringdocket.auth`, not SSR. This keeps the marketing surface fully static and the dashboard pages `noindex` so we never have to worry about Cloudflare Pages and Supabase service-role keys at build time.

**Worker (Cloudflare Workers, Hono-style routing).** A single worker at `ringdocket-worker.bmangum1.workers.dev` runs everything: the public report endpoint (`POST /api/report`), the per-user stats endpoint (`POST /api/my-stats`), network stats, pending-reports reads, delist appeals, Stripe checkout / webhook / billing portal, two crons (FTC ingestion at 06:00 UTC, block list snapshot at 08:00 UTC), and admin trigger endpoints gated on `X-Admin-Token`. One worker means one log stream and one set of secrets. 59 tests across 7 files cover the worker end-to-end.

**Database (Supabase Postgres + RLS + Auth).** Every table ships with `ENABLE ROW LEVEL SECURITY` in the same migration that creates it. The service-role key is the only path for the worker to write; anon writes are not permitted on production tables. Supabase Auth supplies the magic-link sign-in flow used by both the web and iOS clients. JWTs are decoded by the worker on every authed request.

**Object storage (Cloudflare R2).** Two buckets. `ringdocket-blocklist` hosts the daily R2 snapshot at `blocklist.ringdocket.com/v{YYYYMMDD}.json` and a `current.json` symlink that the iOS app polls. `ringdocket-reports` archives every raw FTC ingestion response and inbound report payload — the same "archive everything before you parse it" pattern I lean on across every API integration.

**Rate limiting (Cloudflare KV).** A single namespace `RATE_LIMIT` tracks free-tier report quota per device and per IP for the delist appeals endpoint (5/day per IP /24).

**iOS (Swift + SwiftUI, two targets).** The main `Ringdocket` app target and a `RingdocketBlockList` Call Directory Extension target. Both share an App Group container — the main app writes the downloaded block list there, the extension reads it and calls `addBlockingEntry` for every E.164 number. The Call Directory Extension is the only mechanism Apple permits for actually blocking calls before they ring. There is no other path. The project is XcodeGen-driven (`project.yml` is the source of truth; `.xcodeproj` is gitignored) because hand-authored Xcode projects are notoriously fragile in git.

## What we shipped

### Phase 1–2: the pipeline (April 18 → April 21)

The PRD landed on April 18 — about 924 lines covering vision, differentiation, stack, security posture, and the four-phase build plan. Astro scaffold and Cloudflare Pages deploy on day one. Supabase migrations 001–004 set up `numbers`, `pending_reports`, `reports`, `subscriptions`, `users`, all with RLS. R2 buckets and the KV namespace went up the same day. The `POST /api/report` endpoint shipped with JWT auth, E.164 normalization, a 280-character notes field with a PII + profanity filter at the worker layer, and KV-tracked free-tier quotas.

On April 21 I wired the FTC DNC complaints API. The client (`src/lib/ftc-api.ts`) handles pagination, 429 backoff, and async iteration. A cron at 06:00 UTC ingests roughly 10,000 complaints per day. A second cron at 08:00 UTC snapshots the corroborated `numbers` table to R2. After the first manual ingestion: 9,386 complaints fetched, 173 corroborated numbers published to the block list.

### Phase 3: web dashboard + SEO push (April 22 → April 24)

Migration 007 fixed a bug that had been silently filtering out about 3,600 numbers from hydration: the FTC's `violation-date` is user-entered and can be years stale (oldest observed: 2009), while `created-date` is the reliable recency signal. After flipping the hydration query to `created-date`, the block list jumped from **694 to 15,048 numbers in a single migration**. Migration 008 introduced 12 named campaigns and a `cluster_numbers_into_campaigns()` PL/pgSQL function that links numbers to campaigns by `reason` field. Migration 009, two days later, corrected eight mis-clustered patterns after I queried the actual FTC vocabulary and realized half my regex patterns were wrong (FTC uses literal labels with inconsistent double-spaces — `"Medical  & prescriptions"`). The final clustering: **8,026 numbers across 13 campaigns**.

The web dashboard at `app.ringdocket.com` shipped in four chunks: auth shell + AppLayout, home with live stats + a Network Ledger sidebar, campaigns list + per-campaign transparency pages, then delist appeals form + account settings. Pull-to-refresh works. Search is debounced. CSV export for any campaign view.

Then the public SEO push:

- `/campaigns` (index of 13) and `/campaigns/[slug]` (one marketing-style page per campaign with narrative + top 20 numbers + JSON-LD Article schema)
- `/number/[phone]` — **15,049 programmatic pages**, one per corroborated number, each with a FAQPage JSON-LD block targeting "is (xxx) xxx-xxxx a scam" queries
- A custom `/sitemap.xml` endpoint (the `@astrojs/sitemap` package had a compatibility bug with Astro 4.16 — I wrote a 36-line drop-in)
- A `/robots.txt` that allows crawlers, disallows `/app/*`, points at the sitemap
- Submitted to Google Search Console and Bing Webmaster Tools

I also built the Stripe integration — `/api/create-checkout-session`, `/api/stripe-webhook`, `/api/billing-portal`, a public `/pricing` page with three tiers and a Founding Flagger counter — but the keys stay in TEST mode. The discipline I held to here was: **don't sell a promise the product can't keep.** Stripe doesn't go live until the iOS app blocks calls on a real phone.

### Phase 4a + 4b: iOS shipped to a real phone (April 24 → April 29)

Phase 4a was the smallest possible iOS scaffold to answer one question: *does iOS actually consult our block list when we register it via a Call Directory Extension?* Two targets, one shared App Group, `BlockListSync` actor downloads `current.json` from R2, `CallDirectoryHandler` reads it and calls `addBlockingEntry`. One screen, one button. XcodeGen project file.

The blocker on April 24 was that my macOS install was on Sequoia 15.7.1 and the App Store Xcode required Tahoe 26.x. Five days later I had Tahoe + Xcode installed, regenerated the project, signed with my personal Apple ID team, paired my iPhone, trusted the dev cert, enabled the extension at Settings → Apps → Phone → Call Blocking & Identification (Apple moved this from Settings → Phone in iOS 18+), and tapped Sync. **28,546 numbers active on my phone.** The hardest unknown ("does this actually work?") became a known yes.

Phase 4b shipped the full app the same session. Eleven new Swift files, about 1,200 lines of code:

- `Config.swift` — endpoints + the custom `ringdocket://auth/callback` URL scheme
- `Keychain.swift` — `SecItem` wrapper for auth tokens, service-scoped to `com.lighthouse27.ringdocket.auth` (deliberately *not* in the App Group — the Call Directory Extension has no business reading auth state)
- `AuthSession.swift` — magic-link request via `POST /auth/v1/otp`, custom URL scheme callback, JWT decode for `sub` + `email`
- `DeviceID.swift` — persistent UUID v4 in Keychain for `X-Device-Id` (the device fingerprint half of the corroboration anti-collusion rule)
- `Models.swift` — Codable types matching the shared Zod schemas in `@ringdocket/shared`
- `APIClient.swift` — `URLSession` actor with auth header + `X-Device-Id` injection
- `SignInView.swift`, `RootView.swift` — auth gate
- `HomeView.swift` — header, ambient block list status row, narrative hero (this week / all-time / first-flag credits), pending reports with "N of 3" progress bars + 14-day expiry timers, Network Ledger of the 8 most recent corroborated numbers, floating Report FAB
- `ReportView.swift` — E.164-normalized phone field, category Menu, 280-char notes, success state with quota indicator
- `SettingsView.swift` — Account, Block List (manual sync), Subscription (link to web Stripe portal), Preferences, Support, Sign out
- `BackgroundRefresh.swift` — `BGAppRefreshTask` registered on app launch, ~12h opportunistic refresh

Two new worker endpoints supported the iOS HomeView: `POST /api/my-stats` (personal counts: reports all-time, reports this week, pending count, first-flag credits, top category) and an extension to `GET /api/network-stats` adding `recentCorroborated` for the Network Ledger.

### The Network Ledger

The Network Ledger is the part of the product I'm proudest of. It is the thing that makes Ringdocket feel like a public docket and not a black box. Every corroborated number shows up on the home screen of every user — what number, what campaign, when it crossed the threshold, where the first flag came from. The web equivalent is a per-campaign page that lists the top 25 numbers by reputation score with a narrative explaining what kind of scam this campaign represents. Users can see exactly how the list grows.

## Outcome

The pipeline numbers as of the snapshot:

- **86,519 FTC complaints** ingested, cron healthy at ~10k/day
- **28,546 corroborated numbers** on the public block list
- **8,026 numbers clustered** across 13 named campaigns
- **15,049 programmatic SEO pages** indexed
- **59 worker tests** passing, full end-to-end test suite at `scripts/test-report.mjs`
- **1 real user report** from my own iPhone — `(704) 703-2384`, confirmed absent from the FTC feed, waiting on two more accounts to corroborate within 14 days or it expires

That last number is the most important one. The whole point of building user reports on top of the FTC seed was to cover numbers the FTC misses. The first real report from the iOS app was a number that does not exist in the FTC feed — `ftcComplaintCount: 0` in the health snapshot. The coverage gap is now observable, not theoretical.

Three of my own personal spam numbers — (708) 794-3725, (973) 798-3891, and one incomplete I couldn't fully recover — are also absent from both the FTC feed and the block list. That's the gap. Closing it is what the corroboration flow exists for. "The faster we add users, the faster the list builds."

## Lessons

**Archive every raw payload before you parse it.** Every FTC ingestion response goes to R2 before the parser touches it. If a parser bug ever ships, every row in `numbers` and `ftc_complaints` can be rebuilt from R2 alone. The decision cost an hour. It bought permanent insurance.

**The data model is always harder than the integration.** The FTC API was easy. Deciding which date field to filter on (`created-date`, not `violation-date`) was the difference between 694 and 15,048 numbers on the block list. Clustering numbers into campaigns by regex pattern lost three days to misattribution before I dropped the regex and EXACT-matched against the FTC's literal category labels (double-spaces and all). Most of the time spent on this project lived inside the data model, not the wire protocol.

**SOAP, REST, GraphQL, none of it matters. The corroboration rule does.** The non-negotiable from PRD §14 — three distinct verified accounts, no two sharing device fingerprint or IP /24, inside 14 days — is what makes the product not-a-spam-vector. It is the difference between a useful community block list and a coordinated-harassment tool. Every other technical decision was downstream of that constraint. The device-fingerprint Keychain UUID, the IP /24 check in the worker, the 14-day window, the worker-layer profanity + PII filter on notes — all of it traces back to that one rule.

**Don't sell a promise the product can't keep.** I built the Stripe checkout, webhook, billing portal, and `/pricing` page in Phase 3. They stayed in TEST mode for over a week — and still are, until the corroboration loop runs end-to-end with at least three distinct reporting users. The code is in the repo. The keys are not flipped. Shipping is not a license to charge.

**Ship the smallest possible thing that answers the hardest question.** Phase 4a was one screen and one button. Its only purpose was to answer "does iOS actually consult the block list we register?" Answer: yes, 28,546 numbers active. Everything after that became cheaper to build because the foundational unknown was retired. Phase 4b — eleven Swift files, full magic-link auth, home screen, report flow, Network Ledger — landed in a single session immediately after.

**Brave doesn't bounce custom URL schemes from server redirects.** Five debugging incidents in the Phase 4b session — including this one, plus Supabase's `redirect_to` going on the query string instead of in the body, plus `GENERATE_INFOPLIST_FILE: YES` silently blocking complex Info.plist customization. None of these are in the docs. All of them ate hours. The lesson generalizes: every iOS auth flow with a third-party identity provider has a long tail of platform-specific footguns. Budget for it.

**Universal Links are the right answer long-term.** Custom `ringdocket://` URL schemes work, but they break across browsers (Brave is the current offender, others will follow). Universal Links use real `https://` URLs and let Apple's `applinks` machinery intercept at the OS level. They require an AASA file at `https://app.ringdocket.com/.well-known/apple-app-site-association` and the Associated Domains entitlement, which means an Apple Developer Program enrollment ($99/yr). That's the next step before TestFlight.

## What this means for your business

If you have an idea that runs across a custom mobile experience, a public API integration, a real-time data feed, and a public web surface — and you've been told it's a six-month, three-vendor project — what I built with Ringdocket is the shape of the alternative.

Eleven days from PRD to production with a real iOS app on a real phone. One developer. Three runtime services. No agency markup. The same Cloudflare + Supabase stack that powers most of the Lighthouse 27 portfolio. Every architecture decision in this case study — archive raw payloads to R2, gate writes behind the service-role key, ship the smallest thing that retires the biggest unknown — generalizes to whatever your version of "community-sourced, cross-platform, real-time data product" looks like.

If you have a project that fits that shape, the [discovery sprint](/contact) is how it starts. Or run the numbers yourself on the [cost calculator](/tools/cost-calculator).
