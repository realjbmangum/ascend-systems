import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import StatusBadge from '../../components/StatusBadge';

export default function PortalProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getPortalProjects()
      .then(setProjects)
      .catch((err) => setError(err.message || 'Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">Your Projects</h1>
        <p className="text-gray-500 mt-1">Track progress and updates on every project we're building for you.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm mb-6">
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No projects yet. We'll post here once your project kicks off.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((p) => (
            <Link
              key={p.id}
              to={`/portal/projects/${p.id}`}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-orange hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="text-lg font-bold text-charcoal">{p.name}</h2>
                <StatusBadge status={p.status} />
              </div>
              {p.project_type && (
                <p className="text-sm text-gray-500 mb-3">{p.project_type}</p>
              )}
              {p.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{p.description}</p>
              )}
              <div className="text-xs text-gray-400">
                {p.started_at
                  ? `Started ${new Date(p.started_at).toLocaleDateString()}`
                  : 'Not started yet'}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
