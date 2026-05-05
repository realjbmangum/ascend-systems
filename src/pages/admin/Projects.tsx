import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import DataTable, { type Column } from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import ProjectsKanban from './ProjectsKanban';

type ViewMode = 'list' | 'kanban';

const statuses = ['all', 'planning', 'scoping', 'in_progress', 'on_hold', 'completed', 'cancelled'];
const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'name_asc', label: 'Name A-Z' },
  { value: 'status', label: 'Status' },
];

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'kanban';
    return (window.localStorage.getItem('projects.view') as ViewMode) || 'kanban';
  });
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    api
      .getProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('projects.view', view);
    }
  }, [view]);

  const handleMove = async (projectId: number, newStatus: string) => {
    const original = projects;
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
    );
    try {
      await api.updateProject(projectId, { status: newStatus });
    } catch (err) {
      setProjects(original);
      alert('Failed to update status. ' + (err as Error).message);
    }
  };

  const visible = useMemo(() => {
    const filtered = filter === 'all' ? projects : projects.filter((p) => p.status === filter);
    const arr = [...filtered];
    switch (sort) {
      case 'name_asc':
        return arr.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'status':
        return arr.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
      case 'newest':
      default:
        return arr.sort(
          (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
    }
  }, [projects, filter, sort]);

  const columns: Column<any>[] = [
    { key: 'name', label: 'Project', sortable: true, filterable: true },
    { key: 'client_name', label: 'Client', sortable: true, filterable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    { key: 'project_type', label: 'Type', sortable: true, filterable: true },
    {
      key: 'analytics_domain',
      label: 'Domain',
      sortable: true,
      filterable: true,
      render: (row) =>
        row.analytics_domain ? (
          <a
            href={`https://${row.analytics_domain}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-orange hover:text-orange-dark text-xs"
          >
            {row.analytics_domain}
          </a>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        ),
    },
    {
      key: 'start_date',
      label: 'Start Date',
      sortable: true,
      render: (row) => row.start_date ? new Date(row.start_date).toLocaleDateString() : '--',
    },
  ];

  const toggleBtn = (mode: ViewMode, label: string, icon: React.ReactNode) => {
    const active = view === mode;
    return (
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        onClick={() => setView(mode)}
        className={`p-2 rounded-lg border transition-colors ${
          active
            ? 'bg-orange border-orange text-white'
            : 'bg-white border-gray-200 text-gray-500 hover:text-charcoal hover:border-gray-300'
        }`}
      >
        {icon}
      </button>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-charcoal">Projects</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-1">
            {toggleBtn(
              'list',
              'List view',
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="4" x2="13" y2="4" />
                <line x1="3" y1="8" x2="13" y2="8" />
                <line x1="3" y1="12" x2="13" y2="12" />
              </svg>
            )}
            {toggleBtn(
              'kanban',
              'Kanban view',
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2.5" y="2.5" width="4" height="4" rx="0.5" />
                <rect x="9.5" y="2.5" width="4" height="4" rx="0.5" />
                <rect x="2.5" y="9.5" width="4" height="4" rx="0.5" />
                <rect x="9.5" y="9.5" width="4" height="4" rx="0.5" />
              </svg>
            )}
          </div>
          {view === 'list' && (
            <>
              <label htmlFor="project-filter" className="sr-only">Filter by status</label>
              <select
                id="project-filter"
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
              <label htmlFor="project-sort" className="sr-only">Sort projects</label>
              <select
                id="project-sort"
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
            onClick={() => navigate('/admin/projects/create')}
            className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Create Project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : view === 'kanban' ? (
        <ProjectsKanban projects={projects} onMove={handleMove} />
      ) : (
        <DataTable
          columns={columns}
          rows={visible}
          onRowClick={(row) => navigate(`/admin/projects/${row.id}`)}
          emptyMessage="No projects yet."
        />
      )}
    </div>
  );
}
