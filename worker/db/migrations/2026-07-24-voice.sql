-- Voice agent tables for the Grok Voice receptionist and the personal assistant.
-- Additive and voice_-namespaced — zero collision with CRM tables.
-- Apply: (from worker/) wrangler d1 execute ascend-db --remote --file=./db/migrations/2026-07-24-voice.sql
-- Conventions match the rest of ascend-db: INTEGER PK AUTOINCREMENT, snake_case,
-- TEXT timestamps defaulting to datetime('now'), CREATE TABLE IF NOT EXISTS.
-- Statements are bare DDL: remote D1 rejects explicit transaction blocks, and
-- wrangler's SQL splitter scans for those keywords even inside comments — so
-- don't name them here either.

-- One row per agent that may call the MCP tool server. The bearer token xAI
-- sends in the `authorization` field of an mcp tool block is matched here by
-- SHA-256 hash; the row's scope decides which tools that agent can even see.
--
-- scope:
--   'receptionist' — caller-facing. Write-mostly: create leads, log calls,
--                    check availability, book. Must never read the pipeline,
--                    invoices, or any other lead's details.
--   'assistant'    — Brian's own voice. Full read/write across the CRM.
--   'client'       — reserved for per-tenant agents; scoped by client_id.
CREATE TABLE IF NOT EXISTS voice_agents (
  id                       INTEGER PRIMARY KEY AUTOINCREMENT,
  key                      TEXT NOT NULL UNIQUE,      -- 'receptionist' | 'assistant'
  label                    TEXT NOT NULL,
  scope                    TEXT NOT NULL DEFAULT 'receptionist',
  token_hash               TEXT NOT NULL UNIQUE,      -- SHA-256 hex of the bearer token
  client_id                INTEGER REFERENCES clients(id),
  -- Cost guardrail. The session bridge refuses new calls once the agent's
  -- spend for the current UTC day crosses this. 0 = no ceiling.
  daily_cost_ceiling_cents INTEGER NOT NULL DEFAULT 500,
  active                   INTEGER NOT NULL DEFAULT 1,
  created_at               TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at               TEXT NOT NULL DEFAULT (datetime('now'))
);

-- One row per call. cost_cents is computed at finalize from duration at the
-- xAI rate ($0.05/min voice + $0.01/min number = 6 cents/min) so /admin/calls
-- can show spend without a second API round-trip.
CREATE TABLE IF NOT EXISTS voice_calls (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id          INTEGER NOT NULL REFERENCES voice_agents(id),
  call_id           TEXT NOT NULL UNIQUE,     -- xAI call_id from the webhook
  direction         TEXT NOT NULL DEFAULT 'inbound',
  from_number       TEXT,
  to_number         TEXT,
  started_at        TEXT NOT NULL DEFAULT (datetime('now')),
  ended_at          TEXT,
  duration_seconds  INTEGER,
  cost_cents        INTEGER,
  -- 'in_progress' | 'completed' | 'transferred' | 'abandoned' | 'error'
  outcome           TEXT NOT NULL DEFAULT 'in_progress',
  -- Set when the agent handed off via SIP REFER.
  transferred_to    TEXT,
  lead_id           INTEGER REFERENCES leads(id),
  transcript_r2_key TEXT,
  summary           TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_voice_calls_agent   ON voice_calls(agent_id);
CREATE INDEX IF NOT EXISTS idx_voice_calls_started ON voice_calls(started_at);
CREATE INDEX IF NOT EXISTS idx_voice_calls_lead    ON voice_calls(lead_id);
CREATE INDEX IF NOT EXISTS idx_voice_calls_outcome ON voice_calls(outcome);

-- Append-only event log for a call: transcript turns, tool calls, refer/hangup.
-- Kept separate from voice_calls so the summary row stays cheap to query and
-- the event stream can be pruned independently.
CREATE TABLE IF NOT EXISTS voice_call_events (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  voice_call_id INTEGER NOT NULL REFERENCES voice_calls(id),
  seq           INTEGER NOT NULL,
  -- 'user_transcript' | 'agent_transcript' | 'tool_call' | 'refer' | 'hangup' | 'error'
  type          TEXT NOT NULL,
  content       TEXT,
  payload_json  TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(voice_call_id, seq)
);
CREATE INDEX IF NOT EXISTS idx_voice_events_call ON voice_call_events(voice_call_id);

-- Attribution: mark the source values the voice path writes into leads, so the
-- existing /admin/leads filters and the Kanban pick them up unchanged.
--   source_origin  = 'voice'
--   source_channel = 'phone-980'
--   source_channel_id = the xAI call_id
--
-- NOTE ON leads.email: it is NOT NULL and stays that way. SQLite cannot drop a
-- NOT NULL constraint without a full table rebuild, and `leads` is referenced by
-- lead_activities, tasks, proposals, and invoices — a rebuild on live data with
-- no transaction available on remote D1 is not worth the risk for this. Callers
-- who never give an email get a deterministic sentinel
-- (voice+{call_id}@no-email.invalid) and are skipped by the drip enrollment, so
-- nothing is ever mailed to a fake address. See create_lead in
-- worker/src/lib/voice-tools.ts.
