---
title: "How We Built PottyDirectory — 3,700 Vendors, Real Leads, and an AI-Citation Strategy"
slug: pottydirectory
client: "Self / Lighthouse 27"
clientType: "Internal product"
industry: "Directory / SEO"
engagementStart: "2024-12-09"
engagementEnd: "ongoing"
status: "live"
stack: ["Astro", "Supabase Postgres + RLS", "Cloudflare Pages + Pages Functions", "SendGrid", "R2", "Mapbox GL JS"]
metrics:
  - "3,447 active vendors across all 50 states"
  - "~6,000 pages indexed"
  - "~325 real Google organic visitors/mo"
  - "4 organic leads in the first 72 hours after launching the lead funnel"
seoTitle: "PottyDirectory Case Study — Directory, Lead Funnel, AI Citations | Ascend Systems"
seoDescription: "How a single developer built a 3,447-vendor portable restroom directory on Astro + Supabase + Cloudflare, shipped a real lead funnel that produced four organic leads in 72 hours, and turned the site into AI-engine source material."
publishDate: "2026-05-13T21:52:36-04:00"
updatedDate: "2026-05-13T21:52:36-04:00"
---

## TL;DR

PottyDirectory is the largest portable-restroom rental directory in the United States — **3,447 vendors** across all 50 states, **~6,000 pages**, **~325 real Google organic visitors/month** verified after the bot floor was stripped out. It is built on Astro, Supabase (Postgres with row-level security), and Cloudflare Pages, with Pages Functions running the lead funnel and admin tools. After I shipped the Request-a-Quote flow on May 9, 2026, the site produced **four organic leads in the first 72 hours** with zero ad spend. The site is monetized through AdSense (live since Feb 9, 2026), the Amazon affiliate program, and a Verified-Badge / featured-listing program; a paid lead-priority tier is being built next. The current focus has shifted from "more pages" to **AI-engine citation** — the highest-quality real-user channel on the site, with Copilot users averaging 110 seconds of engagement versus Google's 35.

## The problem

Porta-potty rental is a high-intent, fragmented, and almost entirely SEO-driven category. A wedding planner with 200 guests, a construction PM mid-pour, a city events coordinator the week before a 5K — these buyers know exactly what they need and want a phone number now. Google Maps surfaces the same three national operators in every metro. The category's incumbents are SEO blog farms (homeyou.com, fixr.com), national rental brands with deep blog libraries (BigRentz, United Site Services, WM), and a handful of regional aggregators. There was no neutral directory that covered every state and every city.

The product hypothesis was simple: build a programmatic directory deep enough to rank for the long tail (state + city + service combinations), then monetize through AdSense first and a paid-listing / lead-routing layer second. The model already worked for record stores, public restrooms, and a dozen other "find a local X" verticals. Portable restrooms had the right shape: thousands of operators, no dominant directory, high commercial intent per search.

The harder problem — the one I underestimated at launch — was that bot traffic, scraper noise, and unblocked AI crawlers were each going to change what "the site is working" actually meant. Solving each of those is what turned PottyDirectory from a vanity directory into an asset.

## The technical approach

The whole site is one Astro project deployed to Cloudflare Pages, with the data layer in Supabase Postgres. Every page is built at deploy time from Supabase rows. There is no edge SSR — `output: 'static'` keeps the build cheap and the cache surface large.

**Data model.** One canonical `potty` table holds every vendor: business name, slug, city, state, geocoded lat/lng, phone, email, hours, photo URL, services, plus boolean flags (`has_luxury`, `has_ada`, `has_trailer`, `serves_construction`, `serves_events`, `verified`, `psai_member`). Three smaller tables back the operational layer — `submissions` (vendor self-serve intake), `quote_requests` (lead funnel), and `contact_messages` (the contact form). Supplemental tables hold city content, FAQ content, and blog posts.

**Programmatic directory pages.** Astro's `getStaticPaths` builds the page tree from Supabase at deploy time. State indexes (`/[state]`), city indexes (`/[state]/[city]`), and vendor detail pages (`/[state]/[city]/[vendor]`) are all driven by the same query layer in `src/lib/supabase.ts`. An early lesson: Supabase's PostgREST client caps responses at 1,000 rows, so the data layer paginates aggressively — without that, half the directory simply disappears from the build. Empty city pages are marked `noindex` rather than 410'd, so they exist for users who follow internal links but don't dilute the indexable surface.

**Schema markup.** Every page emits Schema.org JSON-LD: `LocalBusiness` on vendor pages, `ItemList` of `LocalBusiness` on city pages, `Article` + `BreadcrumbList` on blog and trust pages, `Dataset` on the open-data page. An audit on May 7 caught that the city-page `ItemList` was missing `address`, `geo`, and `image` on the nested LocalBusiness items — a single template fix on May 9 unblocked LocalBusiness Carousel rich results across roughly 2,500 city pages.

**Lead funnel.** Cloudflare Pages Functions in `functions/` handle the dynamic surface — quote intake, listing intake, admin endpoints, lead forwarding, and a token-based claim flow. Two shared helpers do all the heavy lifting: a SendGrid wrapper that renders brand-matched HTML emails (Deep Navy header, Signal Green accent, Fredoka display font), and a thin PostgREST client that handles inserts, selects, and slug generation without bundling the Supabase SDK. Row-level security on the public tables is anon-INSERT-only; admin endpoints use the service-role key.

**Admin console.** A single `/admin` Astro page, gated by Cloudflare Access to one Google account, exposes two tabs: Leads (incoming quote requests, with row-expansion, forward-to-vendor, and outcome tracking) and Submissions (new vendor approvals). A debounced vendor-picker combobox replaces the original "type the vendor slug by hand" prompt — a real friction point that bled into a misrouted lead before it got fixed.

**AI citation strategy.** The site ships an `llms.txt` source-of-truth file at the root, an `/methodology` page that documents how the directory is built and maintained (a Wirecutter-style trust page), and an `/data` page that publishes aggregate vendor statistics with full `Schema.org/Dataset` JSON-LD and a Markdown/APA/BibTeX citation block. The goal isn't more pages; it's to be the page an AI engine cites when it answers a porta-potty question.

## What I shipped

**The directory itself.** 3,447 active vendors at this writing (down from 3,584 after a Tier 1 cleanup of 137 misclassified non-porta-potty businesses), all 50 states, ~6,000 indexed pages. Vendor records were assembled from scraping, manual research, the Portable Sanitation Association International (PSAI) operator roster, and a self-serve submission flow.

**Programmatic city pages.** 2,924 city pages, each with a vendor list, an interactive Mapbox map with clustering, top-cities cross-links, and a unique SEO-content block for the 249 highest-traffic cities.

**Vendor detail pages.** Every vendor gets a full page with map, hours, services, social links, schema.org markup, and — when we have an email on file — a Request-a-Quote form. Vendors without an email see a Call/Visit-website fallback instead of a form that would go nowhere. This gate was added after a real customer's request was misrouted through the form to a vendor that couldn't act on it.

**Lead funnel.** Request-a-Quote form → `quote_requests` row → branded user acknowledgment email + branded admin alert. From the admin console, I forward the lead to the right vendor with one click. The vendor email includes a unique 30-day claim-token link they can use to update their own listing without an account — a self-healing data loop where every lead becomes a verification touchpoint.

**Admin console.** Leads tab with expand-row detail, vendor-picker autocomplete, and outcome tracking (`awaiting | won | lost | no_response`) on each forwarded lead. Submissions tab for approving new vendors with one click — approval promotes the row from `submissions` to `potty` and emails the vendor the live URL. Cloudflare Access at the edge does the auth so the function code carries no auth logic of its own.

**Self-serve vendor flow.** `/submit` form for new vendors, `/get-verified` form for the badge program, claim links on every forwarded lead email so vendors can correct their own data. All three write to Supabase and notify me by email — no third-party form relays in the loop.

**Trust / AI surface.** `/methodology` (433-line Wirecutter-style trust page, Article schema), `/data` (full Dataset JSON-LD plus a downloadable summary of vendor counts by state, with a Markdown / APA / BibTeX citation block), and `/llms.txt` at the site root. Footer links to both Methodology and Open Data so the anchors are reachable from every page.

**Content layer.** 30 blog posts on luxury restroom trailers, cost guides, planning calculators, and city-specific guides — all under a single editorial layout with Inter for body, Fraunces for headings, and shared callout / FAQ / table components. The 10 highest-traffic posts were rewritten in May 2026 with H2 = literal user query + 40-60 word answer paragraph, aimed at featured-snippet capture.

**Monetization.** AdSense live since Feb 9, 2026 (publisher `ca-pub-2962780862577949`), Amazon affiliate links across the supplies index, and a Verified-Badge program that exchanges badges for backlinks. The Sponsored Listing tier is being repositioned: not about placement on the page, about **lead priority** in the routing layer.

## Outcome

**Real-traffic baseline.** Before May 5, GA4 was reporting ~7,200 sessions/month. A diagnosis on May 5 — filtering for `Average engagement time > 10s` — showed that **~92% of pre-fix sessions were bots or non-engaged drive-bys**. The real-human floor is approximately **570 sessions/month**, of which **~325/month is Google organic**, **~63/month is AI engines (ChatGPT + Copilot)**, and the rest is Bing, DuckDuckGo, Yahoo, and small referrals. That's the number the strategy is now planned against — not the inflated total.

**AI is the highest-quality channel.** Copilot users average **110 seconds** of engagement per session — three times the Google organic average of 35 seconds. Bing organic averages 66 seconds. AI referrals are small in volume (~63/month) but qualitatively the best users on the site.

**Lead funnel works.** Four organic leads landed in the first 72 hours after the funnel went live on May 9, with zero ad spend. The fourth lead exposed the misclassified-vendor problem (a medical supply company got routed a porta-potty quote), which became the forcing function for the Tier 1 cleanup that purged 137 junk rows.

**AI-citation audit baseline locked.** Run 1 of the citation audit on May 6 returned **0 / 100 citations** across 20 queries × 5 engines (Bing Copilot, ChatGPT, Perplexity, Gemini, Claude). That zero isn't despair — it's a baseline taken seconds after I discovered that Cloudflare's "Block AI bots" rule had been silently 403'ing GPTBot, ClaudeBot, PerplexityBot, and anthropic-ai across the entire zone for the site's whole crawl history. The bots never had access. Run 2 in June 2026 will be the first real measurement.

**Monetization status.** AdSense impressions and clicks are accumulating; YTD revenue pull is pending [verify]. The Amazon affiliate tag `jbmangum27-20` is wired into the supplies index. The paid lead-priority tier is the next monetization line being built.

## Lessons

**Bot traffic will lie to you for as long as you let it.** GA4's default report on PottyDirectory was 96% bot sessions, which made every other metric — bounce rate, time on page, channel mix — meaningless. The fix was a single engagement-time filter in GA4 Explorations. Until you do that on any directory site with public NAP data, your numbers are fiction.

**Cloudflare can silently kill your AI strategy.** The "Block AI bots" managed rule defaults aggressively. For the entire crawl history of the site, GPTBot / ClaudeBot / PerplexityBot / anthropic-ai had been getting 403'd at the edge — including from `/llms.txt`, the one file I was deliberately publishing for them. `robots.txt` saying "Allow" doesn't override the WAF. I now check this on every Cloudflare-hosted property before any AI work begins.

**Don't trust your scraper's category column.** A medical supply company was misclassified as a porta-potty vendor and got a real customer's quote forwarded to it. The cleanup pattern that caught the rest of the false positives looks for non-porta-potty keywords (`hardware`, `food service`, `agricultural`, `equipment rental`, `medical`, `office`, `storage`) and excludes anything that mentions porta-potty, portable toilet, restroom, or sanitation in name, services, or description. 137 vendors dropped on a single pass. Roughly 145 mixed-overlap rows (plumbing, septic, dumpster) need a human eye and were deferred.

**Supabase RLS has silent failure modes.** Anon-key `.update()` calls on a table without an UPDATE policy return `{data: [], error: null}` — no error, just nothing changed. PostgREST's `Prefer: return=representation` runs an implicit SELECT-back that fails on anon-INSERT-only tables with a misleading "row violates RLS policy" error; the workaround is `return=minimal` and parse the new row id from the Location header. Both lessons are now saved as portfolio-wide memories.

**Markdown is for prose, not state.** Several earlier sessions ended with the day's task list dropped into a `tasks/*.md` file. Within a month, those files were stale and contradicted each other. Tasks now live in the Ascend Systems CRM (Cloudflare D1, single source of truth). Markdown is for narrative, design briefs, and audit logs — not anything that has a status.

**The first lead is what makes the funnel real.** Three days after Request-a-Quote shipped, four real customers had submitted quotes. Every weakness in the system surfaced inside that 72-hour window — the slug-hunt admin UX, the misclassified vendor, a Web3Forms-leftover form that bypassed the admin queue. None of those were findable in code review. The funnel had to be carrying real money for the bugs to show up.

## What this means for your business

If you have a category that's fragmented, SEO-driven, and lacks a neutral directory, the same shape of build applies. The cost structure is friendly: one Astro project, one Supabase project, one Cloudflare account, ~$6/month in infrastructure for a site doing 6,000 pages and a working lead funnel. The cost is in the data — sourcing, deduping, and gating the bad rows before they cost you a misrouted lead.

The bigger lesson is that an AI-citation strategy is no longer a "later" item. AI traffic is small in volume on directory sites today but **two to three times the engagement quality** of Google organic. The work to be cited is the same work that makes the site trustworthy to humans — a methodology page, an open dataset, an `llms.txt` source of truth, schema.org markup that actually validates. Build for the engines that quote you, not just the ones that rank you.

If you have a directory idea or a vendor / supply-side marketplace you want to spec, [the discovery sprint](/contact) is how it starts. Or run the numbers on the [cost calculator](/tools/cost-calculator).
