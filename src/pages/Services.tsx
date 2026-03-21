import { Link } from 'react-router-dom';

const services = [
  {
    title: 'Web & App Development',
    description:
      'Custom websites, web applications, PWAs, and internal dashboards built to spec.',
    useCases: [
      'Customer-facing web apps',
      'Internal tools & dashboards',
      'E-commerce & marketplace platforms',
      'Mobile-responsive PWAs',
    ],
    tech: ['React', 'Astro', 'Next.js', 'Node.js', 'TypeScript', 'Cloudflare', 'Supabase'],
    example:
      'A directory platform serving 296 businesses across 5 states with real-time search and city guides.',
    dark: false,
  },
  {
    title: 'AI Integrations',
    description:
      'Practical AI solutions that solve real business problems — not science projects.',
    useCases: [
      'AI phone answering & appointment booking',
      'Intelligent chatbots for support',
      'Document processing & extraction',
      'Workflow automation with LLMs',
    ],
    tech: ['OpenAI', 'Claude', 'Voice AI', 'Twilio', 'Custom Integrations'],
    example:
      'An AI phone system that handles calls 24/7, books appointments, and captures leads — replacing a $3,000/month answering service.',
    dark: true,
  },
  {
    title: 'Business Automation',
    description:
      'Eliminate manual work. Connect your tools. Get time back.',
    useCases: [
      'CRM setup & workflow automation',
      'Automated notifications & alerts',
      'Data pipelines & reporting',
      'Payment & subscription management',
    ],
    tech: ['Cloudflare Workers', 'D1', 'Stripe', 'SendGrid', 'Twilio', 'APIs'],
    example:
      'A monitoring system that checks appointments every 15 minutes and alerts subscribers instantly via email.',
    dark: false,
  },
  {
    title: 'Custom Solutions',
    description:
      'If it can be built with software, we can build it. Unique problems need unique solutions.',
    useCases: [
      'Niche SaaS products',
      'Data analysis tools',
      'Industry-specific platforms',
      'MVP development for validation',
    ],
    tech: [],
    example:
      'A subscription messaging platform that\'s delivered 2,500+ personalized messages with automated scheduling.',
    dark: true,
  },
];

const steps = [
  {
    num: '1',
    title: 'Discovery',
    description: 'We learn your business, define the problem, and scope the solution.',
  },
  {
    num: '2',
    title: 'Build',
    description: 'Small, iterative sprints. You see progress weekly, not quarterly.',
  },
  {
    num: '3',
    title: 'Launch',
    description: 'We deploy, monitor, and make sure everything works in production.',
  },
  {
    num: '4',
    title: 'Support',
    description: 'Ongoing maintenance, updates, and scaling as your needs grow.',
  },
];

export default function Services() {
  return (
    <>
      {/* Hero */}
      <section className="reveal bg-charcoal py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            What We Build
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From custom applications to AI integrations, we help mid-market companies ship the
            software they need — fast.
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
            Have a project in mind?
          </h2>
          <Link
            to="/contact"
            className="mt-8 inline-block bg-orange hover:bg-orange-dark text-white text-lg font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            Let's Talk
          </Link>
        </div>
      </section>
    </>
  );
}
