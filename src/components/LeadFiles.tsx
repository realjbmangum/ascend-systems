import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';

type LeadFile = {
  key: string;
  name: string;
  size: number;
  uploaded: string;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function LeadFiles({ leadId }: { leadId: number }) {
  const [files, setFiles] = useState<LeadFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function load() {
    api
      .getLeadFiles(leadId)
      .then((data) => setFiles(data || []))
      .catch(() => setFiles([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [leadId]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      await api.uploadLeadFile(leadId, file);
      load();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  }

  async function remove(f: LeadFile) {
    if (!confirm(`Delete ${f.name}?`)) return;
    setFiles((prev) => prev.filter((x) => x.key !== f.key));
    try {
      await api.deleteLeadFile(leadId, f.key);
    } catch {
      load();
    }
  }

  return (
    <div className="bg-white rounded-xl border border-surface-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Files
        </h2>
        <label className="text-sm font-semibold text-orange hover:text-orange-dark cursor-pointer">
          {uploading ? 'Uploading...' : '+ Upload'}
          <input
            ref={inputRef}
            type="file"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-400">Loading files...</p>
      ) : files.length === 0 ? (
        <p className="text-sm text-gray-400">
          No files attached. Upload proposals, PRDs, or reference docs.
        </p>
      ) : (
        <ul className="space-y-2">
          {files.map((f) => (
            <li
              key={f.key}
              className="flex items-center gap-3 p-2.5 rounded-lg border border-surface-200"
            >
              <span>📎</span>
              <a
                href={api.getLeadFileUrl(leadId, f.key)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-charcoal hover:text-orange truncate flex-1"
              >
                {f.name}
              </a>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {formatSize(f.size)}
              </span>
              <button
                onClick={() => remove(f)}
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
