import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const barData = [
  { month: 'Oct', projects: 1 },
  { month: 'Nov', projects: 2 },
  { month: 'Dec', projects: 3 },
  { month: 'Jan', projects: 2 },
  { month: 'Feb', projects: 4 },
  { month: 'Mar', projects: 3 },
];

const pieData = [
  { name: 'Web Apps', value: 40 },
  { name: 'AI Solutions', value: 25 },
  { name: 'Automation', value: 20 },
  { name: 'Phone Systems', value: 15 },
];

const COLORS = ['#D4632C', '#1E2A32', '#E07A4F', '#8B9DAF'];

export default function ProjectMetrics() {
  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-charcoal text-center mb-4">
          Portfolio Dashboard
        </h2>
        <p className="text-gray-500 text-center max-w-xl mx-auto mb-12">
          A snapshot of what we have been building and shipping.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-charcoal mb-1">Projects Delivered</h3>
            <p className="text-xs text-gray-400 mb-6">Last 6 months</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                />
                <Bar dataKey="projects" fill="#D4632C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-charcoal mb-1">Project Types</h3>
            <p className="text-xs text-gray-400 mb-6">By category</p>
            <div className="flex items-center justify-center gap-8">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-3">
                {pieData.map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-gray-600">{entry.name}</span>
                    <span className="font-mono text-xs text-gray-400">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
