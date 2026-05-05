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

  return (
    <div className="bg-white border border-surface-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-charcoal">Portfolio Traffic</h3>
          <p className="text-xs text-gray-500">
            Last 30 days · Cloudflare Analytics
          </p>
        </div>
        <button
          onClick={refreshAll}
          disabled={refreshing}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-surface-200 text-charcoal hover:bg-surface-50 transition-colors disabled:opacity-50"
        >
          {refreshing ? 'Refreshing…' : 'Refresh all'}
        </button>
      </div>

      {error && (
        <div className="text-xs text-red-600 mb-3">{error}</div>
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
