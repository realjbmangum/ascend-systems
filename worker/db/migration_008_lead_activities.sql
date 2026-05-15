-- ===== Migration 008: lead activities =====
-- Calls, meetings, emails, and tasks logged against a lead. Activities with a
-- due_at can be synced to Microsoft 365 calendar via Graph (graph_event_id).

CREATE TABLE IF NOT EXISTS lead_activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL REFERENCES leads(id),
  type TEXT NOT NULL DEFAULT 'task',
  subject TEXT NOT NULL,
  notes TEXT,
  due_at TEXT,
  duration_minutes INTEGER,
  done INTEGER NOT NULL DEFAULT 0,
  done_at TEXT,
  graph_event_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_due ON lead_activities(due_at);
