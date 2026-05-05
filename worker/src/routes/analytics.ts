import { Hono } from "hono";
import type { Bindings, Variables } from "../types";
import { requireAuth } from "../middleware";

const analytics = new Hono<{ Bindings: Bindings; Variables: Variables }>();
analytics.use("*", requireAuth("admin"));

// Portfolio rollup — last 30 days, all projects with snapshots
analytics.get("/", async (c) => {
  const sinceParam = c.req.query("days") ?? "30";
  const days = Math.max(1, Math.min(365, parseInt(sinceParam, 10)));
  const since = new Date(Date.now() - days * 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);

  const { results: perProject } = await c.env.DB.prepare(
    `SELECT
       p.id AS project_id,
       p.name AS project_name,
       p.analytics_domain,
       p.cloudflare_zone_tag,
       p.analytics_source,
       p.analytics_last_fetched_at,
       SUM(s.pageviews) AS pageviews,
       SUM(s.visitors) AS visitors,
       MAX(s.date) AS latest_date
     FROM projects p
     LEFT JOIN project_analytics_snapshots s
       ON s.project_id = p.id AND s.date >= ?
     WHERE p.cloudflare_zone_tag IS NOT NULL OR p.analytics_source IS NOT NULL
     GROUP BY p.id
     ORDER BY pageviews DESC NULLS LAST, p.name`
  )
    .bind(since)
    .all();

  const totalPageviews = perProject.reduce(
    (sum, p: any) => sum + (p.pageviews || 0),
    0
  );
  const totalVisitors = perProject.reduce(
    (sum, p: any) => sum + (p.visitors || 0),
    0
  );

  return c.json({
    period_days: days,
    since,
    total_pageviews: totalPageviews,
    total_visitors: totalVisitors,
    projects: perProject,
  });
});

// Per-project — daily breakdown
analytics.get("/projects/:id", async (c) => {
  const projectId = parseInt(c.req.param("id"), 10);
  const sinceParam = c.req.query("days") ?? "30";
  const days = Math.max(1, Math.min(365, parseInt(sinceParam, 10)));
  const since = new Date(Date.now() - days * 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);

  const project = await c.env.DB.prepare(
    `SELECT id, name, analytics_domain, cloudflare_zone_tag, analytics_source, analytics_last_fetched_at
     FROM projects WHERE id = ?`
  )
    .bind(projectId)
    .first<any>();
  if (!project) return c.json({ error: "project not found" }, 404);

  const { results: daily } = await c.env.DB.prepare(
    `SELECT date, source, pageviews, visitors, requests
     FROM project_analytics_snapshots
     WHERE project_id = ? AND date >= ?
     ORDER BY date ASC`
  )
    .bind(projectId, since)
    .all();

  const totals = daily.reduce(
    (acc, d: any) => {
      acc.pageviews += d.pageviews || 0;
      acc.visitors += d.visitors || 0;
      return acc;
    },
    { pageviews: 0, visitors: 0 }
  );

  return c.json({
    project,
    period_days: days,
    since,
    totals,
    daily,
  });
});

// Manual snapshot — for sites without a Cloudflare zone (standalone hosts).
analytics.post("/projects/:id/manual", async (c) => {
  const projectId = parseInt(c.req.param("id"), 10);
  const body = await c.req.json<{
    date?: string;
    pageviews?: number;
    visitors?: number;
    note?: string;
  }>();
  const date =
    body.date ?? new Date().toISOString().slice(0, 10);
  if (typeof body.pageviews !== "number" || typeof body.visitors !== "number") {
    return c.json({ error: "pageviews and visitors required" }, 400);
  }
  await c.env.DB.prepare(
    `INSERT INTO project_analytics_snapshots
       (project_id, date, source, pageviews, visitors, raw_json)
     VALUES (?, ?, 'manual', ?, ?, ?)
     ON CONFLICT(project_id, date, source) DO UPDATE SET
       pageviews = excluded.pageviews,
       visitors = excluded.visitors,
       raw_json = excluded.raw_json,
       fetched_at = datetime('now')`
  )
    .bind(
      projectId,
      date,
      body.pageviews,
      body.visitors,
      body.note ? JSON.stringify({ note: body.note }) : null
    )
    .run();
  await c.env.DB.prepare(
    `UPDATE projects SET analytics_last_fetched_at = datetime('now'),
       analytics_source = COALESCE(analytics_source, 'manual') WHERE id = ?`
  )
    .bind(projectId)
    .run();
  return c.json({ success: true });
});

// Refresh from Cloudflare — fetches the last 30 days of CF Analytics for the
// project's zone and upserts daily snapshots.
analytics.post("/projects/:id/refresh", async (c) => {
  const projectId = parseInt(c.req.param("id"), 10);
  const project = await c.env.DB.prepare(
    "SELECT id, name, cloudflare_zone_tag FROM projects WHERE id = ?"
  )
    .bind(projectId)
    .first<{ id: number; name: string; cloudflare_zone_tag: string | null }>();
  if (!project) return c.json({ error: "project not found" }, 404);
  if (!project.cloudflare_zone_tag) {
    return c.json({ error: "project has no cloudflare_zone_tag" }, 400);
  }
  if (!c.env.CF_API_TOKEN) {
    return c.json({ error: "CF_API_TOKEN not configured on worker" }, 500);
  }

  const result = await fetchCloudflareAnalytics(
    c.env,
    project.cloudflare_zone_tag,
    30
  );
  if (!result.ok) {
    return c.json({ error: result.error }, 502);
  }

  let inserted = 0;
  for (const day of result.days) {
    await c.env.DB.prepare(
      `INSERT INTO project_analytics_snapshots
         (project_id, date, source, pageviews, visitors, requests, bytes, raw_json)
       VALUES (?, ?, 'cloudflare', ?, ?, ?, ?, ?)
       ON CONFLICT(project_id, date, source) DO UPDATE SET
         pageviews = excluded.pageviews,
         visitors = excluded.visitors,
         requests = excluded.requests,
         bytes = excluded.bytes,
         raw_json = excluded.raw_json,
         fetched_at = datetime('now')`
    )
      .bind(
        projectId,
        day.date,
        day.pageviews,
        day.visitors,
        day.requests,
        day.bytes,
        JSON.stringify(day)
      )
      .run();
    inserted++;
  }

  await c.env.DB.prepare(
    `UPDATE projects SET
       analytics_last_fetched_at = datetime('now'),
       analytics_source = 'cloudflare'
     WHERE id = ?`
  )
    .bind(projectId)
    .run();

  return c.json({ success: true, days_fetched: inserted });
});

// Refresh ALL projects with a zone tag (cron + manual button).
analytics.post("/refresh-all", async (c) => {
  const stats = await refreshAllProjectAnalytics(c.env);
  return c.json(stats);
});

// List all Cloudflare zones the token can see.
analytics.get("/cf-zones", async (c) => {
  if (!c.env.CF_API_TOKEN) {
    return c.json({ error: "CF_API_TOKEN not configured" }, 500);
  }
  const zones: Array<{ id: string; name: string; status: string }> = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/zones?per_page=50&page=${page}`,
      {
        headers: { Authorization: `Bearer ${c.env.CF_API_TOKEN}` },
      }
    );
    if (!res.ok) {
      return c.json(
        {
          error: `CF API ${res.status}`,
          detail: await res.text(),
          hint:
            "Token may need 'Zone:Read' permission. Add it at dash.cloudflare.com/profile/api-tokens.",
        },
        502
      );
    }
    const json = await res.json<{
      success: boolean;
      result: Array<{ id: string; name: string; status: string }>;
      result_info: { total_pages: number; page: number };
      errors?: Array<{ message: string }>;
    }>();
    if (!json.success) {
      return c.json({ error: json.errors?.map((e) => e.message).join("; ") }, 502);
    }
    zones.push(...json.result);
    if (page >= json.result_info.total_pages) break;
    page++;
  }
  return c.json({ count: zones.length, zones });
});

// Auto-match CF zones to projects by analytics_domain. Updates cloudflare_zone_tag in place.
analytics.post("/auto-match", async (c) => {
  if (!c.env.CF_API_TOKEN) {
    return c.json({ error: "CF_API_TOKEN not configured" }, 500);
  }
  // Fetch zones
  const zones: Array<{ id: string; name: string }> = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/zones?per_page=50&page=${page}`,
      { headers: { Authorization: `Bearer ${c.env.CF_API_TOKEN}` } }
    );
    if (!res.ok) {
      return c.json({ error: `CF API ${res.status}: ${await res.text()}` }, 502);
    }
    const json = await res.json<{
      result: Array<{ id: string; name: string }>;
      result_info: { total_pages: number };
    }>();
    zones.push(...json.result);
    if (page >= json.result_info.total_pages) break;
    page++;
  }
  const zoneByName = new Map(zones.map((z) => [z.name.toLowerCase(), z.id]));

  // Pull all projects with analytics_domain set but no zone tag yet.
  const { results } = await c.env.DB.prepare(
    `SELECT id, name, analytics_domain
     FROM projects
     WHERE analytics_domain IS NOT NULL AND analytics_domain != ''`
  ).all<{ id: number; name: string; analytics_domain: string }>();

  const matched: Array<{ project: string; domain: string; zone_id: string }> = [];
  const unmatched: Array<{ project: string; domain: string }> = [];

  for (const p of results) {
    const zoneId = zoneByName.get(p.analytics_domain.toLowerCase());
    if (zoneId) {
      await c.env.DB.prepare(
        `UPDATE projects SET cloudflare_zone_tag = ?, updated_at = datetime('now') WHERE id = ?`
      )
        .bind(zoneId, p.id)
        .run();
      matched.push({ project: p.name, domain: p.analytics_domain, zone_id: zoneId });
    } else {
      unmatched.push({ project: p.name, domain: p.analytics_domain });
    }
  }

  return c.json({
    cf_zones_count: zones.length,
    matched: matched.length,
    unmatched: unmatched.length,
    matched_detail: matched,
    unmatched_detail: unmatched,
    available_zones: zones.map((z) => z.name),
  });
});

// ---------------------------------------------------------------------------
// Internals — exported for cron use
// ---------------------------------------------------------------------------

type CfDay = {
  date: string;
  pageviews: number;
  visitors: number;
  requests: number;
  bytes: number;
};

type CfFetchResult =
  | { ok: true; days: CfDay[] }
  | { ok: false; error: string };

export async function fetchCloudflareAnalytics(
  env: Bindings,
  zoneTag: string,
  days: number
): Promise<CfFetchResult> {
  if (!env.CF_API_TOKEN) {
    return { ok: false, error: "CF_API_TOKEN not configured" };
  }
  const end = new Date();
  const start = new Date(end.getTime() - (days - 1) * 24 * 3600 * 1000);
  const startDate = start.toISOString().slice(0, 10);
  const endDate = end.toISOString().slice(0, 10);

  const query = `
    query GetAnalytics($zoneTag: string!, $start: Date!, $end: Date!) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          httpRequests1dGroups(
            limit: 365,
            filter: { date_geq: $start, date_leq: $end },
            orderBy: [date_ASC]
          ) {
            dimensions { date }
            sum { requests pageViews bytes }
            uniq { uniques }
          }
        }
      }
    }
  `.trim();

  const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.CF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { zoneTag, start: startDate, end: endDate },
    }),
  });
  if (!res.ok) {
    return { ok: false, error: `CF API ${res.status}: ${await res.text()}` };
  }
  const json = await res.json<{
    data?: {
      viewer?: {
        zones?: Array<{
          httpRequests1dGroups?: Array<{
            dimensions: { date: string };
            sum: { requests: number; pageViews: number; bytes: number };
            uniq: { uniques: number };
          }>;
        }>;
      };
    };
    errors?: Array<{ message: string }>;
  }>();
  if (json.errors?.length) {
    return { ok: false, error: json.errors.map((e) => e.message).join("; ") };
  }
  const groups =
    json.data?.viewer?.zones?.[0]?.httpRequests1dGroups ?? [];
  return {
    ok: true,
    days: groups.map((g) => ({
      date: g.dimensions.date,
      pageviews: g.sum?.pageViews ?? 0,
      visitors: g.uniq?.uniques ?? 0,
      requests: g.sum?.requests ?? 0,
      bytes: g.sum?.bytes ?? 0,
    })),
  };
}

export async function refreshAllProjectAnalytics(env: Bindings): Promise<{
  ok: boolean;
  refreshed: number;
  failed: number;
  errors: Array<{ project: string; error: string }>;
}> {
  if (!env.CF_API_TOKEN) {
    return {
      ok: false,
      refreshed: 0,
      failed: 0,
      errors: [{ project: "*", error: "CF_API_TOKEN not configured" }],
    };
  }
  const { results } = await env.DB.prepare(
    `SELECT id, name, cloudflare_zone_tag FROM projects
     WHERE cloudflare_zone_tag IS NOT NULL AND cloudflare_zone_tag != ''`
  ).all<{ id: number; name: string; cloudflare_zone_tag: string }>();

  let refreshed = 0;
  let failed = 0;
  const errors: Array<{ project: string; error: string }> = [];

  for (const p of results) {
    const result = await fetchCloudflareAnalytics(env, p.cloudflare_zone_tag, 30);
    if (!result.ok) {
      failed++;
      errors.push({ project: p.name, error: result.error });
      continue;
    }
    for (const day of result.days) {
      await env.DB.prepare(
        `INSERT INTO project_analytics_snapshots
           (project_id, date, source, pageviews, visitors, requests, bytes, raw_json)
         VALUES (?, ?, 'cloudflare', ?, ?, ?, ?, ?)
         ON CONFLICT(project_id, date, source) DO UPDATE SET
           pageviews = excluded.pageviews,
           visitors = excluded.visitors,
           requests = excluded.requests,
           bytes = excluded.bytes,
           raw_json = excluded.raw_json,
           fetched_at = datetime('now')`
      )
        .bind(
          p.id,
          day.date,
          day.pageviews,
          day.visitors,
          day.requests,
          day.bytes,
          JSON.stringify(day)
        )
        .run();
    }
    await env.DB.prepare(
      `UPDATE projects SET
         analytics_last_fetched_at = datetime('now'),
         analytics_source = 'cloudflare'
       WHERE id = ?`
    )
      .bind(p.id)
      .run();
    refreshed++;
  }

  return { ok: true, refreshed, failed, errors };
}

export default analytics;
