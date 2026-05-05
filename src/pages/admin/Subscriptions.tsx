import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import DataTable, { type Column } from '../../components/DataTable';

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  trialing: 'bg-blue-100 text-blue-700',
  incomplete: 'bg-yellow-100 text-yellow-700',
  incomplete_expired: 'bg-gray-100 text-gray-600',
  past_due: 'bg-red-100 text-red-700',
  canceled: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-gray-100 text-gray-500',
  unpaid: 'bg-red-100 text-red-700',
};

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function intervalLabel(interval: string) {
  switch (interval) {
    case 'week':
      return 'Weekly';
    case 'month':
      return 'Monthly';
    case 'year':
      return 'Annually';
    default:
      return interval || '--';
  }
}

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .getSubscriptions()
      .then((rows) => setSubscriptions(Array.isArray(rows) ? rows : []))
      .catch((e: any) => setError(e?.message || 'Failed to load subscriptions'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        'Cancel this subscription? This will stop future billing in Stripe.'
      )
    ) {
      return;
    }
    try {
      await api.deleteSubscription(id);
      load();
    } catch (e: any) {
      setError(e?.message || 'Failed to cancel subscription');
    }
  };

  const columns: Column<any>[] = [
    {
      key: 'client_name',
      label: 'Client',
      render: (row) => (
        <Link
          to={`/admin/clients/${row.client_id}`}
          className="text-charcoal hover:text-orange font-medium"
        >
          {row.client_name || `Client #${row.client_id}`}
        </Link>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => (
        <span className="text-charcoal">
          {row.description || <span className="text-gray-400">--</span>}
        </span>
      ),
    },
    {
      key: 'amount_cents',
      label: 'Amount',
      render: (row) => (
        <span className="font-semibold">{formatMoney(row.amount_cents || 0)}</span>
      ),
    },
    {
      key: 'interval',
      label: 'Interval',
      render: (row) => intervalLabel(row.interval),
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
          {row.status || 'unknown'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString() : '--',
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(row.id);
          }}
          className="text-red-500 hover:text-red-700 text-sm font-semibold"
        >
          Cancel
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Subscriptions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Recurring billing in Stripe. Create subscriptions by setting an
            invoice to <em>Recurring</em> and pushing it.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={subscriptions}
          emptyMessage="No subscriptions yet. Push a recurring invoice to create one."
        />
      )}
    </div>
  );
}
