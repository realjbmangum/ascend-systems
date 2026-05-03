import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

const projectTypes = [
  'Web/App Development',
  'AI Integration',
  'Business Automation',
  'AI Phone Solution',
  'Other',
];

const statuses = ['scoping', 'in_progress', 'completed'];

export default function CreateProject() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [form, setForm] = useState({
    client_id: '',
    name: '',
    description: '',
    project_type: '',
    status: 'scoping',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    api.getClients().then(setClients).catch(() => setClients([]));
  }, []);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.client_id) errs.client_id = 'Pick a client';
    if (!form.name.trim()) errs.name = 'Project name is required';
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
      await api.createProject({ ...form, client_id: Number(form.client_id) });
      navigate('/admin/projects');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create project.');
      setStatus('error');
    }
  }

  return (
    <div>
      <Link
        to="/admin/projects"
        className="text-sm text-gray-500 hover:text-charcoal transition-colors mb-4 inline-block"
      >
        &larr; Back to Projects
      </Link>

      <h1 className="text-2xl font-bold text-charcoal mb-6">Create Project</h1>

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
          <label htmlFor="client_id" className="block text-sm font-medium text-charcoal mb-1.5">
            Client <span className="text-red-500">*</span>
          </label>
          <select
            id="client_id"
            value={form.client_id}
            onChange={(e) => update('client_id', e.target.value)}
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
          <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1.5">
            Project Name <span className="text-red-500">*</span>
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
          <label htmlFor="description" className="block text-sm font-medium text-charcoal mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange resize-y"
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
            {status === 'submitting' ? 'Creating...' : 'Create Project'}
          </button>
          <Link
            to="/admin/projects"
            className="font-semibold px-6 py-3 rounded-lg text-charcoal hover:bg-surface transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
