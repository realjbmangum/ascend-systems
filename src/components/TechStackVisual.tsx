import { motion } from 'framer-motion';

const techItems = [
  { name: 'React', angle: 0 },
  { name: 'AI', angle: 60 },
  { name: 'Cloudflare', angle: 120 },
  { name: 'Node.js', angle: 180 },
  { name: 'Stripe', angle: 240 },
  { name: 'Supabase', angle: 300 },
];

export default function TechStackVisual() {
  return (
    <section className="bg-charcoal py-20 sm:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-16">
          Our Technology Stack
        </h2>
        <div className="relative w-72 h-72 sm:w-96 sm:h-96 mx-auto">
          {/* Center mark */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-orange/10 border-2 border-orange/30 flex items-center justify-center">
              <span className="text-2xl sm:text-3xl font-bold text-orange font-mono">A</span>
            </div>
          </div>

          {/* Orbiting items */}
          {techItems.map((item, i) => {
            const radius = 130;
            const smRadius = 170;
            const radian = (item.angle * Math.PI) / 180;
            const x = Math.cos(radian);
            const y = Math.sin(radian);

            return (
              <motion.div
                key={item.name}
                className="absolute left-1/2 top-1/2"
                style={{
                  x: `calc(${x * radius}px - 50%)`,
                  y: `calc(${y * radius}px - 50%)`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3 + i * 0.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="px-4 py-2 rounded-full bg-charcoal-light border border-charcoal-lighter text-sm font-medium text-gray-300 whitespace-nowrap shadow-md"
                >
                  {item.name}
                </motion.div>
              </motion.div>
            );
          })}

          {/* Connecting lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 384 384">
            {techItems.map((item) => {
              const radian = (item.angle * Math.PI) / 180;
              const cx = 192;
              const cy = 192;
              const radius = 130;
              return (
                <line
                  key={item.name}
                  x1={cx}
                  y1={cy}
                  x2={cx + Math.cos(radian) * radius * 0.7}
                  y2={cy + Math.sin(radian) * radius * 0.7}
                  stroke="#D4632C"
                  strokeOpacity={0.15}
                  strokeWidth={1}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
