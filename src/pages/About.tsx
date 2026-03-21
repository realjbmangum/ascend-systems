import { Link } from 'react-router-dom';

const values = [
  {
    title: 'Ship Fast, Iterate Often',
    description: 'Weeks, not quarters. You see working software early and often.',
  },
  {
    title: 'No Bloat, No Fluff',
    description: 'We build what you need. Nothing more, nothing less.',
  },
  {
    title: 'Work With the Builder',
    description:
      'No layers. No handoffs. Direct access to the person writing the code.',
  },
  {
    title: 'Right-Sized Solutions',
    description:
      'Enterprise-grade engineering without the enterprise price tag or timeline.',
  },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="reveal bg-charcoal text-white py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Built by a Builder
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-surface-200 max-w-2xl mx-auto">
            Ascend Systems is a one-person software studio that punches above
            its weight.
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
                  I'm Brian Mangum — software engineer, founder of Lighthouse 27
                  LLC, and the person who will actually build your project.
                </p>
                <p>
                  I've shipped 10+ production products in the last year alone —
                  from directory platforms and monitoring SaaS to messaging apps
                  and AI phone systems. I work with modern tools (React, Astro,
                  Cloudflare, AI APIs) and I move fast.
                </p>
                <p>
                  When you work with Ascend, you're not getting a project manager
                  who relays messages to offshore developers. You're getting the
                  engineer — directly.
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
            What We Stand For
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-8">
            How We Think About Technology
          </h2>
          <div className="space-y-5 text-charcoal-lighter leading-relaxed">
            <p>
              We're pragmatic engineers, not technology evangelists. The right
              tool depends on the problem — not on what's trending on Hacker
              News.
            </p>
            <p>
              Our default stack is modern, battle-tested, and cost-effective:
              React or Astro for frontends, Cloudflare for infrastructure, and AI
              where it actually adds value. But we'll use whatever gets you to
              market fastest.
            </p>
            <p>
              Speed to market matters more than architectural perfection. We ship
              MVPs that work, then iterate based on real user feedback.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="reveal bg-charcoal py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to work with a builder?
          </h2>
          <Link
            to="/contact"
            className="inline-block bg-orange hover:bg-orange-dark text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
          >
            Let's Talk
          </Link>
        </div>
      </section>
    </>
  );
}
