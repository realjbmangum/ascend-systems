import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import DataTable, { type Column } from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const columns: Column<any>[] = [
    { key: 'name', label: 'Project' },
    { key: 'client_name', label: 'Client' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    { key: 'project_type', label: 'Type' },
    {
      key: 'start_date',
      label: 'Start Date',
      render: (row) => row.start_date ? new Date(row.start_date).toLocaleDateString() : '--',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-charcoal">Projects</h1>
        <button
          onClick={() => navigate('/admin/projects/create')}
          className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Create Project
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={projects}
          onRowClick={(row) => navigate(`/admin/projects/${row.id}`)}
          emptyMessage="No projects yet."
        />
      )}
    </div>
  );
}
