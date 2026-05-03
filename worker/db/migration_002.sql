-- ===== Migration 002: proposals + audit log =====

CREATE TABLE IF NOT EXISTS proposals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL REFERENCES clients(id),
  project_id INTEGER REFERENCES projects(id),
  lead_id INTEGER REFERENCES leads(id),
  title TEXT NOT NULL,
  content_html TEXT NOT NULL,
  content_markdown TEXT,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  access_token TEXT UNIQUE,
  sent_at TEXT,
  viewed_at TEXT,
  signed_at TEXT,
  signed_by_name TEXT,
  signed_by_email TEXT,
  signature_ip TEXT,
  signature_user_agent TEXT,
  rejected_at TEXT,
  rejection_reason TEXT,
  expires_at TEXT,
  r2_key TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_proposals_client ON proposals(client_id);
CREATE INDEX IF NOT EXISTS idx_proposals_project ON proposals(project_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_token ON proposals(access_token);

CREATE TABLE IF NOT EXISTS proposal_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  actor TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_proposal_events_proposal ON proposal_events(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_events_type ON proposal_events(event_type);
