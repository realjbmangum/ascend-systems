import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const services = [
  {
    title: 'Web & App Development',
    description:
      'Your customers and your team deserve tools that are fast, reliable, and built for how they actually work — not a template with your logo on it.',
    useCases: [
      'Customer-facing web apps that convert',
      'Internal tools your team will actually use',
      'E-commerce and marketplace platforms',
      'Mobile-first progressive web apps',
    ],
    tech: ['React', 'Astro', 'Next.js', 'Node.js', 'TypeScript', 'Cloudflare', 'Supabase'],
    example:
      'We built RecordStops.com — a directory of 296 record stores across 5 states with real-time search, 16 city guides, and 683 monthly users.',
    dark: false,
  },
  {
    title: 'AI Integrations',
    description:
      'AI that handles real work in production — answering phones, processing documents, running workflows — not a chatbot that says "I\'m sorry, I can\'t help with that."',
    useCases: [
      'AI phone agents that book appointments and capture leads',
      'Support chatbots trained on your actual data',
      'Document processing and data extraction',
      'Workflow automation powered by LLMs',
    ],
    tech: ['OpenAI', 'Claude', 'Voice AI', 'Twilio', 'Custom Integrations'],
    example:
      'We built an AI phone system that answers calls 24/7, books appointments, and captures leads — doing the job of a $3,000/month answering service.',
    dark: true,
  },
  {
    title: 'Business Automation',
    description:
      'Every hour your team spends copy-pasting between systems is an hour they\'re not spending on work that matters. We connect your tools so the data moves itself.',
    useCases: [
      'CRM setup and workflow automation',
      'Real-time notifications and alerts',
      'Data pipelines and automated reporting',
      'Payment and subscription management',
    ],
    tech: ['Cloudflare Workers', 'D1', 'Stripe', 'SendGrid', 'Twilio', 'APIs'],
    example:
      'We built SCDMV Alerts — a system that checks DMV appointments every 15 minutes and texts subscribers the moment a slot opens.',
    dark: false,
  },
  {
    title: 'Custom Solutions',
    description:
      'Some problems don\'t fit a category. If you have a business challenge that software can solve, we\'ll scope it, build it, and ship it.',
    useCases: [
      'Niche SaaS products for underserved markets',
      'Data analysis and reporting tools',
      'Industry-specific platforms',
      'MVPs to validate a business idea before scaling',
    ],
    tech: [],
    example:
      'We built SendMyLove.app — a subscription messaging platform that has delivered 2,500+ personalized messages on automated schedules.',
    dark: true,
  },
];

const steps = [
  {
    num: '1',
    title: 'Discovery',
    description: 'A 30-minute call to understand your business, define the problem, and agree on what "done" looks like.',
  },
  {
    num: '2',
    title: 'Build',
    description: 'You see working software every week — not a status report that says "on track."',
  },
  {
    num: '3',
    title: 'Launch',
    description: 'We deploy to production, monitor for issues, and make sure real users can do real work.',
  },
  {
    num: '4',
    title: 'Support',
    description: 'Bug fixes, feature updates, and scaling — we stay as long as you need us.',
  },
];

export default function Services() {
  return (
    <>
      <SEO
        title="Services | Web Development, AI Integration & Business Automation | Ascend Systems"
        description="Custom web applications, AI integrations, business automation, and AI phone solutions for mid-market companies. From discovery to production in weeks."
      />
      {/* Hero */}
      <section className="reveal bg-charcoal py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Software That Solves the Problem You Actually Have
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Custom apps, AI that works in production, and automation that pays for itself. Built for mid-market companies that can't wait six months for a vendor to deliver.
          </p>
        </div>
      </section>

      {/* Service Blocks */}
      {services.map((service) => (
        <section
          key={service.title}
          className={`reveal py-20 sm:py-24 ${
            service.dark ? 'bg-charcoal text-white' : 'bg-surface text-charcoal'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className={`text-3xl sm:text-4xl font-bold tracking-tight ${
                service.dark ? 'text-white' : 'text-charcoal'
              }`}
            >
              {service.title}
            </h2>
            <p
              className={`mt-4 text-lg leading-relaxed max-w-3xl ${
                service.dark ? 'text-gray-300' : 'text-gray-600'
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
          </div>
        </section>
      ))}

      {/* How We Work */}
      <section className="reveal bg-surface py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal tracking-tight text-center">
            How We Work
          </h2>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange text-white text-2xl font-bold">
                  {step.num}
                </span>
                <h3 className="mt-5 text-lg font-bold text-charcoal">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="reveal bg-charcoal py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Know what you need? Let's scope it.
          </h2>
          <p className="mt-4 text-gray-400 text-lg max-w-lg mx-auto">
            Tell us about your project and we'll come back with a timeline, cost range, and recommended approach.
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
