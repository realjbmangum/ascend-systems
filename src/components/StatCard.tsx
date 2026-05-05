interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  accent?: boolean;
  /** Optional small sub-line shown below the value (e.g. "of 29 total"). */
  sub?: string;
  /** Optional click handler to navigate. */
  onClick?: () => void;
}

export default function StatCard({ label, value, icon, accent, sub, onClick }: StatCardProps) {
  const interactive = Boolean(onClick);
  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-5 border ${accent ? 'bg-orange/5 border-orange/20' : 'bg-white border-surface-100'} ${interactive ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <svg className={`w-5 h-5 ${accent ? 'text-orange' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
        </svg>
      </div>
      <p className={`text-2xl font-bold ${accent ? 'text-orange' : 'text-charcoal'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}
