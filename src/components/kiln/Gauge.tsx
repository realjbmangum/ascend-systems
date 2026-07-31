import { useId } from "react";

/**
 * Kiln Gauge — hand-rolled half-circle SVG, tuned to Ascend brand tokens.
 * Track arc + burnt-orange gradient value arc + ticks + needle. Geometry
 * derives from the radius. Accessible: role="img" + <title>. Colors via CSS
 * vars so it inherits the `.admin-kiln` scoped palette.
 */

interface GaugeProps {
  total: number;
  spent: number;
  remaining: number;
  format?: (n: number) => string;
  totalLabel?: string;
  spentLabel?: string;
  remainingLabel?: string;
}

export default function Gauge({
  total,
  spent,
  remaining,
  format = (n) => `$${n.toLocaleString()}`,
  totalLabel = "Total Billed",
  spentLabel = "Collected",
  remainingLabel = "Outstanding",
}: GaugeProps) {
  const gid = useId();
  const r = 90;
  const cx = 110;
  const cy = 110;
  const pct = total > 0 ? Math.min(1, Math.max(0, spent / total)) : 0;
  const ang = 180 * pct;

  const xy = (deg: number, rad: number) => ({
    x: cx + rad * Math.cos(Math.PI - (deg * Math.PI) / 180),
    y: cy - rad * Math.sin(Math.PI - (deg * Math.PI) / 180),
  });

  const s = xy(0, r);
  const m = xy(180, r);
  const e = xy(ang, r);
  const needle = xy(ang, r - 22);
  const large = ang > 180 ? 1 : 0;
  const ticks = Array.from({ length: 9 }, (_, i) => {
    const d = i * 22.5;
    return { a: xy(d, r - 12), b: xy(d, r + 2), key: i };
  });

  const title = `${spentLabel} ${format(spent)} of ${totalLabel} ${format(total)} — ${remainingLabel} ${format(remaining)}`;
  const readouts: Array<[string, number]> = [
    [totalLabel, total],
    [spentLabel, spent],
    [remainingLabel, remaining],
  ];

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 220 130" width="100%" height={150} role="img" aria-label={title}>
        <title>{title}</title>
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-orange-dark)" />
            <stop offset="100%" stopColor="var(--color-orange)" />
          </linearGradient>
        </defs>
        <path
          d={`M ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${m.x} ${m.y}`}
          fill="none"
          stroke="var(--color-surface-200)"
          strokeWidth={12}
          strokeLinecap="round"
        />
        <path
          d={`M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth={12}
          strokeLinecap="round"
        />
        {ticks.map((t) => (
          <line
            key={t.key}
            x1={t.a.x}
            y1={t.a.y}
            x2={t.b.x}
            y2={t.b.y}
            stroke="var(--color-gray-400)"
            strokeWidth={1.5}
          />
        ))}
        <line
          x1={cx}
          y1={cy}
          x2={needle.x}
          y2={needle.y}
          stroke="var(--color-charcoal)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={6} fill="var(--color-charcoal)" />
        <circle cx={cx} cy={cy} r={2.5} fill="#fff" />
      </svg>
      <div className="flex justify-between w-full mt-2 px-2 text-xs text-gray-500">
        {readouts.map(([lbl, val]) => (
          <div key={lbl}>
            <div>{lbl}</div>
            <div className="font-semibold text-charcoal tabular-nums">{format(val)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
