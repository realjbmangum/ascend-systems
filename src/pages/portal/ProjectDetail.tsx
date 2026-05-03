import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import StatusBadge from '../../components/StatusBadge';

export default function PortalProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api
      .getPortalProject(Number(id))
      .then(setProject)
      .catch((err) => setError(err.message || 'Failed to load project'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
        {error || 'Project not found.'}
      </div>
    );
  }

  const notes = project.notes || [];

  return (
    <div>
      <Link
        to="/portal/projects"
        className="text-sm text-gray-500 hover:text-orange transition-colors inline-flex items-center gap-1 mb-6"
      >
        &larr; All projects
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-charcoal">{project.name}</h1>
            {project.project_type && (
              <p className="text-sm text-gray-500 mt-1">{project.project_type}</p>
            )}
          </div>
          <StatusBadge status={project.status} />
        </div>

        {project.description && (
          <p className="text-gray-700 leading-relaxed mb-4">{project.description}</p>
        )}

        <dl className="grid sm:grid-cols-2 gap-4 text-sm pt-4 border-t border-gray-100">
          <div>
            <dt className="text-gray-400 text-xs uppercase tracking-wide">Started</dt>
            <dd className="text-charcoal mt-1">
              {project.started_at
                ? new Date(project.started_at).toLocaleDateString()
                : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-gray-400 text-xs uppercase tracking-wide">Completed</dt>
            <dd className="text-charcoal mt-1">
              {project.completed_at
                ? new Date(project.completed_at).toLocaleDateString()
                : '—'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-charcoal mb-4">Updates</h2>
        {notes.length === 0 ? (
          <p className="text-sm text-gray-500">No updates posted yet.</p>
        ) : (
          <ul className="space-y-4">
            {notes.map((note: any) => (
              <li key={note.id} className="border-l-2 border-orange pl-4 py-1">
                <div className="text-xs text-gray-400 mb-1">
                  {note.author || 'Brian'} ·{' '}
                  {new Date(note.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <p className="text-sm text-charcoal whitespace-pre-wrap">{note.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
