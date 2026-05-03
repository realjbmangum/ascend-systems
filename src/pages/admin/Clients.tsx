import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import DataTable, { type Column } from '../../components/DataTable';

export default function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getClients()
      .then(setClients)
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  }, []);

  const columns: Column<any>[] = [
    { key: 'company', label: 'Company' },
    { key: 'contact_name', label: 'Contact' },
    { key: 'email', label: 'Email' },
    {
      key: 'active_projects',
      label: 'Projects',
      render: (row) => (
        <span className="text-xs font-semibold bg-surface px-2 py-1 rounded-md">
          {row.active_projects ?? 0}
        </span>
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
        <h1 className="text-2xl font-bold text-charcoal">Clients</h1>
        <button
          onClick={() => navigate('/admin/clients/create')}
          className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Create Client
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={clients}
          onRowClick={(row) => navigate(`/admin/clients/${row.id}`)}
          emptyMessage="No clients yet."
        />
      )}
    </div>
  );
}
