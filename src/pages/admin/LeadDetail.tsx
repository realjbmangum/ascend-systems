import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import StatusBadge from '../../components/StatusBadge';
import LeadActivities from '../../components/LeadActivities';
import LeadFiles from '../../components/LeadFiles';

const PIPELINE = ['new', 'contacted', 'qualified', 'proposal_sent', 'won'];

type Lead = Record<string, any>;

// Fields the form edits. deal_value is handled separately (cents <-> dollars).
const TEXT_FIELDS = [
  'name',
  'title',
  'email',
  'phone',
  'linkedin',
  'company',
  'website',
  'address',
  'industry',
  'employee_count',
  'annual_revenue',
  'project_type',
  'budget_range',
  'owner',
  'labels',
  'source_origin',
  'source_channel',
  'source_channel_id',
  'expected_close_date',
  'message',
  'notes',
] as const;

function inputClass() {
  return 'w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30';
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-400 mb-1">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass()}
      />
    </label>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-surface-100 p-5">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [dealValue, setDealValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingStage, setSavingStage] = useState(false);
  const [converting, setConverting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState('');

  function hydrate(data: Lead) {
    setLead(data);
    const next: Record<string, string> = {};
    for (const f of TEXT_FIELDS) next[f] = data[f] != null ? String(data[f]) : '';
    setForm(next);
    setDealValue(
      data.deal_value_cents ? String((data.deal_value_cents / 100).toFixed(2)) : ''
    );
  }

  useEffect(() => {
    api
      .getLead(Number(id))
      .then(hydrate)
      .catch(() => navigate('/admin/leads'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const dirty = useMemo(() => {
    if (!lead) return false;
    for (const f of TEXT_FIELDS) {
      const orig = lead[f] != null ? String(lead[f]) : '';
      if ((form[f] ?? '') !== orig) return true;
    }
    const origValue = lead.deal_value_cents
      ? (lead.deal_value_cents / 100).toFixed(2)
      : '';
    return dealValue !== origValue;
  }, [lead, form, dealValue]);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function payload() {
    const out: Record<string, any> = {};
    for (const f of TEXT_FIELDS) out[f] = form[f]?.trim() ? form[f].trim() : null;
    const num = Number(dealValue);
    out.deal_value_cents = dealValue && !isNaN(num) ? Math.round(num * 100) : 0;
    return out;
  }

  async function handleSave() {
    setSaving(true);
    setActionError('');
    try {
      const data = payload();
      await api.updateLead(Number(id), data);
      setLead((prev) => ({ ...prev, ...data }));
    } catch (err: any) {
      setActionError(err?.message || 'Failed to save changes. Try again.');
    }
    setSaving(false);
  }

  async function handleStage(stage: string) {
    if (savingStage || lead?.status === stage) return;
    setSavingStage(true);
    setActionError('');
    try {
      await api.updateLead(Number(id), { status: stage });
      setLead((prev) => ({ ...prev, status: stage }));
    } catch (err: any) {
      setActionError(err?.message || 'Failed to update stage. Try again.');
    }
    setSavingStage(false);
  }

  async function handleDelete() {
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.deleteLead(Number(id));
      navigate('/admin/leads');
    } catch {
      setDeleting(false);
    }
  }

  async function handleConvert() {
    if (!confirm('Convert this lead to a client? This creates a new client and project.'))
      return;
    setConverting(true);
    setActionError('');
    try {
      await api.convertLead(Number(id));
      navigate('/admin/clients');
    } catch (err: any) {
      setActionError(err?.message || 'Failed to convert lead. Try again.');
    }
    setConverting(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!lead) return null;

  const currentStageIdx = PIPELINE.indexOf(lead.status);
  const isLost = lead.status === 'lost';

  return (
    <div className="pb-24">
      <Link
        to="/admin/leads"
        className="text-sm text-gray-500 hover:text-charcoal transition-colors mb-4 inline-block"
      >
        &larr; Back to Leads
      </Link>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">
            {form.company || form.name || lead.name}
          </h1>
          <p className="text-gray-500">
            {form.name}
            {form.title ? ` · ${form.title}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={lead.status} />
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-500 hover:text-red-700 text-sm font-semibold disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Pipeline stage bar */}
      <div className="bg-white rounded-xl border border-surface-100 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Pipeline Stage
          </h2>
          <button
            onClick={() => handleStage('lost')}
            disabled={savingStage || isLost}
            className="text-xs font-semibold text-red-500 hover:text-red-700 disabled:opacity-40"
          >
            Mark Lost
          </button>
        </div>
        <div className="flex gap-1.5">
          {PIPELINE.map((stage, idx) => {
            const reached = !isLost && currentStageIdx >= idx;
            return (
              <button
                key={stage}
                onClick={() => handleStage(stage)}
                disabled={savingStage}
                title={stage.replace(/_/g, ' ')}
                className={`flex-1 h-9 rounded-md text-xs font-semibold capitalize transition-colors disabled:cursor-wait ${
                  reached
                    ? 'bg-orange text-white'
                    : 'bg-surface text-gray-500 hover:bg-surface-200'
                }`}
              >
                {stage.replace(/_/g, ' ')}
              </button>
            );
          })}
        </div>
        {isLost && (
          <p className="text-xs text-red-500 mt-2 font-medium">
            This deal is marked lost. Click a stage to reopen it.
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Panel title="Deal">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              label="Value (USD)"
              value={dealValue}
              onChange={setDealValue}
              type="number"
              placeholder="0.00"
            />
            <Field
              label="Expected Close"
              value={form.expected_close_date}
              onChange={(v) => set('expected_close_date', v)}
              type="date"
            />
            <Field
              label="Project Type"
              value={form.project_type}
              onChange={(v) => set('project_type', v)}
            />
            <Field
              label="Budget Range"
              value={form.budget_range}
              onChange={(v) => set('budget_range', v)}
            />
            <Field
              label="Owner"
              value={form.owner}
              onChange={(v) => set('owner', v)}
              placeholder="Brian"
            />
            <Field
              label="Labels"
              value={form.labels}
              onChange={(v) => set('labels', v)}
              placeholder="hot, referral"
            />
          </div>
        </Panel>

        <Panel title="Person">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Name" value={form.name} onChange={(v) => set('name', v)} />
            <Field
              label="Title"
              value={form.title}
              onChange={(v) => set('title', v)}
            />
            <Field
              label="Email"
              value={form.email}
              onChange={(v) => set('email', v)}
              type="email"
            />
            <Field
              label="Phone"
              value={form.phone}
              onChange={(v) => set('phone', v)}
              type="tel"
            />
            <div className="col-span-2">
              <Field
                label="LinkedIn"
                value={form.linkedin}
                onChange={(v) => set('linkedin', v)}
                placeholder="linkedin.com/in/..."
              />
            </div>
          </div>
        </Panel>

        <Panel title="Organization">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              label="Company"
              value={form.company}
              onChange={(v) => set('company', v)}
            />
            <Field
              label="Website"
              value={form.website}
              onChange={(v) => set('website', v)}
            />
            <div className="col-span-2">
              <Field
                label="Address"
                value={form.address}
                onChange={(v) => set('address', v)}
              />
            </div>
            <Field
              label="Industry"
              value={form.industry}
              onChange={(v) => set('industry', v)}
            />
            <Field
              label="Employees"
              value={form.employee_count}
              onChange={(v) => set('employee_count', v)}
            />
            <Field
              label="Annual Revenue"
              value={form.annual_revenue}
              onChange={(v) => set('annual_revenue', v)}
            />
          </div>
        </Panel>

        <Panel title="Source">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              label="Source Origin"
              value={form.source_origin}
              onChange={(v) => set('source_origin', v)}
              placeholder="Manually created"
            />
            <Field
              label="Source Channel"
              value={form.source_channel}
              onChange={(v) => set('source_channel', v)}
            />
            <div className="col-span-2">
              <Field
                label="Source Channel ID"
                value={form.source_channel_id}
                onChange={(v) => set('source_channel_id', v)}
              />
            </div>
            <div className="col-span-2 text-xs text-gray-400">
              Submitted {new Date(lead.created_at).toLocaleString()}
            </div>
          </div>
        </Panel>

        <Panel title="Inbound Message">
          <textarea
            value={form.message}
            onChange={(e) => set('message', e.target.value)}
            rows={5}
            className={`${inputClass()} resize-y`}
            placeholder="No message provided."
          />
        </Panel>

        <Panel title="Internal Notes">
          <textarea
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            rows={5}
            className={`${inputClass()} resize-y`}
            placeholder="Add internal notes about this lead..."
          />
        </Panel>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <LeadActivities leadId={Number(id)} />
        <LeadFiles leadId={Number(id)} />
      </div>

      {actionError && (
        <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
          {actionError}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <Link
          to={`/admin/proposals/create?lead_id=${id}`}
          className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          Create Proposal
        </Link>
        {lead.status !== 'won' && (
          <button
            onClick={handleConvert}
            disabled={converting}
            className="bg-charcoal hover:bg-charcoal-light text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {converting ? 'Converting...' : 'Convert to Client'}
          </button>
        )}
      </div>

      {/* Sticky save bar */}
      {dirty && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 px-6 py-3 flex items-center justify-end gap-3 shadow-lg z-10">
          <span className="text-sm text-gray-500 mr-auto">Unsaved changes</span>
          <button
            onClick={() => hydrate(lead)}
            className="text-sm font-semibold px-4 py-2 rounded-lg border border-surface-200 text-charcoal hover:bg-surface transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}
