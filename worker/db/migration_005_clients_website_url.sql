-- Migration 005 — Website URL on clients
-- Lets the admin store + display each client's marketing site URL.
--
-- Run: wrangler d1 execute ascend-db --remote --file=worker/db/migration_005_clients_website_url.sql

ALTER TABLE clients ADD COLUMN website_url TEXT;
