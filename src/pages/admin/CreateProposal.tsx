import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';

export const PRICING_MODELS: { value: string; label: string }[] = [
  { value: '', label: 'Not specified' },
  { value: 'time_materials', label: 'Time & Materials' },
  { value: 'fixed', label: 'Fixed Fee' },
  { value: 'retainer', label: 'Monthly Retainer' },
];

export default function CreateProposal() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetLeadId = searchParams.get('lead_id') || '';
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: '',
    recipient_type: presetLeadId ? 'lead' : 'client',
    client_id: '',
    project_id: '',
    lead_id: presetLeadId,
    intro: '',
    scope: '',
    deliverables: '',
    out_of_scope: '',
    timeline: '',
    pricing_model: '',
    price_summary: '',
    payment_schedule: '',
    client_responsibilities: '',
    acceptance_criteria: '',
    total: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    api.getClients().then(setClients).catch(() => setClients([]));
    api.getProjects().then(setProjects).catch(() => setProjects([]));
    api.getLeads().then(setLeads).catch(() => setLeads([]));
  }, []);

  // When arriving from a lead, pre-fill the title once the lead loads.
  useEffect(() => {
    if (!presetLeadId || !leads.length) return;
    const lead = leads.find((l) => String(l.id) === presetLeadId);
    if (lead) {
      setForm((prev) =>
        prev.title
          ? prev
          : { ...prev, title: `Proposal for ${lead.company || lead.name}` }
      );
    }
  }, [presetLeadId, leads]);

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
    if (!form.title.trim()) errs.title = 'Title is required';
    if (form.recipient_type === 'lead' && !form.lead_id)
      errs.lead_id = 'Select a lead';
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
      const totalNum = Number(form.total);
      const total_cents =
        form.total && !isNaN(totalNum) ? Math.round(totalNum * 100) : 0;
      const isLead = form.recipient_type === 'lead';
      const payload: Record<string, any> = {
        title: form.title.trim(),
        client_id: isLead || !form.client_id ? null : Number(form.client_id),
        project_id: isLead || !form.project_id ? null : Number(form.project_id),
        lead_id: isLead && form.lead_id ? Number(form.lead_id) : null,
        intro: form.intro || null,
        scope: form.scope || null,
        deliverables: form.deliverables || null,
        out_of_scope: form.out_of_scope || null,
        timeline: form.timeline || null,
        pricing_model: form.pricing_model || null,
        price_summary: form.price_summary || null,
        payment_schedule: form.payment_schedule || null,
        client_responsibilities: form.client_responsibilities || null,
        acceptance_criteria: form.acceptance_criteria || null,
        total_cents,
      };
      const created = await api.createProposal(payload);
      navigate(`/admin/proposals/${created.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create proposal.');
      setStatus('error');
    }
  }

  return (
    <div>
      <Link
        to="/admin/proposals"
        className="text-sm text-gray-500 hover:text-charcoal transition-colors mb-4 inline-block"
      >
        &larr; Back to Proposals
      </Link>

      <h1 className="text-2xl font-bold text-charcoal mb-6">Create Proposal</h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-xl border border-surface-100 p-6 sm:p-8 space-y-5 max-w-3xl"
      >
        {status === 'error' && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-charcoal mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Proposal title"
            className={`w-full rounded-lg border px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange ${
              errors.title ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        <div>
          <span className="block text-sm font-medium text-charcoal mb-1.5">
            Recipient
          </span>
          <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
            {(['client', 'lead'] as const).map((rt) => (
              <button
                key={rt}
                type="button"
                onClick={() => update('recipient_type', rt)}
                className={`px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                  form.recipient_type === rt
                    ? 'bg-orange text-white'
                    : 'bg-white text-charcoal hover:bg-surface'
                }`}
              >
                {rt}
              </button>
            ))}
          </div>
        </div>

        {form.recipient_type === 'client' ? (
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="client_id" className="block text-sm font-medium text-charcoal mb-1.5">
                Client
              </label>
              <select
                id="client_id"
                value={form.client_id}
                onChange={(e) => {
                  update('client_id', e.target.value);
                  update('project_id', '');
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
              >
                <option value="">No client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company_name || c.contact_name}
                  </option>
                ))}
              </select>
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
        ) : (
          <div>
            <label htmlFor="lead_id" className="block text-sm font-medium text-charcoal mb-1.5">
              Lead
            </label>
            <select
              id="lead_id"
              value={form.lead_id}
              onChange={(e) => update('lead_id', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            >
              <option value="">Select a lead</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.company ? `${l.company} — ${l.name}` : l.name}
                </option>
              ))}
            </select>
            {errors.lead_id && (
              <p className="mt-1 text-sm text-red-500">{errors.lead_id}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="intro" className="block text-sm font-medium text-charcoal mb-1.5">
            Intro
          </label>
          <textarea
            id="intro"
            rows={3}
            value={form.intro}
            onChange={(e) => update('intro', e.target.value)}
            placeholder="Set the opening context of the proposal."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
          />
        </div>

        <div>
          <label htmlFor="scope" className="block text-sm font-medium text-charcoal mb-1.5">
            Scope
          </label>
          <textarea
            id="scope"
            rows={4}
            value={form.scope}
            onChange={(e) => update('scope', e.target.value)}
            placeholder="What's included in this engagement."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
          />
        </div>

        <div>
          <label htmlFor="deliverables" className="block text-sm font-medium text-charcoal mb-1.5">
            Deliverables
          </label>
          <textarea
            id="deliverables"
            rows={4}
            value={form.deliverables}
            onChange={(e) => update('deliverables', e.target.value)}
            placeholder="What the client will receive."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
          />
        </div>

        <div>
          <label htmlFor="out_of_scope" className="block text-sm font-medium text-charcoal mb-1.5">
            Out of Scope
          </label>
          <textarea
            id="out_of_scope"
            rows={3}
            value={form.out_of_scope}
            onChange={(e) => update('out_of_scope', e.target.value)}
            placeholder="What is explicitly excluded — anything added later needs a change order."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="timeline" className="block text-sm font-medium text-charcoal mb-1.5">
              Timeline
            </label>
            <input
              id="timeline"
              type="text"
              value={form.timeline}
              onChange={(e) => update('timeline', e.target.value)}
              placeholder="e.g. 8 weeks"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div>
            <label htmlFor="total" className="block text-sm font-medium text-charcoal mb-1.5">
              Total Amount (USD)
            </label>
            <input
              id="total"
              type="number"
              min="0"
              step="0.01"
              value={form.total}
              onChange={(e) => update('total', e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
        </div>

        <div>
          <label htmlFor="pricing_model" className="block text-sm font-medium text-charcoal mb-1.5">
            Pricing Model
          </label>
          <select
            id="pricing_model"
            value={form.pricing_model}
            onChange={(e) => update('pricing_model', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
          >
            {PRICING_MODELS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="price_summary" className="block text-sm font-medium text-charcoal mb-1.5">
            Price Summary
          </label>
          <textarea
            id="price_summary"
            rows={3}
            value={form.price_summary}
            onChange={(e) => update('price_summary', e.target.value)}
            placeholder="Describe the pricing structure (e.g. fixed fee, milestones, retainer)."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
          />
        </div>

        <div>
          <label htmlFor="payment_schedule" className="block text-sm font-medium text-charcoal mb-1.5">
            Payment Schedule
          </label>
          <textarea
            id="payment_schedule"
            rows={3}
            value={form.payment_schedule}
            onChange={(e) => update('payment_schedule', e.target.value)}
            placeholder="Milestones or triggers and when each invoice is due (e.g. 30% deposit on signature, balance on acceptance)."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
          />
        </div>

        <div>
          <label htmlFor="client_responsibilities" className="block text-sm font-medium text-charcoal mb-1.5">
            Client Responsibilities
          </label>
          <textarea
            id="client_responsibilities"
            rows={3}
            value={form.client_responsibilities}
            onChange={(e) => update('client_responsibilities', e.target.value)}
            placeholder="What the client must provide and by when — access, content, timely feedback, a point of contact."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
          />
        </div>

        <div>
          <label htmlFor="acceptance_criteria" className="block text-sm font-medium text-charcoal mb-1.5">
            Acceptance Criteria
          </label>
          <textarea
            id="acceptance_criteria"
            rows={3}
            value={form.acceptance_criteria}
            onChange={(e) => update('acceptance_criteria', e.target.value)}
            placeholder="How a deliverable is confirmed complete and accepted."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
          />
        </div>

        <div className="rounded-lg bg-orange/5 border border-orange/30 p-4 text-sm text-charcoal">
          <strong>Governed by the Master Services Agreement.</strong> When the
          client signs, this becomes a binding Statement of Work under the
          standard MSA (v2026-05). The sign page shows the MSA link and
          requires the client to accept it.
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="bg-orange hover:bg-orange-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-60"
          >
            {status === 'submitting' ? 'Creating...' : 'Create Proposal'}
          </button>
          <Link
            to="/admin/proposals"
            className="font-semibold px-6 py-3 rounded-lg text-charcoal hover:bg-surface transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
