import { Hono } from "hono";
import type { Bindings, Variables } from "../types";
import { requireAuth } from "../middleware";

// Self-contained sub-router for the /admin/seo section. Mounted at /api/seo.
// Reads seo_sites / seo_metrics / seo_actions (see db/migrations/2026-07-22-seo.sql).
const seo = new Hono<{ Bindings: Bindings; Variables: Variables }>();

seo.use("*", requireAuth("admin"));

type SiteRow = {
  id: number;
  key: string;
  label: string;
  domain: string;
  gsc_property: string;
  is_priority: number;
  created_at: string;
  updated_at: string;
};

type LatestMetric = {
  captured_on: string;
  clicks: number | null;
  impressions: number | null;
  ctr: number | null;
  avg_position: number | null;
  indexable_pages: number | null;
  ai_readiness_score: number | null;
};

type ActionCountRow = {
  site_id: number;
  open: number;
  in_progress: number;
  done: number;
  dismissed: number;
  high_open: number;
};

// Dashboard payload: every tracked site with its most recent metrics snapshot
// and a roll-up of action counts by status.
seo.get("/overview", async (c) => {
  const { results: sites } = await c.env.DB.prepare(
    "SELECT * FROM seo_sites ORDER BY is_priority DESC, label"
  ).all<SiteRow>();

  const { results: countRows } = await c.env.DB.prepare(
    `SELECT site_id,
       SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS open,
       SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress,
       SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS done,
       SUM(CASE WHEN status = 'dismissed' THEN 1 ELSE 0 END) AS dismissed,
       SUM(CASE WHEN status = 'open' AND severity = 'high' THEN 1 ELSE 0 END) AS high_open
     FROM seo_actions
     GROUP BY site_id`
  ).all<ActionCountRow>();

  const countsBySite = new Map<number, ActionCountRow>();
  for (const row of countRows) countsBySite.set(row.site_id, row);

  const out = await Promise.all(
    sites.map(async (site) => {
      // Most recent snapshot for this site. Tie-break on id so a captured_on
      // shared across sources resolves to the latest-inserted row.
      const latest = await c.env.DB.prepare(
        `SELECT captured_on, clicks, impressions, ctr, avg_position,
                indexable_pages, ai_readiness_score
         FROM seo_metrics
         WHERE site_id = ?
         ORDER BY captured_on DESC, id DESC
         LIMIT 1`
      )
        .bind(site.id)
        .first<LatestMetric>();
      const counts = countsBySite.get(site.id);
      return {
        id: site.id,
        key: site.key,
        label: site.label,
        domain: site.domain,
        gsc_property: site.gsc_property,
        latest: latest ?? null,
        actions: {
          open: counts?.open ?? 0,
          in_progress: counts?.in_progress ?? 0,
          done: counts?.done ?? 0,
          dismissed: counts?.dismissed ?? 0,
          high_open: counts?.high_open ?? 0,
        },
      };
    })
  );

  return c.json({ sites: out });
});

seo.get("/sites", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM seo_sites ORDER BY is_priority DESC, label"
  ).all();
  return c.json(results);
});

// Time-series for one site over the last `days` days (default 90), oldest first.
seo.get("/metrics", async (c) => {
  const siteId = c.req.query("site_id");
  if (!siteId) return c.json({ error: "site_id is required" }, 400);
  const daysRaw = parseInt(c.req.query("days") ?? "", 10);
  const days = Number.isFinite(daysRaw) && daysRaw > 0 ? daysRaw : 90;
  const { results } = await c.env.DB.prepare(
    `SELECT * FROM seo_metrics
     WHERE site_id = ? AND captured_on >= date('now', ?)
     ORDER BY captured_on ASC`
  )
    .bind(siteId, `-${days} days`)
    .all();
  return c.json(results);
});

seo.get("/actions", async (c) => {
  const siteId = c.req.query("site_id");
  const goal = c.req.query("goal");
  const status = c.req.query("status");
  const where: string[] = [];
  const params: string[] = [];
  if (siteId) {
    where.push("site_id = ?");
    params.push(siteId);
  }
  if (goal) {
    where.push("goal = ?");
    params.push(goal);
  }
  if (status) {
    where.push("status = ?");
    params.push(status);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const { results } = await c.env.DB.prepare(
    `SELECT * FROM seo_actions
     ${whereSql}
     ORDER BY
       CASE severity WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END,
       first_seen_at DESC`
  )
    .bind(...params)
    .all();
  return c.json(results);
});

seo.post("/actions", async (c) => {
  const body = await c.req.json<{
    site_id?: number;
    goal?: string;
    title?: string;
    detail?: string;
    severity?: string;
    source_report?: string;
    url?: string;
    search_value?: string;
    dedupe_key?: string;
  }>();
  if (!body.site_id || !body.title) {
    return c.json({ error: "site_id and title are required" }, 400);
  }
  const dedupeKey =
    body.dedupe_key ??
    "manual:" +
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 60);
  const result = await c.env.DB.prepare(
    `INSERT INTO seo_actions
       (site_id, dedupe_key, goal, title, detail, severity, source_report, url, search_value)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      body.site_id,
      dedupeKey,
      body.goal ?? "google",
      body.title,
      body.detail ?? null,
      body.severity ?? "medium",
      body.source_report ?? null,
      body.url ?? null,
      body.search_value ?? null
    )
    .run();
  return c.json({ success: true, id: result.meta.last_row_id });
});

seo.patch("/actions/:id", async (c) => {
  const body = await c.req.json<{
    status?: string;
    goal?: string;
    severity?: string;
    title?: string;
    detail?: string;
  }>();
  const sets: string[] = [];
  const params: (string | null)[] = [];
  if (body.status) {
    sets.push("status = ?");
    params.push(body.status);
    // done_at tracks completion: stamped when moving to done, cleared otherwise.
    if (body.status === "done") {
      sets.push("done_at = datetime('now')");
    } else {
      sets.push("done_at = NULL");
    }
  }
  if (body.goal) {
    sets.push("goal = ?");
    params.push(body.goal);
  }
  if (body.severity) {
    sets.push("severity = ?");
    params.push(body.severity);
  }
  if (body.title !== undefined) {
    sets.push("title = ?");
    params.push(body.title);
  }
  if (body.detail !== undefined) {
    sets.push("detail = ?");
    params.push(body.detail);
  }
  if (sets.length === 0) return c.json({ error: "nothing to update" }, 400);
  sets.push("updated_at = datetime('now')");
  params.push(c.req.param("id"));
  await c.env.DB.prepare(`UPDATE seo_actions SET ${sets.join(", ")} WHERE id = ?`)
    .bind(...params)
    .run();
  return c.json({ success: true });
});

seo.delete("/actions/:id", async (c) => {
  await c.env.DB.prepare("DELETE FROM seo_actions WHERE id = ?")
    .bind(c.req.param("id"))
    .run();
  return c.json({ success: true });
});

export default seo;
