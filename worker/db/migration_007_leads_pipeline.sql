-- ===== Migration 007: lead pipeline fields (Pipedrive parity) =====
-- Adds contact, organization, deal, and source fields to the leads table
-- so a lead can be fully managed without converting to a client first.

ALTER TABLE leads ADD COLUMN phone TEXT;
ALTER TABLE leads ADD COLUMN website TEXT;
ALTER TABLE leads ADD COLUMN linkedin TEXT;
ALTER TABLE leads ADD COLUMN title TEXT;
ALTER TABLE leads ADD COLUMN address TEXT;
ALTER TABLE leads ADD COLUMN industry TEXT;
ALTER TABLE leads ADD COLUMN employee_count TEXT;
ALTER TABLE leads ADD COLUMN annual_revenue TEXT;
ALTER TABLE leads ADD COLUMN deal_value_cents INTEGER NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN expected_close_date TEXT;
ALTER TABLE leads ADD COLUMN source_origin TEXT;
ALTER TABLE leads ADD COLUMN source_channel TEXT;
ALTER TABLE leads ADD COLUMN source_channel_id TEXT;
ALTER TABLE leads ADD COLUMN owner TEXT;
ALTER TABLE leads ADD COLUMN labels TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_owner ON leads(owner);
