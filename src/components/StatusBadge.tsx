import { statusClass } from './kiln/status';

interface StatusBadgeProps {
  status: string;
}

// Kiln: one shared, warm status palette (see components/kiln/status.ts).
export default function StatusBadge({ status }: StatusBadgeProps) {
  const label = status.replace(/_/g, ' ');
  return <span className={statusClass(status)}>{label}</span>;
}
