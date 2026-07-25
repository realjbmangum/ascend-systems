-- TENANT database schema. One database per client — this file is applied to a
-- fresh D1 for every new voice client.
--
--   npx wrangler d1 create voice-<code>
--   npx wrangler d1 execute voice-<code> --remote --file=./db/tenant-schema.sql
--
-- Deliberately a SUBSET of ascend-db: leads, lead_activities and tasks, with
-- column names kept identical so the shared tool handlers and the createTask
-- helper work against either database unchanged. Nothing about Ascend's own
-- business (projects, invoices, proposals, seo_*) exists here, and nothing about
-- a client exists in ascend-db.
--
-- Bare DDL only — remote D1 rejects explicit transaction blocks.

-- Callers captured by the voice agent.
-- NOTE: email is nullable here, unlike ascend-db. A phone caller often never
-- gives one, and a fresh tenant database has no drip sequences to protect, so
-- there is no reason to carry the sentinel-address workaround into new clients.
CREATE TABLE IF NOT EXISTS leads (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  name              TEXT NOT NULL,
  email             TEXT,
  phone             TEXT,
  company           TEXT,
  project_type      TEXT,          -- reused as "service requested"
  budget_range      TEXT,
  message           TEXT,
  status            TEXT NOT NULL DEFAULT 'new',
  notes             TEXT,
  address           TEXT,
  industry          TEXT,
  deal_value_cents  INTEGER NOT NULL DEFAULT 0,
  source_origin     TEXT,          -- 'voice'
  source_channel    TEXT,          -- 'voice-<code>'
  source_channel_id TEXT,          -- xAI call_id
  owner             TEXT,
  labels            TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_leads_status  ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_phone   ON leads(phone);

-- Calls, meetings and follow-ups logged against a lead.
CREATE TABLE IF NOT EXISTS lead_activities (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id          INTEGER NOT NULL REFERENCES leads(id),
  type             TEXT NOT NULL DEFAULT 'task',   -- call | meeting | email | task
  subject          TEXT NOT NULL,
  notes            TEXT,
  due_at           TEXT,
  duration_minutes INTEGER,
  done             INTEGER NOT NULL DEFAULT 0,
  done_at          TEXT,
  graph_event_id   TEXT,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_activities_lead ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_due  ON lead_activities(due_at);

-- Work the call generated for the client's own staff.
-- Column names match ascend-db's tasks table so createTask() works unchanged.
CREATE TABLE IF NOT EXISTS tasks (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  type          TEXT NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  priority      TEXT NOT NULL DEFAULT 'medium',
  status        TEXT NOT NULL DEFAULT 'open',
  client_id     INTEGER,
  lead_id       INTEGER REFERENCES leads(id),
  metadata_json TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_lead   ON tasks(lead_id);

-- The client's existing customers, so the agent can recognise a caller by phone
-- instead of treating every regular as a stranger.
CREATE TABLE IF NOT EXISTS customers (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  phone         TEXT,
  email         TEXT,
  account_ref   TEXT,
  site_name     TEXT,
  address       TEXT,
  service_plan  TEXT,
  balance_cents INTEGER NOT NULL DEFAULT 0,
  notes         TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- Open and historical jobs, so "where is my technician" is answerable.
CREATE TABLE IF NOT EXISTS work_orders (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id   INTEGER REFERENCES customers(id),
  reference     TEXT NOT NULL,
  summary       TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'scheduled', -- scheduled|dispatched|complete|cancelled
  priority      TEXT NOT NULL DEFAULT 'normal',    -- normal|urgent|emergency
  technician    TEXT,
  scheduled_for TEXT,
  completed_at  TEXT,
  notes         TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_wo_customer ON work_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_wo_status   ON work_orders(status);
