import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const chartData = [
  { v: 20 }, { v: 45 }, { v: 35 }, { v: 60 }, { v: 50 }, { v: 75 }, { v: 65 }, { v: 80 }, { v: 70 }, { v: 90 },
];

const statColors = ['bg-orange/20', 'bg-blue-200/60', 'bg-green-200/60', 'bg-orange-glow'];

export default function MockDashboard() {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden">
      {/* Fake nav bar */}
      <div className="h-7 bg-charcoal flex items-center gap-1.5 px-3">
        <span className="w-2 h-2 rounded-full bg-red-400" />
        <span className="w-2 h-2 rounded-full bg-yellow-400" />
        <span className="w-2 h-2 rounded-full bg-green-400" />
      </div>

      <div className="p-4 space-y-3">
        {/* Stat cards grid */}
        <div className="grid grid-cols-2 gap-2">
          {statColors.map((bg, i) => (
            <div key={i} className={`${bg} rounded-lg h-10 flex items-center px-2`}>
              <div className="space-y-1 w-full">
                <div className="h-1.5 w-8 bg-gray-400/30 rounded" />
                <div className="h-2.5 w-12 bg-charcoal/20 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Fake chart */}
        <div className="h-28 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="mockGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4632C" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#D4632C" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="#D4632C"
                strokeWidth={2}
                fill="url(#mockGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
