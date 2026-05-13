import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [form, setForm] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    notes: '',
    website_url: '',
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getClient(Number(id))
      .then((data) => {
        setClient(data);
        setForm({
          company_name: data.company_name || data.company || '',
          contact_name: data.contact_name || '',
          email: data.email || '',
          phone: data.phone || '',
          notes: data.notes || '',
          website_url: data.website_url || '',
        });
      })
      .catch(() => navigate('/admin/clients'))
      .finally(() => setLoading(false));
    api
      .getInvoices(Number(id))
      .then(setInvoices)
      .catch(() => setInvoices([]))
      .finally(() => setInvoicesLoading(false));
  }, [id, navigate]);

  const totalsByStatus = invoices.reduce(
    (acc: Record<string, { count: number; amount: number }>, inv) => {
      const s = inv.status || 'draft';
      if (!acc[s]) acc[s] = { count: 0, amount: 0 };
      acc[s].count++;
      acc[s].amount += inv.amount_cents || 0;
      return acc;
    },
    {}
  );
  const totalBilled = invoices.reduce(
    (sum, inv) => sum + (inv.amount_cents || 0),
    0
  );
  const totalPaid = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + (inv.amount_cents || 0), 0);
  const totalOutstanding = totalBilled - totalPaid;
  const fmtMoney = (cents: number) =>
    `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await api.updateClient(Number(id), form);
      setClient((prev: any) => ({ ...prev, ...form }));
      setEditing(false);
    } catch (e: any) {
      setError(e?.message || 'Failed to save.');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this client? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.deleteClient(Number(id));
      navigate('/admin/clients');
    } catch (e: any) {
      setError(e?.message || 'Failed to delete.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!client) return null;

  const inputCls =
    'w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30';

  return (
    <div>
      <Link to="/admin/clients" className="text-sm text-gray-500 hover:text-charcoal transition-colors mb-4 inline-block">
        &larr; Back to Clients
      </Link>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal mb-1">
            {client.company_name || client.company}
          </h1>
          <p className="text-gray-500">{client.contact_name}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditing((v) => !v)}
            className="text-sm font-semibold px-4 py-2 rounded-lg border border-surface-200 text-charcoal hover:bg-surface transition-colors"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-500 hover:text-red-700 text-sm font-semibold disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-surface-100 p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Contact Info</h2>
          {editing ? (
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Company Name</label>
                <input
                  type="text"
                  value={form.company_name}
                  onChange={(e) => update('company_name', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={form.contact_name}
                  onChange={(e) => update('contact_name', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Website URL</label>
                <input
                  type="url"
                  value={form.website_url}
                  onChange={(e) => update('website_url', e.target.value)}
                  placeholder="https://example.com"
                  className={inputCls}
                />
              </div>
            </div>
          ) : (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-400">Contact Name</dt>
                <dd className="text-charcoal font-medium">{client.contact_name}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Email</dt>
                <dd className="text-charcoal font-medium">{client.email}</dd>
              </div>
              {client.phone && (
                <div>
                  <dt className="text-gray-400">Phone</dt>
                  <dd className="text-charcoal font-medium">{client.phone}</dd>
                </div>
              )}
              {client.website_url && (
                <div>
                  <dt className="text-gray-400">Website</dt>
                  <dd>
                    <a
                      href={client.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange hover:text-orange-dark font-medium"
                    >
                      {client.website_url.replace(/^https?:\/\//, '')}
                    </a>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-gray-400">Client Since</dt>
                <dd className="text-charcoal font-medium">{new Date(client.created_at).toLocaleDateString()}</dd>
              </div>
            </dl>
          )}
        </div>

        {/* Projects */}
        <div className="bg-white rounded-xl border border-surface-100 p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Projects</h2>
          {client.projects && client.projects.length > 0 ? (
            <ul className="space-y-2">
              {client.projects.map((project: any) => (
                <li key={project.id}>
                  <Link
                    to={`/admin/projects/${project.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-surface/50 transition-colors"
                  >
                    <span className="text-sm font-medium text-charcoal">{project.name}</span>
                    <span className="text-xs text-gray-400 capitalize">{project.status?.replace(/_/g, ' ')}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No projects yet.</p>
          )}
        </div>

        {/* Invoices */}
        <div className="bg-white rounded-xl border border-surface-100 p-5 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Invoices</h2>
            <button
              onClick={() => navigate(`/admin/invoices/create?client_id=${client.id}`)}
              className="text-xs font-semibold text-orange hover:text-orange-dark"
            >
              + New Invoice
            </button>
          </div>
          {invoicesLoading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : invoices.length === 0 ? (
            <p className="text-sm text-gray-400">No invoices yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 pb-4 border-b border-surface-100">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Billed</div>
                  <div className="text-xl font-bold text-charcoal tabular-nums">{fmtMoney(totalBilled)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Paid</div>
                  <div className="text-xl font-bold text-green-700 tabular-nums">{fmtMoney(totalPaid)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Outstanding</div>
                  <div className={`text-xl font-bold tabular-nums ${totalOutstanding > 0 ? 'text-orange-dark' : 'text-charcoal'}`}>
                    {fmtMoney(totalOutstanding)}
                  </div>
                </div>
              </div>
              <ul className="divide-y divide-surface-100">
                {invoices.map((inv) => (
                  <li key={inv.id}>
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/invoices/${inv.id}`)}
                      className="w-full text-left flex items-center justify-between gap-3 py-2.5 hover:bg-surface/30 px-2 -mx-2 rounded transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-charcoal">
                          #{inv.id} {inv.description ? `· ${inv.description}` : ''}
                        </div>
                        <div className="text-xs text-gray-500">
                          {inv.due_date
                            ? `Due ${new Date(inv.due_date).toLocaleDateString()}`
                            : 'No due date'}
                          {' · '}
                          Created {new Date(inv.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right ml-3">
                        <div className="font-semibold tabular-nums text-charcoal">
                          {fmtMoney(inv.amount_cents || 0)}
                        </div>
                        <span
                          className={`inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                            inv.status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : inv.status === 'sent'
                              ? 'bg-blue-100 text-blue-700'
                              : inv.status === 'overdue'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {inv.status || 'draft'}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-surface-100 p-5 md:col-span-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Notes</h2>
          {editing ? (
            <textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              rows={4}
              className={`${inputCls} resize-y mb-4`}
              placeholder="Add internal notes about this client..."
            />
          ) : (
            <p className="text-sm text-charcoal whitespace-pre-wrap mb-4">
              {client.notes || <span className="text-gray-400">No notes.</span>}
            </p>
          )}
          {editing && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
