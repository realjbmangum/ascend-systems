import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import DataTable, { type Column } from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';

const statuses = ['all', 'new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'];
const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name_asc', label: 'Name A-Z' },
  { value: 'name_desc', label: 'Name Z-A' },
];

export default function Leads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getLeads(filter === 'all' ? undefined : filter)
      .then(setLeads)
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const sorted = useMemo(() => {
    const arr = [...leads];
    switch (sort) {
      case 'oldest':
        return arr.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case 'name_asc':
        return arr.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'name_desc':
        return arr.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      case 'newest':
      default:
        return arr.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  }, [leads, sort]);

  const columns: Column<any>[] = [
    { key: 'name', label: 'Name', sortable: true, filterable: true },
    { key: 'company', label: 'Company', sortable: true, filterable: true },
    { key: 'email', label: 'Email', sortable: true, filterable: true },
    { key: 'project_type', label: 'Type', sortable: true, filterable: true },
    { key: 'budget', label: 'Budget', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-charcoal">Leads</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="lead-filter" className="sr-only">Filter by status</label>
          <select
            id="lead-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All statuses' : s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          <label htmlFor="lead-sort" className="sr-only">Sort leads</label>
          <select
            id="lead-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => navigate('/admin/leads/create')}
            className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Create Lead
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
          rows={sorted}
          onRowClick={(row) => navigate(`/admin/leads/${row.id}`)}
          emptyMessage="No leads match this filter."
        />
      )}
    </div>
  );
}
