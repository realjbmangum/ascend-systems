import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type SeoOverviewSite } from '../lib/api';

// Portfolio search performance, sourced from Google Search Console.
//
// This card used to read Cloudflare Analytics (pageviews/visitors) via
// getPortfolioAnalytics(), but almost none of the portfolio domains are
// Cloudflare zones under this account, so it never had data. GSC is the honest,
// already-flowing source: the Monday `gsc-cron` ingests Search Console into
// seo_metrics, and /api/seo/overview hands back each tracked site's latest
// clicks/impressions. We aggregate those here. Only sites configured in
// seo_sites + gsc-cron appear; add a site there and it shows up automatically.
export default function PortfolioTrafficCard() {
  const [sites, setSites] = useState<SeoOverviewSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getSeoOverview()
      .then((res) => {
        setSites(res?.sites ?? []);
        setError('');
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Keep only sites that actually have a Search Console snapshot, most
  // impressions first.
  const tracked = sites
    .filter((s) => s.latest && s.latest.impressions != null)
    .sort((a, b) => (b.latest!.impressions ?? 0) - (a.latest!.impressions ?? 0));

  const totalClicks = tracked.reduce((sum, s) => sum + (s.latest!.clicks ?? 0), 0);
  const totalImpressions = tracked.reduce(
    (sum, s) => sum + (s.latest!.impressions ?? 0),
    0
  );
  const asOf = tracked[0]?.latest?.captured_on ?? null;

  return (
    <div className="bg-white border border-surface-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-charcoal">Portfolio Search Performance</h3>
          <p className="text-xs text-gray-500">
            Trailing 90 days · Google Search Console
            {asOf ? ` · as of ${asOf}` : ''}
          </p>
        </div>
        <Link
          to="/admin/seo"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-surface-200 text-charcoal hover:bg-surface-50 transition-colors"
        >
          SEO detail →
        </Link>
      </div>

      {error && <div className="text-xs text-red-600 mb-3">{error}</div>}

      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : tracked.length === 0 ? (
        <div className="text-sm text-gray-500">
          No Search Console data yet. Configure a site in{' '}
          <Link to="/admin/seo" className="text-orange hover:underline">
            SEO
          </Link>{' '}
          and run the GSC ingest.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-2xl font-bold text-charcoal tabular-nums">
                {totalClicks.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Clicks
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-charcoal tabular-nums">
                {totalImpressions.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Impressions
              </div>
            </div>
          </div>

          <div className="border-t border-surface-200 pt-3 space-y-2">
            {tracked.map((s) => (
              <Link
                key={s.id}
                to="/admin/seo"
                className="flex items-center justify-between text-sm hover:bg-surface-50 px-2 py-1.5 -mx-2 rounded transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-charcoal truncate">
                    {s.label}
                  </div>
                  {s.domain && (
                    <div className="text-xs text-gray-500 truncate">
                      {s.domain}
                    </div>
                  )}
                </div>
                <div className="text-right ml-3">
                  <div className="font-semibold tabular-nums text-charcoal">
                    {(s.latest!.impressions ?? 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 tabular-nums">
                    {(s.latest!.clicks ?? 0).toLocaleString()} clicks
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Showing {tracked.length} site{tracked.length === 1 ? '' : 's'} tracked
            in Search Console. Add a site in SEO to include it here.
          </p>
        </>
      )}
    </div>
  );
}
