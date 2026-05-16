import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import PortfolioTimeline from '../components/PortfolioTimeline';

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

const valuesContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const valueItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const codeSnippets = [
  { text: 'const result = await build();', top: '10%', left: '-15%', rotate: '-6deg' },
  { text: 'deploy(config);', top: '65%', right: '-10%', rotate: '3deg' },
  { text: 'if (ready) ship();', bottom: '5%', left: '-5%', rotate: '4deg' },
];

export default function About() {
  return (
    <>
      <SEO
        title="About Ascend Systems | Brian Mangum | Charlotte, NC"
        description="Ascend Systems is a founder-led technology studio in Charlotte, NC. We build custom software, AI solutions, and automation for growing businesses."
      />
      {/* Hero */}
      <section className="bg-charcoal text-white py-28 sm:py-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight"
            style={{ color: '#ffffff' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            A Technology Partner You Can Actually Trust.
          </motion.h1>
          <motion.p
            className="mt-8 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.8)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Ascend Systems is a technology studio built on a simple idea: the person who understands your business should be the person building your software.
          </motion.p>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-white py-24 sm:py-32 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Photo placeholder with floating code snippets */}
            <motion.div
              className="flex justify-center md:justify-start"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                {/* Floating code snippets */}
                {codeSnippets.map((snippet, i) => (
                  <div
                    key={i}
                    className="absolute hidden md:block bg-charcoal rounded-lg px-3 py-1.5 font-mono text-[10px] text-orange-light shadow-md z-0 select-none"
                    style={{
                      top: snippet.top,
                      left: snippet.left,
                      right: snippet.right,
                      bottom: snippet.bottom,
                      transform: `rotate(${snippet.rotate})`,
                    }}
                  >
                    {snippet.text}
                  </div>
                ))}

                <div className="relative z-10 p-1 bg-gradient-to-br from-orange to-orange-dark rounded-2xl shadow-lg">
                  <div className="w-[280px] h-[280px] rounded-2xl bg-charcoal-light flex items-center justify-center overflow-hidden">
                    <img
                      src="/images/brian.png"
                      alt="Brian Mangum, Founder of Ascend Systems"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Photo not yet uploaded — fall back to Ascend logo as visual anchor.
                        const img = e.currentTarget as HTMLImageElement;
                        img.src = '/images/logo.png';
                        img.alt = 'Ascend Systems';
                        img.className = 'w-full h-full object-contain opacity-90 p-12';
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-charcoal mb-8">
                Meet the Founder
              </h2>
              <div className="space-y-5 text-charcoal-lighter leading-relaxed text-lg">
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio Timeline */}
      <PortfolioTimeline />

      {/* Values */}
      <section className="bg-surface py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl sm:text-5xl font-bold text-charcoal text-center mb-16 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How We Work
          </motion.h2>
          <motion.div
            className="grid sm:grid-cols-2 gap-8"
            variants={valuesContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                className="bg-white rounded-xl shadow-sm border-l-4 border-orange p-8"
                variants={valueItem}
              >
                <h3 className="text-xl font-semibold text-charcoal mb-3">
                  {v.title}
                </h3>
                <p className="text-charcoal-lighter leading-relaxed">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech Philosophy */}
      <section className="bg-white py-24 sm:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl sm:text-5xl font-bold text-charcoal mb-10 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our Approach to Technology
          </motion.h2>
          <div className="space-y-6 text-charcoal-lighter leading-relaxed text-lg">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              We choose tools based on what solves your problem, not what
              is trendy. The best technology is the one that gets your
              project done on time and keeps it running reliably.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              We use modern, proven platforms that are cost-effective to
              maintain. We also know when and where AI can deliver real
              value for your business — and when it is just a distraction.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              We believe in getting a working version into your hands quickly.
              Real feedback from real customers teaches you more than months
              of planning ever will.
            </motion.p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-charcoal py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight text-center mx-auto max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Skip the sales process. Talk to the person who does the work.
          </motion.h2>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-center">
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
