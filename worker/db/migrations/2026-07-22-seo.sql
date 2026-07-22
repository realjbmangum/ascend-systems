-- SEO tracking tables for the /admin/seo section.
-- Additive and seo_-namespaced — zero collision with CRM tables.
-- Apply: (from worker/) wrangler d1 execute ascend-db --remote --file=./db/migrations/2026-07-22-seo.sql
-- Conventions match the rest of ascend-db: INTEGER PK AUTOINCREMENT, snake_case,
-- TEXT timestamps defaulting to datetime('now'), CREATE TABLE IF NOT EXISTS.

-- Tracked sites.
CREATE TABLE IF NOT EXISTS seo_sites (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  key          TEXT NOT NULL UNIQUE,          -- 'recordstops' | 'pottydirectory' | 'ascend'
  label        TEXT NOT NULL,                 -- 'RecordStops'
  domain       TEXT NOT NULL,                 -- 'recordstops.com'
  gsc_property TEXT NOT NULL,                 -- 'sc-domain:recordstops.com'
  is_priority  INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Time-series snapshots. One row per site per ingestion run. This is what makes
-- trends and forecasts possible — every run appends; history compounds.
CREATE TABLE IF NOT EXISTS seo_metrics (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id            INTEGER NOT NULL REFERENCES seo_sites(id),
  captured_on        TEXT NOT NULL,           -- 'YYYY-MM-DD' run date
  period_start       TEXT,                    -- GSC window start
  period_end         TEXT,                    -- GSC window end
  clicks             INTEGER,
  impressions        INTEGER,
  ctr                REAL,                    -- 0..1
  avg_position       REAL,
  indexable_pages    INTEGER,
  total_pages        INTEGER,
  ai_readiness_score INTEGER,                 -- 0..100, null if not computed
  ai_checks_passed   INTEGER,
  ai_checks_failed   INTEGER,
  source             TEXT NOT NULL DEFAULT 'seo-cli',
  raw_json           TEXT,                    -- full report payload for later study
  created_at         TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(site_id, captured_on, source)
);

-- The action checklist. dedupe_key is stable per finding so re-ingestion updates
-- the finding text but PRESERVES the status the user set in the UI.
CREATE TABLE IF NOT EXISTS seo_actions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id       INTEGER NOT NULL REFERENCES seo_sites(id),
  dedupe_key    TEXT NOT NULL,                -- stable identity for idempotent upsert
  goal          TEXT NOT NULL DEFAULT 'google',   -- 'google' | 'ai' | 'technical'
  title         TEXT NOT NULL,
  detail        TEXT,
  severity      TEXT NOT NULL DEFAULT 'medium',    -- 'high' | 'medium' | 'low'
  status        TEXT NOT NULL DEFAULT 'open',      -- 'open' | 'in_progress' | 'done' | 'dismissed'
  source_report TEXT,                          -- 'cannibalisation' | 'ai-readiness' | ...
  url           TEXT,                          -- affected URL if any
  search_value  TEXT,                          -- e.g. '0 clicks / 0 sessions'
  first_seen_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now')),
  done_at       TEXT,
  UNIQUE(site_id, dedupe_key)
);

CREATE INDEX IF NOT EXISTS idx_seo_metrics_site ON seo_metrics(site_id, captured_on);
CREATE INDEX IF NOT EXISTS idx_seo_actions_site ON seo_actions(site_id, status);

-- Seed the three priority sites (idempotent).
INSERT INTO seo_sites (key, label, domain, gsc_property, is_priority) VALUES
  ('recordstops',    'RecordStops',    'recordstops.com',    'sc-domain:recordstops.com',    1),
  ('pottydirectory', 'PottyDirectory', 'pottydirectory.com', 'sc-domain:pottydirectory.com', 1),
  ('ascend',         'Ascend Systems', 'ascendsystems.ai',   'sc-domain:ascendsystems.ai',   1)
ON CONFLICT(key) DO NOTHING;
