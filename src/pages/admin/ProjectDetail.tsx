import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import StatusBadge from '../../components/StatusBadge';
import ProjectAnalyticsPanel from '../../components/ProjectAnalyticsPanel';

const statuses = ['planning', 'scoping', 'in_progress', 'on_hold', 'completed', 'cancelled'];

const projectTypes = [
  'Web/App Development',
  'AI Integration',
  'Business Automation',
  'AI Phone Solution',
  'Other',
];

interface Note {
  id: number;
  project_id: number;
  author: string;
  content: string;
  visible_to_client: number | boolean;
  created_at: string;
  updated_at?: string;
}

type Tab = 'overview' | 'notes' | 'files';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('');
  const [zoneTag, setZoneTag] = useState('');
  const [analyticsDomain, setAnalyticsDomain] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('overview');

  // Tasks for this project
  const [projectTasks, setProjectTasks] = useState<any[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [savingTask, setSavingTask] = useState(false);

  // Files tab state
  const [files, setFiles] = useState<any[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState('');

  // Notes tab state
  const [projectNotes, setProjectNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newNoteVisible, setNewNoteVisible] = useState(false);
  const [postingNote, setPostingNote] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [noteError, setNoteError] = useState('');

  useEffect(() => {
    api
      .getProject(Number(id))
      .then((data) => {
        setProject(data);
        setNotes(data.notes || '');
        setStatus(data.status);
        setName(data.name || '');
        setDescription(data.description || '');
        setProjectType(data.project_type || '');
        setZoneTag(data.cloudflare_zone_tag || '');
        setAnalyticsDomain(data.analytics_domain || '');
      })
      .catch(() => navigate('/admin/projects'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (tab !== 'files' || !id) return;
    setFilesLoading(true);
    api
      .getProjectFiles(Number(id))
      .then(setFiles)
      .catch(() => setFiles([]))
      .finally(() => setFilesLoading(false));
  }, [tab, id]);

  useEffect(() => {
    if (tab !== 'notes' || !id) return;
    setNotesLoading(true);
    api
      .getProjectNotes(Number(id))
      .then(setProjectNotes)
      .catch(() => setProjectNotes([]))
      .finally(() => setNotesLoading(false));
  }, [tab, id]);

  useEffect(() => {
    if (!id) return;
    api
      .getProjectTasks(Number(id))
      .then(setProjectTasks)
      .catch(() => setProjectTasks([]));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.deleteProject(Number(id));
      navigate('/admin/projects');
    } catch {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        notes,
        status,
        name,
        description,
        project_type: projectType,
        cloudflare_zone_tag: zoneTag || null,
        analytics_domain: analyticsDomain || null,
      };
      await api.updateProject(Number(id), payload);
      setProject((prev: any) => ({ ...prev, ...payload }));
      setEditing(false);
    } catch {}
    setSaving(false);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setPostingNote(true);
    setNoteError('');
    try {
      await api.createProjectNote(Number(id), {
        content: newNote,
        visible_to_client: newNoteVisible ? 1 : 0,
      });
      const refreshed = await api.getProjectNotes(Number(id));
      setProjectNotes(refreshed);
      setNewNote('');
      setNewNoteVisible(false);
    } catch (e: any) {
      setNoteError(e?.message || 'Failed to add note');
    } finally {
      setPostingNote(false);
    }
  };

  const toggleVisible = async (note: Note) => {
    const newVal = note.visible_to_client ? 0 : 1;
    try {
      await api.updateProjectNote(Number(id), note.id, { visible_to_client: newVal });
      setProjectNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, visible_to_client: newVal } : n))
      );
    } catch {
      // ignore
    }
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const saveEdit = async (note: Note) => {
    if (!editContent.trim()) return;
    try {
      await api.updateProjectNote(Number(id), note.id, { content: editContent });
      setProjectNotes((prev) =>
        prev.map((n) =>
          n.id === note.id
            ? { ...n, content: editContent, updated_at: new Date().toISOString() }
            : n
        )
      );
      cancelEdit();
    } catch (e: any) {
      setNoteError(e?.message || 'Failed to save');
    }
  };

  const deleteNote = async (note: Note) => {
    if (!confirm('Delete this note?')) return;
    try {
      await api.deleteProjectNote(Number(id), note.id);
      setProjectNotes((prev) => prev.filter((n) => n.id !== note.id));
    } catch (e: any) {
      setNoteError(e?.message || 'Failed to delete');
    }
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

      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">{project.name}</h1>
          {project.client_name && (
            <Link to={`/admin/clients/${project.client_id}`} className="text-sm text-orange hover:text-orange-dark transition-colors">
              {project.client_name}
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={project.status} />
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

      {/* Tabs */}
      <div className="border-b border-surface-100 mb-6 flex gap-1">
        {([
          { id: 'overview', label: 'Overview' },
          { id: 'notes', label: 'Notes' },
          { id: 'files', label: 'Files' },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? 'border-orange text-orange'
                : 'border-transparent text-gray-500 hover:text-charcoal'
            }`}
          >
            {t.label}
            {t.id === 'notes' && projectNotes.length > 0 && (
              <span className="ml-2 text-[10px] font-bold text-gray-500">{projectNotes.length}</span>
            )}
            {t.id === 'files' && files.length > 0 && (
              <span className="ml-2 text-[10px] font-bold text-gray-500">{files.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
        <div className="mb-6">
          <ProjectAnalyticsPanel
            projectId={Number(id)}
            zoneTag={project.cloudflare_zone_tag || null}
            domain={project.analytics_domain || null}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Details */}
          <div className="bg-white rounded-xl border border-surface-100 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Project Details</h2>
            {editing ? (
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
                  >
                    <option value="">--</option>
                    {projectTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30 resize-y"
                  />
                </div>
                <div className="pt-3 border-t border-surface-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Analytics</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Domain (display only)</label>
                      <input
                        type="text"
                        value={analyticsDomain}
                        onChange={(e) => setAnalyticsDomain(e.target.value)}
                        placeholder="e.g. scdmvappointments.com"
                        className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Cloudflare Zone Tag</label>
                      <input
                        type="text"
                        value={zoneTag}
                        onChange={(e) => setZoneTag(e.target.value)}
                        placeholder="32-char hex from CF dashboard"
                        className="w-full text-sm font-mono border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        CF Dashboard → site → API tab → Zone ID. Leave blank to use manual snapshots only.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
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
            )}
          </div>

          {/* Status & Notes (legacy single field) */}
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
              <label className="block text-xs font-medium text-gray-500 mb-1">Internal Summary</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30 resize-y"
                placeholder="High-level project summary..."
              />
              <p className="text-[11px] text-gray-400 mt-1">
                For threaded notes with client visibility, use the Notes tab.
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Tasks */}
          <div className="md:col-span-2 bg-white rounded-xl border border-surface-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Tasks</h2>
              <button
                type="button"
                onClick={() => setShowTaskForm((v) => !v)}
                className="text-xs font-semibold text-orange hover:text-orange-dark"
              >
                + Add Task
              </button>
            </div>
            {showTaskForm && (
              <div className="mb-4 p-3 rounded-lg border border-surface-200 bg-surface/30 flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange/30"
                />
                <div className="flex gap-2">
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange/30"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <button
                    type="button"
                    disabled={!newTaskTitle.trim() || savingTask}
                    onClick={async () => {
                      if (!newTaskTitle.trim()) return;
                      setSavingTask(true);
                      try {
                        await api.createTask({
                          type: 'manual',
                          title: newTaskTitle,
                          priority: newTaskPriority,
                          project_id: Number(id),
                          client_id: project?.client_id ?? null,
                        });
                        const refreshed = await api.getProjectTasks(Number(id));
                        setProjectTasks(refreshed);
                        setNewTaskTitle('');
                        setShowTaskForm(false);
                      } catch {} finally { setSavingTask(false); }
                    }}
                    className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {savingTask ? 'Saving…' : 'Save'}
                  </button>
                  <button type="button" onClick={() => setShowTaskForm(false)} className="text-sm text-gray-400 hover:text-charcoal px-2">Cancel</button>
                </div>
              </div>
            )}
            {projectTasks.length === 0 ? (
              <p className="text-sm text-gray-400">No tasks linked to this project.</p>
            ) : (
              <ul className="space-y-2">
                {projectTasks.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-surface-100 bg-surface/30"
                  >
                    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded bg-gray-100 text-gray-600">
                      {(t.type || 'manual').replace(/_/g, ' ')}
                    </span>
                    <span className="flex-1 text-sm font-medium text-charcoal truncate">{t.title}</span>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize whitespace-nowrap ${
                        t.status === 'done' ? 'bg-green-100 text-green-700'
                        : t.status === 'in_progress' ? 'bg-orange-glow text-orange-dark'
                        : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {(t.status || 'open').replace(/_/g, ' ')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        </>
      )}

      {tab === 'files' && (
        <div className="space-y-4">
          {/* Upload area */}
          <div className="bg-white rounded-xl border border-surface-100 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Upload File</h2>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-surface-200 rounded-xl p-8 cursor-pointer hover:border-orange/40 hover:bg-orange/5 transition-colors">
              <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="text-sm text-gray-400 font-medium">
                {uploading ? 'Uploading...' : 'Click to upload a file'}
              </span>
              <span className="text-xs text-gray-300 mt-1">Any file type · Max 100 MB</span>
              <input
                type="file"
                className="sr-only"
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  setFileError('');
                  try {
                    const result = await api.uploadProjectFile(Number(id), file);
                    setFiles((prev) => [result, ...prev]);
                  } catch {
                    setFileError('Upload failed. Try again.');
                  } finally {
                    setUploading(false);
                    e.target.value = '';
                  }
                }}
              />
            </label>
            {fileError && (
              <p className="text-sm text-red-600 mt-2">{fileError}</p>
            )}
          </div>

          {/* File list */}
          {filesLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-orange border-t-transparent rounded-full animate-spin" />
            </div>
          ) : files.length === 0 ? (
            <div className="bg-white rounded-xl border border-surface-100 p-8 text-center text-gray-400 text-sm">
              No files uploaded yet.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-surface-100 divide-y divide-surface-100">
              {files.map((f) => (
                <div key={f.key} className="flex items-center gap-3 px-4 py-3">
                  <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">{f.name}</p>
                    <p className="text-xs text-gray-400">
                      {f.size ? `${(f.size / 1024).toFixed(1)} KB` : ''}
                      {f.uploaded ? ` · ${new Date(f.uploaded).toLocaleDateString()}` : ''}
                    </p>
                  </div>
                  <a
                    href={api.getProjectFileUrl(Number(id), f.key)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-orange hover:text-orange-dark"
                  >
                    Download
                  </a>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!confirm(`Delete "${f.name}"?`)) return;
                      try {
                        await api.deleteProjectFile(Number(id), f.key);
                        setFiles((prev) => prev.filter((x) => x.key !== f.key));
                      } catch {
                        setFileError('Delete failed.');
                      }
                    }}
                    className="text-gray-400 hover:text-red-500 text-sm ml-1"
                    aria-label="Delete file"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'notes' && (
        <div className="space-y-6">
          {/* Add note */}
          <div className="bg-white rounded-xl border border-surface-100 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Add Note
            </h2>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={4}
              placeholder="Project update, decision, blocker..."
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30 resize-y"
            />
            <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={newNoteVisible}
                  onChange={(e) => setNewNoteVisible(e.target.checked)}
                  className="rounded border-surface-200 text-orange focus:ring-orange/30"
                />
                Visible to client
              </label>
              <button
                onClick={handleAddNote}
                disabled={postingNote || !newNote.trim()}
                className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {postingNote ? 'Posting...' : 'Post Note'}
              </button>
            </div>
          </div>

          {noteError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
              {noteError}
            </div>
          )}

          {/* Notes list */}
          {notesLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-orange border-t-transparent rounded-full animate-spin" />
            </div>
          ) : projectNotes.length === 0 ? (
            <div className="bg-white rounded-xl border border-surface-100 p-8 text-center text-gray-400 text-sm">
              No notes yet. Add the first one above.
            </div>
          ) : (
            <ul className="space-y-3">
              {projectNotes.map((note) => {
                const isEditing = editingId === note.id;
                const visible = !!note.visible_to_client;
                return (
                  <li
                    key={note.id}
                    className={`bg-white rounded-xl border p-4 ${
                      visible ? 'border-orange/30' : 'border-surface-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-charcoal">{note.author || 'Brian'}</span>
                        <span className="text-gray-400">
                          {new Date(note.created_at).toLocaleString()}
                        </span>
                        {note.updated_at && note.updated_at !== note.created_at && (
                          <span className="text-gray-400 italic">(edited)</span>
                        )}
                      </div>
                      <button
                        onClick={() => toggleVisible(note)}
                        className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full transition-colors ${
                          visible
                            ? 'bg-orange/10 text-orange-dark hover:bg-orange/20'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        title="Toggle client visibility"
                      >
                        {visible ? 'Client visible' : 'Internal'}
                      </button>
                    </div>

                    {isEditing ? (
                      <div>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={4}
                          className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30 resize-y"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={cancelEdit}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-charcoal hover:bg-surface transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => saveEdit(note)}
                            className="bg-orange hover:bg-orange-dark text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-charcoal whitespace-pre-wrap">{note.content}</p>
                        <div className="flex gap-3 mt-3 text-xs">
                          <button
                            onClick={() => startEdit(note)}
                            className="text-gray-500 hover:text-charcoal font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteNote(note)}
                            className="text-gray-500 hover:text-red-600 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
