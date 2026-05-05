import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import DataTable, { type Column } from '../../components/DataTable';

const statusStyles: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  void: 'bg-gray-100 text-gray-500',
  refunded: 'bg-purple-100 text-purple-700',
};

const filters = ['all', 'draft', 'sent', 'paid', 'overdue'];
const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'amount_desc', label: 'Amount: High to Low' },
  { value: 'amount_asc', label: 'Amount: Low to High' },
  { value: 'due_soonest', label: 'Due date: Soonest' },
];

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

interface LineItem {
  description: string;
  quantity: number;
  unit_price_cents: number;
}

export default function Invoices() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [showCreate, setShowCreate] = useState(false);

  // Create form state
  const [clientId, setClientId] = useState<string>('');
  const [projectId, setProjectId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [billingType, setBillingType] = useState<'one_time' | 'recurring'>('one_time');
  const [recurringInterval, setRecurringInterval] = useState<'month' | 'year' | 'week'>('month');
  const [items, setItems] = useState<LineItem[]>([{ description: '', quantity: 1, unit_price_cents: 0 }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .getInvoices()
      .then(setInvoices)
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!showCreate) return;
    api.getClients().then(setClients).catch(() => setClients([]));
    api.getProjects().then(setProjects).catch(() => setProjects([]));
  }, [showCreate]);

  const filtered = useMemo(() => {
    const base = filter === 'all' ? invoices : invoices.filter((i) => i.status === filter);
    const arr = [...base];
    switch (sort) {
      case 'amount_desc':
        return arr.sort((a, b) => (b.amount_cents || 0) - (a.amount_cents || 0));
      case 'amount_asc':
        return arr.sort((a, b) => (a.amount_cents || 0) - (b.amount_cents || 0));
      case 'due_soonest':
        return arr.sort((a, b) => {
          const aDue = a.due_date ? new Date(a.due_date).getTime() : Infinity;
          const bDue = b.due_date ? new Date(b.due_date).getTime() : Infinity;
          return aDue - bDue;
        });
      case 'newest':
      default:
        return arr.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  }, [invoices, filter, sort]);

  const filteredProjects = useMemo(
    () => (clientId ? projects.filter((p) => String(p.client_id) === clientId) : projects),
    [projects, clientId]
  );

  const total = items.reduce((sum, it) => sum + (it.quantity || 0) * (it.unit_price_cents || 0), 0);

  const updateItem = (idx: number, patch: Partial<LineItem>) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  const addItem = () =>
    setItems((prev) => [...prev, { description: '', quantity: 1, unit_price_cents: 0 }]);

  const removeItem = (idx: number) =>
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)));

  const resetForm = () => {
    setClientId('');
    setProjectId('');
    setDescription('');
    setDueDate('');
    setBillingType('one_time');
    setRecurringInterval('month');
    setItems([{ description: '', quantity: 1, unit_price_cents: 0 }]);
    setError('');
  };

  const handleCreate = async () => {
    setError('');
    if (!clientId) {
      setError('Select a client');
      return;
    }
    const validItems = items.filter((it) => it.description.trim() && it.unit_price_cents > 0);
    if (validItems.length === 0) {
      setError('Add at least one line item with a description and price');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        client_id: Number(clientId),
        project_id: projectId ? Number(projectId) : null,
        description,
        due_date: dueDate || null,
        billing_type: billingType,
        recurring_interval: billingType === 'recurring' ? recurringInterval : null,
        line_items: validItems,
        amount_cents: validItems.reduce((s, it) => s + it.quantity * it.unit_price_cents, 0),
      };
      const created: any = await api.createInvoice(payload);
      setShowCreate(false);
      resetForm();
      if (created?.id) {
        navigate(`/admin/invoices/${created.id}`);
      } else {
        const refreshed = await api.getInvoices();
        setInvoices(refreshed);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to create invoice');
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<any>[] = [
    {
      key: 'id',
      label: 'Invoice',
      sortable: true,
      render: (row) => <span className="font-mono text-xs">#{row.id}</span>,
    },
    {
      key: 'client_name',
      label: 'Client',
      sortable: true,
      filterable: true,
      render: (row) => row.client_name || '--',
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      filterable: true,
      render: (row) => (
        <span className="text-charcoal">
          {row.description || <span className="text-gray-400">--</span>}
        </span>
      ),
    },
    {
      key: 'amount_cents',
      label: 'Amount',
      sortable: true,
      render: (row) => <span className="font-semibold">{formatMoney(row.amount_cents || 0)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
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
      key: 'due_date',
      label: 'Due',
      sortable: true,
      render: (row) =>
        row.due_date ? new Date(row.due_date).toLocaleDateString() : <span className="text-gray-400">--</span>,
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
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-charcoal">Invoices</h1>
        <div className="flex gap-2">
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
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
            aria-label="Sort invoices"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => navigate('/admin/invoices/create')}
            className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Create Invoice
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="text-charcoal hover:bg-surface text-sm font-semibold px-4 py-2 rounded-lg border border-surface-200 transition-colors"
          >
            + Multi-line
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
          onRowClick={(row) => navigate(`/admin/invoices/${row.id}`)}
          emptyMessage="No invoices match this filter."
        />
      )}

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-surface-100 w-full max-w-2xl my-8 shadow-xl">
            <div className="p-5 border-b border-surface-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-charcoal">New Invoice</h2>
              <button
                type="button"
                onClick={() => {
                  setShowCreate(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-charcoal text-2xl leading-none"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Client *</label>
                  <select
                    value={clientId}
                    onChange={(e) => {
                      setClientId(e.target.value);
                      setProjectId('');
                    }}
                    className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
                  >
                    <option value="">Select client...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company_name || c.contact_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Project</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
                    disabled={!clientId}
                  >
                    <option value="">No project</option>
                    {filteredProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Invoice summary"
                    className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Billing Type</label>
                  <div className="flex rounded-lg border border-surface-200 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setBillingType('one_time')}
                      className={`flex-1 text-sm font-semibold py-2 transition-colors ${
                        billingType === 'one_time'
                          ? 'bg-orange text-white'
                          : 'bg-white text-charcoal hover:bg-surface'
                      }`}
                    >
                      One-time
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingType('recurring')}
                      className={`flex-1 text-sm font-semibold py-2 transition-colors border-l border-surface-200 ${
                        billingType === 'recurring'
                          ? 'bg-orange text-white'
                          : 'bg-white text-charcoal hover:bg-surface'
                      }`}
                    >
                      Recurring
                    </button>
                  </div>
                </div>
                {billingType === 'recurring' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Interval</label>
                    <select
                      value={recurringInterval}
                      onChange={(e) =>
                        setRecurringInterval(e.target.value as 'month' | 'year' | 'week')
                      }
                      className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
                    >
                      <option value="week">Weekly</option>
                      <option value="month">Monthly</option>
                      <option value="year">Annually</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-500">Line Items *</label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-xs font-semibold text-orange hover:text-orange-dark"
                  >
                    + Add line
                  </button>
                </div>
                <div className="space-y-2">
                  {items.map((it, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <input
                        type="text"
                        value={it.description}
                        onChange={(e) => updateItem(idx, { description: e.target.value })}
                        placeholder="Description"
                        className="flex-1 text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange/30"
                      />
                      <input
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
                        className="w-20 text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange/30"
                        aria-label="Quantity"
                      />
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={it.unit_price_cents ? it.unit_price_cents / 100 : ''}
                        onChange={(e) =>
                          updateItem(idx, {
                            unit_price_cents: Math.round(Number(e.target.value) * 100),
                          })
                        }
                        placeholder="0.00"
                        className="w-28 text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange/30"
                        aria-label="Unit price"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        disabled={items.length === 1}
                        className="text-gray-400 hover:text-red-500 disabled:opacity-30 px-2 py-2"
                        aria-label="Remove line"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-3 text-sm">
                  <span className="text-gray-500 mr-2">Total:</span>
                  <span className="font-bold text-charcoal">{formatMoney(total)}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>
            <div className="p-5 border-t border-surface-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowCreate(false);
                  resetForm();
                }}
                className="text-sm font-semibold px-4 py-2 rounded-lg text-charcoal hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={saving}
                className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save as Draft'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
