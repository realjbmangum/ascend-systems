-- Link invoices back to the proposal they were generated from.
-- One-off invoices (no proposal) simply leave this null.
ALTER TABLE invoices ADD COLUMN proposal_id INTEGER REFERENCES proposals(id);
CREATE INDEX IF NOT EXISTS idx_invoices_proposal ON invoices(proposal_id);
