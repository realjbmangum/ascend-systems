/**
 * Weekly SEO metrics ingestion — the Cloudflare-native trend engine.
 *
 * Runs in the Worker (cron or manual admin trigger), reads Search Console
 * performance totals for every seo_sites row via a service account, and upserts
 * one seo_metrics snapshot per site with source='gsc-cron'. Each run appends a
 * dated row, so history compounds for trends/forecasts.
 *
 * This captures the GSC performance fields only (clicks/impressions/ctr/position)
 * — a Worker has no headless browser, so crawl-derived fields (page counts,
 * ai_readiness_score) and the action list still come from the local `seo` CLI
 * on-demand. The two streams use different `source` values and never collide.
 */
import type { Bindings } from "../types";
import { createGscClient, defaultWindow } from "./gsc";

export type SeoCronResult = {
  ok: boolean;
  ranAt: string;
  window: { startDate: string; endDate: string };
  serviceAccount?: string;
  sites: { key: string; property: string; clicks: number | null; impressions: number | null; note?: string }[];
  error?: string;
};

type SiteRow = { id: number; key: string; gsc_property: string };

export async function ingestGscMetrics(env: Bindings, capturedOn?: string): Promise<SeoCronResult> {
  const ranAt = new Date().toISOString();
  const win = defaultWindow(90);
  const day = capturedOn || ranAt.slice(0, 10);

  if (!env.GSC_SA_KEY) {
    return { ok: false, ranAt, window: win, sites: [], error: "GSC_SA_KEY secret is not set" };
  }

  let client: Awaited<ReturnType<typeof createGscClient>>;
  try {
    client = await createGscClient(env.GSC_SA_KEY);
  } catch (e) {
    return { ok: false, ranAt, window: win, sites: [], error: (e as Error).message };
  }

  const { results: sites } = await env.DB.prepare(
    "SELECT id, key, gsc_property FROM seo_sites"
  ).all<SiteRow>();

  const out: SeoCronResult["sites"] = [];
  for (const site of sites) {
    try {
      const totals = await client.totals(site.gsc_property, win.startDate, win.endDate);
      // Upsert this run's snapshot. Only the GSC fields are set here; crawl
      // fields (indexable_pages, ai_readiness_score) stay null for this source.
      await env.DB.prepare(
        `INSERT INTO seo_metrics
           (site_id, captured_on, period_start, period_end, clicks, impressions, ctr, avg_position, source)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'gsc-cron')
         ON CONFLICT(site_id, captured_on, source) DO UPDATE SET
           period_start = excluded.period_start,
           period_end   = excluded.period_end,
           clicks       = excluded.clicks,
           impressions  = excluded.impressions,
           ctr          = excluded.ctr,
           avg_position = excluded.avg_position`
      )
        .bind(
          site.id,
          day,
          win.startDate,
          win.endDate,
          totals?.clicks ?? null,
          totals?.impressions ?? null,
          totals?.ctr ?? null,
          totals?.position ?? null
        )
        .run();
      out.push({
        key: site.key,
        property: site.gsc_property,
        clicks: totals?.clicks ?? null,
        impressions: totals?.impressions ?? null,
        note: totals ? undefined : "no GSC data in window",
      });
    } catch (e) {
      // One site failing (e.g. SA not granted access to that property) must not
      // abort the others.
      out.push({
        key: site.key,
        property: site.gsc_property,
        clicks: null,
        impressions: null,
        note: `error: ${(e as Error).message}`.slice(0, 200),
      });
    }
  }

  return { ok: true, ranAt, window: win, serviceAccount: client.serviceAccountEmail, sites: out };
}
