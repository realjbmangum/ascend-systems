import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import MockDashboard from '../components/MockDashboard';
import MockPhoneUI from '../components/MockPhoneUI';

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
    mockType: 'dashboard' as const,
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
    mockType: 'phone' as const,
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
    mockType: 'dashboard' as const,
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
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Your Business Has a Technology Problem. We Fix It.
          </motion.h1>
          <motion.p
            className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
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
              </div>

              {/* Right: mock UI */}
              <div className="lg:col-span-2 hidden lg:flex items-center justify-center">
                {service.mockType === 'phone' ? <MockPhoneUI /> : <MockDashboard />}
              </div>
            </div>
          </div>
        </motion.section>
      ))}

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
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
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
