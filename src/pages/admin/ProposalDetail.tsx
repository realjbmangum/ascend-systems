import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { PRICING_MODELS } from './CreateProposal';

const pricingLabel = (v?: string) =>
  PRICING_MODELS.find((m) => m.value === (v || ''))?.label || 'Not specified';

const statusStyles: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
};

const editableStatuses = ['draft', 'sent', 'accepted', 'declined'];

function formatMoney(cents: number) {
  return `$${((cents || 0) / 100).toFixed(2)}`;
}

function publicSignUrl(token: string) {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/proposals/${token}`;
  }
  return `https://ascendsystems.ai/proposals/${token}`;
}

export default function ProposalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
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
          total:
            data.total_cents != null ? (data.total_cents / 100).toFixed(2) : '',
          status: data.status || 'draft',
        });
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

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!proposal) return null;

  const tokenUrl = proposal.sign_token
    ? publicSignUrl(proposal.sign_token)
    : null;
  const apiSignUrl = signUrl;

  return (
    <div>
      <Link
        to="/admin/proposals"
        className="text-sm text-gray-500 hover:text-charcoal transition-colors mb-4 inline-block"
      >
        &larr; Back to Proposals
      </Link>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">{proposal.title}</h1>
          {proposal.client_name && proposal.client_id && (
            <Link
              to={`/admin/clients/${proposal.client_id}`}
              className="text-sm text-orange hover:text-orange-dark transition-colors"
            >
              {proposal.client_name}
            </Link>
          )}
          {!proposal.client_id && proposal.lead_id && (
            <Link
              to={`/admin/leads/${proposal.lead_id}`}
              className="text-sm text-orange hover:text-orange-dark transition-colors"
            >
              {proposal.lead_company || proposal.lead_name} (Lead)
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
              statusStyles[proposal.status] || 'bg-gray-100 text-gray-600'
            }`}
          >
            {proposal.status}
          </span>
          {(proposal.status === 'draft' || proposal.status === 'sent') && (
            <button
              onClick={handleSend}
              disabled={sending}
              className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {sending
                ? 'Sending...'
                : proposal.status === 'draft'
                ? 'Send Proposal'
                : 'Resend'}
            </button>
          )}
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

      {(apiSignUrl || (proposal.status === 'sent' && tokenUrl)) && (
        <div className="bg-orange/5 border border-orange/30 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-charcoal mb-2">
            Client sign link
          </h2>
          {emailNote && (
            <p className="text-xs font-medium text-charcoal mb-2">
              {emailNote}
            </p>
          )}
          <p className="text-xs text-gray-600 mb-3">
            Share this URL with the client to review and sign the proposal.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="flex-1 min-w-0 truncate text-xs font-mono bg-white border border-surface-200 rounded-lg px-3 py-2 text-charcoal">
              {apiSignUrl || tokenUrl}
            </code>
            <button
              onClick={() => handleCopy(apiSignUrl || tokenUrl!)}
              className="text-xs font-semibold px-3 py-2 rounded-lg bg-charcoal text-white hover:bg-charcoal-light transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <a
              href={apiSignUrl || tokenUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-3 py-2 rounded-lg border border-surface-200 text-charcoal hover:bg-surface transition-colors"
            >
              Open
            </a>
          </div>
        </div>
      )}

      {proposal.status === 'accepted' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
          <p className="text-sm font-semibold text-green-800">
            Accepted by {proposal.signer_name || 'client'}
            {proposal.signed_at && (
              <>
                {' '}
                on {new Date(proposal.signed_at).toLocaleString()}
              </>
            )}
          </p>
        </div>
      )}

      {editing ? (
        <div className="bg-white rounded-xl border border-surface-100 p-6 space-y-4 max-w-3xl">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Title
            </label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Intro
            </label>
            <textarea
              rows={3}
              value={editForm.intro}
              onChange={(e) => setEditForm({ ...editForm, intro: e.target.value })}
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Scope
            </label>
            <textarea
              rows={4}
              value={editForm.scope}
              onChange={(e) => setEditForm({ ...editForm, scope: e.target.value })}
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Deliverables
            </label>
            <textarea
              rows={4}
              value={editForm.deliverables}
              onChange={(e) =>
                setEditForm({ ...editForm, deliverables: e.target.value })
              }
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Out of Scope
            </label>
            <textarea
              rows={3}
              value={editForm.out_of_scope}
              onChange={(e) =>
                setEditForm({ ...editForm, out_of_scope: e.target.value })
              }
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Timeline
              </label>
              <input
                type="text"
                value={editForm.timeline}
                onChange={(e) =>
                  setEditForm({ ...editForm, timeline: e.target.value })
                }
                className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Total Amount (USD)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={editForm.total}
                onChange={(e) =>
                  setEditForm({ ...editForm, total: e.target.value })
                }
                className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Pricing Model
            </label>
            <select
              value={editForm.pricing_model}
              onChange={(e) =>
                setEditForm({ ...editForm, pricing_model: e.target.value })
              }
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
            >
              {PRICING_MODELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Price Summary
            </label>
            <textarea
              rows={3}
              value={editForm.price_summary}
              onChange={(e) =>
                setEditForm({ ...editForm, price_summary: e.target.value })
              }
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Payment Schedule
            </label>
            <textarea
              rows={3}
              value={editForm.payment_schedule}
              onChange={(e) =>
                setEditForm({ ...editForm, payment_schedule: e.target.value })
              }
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Client Responsibilities
            </label>
            <textarea
              rows={3}
              value={editForm.client_responsibilities}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  client_responsibilities: e.target.value,
                })
              }
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Acceptance Criteria
            </label>
            <textarea
              rows={3}
              value={editForm.acceptance_criteria}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  acceptance_criteria: e.target.value,
                })
              }
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Status
            </label>
            <select
              value={editForm.status}
              onChange={(e) =>
                setEditForm({ ...editForm, status: e.target.value })
              }
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
            >
              {editableStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-surface-100 p-6 space-y-6">
            {proposal.intro && (
              <Section title="Intro" body={proposal.intro} />
            )}
            {proposal.scope && (
              <Section title="Scope" body={proposal.scope} />
            )}
            {proposal.deliverables && (
              <Section title="Deliverables" body={proposal.deliverables} />
            )}
            {proposal.out_of_scope && (
              <Section title="Out of Scope" body={proposal.out_of_scope} />
            )}
            {proposal.timeline && (
              <Section title="Timeline" body={proposal.timeline} />
            )}
            {proposal.pricing_model && (
              <Section
                title="Pricing Model"
                body={pricingLabel(proposal.pricing_model)}
              />
            )}
            {proposal.price_summary && (
              <Section title="Price Summary" body={proposal.price_summary} />
            )}
            {proposal.payment_schedule && (
              <Section
                title="Payment Schedule"
                body={proposal.payment_schedule}
              />
            )}
            {proposal.client_responsibilities && (
              <Section
                title="Client Responsibilities"
                body={proposal.client_responsibilities}
              />
            )}
            {proposal.acceptance_criteria && (
              <Section
                title="Acceptance Criteria"
                body={proposal.acceptance_criteria}
              />
            )}
            {proposal.total_cents > 0 && (
              <div className="border-t border-surface-100 pt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Total
                </span>
                <span className="text-xl font-bold text-charcoal">
                  {formatMoney(proposal.total_cents)}
                </span>
              </div>
            )}
            {!proposal.intro &&
              !proposal.scope &&
              !proposal.deliverables &&
              !proposal.out_of_scope &&
              !proposal.timeline &&
              !proposal.pricing_model &&
              !proposal.price_summary &&
              !proposal.payment_schedule &&
              !proposal.client_responsibilities &&
              !proposal.acceptance_criteria &&
              proposal.total_cents <= 0 && (
                <p className="text-sm text-gray-400">
                  This proposal has no content yet. Click Edit to add details.
                </p>
              )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-surface-100 p-5">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Details
              </h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-400 text-xs">Status</dt>
                  <dd className="text-charcoal font-medium capitalize">
                    {proposal.status}
                  </dd>
                </div>
                {proposal.client_name && (
                  <div>
                    <dt className="text-gray-400 text-xs">Client</dt>
                    <dd className="text-charcoal font-medium">
                      {proposal.client_name}
                    </dd>
                  </div>
                )}
                {!proposal.client_id && proposal.lead_id && (
                  <div>
                    <dt className="text-gray-400 text-xs">Lead</dt>
                    <dd className="text-charcoal font-medium">
                      {proposal.lead_company || proposal.lead_name}
                    </dd>
                  </div>
                )}
                {proposal.project_name && proposal.project_id && (
                  <div>
                    <dt className="text-gray-400 text-xs">Project</dt>
                    <dd>
                      <Link
                        to={`/admin/projects/${proposal.project_id}`}
                        className="text-orange hover:text-orange-dark font-medium"
                      >
                        {proposal.project_name}
                      </Link>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-400 text-xs">Created</dt>
                  <dd className="text-charcoal font-medium">
                    {new Date(proposal.created_at).toLocaleDateString()}
                  </dd>
                </div>
                {proposal.signed_at && (
                  <div>
                    <dt className="text-gray-400 text-xs">Signed</dt>
                    <dd className="text-green-700 font-medium">
                      {new Date(proposal.signed_at).toLocaleString()}
                    </dd>
                  </div>
                )}
                {proposal.signer_name && (
                  <div>
                    <dt className="text-gray-400 text-xs">Signer</dt>
                    <dd className="text-charcoal font-medium">
                      {proposal.signer_name}
                      {proposal.signer_title
                        ? `, ${proposal.signer_title}`
                        : ''}
                    </dd>
                    {proposal.signer_email && (
                      <dd className="text-gray-500 text-xs">
                        {proposal.signer_email}
                      </dd>
                    )}
                  </div>
                )}
                <div>
                  <dt className="text-gray-400 text-xs">Governing terms</dt>
                  <dd className="text-charcoal font-medium">
                    MSA v{proposal.msa_version || '2026-05'}
                    {proposal.msa_accepted ? (
                      <span className="text-green-700"> · accepted</span>
                    ) : (
                      <span className="text-gray-400"> · not yet accepted</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {title}
      </h2>
      <p className="text-charcoal whitespace-pre-wrap leading-relaxed">{body}</p>
    </div>
  );
}
