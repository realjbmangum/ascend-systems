-- Migration 004 — Project analytics
-- Adds Cloudflare Analytics integration to projects.
--
-- Run:  wrangler d1 execute ascend-db --remote --file=worker/db/migration_004_analytics.sql

ALTER TABLE projects ADD COLUMN cloudflare_zone_tag TEXT;
ALTER TABLE projects ADD COLUMN analytics_domain TEXT;
ALTER TABLE projects ADD COLUMN analytics_source TEXT;
ALTER TABLE projects ADD COLUMN analytics_last_fetched_at TEXT;

-- One snapshot row per (project, date). Keep raw JSON for debugging + future expansion.
CREATE TABLE IF NOT EXISTS project_analytics_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id),
  date TEXT NOT NULL,                    -- YYYY-MM-DD (UTC)
  source TEXT NOT NULL,                  -- 'cloudflare' | 'manual' | 'ga4'
  pageviews INTEGER NOT NULL DEFAULT 0,
  visitors INTEGER NOT NULL DEFAULT 0,
  requests INTEGER,
  bytes INTEGER,
  raw_json TEXT,
  fetched_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(project_id, date, source)
);
CREATE INDEX IF NOT EXISTS idx_pas_project_date ON project_analytics_snapshots(project_id, date DESC);
