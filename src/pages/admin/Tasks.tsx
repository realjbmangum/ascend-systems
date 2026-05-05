import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [creating, setCreating] = useState(false);

  // Edit modal state
  const [editTask, setEditTask] = useState<any | null>(null);
  const [eTitle, setETitle] = useState('');
  const [eDesc, setEDesc] = useState('');
  const [ePriority, setEPriority] = useState('medium');
  const [eType, setEType] = useState('manual');
  const [eProjectId, setEProjectId] = useState<string>('');
  const [eSaving, setESaving] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    api.getProjects().then(setProjects).catch(() => setProjects([]));
  }, []);

  const openEdit = (task: any) => {
    setEditTask(task);
    setETitle(task.title || '');
    setEDesc(task.description || '');
    setEPriority(task.priority || 'medium');
    setEType(task.type || 'manual');
    setEProjectId(task.project_id ? String(task.project_id) : '');
  };

  const saveEdit = async () => {
    if (!editTask) return;
    setESaving(true);
    try {
      await api.updateTask(editTask.id, {
        title: eTitle,
        description: eDesc,
        priority: ePriority,
        type: eType,
        project_id: eProjectId ? parseInt(eProjectId, 10) : null,
      });
      setEditTask(null);
      load();
    } catch (err: any) {
      alert(err.message || 'Save failed');
    } finally {
      setESaving(false);
    }
  };

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

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this task? This cannot be undone.')) return;
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch {
      // ignore
    }
  };

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
          <button
            onClick={() => setShowCreate(true)}
            className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Create Task
          </button>
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

      {/* Create task modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-surface-100 w-full max-w-md shadow-xl">
            <div className="p-5 border-b border-surface-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-charcoal">New Task</h2>
              <button type="button" onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-charcoal text-2xl leading-none">&times;</button>
            </div>
            <div className="p-5 space-y-3">
              <input
                type="text"
                placeholder="Title *"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange/30"
              />
              <textarea
                placeholder="Description (optional)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={3}
                className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange/30 resize-none"
              />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange/30"
              >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="p-5 border-t border-surface-100 flex justify-end gap-2">
              <button type="button" onClick={() => setShowCreate(false)} className="text-sm font-semibold px-4 py-2 rounded-lg text-charcoal hover:bg-surface transition-colors">Cancel</button>
              <button
                type="button"
                disabled={!newTitle.trim() || creating}
                onClick={async () => {
                  if (!newTitle.trim()) return;
                  setCreating(true);
                  try {
                    await api.createTask({ type: 'manual', title: newTitle, description: newDesc || undefined, priority: newPriority });
                    setNewTitle(''); setNewDesc(''); setNewPriority('medium');
                    setShowCreate(false);
                    load();
                  } catch {} finally { setCreating(false); }
                }}
                className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {creating ? 'Saving…' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                    {(task.client_id || task.lead_id || task.project_id) && (
                      <div className="mt-3 flex gap-4 text-xs text-gray-500 flex-wrap">
                        {task.lead_id && <span>Lead #{task.lead_id}</span>}
                        {task.client_id && <span>Client #{task.client_id}</span>}
                        {task.project_id && (
                          <Link
                            to={`/admin/projects/${task.project_id}`}
                            className="text-orange hover:text-orange-dark font-medium"
                          >
                            View Project
                          </Link>
                        )}
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
                      <button
                        onClick={() => openEdit(task)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-surface-200 text-charcoal hover:bg-white transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="ml-auto text-red-500 hover:text-red-700 text-sm font-semibold"
                        title="Delete task"
                        aria-label="Delete task"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Task modal */}
      {editTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-charcoal">Edit Task</h3>
              <button
                onClick={() => setEditTask(null)}
                className="text-gray-400 hover:text-charcoal"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                <input
                  type="text"
                  value={eTitle}
                  onChange={(e) => setETitle(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea
                  value={eDesc}
                  onChange={(e) => setEDesc(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 resize-y"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Priority</label>
                  <select
                    value={ePriority}
                    onChange={(e) => setEPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
                  <input
                    type="text"
                    value={eType}
                    onChange={(e) => setEType(e.target.value)}
                    className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Project</label>
                <select
                  value={eProjectId}
                  onChange={(e) => setEProjectId(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30"
                >
                  <option value="">— No project —</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setEditTask(null)}
                className="text-sm font-semibold px-4 py-2 rounded-lg border border-surface-200 text-charcoal hover:bg-surface-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={eSaving}
                className="text-sm font-semibold px-4 py-2 rounded-lg bg-orange text-white hover:bg-orange-dark transition-colors disabled:opacity-50"
              >
                {eSaving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
