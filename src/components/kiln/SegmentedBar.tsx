/**
 * Kiln SegmentedBar — the barcode/tick motif, tuned to Ascend brand tokens.
 * Fills `round(value/max * segments)` ticks. Charcoal by default; "orange"
 * ramps light -> deep ember. Colors come from CSS vars so the component
 * inherits the `.admin-kiln` scoped palette. See context/design-system/kiln.
 */

const INK = "var(--color-charcoal)";
const TRACK = "var(--color-surface-100)";

function lerp(aHex: string, bHex: string, t: number): string {
  const a = aHex.replace("#", "").match(/\w\w/g)!.map((h) => parseInt(h, 16));
  const b = bHex.replace("#", "").match(/\w\w/g)!.map((h) => parseInt(h, 16));
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

interface SegmentedBarProps {
  value: number;
  max: number;
  segments?: number;
  height?: number;
  variant?: "default" | "orange" | "muted";
  label?: string;
}

export default function SegmentedBar({
  value,
  max,
  segments = 24,
  height = 8,
  variant = "default",
  label,
}: SegmentedBarProps) {
  const pct = max > 0 ? value / max : 0;
  const filled = Math.round(pct * segments);
  const fillColor =
    variant === "muted" ? "var(--color-gray-400)" : INK;

  return (
    <div
      className="flex w-full"
      style={{ gap: 3, height }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    >
      {Array.from({ length: segments }, (_, i) => {
        let background = TRACK;
        if (i < filled) {
          if (variant === "orange") {
            const t = filled <= 1 ? 1 : i / (filled - 1);
            background = lerp("#F0C4A8", "#B85328", t);
          } else {
            background = fillColor;
          }
        }
        return (
          <div key={i} className="flex-1" style={{ borderRadius: 1, background }} />
        );
      })}
    </div>
  );
}
