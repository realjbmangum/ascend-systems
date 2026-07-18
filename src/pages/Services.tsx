import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import MockDashboard from '../components/MockDashboard';
import MockPhoneUI from '../components/MockPhoneUI';
import { SERVICE_PAGES } from '../data/services';

const services = [
  {
    title: 'Custom SaaS Development',
    slug: 'custom-saas-development',
    description:
      'Subscription software with real billing, real auth, and real users. The hard part is never the feature you pitched — it is the plumbing underneath, and that is what gets built first.',
    useCases: [
      'Customer-facing products with subscription billing',
      'Multi-tenant platforms with role-based permissions',
      'Marketplaces and two-sided platforms',
      'A working first version to test an idea before investing more',
    ],
    tech: ['React', 'Astro', 'Next.js', 'TypeScript', 'Cloudflare', 'Supabase', 'Stripe'],
    example:
      'SC DMV Alerts went from idea to paying subscribers in under three weeks — 65 locations monitored every five minutes, three subscription tiers, Stripe billing, running on Cloudflare Workers and D1.',
    dark: false,
    mockType: 'dashboard' as const,
  },
  {
    title: 'AI Integrations & Agents',
    slug: 'ai-integrations',
    description:
      'Getting an impressive AI demo takes an afternoon. Getting something that holds up against real inputs, at a cost you can predict, with a sensible answer for when the model is wrong, is the actual engineering.',
    useCases: [
      'Long-document review — contracts, bids, specs — prepped for a human',
      'Internal chatbots that answer from your own systems, in plain language',
      'Document processing and data extraction at volume',
      'LLM features wired into the systems you already run',
    ],
    tech: ['Claude', 'OpenAI', 'Grok', 'RAG', 'Cloudflare Workers', 'Evaluation harnesses'],
    example:
      'A commercial masonry contractor spent 2–3 hours per contract getting a 300-page subcontract ready for their attorney. We built a tool that produces the structured pre-review — risk clauses pulled out and flagged — in 15 minutes. The attorney still does the legal work; they just start from a package instead of a PDF.',
    dark: true,
    mockType: 'phone' as const,
  },
  {
    title: 'Internal Tools & Dashboards',
    slug: 'internal-tools',
    description:
      'When someone on your team has built an elaborate spreadsheet with lookups and conditional formatting to compensate for what the software will not do, that spreadsheet is a specification.',
    useCases: [
      'Operations dashboards that answer real questions',
      'Admin panels and back-office workflow software',
      'Role-based views for operations, finance, and leadership',
      'Scheduled jobs that end the Monday-morning CSV export',
    ],
    tech: ['React', 'Cloudflare Workers', 'D1', 'PostgreSQL', 'Supabase', 'Third-party APIs'],
    example:
      'CLT EV Analytics put all 208 of the City of Charlotte’s EV stations across 46 locations into a single pane — three org units unified, refreshed every 30 minutes, sub-100ms from the edge.',
    dark: false,
    mockType: 'dashboard' as const,
  },
  {
    title: 'Legacy System Modernization',
    slug: 'legacy-modernization',
    description:
      'Legacy systems do not get replaced because they are broken. They get replaced because the person who understood them has left. Big-bang rewrites fail; moving one workflow at a time does not.',
    useCases: [
      'Aging on-prem systems moved to modern cloud infrastructure',
      'Replacing an expensive SaaS subscription with software you own',
      'Getting data out of a system nobody wants to touch',
      'Phased migration with no cutover weekend',
    ],
    tech: ['Strangler pattern', 'Cloudflare', 'PostgreSQL', 'D1', 'Data migration', 'Reconciliation'],
    example:
      'RecordStops replaced a $497/month CRM with a purpose-built outreach pipeline sized to the actual workflow — 296 stores across five states, 683 organic visitors a month, no subscription.',
    dark: true,
    mockType: 'dashboard' as const,
  },
  {
    title: 'Fractional CTO',
    slug: 'fractional-cto',
    description:
      'A business without an engineering leader still has to make engineering decisions. Senior technical judgement on retainer — from someone with no stake in which vendor you pick, who still writes code.',
    useCases: [
      'Reviewing a vendor quote before you sign it',
      'Architecture decisions with a technical counterparty in the room',
      'Writing the role, screening candidates, running technical interviews',
      'An honest read on whether the thing you want is worth what it costs',
    ],
    tech: ['Architecture review', 'Vendor evaluation', 'Technical hiring', 'Roadmap'],
    example:
      'SendMyLove shipped in two weeks, delivered 2,515 messages, and earned $0 MRR — sunset deliberately with the post-mortem published. Knowing when to stop is a large part of what a technical partner is for.',
    dark: false,
    mockType: 'phone' as const,
  },
];

const steps = [
  {
    num: '1',
    title: 'Discovery',
    description: 'A 30-minute call to understand your business, define the problem, and agree on what success looks like.',
  },
  {
    num: '2',
    title: 'Build',
    description: 'You see real, working progress every week — not a status report that says "on track."',
  },
  {
    num: '3',
    title: 'Launch',
    description: 'We put your software live, watch for issues, and make sure your team and customers can use it right away.',
  },
  {
    num: '4',
    title: 'Support',
    description: 'Fixes, updates, and improvements as your business grows — we stay as long as you need us.',
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const stepItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Services() {
  return (
    <>
      <SEO
        title="Services | Custom Software, AI & Automation for Growing Businesses | Ascend Systems"
        description="Custom software, AI solutions, and business automation for mid-market companies. We solve the technology problems that slow your business down."
      />
      {/* Hero */}
      <section className="relative bg-charcoal py-24 sm:py-32 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}>
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
            style={{ color: '#ffffff' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Your Business Has a Technology Problem.{' '}
            <span className="text-orange">We Fix It.</span>
          </motion.h1>
          <motion.p
            className="mt-6 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed text-balance"
            style={{ color: 'rgba(255,255,255,0.78)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Custom software, AI that handles real work, and automation that pays for itself. Built for growing companies that are tired of waiting six months for a vendor to deliver.
          </motion.p>
        </div>
      </section>

      {/* Service Blocks */}
      {services.map((service) => (
        <motion.section
          key={service.title}
          className={`py-24 sm:py-32 ${
            service.dark ? 'bg-charcoal text-white' : 'bg-surface text-charcoal'
          }`}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-start">
              {/* Left: text content */}
              <div className="lg:col-span-3">
                <h2
                  className={`text-4xl sm:text-5xl font-bold tracking-tight leading-tight ${
                    service.dark ? 'text-white' : 'text-charcoal'
                  }`}
                >
                  {service.title}
                </h2>
                <p
                  className={`mt-6 text-lg sm:text-xl leading-relaxed ${
                    service.dark ? 'text-gray-200' : 'text-gray-600'
                  }`}
                >
                  {service.description}
                </p>

                {/* Use Cases Grid */}
                <div className="mt-10 grid sm:grid-cols-2 gap-4">
                  {service.useCases.map((uc) => (
                    <div
                      key={uc}
                      className={`flex items-start gap-3 rounded-lg p-4 ${
                        service.dark
                          ? 'bg-charcoal-light/50'
                          : 'bg-white shadow-sm'
                      }`}
                    >
                      <span className="mt-0.5 text-orange font-bold text-lg leading-none">
                        &rsaquo;
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          service.dark ? 'text-gray-200' : 'text-charcoal'
                        }`}
                      >
                        {uc}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tech Tags */}
                {service.tech.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {service.tech.map((t) => (
                      <span
                        key={t}
                        className={`text-xs font-mono font-semibold px-3 py-1.5 rounded-full ${
                          service.dark
                            ? 'bg-charcoal-lighter text-gray-300'
                            : 'bg-surface-100 text-charcoal'
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Example Callout */}
                <div
                  className={`mt-10 rounded-lg border-l-4 border-orange p-5 ${
                    service.dark ? 'bg-charcoal-light/60' : 'bg-white'
                  }`}
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                      service.dark ? 'text-orange-light' : 'text-orange'
                    }`}
                  >
                    Real Example
                  </p>
                  <p
                    className={`text-sm leading-relaxed ${
                      service.dark ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {service.example}
                  </p>
                </div>

                <Link
                  to={`/services/${service.slug}`}
                  className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold hover:underline underline-offset-4 ${
                    service.dark ? 'text-orange-light' : 'text-orange-dark'
                  }`}
                >
                  More on {service.title.toLowerCase()} →
                </Link>
              </div>

              {/* Right: mock UI */}
              <div className="lg:col-span-2 hidden lg:flex items-center justify-center">
                {service.mockType === 'phone' ? <MockPhoneUI /> : <MockDashboard />}
              </div>
            </div>
          </div>
        </motion.section>
      ))}

      {/* Free Cost Calculator CTA */}
      <section className="bg-charcoal py-20 sm:py-24 border-t border-charcoal-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-charcoal-light/50 border border-white/10 rounded-2xl p-8 sm:p-12 grid md:grid-cols-[1.4fr,1fr] gap-8 items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <div>
              <p className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-orange mb-4">
                Free tool — no signup
              </p>
              <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                Not sure if a custom build pays for itself?
              </h3>
              <p className="mt-4 text-gray-300 text-base sm:text-lg leading-relaxed">
                Plug four numbers into our Cost Calculator. Get back annual
                waste, build price range, and payback in months — emailed in
                60 seconds.
              </p>
            </div>
            <div className="flex md:justify-end">
              <Link
                to="/tools/cost-calculator"
                className="inline-flex items-center gap-2 bg-orange hover:bg-orange-dark text-white text-base font-semibold px-7 py-4 rounded-lg transition-colors whitespace-nowrap"
              >
                Try the Calculator <span aria-hidden>→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How We Work — Interactive Timeline */}
      <section className="bg-surface py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl sm:text-5xl font-bold text-charcoal tracking-tight text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How We Work
          </motion.h2>

          {/* Interactive horizontal timeline */}
          <motion.div
            className="mt-16 relative"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Connecting line — desktop only */}
            <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-0.5 bg-charcoal/20">
              <motion.div
                className="h-full bg-orange origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                viewport={{ once: true }}
              />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step) => (
                <motion.div
                  key={step.num}
                  className="text-center relative"
                  variants={stepItem}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span className="relative z-10 inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange text-white text-2xl font-bold shadow-md">
                    {step.num}
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-charcoal">{step.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service detail pages — must sit ABOVE the closing CTA so the links
          are not stranded below the page's conversion moment. Rendered here
          rather than appended in services.astro for the same reason. This
          content is SSR'd into the static HTML at build time. */}
      <section className="bg-white py-24 sm:py-32 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal tracking-tight mb-4">
            Go deeper on a service
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-12 max-w-2xl">
            Each service has its own page covering how an engagement runs, what
            it costs, a named project it produced, and the questions that come
            up most.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {SERVICE_PAGES.map((s) => (
              <li key={s.slug}>
                <Link
                  to={`/services/${s.slug}`}
                  className="block h-full rounded-xl border border-surface-200 bg-surface p-6 hover:border-orange transition-colors"
                >
                  <span className="block font-semibold text-charcoal mb-2">
                    {s.shortName}
                  </span>
                  <span className="block text-sm leading-relaxed text-gray-600">
                    {s.hero.subhead}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-charcoal py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to get started? Let's talk about your project.
          </motion.h2>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
            Tell us what you are working on and we will come back with a timeline, cost range, and recommended approach.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block bg-orange hover:bg-orange-dark text-white text-lg font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            Book a Free Discovery Call
          </Link>
        </div>
      </section>
    </>
  );
}
