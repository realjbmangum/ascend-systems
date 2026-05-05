interface DailyDatum {
  date: string;
  pageviews: number;
  visitors: number;
}

interface AnalyticsSparklineProps {
  daily: DailyDatum[];
  metric?: 'pageviews' | 'visitors';
  height?: number;
}

export default function AnalyticsSparkline({
  daily,
  metric = 'pageviews',
  height = 40,
}: AnalyticsSparklineProps) {
  if (!daily.length) {
    return (
      <div
        className="text-xs text-gray-400"
        style={{ height }}
      >
        No data
      </div>
    );
  }
  const values = daily.map((d) => d[metric]);
  const max = Math.max(...values, 1);
  const width = 200;
  const stepX = width / Math.max(daily.length - 1, 1);

  const points = daily
    .map((d, i) => {
      const x = i * stepX;
      const y = height - (d[metric] / max) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  const lastVal = values[values.length - 1];
  const peak = max;

  return (
    <div className="flex items-center gap-3">
      <svg width={width} height={height} className="flex-shrink-0">
        <polyline
          fill="none"
          stroke="#C45A2C"
          strokeWidth="1.5"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="text-xs text-gray-500">
        <div>Peak {peak.toLocaleString()}</div>
        <div>Last {lastVal.toLocaleString()}</div>
      </div>
    </div>
  );
}
