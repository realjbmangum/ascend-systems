import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';

const statusStyles: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  void: 'bg-gray-100 text-gray-500',
  refunded: 'bg-purple-100 text-purple-700',
};

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

const editableStatuses = ['draft', 'sent', 'paid', 'overdue', 'void', 'refunded'];

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    description: '',
    amount: '',
    due_date: '',
    status: 'draft',
  });

  const load = () => {
    setLoading(true);
    api
      .getInvoice(Number(id))
      .then((data) => {
        setInvoice(data);
        setEditForm({
          description: data.description || '',
          amount: data.amount_cents != null ? (data.amount_cents / 100).toFixed(2) : '',
          due_date: data.due_date ? String(data.due_date).slice(0, 10) : '',
          status: data.status || 'draft',
        });
      })
      .catch(() => navigate('/admin/invoices'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleSaveEdit = async () => {
    setSaving(true);
    setError('');
    try {
      const amt = Number(editForm.amount);
      const payload: Record<string, any> = {
        description: editForm.description,
        due_date: editForm.due_date || null,
        status: editForm.status,
      };
      if (!isNaN(amt) && editForm.amount !== '') {
        payload.amount_cents = Math.round(amt * 100);
      }
      await api.updateInvoice(Number(id), payload);
      setInvoice((prev: any) => ({ ...prev, ...payload }));
      setEditing(false);
    } catch (e: any) {
      setError(e?.message || 'Failed to save invoice.');
    }
    setSaving(false);
  };

  const handleSend = async () => {
    if (!confirm('Send this invoice to the client via Stripe?')) return;
    setSending(true);
    setError('');
    try {
      await api.sendInvoice(Number(id));
      load();
    } catch (e: any) {
      setError(e?.message || 'Failed to send invoice');
    } finally {
      setSending(false);
    }
  };

  const handleStatus = async (status: string) => {
    try {
      await api.updateInvoice(Number(id), { status });
      setInvoice((prev: any) => ({ ...prev, status }));
    } catch (e: any) {
      setError(e?.message || 'Failed to update invoice');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!invoice) return null;

  const lineItems: any[] = invoice.line_items || [];
  const subtotal = lineItems.reduce(
    (s, it) => s + (it.quantity || 0) * (it.unit_price_cents || 0),
    0
  );
  const total = invoice.amount_cents ?? subtotal;

  return (
    <div>
      <Link
        to="/admin/invoices"
        className="text-sm text-gray-500 hover:text-charcoal transition-colors mb-4 inline-block"
      >
        &larr; Back to Invoices
      </Link>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Invoice #{invoice.id}</h1>
          {invoice.client_name && (
            <Link
              to={`/admin/clients/${invoice.client_id}`}
              className="text-sm text-orange hover:text-orange-dark transition-colors"
            >
              {invoice.client_name}
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
              statusStyles[invoice.status] || 'bg-gray-100 text-gray-600'
            }`}
          >
            {invoice.status}
          </span>
          {invoice.status === 'draft' && (
            <button
              onClick={handleSend}
              disabled={sending}
              className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send via Stripe'}
            </button>
          )}
          {invoice.status === 'sent' && (
            <button
              onClick={() => handleStatus('paid')}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Mark paid
            </button>
          )}
          <button
            onClick={() => setEditing((v) => !v)}
            className="text-sm font-semibold px-4 py-2 rounded-lg border border-surface-200 text-charcoal hover:bg-surface transition-colors"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      {editing && (
        <div className="bg-white rounded-xl border border-surface-100 p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Edit Invoice</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
              <input
                type="text"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Amount (USD)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Due Date</label>
              <input
                type="date"
                value={editForm.due_date}
                onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
              >
                {editableStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Line items */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-surface-100 overflow-hidden">
          <div className="p-5 border-b border-surface-100">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Line Items</h2>
            {invoice.description && (
              <p className="text-sm text-charcoal mt-2">{invoice.description}</p>
            )}
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-100 bg-surface/50">
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Description
                </th>
                <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide w-16">
                  Qty
                </th>
                <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">
                  Unit
                </th>
                <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {lineItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    No line items.
                  </td>
                </tr>
              ) : (
                lineItems.map((it, i) => (
                  <tr key={it.id ?? i} className="border-b border-surface-100 last:border-0">
                    <td className="px-4 py-3 text-charcoal">{it.description}</td>
                    <td className="px-4 py-3 text-right text-charcoal">{it.quantity}</td>
                    <td className="px-4 py-3 text-right text-charcoal">{formatMoney(it.unit_price_cents)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-charcoal">
                      {formatMoney((it.quantity || 0) * (it.unit_price_cents || 0))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-surface/50">
                <td colSpan={3} className="px-4 py-3 text-right text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Total
                </td>
                <td className="px-4 py-3 text-right text-lg font-bold text-charcoal">
                  {formatMoney(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Meta */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-surface-100 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Details</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-400 text-xs">Client</dt>
                <dd className="text-charcoal font-medium">
                  {invoice.client_name || `#${invoice.client_id}`}
                </dd>
              </div>
              {invoice.project_id && (
                <div>
                  <dt className="text-gray-400 text-xs">Project</dt>
                  <dd>
                    <Link
                      to={`/admin/projects/${invoice.project_id}`}
                      className="text-orange hover:text-orange-dark font-medium"
                    >
                      {invoice.project_name || `#${invoice.project_id}`}
                    </Link>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-gray-400 text-xs">Created</dt>
                <dd className="text-charcoal font-medium">
                  {new Date(invoice.created_at).toLocaleDateString()}
                </dd>
              </div>
              {invoice.due_date && (
                <div>
                  <dt className="text-gray-400 text-xs">Due</dt>
                  <dd className="text-charcoal font-medium">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </dd>
                </div>
              )}
              {invoice.paid_at && (
                <div>
                  <dt className="text-gray-400 text-xs">Paid</dt>
                  <dd className="text-green-700 font-medium">
                    {new Date(invoice.paid_at).toLocaleString()}
                  </dd>
                </div>
              )}
              {invoice.stripe_invoice_id && (
                <div>
                  <dt className="text-gray-400 text-xs">Stripe Invoice</dt>
                  <dd className="text-charcoal font-mono text-xs break-all">
                    {invoice.stripe_invoice_id}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Payment history / events */}
          <div className="bg-white rounded-xl border border-surface-100 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Payment History
            </h2>
            {invoice.payment_events && invoice.payment_events.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {invoice.payment_events.map((ev: any, i: number) => (
                  <li key={ev.id ?? i} className="flex items-start gap-2">
                    <span className="text-gray-400 text-xs whitespace-nowrap">
                      {new Date(ev.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-charcoal">{ev.label || ev.type}</span>
                    {ev.amount_cents != null && (
                      <span className="ml-auto font-semibold">{formatMoney(ev.amount_cents)}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">No payment activity yet.</p>
            )}
          </div>

          {/* Status controls */}
          {invoice.status !== 'paid' && (
            <div className="bg-white rounded-xl border border-surface-100 p-5">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Manage
              </h2>
              <div className="flex flex-wrap gap-2">
                {invoice.status !== 'void' && (
                  <button
                    onClick={() => handleStatus('void')}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-surface-200 text-charcoal hover:bg-surface transition-colors"
                  >
                    Void
                  </button>
                )}
                {invoice.status !== 'overdue' && invoice.status === 'sent' && (
                  <button
                    onClick={() => handleStatus('overdue')}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-surface-200 text-charcoal hover:bg-surface transition-colors"
                  >
                    Mark overdue
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
