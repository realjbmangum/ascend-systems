import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const steps = [
  {
    num: '1',
    label: 'Pick the bottleneck',
    detail: 'Choose the manual process eating your team\'s time.',
  },
  {
    num: '2',
    label: 'Enter four numbers',
    detail: 'Hours per week, hourly cost, error rate, customer impact.',
  },
  {
    num: '3',
    label: 'Get your report',
    detail: 'Annual waste, build cost range, payback in months — emailed to you.',
  },
];

export default function CalculatorCTASection() {
  return (
    <section className="bg-charcoal py-24 sm:py-32 border-t border-charcoal-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: pitch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-orange mb-5">
              Free tool
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05]">
              How much is your manual work costing you?
            </h2>
            <p className="mt-6 text-lg sm:text-xl text-gray-300 leading-relaxed max-w-xl">
              Four numbers, one honest answer. Free, branded report emailed
              in 60 seconds — no sales call required.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/tools/cost-calculator"
                className="inline-flex items-center gap-2 bg-orange hover:bg-orange-dark text-white text-base font-semibold px-7 py-4 rounded-lg transition-colors"
              >
                Try the Cost Calculator <span aria-hidden>→</span>
              </Link>
            </div>
          </motion.div>

          {/* Right: 3-step preview card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-charcoal-light/60 border border-white/10 rounded-2xl p-8 sm:p-10 backdrop-blur-sm"
          >
            <p className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-orange mb-6">
              How it works
            </p>
            <ol className="space-y-6">
              {steps.map((s) => (
                <li key={s.num} className="flex items-start gap-4">
                  <span className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-orange text-white text-sm font-bold">
                    {s.num}
                  </span>
                  <div>
                    <div className="text-white font-semibold text-base">
                      {s.label}
                    </div>
                    <div className="text-sm text-gray-400 mt-1 leading-relaxed">
                      {s.detail}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-gray-500">
              Avg. completion time: 60 seconds. No login. No spam.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
