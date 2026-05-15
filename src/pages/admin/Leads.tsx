import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import DataTable, { type Column } from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import LeadsKanban from './LeadsKanban';

type ViewMode = 'list' | 'kanban';

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
  const [view, setView] = useState<ViewMode>(
    () => (window.localStorage.getItem('leads.view') as ViewMode) || 'kanban'
  );

  useEffect(() => {
    window.localStorage.setItem('leads.view', view);
  }, [view]);

  // Kanban shows every stage as a column, so it always loads all leads;
  // the status filter only applies to the list view.
  useEffect(() => {
    setLoading(true);
    const statusArg = view === 'kanban' || filter === 'all' ? undefined : filter;
    api
      .getLeads(statusArg)
      .then(setLeads)
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, [filter, view]);

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

  async function moveLead(leadId: number, newStatus: string) {
    // Capture the pre-move state inside the updater so concurrent drags
    // each roll back to the correct snapshot.
    let snapshot: any[] = [];
    setLeads((cur) => {
      snapshot = cur;
      return cur.map((l) =>
        l.id === leadId ? { ...l, status: newStatus } : l
      );
    });
    try {
      await api.updateLead(leadId, { status: newStatus });
    } catch {
      setLeads(snapshot);
    }
  }

  const columns: Column<any>[] = [
    { key: 'name', label: 'Name', sortable: true, filterable: true },
    { key: 'company', label: 'Company', sortable: true, filterable: true },
    { key: 'email', label: 'Email', sortable: true, filterable: true },
    { key: 'project_type', label: 'Type', sortable: true, filterable: true },
    {
      key: 'deal_value_cents',
      label: 'Value',
      sortable: true,
      render: (row) =>
        row.deal_value_cents
          ? `$${(row.deal_value_cents / 100).toLocaleString()}`
          : <span className="text-gray-400">--</span>,
    },
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
          {/* View toggle */}
          <div className="flex items-center border border-surface-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('list')}
              aria-pressed={view === 'list'}
              title="List view"
              className={`px-3 py-2 text-sm font-semibold transition-colors ${
                view === 'list'
                  ? 'bg-orange text-white'
                  : 'bg-white text-charcoal hover:bg-surface'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('kanban')}
              aria-pressed={view === 'kanban'}
              title="Pipeline view"
              className={`px-3 py-2 text-sm font-semibold transition-colors ${
                view === 'kanban'
                  ? 'bg-orange text-white'
                  : 'bg-white text-charcoal hover:bg-surface'
              }`}
            >
              Pipeline
            </button>
          </div>

          {view === 'list' && (
            <>
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
            </>
          )}
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
      ) : view === 'kanban' ? (
        <LeadsKanban
          leads={leads}
          onMove={moveLead}
          onClick={(lead) => navigate(`/admin/leads/${lead.id}`)}
        />
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
