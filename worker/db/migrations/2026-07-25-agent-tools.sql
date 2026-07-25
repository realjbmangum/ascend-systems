-- Per-agent tool allow-lists, so one tenant can run several agents that hand
-- calls to each other — dispatch, sales, accounts, operations — each with a
-- different voice and a different set of tools.
--
-- Apply: (from worker/) wrangler d1 execute ascend-db --remote --file=./db/migrations/2026-07-25-agent-tools.sql
--
-- tools_allow is a JSON array of tool names. NULL means "everything this scope
-- allows", which is the existing behaviour, so nothing changes for agents that
-- do not set it. It can only ever NARROW a scope, never widen it: an agent
-- cannot name a tool its scope does not already grant.
--
-- Bare DDL — remote D1 rejects transaction blocks.

ALTER TABLE voice_agents ADD COLUMN tools_allow TEXT;

-- Which department this agent answers as, for prompts and transfer routing.
ALTER TABLE voice_agents ADD COLUMN department TEXT;
