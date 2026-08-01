-- Adds a site_type classification to seo_sites so the /admin/seo tabs can show
-- a color-coded indicator (directory / app / site) with a tooltip.
-- Additive and seo_-namespaced — zero collision with CRM tables.
-- Apply: (from worker/) wrangler d1 execute ascend-db --remote --file=./db/migrations/2026-08-01-seo-site-type.sql
-- Conventions match the rest of ascend-db: snake_case, additive ALTER, idempotent-friendly.
--
-- First-pass classification only — Brian will correct. Three buckets:
--   'directory' — programmatic/listing sites
--   'app'       — product apps
--   'site'      — brand/marketing sites
-- key='program' ("Action Items") is left NULL — it's a placeholder, not a real site.

ALTER TABLE seo_sites ADD COLUMN site_type TEXT;

-- Directories.
UPDATE seo_sites SET site_type = 'directory'
  WHERE key IN (
    'recordstops',
    'pottydirectory',
    'indiepharmacy',
    'nationalparks',
    'waterfalls',
    'bikeshopindex',
    'campingnative',
    'funeralhomelookup'
  );

-- Apps.
UPDATE seo_sites SET site_type = 'app'
  WHERE key IN (
    'scdmvalerts',
    'ringdocket',
    'deadrop',
    'heirloom'
  );

-- Brand / marketing sites.
UPDATE seo_sites SET site_type = 'site'
  WHERE key IN (
    'ascend',
    'halointegration',
    'crownandcompass'
  );
