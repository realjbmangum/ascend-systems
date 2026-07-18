---
title: "How I Built SC DMV Alerts — From Idea to Paying Subscribers in Under Three Weeks"
slug: scdmv-alerts
client: "Self / Lighthouse 27"
clientType: "Internal product"
industry: "Consumer SaaS / Public-records monitoring"
engagementStart: "2026-01-04"
engagementEnd: "2026-01-23"
status: "live"
stack: ["Astro", "Cloudflare Pages", "Cloudflare Workers", "Cloudflare D1", "SendGrid", "Stripe"]
metrics:
  - "65 SC DMV locations monitored"
  - "5-minute check frequency"
  - "3 subscription tiers"
  - "Concept to paid subscribers in under 3 weeks"
hero: "/images/case-studies/scdmv-alerts-hero.jpg"
screenshots:
  - { src: "/images/case-studies/scdmv-homepage.png", alt: "SC DMV Alerts homepage with three pricing tiers" }
  - { src: "/images/case-studies/scdmv-pricing.png", alt: "Free, Pro, and CDL Pro pricing cards" }
  - { src: "/images/case-studies/scdmv-subscription-flow.png", alt: "Signup form with region and appointment-type preferences" }
  - { src: "/images/case-studies/scdmv-locations.png", alt: "Locations page listing all 65 SC DMV offices" }
  - { src: "/images/case-studies/scdmv-international-driver-guide.png", alt: "International driver guide page" }
  - { src: "/images/case-studies/scdmv-alert-email.png", alt: "Sample alert email with available appointment slots" }
seoTitle: "SC DMV Alerts Case Study — From Idea to Paying Subscribers in 3 Weeks | Ascend Systems"
seoDescription: "How I built a real-time SC DMV appointment alert service on Cloudflare Workers + D1 + SendGrid. 65 locations monitored, 3 subscription tiers, live and paying in under three weeks."
publishDate: "2026-05-13T21:52:36-04:00"
updatedDate: "2026-05-13T21:52:36-04:00"
---

## TL;DR

South Carolina road-test appointments disappear in seconds. The state's scheduler offers no way to be notified when a slot opens, so people sit on the page hitting refresh for hours. I built [SC DMV Alerts](https://scdmvappointments.com) to fix that — a Cloudflare Worker scrapes the SC DMV scheduler API every five minutes, diffs the result against what every subscriber is watching for, and fires an email the second a match appears. The whole thing runs on Cloudflare end-to-end with SendGrid for delivery and Stripe for billing. Three tiers: free, Pro at $5.99/mo, CDL Pro at $19.99/mo. The site went from blank repo to paying subscribers in under three weeks and has been operating on autopilot since. This case study covers what I built, the scraping and notification architecture, the failure modes I had to engineer out, and the kind of business this pattern can be applied to.

{{screenshot: homepage}}

## The problem

If you live in South Carolina and you need a road test, motorcycle test, or CDL skills test, you book it through a state-run scheduler. The scheduler shows real-time availability across 65 DMV offices. There is no waitlist. There is no email notification when a slot opens. The behavior on the user side is uniform across every Reddit thread, Facebook group, and driving-school forum I read: people refresh the page for hours, sometimes for days, sometimes hand the laptop off to a parent or sibling to keep refreshing while they go to work. Slots, when they appear, disappear in seconds. The next teenager in the queue grabs it before the previous one can finish typing.

The state has no incentive to fix this. The DMV is not a product. There is no competition. The scheduler exists, it works at a technical level, and the queue clears itself eventually. The frustration is privatized to South Carolina residents trying to get their license, their CDL, or their motorcycle endorsement.

A privatized frustration is a product opportunity. The unit economics are not glamorous — most users will only need this service for two or three weeks of their lives — but the volume of new licensees in a state of five million people refreshes constantly. Teenagers turning sixteen. New residents transferring in. Truckers picking up endorsements. The market does not need to be large in any one month; it needs to exist every month.

A North Carolina competitor (ncdmvappointments.com) had quietly grown to roughly 2,000 users on the back of a few local-news segments. They proved the model worked in a neighboring state with similar DMV dysfunction. South Carolina was wide open.

## The technical approach

The architecture is small on purpose. Everything runs on Cloudflare. The build order was: scraper first, database second, subscriber preferences third, notification logic fourth, payments last. I did not write a single line of marketing copy until the pipeline was sending real emails to a test inbox.

**The scraper.** A separate Cloudflare Worker (`scraper-worker/`) calls the SC DMV scheduler's public API endpoint at `publicwebsiteapi.scscheduler.com/api/AvailableLocation` on a schedule. Each call returns roughly 700–750 appointment slots across the state. The Worker POSTs the result to a webhook endpoint on the main site (`/api/scraper-results`) with a shared secret in the header.

**The appointment-diff pattern.** Naive scraping would either spam users with every appointment that exists or miss the new ones entirely. The pattern that actually works is: persist every appointment with a stable `slot_id` (the SC DMV's own identifier), persist a `sent_appointments` table that records which subscriber has been notified about which slot, and at each scrape, the set of "new" appointments for a given subscriber is the set of slots matching their preferences that have not yet been recorded in `sent_appointments`. A UNIQUE constraint on `(subscriber_id, appointment_id)` makes the deduplication free at the database level.

**The database.** Cloudflare D1, four core tables: `subscribers`, `appointments`, `sent_appointments`, and `notifications`. Free tier of D1 holds the whole thing in single-digit megabytes even at thousands of subscribers — I ran the math, 5,000 subscribers projects to roughly 11 MB total against a 500 MB cap.

**The notification layer.** When the scraper webhook fires, the endpoint walks every active subscriber, queries appointments matching their preferences that they have not yet been sent, applies tier-based rate limits (Free = 1 email/day, Pro = 3, CDL = 5), enforces a 3-hour cooldown between emails to the same subscriber, and only sends inside a 6am–6pm Eastern window. SendGrid handles delivery with the domain authenticated on `scdmvappointments.com`.

**Payments.** Stripe Checkout for the two paid tiers, with a webhook endpoint that reads the tier metadata off the subscription and updates the subscriber row in D1. Self-serve cancellation lives at a `/cancel?token=` page that lets a paying subscriber kill their own subscription without an email to support.

{{screenshot: subscription-flow}}

**Cron reliability — the part nobody warns you about.** The first version used Cloudflare's built-in cron triggers running every five minutes. They worked beautifully for thirteen days, then silently stopped firing for five hours with no error, no alert, no entry in the logs. Cloudflare cron triggers are not as reliable as their documentation implies. I have hit silent cron failures three separate times on this project alone (January 27, February 5, February 12). The permanent fix was to replace the cron with a Durable Object alarm. The Durable Object holds the next-run timestamp in its own transactional storage; after each scrape, it schedules its next alarm. If the alarm fails, the DO re-schedules. Unlike cron triggers, DO alarms cannot silently stop — they live in storage the Worker controls directly. The cron is still wired up as a backup.

**Subrequest limits.** Cloudflare Workers cap subrequests per invocation at 1,000. The first version of the matching endpoint hit that cap during routine operation — 700 appointments × 2 D1 queries each had the scraper failing silently every run for a week before I diagnosed it. The fix was to replace per-row queries with `db.batch()` calls. `ON CONFLICT (slot_id) DO UPDATE` handles the upsert. The whole endpoint now uses fewer than thirty subrequests per scrape regardless of appointment volume.

**Raw payload preservation.** Every scrape's response gets logged with a counter and timestamp, and the architecture is set up so that if the parser ever shipped a bug, I can replay the raw data without losing the day. This is the same defensive pattern I use on every API-pulling project I build — pay an hour up front, save a week later.

## What I shipped

The product surface is small by design. A subscriber should be able to land on the page, understand what the service does in five seconds, sign up in three more, and never have to think about it again until their phone buzzes with an email.

**1. Three-tier subscription model.** Free covers road-test and motorcycle-test alerts, one email per day. Pro at $5.99/month gets three emails per day across all non-CDL appointment types. CDL Pro at $19.99/month covers CDL A/B/C with up to five emails per day. The pricing was anchored against the North Carolina competitor and against the actual urgency of the problem — if you need a road test and your insurance kicks in the day you pass it, $5.99 once is not the friction point.

{{screenshot: pricing}}

**2. City-aware filtering.** A subscriber picks their preferred SC region (Greenville, Columbia, Charleston, Myrtle Beach, Spartanburg, Florence, Rock Hill, Aiken) and the appointment types they want. The matcher only sends emails for slots in their region and their type. This single feature is what makes the service usable — without it, every subscriber would get notified for every slot statewide, and the unsubscribe rate would be catastrophic.

**3. Branded transactional email.** A welcome email goes out the moment someone signs up — clear table of what they subscribed to, what they will and will not receive, how to cancel. The alert emails themselves are clean: appointment date, time, location, a direct link to the SC DMV scheduler. No marketing chrome. The subscriber is racing against other subscribers; the email's only job is to get them to the booking page faster than the next person.

{{screenshot: alert-email}}

**4. Locations page with all 65 SC DMV offices.** Pulled directly from the official SC DMV API at `dmv.sc.gov/scdmv/get-locations`, plus three SCDMV Express kiosk locations from the state's separate kiosk service. Each office has its address, hours, phone, and the services it offers. The page also flags 28 offices that serve international and non-citizen drivers — a distinction I would not have caught without input from a driving-school owner (more on that below).

{{screenshot: location-list}}

**5. International driver guide.** A standalone SEO page at `/guides/international-drivers` covering the citizenship rules, document requirements, and the multilingual computer terminals available at SC DMV testing sites. This page exists because a driving-school owner emailed me about errors in my original copy — the knowledge test isn't limited to four languages, and the citizenship rule around driving-school third-party examiners has specific edge cases. The guide is now correct, includes FAQPage JSON-LD schema, and ranks for queries the main pages would never have reached.

{{screenshot: international-driver-guide}}

**6. Admin dashboard.** A protected page that lets me see active subscribers, sync health, last scrape time, recent notifications sent, and per-subscriber tier and status. The "Sync Now" button manually triggers a scrape without waiting for the alarm. This is the panel I check when a subscriber emails support — it answers most questions in one click.

**7. Self-serve cancellation.** A token-based cancel URL in every email. The subscriber clicks the link, confirms once, and their Stripe subscription is canceled and their D1 row is soft-deleted, in that exact order — deleting D1 before Stripe avoids a race condition where Stripe's webhook arrives before the deletion completes and "resurrects" the subscriber as a free-tier row. That race took two debugging sessions to find and is the kind of thing that does not show up in any tutorial.

**8. Press kit and SEO infrastructure.** A `PRESS-KIT.md` with four pitch templates and direct contact info for sixteen SC TV stations across Columbia, Greenville, Charleston, and Myrtle Beach. Full sitemap, Organization and SoftwareApplication schema markup, FAQPage schema on the FAQ page, nine programmatic SEO pages targeting `[city] DMV appointment` keywords. Google Translate widget on every page covering twelve languages, because a meaningful fraction of road-test takers in SC do not have English as their first language.

## Outcome

The site has been live and accepting payments since late January. It has been processing about 18,000 appointment slots per day through the matching engine. The Stripe pipeline has handled real paid subscriptions end-to-end. The product runs unattended — when I do touch it, it is to add a feature, write a guide, or fix a Cloudflare reliability issue, not to keep the lights on.

Honest disclosures on what is and is not done. The exact paying-subscriber count is not pinned in the progress log session-by-session; what I will say is that the service has stable, paying subscribers and the unit economics work at the volume it operates at. The three press-pitch emails I drafted for the WCSC, WMBF, and WACH segments — modeled on the North Carolina competitor's local-news playbook — have not been sent as of this writing. The press kit is ready, the contacts are real, the pitches are written. That outreach is the next growth lever. The product side is the easy part; sending the email is the hard part. I am aware of the irony.

The 3-day monitoring test in early February confirmed the alert pipeline behaves as advertised — emails arrive within minutes of slots opening, the daily and hourly rate limits hold, the deduplication logic prevents the same slot from being sent twice. After that test passed, the press pitches went into the queue. They are still in the queue.

## Lessons

**Vendor cron is unreliable. Roll your own.** Three silent failures in the first month on Cloudflare's built-in cron triggers was enough. Durable Object alarms are the right primitive for anything you actually need to fire on a schedule. The cron trigger is fine as a backup or for tasks where missing a few hours doesn't matter. For a paid product where missed scrapes equal missed appointments equal refund requests, persistent self-scheduling alarms are the floor.

**Scraping public APIs sits in a legal gray zone — design for it.** The SC DMV's scheduler API is public, unauthenticated, returns JSON, and is clearly designed to be hit by their own front-end. None of that grants permission to a third party. I have been careful to respect rate limits (one scrape per hour now, down from every five minutes after the architecture redesign), to never republish their data verbatim, and to keep the service framed as a notification tool, not a competing front-end. A separate sister-state project I had started (`site-txdps-alerts`) is on hold partly because Texas DPS has been more aggressive about scraper legal threats than South Carolina has been. If you build a service like this, assume your legal cover lasts exactly as long as you stay quiet and respectful. Marketing that brags about scraping is marketing that gets your domain blocked.

**Edge cases come from users, not from your own brain.** Gail Lassiter, a driving-school owner, emailed me with corrections about how international drivers actually use the testing system in SC. The original copy was wrong in ways I had no way to know without sitting inside that part of the business. The fix improved the product (28 offices now flagged for international service, citizenship-rule callout added to the guide) and produced a new SEO page that ranks for queries the rest of the site doesn't touch. The lesson generalizes: every user-facing service has an edge case sitting one email away from the operator. Make it easy for those emails to reach you and reward them when they arrive.

**Cancellation has to be self-serve or you will spend your life on support.** The first version routed cancellations through `support@scdmvappointments.com` — the FAQ literally said "email support to cancel." Three cancellation requests in and it was obvious that wasn't going to scale even at small volumes. The token-based `/cancel` page took two hours to build and removed the entire category from my inbox. For any subscription product, treat self-serve cancellation as a launch requirement, not a v2 feature.

**Foreign-key cleanup order is a quiet time bomb.** The scraper started failing on day thirteen of operation, not day one, because that was the first time appointments had aged past the 7-day retention window while their `sent_appointments` children were still inside their 14-day window. Deleting parents before children triggered FK constraint errors and silently broke every scrape for five hours. Aligning the retention windows fixed it. The lesson is broader: when you have a cleanup job operating on related tables, write the test for the cleanup running thirty days after launch, not thirty minutes.

## What this means for your business

The pattern under SC DMV Alerts is appointment-scarcity monitoring. A public-facing system exposes real-time availability for a resource that is scarce. The system provides no notification primitive. People with high willingness-to-pay (because the resource gates an outcome they need — a license, a permit, a slot, a hearing) are willing to pay a small monthly fee to be alerted when availability appears.

The same shape applies to a long list of services I have looked at while building this one. Court date availability. Passport renewal appointments in cities with backlog. Specialist medical appointments inside large health systems that publish availability through portals. Hunting and fishing lottery results. Restaurant reservation drops on platforms with no notification API. State park camping cancellations. Driving-school instructor availability. Anywhere a scarce resource gets allocated through a real-time inventory page that does not include a "tell me when" button, there is a product the size of this one.

The build cost is not the bottleneck. Three weeks of focused work, $0/month in hosting through the free tiers, a $5/month Cloudflare paid plan once volume warrants it, and SendGrid's free tier covers the first 50,000 emails monthly. The bottleneck is finding the specific scarcity that has enough willingness-to-pay to support a subscription, and then doing the unromantic part of marketing — the local-news pitches, the driving-school partnerships, the Reddit threads, the calls to reporters.

If you operate a business that depends on appointment availability inside someone else's system — a driving school, an immigration practice, a healthcare scheduling consultancy, a court-reporting firm, anything where your customers are blocked by another organization's queue — the SC DMV Alerts pattern is something I can apply to your specific niche. The technical infrastructure is reusable. The product shape is reusable. What changes is the API, the appointment taxonomy, and the marketing channels.

If you want to talk through whether the pattern fits a system your customers are stuck on, [the discovery sprint](/contact) is how that starts. Or if you have a parallel intuition about a public scheduler you think nobody is monitoring well, the [cost calculator](/tools/cost-calculator) will give you the order of magnitude for what a build like this would cost as a client engagement.
