import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

const statuses = ['all', 'open', 'in_progress', 'done'];
const types = ['all', 'lead_inquiry', 'intake_submitted', 'payment_received', 'payment_failed', 'manual'];

const typeStyles: Record<string, string> = {
  lead_inquiry: 'bg-orange/10 text-orange-dark border-orange/30',
  intake_submitted: 'bg-blue-100 text-blue-700 border-blue-200',
  payment_received: 'bg-green-100 text-green-700 border-green-200',
  payment_failed: 'bg-red-100 text-red-700 border-red-200',
  manual: 'bg-gray-100 text-gray-700 border-gray-200',
};

const priorityStyles: Record<string, string> = {
  low: 'text-gray-400',
  medium: 'text-charcoal',
  high: 'text-orange',
  urgent: 'text-red-600',
};

const statusStyles: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-orange-glow text-orange-dark',
  done: 'bg-green-100 text-green-700',
};

function formatType(t: string) {
  return t.replace(/_/g, ' ');
}

function formatMeta(metadata_json: string | null | undefined) {
  if (!metadata_json) return null;
  try {
    return JSON.parse(metadata_json);
  } catch {
    return metadata_json;
  }
}

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('open');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    api
      .getTasks({
        status: statusFilter === 'all' ? undefined : statusFilter,
        type: typeFilter === 'all' ? undefined : typeFilter,
      })
      .then(setTasks)
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter, typeFilter]);

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await api.updateTask(id, { status });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status, completed_at: status === 'done' ? new Date().toISOString() : t.completed_at } : t))
      );
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = tasks.reduce(
    (acc: Record<string, number>, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Task Queue</h1>
          <p className="text-sm text-gray-500 mt-1">
            Auto-generated from form submissions, payments, and manual entries.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
            aria-label="Filter by status"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All statuses' : s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
            aria-label="Filter by type"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t === 'all' ? 'All types' : formatType(t)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick counts */}
      {!loading && tasks.length > 0 && (
        <div className="flex gap-4 mb-4 text-xs text-gray-500">
          {Object.entries(counts).map(([s, n]) => (
            <span key={s}>
              <span className="font-semibold text-charcoal">{n}</span> {formatType(s)}
            </span>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-surface-100 p-12 text-center text-gray-400">
          No tasks match this filter.
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => {
            const expanded = expandedId === task.id;
            const meta = formatMeta(task.metadata_json);
            return (
              <div
                key={task.id}
                className={`bg-white rounded-xl border ${typeStyles[task.type] || 'border-surface-100'} overflow-hidden`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : task.id)}
                  className="w-full text-left p-4 flex items-start gap-3 hover:bg-surface/30 transition-colors"
                >
                  <span
                    className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded ${
                      typeStyles[task.type] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {formatType(task.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-charcoal truncate">{task.title}</h3>
                      {task.priority && task.priority !== 'medium' && (
                        <span className={`text-[11px] font-medium ${priorityStyles[task.priority] || 'text-charcoal'}`}>
                          {task.priority}
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{task.description}</p>
                    )}
                    <p className="text-[11px] text-gray-400 mt-1">
                      {new Date(task.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize whitespace-nowrap ${
                      statusStyles[task.status] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {formatType(task.status)}
                  </span>
                </button>

                {expanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-surface-100 bg-surface/20">
                    {task.description && (
                      <div className="mt-3">
                        <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Description
                        </h4>
                        <p className="text-sm text-charcoal whitespace-pre-wrap">{task.description}</p>
                      </div>
                    )}
                    {(task.client_id || task.lead_id) && (
                      <div className="mt-3 flex gap-4 text-xs text-gray-500">
                        {task.lead_id && <span>Lead #{task.lead_id}</span>}
                        {task.client_id && <span>Client #{task.client_id}</span>}
                      </div>
                    )}
                    {meta && (
                      <div className="mt-3">
                        <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Metadata
                        </h4>
                        <pre className="text-xs bg-charcoal text-gray-200 rounded-lg p-3 overflow-x-auto">
                          {typeof meta === 'string' ? meta : JSON.stringify(meta, null, 2)}
                        </pre>
                      </div>
                    )}
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {task.status !== 'open' && (
                        <button
                          onClick={() => updateStatus(task.id, 'open')}
                          disabled={updatingId === task.id}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-surface-200 text-charcoal hover:bg-white transition-colors disabled:opacity-50"
                        >
                          Reopen
                        </button>
                      )}
                      {task.status === 'open' && (
                        <button
                          onClick={() => updateStatus(task.id, 'in_progress')}
                          disabled={updatingId === task.id}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-charcoal text-white hover:bg-charcoal-light transition-colors disabled:opacity-50"
                        >
                          Start working
                        </button>
                      )}
                      {task.status !== 'done' && (
                        <button
                          onClick={() => updateStatus(task.id, 'done')}
                          disabled={updatingId === task.id}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange text-white hover:bg-orange-dark transition-colors disabled:opacity-50"
                        >
                          {updatingId === task.id ? 'Saving...' : 'Mark done'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
