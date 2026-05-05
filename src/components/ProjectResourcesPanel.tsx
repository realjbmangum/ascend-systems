import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../lib/api';

interface Resource {
  id: number;
  project_id: number;
  type: string;
  title: string;
  content_markdown: string | null;
  url: string | null;
  sort_order: number;
  source_path: string | null;
  created_at: string;
}

interface Props {
  projectId: number;
}

const TYPE_LABELS: Record<string, string> = {
  template: 'Email Templates',
  contacts: 'Contacts',
  checklist: 'Checklists',
  brand_asset: 'Brand Assets',
  link: 'Links',
  doc: 'Docs',
};

const TYPE_ORDER = ['template', 'contacts', 'checklist', 'doc', 'link', 'brand_asset'];

const TYPE_COLORS: Record<string, string> = {
  template: 'bg-orange-glow text-orange-dark',
  contacts: 'bg-blue-100 text-blue-700',
  checklist: 'bg-green-100 text-green-700',
  brand_asset: 'bg-purple-100 text-purple-700',
  link: 'bg-gray-100 text-gray-600',
  doc: 'bg-yellow-100 text-yellow-700',
};

export default function ProjectResourcesPanel({ projectId }: Props) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [fType, setFType] = useState('doc');
  const [fTitle, setFTitle] = useState('');
  const [fContent, setFContent] = useState('');
  const [fUrl, setFUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .getProjectResources(projectId)
      .then(setResources)
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [projectId]);

  const startCreate = () => {
    setEditingId(null);
    setFType('doc');
    setFTitle('');
    setFContent('');
    setFUrl('');
    setShowCreate(true);
  };

  const startEdit = (r: Resource) => {
    setEditingId(r.id);
    setFType(r.type);
    setFTitle(r.title);
    setFContent(r.content_markdown || '');
    setFUrl(r.url || '');
    setShowCreate(true);
  };

  const save = async () => {
    if (!fTitle.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await api.updateResource(editingId, {
          type: fType,
          title: fTitle,
          content_markdown: fContent || null,
          url: fUrl || null,
        });
      } else {
        await api.createResource({
          project_id: projectId,
          type: fType,
          title: fTitle,
          content_markdown: fContent || undefined,
          url: fUrl || undefined,
        });
      }
      setShowCreate(false);
      load();
    } catch (e: any) {
      alert(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this resource?')) return;
    try {
      await api.deleteResource(id);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const copyContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      // ignore — clipboard may not be available
    }
  };

  const filtered = resources
    .filter((r) => filter === 'all' || r.type === filter)
    .filter((r) => {
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        (r.content_markdown || '').toLowerCase().includes(q)
      );
    });

  const grouped = TYPE_ORDER.reduce<Record<string, Resource[]>>((acc, t) => {
    acc[t] = filtered.filter((r) => r.type === t);
    return acc;
  }, {});

  const typeCounts = TYPE_ORDER.reduce<Record<string, number>>((acc, t) => {
    acc[t] = resources.filter((r) => r.type === t).length;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              filter === 'all'
                ? 'bg-charcoal text-white border-charcoal'
                : 'bg-white border-surface-200 text-gray-600 hover:text-charcoal'
            }`}
          >
            All ({resources.length})
          </button>
          {TYPE_ORDER.filter((t) => typeCounts[t] > 0).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                filter === t
                  ? 'bg-charcoal text-white border-charcoal'
                  : 'bg-white border-surface-200 text-gray-600 hover:text-charcoal'
              }`}
            >
              {TYPE_LABELS[t]} ({typeCounts[t]})
            </button>
          ))}
        </div>
        <button
          onClick={startCreate}
          className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Add Resource
        </button>
      </div>

      <div className="relative max-w-md">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search resources…"
          className="w-full pl-9 pr-3 py-2 text-sm border border-surface-200 rounded-lg bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
        />
        <svg
          className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {showCreate && (
        <div className="bg-surface-50 border border-surface-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-charcoal">
              {editingId ? 'Edit Resource' : 'Add Resource'}
            </h3>
            <button
              onClick={() => setShowCreate(false)}
              className="text-gray-400 hover:text-charcoal text-sm"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
              <select
                value={fType}
                onChange={(e) => setFType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg"
              >
                {TYPE_ORDER.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
              <input
                type="text"
                value={fTitle}
                onChange={(e) => setFTitle(e.target.value)}
                placeholder="e.g., Press Pitch — Consumer angle"
                className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg"
              />
            </div>
          </div>
          {(fType === 'link' || fType === 'brand_asset') && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">URL</label>
              <input
                type="url"
                value={fUrl}
                onChange={(e) => setFUrl(e.target.value)}
                placeholder="https://…"
                className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Content (Markdown)
            </label>
            <textarea
              value={fContent}
              onChange={(e) => setFContent(e.target.value)}
              rows={12}
              placeholder="Paste your template, contacts, checklist…"
              className="w-full px-3 py-2 text-sm font-mono border border-surface-200 rounded-lg resize-y"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={save}
              disabled={saving || !fTitle.trim()}
              className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Resource'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-sm text-gray-400 py-8 text-center">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-surface-100 p-12 text-center text-gray-400">
          {resources.length === 0
            ? 'No resources yet. Add a template, contact list, or checklist to start working from here.'
            : `No ${filter === 'all' ? '' : TYPE_LABELS[filter] + ' '}resources match.`}
        </div>
      ) : filter === 'all' ? (
        <div className="space-y-6">
          {TYPE_ORDER.filter((t) => grouped[t].length > 0).map((t) => (
            <div key={t}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {TYPE_LABELS[t]} ({grouped[t].length})
              </h3>
              <div className="space-y-2">
                {grouped[t].map((r) => (
                  <ResourceCard
                    key={r.id}
                    resource={r}
                    expanded={expandedId === r.id}
                    onToggle={() =>
                      setExpandedId(expandedId === r.id ? null : r.id)
                    }
                    onEdit={() => startEdit(r)}
                    onDelete={() => remove(r.id)}
                    onCopy={() => copyContent(r.content_markdown || '')}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => (
            <ResourceCard
              key={r.id}
              resource={r}
              expanded={expandedId === r.id}
              onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
              onEdit={() => startEdit(r)}
              onDelete={() => remove(r.id)}
              onCopy={() => copyContent(r.content_markdown || '')}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ResourceCardProps {
  resource: Resource;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
}

function ResourceCard({
  resource,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  onCopy,
}: ResourceCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white rounded-xl border border-surface-100 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <span
          className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
            TYPE_COLORS[resource.type] || 'bg-gray-100 text-gray-600'
          }`}
        >
          {resource.type.replace(/_/g, ' ')}
        </span>
        <button
          type="button"
          onClick={onToggle}
          className="flex-1 text-left text-sm font-semibold text-charcoal hover:text-orange transition-colors"
        >
          {resource.title}
        </button>
        {resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-orange hover:text-orange-dark"
            onClick={(e) => e.stopPropagation()}
          >
            Open ↗
          </a>
        )}
        {resource.content_markdown && (
          <button
            onClick={handleCopy}
            className="text-xs font-semibold px-2.5 py-1 rounded border border-surface-200 text-gray-600 hover:text-charcoal hover:border-orange transition-colors"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
        <button
          onClick={onEdit}
          className="text-xs text-gray-400 hover:text-charcoal"
          aria-label="Edit"
        >
          ✎
        </button>
        <button
          onClick={onDelete}
          className="text-xs text-gray-400 hover:text-red-600"
          aria-label="Delete"
        >
          ×
        </button>
      </div>
      {expanded && resource.content_markdown && (
        <div className="px-4 py-4 border-t border-surface-100 bg-surface/30">
          <div className="prose prose-sm max-w-none text-charcoal">
            <ReactMarkdown>{resource.content_markdown}</ReactMarkdown>
          </div>
          {resource.source_path && (
            <p className="mt-3 text-[11px] text-gray-400 font-mono">
              Source: {resource.source_path}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
