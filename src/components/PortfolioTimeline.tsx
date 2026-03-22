import { motion } from 'framer-motion';

const projects = [
  { name: 'RecordStops', desc: 'Vinyl record store directory across 5 states', date: 'Jan 2025' },
  { name: 'SCDMV Alerts', desc: 'Real-time DMV appointment monitoring service', date: 'Feb 2025' },
  { name: 'National Parks Directory', desc: 'Comprehensive guide to 63 US national parks', date: 'Mar 2025' },
  { name: 'LoveNotes', desc: 'Scheduled message delivery subscription platform', date: 'Jun 2025' },
  { name: 'Potty Directory', desc: 'Public restroom finder with 1,400+ listings', date: 'Aug 2025' },
  { name: 'Camping Native', desc: 'Camping gear reviews and outdoor content hub', date: 'Oct 2025' },
  { name: 'Pet Health Decoder', desc: 'Pet health education and symptom guides', date: 'Dec 2025' },
  { name: 'CLT EV Dashboard', desc: 'Charlotte EV charging station analytics dashboard', date: 'Mar 2026' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export default function PortfolioTimeline() {
  return (
    <section className="bg-charcoal py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          What We've Built
        </motion.h2>

        <motion.div
          className="relative"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-orange/40 md:-translate-x-px" />

          {projects.map((p, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={p.name}
                variants={item}
                className={`relative flex items-start mb-10 last:mb-0 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-orange rounded-full -translate-x-1/2 mt-1.5 z-10 ring-4 ring-charcoal" />

                {/* Content - always right on mobile, alternating on desktop */}
                <div
                  className={`ml-10 md:ml-0 md:w-1/2 ${
                    isLeft ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left'
                  }`}
                >
                  <p className="text-xs font-mono text-orange-light mb-1">{p.date}</p>
                  <h3 className="text-lg font-bold text-white">{p.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
