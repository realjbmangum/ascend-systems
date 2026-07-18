/**
 * Service page data — drives `/services/[slug]` (5 static pages).
 *
 * Structure follows docs/seo/2026-05-12-programmatic-seo.html "Set 1", with
 * two deliberate departures from that doc:
 *
 *  1. SLUGS match the five service lines actually sold (and already declared
 *     as Service schema in src/pages/services.astro). The doc proposed
 *     custom-crm / web-application-development / process-automation, which
 *     describe services not on the site.
 *  2. PRICING uses the real numbers from the site FAQ ($5k discovery sprint,
 *     $50k+ builds). The doc's "$3,500 / $15K–$75K" figures do not match.
 *
 * Content bar from the doc, enforced here: 1,000+ unique words per page,
 * 5+ hand-written FAQs at 80–150 words each, at least half unique to the
 * page, and a named portfolio reference. No boilerplate that could be
 * slug-swapped between entries.
 */

export interface ServicePage {
  slug: string;
  /** Nav / breadcrumb label. */
  shortName: string;
  metaTitle: string;
  /** 150–160 chars. */
  metaDescription: string;
  /** Anchor on /services this page expands, keeps the existing Service @id. */
  serviceAnchor: string;
  serviceType: string;
  hero: { eyebrow: string; headline: string; subhead: string };
  problem: { headline: string; body: string[] };
  approach: { step: string; detail: string }[];
  /**
   * Named portfolio proof. `portfolioSlug` omitted where no case study
   * genuinely demonstrates the service — we link the calculator instead of
   * implying a client engagement that did not happen.
   */
  proof: {
    headline: string;
    portfolioSlug?: string;
    body: string;
    outcome?: string;
  };
  /**
   * Illustrative UI image for the page. Rendered only if the file exists on
   * disk (build-time check), and always captioned as an illustration — these
   * depict the kind of software built, not a specific client's system.
   */
  image?: { src: string; alt: string };
  pricing: { headline: string; body: string; anchors: { label: string; value: string }[] };
  faqs: { q: string; a: string }[];
  relatedServices: string[];
  cta: { headline: string; body: string };
}

export const SERVICE_PAGES: ServicePage[] = [
  // ---------------------------------------------------------------------
  {
    slug: 'custom-saas-development',
    shortName: 'Custom SaaS Development',
    metaTitle: 'Custom SaaS Development | Ascend Systems',
    metaDescription:
      'Custom SaaS development by one senior engineer. Billing, auth, and multi-tenancy shipped to production — not a prototype. Based in Charlotte, NC and remote.',
    serviceAnchor: 'custom-saas',
    serviceType: 'Custom Software Development',
    hero: {
      eyebrow: 'Custom SaaS Development',
      headline: 'Custom SaaS development, shipped to production',
      subhead:
        'Subscription software with real billing, real auth, and real users — built end to end by the engineer you actually talk to.',
    },
    problem: {
      headline: 'Why most custom SaaS projects stall',
      body: [
        'The hard part of a SaaS product is almost never the feature you pitched. It is everything underneath: authentication that survives a password reset at 2am, a billing integration that handles a failed card without locking a paying customer out, a database schema that still makes sense after the third pivot, and a deploy process that does not require you to be awake.',
        'Agencies quote the feature list because that is what is easy to quote. The plumbing gets discovered in month three, which is when the change orders start and the timeline doubles. You end up paying twice: once for the demo that impressed you, and again for the production system that has to actually hold up.',
        'The other common failure is subtler. A team ships a working product on a stack chosen for speed of the first demo, then discovers the hosting bill scales linearly with signups, or that the auth provider charges per monthly active user, or that the "serverless" database has a connection limit that a background job blows through. These are cheap decisions to get right at the start and expensive to reverse later.',
        'The pattern that works for owner-operators is unglamorous: pick boring infrastructure with predictable costs, build the billing and auth path first because it is the part that must never break, and get real users on it before adding the second feature. That ordering is the whole difference between a product and a demo.',
      ],
    },
    approach: [
      {
        step: 'Discovery sprint',
        detail:
          'Two paid weeks that end in a scoped blueprint and a fixed-price build proposal — architecture, data model, integration list, and the honest version of what it costs. If the blueprint is not worth what you paid, the sprint is refunded.',
      },
      {
        step: 'Billing and auth first',
        detail:
          'The subscription path gets built and tested before feature work starts, because it is the code that cannot be broken later. Stripe webhooks, plan changes, failed payments, and cancellation all handled up front.',
      },
      {
        step: 'Thin vertical slice to production',
        detail:
          'One complete user journey — signup through paid action — deployed to a real domain in the first weeks, not a staging environment nobody looks at.',
      },
      {
        step: 'Iterate against real usage',
        detail:
          'Features get prioritised by what actual users do, not by what the original spec assumed they would do. Weekly demos on the running system.',
      },
      {
        step: 'Handover you can act on',
        detail:
          'Documented deploy process, environment variables, and runbook. The code is yours, in your repo, on your accounts, from day one.',
      },
    ],
    proof: {
      headline: 'SC DMV Alerts — idea to paying subscribers in under three weeks',
      portfolioSlug: 'scdmv-alerts',
      body: 'South Carolinians were refreshing the DMV scheduler by hand for hours to find a road test slot. SC DMV Alerts monitors all 65 locations every five minutes and emails the moment something opens. It is a complete subscription product — three tiers, Stripe billing, transactional email, and a monitoring pipeline running on Cloudflare Workers and D1 — built and live with paying subscribers in under three weeks.',
      outcome: '65 locations monitored · 5-minute check interval · 3 subscription tiers · live and paying',
    },
    image: {
      src: '/images/services/custom-saas-development.jpg',
      alt: 'Subscription billing dashboard with plan tiers, MRR chart, and a customer table',
    },
    pricing: {
      headline: 'What a custom SaaS build costs',
      body: 'Every engagement starts with a paid two-week discovery sprint. It produces a scoped blueprint and a fixed-price proposal, so the build number is based on a real architecture rather than a guess. Most SaaS builds land between the discovery sprint and the upper end below, depending on integration count and how much of the billing and permissions model is bespoke. You can run your own numbers on the cost calculator before we ever talk.',
      anchors: [
        { label: 'Discovery sprint', value: 'from $5k — two weeks, refundable' },
        { label: 'Typical build engagement', value: '$15k – $50k+' },
        { label: 'Ongoing', value: 'Weekly retainer or fixed scope' },
      ],
    },
    faqs: [
      {
        q: 'How long does a custom SaaS build actually take?',
        a: 'The discovery sprint is two weeks. After that, a focused first release is typically six to twelve weeks depending on how many external systems it has to talk to. SC DMV Alerts went from idea to live paying subscribers in under three weeks, but that was a deliberately narrow product with one integration. A multi-tenant product with role-based permissions, a payment provider, and two third-party APIs is a different shape. The discovery sprint exists precisely so the timeline you get is based on the real integration list rather than an optimistic guess made before anyone looked.',
      },
      {
        q: 'Do I own the code?',
        a: 'Yes, completely, and from the first commit rather than at final payment. The repository lives in your GitHub organisation, the hosting runs on your Cloudflare and Stripe accounts, and the domain is registered to you. There is no proprietary framework you have to keep paying to use, and no hosting arrangement that makes leaving expensive. If you decide six months in that you want to bring the work in-house or hand it to another engineer, everything needed to do that — code, credentials, deploy process, runbook — is already in your possession.',
      },
      {
        q: 'Can you work with an existing codebase, or does it have to be greenfield?',
        a: 'Both. Roughly half of custom SaaS work is adding a serious capability to something that already exists — putting real billing on a product that has been invoicing manually, adding multi-tenancy to a single-customer app, or replacing an auth system that has become a liability. The discovery sprint covers reading the existing code and being honest about what is worth keeping. Sometimes the answer is that a rewrite of one subsystem is cheaper than working around it, and sometimes the existing code is fine and the real problem is the deploy process.',
      },
      {
        q: 'What stack do you build on, and why does it matter to me?',
        a: 'Typically TypeScript and React on the front end, with Cloudflare Workers, D1, or Supabase and PostgreSQL behind it, and Stripe for billing. It matters for one commercial reason: cost predictability. This stack has a flat, low hosting cost that does not scale punitively with signups, which means your infrastructure bill does not become a surprise line item the month a marketing push works. It is also widely known, so you are not locked into one engineer who understands a bespoke framework.',
      },
      {
        q: 'What happens if we disagree about scope mid-build?',
        a: 'The fixed-price proposal from the discovery sprint is the reference point, and it lists what is in and what is explicitly out. When something new comes up mid-build — and it usually does, because real users reveal things — it gets priced as an addition rather than absorbed silently into the timeline or quietly dropped. You see the trade-off and decide. The failure mode this avoids is the one where scope grows invisibly for two months and then the deadline moves without anyone having consciously agreed to it.',
      },
      {
        q: 'Who actually writes the code?',
        a: 'Brian Mangum, the person you have the discovery call with. There is no account manager relaying requirements to a delivery team, and no offshore contractor whose name you never learn. This is the main structural difference from an agency: the person estimating the work is the person doing it, which removes the estimation gap that causes most agency overruns. The practical trade-off is capacity — a solo engineer takes on a limited number of concurrent builds, so timelines depend on availability.',
      },
    ],
    relatedServices: ['internal-tools', 'ai-integrations', 'fractional-cto'],
    cta: {
      headline: 'Start with the numbers',
      body: 'Run your build through the cost calculator, or book a 30-minute discovery call to talk through whether a custom product is the right answer at all.',
    },
  },

  // ---------------------------------------------------------------------
  {
    slug: 'internal-tools',
    shortName: 'Internal Tools & Dashboards',
    metaTitle: 'Internal Tools & Dashboard Development | Ascend Systems',
    metaDescription:
      'Internal tool development for operations teams — dashboards, admin panels, and workflow software your staff will actually use. Charlotte, NC and remote.',
    serviceAnchor: 'internal-tools',
    serviceType: 'Custom Software Development',
    hero: {
      eyebrow: 'Internal Tools & Dashboards',
      headline: 'Internal tools your team will actually use',
      subhead:
        'Operations dashboards, admin panels, and workflow software built around how your staff already work — not around a vendor’s idea of your process.',
    },
    problem: {
      headline: 'The spreadsheet is load-bearing and everyone knows it',
      body: [
        'Most operations teams run on a spreadsheet that one person maintains, a SaaS tool that does 60% of the job, and a set of manual steps that exist purely to move data between the two. It works, in the sense that the business functions. It also means the process lives in one person’s head, breaks when they are on holiday, and cannot be audited when something goes wrong.',
        'The usual response is to buy another SaaS product. Sometimes that is right. Often it is not, because the reason the current tool does 60% of the job is that your process is genuinely specific — and the next tool will also do 60%, just a different 60%. You end up paying three subscriptions and still exporting to CSV to get an answer.',
        'The tell that a custom internal tool is the right call is when someone on your team has built an elaborate spreadsheet with lookups and conditional formatting to compensate for what the software will not do. That spreadsheet is a specification. It describes exactly the tool you need, written by the person who understands the process best.',
        'The other tell is data that lives in a system built for somebody else. Vendor portals are designed for the vendor’s operations, not yours — which is why getting a straight answer out of one often means logging into three views and reconciling them by hand.',
      ],
    },
    approach: [
      {
        step: 'Watch the actual work',
        detail:
          'The discovery sprint starts with observing how the job gets done now, including the workarounds. The workarounds are the requirements — they mark every place the current system fails.',
      },
      {
        step: 'Model the data honestly',
        detail:
          'Getting the data model right is most of the work. A tool built on a schema that matches how the business actually thinks stays useful; one built on a convenient shortcut needs rewriting within a year.',
      },
      {
        step: 'Ship the one screen that hurts most',
        detail:
          'The first release solves the single most painful part of the workflow, in production, for real users. Adoption comes from relieving a specific pain, not from a feature-complete launch.',
      },
      {
        step: 'Role-based views',
        detail:
          'Operations, finance, and leadership need different answers from the same data. Building those as separate views beats one dashboard that satisfies nobody.',
      },
      {
        step: 'Automate the reconciliation',
        detail:
          'Scheduled jobs pull from the source systems so nobody is exporting CSVs on a Monday morning. The tool stays current without anyone maintaining it.',
      },
    ],
    proof: {
      headline: 'CLT EV Analytics — 208 stations in a single pane, for the City of Charlotte',
      portfolioSlug: 'clt-ev',
      body: 'The City of Charlotte operates 208 ChargePoint EV stations across 46 locations, but city staff had to work through ChargePoint’s operator portal — a tool built for station operators, not municipal decision-makers — to answer basic questions about utilisation, electricity cost, and which stations were down. Data for three separate org units lived in separate views with no consolidated picture. We built the analytics dashboard their staff actually needed: a Worker pulls the ChargePoint API every 30 minutes into D1, and the front end surfaces utilisation, cost intelligence, and operational health — including the unreachable and faulted stations that need maintenance — with role-based views for operations, finance, and leadership.',
      outcome: '208 stations · 46 locations · 3 org units unified · sub-100ms edge response · refreshed every 30 minutes',
    },
    image: {
      src: '/images/services/internal-tools.jpg',
      alt: 'Operations dashboard with station status tiles, a utilization chart, and a maintenance table',
    },
    pricing: {
      headline: 'What an internal tool costs',
      body: 'Internal tools are usually the least expensive custom software a business buys, because the user count is small, the design surface is modest, and there is no marketing site or public signup flow to build. The discovery sprint scopes it properly. The comparison worth running is not against the cost of doing nothing, but against the annual cost of the SaaS subscriptions and manual hours the tool replaces — that arithmetic often decides it.',
      anchors: [
        { label: 'Discovery sprint', value: 'from $5k — two weeks, refundable' },
        { label: 'Typical internal tool', value: '$15k – $50k' },
        { label: 'Ongoing', value: 'Weekly retainer or fixed scope' },
      ],
    },
    faqs: [
      {
        q: 'How do I know whether to build or just buy another SaaS tool?',
        a: 'Buy first, genuinely. If an off-the-shelf product does the job, it will be cheaper and better supported than anything custom. The case for building appears when your team has constructed elaborate spreadsheet workarounds around a tool, when you are paying for three overlapping subscriptions to cover one workflow, or when the data you need lives in a vendor portal designed for the vendor rather than for you. A useful test: add up the annual subscription cost plus the hours spent reconciling between systems. If that number is close to a build, custom usually wins on a three-year view.',
      },
      {
        q: 'Will my team actually use it?',
        a: 'That depends almost entirely on whether the first release solves a pain they already feel, which is why the first version targets the single worst part of the workflow rather than launching feature-complete. The other factor is whether the tool matches how they already think about the work. Software that imposes an unfamiliar model — even a technically better one — gets routed around. This is the specific advantage of building rather than buying: the vocabulary, the screens, and the steps can mirror your actual process instead of a vendor’s generic abstraction of it.',
      },
      {
        q: 'Can it pull data from the systems we already have?',
        a: 'Usually yes, and that is often the main point. If a system has an API, a scheduled job can pull from it on an interval — this is exactly what the CLT EV dashboard does with the ChargePoint API every 30 minutes. Where there is no API, the options are database access, a file drop, or scraping an export, in that order of preference. The discovery sprint checks integration feasibility early, because it is the thing most likely to change the estimate. Systems with genuinely no extractable data are rare but do exist.',
      },
      {
        q: 'What about permissions — not everyone should see everything?',
        a: 'Role-based views are usually built in from the start rather than added later, because retrofitting permissions onto a tool that assumed everyone sees everything is a genuinely painful piece of work. In practice this means operations, finance, and leadership each get a view answering their own questions from the same underlying data. It also covers the harder cases: a regional manager seeing only their region, or a contractor seeing one client’s records. Getting this right early is much cheaper than getting it right later.',
      },
      {
        q: 'Who maintains it after launch?',
        a: 'You have three options and all are legitimate. A small ongoing retainer covers changes, monitoring, and the occasional integration that breaks when a vendor updates their API. Alternatively, handover documentation and a runbook let an in-house developer take it over — the stack is deliberately mainstream so this is realistic rather than theoretical. The third option is nothing at all: a well-built internal tool on managed infrastructure can run untouched for long stretches. What determines which fits is how often the underlying business process changes.',
      },
      {
        q: 'How is this different from hiring a developer directly?',
        a: 'For a defined internal tool, a fixed-scope engagement is usually faster and cheaper than a hire, because there is no ramp-up, no recruitment cycle, and no ongoing salary once the tool is done. A hire makes more sense when you have a continuous pipeline of software work rather than one project. The honest framing: if this tool is the first of many and you expect a steady stream, start thinking about a hire — and a fractional CTO engagement can help you scope that role and evaluate candidates.',
      },
    ],
    relatedServices: ['legacy-modernization', 'custom-saas-development', 'fractional-cto'],
    cta: {
      headline: 'Price the tool before you commit',
      body: 'The cost calculator gives you an order of magnitude in a couple of minutes. Or book a 30-minute call and talk through whether building is even the right move.',
    },
  },

  // ---------------------------------------------------------------------
  {
    slug: 'legacy-modernization',
    shortName: 'Legacy System Modernization',
    metaTitle: 'Legacy System Modernization | Ascend Systems',
    metaDescription:
      'Replace aging on-prem and bespoke systems with modern cloud infrastructure — incrementally, without stopping the business. Based in Charlotte, NC and remote.',
    serviceAnchor: 'legacy-modernization',
    serviceType: 'Software Migration',
    hero: {
      eyebrow: 'Legacy System Modernization',
      headline: 'Replace the system nobody wants to touch',
      subhead:
        'Aging on-prem and bespoke software moved to modern infrastructure incrementally — without a big-bang cutover and without stopping the business.',
    },
    problem: {
      headline: 'The system works, and that is the problem',
      body: [
        'Legacy systems do not get replaced because they are broken. They get replaced because the person who understood them has left, the vendor has stopped patching them, the hosting is a server under a desk, or a compliance requirement has arrived that the system cannot satisfy. Meanwhile the thing runs the business, which is exactly why nobody wants to be the one who touches it.',
        'The instinct is a full rewrite, and it is usually the wrong instinct. Big-bang replacements fail at a well-documented rate because they require the new system to match every undocumented behaviour of the old one on day one — including the behaviours that are technically bugs but that someone downstream now depends on. Two years in, the new system still cannot replace the old one, and now you are maintaining both.',
        'The approach that works is boring and incremental. Put the new system alongside the old one, move one workflow at a time, and run them in parallel until the new path is demonstrably correct. Each step is independently valuable and independently reversible. Nobody has to hold their breath on a cutover weekend.',
        'This is slower to describe and faster to deliver, mostly because you find the undocumented behaviours one at a time while there is still a working system to compare against, rather than all at once during a migration weekend.',
      ],
    },
    approach: [
      {
        step: 'Map what it actually does',
        detail:
          'Not what the documentation claims. Reading the code and the data, and talking to whoever uses it daily, surfaces the undocumented behaviours that sink big-bang rewrites.',
      },
      {
        step: 'Get the data out first',
        detail:
          'Data is the part that genuinely cannot be recreated. Establishing a reliable export and a validated migration path early de-risks everything that follows.',
      },
      {
        step: 'Strangler pattern, one workflow at a time',
        detail:
          'New system alongside the old, routing one workflow at a time. Each move is small enough to reverse if something is wrong.',
      },
      {
        step: 'Run in parallel and reconcile',
        detail:
          'Both systems process real work while output is compared. Discrepancies get found by a script rather than by a customer.',
      },
      {
        step: 'Decommission deliberately',
        detail:
          'The old system is retired only once nothing depends on it and the data is archived somewhere you can still read in five years.',
      },
    ],
    proof: {
      headline: 'RecordStops — replacing a $497/month CRM with a purpose-built pipeline',
      portfolioSlug: 'recordstops',
      body: 'RecordStops needed an outreach pipeline to reach independent record stores across five states. The off-the-shelf answer was a CRM at $497 a month, priced for a sales team rather than a directory operator, and still requiring manual work to fit the actual process. We built a custom outreach and drip pipeline instead, sized to the real workflow, running on the same Astro and Cloudflare D1 stack as the site itself. The subscription went away and the process fitted the business rather than the other way round.',
      outcome: '$497/mo CRM replaced · 296 stores across 5 states · 16 city guides · 683 organic visitors/month',
    },
    image: {
      src: '/images/services/legacy-modernization.jpg',
      alt: 'Migration console showing legacy and modern systems running in parallel with reconciliation status',
    },
    pricing: {
      headline: 'What modernization costs',
      body: 'Modernization is priced per phase rather than as one number, because the honest answer depends on what the discovery sprint finds inside the existing system. The sprint produces a phased plan where each phase delivers something independently useful — which means you can stop between phases if priorities change, rather than being committed to a multi-year programme on day one.',
      anchors: [
        { label: 'Discovery sprint', value: 'from $5k — two weeks, refundable' },
        { label: 'Typical phase', value: '$15k – $50k+' },
        { label: 'Structure', value: 'Phased, each phase independently valuable' },
      ],
    },
    faqs: [
      {
        q: 'Do we have to take the system offline to migrate?',
        a: 'Almost never, and avoiding it is the central design goal. The strangler pattern puts the new system alongside the old one and moves a single workflow at a time, so the business keeps running throughout and each step is small enough to reverse. Brief downtime is sometimes needed for a final data cutover on one specific workflow, but that is measured in minutes and scheduled, not a weekend of everyone holding their breath. The scenario worth avoiding is the big-bang replacement, which is where migration horror stories come from.',

      },
      {
        q: 'What if nobody here understands the old system any more?',
        a: 'This is extremely common and it is a solvable problem, just a slower one. The system itself is the documentation: the code describes what it does, the database describes what it stores, and the people who use it daily know the behaviours that matter even if they cannot explain the internals. Discovery in this situation involves more reading and more observation, and the estimate reflects that. What genuinely helps is access to the running system with real data — behaviour that is invisible in the code is often obvious in the data.',
      },
      {
        q: 'Can we modernise part of it and leave the rest alone?',
        a: 'Yes, and that is frequently the right commercial answer. Not every part of a legacy system is equally risky — often one module handles something compliance-sensitive or blocks a business capability, while the rest is old but perfectly stable. Modernising selectively means spending on the part that actually creates risk. The discovery sprint ranks components by risk and by what each one blocks, so the spend goes where it changes something. Replacing stable, boring code that nobody needs to change is rarely worth it.',
      },
      {
        q: 'What happens to our data?',
        a: 'It gets treated as the irreplaceable asset it is, and it is addressed first rather than last. That means establishing a reliable export from the old system early, building a validated migration path, and running automated reconciliation so discrepancies are caught by a script rather than by a customer. Historical data that is no longer operationally needed gets archived in a format that will still be readable in five years — not left inside a system that is about to be switched off. Nothing is deleted from the old system until the new one is demonstrably correct.',
      },
      {
        q: 'The vendor who built it wants to quote for the rewrite. Should we let them?',
        a: 'Get the quote, and read it against an independent view of what the system actually does. The original vendor has genuine knowledge of the system, which is worth something real. They also have an incentive to propose a rewrite on their own stack, and they are the party least likely to tell you that half the system should simply be retired rather than rebuilt. A discovery sprint from someone with no stake in the outcome gives you a second opinion — and sometimes the finding is that the incumbent’s proposal is sound.',
      },
      {
        q: 'How long does a modernization take?',
        a: 'Longer than a greenfield build of the same functionality, because the new system has to match behaviour that was never written down and the business has to keep running throughout. A single workflow typically moves in weeks; a full system with many interlocking workflows is a multi-phase programme measured in months. The phased structure exists so this is not one long wait — each phase delivers something usable, and you can pause between phases without leaving the system half-migrated. The discovery sprint produces the phase map, so you see the sequence and the checkpoints before committing to the first phase rather than being asked to approve an open-ended programme.',
      },
    ],
    relatedServices: ['internal-tools', 'custom-saas-development', 'fractional-cto'],
    cta: {
      headline: 'Get an independent read',
      body: 'A discovery sprint gives you a phased plan and an honest assessment of what is worth replacing — from someone with no stake in the answer.',
    },
  },

  // ---------------------------------------------------------------------
  {
    slug: 'ai-integrations',
    shortName: 'AI Integrations & Agents',
    metaTitle: 'AI Integration & LLM Development | Ascend Systems',
    metaDescription:
      'AI integration for businesses that need working software, not a pilot — document processing, support agents, and LLM features wired into real systems.',
    serviceAnchor: 'ai-integrations',
    serviceType: 'AI Application Development',
    hero: {
      eyebrow: 'AI Integrations & Agents',
      headline: 'AI integrations that survive contact with production',
      subhead:
        'Document processing, support agents, and LLM features wired into the systems you already run — with evaluation, cost controls, and a fallback when the model is wrong.',
    },
    problem: {
      headline: 'The demo works. The production system is a different problem.',
      body: [
        'Getting an impressive AI demo takes an afternoon. Getting something that holds up against real inputs, at a cost you can predict, with a sensible answer for the cases where the model is confidently wrong, is the actual engineering — and it is where most AI projects quietly stall.',
        'Three things break AI features in production. The first is cost: token spend scales with usage in a way that is easy to miss until the invoice arrives, particularly when a naive implementation sends far more context than it needs on every call. The second is reliability: models produce plausible wrong answers, and a system with no evaluation harness has no way to detect quality degrading after a prompt change or a model update. The third is integration: an AI feature that cannot read your actual data is a toy, and connecting it to real systems is normal software engineering work that the AI framing tends to obscure.',
        'The useful question is rarely "where can we add AI". It is "which specific task is expensive, high-volume, and tolerant of a human check". Document extraction, first-pass support triage, and summarising long records all fit that shape. Anything where a wrong answer is expensive and unreviewable generally does not.',
        'Treating an AI feature as a normal software project — with a data model, error handling, monitoring, and a rollback path — is most of what separates the ones that ship from the ones that stay in pilot.',
      ],
    },
    approach: [
      {
        step: 'Pick a task worth automating',
        detail:
          'Discovery starts by finding the specific high-volume, error-tolerant task where automation pays for itself — not by looking for somewhere to put AI.',
      },
      {
        step: 'Build the evaluation set first',
        detail:
          'A set of real inputs with known-correct outputs, before any prompt work. Without it there is no way to tell whether a change made things better or worse.',
      },
      {
        step: 'Wire it to real data',
        detail:
          'The integration work — reading from your actual systems, handling their formats and failure modes — is ordinary engineering and usually the bulk of the build.',
      },
      {
        step: 'Cost and rate controls',
        detail:
          'Token budgets, caching, and model selection per task, so spend is predictable rather than discovered at the end of the month.',
      },
      {
        step: 'Human in the loop where it matters',
        detail:
          'A review path for low-confidence outputs, and monitoring that surfaces quality drift after a model or prompt change.',
      },
    ],
    proof: {
      headline: 'The honest position on AI proof',
      body: 'The portfolio does not yet include a published AI integration case study — the shipped work in it covers custom SaaS, internal dashboards, and directory infrastructure. What it does demonstrate is the part that determines whether an AI feature survives production: the Cloudflare Workers and D1 pipelines behind CLT EV Analytics and SC DMV Alerts are the same scheduled-job, external-API, cost-controlled infrastructure that an AI integration runs on. Rather than point at a case study that is not there, the fair thing is to say that AI engagements start with an evaluation harness on your real data, so quality is measured rather than asserted before anything ships.',
    },
    image: {
      src: '/images/services/ai-integrations.jpg',
      alt: 'Document processing queue with per-item confidence scores and a human review lane',
    },
    pricing: {
      headline: 'What an AI integration costs',
      body: 'AI work is priced the same way as any other build, with one addition: ongoing model cost is estimated during discovery and designed for explicitly, rather than left to be discovered on the first full invoice. Small, well-scoped automations of a single task sit at the lower end. Anything requiring retrieval over a large document corpus, or an agent that takes actions in other systems, sits higher because the integration and safety work grows.',
      anchors: [
        { label: 'Discovery sprint', value: 'from $5k — two weeks, refundable' },
        { label: 'Typical integration', value: '$15k – $50k+' },
        { label: 'Model spend', value: 'Estimated in discovery, budgeted explicitly' },
      ],
    },
    faqs: [
      {
        q: 'Which AI model do you build on?',
        a: 'It depends on the task, and the architecture deliberately keeps that decision changeable. Frontier models from Anthropic or OpenAI suit reasoning-heavy work; smaller and cheaper models handle classification and extraction perfectly well at a fraction of the cost. A common pattern is a cheap model for the high-volume path and an expensive one only for cases it flags as uncertain. What matters commercially is not being locked to one provider, because pricing and capability shift often enough that a system which cannot switch models will be overpaying within a year.',
      },
      {
        q: 'How do you stop it from making things up?',
        a: 'You cannot eliminate it, so the system is designed on the assumption it will happen. In practice that means grounding responses in retrieved source data rather than model memory, returning citations so a human can verify a claim, setting confidence thresholds that route uncertain cases to a person, and running an evaluation set on every prompt change to catch regressions. The design question is never "will it be wrong" but "what happens when it is" — and for tasks where a wrong answer is expensive and nobody would catch it, the honest recommendation is often not to automate it.',
      },
      {
        q: 'What will the ongoing model cost be?',
        a: 'It is estimated during discovery from expected volume and measured token usage on real inputs, then designed for — caching repeated queries, trimming context to what the task actually needs, and routing simple cases to cheaper models. For most business automations the monthly model spend is modest relative to the labour it replaces, but the number varies enormously with volume and context size. The failure mode worth avoiding is a naive implementation that sends far more context than necessary on every single call, which can multiply the bill several times over for no quality gain.',
      },
      {
        q: 'Can it work with our existing data and systems?',
        a: 'That is generally the whole job. An AI feature that cannot read your actual documents, records, or tickets is a demo. The integration work — pulling from your systems, handling their formats, dealing with their downtime and rate limits — is ordinary software engineering and usually the larger part of the build. This is where the Cloudflare Workers and D1 experience behind the existing portfolio work transfers directly: scheduled jobs, external API integration, and cost-controlled pipelines are the same problem regardless of whether a model sits in the middle.',
      },
      {
        q: 'Is our data used to train someone else’s model?',
        a: 'Not under the standard commercial API terms of the major providers, which exclude API inputs from training by default — but this is worth verifying per provider and per plan rather than assuming, and it is covered explicitly during discovery. For genuinely sensitive data there are stronger options: zero-retention endpoints, self-hosted open models, or keeping the sensitive fields out of the prompt entirely by redacting before the call. Which is appropriate depends on your compliance position, and that conversation happens before any data is sent anywhere.',
      },
      {
        q: 'We tried an AI pilot and it did not go anywhere. What went wrong?',
        a: 'The most common cause is that the pilot proved the model could do the task in principle without ever addressing what production requires: connection to real data, handling of the awkward inputs, a defined path for wrong answers, cost at full volume, and someone owning it after launch. A pilot that skips those has not actually reduced the risk it was meant to reduce. The second most common cause is picking a task where the automation was never worth much — low volume, or output needing so much checking that the review costs as much as doing it.',
      },
    ],
    relatedServices: ['internal-tools', 'custom-saas-development', 'fractional-cto'],
    cta: {
      headline: 'Start with the task, not the technology',
      body: 'Book a 30-minute call to work out whether there is a task in your business where automation genuinely pays — and whether AI is the right tool for it.',
    },
  },

  // ---------------------------------------------------------------------
  {
    slug: 'fractional-cto',
    shortName: 'Fractional CTO',
    metaTitle: 'Fractional CTO Services — Charlotte, NC | Ascend Systems',
    metaDescription:
      'Fractional CTO who still writes code. Technical strategy, vendor evaluation, and hiring support for owner-operators — on retainer, without a full-time hire.',
    serviceAnchor: 'fractional-cto',
    serviceType: 'Technical Advisory',
    hero: {
      eyebrow: 'Fractional CTO',
      headline: 'A fractional CTO who still writes code',
      subhead:
        'Senior engineering judgement on retainer — architecture decisions, vendor evaluation, and hiring support for owner-operators who need a technical partner rather than another vendor.',
    },
    problem: {
      headline: 'Technical decisions with no technical counterparty',
      body: [
        'A business without an engineering leader still has to make engineering decisions. Which vendor to sign. Whether the quote is reasonable. Whether the developer you hired is doing good work. Whether the platform you are being sold locks you in. These decisions have consequences measured in years, and they are usually made by someone with no way to evaluate them and no independent party to ask.',
        'The default is to trust the vendor doing the quoting, which works right up until it does not. The second default is to hire a full-time CTO, which for a business of this size is an expensive answer to a part-time question — and often attracts someone who wants to build a team rather than solve the specific problems you have.',
        'What is usually needed is not full-time leadership. It is a senior technical person who understands your business, is available when a decision comes up, has no stake in which vendor you pick, and can read a proposal or a codebase and tell you plainly what is wrong with it.',
        'The distinction that matters is whether that person still builds. An advisor who has not shipped software in five years will give you strategy that sounds right and estimates that are wrong, because the cost of a piece of work is not something you can reason about from memory.',
      ],
    },
    approach: [
      {
        step: 'Understand the business first',
        detail:
          'Technical strategy that ignores commercial reality is worthless. The first weeks are about how the business makes money and where software helps or blocks that.',
      },
      {
        step: 'Audit what exists',
        detail:
          'An honest read of the current systems, vendors, and contracts — including which are fine, which are risks, and which are quietly expensive.',
      },
      {
        step: 'Be available for decisions',
        detail:
          'The main value is being reachable when a quote arrives or a vendor proposes something. Decisions get made with a technical counterparty in the room.',
      },
      {
        step: 'Hire and manage engineers',
        detail:
          'Writing the role, screening candidates, running technical interviews, and reviewing work — the parts that are hard to do without an engineer.',
      },
      {
        step: 'Build when it is faster',
        detail:
          'Some problems are quicker to solve than to specify and delegate. Where that is true, the work simply gets done.',
      },
    ],
    proof: {
      headline: 'SendMyLove — a $0 outcome, published in full',
      portfolioSlug: 'sendmylove',
      body: 'The most useful evidence of technical judgement is not a list of successes. SendMyLove shipped in two weeks, delivered 2,515 messages, and earned exactly $0 in recurring revenue. The case study documents the whole thing publicly: what the assumption was, why the psychology of the product did not work, what the architecture got right, and the decision to sunset v1 rather than keep spending on it. Knowing when to stop is a large part of what a technical partner is for, and it is the part vendors have the least incentive to tell you.',
      outcome: '2,515 messages delivered · $0 MRR · v1 sunset deliberately · full post-mortem published',
    },
    image: {
      src: '/images/services/fractional-cto.jpg',
      alt: 'Technical roadmap board with architecture decisions, vendor reviews, and risk flags',
    },
    pricing: {
      headline: 'What a fractional CTO engagement costs',
      body: 'Fractional engagements run as a monthly retainer sized to the number of days a month you actually need, rather than as a project with a fixed end. Most owner-operator businesses need considerably less time than they expect — the value concentrates in being available at decision points rather than in a fixed number of hours. Retainers are month to month, because an advisory relationship that needs a long lock-in is not a good sign.',
      anchors: [
        { label: 'Structure', value: 'Monthly retainer, month to month' },
        { label: 'Sized by', value: 'Days per month, not fixed hours' },
        { label: 'Also available', value: 'One-off audit or vendor review' },
      ],
    },
    faqs: [
      {
        q: 'How much of your time do we actually get?',
        a: 'Retainers are sized in days per month, agreed up front and adjusted as the engagement settles. Most owner-operator businesses find they need less than expected, because the value concentrates in availability at decision points rather than in a fixed number of hours logged. A typical shape is a regular check-in, review of anything significant in flight, and being reachable when a quote arrives or something breaks. If the real need turns out to be a full-time engineering leader, the honest recommendation is to hire one — and helping scope and fill that role is legitimate work for the engagement.',
      },
      {
        q: 'Do you actually write code, or just advise?',
        a: 'Both, and the combination is the point. An advisor who has not shipped software recently gives strategy that sounds reasonable and estimates that are wrong, because the real cost of a piece of work is not something you can reason about from memory. In practice some problems are faster to solve directly than to specify, delegate, and review — and where that is true, the work gets done. The rest of the time the role is genuinely advisory: reading proposals, reviewing architecture, and being the technical counterparty in decisions.',
      },
      {
        q: 'Can you evaluate a vendor or a quote we have received?',
        a: 'Yes, and it is one of the most common single pieces of work. A quote review covers whether the scope matches what you asked for, whether the estimate is plausible for that scope, what is conspicuously missing, and where the lock-in sits — hosting, proprietary frameworks, data portability, contract terms. This is available as a one-off engagement rather than requiring a retainer. The value comes precisely from having no stake in which vendor wins, which is the one thing the vendors quoting cannot offer you.',
      },
      {
        q: 'Will you help us hire developers?',
        a: 'Yes — writing the role definition, screening applications, running the technical portion of interviews, and reviewing early work. Technical hiring is genuinely difficult without an engineer, and the common failure is not hiring someone bad but hiring the wrong shape: a specialist where you needed a generalist, or a senior engineer for work that will bore them within a quarter. Where it helps most is being honest about whether you need a hire at all, since a defined project is often better served by a fixed-scope engagement than by a permanent role.',
      },
      {
        q: 'What if you tell us something we do not want to hear?',
        a: 'That is largely what you are paying for. The recurring examples: the product should be sunset, the platform being proposed will lock you in, the developer is not doing good work, or the thing you want to build is not worth what it costs. SendMyLove is the public version of this — a project that shipped, earned nothing, and got sunset with the post-mortem published rather than quietly buried. An advisor whose incentive is to keep the engagement going will not reliably tell you to stop spending.',
      },
      {
        q: 'How is this different from just hiring a consultant?',
        a: 'Mostly continuity and incentive. A consultant is typically engaged for a defined piece of work, delivers a recommendation, and leaves — which means they never see whether the advice was right. A fractional engagement is ongoing, so decisions get made by someone who knows what was decided six months ago and why, and who is still around when the consequences land. The other difference is having no product or platform to sell you, which removes the structural bias in advice from anyone whose revenue depends on which answer you choose.',
      },
    ],
    relatedServices: ['custom-saas-development', 'legacy-modernization', 'ai-integrations'],
    cta: {
      headline: 'Start with one decision',
      body: 'Bring a live question — a quote to review, an architecture call, a hire you are unsure about — to a 30-minute conversation and see whether the fit is real.',
    },
  },
];

export const getServicePage = (slug: string): ServicePage | undefined =>
  SERVICE_PAGES.find((s) => s.slug === slug);
