import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function PortfolioTrafficCard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>('');

  const load = () => {
    setLoading(true);
    api
      .getPortfolioAnalytics(30)
      .then((d) => {
        setData(d);
        setError('');
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const refreshAll = async () => {
    setRefreshing(true);
    try {
      await api.refreshAllAnalytics();
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRefreshing(false);
    }
  };

  const [matchResult, setMatchResult] = useState<any>(null);
  const [matching, setMatching] = useState(false);
  const autoMatch = async () => {
    setMatching(true);
    setError('');
    try {
      const result = await api.autoMatchCfZones();
      setMatchResult(result);
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="bg-white border border-surface-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-charcoal">Portfolio Traffic</h3>
          <p className="text-xs text-gray-500">
            Last 30 days · Cloudflare Analytics
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={autoMatch}
            disabled={matching}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-surface-200 text-charcoal hover:bg-surface-50 transition-colors disabled:opacity-50"
            title="For each project with a Domain set, find the matching CF zone and auto-fill the zone tag."
          >
            {matching ? 'Matching…' : 'Auto-link CF zones'}
          </button>
          <button
            onClick={refreshAll}
            disabled={refreshing}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-surface-200 text-charcoal hover:bg-surface-50 transition-colors disabled:opacity-50"
          >
            {refreshing ? 'Refreshing…' : 'Refresh all'}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-xs text-red-600 mb-3">{error}</div>
      )}

      {matchResult && (
        <div className="text-xs bg-surface-50 border border-surface-200 rounded-lg p-3 mb-3 space-y-2">
          <div className="font-semibold text-charcoal">
            Matched {matchResult.matched} / {matchResult.matched + matchResult.unmatched} projects
            ({matchResult.cf_zones_count} CF zones available)
          </div>
          {matchResult.matched_detail?.length > 0 && (
            <div>
              <div className="text-green-700 font-medium">Linked:</div>
              <ul className="text-gray-600">
                {matchResult.matched_detail.map((m: any) => (
                  <li key={m.project}>✓ {m.project} → {m.domain}</li>
                ))}
              </ul>
            </div>
          )}
          {matchResult.unmatched_detail?.length > 0 && (
            <div>
              <div className="text-orange-dark font-medium">No CF zone match:</div>
              <ul className="text-gray-600">
                {matchResult.unmatched_detail.map((u: any) => (
                  <li key={u.project}>· {u.project} ({u.domain})</li>
                ))}
              </ul>
              <div className="mt-1 text-gray-500">
                These domains aren't on Cloudflare under this account — use manual snapshots.
              </div>
            </div>
          )}
          <button
            onClick={() => setMatchResult(null)}
            className="text-gray-500 hover:text-charcoal"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : !data ? (
        <div className="text-sm text-gray-500">No data yet.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-2xl font-bold text-charcoal tabular-nums">
                {data.total_pageviews.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Pageviews
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-charcoal tabular-nums">
                {data.total_visitors.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Visitors
              </div>
            </div>
          </div>

          {data.projects && data.projects.length > 0 ? (
            <div className="border-t border-surface-200 pt-3 space-y-2">
              {data.projects.slice(0, 8).map((p: any) => (
                <Link
                  key={p.project_id}
                  to={`/admin/projects/${p.project_id}`}
                  className="flex items-center justify-between text-sm hover:bg-surface-50 px-2 py-1.5 -mx-2 rounded transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-charcoal truncate">
                      {p.project_name}
                    </div>
                    {p.analytics_domain && (
                      <div className="text-xs text-gray-500 truncate">
                        {p.analytics_domain}
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-3">
                    <div className="font-semibold tabular-nums text-charcoal">
                      {(p.pageviews ?? 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 tabular-nums">
                      {(p.visitors ?? 0).toLocaleString()} visitors
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-500 mt-3">
              No projects with analytics configured. Add a{' '}
              <span className="font-mono">cloudflare_zone_tag</span> on a
              project to start tracking.
            </div>
          )}
        </>
      )}
    </div>
  );
}
