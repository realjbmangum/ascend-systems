import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import StatusBadge from '../../components/StatusBadge';

const statuses = ['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'];

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getLead(Number(id))
      .then((data) => {
        setLead(data);
        setNotes(data.notes || '');
        setStatus(data.status);
        setCompany(data.company || '');
        setMessage(data.message || '');
      })
      .catch(() => navigate('/admin/leads'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateLead(Number(id), { notes, status, company, message });
      setLead((prev: any) => ({ ...prev, notes, status, company, message }));
      setEditing(false);
    } catch {}
    setSaving(false);
  };

  const handleConvert = async () => {
    if (!confirm('Convert this lead to a client? This will create a new client and project.')) return;
    setConverting(true);
    try {
      await api.convertLead(Number(id));
      navigate('/admin/clients');
    } catch {}
    setConverting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div>
      <Link to="/admin/leads" className="text-sm text-gray-500 hover:text-charcoal transition-colors mb-4 inline-block">
        &larr; Back to Leads
      </Link>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">{lead.name}</h1>
          {lead.company && <p className="text-gray-500">{lead.company}</p>}
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={lead.status} />
          <button
            onClick={() => setEditing((v) => !v)}
            className="text-sm font-semibold px-4 py-2 rounded-lg border border-surface-200 text-charcoal hover:bg-surface transition-colors"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-surface-100 p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Contact Info</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-400">Email</dt>
              <dd className="text-charcoal font-medium">{lead.email}</dd>
            </div>
            {lead.phone && (
              <div>
                <dt className="text-gray-400">Phone</dt>
                <dd className="text-charcoal font-medium">{lead.phone}</dd>
              </div>
            )}
            <div>
              <dt className="text-gray-400">Project Type</dt>
              <dd className="text-charcoal font-medium">{lead.project_type}</dd>
            </div>
            {lead.budget && (
              <div>
                <dt className="text-gray-400">Budget</dt>
                <dd className="text-charcoal font-medium">{lead.budget}</dd>
              </div>
            )}
            <div>
              <dt className="text-gray-400">Submitted</dt>
              <dd className="text-charcoal font-medium">{new Date(lead.created_at).toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        {/* Message */}
        <div className="bg-white rounded-xl border border-surface-100 p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Message</h2>
          {editing ? (
            <>
              <label htmlFor="lead-company" className="block text-xs font-medium text-gray-500 mb-1">Company</label>
              <input
                id="lead-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30 mb-3"
              />
              <label htmlFor="lead-message" className="block text-xs font-medium text-gray-500 mb-1">Message</label>
              <textarea
                id="lead-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30 resize-y"
              />
            </>
          ) : (
            <p className="text-sm text-charcoal leading-relaxed whitespace-pre-wrap">
              {lead.message || 'No message provided.'}
            </p>
          )}
        </div>

        {/* Status & Notes */}
        <div className="bg-white rounded-xl border border-surface-100 p-5 md:col-span-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Manage Lead</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="lead-status" className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select
                id="lead-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="lead-notes" className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
            <textarea
              id="lead-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30 resize-y"
              placeholder="Add internal notes about this lead..."
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
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
        </div>
      </div>
    </div>
  );
}
