import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

export default function CreateInvoice() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [form, setForm] = useState({
    client_id: '',
    project_id: '',
    description: '',
    amount: '',
    due_date: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    api.getClients().then(setClients).catch(() => setClients([]));
    api.getProjects().then(setProjects).catch(() => setProjects([]));
  }, []);

  const filteredProjects = useMemo(
    () => (form.client_id ? projects.filter((p) => String(p.client_id) === form.client_id) : []),
    [projects, form.client_id]
  );

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.client_id) errs.client_id = 'Pick a client';
    if (!form.description.trim()) errs.description = 'Description is required';
    const amt = Number(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0)
      errs.amount = 'Enter a valid amount';
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setStatus('submitting');
    setErrorMessage('');
    try {
      const amount_cents = Math.round(Number(form.amount) * 100);
      await api.createInvoice({
        client_id: Number(form.client_id),
        project_id: form.project_id ? Number(form.project_id) : null,
        description: form.description,
        amount_cents,
        line_items: [
          {
            description: form.description,
            quantity: 1,
            unit_price_cents: amount_cents,
          },
        ],
        due_date: form.due_date || null,
      });
      navigate('/admin/invoices');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create invoice.');
      setStatus('error');
    }
  }

  return (
    <div>
      <Link
        to="/admin/invoices"
        className="text-sm text-gray-500 hover:text-charcoal transition-colors mb-4 inline-block"
      >
        &larr; Back to Invoices
      </Link>

      <h1 className="text-2xl font-bold text-charcoal mb-6">Create Invoice</h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-xl border border-surface-100 p-6 sm:p-8 space-y-5 max-w-2xl"
      >
        {status === 'error' && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="client_id" className="block text-sm font-medium text-charcoal mb-1.5">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              id="client_id"
              value={form.client_id}
              onChange={(e) => {
                update('client_id', e.target.value);
                update('project_id', '');
              }}
              className={`w-full rounded-lg border px-4 py-3 text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange ${
                errors.client_id ? 'border-red-400' : 'border-gray-300'
              }`}
            >
              <option value="">Select a client...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company_name || c.company || c.contact_name}
                </option>
              ))}
            </select>
            {errors.client_id && <p className="mt-1 text-sm text-red-500">{errors.client_id}</p>}
          </div>

          <div>
            <label htmlFor="project_id" className="block text-sm font-medium text-charcoal mb-1.5">
              Project
            </label>
            <select
              id="project_id"
              value={form.project_id}
              onChange={(e) => update('project_id', e.target.value)}
              disabled={!form.client_id}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange disabled:bg-surface/50 disabled:text-gray-400"
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

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-charcoal mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <input
            id="description"
            type="text"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="What is this invoice for?"
            className={`w-full rounded-lg border px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange ${
              errors.description ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-charcoal mb-1.5">
              Amount (USD) <span className="text-red-500">*</span>
            </label>
            <input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => update('amount', e.target.value)}
              placeholder="0.00"
              className={`w-full rounded-lg border px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange ${
                errors.amount ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
          </div>

          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-charcoal mb-1.5">
              Due Date
            </label>
            <input
              id="due_date"
              type="date"
              value={form.due_date}
              onChange={(e) => update('due_date', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="bg-orange hover:bg-orange-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-60"
          >
            {status === 'submitting' ? 'Creating...' : 'Create Invoice'}
          </button>
          <Link
            to="/admin/invoices"
            className="font-semibold px-6 py-3 rounded-lg text-charcoal hover:bg-surface transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
