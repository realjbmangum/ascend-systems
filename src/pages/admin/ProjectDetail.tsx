import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import StatusBadge from '../../components/StatusBadge';

const statuses = ['planning', 'in_progress', 'on_hold', 'completed', 'cancelled'];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProject(Number(id))
      .then((data) => {
        setProject(data);
        setNotes(data.notes || '');
        setStatus(data.status);
      })
      .catch(() => navigate('/admin/projects'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProject(Number(id), { notes, status });
      setProject((prev: any) => ({ ...prev, notes, status }));
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

  if (!project) return null;

  return (
    <div>
      <Link to="/admin/projects" className="text-sm text-gray-500 hover:text-charcoal transition-colors mb-4 inline-block">
        &larr; Back to Projects
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">{project.name}</h1>
          {project.client_name && (
            <Link to={`/admin/clients/${project.client_id}`} className="text-sm text-orange hover:text-orange-dark transition-colors">
              {project.client_name}
            </Link>
          )}
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Details */}
        <div className="bg-white rounded-xl border border-surface-100 p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Project Details</h2>
          <dl className="space-y-3 text-sm">
            {project.project_type && (
              <div>
                <dt className="text-gray-400">Type</dt>
                <dd className="text-charcoal font-medium">{project.project_type}</dd>
              </div>
            )}
            {project.description && (
              <div>
                <dt className="text-gray-400">Description</dt>
                <dd className="text-charcoal font-medium whitespace-pre-wrap">{project.description}</dd>
              </div>
            )}
            {project.start_date && (
              <div>
                <dt className="text-gray-400">Start Date</dt>
                <dd className="text-charcoal font-medium">{new Date(project.start_date).toLocaleDateString()}</dd>
              </div>
            )}
            <div>
              <dt className="text-gray-400">Created</dt>
              <dd className="text-charcoal font-medium">{new Date(project.created_at).toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>

        {/* Status & Notes */}
        <div className="bg-white rounded-xl border border-surface-100 p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Manage</h2>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select
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
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30 resize-y"
              placeholder="Add internal notes about this project..."
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
