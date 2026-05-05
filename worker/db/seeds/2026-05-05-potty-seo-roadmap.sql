-- =============================================================================
-- Seed: Potty Directory SEO Roadmap (Resource) + Top-leverage tasks
-- Run:  wrangler d1 execute ascend-db --remote --file=worker/db/seeds/2026-05-05-potty-seo-roadmap.sql
-- =============================================================================

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'SEO Roadmap — May 2026', '# PottyDirectory SEO Roadmap

> **Snapshot (May 2026):** 28,776 sessions YTD, 91.8% direct/none, 5.13s engagement, 1,320 Google organic sessions in 4 months (~330/mo). 3,699 vendors, ~6,000 pages indexed. AdSense Auto Ads on. Two audiences: B2B porta-potty rental buyers (the money) and B2C public restroom finders (the AI/ChatGPT volume). The site is functionally invisible to Google despite scale. This roadmap fixes that in 90 days.

---

## How to read this doc

- **P1** = ship this week. **P2** = this month. **P3** = month 2-3.
- Every item has a **kill-criterion**: if the success metric isn''t hit by the named date, stop and re-evaluate — don''t keep grinding.
- Audience tag on every move: `[B2B]` rental buyers, `[B2C]` restroom finders, `[BOTH]`.

---

## Phase 1 — Technical SEO Foundation (Week 1-2)

> The site has decent bones (custom sitemap, llms.txt, schema components, breadcrumbs). The crisis isn''t "no SEO infrastructure" — it''s that Google isn''t crawling/ranking what''s there, and 91.8% of GA4 traffic is unattributed. Fix attribution first or every other metric below is noise.

| # | Task | Audience | Priority | Tool | Hrs | Success metric (kill date) | Depends on |
|---|------|----------|----------|------|-----|----------------------------|------------|
| 1.1 | Configure 6 GA4 key events: `listing_view`, `phone_click`, `directions_click`, `website_click`, `map_pin_click`, `submit_listing`, `request_quote` | BOTH | P1 | GA4 Admin > Events | 3 | 100+ key events fired in 7 days. Kill: by Day 7, if events don''t fire, the click handlers are wrong — fix or revert. | — |
| 1.2 | Add a `direct_traffic_filter` Internal Traffic rule in GA4 (filter known IPs) + enable bot filtering (already on by default but verify) | BOTH | P1 | GA4 Admin > Data Streams | 1 | Direct traffic share drops to <60% within 14 days | 1.1 |
| 1.3 | Audit Search Console: index coverage, "Discovered – not indexed" count, manual actions, Core Web Vitals report | BOTH | P1 | GSC | 2 | Document baseline: # indexed vs submitted, top 10 query gaps | — |
| 1.4 | Sitemap audit — verify all 6,000 URLs in `sitemap-index.xml` return 200, lastmod accurate, no orphans | BOTH | P1 | Screaming Frog (free <500 URLs) or `curl` script | 3 | <2% 404/redirect rate in sitemap. Kill: if >10% broken, rebuild sitemap generator before continuing. | — |
| 1.5 | robots.txt audit — confirm AI crawlers allowed (already done), no accidental blocks of `/[state]/` paths | BOTH | P1 | Review `public/robots.txt` | 0.5 | GSC Robots tester passes for 10 sample URLs | — |
| 1.6 | Canonical tag audit on city pages — verify `<link rel="canonical">` resolves to self, no www/non-www mismatches | BOTH | P1 | View source on 20 sample pages | 1 | 100% of sampled city pages have correct self-canonical | 1.4 |
| 1.7 | Schema audit — run 10 city pages through Rich Results Test. Verify `LocalBusiness`, `BreadcrumbList`, `ItemList` for vendor lists, `FAQPage` on FAQ pages | BOTH | P1 | schema.org validator + Google Rich Results Test | 3 | All 10 pages pass with zero errors. Add missing types. | — |
| 1.8 | Add `Dataset` schema to `/states` page (signal to AI engines that this is a structured directory) | B2C | P2 | StructuredData.astro | 2 | Page indexed as Dataset in GSC enhancement reports | 1.7 |
| 1.9 | Core Web Vitals audit — PageSpeed Insights on home, /states, top 10 city pages | BOTH | P1 | PageSpeed Insights | 2 | LCP <2.5s, CLS <0.1, INP <200ms on 90% of pages | — |
| 1.10 | Mobile-friendliness — test 10 city pages, verify map renders without overflow, tap targets ≥48px | BOTH | P1 | Chrome DevTools mobile emulator | 2 | All 10 pages pass GSC Mobile Usability | 1.9 |
| 1.11 | 404 / redirect chain audit — crawl entire site, identify redirect chains >2 hops, dead internal links | BOTH | P1 | Screaming Frog | 3 | Zero chains >2 hops, <20 broken internal links | 1.4 |
| 1.12 | Duplicate content scan — check `[city]` pages for thin/identical templates, near-duplicate titles | BOTH | P2 | Sitebulb or Screaming Frog duplicate report | 3 | <5% of city pages flagged near-duplicate | 1.4 |
| 1.13 | UTM parameter standards doc — define `utm_source`/`medium`/`campaign` taxonomy for email, social, AI referrals, embeds | BOTH | P1 | Google Sheet | 1 | All future outbound links tagged. Audit shows 0 untagged outbound links by Day 30. | — |
| 1.14 | The 91.8% Direct Traffic Diagnosis (see dedicated section at end) | BOTH | P1 | GA4 + server logs + Cloudflare analytics | 4 | Identify root cause within 7 days, document real-human session count | 1.1, 1.2, 1.13 |

---

## Phase 2 — On-Page SEO & Content Strategy (Week 2-4)

> The site already has 40+ blog posts and a `[state]/[city]` template. Don''t rebuild — audit and uplift. The biggest miss is that no one is targeting "[city] public restrooms" / "restrooms near me" — the B2C side is wide open and is where ChatGPT is already sending traffic.

| # | Task | Audience | Priority | Tool | Hrs | Success metric (kill date) | Depends on |
|---|------|----------|----------|------|-----|----------------------------|------------|
| 2.1 | Keyword research export — top 200 commercial intent (B2B): `porta potty rental [city]`, `portable toilet rental near me`, `event restroom trailer rental`, `construction site porta potty cost` | B2B | P1 | Ahrefs / SEMrush trial or Keywords Everywhere | 4 | Spreadsheet with KW, volume, KD, current rank, target URL | — |
| 2.2 | Keyword research export — top 200 informational/B2C: `public restrooms near me`, `[city] public bathrooms`, `family restrooms [airport]`, `accessible restrooms downtown [city]`, `rest stops on I-[N]` | B2C | P1 | Same as 2.1 | 3 | Same format. Identify 50 keywords with volume >500 and KD <30 | — |
| 2.3 | Audit existing `[state]/[city]` template — extract one rendered page, score for: unique intro paragraph, vendor count badge, embedded map, FAQ block, internal links to neighboring cities, schema, word count | BOTH | P1 | Manual review + checklist | 3 | Document gap list. Identify the top 3 missing elements. | 2.1, 2.2 |
| 2.4 | City template uplift v1 — add unique 80-word intro pulled from vendor count + state context, "Top 5 vendors in [city]" auto-list, "Public restrooms near [city]" section pulling OSM data | BOTH | P1 | Edit `src/pages/[state]/[city]/index.astro` | 8 | 50% lift in avg time-on-page on city pages within 30 days. Kill: if no lift by Day 45, the issue is traffic source quality, not the page. | 2.3 |
| 2.5 | Title tag audit — verify all city pages follow `Porta Potty Rental in [City], [State] \| [N] Verified Vendors \| PottyDirectory` pattern, ≤60 chars | BOTH | P1 | Screaming Frog title export | 2 | 100% of city pages have unique, ≤60 char titles | 1.4 |
| 2.6 | Meta description audit — rewrite top 100 city pages with click-bait-y CTR-optimized descriptions (price ranges, "instant quotes," specific city refs) | BOTH | P2 | Sheet + bulk edit | 6 | CTR lift of 20% in GSC for those URLs in 60 days | 2.5 |
| 2.7 | H1 audit — every page has one and only one H1 with primary KW | BOTH | P1 | Screaming Frog H1 report | 1 | 100% compliance | 1.4 |
| 2.8 | Internal linking strategy — every city page links to (a) parent state page, (b) 5 neighboring cities, (c) 3 relevant blog posts, (d) 1 service page | BOTH | P2 | Component-level edit | 6 | Avg internal links per city page goes from current to ≥10. GSC "Links" report shows 30% increase in internal link count. | 2.4 |
| 2.9 | Thin content kill list — identify city pages with <300 words OR zero vendors. Either consolidate (redirect to state page) or enrich (pull OSM public restroom data) | BOTH | P1 | Word count crawl | 4 | Reduce thin page count to <100. Kill: if a page has 0 vendors AND 0 OSM restrooms, 410 it. | 2.3 |
| 2.10 | FAQ blocks for AI Overview / voice search — add 5 Q&A pairs per top 50 city pages with `FAQPage` schema (e.g., "How much does porta potty rental cost in Charlotte?") | BOTH | P2 | Component + content gen | 8 | 5+ city pages appear in "People Also Ask" within 60 days | 2.4, 1.7 |
| 2.11 | New blog cluster — public restroom finder content: `best public restrooms in [10 major cities]`, `family-friendly bathrooms at [airport]`, `where to find restrooms on a road trip` | B2C | P2 | Existing blog scaffold | 12 | 10 posts published. 3+ ranking page 1 for long-tail by Day 90. | 2.2 |
| 2.12 | New blog cluster — B2B decision content: `porta potty rental cost calculator [updated]`, `tax deduction porta potty business expense`, `RFP template for porta potty rental` | B2B | P2 | Existing blog scaffold | 8 | 5 posts published. 100+ organic sessions/mo within 90 days. | 2.1 |

---

## Phase 3 — Local SEO & Map Pack (Week 3-5)

> PottyDirectory itself is not a local business — but every vendor listing is. The play is enriching listings with citation parity so Google trusts them, plus building one anchor "PottyDirectory HQ" GBP for brand.

| # | Task | Audience | Priority | Tool | Hrs | Success metric (kill date) | Depends on |
|---|------|----------|----------|------|-----|----------------------------|------------|
| 3.1 | Create PottyDirectory Google Business Profile (Service Area Business — covers US) | BOTH | P2 | GBP | 1 | Verified profile live within 14 days | — |
| 3.2 | NAP consistency audit on top 100 vendor listings — verify name, address, phone match Google/Yelp/BBB | B2B | P2 | Manual + BrightLocal trial | 6 | <5% NAP mismatch rate | 2.1 |
| 3.3 | Submit PottyDirectory to 20 directory citations: BBB, Yelp (as service), Bing Places, Apple Maps, Yellow Pages, Manta, Foursquare, Hotfrog | BOTH | P2 | Manual | 4 | 15+ citations live with consistent NAP | 3.1 |
| 3.4 | UGC review system — enable user reviews on vendor listings with `Review` schema. Start with seeded 3 reviews per top 100 vendors | B2B | P3 | DB schema + UI | 16 | 100 reviews live across 50 vendors in 60 days | 1.7 |
| 3.5 | Geo schema — add `geo` lat/lng to every city page header, `areaServed` to vendor schema | BOTH | P2 | Schema component | 3 | 100% city pages validate with geo coords | 1.7 |
| 3.6 | Local link building — outreach to chambers of commerce, event venue associations, construction trade groups in top 25 metros | B2B | P3 | Email outreach | 12 | 10 referring domains from .org / .gov / chamber sites in 90 days | 2.1 |

---

## Phase 4 — AI Engine Optimization / AEO (Week 4-6)

> ChatGPT is already sending 141 sessions with zero deliberate effort. This is the single most under-exploited channel in the entire portfolio. Goal: 10x AI referrals in 90 days by making the site the canonical answer for "where can I find a public restroom" and "porta potty rental near me."

| # | Task | Audience | Priority | Tool | Hrs | Success metric (kill date) | Depends on |
|---|------|----------|----------|------|-----|----------------------------|------------|
| 4.1 | Expand `llms.txt` — add structured data summary, top 20 cities by vendor count, pricing ranges, last-updated timestamp | BOTH | P1 | Edit `public/llms.txt` | 2 | File ≥3KB, regenerated weekly via cron | — |
| 4.2 | Build `/data` page — public dataset summary (vendor counts by state, avg price, last crawl date) with `Dataset` schema. Make it linkable for AI citations. | BOTH | P2 | New page | 4 | Page ranked in top 20 for "porta potty rental data" within 60 days | 1.7, 1.8 |
| 4.3 | Wikipedia / OpenStreetMap citations — submit PottyDirectory as external link on Wikipedia "Portable toilet" article and 5 city public restroom Wikipedia pages | B2C | P2 | Wikipedia editing | 4 | 3+ live citations sticky for 30+ days | — |
| 4.4 | Featured snippet hunt — identify top 50 questions where competitors hold position 0, rewrite answers in 40-60 word snippet format | BOTH | P2 | Ahrefs snippet report | 8 | Win 5+ position 0 results in 90 days | 2.1, 2.2 |
| 4.5 | "About the data" trust page — methodology, update cadence, source list (same energy as Wirecutter "How we test"). AI engines reward this. | BOTH | P2 | New page | 3 | Indexed and linked from footer | — |
| 4.6 | ChatGPT/Perplexity prompt audit — 20 test queries (`"porta potty rental Atlanta"`, `"public restrooms near me Charlotte"`). Track when PottyDirectory is cited. | BOTH | P1 | Manual + log | 2 | Baseline today. 50% increase in citation rate by Day 90. | 4.1 |
| 4.7 | Claude/Copilot/Gemini parity check — same 20 queries, log results | BOTH | P2 | Manual | 2 | Documented citation gap | 4.6 |

---

## Phase 5 — Monetization & Conversion Tracking (Week 1, parallel)

> Site has AdSense + WWETT sponsorship. No lead gen funnel for vendors. No tracked revenue. This phase makes the math visible and adds the second revenue stream (qualified leads to vendors).

| # | Task | Audience | Priority | Tool | Hrs | Success metric (kill date) | Depends on |
|---|------|----------|----------|------|-----|----------------------------|------------|
| 5.1 | GA4 conversion goals from key events (1.1) — mark `request_quote` and `phone_click` as conversions | B2B | P1 | GA4 | 0.5 | Conversions report shows non-zero in 14 days | 1.1 |
| 5.2 | "Request Quote" form on every vendor listing — captures lead, emails vendor, logs in D1 | B2B | P1 | New API endpoint + form | 8 | 10 leads captured in first 30 days. Kill: if <3 leads/mo, the form placement or copy is wrong. | 1.1 |
| 5.3 | Sponsored Listing pricing page — $49/mo featured placement in city, $199/mo featured in state | B2B | P2 | New page + Stripe | 6 | 5 paying sponsors in 90 days at $49 = $245 MRR | 5.2 |
| 5.4 | Lead gen for municipalities — outbound to 50 city parks departments offering "free public restroom listing audit" | B2C → B2B | P3 | Apollo + email | 8 | 3 municipalities responding in 60 days | 5.2 |
| 5.5 | Google Ads test — $500 budget on top 10 commercial KWs (`porta potty rental [top 5 metros]`) | B2B | P3 | Google Ads | 3 | CAC <$50 per quote request. Kill: if CAC >$100 after $500 spent, pause. | 5.2 |
| 5.6 | Affiliate research — sanitation supplies, hand sanitizer, event planning tools (Amazon Associates already common) | B2C | P3 | Manual | 2 | 1 affiliate program live by Day 60 | — |
| 5.7 | Email capture — "Get porta potty pricing in your area" lead magnet, ConvertKit/Buttondown | B2B | P2 | Form + ESP | 4 | 100 emails in 60 days | 5.2 |
| 5.8 | AdSense audit — verify Auto Ads not destroying CWV, pull last 90 days revenue, RPM, top earning pages | BOTH | P1 | AdSense dashboard | 1 | Document RPM. Decision: keep, optimize, or kill ads on B2B pages (they hurt commercial intent). | 1.9 |

---

## Phase 6 — Link Building & Authority (Ongoing)

| # | Task | Audience | Priority | Tool | Hrs | Success metric (kill date) | Depends on |
|---|------|----------|----------|------|-----|----------------------------|------------|
| 6.1 | HARO / Qwoted / Featured.com — 3 expert pitches per week (event planning, construction logistics, accessibility, travel parenting) | BOTH | P2 | HARO email | 2/wk | 1 published mention/month | — |
| 6.2 | Embeddable restroom finder widget — `<iframe>` for travel blogs, parenting sites, accessibility orgs to embed | B2C | P3 | New widget endpoint | 16 | 25 embeds live in 90 days, each = backlink | 1.4 |
| 6.3 | Reddit engagement — answer questions in r/festivals, r/eventplanning, r/construction, r/roadtrip with helpful context (not spam) | BOTH | P2 | Reddit | 1/day | 5 posts → site/month with positive karma | — |
| 6.4 | Trade partnerships — WWETT (already a sponsor), PRA, ARA, NACE event association exchanges | B2B | P3 | Partnerships email | 6 | 3 trade backlinks in 90 days | — |
| 6.5 | Press release — "Largest free directory of public restrooms in America launches AI-powered finder" via PRWeb or EIN | B2C | P3 | PR distro | 4 | 5+ syndication pickups | 4.5 |
| 6.6 | Parenting / travel / accessibility outreach — pitch 30 sites: ScaryMommy, RoadTrippers, NomadicMatt, AbleRoad | B2C | P2 | Email outreach | 8 | 3 dofollow backlinks in 60 days | — |

---

## Phase 7 — Traffic Scaling & Growth Loops (Month 2+)

| # | Task | Audience | Priority | Tool | Hrs | Success metric (kill date) | Depends on |
|---|------|----------|----------|------|-----|----------------------------|------------|
| 7.1 | UGC reviews + ratings on every vendor (auto-prompt after `phone_click`) | B2B | P3 | Email + form | 12 | 200 reviews in 90 days | 3.4 |
| 7.2 | Programmatic expansion — airports (450 US airports), national parks (63 — overlap with bestusnationalparks.com), malls (~1,200), rest stops (~2,000), stadiums (~150) | B2C | P3 | New page templates + data ingestion | 24 | 5,000 new pages live, 500 indexed in 90 days. Kill: if indexation rate <10%, reduce volume and improve uniqueness before scaling. | 2.4 |
| 7.3 | API / data licensing — `/api/v1/vendors?state=NC` paid tier for event planning SaaS, mapping apps | B2B | P3 | API + Stripe metered | 16 | 1 paying API customer in 90 days | 5.2 |
| 7.4 | Social content engine — daily TikTok/IG: "porta potty fail of the day," "luxury trailer interior tour," "behind the scenes of festival sanitation" | BOTH | P3 | Content team | 5/wk | 10k followers across platforms in 90 days | — |
| 7.5 | Newsletter — monthly "State of Sanitation" report (industry trends, vendor spotlights, pricing changes) | B2B | P3 | ConvertKit | 4/mo | 500 subs in 90 days, 30%+ open rate | 5.7 |
| 7.6 | Gamification — "Restroom Hero" badge for users submitting 5+ public restroom locations | B2C | P3 | Auth + badging system | 12 | 50 active contributors in 90 days. Kill: if <10 contributors at Day 60, the loop isn''t tight enough. | 7.1 |

---

## TOP 10 HIGHEST-LEVERAGE MOVES (next 90 days)

> Ranked by impact × likelihood × speed. Everything else is secondary.

1. **Diagnose & fix the 91.8% direct-traffic crisis (1.14)** — Without honest numbers, every other metric is theater. **Target: identify root cause by Day 7. Real-human session count documented within 14 days.**
2. **GA4 key events + conversion tracking (1.1, 5.1, 5.2)** — Right now you can''t prove any move worked. **Target: 100+ tracked key events and 10+ quote requests in first 30 days.**
3. **City template uplift v1 (2.4)** — Existing template is the volume play. Lifting unique content + FAQ + map = better rankings on 6,000 pages at once. **Target: 50% engagement-time lift on city pages by Day 60.**
4. **AI Engine Optimization expansion (4.1, 4.2, 4.5, 4.6)** — ChatGPT already sends 141 sessions on zero effort. Lean in. **Target: 1,500 AI referral sessions in next 90 days (10x).**
5. **Thin content kill list (2.9)** — Removing/redirecting 0-vendor pages directly improves crawl budget allocation. **Target: <100 thin pages remaining by Day 30.**
6. **B2C public restroom keyword cluster (2.2, 2.11)** — Lowest competition, highest ChatGPT alignment, totally untouched. **Target: 10 posts ranking page 1 for long-tail by Day 90, +500 organic sessions/mo.**
7. **Sponsored Listing + Quote Request revenue path (5.2, 5.3)** — Without revenue, this is a hobby. **Target: $245 MRR from 5 sponsored listings + $500/mo from quote leads by Day 90.**
8. **Internal linking pass (2.8)** — Free, scales across all 6,000 pages, immediate crawl/relevance gain. **Target: avg internal links per city page ≥10 by Day 30.**
9. **Schema completeness (1.7, 1.8, 3.5)** — Especially Dataset + LocalBusiness + FAQPage. The cheapest AI Overview win. **Target: 5+ city pages winning AI Overview / PAA boxes by Day 90.**
10. **Embeddable widget + 1 strong B2C backlink push (6.2, 6.6)** — DR is what''s actually missing. Widget compounds. **Target: 10 dofollow backlinks from DR40+ sites in 90 days.**

---

## THE BOT TRAFFIC DIAGNOSIS

> 26,409 of 28,776 sessions (91.8%) are `(direct) / (none)` with 5.13s avg engagement and 1.0 sessions/user. This is the single biggest data-quality issue in the project.

### Most likely causes (in order of probability)

1. **Datacenter bot traffic with stripped referrers (~70% of the direct).** Cheap residential proxies and cloud scrapers hit pages with no UA, no Referer header. GA4''s bot filter only catches IAB known bots — sophisticated scrapers slip through. Sites with public address/phone data (which is exactly what you publish) are scraping magnets.
2. **AI assistant referrals showing as direct (~10-15%).** ChatGPT, Perplexity, Claude, Gemini frequently strip referrers. The `chatgpt.com` 141 number is a floor, not the ceiling — actual AI traffic is likely 3-5x that.
3. **App-based / iMessage / SMS clicks (~5-10%).** When someone shares your URL in iMessage, FB Messenger, WhatsApp, the click arrives as direct.
4. **HTTPS → HTTPS-but-no-Referer-Policy mismatches (<5%).** Some referrer-policy headers strip referrer entirely.
5. **Mistargeted attribution from outreach campaigns (~5%).** Your 390 email/outreach sessions are tagged correctly, but the bulk of email opens may not be — especially if links lack UTMs.

### How to differentiate bot vs real human

Run these in order:

1. **GA4 segment:** `Engaged sessions = true AND Engagement time > 10s`. Apply to direct traffic. If the count drops 80%+, those are bots.
2. **Cloudflare Analytics:** compare unique visitors and pageviews to GA4. CF blocks known bots at the edge — its number is the real-human floor. The delta vs GA4 is bot leak.
3. **GA4 Reports > Tech > Browser:** look for "(not set)", outdated Chrome versions, or anomalous OS distribution. >5% on any of these = bot signature.
4. **Geographic plausibility:** GA4 > Demographics > Country. If you see >10% from data center hubs (Virginia, Iowa, Frankfurt for AWS regions), suspect.
5. **Path analysis:** real humans hit homepage → state → city. Bots hit random deep URLs in alphabetical order. Run a path report on direct traffic — if entry pages are evenly distributed across 6,000 URLs, that''s a crawler.

### Specific filters / settings to apply

- **GA4 Admin > Data Streams > Configure tag settings > Define internal traffic:** add Brian''s home/office IP ranges, Cloudflare worker IPs.
- **GA4 Admin > Data Settings > Data Filters:** create an Internal Traffic filter, set to "Active" (not testing).
- **GA4 Admin > Data Streams > More tagging settings > List unwanted referrals:** add your own domain to prevent self-referral inflation.
- **Add a Cloudflare Bot Fight Mode rule** to challenge unknown bots before they hit GA — this collapses the noise at source.
- **Server-side log filter:** parse Cloudflare logs for User-Agent, drop empty/missing UA from any reporting.

### After fixes, what real-human traffic likely looks like

Brian''s prior estimate of ~190 real humans/mo on Google organic is probably right. After applying engagement >10s + bot exclusion, expect total real-human sessions to drop to **~3,000-5,000/mo across all channels** (vs the inflated 7,200/mo current). That''s the honest baseline. Plan from there.

---

## THE 90-DAY ORGANIC TRAFFIC PROJECTION

> Honest math, not hopium.

### Current state
- Google organic: 1,320 sessions in 4 months ≈ **330/mo**
- Realistic real-human portion: ~190/mo (per Brian''s estimate)
- Indexed pages: ~6,000 (assumed — verify in Phase 1.3)
- Indexed pages actually getting impressions: probably <500 (typical thin-content directory pattern)

### 90-day target (conservative, executing P1 only)

**1,000 Google organic sessions/mo** by Day 90 — a 3x lift, 5x of real humans.

### The math

| Lever | Current contribution | Projected contribution | Why |
|---|---|---|---|
| Existing city pages (current rankings) | 200 sessions/mo | 350/mo | Internal linking (2.8) + schema (1.7) + thin content kill (2.9) lifts crawl efficiency — typical 30-50% lift on existing rankings. |
| City template uplift on top 100 pages (2.4) | 0 | 250/mo | 100 pages × 2.5 sessions/mo each, conservative for newly-strengthened pages with FAQ + intro. |
| B2C public restroom keyword cluster (2.11) | 0 | 200/mo | 10 new posts × 20 sessions/mo each — easy to hit on low-competition long-tail. |
| AI referrals (Phase 4) | 35/mo (chatgpt.com) | 200/mo | 4.1, 4.2, 4.5 + Wikipedia citations. AI traffic compounds fast once cited. |
| **Total Google + AI organic** | **~330/mo** | **~1,000/mo** | |

### The 2-3 changes most likely to move the needle

1. **City template uplift (2.4)** — single biggest lift because it touches 6,000 pages. Even +0.5 session/page/mo = +3,000 sessions/mo at full distribution. Conservative target above assumes only top 100 fully convert in 90 days.
2. **B2C public restroom keyword cluster (2.11)** — totally vacant search territory, tied to genuine ChatGPT-evidenced demand. Fastest path to new keywords ranking.
3. **Thin content kill (2.9)** — counterintuitive but true: removing dead pages improves crawl budget for surviving pages. Sites with high thin-content ratios get suppressed; cleaning up has been shown to lift remaining-page traffic by 20-40%.

### Kill criteria for the 90-day plan

- **Day 30:** if GA4 key events aren''t firing and quote requests = 0, the implementation is broken — stop content work, fix tracking.
- **Day 60:** if Google organic <500/mo, the city template uplift didn''t land. Audit what changed, run a fresh GSC indexation report, consider that crawl budget is the bottleneck.
- **Day 90:** if total Google organic <750/mo, the site has a deeper authority problem — pivot focus to Phase 6 (link building) before more content investment.

### What would make this projection too conservative
If the AI engine optimization (Phase 4) lands harder than expected — Wikipedia citation sticks, llms.txt gets cited by Perplexity, the Dataset schema makes the site a known-good source — AI referrals could be 1,000-2,000/mo by Day 90 alone, putting total organic-equivalent traffic at 2,500-3,000/mo. That''s the upside case. Plan for the conservative 1,000, celebrate the upside.

---

> **Final note:** This roadmap is bot-clean math, real-human-first. Every P1 has a kill criterion. If you can only do five things in the next 14 days, do: 1.1 (key events), 1.14 (bot diagnosis), 4.1 (llms.txt), 5.2 (quote form), 2.9 (thin content kill). Everything else stacks on top of those.', 5, 'site-pottydirectory/tasks/SEO-ROADMAP.md'
FROM projects WHERE name = 'Potty Directory' LIMIT 1;

-- =============================================================================
-- Tasks — Top 10 highest-leverage moves + the "if you can only do 5" set
-- =============================================================================

INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  ('analysis', 'Diagnose 91.8% direct-traffic crisis (bot vs real human)', 'See SEO Roadmap §1.14 + Bot Diagnosis section. Apply GA4 engagement>10s segment, compare to Cloudflare Analytics, run path/browser/geo plausibility checks. Document real-human session count. Day 7 deadline.', 'urgent', (SELECT id FROM projects WHERE name='Potty Directory' LIMIT 1)),
  ('product_dev', 'Configure 6 GA4 key events (listing_view, phone_click, directions_click, website_click, map_pin_click, request_quote)', 'See §1.1. 100+ key events fired in 7 days. Without these, every metric is theater. Mark request_quote + phone_click as conversions per §5.1.', 'urgent', (SELECT id FROM projects WHERE name='Potty Directory' LIMIT 1)),
  ('product_dev', 'Build "Request Quote" form on every vendor listing (B2B revenue path)', 'See §5.2. New API endpoint + form, captures lead, emails vendor, logs in D1. 10 leads in first 30 days. Kill if <3 leads/mo.', 'urgent', (SELECT id FROM projects WHERE name='Potty Directory' LIMIT 1)),
  ('content', 'Expand llms.txt with structured data summary, top 20 cities, pricing ranges', 'See §4.1. AI engines already send 141 sessions/mo with zero deliberate effort. File ≥3KB, regenerate weekly via cron.', 'high', (SELECT id FROM projects WHERE name='Potty Directory' LIMIT 1)),
  ('content', 'Thin content kill list — pages with <300 words OR zero vendors', 'See §2.9. Either consolidate (redirect to state) or enrich (pull OSM public restroom data). Reduce thin pages to <100. 410 pages with 0 vendors AND 0 OSM restrooms.', 'high', (SELECT id FROM projects WHERE name='Potty Directory' LIMIT 1)),
  ('product_dev', 'City template uplift v1 — unique intro, top 5 vendors auto-list, OSM restroom section', 'See §2.4. Single biggest lift because it touches 6,000 pages. 50% engagement-time lift in 30 days. Kill if no lift by Day 45.', 'high', (SELECT id FROM projects WHERE name='Potty Directory' LIMIT 1)),
  ('analysis', 'GSC audit — index coverage, "Discovered – not indexed" count, manual actions, CWV', 'See §1.3. Document baseline: # indexed vs submitted, top 10 query gaps. Foundation data for everything downstream.', 'high', (SELECT id FROM projects WHERE name='Potty Directory' LIMIT 1)),
  ('analysis', 'Sitemap audit — verify 6,000 URLs return 200, lastmod accurate, no orphans', 'See §1.4. <2% 404/redirect rate. Use Screaming Frog (free <500 URLs) or curl script. Kill: if >10% broken, rebuild generator before continuing.', 'high', (SELECT id FROM projects WHERE name='Potty Directory' LIMIT 1)),
  ('analysis', 'Schema audit — 10 city pages through Rich Results Test (LocalBusiness, BreadcrumbList, ItemList, FAQPage)', 'See §1.7. All 10 must pass with zero errors. Add missing types. Foundation for AI Overview / PAA wins.', 'high', (SELECT id FROM projects WHERE name='Potty Directory' LIMIT 1)),
  ('marketing', 'Keyword research export — top 200 B2B (porta potty rental [city]) + top 200 B2C (public restrooms [city])', 'See §2.1, §2.2. Spreadsheet with KW, volume, KD, current rank, target URL. Identifies the 50 lowest-hanging-fruit B2C keywords (vol >500, KD <30).', 'high', (SELECT id FROM projects WHERE name='Potty Directory' LIMIT 1)),
  ('product_dev', 'Internal linking pass — every city page links to parent state, 5 neighbors, 3 blog posts, 1 service', 'See §2.8. Free, scales across 6,000 pages, immediate crawl/relevance gain. Avg internal links per city ≥10 by Day 30.', 'medium', (SELECT id FROM projects WHERE name='Potty Directory' LIMIT 1)),
  ('content', 'New B2C blog cluster — public restroom finder content (10 posts)', 'See §2.11. Best public restrooms in [10 major cities], family-friendly bathrooms at airports, road trip restrooms. Lowest competition + ChatGPT alignment.', 'medium', (SELECT id FROM projects WHERE name='Potty Directory' LIMIT 1)),
  ('content', 'Build /data page with Dataset schema (AI citation magnet)', 'See §4.2, §4.5. Public dataset summary (vendor counts by state, avg price, last crawl). Linkable for AI citations. Pair with "About the data" trust page.', 'medium', (SELECT id FROM projects WHERE name='Potty Directory' LIMIT 1)),
  ('marketing', 'Wikipedia + OpenStreetMap citations (Portable toilet article + 5 city restroom pages)', 'See §4.3. 3+ live citations sticky for 30+ days. AI engines reward Wikipedia-cited entities.', 'medium', (SELECT id FROM projects WHERE name='Potty Directory' LIMIT 1)),
  ('marketing', 'Embeddable restroom finder widget for travel/parenting/accessibility blogs', 'See §6.2. iframe widget, 25 embeds in 90 days = 25 backlinks. Compounds.', 'medium', (SELECT id FROM projects WHERE name='Potty Directory' LIMIT 1)),
  ('product_dev', 'Sponsored Listing pricing page + Stripe ($49/mo city, $199/mo state)', 'See §5.3. 5 paying sponsors × $49 = $245 MRR target by Day 90. First real revenue stream.', 'medium', (SELECT id FROM projects WHERE name='Potty Directory' LIMIT 1)),
  ('decision', 'Day 30 checkpoint — GA4 key events firing? Quote requests >0?', 'Roadmap kill criterion. If not, implementation is broken — stop content work, fix tracking before proceeding.', 'high', (SELECT id FROM projects WHERE name='Potty Directory' LIMIT 1)),
  ('decision', 'Day 60 checkpoint — Google organic >500/mo?', 'Roadmap kill criterion. If not, city template uplift didn''t land. Run fresh GSC indexation report, consider crawl budget bottleneck.', 'high', (SELECT id FROM projects WHERE name='Potty Directory' LIMIT 1)),
  ('decision', 'Day 90 checkpoint — Total Google organic >750/mo?', 'Roadmap kill criterion. If not, deeper authority problem — pivot focus to Phase 6 link building before more content investment.', 'high', (SELECT id FROM projects WHERE name='Potty Directory' LIMIT 1));
