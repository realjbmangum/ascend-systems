---
title: "SendMyLove: How I Built a Consumer Subscription, Earned Zero, and Pivoted"
slug: sendmylove
client: "Self / Lighthouse 27"
clientType: "Self-funded product"
industry: "Consumer SaaS / Relationships"
engagementStart: "2026-01-09"
engagementEnd: "2026-05-02"
status: "live (v1 sunsetting, v2 concierge in build)"
stack: ["Next.js 15", "Stripe Subscriptions", "Cloudflare D1", "Cloudflare Workers", "SendGrid", "Twilio (attempted)"]
metrics:
  - "2,515 messages delivered"
  - "$5/mo V1 pricing — $0 MRR after 3.5 months"
  - "2 weeks build-to-launch"
  - "V2 concierge pivot at $99/yr planned"
hero: "/images/case-studies/sendmylove-hero.jpg"
screenshots:
  - { src: "/images/case-studies/sendmylove-homepage.png", alt: "SendMyLove homepage with signup form" }
  - { src: "/images/case-studies/sendmylove-composer.png", alt: "Message composer view" }
  - { src: "/images/case-studies/sendmylove-schedule.png", alt: "Schedule view for recurring messages" }
  - { src: "/images/case-studies/sendmylove-checkout.png", alt: "Stripe checkout flow" }
  - { src: "/images/case-studies/sendmylove-admin.png", alt: "Admin and subscriber dashboard" }
  - { src: "/images/case-studies/sendmylove-message-preview.png", alt: "Daily message preview in email" }
seoTitle: "SendMyLove Case Study — A Consumer SaaS That Earned $0 (And What I Learned) | Ascend Systems"
seoDescription: "An honest report on a self-funded consumer subscription: shipped in two weeks, delivered 2,515 messages, earned $0 MRR. The pivot, the psychology lesson, and the architecture that survived it."
---

## TL;DR

I built SendMyLove — a $5/month subscription that delivers a pre-written love message every day to the person you care about — in two weeks. I deployed it in late January 2026 on Cloudflare Workers, D1, Stripe, and SendGrid. Over the next 3.5 months, the system sent **2,515 messages**, processed signups, ran a daily cron without an outage, and earned **$0 in monthly recurring revenue**. Zero. The product worked. The business did not.

This case study covers what I shipped, why it failed, and the pivot now in build — a $99/year anniversary and birthday concierge for husbands that scaffolds emotional labor instead of replacing it. The most important lesson in this engagement is not technical. It is a rule I now use to filter every consumer product idea before I write a line of code: **never sell a product that replaces emotional labor. Sell products that scaffold it.**

{{screenshot: homepage}}

## The problem

The premise was reasonable on paper. People in long-term relationships don't drift apart because they stop loving each other. They drift because they stop showing up — small, consistent acts of attention, the daily proof that you noticed. Flowers on the anniversary is the lazy version. The hard version is the Tuesday morning text that says "thinking about you" before she's even had coffee.

The pitch wrote itself. For $5 a month, SendMyLove sends one short, well-written message a day to your partner — chosen from a curated library of 2,500+ themed notes (romantic, funny, appreciative, encouraging), delivered by SMS or email at the time you pick. Set it once. Never forget again. A florist subscription, but for words.

I believed in it. The market clearly believed in *something* in the space — flower-of-the-month clubs, anniversary-reminder apps, Hallmark's entire shelf. There was an obvious unmet need.

What I did not understand at build-time is that the unmet need was not the one I was solving. We will come back to that in the "honest pivot" section. First, what I built.

## The technical approach

The architecture was deliberately small. One database, one Worker, one SPA, one payment provider, one email vendor. Nothing on the critical path that I could not redeploy in an afternoon.

**Frontend** — Next.js 15 with React 19, Tailwind, and the shadcn/ui component library. Static-exported to Cloudflare Pages so the deploy was a single artifact with no server-render surface. The signup flow, dashboard, and message scheduler were three pages and one form each. No state-management library. No marketing-page framework. Just the parts the product needed.

**Backend** — A single Cloudflare Worker at `worker/index.ts` handling every API route: signup, subscriber profile, message-of-the-day delivery, Stripe webhook, and the daily cron. The Worker was around 1,200 lines at peak. Hono was overkill for the surface area, so I wrote the router by hand.

**Database** — Cloudflare D1, a single binding called `lovenotes-db`. Three tables: `subscribers` (the customer record + auth + preferences), `messages` (the prewritten message corpus, ~2,500 rows across five themes), and `delivery_log` (which message went to whom on which day, so the user never received the same note twice within a 60-day window). D1's free-tier limits never got close to a problem at this scale.

**Auth** — JWT in an HttpOnly cookie called `lovenotes_auth`. Signed with HS256 via the Web Crypto API so the Worker had no external auth dependency. SameSite=Lax, Secure in production, 30-day expiry. The token carried only the subscriber ID. Every protected route validated server-side and rejected tokens with unexpected algorithms.

**Payments** — Stripe Checkout for the signup-to-paid handoff, Stripe Billing for the $5/month subscription, and a webhook endpoint on the Worker for `customer.subscription.updated`, `invoice.payment_failed`, and `customer.subscription.deleted`. Webhook signatures verified against the Stripe-issued secret. The full live-mode flow was tested end-to-end before launch.

**Email** — SendGrid as primary delivery. Domain authentication on `sendmylove.app`. Inline-CSS templates, 600px width, plain-English subject lines. The cron picked a message, hydrated the `{wife_name}` placeholder, and called the SendGrid v3 API.

**SMS — attempted, never shipped.** I registered a toll-free number with Twilio for SMS delivery. The verification application was rejected. Toll-free verification on a consumer messaging product is a months-long ordeal even when approved, and the rejection reason was vague enough that I did not have a clean path forward. SMS stayed in the codebase as a fallback path that never lit up. Every paying customer (we will get to that count) was delivered by email instead.

**Cron** — A single scheduled trigger at 13:00 UTC (8am ET) ran every day. For each active subscriber, it picked a message from their preferred theme, skipped any message already sent in the last 60 days, prioritized occasion-specific messages around configured anniversaries and birthdays, hydrated the template, and queued the send. Idempotent by date — running it twice the same day didn't double-send.

{{screenshot: schedule-view}}

The whole thing was deployable in one `wrangler deploy` command. The whole thing fit in one engineer's head. That part of the project is the part I would do the same way again.

## What I shipped

By production launch on January 20, 2026 — eleven days after the first commit — the live surface area was:

1. **Landing page with signup** — a single-form capture: your email, her name, her contact, her birthday and anniversary, your preferred theme, your delivery time. Wired straight to `/api/signup` on the Worker.

2. **Stripe Checkout handoff** — signup created a draft subscriber, redirected to a Stripe-hosted checkout for the $5/month plan, and the webhook flipped the subscriber to `active` on `checkout.session.completed`. No card data ever touched my code.

3. **Subscriber dashboard** — JWT-cookie-gated view at `/dashboard`. Showed the next message preview, the delivery schedule, the configured themes, anniversary and birthday fields, and a Stripe Billing Portal link for managing the subscription. {{screenshot: admin}}

4. **Message composer / theme picker** — five themes (romantic, funny, appreciative, encouraging, plus a "random" wildcard that rotated daily for variety). Theme could be changed from the dashboard and the next morning's cron picked up the new preference. {{screenshot: composer}}

5. **Daily message preview** — the dashboard showed exactly what would land in her inbox the next morning, so the user could verify the tone before it went out. {{screenshot: daily-message-preview}}

6. **Message library** — 2,500+ pre-written notes across the five themes plus 60 occasion-specific (anniversary, birthday, Valentine's, Mother's Day, Christmas) seeded into D1 from JSON via a compile script. `{wife_name}` placeholders interpolated at send time.

7. **Stripe Checkout in production** — live keys, 14-day trial removed, full signup→checkout→active flow tested with real cards on a personal account. {{screenshot: subscription-checkout}}

8. **Daily cron + SendGrid delivery** — the production cron ran every day from January 21 forward without an outage. The `delivery_log` table tells the story of every send: 2,515 messages delivered across the operational lifetime of V1.

9. **Privacy policy + Terms of Service** — added January 21 after a self-administered security audit flagged their absence. Cloudflare-hosted, plain English, no template-mill boilerplate.

10. **Promo video** — a 15-second vertical promo rendered with Remotion for TikTok and Instagram Reels. (Never posted at meaningful volume. More on that.)

The product was, technically, complete. Signup worked. Billing worked. Delivery worked. The cron ran. Stripe took payments correctly. SendGrid hit inboxes.

## Outcome

The outcomes are best stated plainly.

- **Messages delivered:** 2,515 across the full V1 lifetime.
- **Cron uptime:** effectively 100% — no missed delivery days I could identify in the logs.
- **Stripe integration:** functioning end-to-end. Test charges cleared. The webhook kept subscriber state in sync correctly across the few real signups.
- **Domain + email infrastructure:** `sendmylove.app` live, SendGrid domain-authenticated, deliverability fine.
- **MRR at month 3.5:** **$0.**
- **Paying customers retained at month 3.5:** zero. A small handful of signups during the build window churned out before recurring billing fired, or never converted past the checkout step.
- **Twilio SMS:** never approved, never live.

The product worked. The business did not.

When the books look like that — engineering shipped, plumbing solid, distribution and conversion absent — there is a temptation to blame marketing. To say the build was right, the funnel was wrong, the channel mix was wrong, the launch was wrong. That is a comforting explanation and it is also wrong. The marketing plan was written and never executed. That is a separate failure. But the deeper failure was earlier, before the first commit, in the shape of the product itself.

## The honest pivot

The reason SendMyLove V1 didn't convert is not a marketing problem and it is not a pricing problem. It is a psychology problem with the offer.

The product I built sends a message to your partner *on your behalf*. The implicit promise is: pay me $5 a month and I will handle the thinking-about-her part. The implicit purchase decision is: "do I want to outsource the daily proof that I am paying attention to the person I love?"

The answer is almost always no — and the people who say yes are not the customers you want. The men I was actually selling to were not searching for "automated love messages." They were searching for help with the events they cannot afford to mail in: her birthday, the anniversary, Mother's Day, Valentine's. Specifically, they were searching for help in the three weeks *before* those events, when there is still time to plan a gift, write a card, and book a dinner. They wanted the runway. Not the substitute.

In May 2026 I made the call. V1 is sunsetting — the cron will be retired, the static message corpus will sit dormant in the database, and the landing page is being replaced. The infrastructure stays (the Worker, the D1 instance, the Stripe pipeline, the JWT auth, the SendGrid binding — roughly 80% of the V1 code is directly reusable). The product on top of it changes completely.

**V2: an anniversary and birthday concierge for husbands.** $99 a year, or $12.99 a month, or $29 for a one-time event rescue. The customer enters the events in his marriage he can't afford to mail in. Thirty days before each one, the system hands him a complete plan: three to five curated gift options (Amazon Associates day one, Etsy and FTD by month three), a card draft built on the actual story of their relationship (Claude Haiku, edited by him, handwritten by him — we never sign for him), a date plan in his city plus a stay-in alternate plus a weekend-trip alternate, and a build-up text rhythm at -7, -3, -1, and morning-of so the event has momentum.

After the event, a reflection capture: what worked, what didn't, what she said. That data sharpens next year's recommendation. The moat compounds with each customer-year.

The kill criteria are codified. Month four post-public-launch: under 10 paying customers, hard kill. Ten to twenty paying with under 30% renewal intent, soft kill with one more month to test a reposition. Twenty-five or more paying with positive renewal signal, continue and push to 60 customers / $500 MRR by month six. These numbers are written down so I don't fall in love with the build a second time.

V2 is in build as of this writing. Backend is shipped end-to-end (D1 migrations applied, V2 router live, plan-engine composer working, runway cron evaluating at -30/-14/-7/-3/-1/0/+1 daily, seven plan-email templates, Stripe wired). Frontend landing page, onboarding, and dashboard are shipped. The remaining manual steps are operator-side: Anthropic API key, Stripe product IDs, webhook URL update. The product is not yet publicly marketed under the new positioning. **I am not claiming V2 success in this case study. I am claiming V1 failure and a thesis for the pivot.**

## Lessons

**Never sell a product that replaces emotional labor. Sell products that scaffold it.**

This is the rule I now apply to every consumer product idea before I draft a PRD. The test is two questions. First: when the customer's partner finds out how the product works, does the customer become a hero or a fraud? Second: at the moment of purchase, is the customer buying a way to *do the work better*, or a way to *not do the work*? If the answer to either question is wrong, the product cannot grow on word-of-mouth because nobody refers a product that makes them look bad. The customers who do buy churn the moment the novelty fades. V1 failed both tests. V2 is designed to pass both — the husband executes; we just hand him the runway.

**Shipping speed is not the variable that mattered.**

I built V1 in two weeks. The build was clean, the infrastructure was right, the cron didn't drop a single send across 100+ days of production. None of that compensated for an offer that the market didn't want. The instinct to "just ship and iterate" is good when the offer is roughly right and the question is execution. It is dangerous when the offer is mis-shaped, because shipping fast just gets you to the empty dashboard faster.

**Twilio toll-free verification on consumer products is a roadblock to design around, not a hurdle to clear.**

I assumed SMS delivery was a launch-blocker. It wasn't. Email delivery was equivalent or better for this use case, the product worked fine without SMS, and the months I would have spent fighting Twilio's compliance review would have been better spent on the offer-shape problem I didn't yet know I had. If you are building a consumer messaging product on a tight timeline, ship email-only and treat SMS as a future enhancement that may never need to land.

**The infrastructure outlived the product. That's how it's supposed to work.**

Cloudflare Worker, D1, JWT cookie auth, Stripe webhook handler, SendGrid template system — roughly 80% of the V1 codebase migrates directly into V2 without modification. The architectural decisions were small, boring, and reusable. The bet that didn't pay off was the offer, not the stack. That is the right shape of failure to have, because it means the next iteration starts from a working foundation instead of a clean slate.

**Write the kill criteria before you launch.**

V1 didn't have them. I drifted past month one, past month two, past month three with no real trigger to force a decision. The pivot at month 3.5 was the right call but it came late and only because the $0 number was eventually undeniable. V2 has the kill criteria written into the PRD: under 10 paying at month four is a hard stop. Putting the number on paper before launch is the only way to make sure I don't talk myself out of it later.

**Honest reports compound. Hagiography doesn't.**

This is the kind of writeup most consultants don't publish. The metric is zero. The product is sunsetting. There is no triumphant arc. The reason to publish it anyway is that buyer trust is built by being the person who tells the truth about their own work. The next case study will be V2, and the result there will also be true, whatever it ends up being.

## What this means for your business

If you are sitting on a consumer product idea, the most useful thing I can hand you from this engagement is the offer-shape test. Before you write a line of code, ask the two questions: when your customer's partner / spouse / colleague / boss finds out how this product works, does your customer become a hero or a fraud? At the moment of purchase, is your customer buying a way to do the work better, or a way to skip the work entirely? If either answer is wrong, the engineering won't save you.

If you are sitting on a consumer product that *has* shipped and isn't converting, the answer is usually not "more marketing." It is usually a mis-shaped offer at the level of psychology, and the only way out is a deliberate pivot with the kill criteria written down. Two weeks of honest re-positioning beats six months of running the same play harder.

And if you want the infrastructure for a small consumer subscription — Stripe Billing, JWT auth, a daily cron, transactional email, a customer dashboard — that's a two-week build on a Cloudflare stack that costs well under $10 a month to run at meaningful scale. The plumbing is not what you should be worried about. The plumbing is the easy part. The hard part is the part this case study is about.

If a discovery conversation about that kind of project is on your list, [the contact page](/contact) is where it starts.
