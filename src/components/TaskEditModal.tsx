import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface Task {
  id: number;
  title?: string;
  description?: string;
  priority?: string;
  type?: string;
  project_id?: number | null;
  status?: string;
}

interface Project {
  id: number;
  name: string;
}

interface Props {
  task: Task | null;
  projects?: Project[];
  /** If true, hides the project picker (when used inside a project page). */
  lockProject?: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function TaskEditModal({
  task,
  projects,
  lockProject,
  onClose,
  onSaved,
}: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [type, setType] = useState('manual');
  const [projectId, setProjectId] = useState<string>('');
  const [status, setStatus] = useState('open');
  const [saving, setSaving] = useState(false);
  const [internalProjects, setInternalProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'medium');
      setType(task.type || 'manual');
      setProjectId(task.project_id ? String(task.project_id) : '');
      setStatus(task.status || 'open');
    }
  }, [task]);

  // Lazy-load project list if not provided.
  useEffect(() => {
    if (!projects && !lockProject && task) {
      api
        .getProjects()
        .then(setInternalProjects)
        .catch(() => setInternalProjects([]));
    }
  }, [projects, lockProject, task]);

  if (!task) return null;

  const projectOptions = projects ?? internalProjects;

  const save = async () => {
    setSaving(true);
    try {
      const patch: Record<string, any> = {
        title,
        description,
        priority,
        type,
        status,
      };
      if (!lockProject) {
        patch.project_id = projectId ? parseInt(projectId, 10) : null;
      }
      await api.updateTask(task.id, patch);
      onSaved();
      onClose();
    } catch (err: any) {
      alert(err?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm('Delete this task?')) return;
    setSaving(true);
    try {
      await api.deleteTask(task.id);
      onSaved();
      onClose();
    } catch (err: any) {
      alert(err?.message || 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-charcoal">Edit Task</h3>
          <button
            onClick={onClose}
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 resize-y"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
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
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30"
              />
            </div>
          </div>
          {!lockProject && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30"
              >
                <option value="">— No project —</option>
                {projectOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-5">
          <button
            onClick={remove}
            disabled={saving}
            className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            Delete
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="text-sm font-semibold px-4 py-2 rounded-lg border border-surface-200 text-charcoal hover:bg-surface-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-orange text-white hover:bg-orange-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
