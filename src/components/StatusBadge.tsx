const statusStyles: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-purple-100 text-purple-700',
  proposal_sent: 'bg-orange-glow text-orange-dark',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  on_hold: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  planning: 'bg-purple-100 text-purple-700',
  in_progress: 'bg-orange-glow text-orange-dark',
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-600';
  const label = status.replace(/_/g, ' ');
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${style}`}>
      {label}
    </span>
  );
}
