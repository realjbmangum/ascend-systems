-- Migration 010 — Statement of Work fields on proposals.
--
-- Turns a signed proposal into a binding Statement of Work: adds the
-- SOW content sections, ties the document to a Master Services
-- Agreement version, and extends the e-signature record.
--
-- Apply (remote):
--   npx wrangler d1 execute ascend-db --remote --file=worker/db/migration_010_proposals_sow.sql

-- SOW content sections
ALTER TABLE proposals ADD COLUMN out_of_scope TEXT;
ALTER TABLE proposals ADD COLUMN pricing_model TEXT;            -- 'time_materials' | 'fixed' | 'retainer'
ALTER TABLE proposals ADD COLUMN payment_schedule TEXT;
ALTER TABLE proposals ADD COLUMN client_responsibilities TEXT;
ALTER TABLE proposals ADD COLUMN acceptance_criteria TEXT;

-- MSA incorporation — the SOW is governed by this MSA version
ALTER TABLE proposals ADD COLUMN msa_version TEXT DEFAULT '2026-05';

-- E-signature record — captured when the client signs
ALTER TABLE proposals ADD COLUMN msa_accepted INTEGER NOT NULL DEFAULT 0;
ALTER TABLE proposals ADD COLUMN signer_title TEXT;
ALTER TABLE proposals ADD COLUMN signer_email TEXT;
