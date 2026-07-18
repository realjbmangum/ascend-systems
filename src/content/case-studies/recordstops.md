---
title: "How I Built RecordStops — A Vinyl Directory With 683 Organic Visitors a Month"
slug: recordstops
client: "Self / Lighthouse 27"
clientType: "Internal product"
industry: "Directory / Music retail"
engagementStart: "2025-12-15"
status: "live"
stack: ["Astro", "Cloudflare D1", "Cloudflare R2", "Tailwind", "Mapbox", "SendGrid", "GA4", "Cloudflare Workers"]
metrics:
  - "296 independent stores indexed"
  - "5 states covered (NC, SC, VA, MD, DC)"
  - "683 organic visitors / month"
  - "16 city guides live"
  - "4 production cron workers"
hero: "/images/case-studies/recordstops-hero.jpg"
screenshots:
  - { src: "/images/case-studies/recordstops-homepage.png", alt: "RecordStops homepage with state-by-state directory navigation" }
  - { src: "/images/case-studies/recordstops-city-guide.png", alt: "Charlotte city guide with curated record store list" }
  - { src: "/images/case-studies/recordstops-store-detail.png", alt: "Store profile page with hours, map, and Discogs pricing" }
  - { src: "/images/case-studies/recordstops-outreach-admin.png", alt: "Built-in outreach admin panel with V1-V3 / F1-F3 drip dots" }
  - { src: "/images/case-studies/recordstops-sample-email.png", alt: "Branded outreach email — Verify 1 template" }
  - { src: "/images/case-studies/recordstops-featured-listing.png", alt: "Featured listing upgrade with Stripe checkout" }
seoTitle: "RecordStops Case Study — 683 Organic Visitors / Month From a Vinyl Directory"
seoDescription: "How I built RecordStops, an independent record store directory across five states. 296 stores, 16 city guides, a custom outreach drip pipeline that replaced a $497/mo CRM, and 683 organic users a month with zero ad spend."
publishDate: "2026-05-13T21:52:36-04:00"
updatedDate: "2026-05-13T21:52:36-04:00"
---

## TL;DR

RecordStops is the directory for independent record stores in the US Southeast — 296 stores across North Carolina, South Carolina, Virginia, Maryland, and DC. I built it on Astro and Cloudflare D1 over December 2025 and January 2026, then spent the next four months turning it from a static directory into a working B2B pipeline. The site does 683 organic visitors a month with zero ad spend, ranking on long-tail city queries like "record stores in Greenville SC." The pitch motion runs on a custom outreach admin I built inside the site after canceling a $497/month CRM that was doing the same job worse. One inbound podcast lead — Patrick Foster at Rockin' the Suburbs — came in through the contact form. The product is live, monetizing through $15/month Featured Listings, and the work that remains is sales, not engineering.

{{screenshot: homepage}}

## The problem

Independent record stores are scattered and invisible online. Google Maps surfaces chains and the closest gas station before it surfaces the corner shop that has actually been selling vinyl since 1978. Discogs has store profiles but treats them as inventory feeds, not places you walk into. Yelp results are polluted with closed locations and stale hours. A vinyl collector traveling to a new city has no good way to answer the only question they care about: which stores in this city are worth my afternoon?

The directory shape of this problem is well understood. There are hundreds of "best record stores in [city]" blog posts that rank for those queries, written once and never updated. They miss new stores, list closed ones, and read like SEO filler because they are. The opening was for someone willing to maintain a real dataset — not for someone trying to write content.

That was the consumer-facing problem. The business-facing problem was that store owners themselves had no good distribution channel beyond their own walk-in traffic. A storefront in Durham could be one of the best record shops on the East Coast and a person driving through from Charlotte would have no idea it existed. If I could build the consumer side first, the supply side would have something to plug into — a real audience, a real listing page, and eventually a paid upgrade for owners who wanted the prominent slot.

The bet was simple. Build the directory, prove organic search works, then sell Featured Listings to the owners who already had a free listing. The kill criteria are codified inside the project: by August 1, 2026, if fewer than five stores are paying $15/month, the project pivots or sells on Acquire.com. Numbers decide.

## The technical approach

Three pieces of infrastructure do almost all of the heavy lifting: programmatic city and state pages, a thin outreach pipeline that turned the contact list into a sales motion, and a deliberate SEO play built around long-tail city queries.

**Programmatic pages.** Every store gets its own SEO page. Every city gets a curated guide. Every state gets a hub. The page template is the same; the data swap is what drives the long tail. Astro renders the whole thing statically at build time, pulling from a Cloudflare D1 database called `recordstops-db` that holds stores, cities, states, and a handful of supporting tables. On every deploy, the build generates 296 store pages, 16 city guide pages, five state pages, and a custom `sitemap.xml` that lists all of them — because the default `@astrojs/sitemap` integration was only emitting 21 static routes and Google could not discover the other 315.

The sitemap fix was a turning point. Before February 15, Google Search Console had indexed 21 pages. The morning after the custom sitemap shipped, GSC showed 336 pages discovered. Most of the organic growth since traces back to that single deploy.

**Outreach pipeline.** This piece evolved twice. Version one used Directory Factory, my own bulk-send tool. Version two migrated to GoHighLevel for the reply handling, form pipeline, and contact lifecycle that Directory Factory could not do. Version three killed GHL entirely and rebuilt the outreach engine inside the RecordStops admin panel — because GHL was costing $497 a month for a workflow I could replicate in two screens.

The admin panel at `/admin/outreach` reads from `outreach_log` (an append-only table of every send event) and renders, per store, six template-based dots: V1 / V2 / V3 for the three cold "verify your listing" emails, and F1 / F2 / F3 for the three Featured Listing pitches. Each dot is filled if that template has been sent. A "Stage" column derives where each store sits in the funnel — Cold, Verifying, Bridge, Featured, or Done — and a `nextTemplateSlug()` function walks the drip order and tells me exactly which template to send next. Verified stores skip the cold sequence and route straight to the Featured pitch.

{{screenshot: outreach-admin}}

**Organic SEO play.** The directory targets long-tail queries that no national content site will bother with — "record stores in Asheville NC", "where to buy vinyl in Richmond VA", "best record store Chapel Hill." Each city guide is hand-curated, not LLM-generated, because the difference shows in search results and shows even more in the few backlinks the site has earned. The state pages aggregate the city guides. The store pages are the long tail.

A handful of supporting Cloudflare Workers keep the data fresh. `recordstops-sync` pulls Discogs marketplace pricing daily so each store page can show "this store has 1,200 listings on Discogs starting at $4.99." `recordstops-musicbrainz` pulls upcoming release dates for the weekly newsletter. `recordstops-newsletter` builds and sends the Saturday digest through SendGrid. A fourth worker, `recordstops-ghl-sync`, was built to bridge GHL into D1 — and is now mothballed after the GHL cancellation but kept in the repo as a reference implementation.

## What I shipped

**The directory.** 296 stores across five states, each with hours, address, Mapbox-rendered map, phone, website, social links, and Discogs marketplace metadata where available. Image assets live in Cloudflare R2 under ID-based paths (`recordstops-images/stores/<store_id>/hero.webp`), keyed by store ID rather than slug so renames do not break references.

{{screenshot: store-detail}}

**16 city guides.** Columbia, Greenville, Charlotte, Asheville, Chapel Hill, Durham, Raleigh, Winston-Salem, Charleston, Richmond, Norfolk, Virginia Beach, Baltimore, DC, plus a couple more. Each guide opens with a paragraph of curator's voice — what the city's vinyl scene actually feels like — and then lists the stores worth knowing about with a one-liner each. Not "top 10 best record stores in X." A real, sortable, opinionated list.

{{screenshot: city-guide}}

**Outreach admin panel.** Six template-based drip dots per store (V1 V2 V3 / F1 F2 F3), Stage column with client-side filter chips, sortable headers on every column, dropdown to send the next template with one click, and a "last sent" timestamp that reads from `outreach_log` first and falls back to the legacy `email_N_sent_at` slots for backward compatibility. The drip itself is three cold "verify your listing" emails followed by three Featured Listing pitches. Two transactional emails — `featured-trial-start` and `featured-week-1-checkin` — fire automatically after Stripe payment.

{{screenshot: sample-email}}

**Featured Listings.** A $15/month or $150/year upgrade for store owners. Stripe checkout via a hosted payment link, with the resulting webhook flipping a flag on the store row in D1 and promoting the listing's position in its city guide. The Featured pitch emails reference real numbers — visits last month, search queries the store ranks for, the city guide it would be featured on — pulled from GA4 and from the database.

{{screenshot: featured-listing}}

**Newsletter.** Weekly Saturday digest covering new arrivals, upcoming releases, and one curated city pick. SendGrid for delivery, MusicBrainz for release data, a Cloudflare Worker for assembly. The send pipeline works; the content variety still needs a fix (a known bug where the same content sometimes ships two weeks in a row, traced to a stale date-range query in the digest worker).

**Custom sitemap.** A `sitemap.xml.ts` endpoint that queries D1 at build time and emits every store, city guide, state hub, and blog post. Replaced the default Astro sitemap integration that was only seeing static routes.

**Sample-template guardrails.** Twice during the build, an unrelated "Groove Haven" sample template polluted the repo when a directory-factory utility scaffold leaked in via `git add -A`. The `.gitignore` now blocks the known-bad filenames and the project's CLAUDE.md mandates `grep -rli "groove haven" src/ public/` before any commit. Both incidents are the kind of operational scar tissue that only shows up when you are running the build, the sales motion, and the deploy pipeline yourself.

## Outcome

**683 organic visitors per month** on Google Analytics 4, growing month over month since the custom sitemap shipped in February. No paid traffic, no influencer pushes, no Reddit threads. The traffic is people typing city + vinyl queries into Google and finding the directory.

**336 pages indexed** in Google Search Console, up from 21 before the custom sitemap. Most of the long-tail city + store queries now have a RecordStops page sitting in the top 10. A few are in the top three.

**One inbound podcast lead** — Patrick Foster at Rockin' the Suburbs Podcast (`rock@suburbspod.com`) came in through the site's contact form. The reply is drafted in the project's pending-items list. He found the site organically, which is the validation that matters more than any of the engineering.

**$497/month saved** by killing GoHighLevel. The built-in admin panel does verification tracking, drip stage management, and per-store template selection — the parts of GHL that were actually load-bearing for this product. Reply handling and form pipelines I rebuilt as needed; the rest was bloat I was paying for monthly.

**4 production cron workers** running on Cloudflare's free tier, each handling one job and logging to its own table. The total infrastructure cost for the directory is under $5 a month — which, when the kill criteria is "five paying Featured Listings," means the unit economics are not the constraint. The constraint is that I have to actually pitch the stores.

**Zero paying customers as of the latest pass.** This is the honest number. The infrastructure is built. The sales motion exists in the admin panel. What is missing — and what the project's own CLAUDE.md flags as "the hard rule" — is that I have not sent the pitch emails at the cadence needed to close listings. Building feels productive; selling feels gross. Selling is the work.

## Lessons

**Built-in admin beat a $497/month CRM.** GoHighLevel could do everything I needed plus a hundred things I never would. Two screens of Astro + D1 — an `outreach.astro` admin page and an `outreach_log` table — replaced the workflow stack I was paying for. The pattern generalizes: if your CRM exists to track "did I send the email yet" and "what stage is this contact at," the build-cost of replacing it is one weekend. The recurring savings beat the build cost on month one.

**The sitemap was the SEO unlock.** Before February 15, the site had 296 store pages live and 21 of them indexed. The custom `sitemap.xml.ts` endpoint took half a day to build and ten minutes to submit in Search Console. Organic traffic followed within the month. If you are running a programmatic site and using a default sitemap integration, verify what is in the sitemap — do not assume the framework figured it out.

**Long-tail beats head terms.** "Best record stores in Charlotte NC" is competitive. "Record stores in Chapel Hill" or "vinyl shop Durham" are not, and they are what real people type when they are about to drive somewhere. The directory ranks for hundreds of those queries because each store page targets the long-tail version of the question, not the head term.

**Own the dataset.** Every store row in D1 is something I imported, scrubbed, and verified myself. No third-party API is in the critical path. If Discogs changes its terms tomorrow, the Discogs sync worker degrades to a no-op and the rest of the site keeps shipping. Same pattern as the City of Charlotte EV dashboard: own the database, treat vendor APIs as inputs to your own data model rather than as the model itself.

**Engineering is not the bottleneck.** RecordStops shipped infrastructure for four months without sending the pitch emails that infrastructure was built to send. The hard rule — "stop building until something is sold" — is there because a year of building and zero of selling is the default failure mode of every product I have shipped. The fix is calendar-blocking time to actually send the emails.

## What this means for your business

If you run an SMB in a fragmented market — independent retailers, niche service providers, regional manufacturers — there is a directory shape that fits. A list of all of them, hand-curated, with SEO-optimized pages, that ranks on long-tail city + category queries and becomes the place customers find you. It is not a venture-scale business. It is a $1,000-$5,000-per-month business that runs on a Cloudflare bill of $5 and a few hours a week of curation.

If you sell B2B and your CRM bill is in the hundreds of dollars per month for what amounts to "track which customers I emailed and when," the math on building your own admin is closer than you think. The first month of savings often exceeds the build cost. The recurring savings compound for the life of the product.

The combination — own the dataset, build the admin, rank on long-tail queries, then sell into the audience you have already built — is the same shape across every kept project in this portfolio. RecordStops is a particularly clean example of it.

If you have a directory idea, a CRM you are paying too much for, or an internal pipeline that needs a custom admin instead of another SaaS subscription, [the discovery sprint](/contact) is how the conversation starts. Or run your own numbers on the [cost calculator](/tools/cost-calculator).
