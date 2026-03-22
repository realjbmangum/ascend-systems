import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const services = [
  {
    title: 'Web & App Development',
    description:
      'Your customers expect a smooth experience and your team needs tools that actually help them do their jobs — not a cookie-cutter template with your logo on it.',
    useCases: [
      'Customer portals and online tools that drive sales',
      'Internal software your team will actually use',
      'Online stores and marketplace platforms',
      'Mobile-friendly apps that work on any device',
    ],
    tech: ['React', 'Astro', 'Next.js', 'Node.js', 'TypeScript', 'Cloudflare', 'Supabase'],
    example:
      'We built RecordStops.com — a searchable directory of 296 record stores across 5 states with city guides and a weekly newsletter, attracting 683 monthly visitors.',
    dark: false,
  },
  {
    title: 'AI Integrations',
    description:
      'AI that handles real work for your business — answering phones, processing documents, running daily tasks — trained on your data, not a generic chatbot that frustrates your customers.',
    useCases: [
      'AI phone agents that book appointments and capture leads',
      'Customer support chatbots trained on your actual business',
      'Automatic processing of documents and paperwork',
      'Routine tasks handled by AI so your team can focus',
    ],
    tech: ['OpenAI', 'Claude', 'Voice AI', 'Twilio', 'Custom Integrations'],
    example:
      'We built an AI phone system that answers calls around the clock, books appointments, and captures leads — doing the job of a $3,000/month answering service.',
    dark: true,
  },
  {
    title: 'Business Automation',
    description:
      'Every hour your team spends copy-pasting between systems is an hour they\'re not spending on work that matters. We connect your tools so the data moves itself.',
    useCases: [
      'CRM setup and automatic follow-ups',
      'Real-time notifications and alerts',
      'Automated reports delivered on schedule',
      'Payment and subscription management',
    ],
    tech: ['Cloudflare Workers', 'D1', 'Stripe', 'SendGrid', 'Twilio', 'APIs'],
    example:
      'We built SCDMV Alerts — a service that checks DMV appointments every 15 minutes and texts subscribers the moment a slot opens, with thousands of active users.',
    dark: false,
  },
  {
    title: 'Custom Solutions',
    description:
      'Some problems are unique to your business. If you have a challenge that technology can solve, we will map it out, build it, and put it to work for you.',
    useCases: [
      'Software products for underserved markets',
      'Data analysis and reporting dashboards',
      'Industry-specific platforms',
      'A working first version to test a business idea before investing more',
    ],
    tech: [],
    example:
      'We built SendMyLove.app — a subscription messaging service that delivers personalized messages on a schedule, with over 2,500 messages sent and paying subscribers from day one.',
    dark: true,
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

export default function Services() {
  return (
    <>
      <SEO
        title="Services | Custom Software, AI & Automation for Growing Businesses | Ascend Systems"
        description="Custom software, AI solutions, and business automation for mid-market companies. We solve the technology problems that slow your business down."
      />
      {/* Hero */}
      <section className="reveal relative bg-charcoal py-24 sm:py-32 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}>
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Your Business Has a Technology Problem. We Fix It.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Custom software, AI that handles real work, and automation that pays for itself. Built for growing companies that are tired of waiting six months for a vendor to deliver.
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
            <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
              {/* Left: text content */}
              <div className="lg:col-span-3">
                <h2
                  className={`text-3xl sm:text-4xl font-bold tracking-tight ${
                    service.dark ? 'text-white' : 'text-charcoal'
                  }`}
                >
                  {service.title}
                </h2>
                <p
                  className={`mt-4 text-lg leading-relaxed ${
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

              {/* Right: image placeholder */}
              <div className="lg:col-span-2 hidden lg:flex items-center justify-center">
                <div className={`w-full h-64 rounded-xl flex items-center justify-center border border-dashed ${
                  service.dark
                    ? 'bg-charcoal-light/40 border-gray-400/20'
                    : 'bg-charcoal-lighter/30 border-gray-500/30'
                }`}>
                  <span className={`text-sm ${service.dark ? 'text-gray-500' : 'text-gray-400'}`}>Screenshot coming soon</span>
                </div>
              </div>
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
            Ready to get started? Let's talk about your project.
          </h2>
          <p className="mt-4 text-gray-400 text-lg max-w-lg mx-auto">
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
