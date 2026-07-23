import { useEffect, useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { api } from '../../lib/api';
import type { SeoOverviewSite, SeoMetricPoint, SeoAction } from '../../lib/api';
import StatCard from '../../components/StatCard';

const GOAL_FILTERS: Array<{ label: string; value: string | null }> = [
  { label: 'All', value: null },
  { label: 'Google', value: 'google' },
  { label: 'AI', value: 'ai' },
  { label: 'Technical', value: 'technical' },
];

const severityStyles: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-gray-100 text-gray-600',
};

const goalStyles: Record<string, string> = {
  google: 'bg-blue-100 text-blue-700',
  ai: 'bg-purple-100 text-purple-700',
  technical: 'bg-gray-100 text-gray-600',
};

function fmtInt(n: number | null | undefined) {
  return n == null ? '—' : n.toLocaleString();
}

function fmtScore(n: number | null | undefined) {
  return n == null ? '—' : String(Math.round(n * 10) / 10);
}

function fmtPosition(n: number | null | undefined) {
  return n == null ? '—' : (Math.round(n * 10) / 10).toFixed(1);
}

// Threshold logic for the StatCard tones/labels.
type Tone = 'good' | 'warn' | 'bad' | undefined;
function positionTone(p: number | null | undefined): Tone {
  if (p == null) return undefined;
  if (p <= 10) return 'good'; // page 1
  if (p <= 20) return 'warn'; // page 2 — seen but rarely clicked
  return 'bad'; // buried
}
function positionLabel(p: number | null | undefined) {
  if (p == null) return undefined;
  if (p <= 3) return 'Top of page 1';
  if (p <= 10) return 'Page 1';
  if (p <= 20) return 'Page 2 — push to page 1';
  return 'Buried past page 2';
}
function aiTone(s: number | null | undefined): Tone {
  if (s == null) return undefined;
  if (s >= 80) return 'good';
  if (s >= 60) return 'warn';
  return 'bad';
}

// Parse a YYYY-MM-DD (or ISO) string as a local date to avoid timezone drift.
function fmtDay(s: string) {
  const parts = s.slice(0, 10).split('-');
  if (parts.length === 3) {
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  return s;
}

export default function Seo() {
  const [sites, setSites] = useState<SeoOverviewSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);

  const [metrics, setMetrics] = useState<SeoMetricPoint[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(false);

  const [actions, setActions] = useState<SeoAction[]>([]);
  const [actionsLoading, setActionsLoading] = useState(false);
  const [goalFilter, setGoalFilter] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Load overview on mount.
  useEffect(() => {
    api
      .getSeoOverview()
      .then((res) => {
        const list = res?.sites || [];
        setSites(list);
        setSelectedSiteId((prev) => prev ?? (list.length > 0 ? list[0].id : null));
      })
      .catch(() => setSites([]))
      .finally(() => setLoading(false));
  }, []);

  // Load metrics whenever the selected site changes.
  useEffect(() => {
    if (selectedSiteId == null) {
      setMetrics([]);
      return;
    }
    setMetricsLoading(true);
    api
      // gsc-cron only: one consistent weekly performance stream for the trend
      // line, not mixed with occasional local-CLI audit rows.
      .getSeoMetrics(selectedSiteId, 90, 'gsc-cron')
      .then((rows) => setMetrics(Array.isArray(rows) ? rows : []))
      .catch(() => setMetrics([]))
      .finally(() => setMetricsLoading(false));
  }, [selectedSiteId]);

  const loadActions = () => {
    if (selectedSiteId == null) {
      setActions([]);
      return;
    }
    setActionsLoading(true);
    api
      .getSeoActions({
        site_id: selectedSiteId,
        ...(goalFilter ? { goal: goalFilter } : {}),
      })
      .then((rows) => setActions(Array.isArray(rows) ? rows : []))
      .catch(() => setActions([]))
      .finally(() => setActionsLoading(false));
  };

  // Load actions whenever the site or goal filter changes.
  useEffect(() => {
    loadActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSiteId, goalFilter]);

  const markDone = async (id: number) => {
    setUpdatingId(id);
    try {
      await api.updateSeoAction(id, { status: 'done' });
      loadActions();
    } catch {
      // ignore — surface nothing destructive; list simply won't change
    } finally {
      setUpdatingId(null);
    }
  };

  const selectedSite = useMemo(
    () => sites.find((s) => s.id === selectedSiteId) || null,
    [sites, selectedSiteId]
  );
  const latest = selectedSite?.latest ?? null;

  const chartData = useMemo(
    () =>
      metrics.map((m) => ({
        date: fmtDay(m.captured_on),
        impressions: m.impressions,
        clicks: m.clicks,
      })),
    [metrics]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-charcoal mb-6">SEO</h1>

      {sites.length === 0 ? (
        <div className="bg-white rounded-xl border border-surface-100 p-10 text-center">
          <p className="text-sm text-gray-500">
            No SEO sites configured yet. Sites appear here once the ingestion job has run.
          </p>
        </div>
      ) : (
        <>
          {/* Site tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-surface-100">
            {sites.map((site) => {
              const active = site.id === selectedSiteId;
              return (
                <button
                  key={site.id}
                  type="button"
                  onClick={() => setSelectedSiteId(site.id)}
                  className={`relative -mb-px flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                    active
                      ? 'border-orange text-orange'
                      : 'border-transparent text-gray-500 hover:text-charcoal'
                  }`}
                >
                  <span>{site.label}</span>
                  {site.actions?.high_open > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[1.1rem] h-[1.1rem] px-1 text-[10px] font-bold rounded-full bg-red-500 text-white">
                      {site.actions.high_open}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Stat row — tone + hint make each number self-explaining.
              Position and AI Readiness have real thresholds, so they're
              color-coded; Clicks and Impressions are relative (no absolute
              good/bad), so they stay neutral with a "want this rising" hint. */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Clicks"
              value={fmtInt(latest?.clicks)}
              accent
              sub={latest ? `as of ${fmtDay(latest.captured_on)}` : 'No data yet'}
              hint="Visitors from Google search — you want this rising over time."
              icon="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"
            />
            <StatCard
              label="Impressions"
              value={fmtInt(latest?.impressions)}
              sub={latest != null ? `${(latest.ctr * 100).toFixed(1)}% CTR` : undefined}
              hint="Times you showed up in search. CTR = the % who clicked (read it against position)."
              icon="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
            <StatCard
              label="Avg Position"
              value={fmtPosition(latest?.avg_position)}
              tone={positionTone(latest?.avg_position)}
              sub={latest != null ? positionLabel(latest.avg_position) : undefined}
              hint="Lower is better. 1–10 = page 1, 11–20 = page 2 (seen but rarely clicked), 20+ = buried."
              icon="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
            <StatCard
              label="AI Readiness"
              value={latest != null ? fmtScore(latest.ai_readiness_score) : '—'}
              tone={aiTone(latest?.ai_readiness_score)}
              sub={latest != null ? '/ 100' : undefined}
              hint="Technical AI-search hygiene (schema, crawlability). 80+ strong; off-site is the real lever."
              icon="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </div>

          {/* Search performance chart */}
          <div className="bg-white rounded-xl border border-surface-100 p-5 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Search Performance
              </h2>
              <span className="text-xs text-gray-400">Last 90 days</span>
            </div>
            {metricsLoading ? (
              <div className="h-[260px] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-orange border-t-transparent rounded-full animate-spin" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-[260px] flex items-center justify-center rounded-lg bg-surface/40 border border-dashed border-surface-100">
                <p className="text-sm text-gray-400">
                  No history yet — data appears after the first ingestion run
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={24}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="impressions"
                    name="Impressions"
                    stroke="#64748b"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="clicks"
                    name="Clicks"
                    stroke="#D4632C"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-surface-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-100 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Recommended Actions
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {GOAL_FILTERS.map((f) => {
                  const active = goalFilter === f.value;
                  return (
                    <button
                      key={f.label}
                      type="button"
                      onClick={() => setGoalFilter(f.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                        active
                          ? 'bg-orange text-white border-orange'
                          : 'bg-white text-gray-500 border-surface-100 hover:border-orange/40 hover:text-charcoal'
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {actionsLoading ? (
              <div className="p-10 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-orange border-t-transparent rounded-full animate-spin" />
              </div>
            ) : actions.length === 0 ? (
              <div className="p-10 text-center text-sm text-gray-400">
                No actions yet{goalFilter ? ' for this goal' : ''}.
              </div>
            ) : (
              <ul className="divide-y divide-surface-100">
                {actions.map((action) => {
                  const isDone = action.status === 'done' || action.status === 'dismissed';
                  return (
                    <li
                      key={action.id}
                      className={`px-5 py-4 flex items-start gap-3 ${isDone ? 'opacity-60' : ''}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
                              severityStyles[action.severity] || severityStyles.low
                            }`}
                          >
                            {action.severity || 'low'}
                          </span>
                          {action.goal && (
                            <span
                              className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded ${
                                goalStyles[action.goal] || 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {action.goal}
                            </span>
                          )}
                          {action.source_report && (
                            <span className="text-[11px] text-gray-400">
                              {action.source_report}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-sm font-semibold text-charcoal ${
                            isDone ? 'line-through' : ''
                          }`}
                        >
                          {action.title}
                        </p>
                        {action.detail && (
                          <p className="text-xs text-gray-500 mt-0.5">{action.detail}</p>
                        )}
                        {action.url && (
                          <a
                            href={action.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-orange hover:text-orange-dark break-all mt-0.5 inline-block"
                          >
                            {action.url}
                          </a>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Done
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => markDone(action.id)}
                            disabled={updatingId === action.id}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-surface-100 text-charcoal hover:border-orange/40 hover:bg-surface/40 transition-colors disabled:opacity-50"
                          >
                            {updatingId === action.id ? 'Saving…' : 'Mark done'}
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
