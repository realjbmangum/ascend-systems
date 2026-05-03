import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import StatusBadge from '../../components/StatusBadge';

const statuses = ['planning', 'in_progress', 'on_hold', 'completed', 'cancelled'];

interface Note {
  id: number;
  project_id: number;
  author: string;
  content: string;
  visible_to_client: number | boolean;
  created_at: string;
  updated_at?: string;
}

type Tab = 'overview' | 'notes';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('overview');

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
      })
      .catch(() => navigate('/admin/projects'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (tab !== 'notes' || !id) return;
    setNotesLoading(true);
    api
      .getProjectNotes(Number(id))
      .then(setProjectNotes)
      .catch(() => setProjectNotes([]))
      .finally(() => setNotesLoading(false));
  }, [tab, id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProject(Number(id), { notes, status });
      setProject((prev: any) => ({ ...prev, notes, status }));
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

      {/* Tabs */}
      <div className="border-b border-surface-100 mb-6 flex gap-1">
        {([
          { id: 'overview', label: 'Overview' },
          { id: 'notes', label: 'Notes' },
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
          </button>
        ))}
      </div>

      {tab === 'overview' && (
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
