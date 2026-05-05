import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import DataTable, { type Column } from '../../components/DataTable';

const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'name_asc', label: 'Name A-Z' },
  { value: 'most_projects', label: 'Most projects' },
];

export default function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getClients()
      .then(setClients)
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(() => {
    const arr = [...clients];
    switch (sort) {
      case 'name_asc':
        return arr.sort((a, b) =>
          (a.company || a.contact_name || '').localeCompare(b.company || b.contact_name || '')
        );
      case 'most_projects':
        return arr.sort((a, b) => (b.active_projects ?? 0) - (a.active_projects ?? 0));
      case 'newest':
      default:
        return arr.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  }, [clients, sort]);

  const columns: Column<any>[] = [
    {
      key: 'company_name',
      label: 'Company',
      sortable: true,
      filterable: true,
      render: (row) => row.company_name || row.company || '—',
    },
    { key: 'contact_name', label: 'Contact', sortable: true, filterable: true },
    { key: 'email', label: 'Email', sortable: true, filterable: true },
    {
      key: 'website_url',
      label: 'Website',
      render: (row) =>
        row.website_url ? (
          <a
            href={row.website_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-orange hover:text-orange-dark text-xs"
          >
            {row.website_url.replace(/^https?:\/\//, '')}
          </a>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        ),
    },
    {
      key: 'project_count',
      label: 'Projects',
      sortable: true,
      sortValue: (row) => row.project_count ?? 0,
      render: (row) => (
        <span className="text-xs font-semibold bg-surface px-2 py-1 rounded-md">
          {row.project_count ?? 0}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-charcoal">Clients</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="client-sort" className="sr-only">Sort clients</label>
          <select
            id="client-sort"
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
            onClick={() => navigate('/admin/clients/create')}
            className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Create Client
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
          onRowClick={(row) => navigate(`/admin/clients/${row.id}`)}
          emptyMessage="No clients yet."
        />
      )}
    </div>
  );
}
