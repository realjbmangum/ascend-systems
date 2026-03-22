import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ServiceCard from '../components/ServiceCard';
import CaseStudyCard from '../components/CaseStudyCard';

export default function Home() {
  return (
    <>
      <SEO
        title="Ascend Systems | Custom Software & AI for Growing Businesses | Charlotte, NC"
        description="Technology that works as hard as you do. Custom software, AI solutions, and business automation for mid-market companies. Based in Charlotte, NC."
      />
      {/* Hero */}
      <section className="relative bg-charcoal py-32 sm:py-44 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/70 to-charcoal/90" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
            Technology that works<br className="hidden sm:block" /> as hard as you do.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Custom software, AI, and automation that solve the problems slowing your business down — built by the same person you talk to on day one.
          </p>
          <div className="mt-10">
            <Link
              to="/contact"
              className="inline-block bg-orange hover:bg-orange-dark text-white text-lg font-semibold px-8 py-4 rounded-lg transition-colors shadow-orange-glow hover:shadow-orange-glow-lg"
            >
              Book a Free Discovery Call
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="reveal bg-surface py-16 relative">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%231E2A32' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustItems.map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 text-orange">{item.icon}</div>
                <span className="text-sm font-semibold text-charcoal">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="reveal bg-white py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal text-center mb-4">How we help</h2>
          <p className="text-gray-500 text-center max-w-xl mx-auto mb-12">
            From first conversation to finished product — one person handles your entire project, start to finish.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <ServiceCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              }
              title="Web & App Development"
              description="Websites, customer portals, and internal tools that load fast, work on every device, and grow with your business."
              linkTo="/services"
            />
            <ServiceCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              }
              title="AI Integrations"
              description="AI that answers your phones, processes paperwork, and handles customer questions — trained on your business, not generic templates."
              linkTo="/services"
            />
            <ServiceCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                </svg>
              }
              title="Business Automation"
              description="Connect your CRM, automate reports, trigger alerts — and stop paying people to copy-paste between systems."
              linkTo="/services"
            />
            <ServiceCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              }
              title="AI Phone Solutions"
              description="Your phones answered 24/7 — appointments booked, leads captured, customers helped — without hiring another person."
              linkTo="/services"
            />
          </div>
        </div>
      </section>

      {/* Why Ascend */}
      <section className="reveal bg-surface py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal text-center mb-12">
            Why growing companies choose Ascend
          </h2>
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Connecting line behind items */}
            <div className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-orange/20 to-transparent" />
            {whyItems.map((item) => (
              <div key={item.title} className="relative text-center">
                <div className="w-12 h-12 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 text-orange">
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold text-charcoal mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="reveal bg-white py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal text-center mb-4">Recent Work</h2>
          <p className="text-gray-500 text-center max-w-xl mx-auto mb-12">
            Real businesses with real customers and real revenue — here is what we have built recently.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <CaseStudyCard
              name="RecordStops"
              url="recordstops.com"
              description="A directory helping music lovers find record stores across 5 states. 296 listings, 16 city guides, a weekly newsletter, and 683 monthly visitors — growing every month."
              techTags={['Astro', 'Supabase', 'Cloudflare']}
            />
            <CaseStudyCard
              name="SCDMV Alerts"
              url="scdmvappointments.com"
              description="Checks SC DMV appointments every 15 minutes and alerts subscribers the moment a slot opens. Three paid tiers with thousands of active users."
              techTags={['Astro', 'D1', 'Workers', 'Stripe']}
            />
            <CaseStudyCard
              name="LoveNotes"
              url="sendmylove.app"
              description="A subscription messaging service that delivers personalized messages on a schedule. Over 2,500 messages sent, with paying subscribers from the first week."
              techTags={['Next.js', 'Supabase', 'Twilio']}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="reveal bg-charcoal py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to talk about your project?</h2>
          <p className="text-gray-400 text-lg max-w-lg mx-auto mb-10">
            Tell us what challenge you are facing. We will give you an honest assessment of timeline, cost, and approach — no strings attached.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-orange hover:bg-orange-dark text-white text-lg font-semibold px-8 py-4 rounded-lg transition-colors shadow-orange-glow hover:shadow-orange-glow-lg"
          >
            Book a Free Discovery Call
          </Link>
        </div>
      </section>
    </>
  );
}

const trustItems = [
  {
    label: 'Complete Solutions',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75m11.142 0l4.179 2.25L12 17.25 2.25 12l4.179-2.25m11.142 0l4.179 2.25-9.75 5.25-9.75-5.25 4.179-2.25" />
      </svg>
    ),
  },
  {
    label: 'AI That Works',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    label: 'No Long-Term Contracts',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Founder-Led',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
];

const whyItems = [
  {
    title: 'Results in Weeks',
    description: 'Small team, proven process, no red tape. Most projects go from first meeting to finished product in 2-4 weeks.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: 'One Point of Contact',
    description: 'No account managers, no ticket queues. You talk directly to the person doing the work.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    title: 'Everything Under One Roof',
    description: 'Design, software, hosting, AI — no juggling vendors or waiting on someone else to finish their part.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75m11.142 0l4.179 2.25L12 17.25 2.25 12l4.179-2.25m11.142 0l4.179 2.25-9.75 5.25-9.75-5.25 4.179-2.25" />
      </svg>
    ),
  },
  {
    title: 'Right-Sized for Growing Companies',
    description: 'Senior-level talent without the big-agency price tag. Built for companies doing $5M-$100M that need results, not presentations.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
      </svg>
    ),
  },
];
