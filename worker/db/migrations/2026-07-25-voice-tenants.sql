-- Multi-tenant routing for voice agents. Applies to ASCEND-DB only.
-- Apply: (from worker/) wrangler d1 execute ascend-db --remote --file=./db/migrations/2026-07-25-voice-tenants.sql
--
-- Adds the two columns that let one MCP server serve many clients:
--   db_binding  — which D1 binding this agent's caller data lands in.
--                 'DB' for Ascend's own agents, 'DB_<CODE>' for a tenant.
--   tenant_name — the business name the agent answers as.
--
-- Per-tenant databases, never a shared table with a tenant_id column. Same rule
-- as the directory playbook, and it is what makes a clean client exit possible:
-- export one database, hand it over, delete it.
--
-- Statements are bare DDL; remote D1 rejects explicit transaction blocks and
-- wrangler's splitter scans for those keywords even inside comments.

ALTER TABLE voice_agents ADD COLUMN db_binding TEXT NOT NULL DEFAULT 'DB';
ALTER TABLE voice_agents ADD COLUMN tenant_name TEXT;

-- Existing rows are Ascend's own agents and already default to 'DB'.
UPDATE voice_agents SET tenant_name = 'Ascend Systems' WHERE tenant_name IS NULL;
