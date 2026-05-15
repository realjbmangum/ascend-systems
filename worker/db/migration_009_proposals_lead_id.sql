-- ===== Migration 009: proposals.lead_id =====
-- Lets a proposal be written for a lead before it is converted to a client.
-- The deployed proposals table never had this column (migration_002 was
-- superseded by a later rebuild), so add it now.

ALTER TABLE proposals ADD COLUMN lead_id INTEGER REFERENCES leads(id);
CREATE INDEX IF NOT EXISTS idx_proposals_lead ON proposals(lead_id);
