import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const values = [
  {
    title: 'Working Software Every Week',
    description: 'You see real progress in days, not a status update that says "on track." If it\'s not working, we know before you do.',
  },
  {
    title: 'Build Only What Matters',
    description: 'No features you didn\'t ask for. No architecture astronaut decisions. Every line of code earns its place.',
  },
  {
    title: 'Direct Access to the Engineer',
    description: 'No account managers. No ticket queues. You message the person writing the code and get an answer the same day.',
  },
  {
    title: 'Senior Engineering, Mid-Market Pricing',
    description: 'The same quality of work a $500/hr agency delivers — at a price that makes sense for companies that count their dollars.',
  },
];

export default function About() {
  return (
    <>
      <SEO
        title="About Ascend Systems | Brian Mangum, Software Engineer | Charlotte NC"
        description="Ascend Systems is a founder-led software studio in Charlotte, NC. Brian Mangum builds custom software, AI integrations, and automation for mid-market companies."
      />
      {/* Hero */}
      <section className="reveal bg-charcoal text-white py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            One Engineer. Ten Production Products. Zero Excuses.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-surface-200 max-w-2xl mx-auto">
            Ascend Systems is a software studio built on a simple idea: the person who understands your business should be the person writing the code.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="reveal bg-white py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Photo placeholder */}
            <div className="flex justify-center md:justify-start">
              <div className="w-[280px] h-[280px] rounded-2xl bg-charcoal-light flex items-center justify-center">
                <span className="text-4xl font-bold text-orange">BM</span>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-6">
                Meet the Founder
              </h2>
              <div className="space-y-4 text-charcoal-lighter leading-relaxed">
                <p>
                  I'm Brian Mangum — a software engineer based in Charlotte, NC.
                  I started Ascend Systems because I watched too many companies
                  spend six figures on agencies and get mediocre results.
                </p>
                <p>
                  In the past year, I've shipped 10+ production products —
                  directory platforms, monitoring SaaS, messaging apps, AI phone
                  systems. Real products with real users paying real money. I
                  build with React, Astro, Cloudflare, and AI APIs, and I move
                  fast because there's no one between me and the code.
                </p>
                <p>
                  When you hire Ascend, you don't get a project manager who
                  relays your requirements to a team you'll never meet. You get
                  me — the person who scopes it, writes the code, and deploys it.
                </p>
              </div>

              {/* Location badge */}
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-charcoal bg-surface rounded-full px-4 py-2">
                <svg
                  className="w-4 h-4 text-orange"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                Charlotte, NC
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="reveal bg-surface py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal text-center mb-14">
            How We Work
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-xl shadow-sm border-l-4 border-orange p-6"
              >
                <h3 className="text-lg font-semibold text-charcoal mb-2">
                  {v.title}
                </h3>
                <p className="text-charcoal-lighter leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Philosophy */}
      <section className="reveal bg-white py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-8">
            Our Take on Technology
          </h2>
          <div className="space-y-5 text-charcoal-lighter leading-relaxed">
            <p>
              We pick tools based on what solves your problem, not what's
              trending on Hacker News. The "best" technology is the one that
              ships your product on time and keeps it running at 3 AM.
            </p>
            <p>
              Our default stack is modern, battle-tested, and cheap to run:
              React or Astro for frontends, Cloudflare for infrastructure, and
              AI where it delivers measurable value. But if your problem calls
              for something else, we'll use that instead.
            </p>
            <p>
              We believe in shipping first and refactoring later. A working MVP
              in your customers' hands teaches you more than six months of
              architecture planning ever will.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="reveal bg-charcoal py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Skip the sales process. Talk to the engineer.
          </h2>
          <p className="text-gray-400 text-lg max-w-lg mx-auto mb-8">
            30 minutes, no pitch deck, no pressure. Just a conversation about what you need and whether we're the right fit.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-orange hover:bg-orange-dark text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
          >
            Book a Free Discovery Call
          </Link>
        </div>
      </section>
    </>
  );
}
