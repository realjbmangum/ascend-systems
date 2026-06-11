import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { PRICING_MODELS } from './CreateProposal';
import ProposalDocument from '../../components/ProposalDocument';
import type { Tier } from '../../components/ProposalDocument';
import TierEditor from '../../components/TierEditor';

const statusStyles: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 border-gray-200',
  sent: 'bg-blue-50 text-blue-700 border-blue-200',
  accepted: 'bg-green-50 text-green-700 border-green-200',
  declined: 'bg-red-50 text-red-700 border-red-200',
};

const editableStatuses = ['draft', 'sent', 'accepted', 'declined'];

export default function ProposalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [billing, setBilling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [signUrl, setSignUrl] = useState<string | null>(null);
  const [emailNote, setEmailNote] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
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
    status: 'draft',
  });
  const [tierEdit, setTierEdit] = useState<Tier[]>([]);

  const load = () => {
    setLoading(true);
    api
      .getProposal(Number(id))
      .then((data) => {
        setProposal(data);
        setEditForm({
          title: data.title || '',
          intro: data.intro || '',
          scope: data.scope || '',
          deliverables: data.deliverables || '',
          out_of_scope: data.out_of_scope || '',
          timeline: data.timeline || '',
          pricing_model: data.pricing_model || '',
          price_summary: data.price_summary || '',
          payment_schedule: data.payment_schedule || '',
          client_responsibilities: data.client_responsibilities || '',
          acceptance_criteria: data.acceptance_criteria || '',
          total: data.total_cents != null ? (data.total_cents / 100).toFixed(2) : '',
          status: data.status || 'draft',
        });
        // Parse tiers JSON into the editable array (defaults to [] when null).
        let parsedTiers: Tier[] = [];
        if (data.tiers) {
          try {
            const arr = JSON.parse(data.tiers);
            if (Array.isArray(arr)) parsedTiers = arr;
          } catch {
            // ignore — start fresh
          }
        }
        setTierEdit(parsedTiers);
      })
      .catch(() => navigate('/admin/proposals'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleSaveEdit = async () => {
    setSaving(true);
    setError('');
    try {
      const totalNum = Number(editForm.total);
      const payload: Record<string, any> = {
        title: editForm.title,
        intro: editForm.intro || null,
        scope: editForm.scope || null,
        deliverables: editForm.deliverables || null,
        out_of_scope: editForm.out_of_scope || null,
        timeline: editForm.timeline || null,
        pricing_model: editForm.pricing_model || null,
        price_summary: editForm.price_summary || null,
        payment_schedule: editForm.payment_schedule || null,
        client_responsibilities: editForm.client_responsibilities || null,
        acceptance_criteria: editForm.acceptance_criteria || null,
        status: editForm.status,
      };
      if (editForm.total !== '' && !isNaN(totalNum)) {
        payload.total_cents = Math.round(totalNum * 100);
      }
      // Tiers go up as a JSON-encoded string. Empty array → null so the
      // proposal falls back to the legacy resolver.
      payload.tiers =
        tierEdit && tierEdit.length > 0 ? JSON.stringify(tierEdit) : null;
      await api.updateProposal(Number(id), payload);
      setEditing(false);
      load();
    } catch (e: any) {
      setError(e?.message || 'Failed to save proposal.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this proposal? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.deleteProposal(Number(id));
      navigate('/admin/proposals');
    } catch (e: any) {
      setError(e?.message || 'Failed to delete proposal');
      setDeleting(false);
    }
  };

  const handleSend = async () => {
    setSending(true);
    setError('');
    try {
      const result = await api.sendProposal(Number(id));
      setSignUrl(result.sign_url);
      if (result.emailed) {
        setEmailNote(`Emailed the sign link to ${result.recipient}.`);
      } else if (result.recipient) {
        setEmailNote(
          `Could not email ${result.recipient} — copy the link below and send it manually.`
        );
      } else {
        setEmailNote(
          'No email on file for this recipient — copy the link below and send it manually.'
        );
      }
      load();
    } catch (e: any) {
      setError(e?.message || 'Failed to send proposal');
    } finally {
      setSending(false);
    }
  };

  const handleBill = async () => {
    setBilling(true);
    setError('');
    try {
      const res = await api.generateInvoiceFromProposal(Number(id));
      // Land on the draft invoice so the admin can review and push to Stripe.
      navigate(`/admin/invoices/${res.id}`);
    } catch (e: any) {
      setError(e?.message || 'Failed to generate invoice from proposal');
      setBilling(false);
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy to clipboard');
    }
  };

  const publicSignUrl = (token: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/proposals/${token}`;
    }
    return `https://ascendsystems.ai/proposals/${token}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!proposal) return null;

  const tokenUrl = proposal.sign_token ? publicSignUrl(proposal.sign_token) : null;
  const apiSignUrl = signUrl;
  const linkToShow = apiSignUrl || tokenUrl;

  return (
    <div>
      <Link
        to="/admin/proposals"
        className="text-sm text-gray-500 hover:text-charcoal transition-colors mb-4 inline-block"
      >
        ← Back to Proposals
      </Link>

      {/* ─── Admin control bar (sticky-feeling) ───────── */}
      <div className="bg-white border border-surface-100 rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="font-mono text-[10px] text-gray-400 uppercase tracking-[0.18em] mb-1">
              Proposal #{String(proposal.id).padStart(4, '0')}
            </div>
            <h1 className="text-xl font-bold text-charcoal tracking-tight truncate">
              {proposal.title}
            </h1>
            <div className="flex items-center gap-3 mt-1 text-sm">
              {proposal.client_name && proposal.client_id && (
                <Link
                  to={`/admin/clients/${proposal.client_id}`}
                  className="text-orange hover:text-orange-dark transition-colors"
                >
                  {proposal.client_name}
                </Link>
              )}
              {!proposal.client_id && proposal.lead_id && (
                <Link
                  to={`/admin/leads/${proposal.lead_id}`}
                  className="text-orange hover:text-orange-dark transition-colors"
                >
                  {proposal.lead_company || proposal.lead_name} (Lead)
                </Link>
              )}
              <span
                className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize ${
                  statusStyles[proposal.status] || 'bg-gray-100 text-gray-600 border-gray-200'
                }`}
              >
                {proposal.status}
              </span>
              <span className="text-gray-400 text-xs font-mono">
                MSA v{proposal.msa_version || '2026-05'}
                {proposal.msa_accepted ? (
                  <span className="text-green-600"> · accepted</span>
                ) : null}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {(proposal.status === 'draft' || proposal.status === 'sent') && (
              <button
                onClick={handleSend}
                disabled={sending}
                className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {sending
                  ? 'Sending…'
                  : proposal.status === 'draft'
                  ? 'Send Proposal'
                  : 'Resend'}
              </button>
            )}
            {proposal.status === 'accepted' &&
              (proposal.linked_invoice ? (
                <Link
                  to={`/admin/invoices/${proposal.linked_invoice.id}`}
                  className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  View Invoice #{proposal.linked_invoice.id} →
                </Link>
              ) : (
                <button
                  onClick={handleBill}
                  disabled={billing}
                  className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  title="Convert this signed proposal into a detailed draft invoice, then push it to Stripe"
                >
                  {billing ? 'Converting…' : 'Convert to Invoice'}
                </button>
              ))}
            {linkToShow && (
              <a
                href={linkToShow}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold px-3 py-2 rounded-lg border border-surface-200 text-charcoal hover:bg-surface transition-colors"
              >
                Open as client
              </a>
            )}
            <button
              onClick={() => setEditing((v) => !v)}
              className="text-sm font-semibold px-3 py-2 rounded-lg border border-surface-200 text-charcoal hover:bg-surface transition-colors"
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-500 hover:text-red-700 text-sm font-semibold px-2 disabled:opacity-50"
              title="Delete proposal"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

      {linkToShow && (
        <div className="bg-orange-glow border border-orange/30 rounded-2xl p-5 mb-6">
          <div className="font-mono text-[11px] text-orange-dark uppercase tracking-[0.22em] mb-2">
            Client Sign Link
          </div>
          {emailNote && (
            <p className="text-sm font-medium text-charcoal mb-2">{emailNote}</p>
          )}
          <p className="text-xs text-gray-600 mb-3">
            Share this URL with the client. Every visit and signature is logged
            against this token.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="flex-1 min-w-0 truncate text-xs font-mono bg-white border border-surface-200 rounded-lg px-3 py-2 text-charcoal">
              {linkToShow}
            </code>
            <button
              onClick={() => handleCopy(linkToShow!)}
              className="text-xs font-semibold px-3 py-2 rounded-lg bg-charcoal text-white hover:bg-charcoal-light transition-colors"
            >
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </div>
      )}

      {proposal.status === 'accepted' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
          <p className="text-sm font-semibold text-green-800">
            Accepted by {proposal.signer_name || 'client'}
            {proposal.signed_at && (
              <> on {new Date(proposal.signed_at).toLocaleString()}</>
            )}
          </p>
          {proposal.linked_invoice ? (
            <p className="text-xs text-green-700 mt-1.5">
              Billing:{' '}
              <Link
                to={`/admin/invoices/${proposal.linked_invoice.id}`}
                className="font-semibold underline hover:text-green-900"
              >
                Invoice #{proposal.linked_invoice.id}
              </Link>{' '}
              ·{' '}
              {proposal.linked_invoice.billing_type === 'recurring'
                ? `recurring / ${proposal.linked_invoice.recurring_interval || 'month'}`
                : 'one-time'}{' '}
              · <span className="capitalize">{proposal.linked_invoice.status}</span>
            </p>
          ) : (
            <p className="text-xs text-green-700 mt-1.5">
              Not yet invoiced — click <span className="font-semibold">Convert to Invoice</span> to
              generate the detailed draft.
            </p>
          )}
        </div>
      )}

      {/* ─── Editing form OR client-preview document ───────── */}
      {editing ? (
        <EditForm
          form={editForm}
          setForm={setEditForm}
          tiers={tierEdit}
          setTiers={setTierEdit}
          onSave={handleSaveEdit}
          saving={saving}
        />
      ) : (
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <span className="font-mono uppercase tracking-[0.18em]">
              Client Preview
            </span>
            <span className="flex-1 border-t border-surface-100" />
            <span className="text-gray-400">
              what your client sees on the sign page
            </span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-surface-100 shadow-md">
            <ProposalDocument proposal={proposal} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────── Edit form (unchanged behavior) ── */

function EditForm({
  form,
  setForm,
  tiers,
  setTiers,
  onSave,
  saving,
}: {
  form: any;
  setForm: (f: any) => void;
  tiers: Tier[];
  setTiers: (t: Tier[]) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-surface-100 p-6 space-y-6 max-w-3xl">
      <TextInput
        label="Title"
        value={form.title}
        onChange={(v) => setForm({ ...form, title: v })}
      />
      <TextArea
        label="Intro"
        rows={3}
        value={form.intro}
        onChange={(v) => setForm({ ...form, intro: v })}
      />
      <TextArea
        label="Scope"
        rows={4}
        value={form.scope}
        onChange={(v) => setForm({ ...form, scope: v })}
      />
      <TextArea
        label="Deliverables"
        rows={4}
        value={form.deliverables}
        onChange={(v) => setForm({ ...form, deliverables: v })}
      />
      <TextArea
        label="Out of Scope"
        rows={3}
        value={form.out_of_scope}
        onChange={(v) => setForm({ ...form, out_of_scope: v })}
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <TextInput
          label="Timeline"
          value={form.timeline}
          onChange={(v) => setForm({ ...form, timeline: v })}
        />
        <TextInput
          label="Total Amount (USD)"
          type="number"
          value={form.total}
          onChange={(v) => setForm({ ...form, total: v })}
        />
      </div>
      <SelectInput
        label="Pricing Model"
        value={form.pricing_model}
        onChange={(v) => setForm({ ...form, pricing_model: v })}
        options={PRICING_MODELS}
      />

      <div className="pt-2 border-t border-surface-100">
        <TierEditor value={tiers} onChange={setTiers} />
      </div>

      <TextArea
        label="Price Summary (fallback prose)"
        rows={5}
        value={form.price_summary}
        onChange={(v) => setForm({ ...form, price_summary: v })}
      />
      <TextArea
        label="Payment Schedule"
        rows={3}
        value={form.payment_schedule}
        onChange={(v) => setForm({ ...form, payment_schedule: v })}
      />
      <TextArea
        label="Client Responsibilities"
        rows={3}
        value={form.client_responsibilities}
        onChange={(v) => setForm({ ...form, client_responsibilities: v })}
      />
      <TextArea
        label="Acceptance Criteria"
        rows={3}
        value={form.acceptance_criteria}
        onChange={(v) => setForm({ ...form, acceptance_criteria: v })}
      />
      <SelectInput
        label="Status"
        value={form.status}
        onChange={(v) => setForm({ ...form, status: v })}
        options={editableStatuses.map((s) => ({ value: s, label: s }))}
      />
      <div className="flex gap-2 pt-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
      />
    </div>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
      >
        {options.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
}
