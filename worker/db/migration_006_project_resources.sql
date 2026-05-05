-- Migration 006 — Project resources
-- Reference content per project (templates, contacts, checklists, brand assets, links).
-- Replaces the practice of fragmenting content across local markdown files.
--
-- Run: wrangler d1 execute ascend-db --remote --file=worker/db/migration_006_project_resources.sql

CREATE TABLE IF NOT EXISTS project_resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id),
  type TEXT NOT NULL,             -- template | contacts | checklist | brand_asset | link | doc
  title TEXT NOT NULL,
  content_markdown TEXT,
  url TEXT,                       -- for type='link' or external asset reference
  sort_order INTEGER NOT NULL DEFAULT 0,
  source_path TEXT,               -- repo path where content was imported from
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_project_resources_project ON project_resources(project_id);
CREATE INDEX IF NOT EXISTS idx_project_resources_type ON project_resources(type);
