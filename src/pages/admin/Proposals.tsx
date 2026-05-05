import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import DataTable, { type Column } from '../../components/DataTable';

const statusStyles: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
};

const filters = ['all', 'draft', 'sent', 'accepted', 'declined'];

function formatMoney(cents: number) {
  return `$${((cents || 0) / 100).toFixed(2)}`;
}

export default function Proposals() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    api
      .getProposals()
      .then(setProposals)
      .catch(() => setProposals([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const base = filter === 'all' ? proposals : proposals.filter((p) => p.status === filter);
    return [...base].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [proposals, filter]);

  const columns: Column<any>[] = [
    {
      key: 'title',
      label: 'Title',
      render: (row) => <span className="font-semibold text-charcoal">{row.title}</span>,
    },
    {
      key: 'client_name',
      label: 'Client',
      render: (row) => row.client_name || <span className="text-gray-400">--</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span
          className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
            statusStyles[row.status] || 'bg-gray-100 text-gray-600'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: 'total_cents',
      label: 'Total',
      render: (row) => (
        <span className="font-semibold">{formatMoney(row.total_cents || 0)}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-charcoal">Proposals</h1>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
            aria-label="Filter by status"
          >
            {filters.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All statuses' : s}
              </option>
            ))}
          </select>
          <button
            onClick={() => navigate('/admin/proposals/create')}
            className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + New Proposal
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          onRowClick={(row) => navigate(`/admin/proposals/${row.id}`)}
          emptyMessage="No proposals yet."
        />
      )}
    </div>
  );
}
