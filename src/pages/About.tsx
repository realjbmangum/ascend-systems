import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const values = [
  {
    title: 'Real Progress Every Week',
    description: 'You see working results in days, not a status update that says "on track." If something is off, we catch it before you do.',
  },
  {
    title: 'We Build Only What You Need',
    description: 'No extras you did not ask for. No overcomplicating things. Every dollar you spend goes toward solving your actual problem.',
  },
  {
    title: 'We Give You Straight Answers',
    description: 'No account managers. No ticket queues. You message the person doing the work and get an answer the same day.',
  },
  {
    title: 'Big-Agency Quality, Fair Pricing',
    description: 'The same caliber of work a $500/hr agency delivers — at a price that makes sense for companies that count their dollars.',
  },
];

export default function About() {
  return (
    <>
      <SEO
        title="About Ascend Systems | Brian Mangum | Charlotte, NC"
        description="Ascend Systems is a founder-led technology studio in Charlotte, NC. We build custom software, AI solutions, and automation for growing businesses."
      />
      {/* Hero */}
      <section className="reveal bg-charcoal text-white py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            A Technology Partner You Can Actually Trust.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-surface-200 max-w-2xl mx-auto">
            Ascend Systems is a technology studio built on a simple idea: the person who understands your business should be the person building your software.
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
                  I'm Brian Mangum — a software professional based in Charlotte, NC.
                  I started Ascend Systems because I watched too many companies
                  spend six figures on agencies and get mediocre results.
                </p>
                <p>
                  In the past year, I have built and launched over 10 products that
                  real people use and pay for — business directories, monitoring
                  services, messaging platforms, and AI phone systems. I work
                  quickly because there is no one between you and me.
                </p>
                <p>
                  When you hire Ascend, you do not get an account manager who
                  passes your ideas to a team you will never meet. You get
                  me — the person who plans it, builds it, and stands behind it.
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
            Our Approach to Technology
          </h2>
          <div className="space-y-5 text-charcoal-lighter leading-relaxed">
            <p>
              We choose tools based on what solves your problem, not what
              is trendy. The best technology is the one that gets your
              project done on time and keeps it running reliably.
            </p>
            <p>
              We use modern, proven platforms that are cost-effective to
              maintain. We also know when and where AI can deliver real
              value for your business — and when it is just a distraction.
            </p>
            <p>
              We believe in getting a working version into your hands quickly.
              Real feedback from real customers teaches you more than months
              of planning ever will.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="reveal bg-charcoal py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Skip the sales process. Talk to the person who does the work.
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
