import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

export default function CreateClient() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.company_name.trim()) errs.company_name = 'Company name is required';
    if (!form.contact_name.trim()) errs.contact_name = 'Contact name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email';
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
      await api.createClient(form);
      navigate('/admin/clients');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create client.');
      setStatus('error');
    }
  }

  return (
    <div>
      <Link
        to="/admin/clients"
        className="text-sm text-gray-500 hover:text-charcoal transition-colors mb-4 inline-block"
      >
        &larr; Back to Clients
      </Link>

      <h1 className="text-2xl font-bold text-charcoal mb-6">Create Client</h1>

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

        <div>
          <label htmlFor="company_name" className="block text-sm font-medium text-charcoal mb-1.5">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            id="company_name"
            type="text"
            value={form.company_name}
            onChange={(e) => update('company_name', e.target.value)}
            className={`w-full rounded-lg border px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange ${
              errors.company_name ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.company_name && (
            <p className="mt-1 text-sm text-red-500">{errors.company_name}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="contact_name" className="block text-sm font-medium text-charcoal mb-1.5">
              Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              id="contact_name"
              type="text"
              value={form.contact_name}
              onChange={(e) => update('contact_name', e.target.value)}
              className={`w-full rounded-lg border px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange ${
                errors.contact_name ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.contact_name && (
              <p className="mt-1 text-sm text-red-500">{errors.contact_name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className={`w-full rounded-lg border px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange ${
                errors.email ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-charcoal mb-1.5">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-charcoal mb-1.5">
            Notes
          </label>
          <textarea
            id="notes"
            rows={4}
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange resize-y"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="bg-orange hover:bg-orange-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-60"
          >
            {status === 'submitting' ? 'Creating...' : 'Create Client'}
          </button>
          <Link
            to="/admin/clients"
            className="font-semibold px-6 py-3 rounded-lg text-charcoal hover:bg-surface transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
