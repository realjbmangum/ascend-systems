import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import AnalyticsSparkline from './AnalyticsSparkline';

interface Props {
  projectId: number;
  zoneTag: string | null;
  domain: string | null;
}

export default function ProjectAnalyticsPanel({
  projectId,
  zoneTag,
  domain,
}: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>('');

  // Manual snapshot form
  const [showManual, setShowManual] = useState(false);
  const [mPageviews, setMPageviews] = useState('');
  const [mVisitors, setMVisitors] = useState('');
  const [mDate, setMDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [mNote, setMNote] = useState('');
  const [savingManual, setSavingManual] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .getProjectAnalytics(projectId, 30)
      .then((d) => {
        setData(d);
        setError('');
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [projectId]);

  const refresh = async () => {
    setRefreshing(true);
    setError('');
    try {
      await api.refreshProjectAnalytics(projectId);
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRefreshing(false);
    }
  };

  const saveManual = async () => {
    const pv = parseInt(mPageviews, 10);
    const v = parseInt(mVisitors, 10);
    if (isNaN(pv) || isNaN(v)) {
      setError('Pageviews and visitors must be numbers');
      return;
    }
    setSavingManual(true);
    try {
      await api.recordManualSnapshot(projectId, {
        date: mDate,
        pageviews: pv,
        visitors: v,
        note: mNote || undefined,
      });
      setMPageviews('');
      setMVisitors('');
      setMNote('');
      setShowManual(false);
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSavingManual(false);
    }
  };

  return (
    <div className="bg-white border border-surface-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-charcoal">Traffic — Last 30 days</h3>
          <p className="text-xs text-gray-500">
            {domain ?? 'No domain configured'}
            {data?.project?.analytics_last_fetched_at && (
              <>
                {' · '}
                Fetched{' '}
                {new Date(
                  data.project.analytics_last_fetched_at + 'Z'
                ).toLocaleString()}
              </>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {zoneTag ? (
            <button
              onClick={refresh}
              disabled={refreshing}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange text-white hover:bg-orange-dark transition-colors disabled:opacity-50"
            >
              {refreshing ? 'Refreshing…' : 'Refresh from CF'}
            </button>
          ) : null}
          <button
            onClick={() => setShowManual((s) => !s)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-surface-200 text-charcoal hover:bg-surface-50 transition-colors"
          >
            {showManual ? 'Cancel' : 'Add manual snapshot'}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-xs text-red-600 mb-3">{error}</div>
      )}

      {!zoneTag && !data?.daily?.length && !showManual && (
        <div className="text-sm text-gray-500 bg-surface-50 rounded-lg p-4 mb-3">
          No Cloudflare zone tag configured. Add one in the project settings to
          auto-pull traffic, or use "Add manual snapshot" to record numbers
          from GA4 / Search Console.
        </div>
      )}

      {showManual && (
        <div className="bg-surface-50 border border-surface-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Date
              </label>
              <input
                type="date"
                value={mDate}
                onChange={(e) => setMDate(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-surface-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Pageviews
              </label>
              <input
                type="number"
                value={mPageviews}
                onChange={(e) => setMPageviews(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-surface-200 rounded-lg"
                placeholder="e.g. 2840"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Visitors
              </label>
              <input
                type="number"
                value={mVisitors}
                onChange={(e) => setMVisitors(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-surface-200 rounded-lg"
                placeholder="e.g. 1180"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Note (optional)
            </label>
            <input
              type="text"
              value={mNote}
              onChange={(e) => setMNote(e.target.value)}
              placeholder="e.g. From GA4 dashboard"
              className="w-full px-2 py-1.5 text-sm border border-surface-200 rounded-lg"
            />
          </div>
          <button
            onClick={saveManual}
            disabled={savingManual}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-charcoal text-white hover:bg-charcoal-light transition-colors disabled:opacity-50"
          >
            {savingManual ? 'Saving…' : 'Save snapshot'}
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-2xl font-bold text-charcoal tabular-nums">
                {(data?.totals?.pageviews ?? 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Pageviews (30d)
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-charcoal tabular-nums">
                {(data?.totals?.visitors ?? 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Visitors (30d)
              </div>
            </div>
          </div>

          {data?.daily?.length > 0 && (
            <div className="border-t border-surface-200 pt-4">
              <AnalyticsSparkline daily={data.daily} metric="pageviews" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
