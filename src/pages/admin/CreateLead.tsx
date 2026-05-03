import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

const projectTypes = [
  'Web/App Development',
  'AI Integration',
  'Business Automation',
  'AI Phone Solution',
  'Other',
];

const budgetRanges = ['Under $5k', '$5k–$15k', '$15k–$50k', '$50k+', 'Not sure'];

const statuses = ['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'];

export default function CreateLead() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    project_type: '',
    budget_range: '',
    message: '',
    status: 'new',
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
    if (!form.name.trim()) errs.name = 'Name is required';
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
      await api.submitLead(form);
      navigate('/admin/leads');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create lead.');
      setStatus('error');
    }
  }

  return (
    <div>
      <Link
        to="/admin/leads"
        className="text-sm text-gray-500 hover:text-charcoal transition-colors mb-4 inline-block"
      >
        &larr; Back to Leads
      </Link>

      <h1 className="text-2xl font-bold text-charcoal mb-6">Create Lead</h1>

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
            <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className={`w-full rounded-lg border px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange ${
                errors.name ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
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
          <label htmlFor="company" className="block text-sm font-medium text-charcoal mb-1.5">
            Company
          </label>
          <input
            id="company"
            type="text"
            value={form.company}
            onChange={(e) => update('company', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="project_type" className="block text-sm font-medium text-charcoal mb-1.5">
              Project Type
            </label>
            <select
              id="project_type"
              value={form.project_type}
              onChange={(e) => update('project_type', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            >
              <option value="">Select a project type</option>
              {projectTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="budget_range" className="block text-sm font-medium text-charcoal mb-1.5">
              Budget Range
            </label>
            <select
              id="budget_range"
              value={form.budget_range}
              onChange={(e) => update('budget_range', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            >
              <option value="">Select a range</option>
              {budgetRanges.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-charcoal mb-1.5">
            Status
          </label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-1.5">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange resize-y"
            placeholder="Notes about this lead..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="bg-orange hover:bg-orange-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-60"
          >
            {status === 'submitting' ? 'Creating...' : 'Create Lead'}
          </button>
          <Link
            to="/admin/leads"
            className="font-semibold px-6 py-3 rounded-lg text-charcoal hover:bg-surface transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
