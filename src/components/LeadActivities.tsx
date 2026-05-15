import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Activity = {
  id: number;
  type: string;
  subject: string;
  notes: string | null;
  due_at: string | null;
  duration_minutes: number | null;
  done: number;
  graph_event_id: string | null;
};

const TYPES = ['call', 'meeting', 'email', 'task', 'note'];

const TYPE_ICON: Record<string, string> = {
  call: '📞',
  meeting: '🤝',
  email: '✉️',
  task: '✓',
  note: '📝',
};

// datetime-local value (local time, no zone) -> ISO UTC string
function localToISO(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

// ISO UTC -> datetime-local value
function isoToLocal(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function formatDue(iso: string | null): string {
  if (!iso) return 'No due date';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'No due date';
  return d.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const EMPTY = {
  type: 'call',
  subject: '',
  due: '',
  duration: '30',
  notes: '',
};

export default function LeadActivities({ leadId }: { leadId: number }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...EMPTY });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  function load() {
    api
      .getActivities(leadId)
      .then((data) => setActivities(data || []))
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [leadId]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.subject.trim()) {
      setError('Subject is required');
      return;
    }
    setAdding(true);
    setError('');
    try {
      const durationNum = Number(form.duration);
      await api.createActivity({
        lead_id: leadId,
        type: form.type,
        subject: form.subject.trim(),
        notes: form.notes.trim() || null,
        due_at: localToISO(form.due),
        duration_minutes:
          form.duration && !isNaN(durationNum) ? durationNum : null,
      });
      setForm({ ...EMPTY });
      load();
    } catch (err: any) {
      setError(err.message || 'Failed to add activity');
    }
    setAdding(false);
  }

  async function toggleDone(a: Activity) {
    setActivities((prev) =>
      prev.map((x) => (x.id === a.id ? { ...x, done: x.done ? 0 : 1 } : x))
    );
    try {
      await api.updateActivity(a.id, { done: !a.done });
    } catch {
      load();
    }
  }

  async function remove(a: Activity) {
    if (!confirm('Delete this activity?')) return;
    setActivities((prev) => prev.filter((x) => x.id !== a.id));
    try {
      await api.deleteActivity(a.id);
    } catch {
      load();
    }
  }

  const inputClass =
    'w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30';

  return (
    <div className="bg-white rounded-xl border border-surface-100 p-5">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Activities
      </h2>

      {/* Add form */}
      <form onSubmit={handleAdd} className="mb-5 space-y-3">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-3">
          <select
            aria-label="Activity type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={`${inputClass} w-32 capitalize`}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            type="text"
            aria-label="Activity subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="What needs to happen?"
            className={inputClass}
          />
        </div>
        <div className="flex gap-3">
          <input
            type="datetime-local"
            aria-label="Due date and time"
            value={form.due}
            onChange={(e) => setForm({ ...form, due: e.target.value })}
            className={inputClass}
          />
          <input
            type="number"
            min="0"
            step="15"
            aria-label="Duration in minutes"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            placeholder="Minutes"
            className={`${inputClass} w-28`}
          />
        </div>
        <textarea
          aria-label="Activity notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={2}
          placeholder="Notes (optional)"
          className={`${inputClass} resize-y`}
        />
        <button
          type="submit"
          disabled={adding}
          className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {adding ? 'Adding...' : 'Add Activity'}
        </button>
      </form>

      {/* List */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading activities...</p>
      ) : activities.length === 0 ? (
        <p className="text-sm text-gray-400">No activities logged yet.</p>
      ) : (
        <ul className="space-y-2">
          {activities.map((a) => (
            <li
              key={a.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                a.done
                  ? 'border-surface-100 bg-surface/40'
                  : 'border-surface-200 bg-white'
              }`}
            >
              <input
                type="checkbox"
                checked={Boolean(a.done)}
                onChange={() => toggleDone(a)}
                className="mt-1 accent-orange w-4 h-4"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span>{TYPE_ICON[a.type] || '•'}</span>
                  <span
                    className={`text-sm font-medium ${
                      a.done ? 'text-gray-400 line-through' : 'text-charcoal'
                    }`}
                  >
                    {a.subject}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                  <span>{formatDue(a.due_at)}</span>
                  {a.duration_minutes ? <span>· {a.duration_minutes}m</span> : null}
                  {a.graph_event_id ? (
                    <span className="text-green-600">· on calendar</span>
                  ) : null}
                </div>
                {a.notes && (
                  <p className="text-xs text-gray-500 mt-1 whitespace-pre-wrap">
                    {a.notes}
                  </p>
                )}
              </div>
              <button
                onClick={() => remove(a)}
                className="text-gray-300 hover:text-red-500 text-sm"
                title="Delete"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
