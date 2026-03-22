import AnimatedCounter from './AnimatedCounter';

const stats = [
  { value: 10, suffix: '+', label: 'Products Built' },
  { value: 2500, suffix: '+', label: 'Messages Delivered' },
  { value: 5, suffix: '', label: 'States Covered' },
  { value: 0, suffix: '', label: 'Wasted on Overhead' },
];

export default function StatsBar() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center"
            >
              {stat.label === 'Wasted on Overhead' ? (
                <div className="flex flex-col items-center text-center">
                  <span className="text-4xl sm:text-5xl font-mono font-bold text-orange">$0</span>
                  <span className="mt-2 text-sm text-gray-500 font-medium">{stat.label}</span>
                </div>
              ) : (
                <AnimatedCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
