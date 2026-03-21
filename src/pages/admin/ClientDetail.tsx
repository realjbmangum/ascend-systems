import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getClient(Number(id))
      .then((data) => {
        setClient(data);
        setNotes(data.notes || '');
      })
      .catch(() => navigate('/admin/clients'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateClient(Number(id), { notes });
      setClient((prev: any) => ({ ...prev, notes }));
    } catch {}
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!client) return null;

  return (
    <div>
      <Link to="/admin/clients" className="text-sm text-gray-500 hover:text-charcoal transition-colors mb-4 inline-block">
        &larr; Back to Clients
      </Link>

      <h1 className="text-2xl font-bold text-charcoal mb-1">{client.company}</h1>
      <p className="text-gray-500 mb-6">{client.contact_name}</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-surface-100 p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Contact Info</h2>
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
            <div>
              <dt className="text-gray-400">Client Since</dt>
              <dd className="text-charcoal font-medium">{new Date(client.created_at).toLocaleDateString()}</dd>
            </div>
          </dl>
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

        {/* Notes */}
        <div className="bg-white rounded-xl border border-surface-100 p-5 md:col-span-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30 resize-y mb-4"
            placeholder="Add internal notes about this client..."
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Notes'}
          </button>
        </div>
      </div>
    </div>
  );
}
