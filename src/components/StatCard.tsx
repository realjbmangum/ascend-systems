interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  accent?: boolean;
  /** Optional small sub-line shown below the value (e.g. "of 29 total"). */
  sub?: string;
  /** Optional click handler to navigate. */
  onClick?: () => void;
  /** Threshold status — colors the value + a status dot. */
  tone?: 'good' | 'warn' | 'bad';
  /** Persistent one-line "what this means" helper, shown muted at the bottom. */
  hint?: string;
}

const TONE = {
  good: { text: 'text-green-600', dot: 'bg-green-500' },
  warn: { text: 'text-amber-600', dot: 'bg-amber-500' },
  bad: { text: 'text-red-600', dot: 'bg-red-500' },
} as const;

export default function StatCard({ label, value, icon, accent, sub, onClick, tone, hint }: StatCardProps) {
  const interactive = Boolean(onClick);
  const t = tone ? TONE[tone] : null;
  const valueColor = t ? t.text : accent ? 'text-orange' : 'text-charcoal';
  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-5 border ${accent && !t ? 'bg-orange/5 border-orange/20' : 'bg-white border-surface-100'} ${interactive ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
          {t && <span className={`w-2 h-2 rounded-full ${t.dot}`} aria-hidden="true" />}
          {label}
        </span>
        <svg className={`w-5 h-5 ${accent ? 'text-orange' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
        </svg>
      </div>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
      {hint && <p className="text-[11px] text-gray-400 mt-2 leading-snug border-t border-surface-100 pt-2">{hint}</p>}
    </div>
  );
}
