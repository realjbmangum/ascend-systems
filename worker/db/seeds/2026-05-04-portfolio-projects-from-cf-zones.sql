-- =============================================================================
-- Seed: Portfolio projects from Cloudflare zones (May 4, 2026)
-- Run:  wrangler d1 execute ascend-db --remote --file=worker/db/seeds/2026-05-04-portfolio-projects-from-cf-zones.sql
--
-- Idempotent: uses WHERE NOT EXISTS guards. Safe to re-run.
--
-- Maps every CF zone Brian wants tracked to a CRM project + zone tag.
-- Skipped zones (per Brian May 4): 100dayforge.com, 100daytruth.com,
-- mangumhome.xyz, pethealthdecoded.com (killed), and all RecordStops alt
-- domains (findvinylstores/recordshopdirectory/recordshopguide/therecordguide/
-- therecordmap). FYI: maritimeelite.com / n8npulse.com / powerbinews.com
-- zones still exist in CF but their projects are deleted — clean up in CF.
-- =============================================================================

-- 1. UPDATE existing CRM project (SCDMV)
UPDATE projects SET
  cloudflare_zone_tag = '31c08c3afc370e6087e8d197225e2917',
  analytics_domain = 'scdmvappointments.com',
  analytics_source = 'cloudflare',
  updated_at = datetime('now')
WHERE name = 'SCDMV Alerts';

-- 2. CREATE active-product projects (only if not already in CRM)

-- LoveNotes
INSERT INTO projects (client_id, name, description, project_type, status, started_at, cloudflare_zone_tag, analytics_domain, analytics_source)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'LoveNotes',
  'Daily love message subscription. V1 was $5/mo (confirmed $0 MRR after 3.5mo). Pivoting to V2: Anniversary & Birthday Concierge ($99/yr).',
  'internal_product',
  'in_progress',
  datetime('now'),
  'f712aea2bcc14bec89bccb75ae96eacc',
  'sendmylove.app',
  'cloudflare'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'LoveNotes');

-- RecordStops
INSERT INTO projects (client_id, name, description, project_type, status, started_at, cloudflare_zone_tag, analytics_domain, analytics_source)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'RecordStops',
  'Record store directory. 296 stores across 5 states. 683 GA users/mo. Outreach drip live (Verify 1-3 + Featured 1-3). Inbound podcast lead (Patrick Foster).',
  'internal_product',
  'in_progress',
  datetime('now'),
  '753462a777274a6acaa6fb2f5f7fc807',
  'recordstops.com',
  'cloudflare'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'RecordStops');

-- Potty Directory
INSERT INTO projects (client_id, name, description, project_type, status, started_at, cloudflare_zone_tag, analytics_domain, analytics_source)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'Potty Directory',
  '3,704 vendors. AdSense live. Editorial blog redesign shipped Apr 19.',
  'internal_product',
  'in_progress',
  datetime('now'),
  '18e4a570da248b6d77e929f84a45e5c6',
  'pottydirectory.com',
  'cloudflare'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Potty Directory');

-- Ringdocket (.app — primary build domain)
INSERT INTO projects (client_id, name, description, project_type, status, started_at, cloudflare_zone_tag, analytics_domain, analytics_source)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'Ringdocket',
  'Spam blocker. iOS Phase 4a + 4b shipped to Brian iPhone Apr 29. Block list 28,546 numbers. FTC ingest 86k complaints. Primary domain — where everything builds.',
  'internal_product',
  'in_progress',
  datetime('now'),
  '972003760d4fd5f0e152e4683ec1fbe5',
  'ringdocket.app',
  'cloudflare'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Ringdocket');

-- Ringdocket .com (marketing / secondary)
INSERT INTO projects (client_id, name, description, project_type, status, started_at, cloudflare_zone_tag, analytics_domain, analytics_source)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'Ringdocket (.com)',
  'Secondary domain for Ringdocket — track separately so we can see traffic split between .app and .com.',
  'internal_product',
  'in_progress',
  datetime('now'),
  'a1084117af0319256ab663bb9f7a23d4',
  'ringdocket.com',
  'cloudflare'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Ringdocket (.com)');

-- Heirloom
INSERT INTO projects (client_id, name, description, project_type, status, started_at, cloudflare_zone_tag, analytics_domain, analytics_source)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'Heirloom',
  'Building with partner Oliver. MVP deployed. Security + Supabase tasks pending. Standalone repo: realjbmangum/heirloom.',
  'internal_product',
  'in_progress',
  datetime('now'),
  '02ccdef6050f95b2405e5a142bde9dbe',
  'theheirloom.site',
  'cloudflare'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Heirloom');

-- Indie Pharmacy
INSERT INTO projects (client_id, name, description, project_type, status, started_at, cloudflare_zone_tag, analytics_domain, analytics_source)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'Indie Pharmacy',
  'Independent pharmacy directory. Standalone repo (extracted Feb 1). $297/mo IndiePro upsell wired but no Stripe checkout. GHL canceled May 4.',
  'internal_product',
  'in_progress',
  datetime('now'),
  '35b856e5389cee57964dcd67d32b7bfb',
  'indiepharmacy.com',
  'cloudflare'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Indie Pharmacy');

-- Deadrop
INSERT INTO projects (client_id, name, description, project_type, status, started_at, cloudflare_zone_tag, analytics_domain, analytics_source)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'Deadrop',
  'Burn-on-read messages. Internal tool — also white-labeled for Ascend.',
  'internal_tool',
  'in_progress',
  datetime('now'),
  '13bcb2f70371f518b8c286b1be60648d',
  'deadrop.app',
  'cloudflare'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Deadrop');

-- Ascend Systems (the CRM itself)
INSERT INTO projects (client_id, name, description, project_type, status, started_at, cloudflare_zone_tag, analytics_domain, analytics_source)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'Ascend Systems',
  'AI consultancy / services brand + the CRM itself. Active client work (Chris Rutherford). Replaces GHL.',
  'internal_product',
  'in_progress',
  datetime('now'),
  'fae1681e4a56df75a0d590afd76745aa',
  'ascendsystems.ai',
  'cloudflare'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Ascend Systems');

-- Halo Integration (partnership)
INSERT INTO projects (client_id, name, description, project_type, status, started_at, cloudflare_zone_tag, analytics_domain, analytics_source)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'Halo Integration',
  'Live website for a partnership Brian is in.',
  'partnership',
  'in_progress',
  datetime('now'),
  '0aaa82e50cd99f261fd0363cd82883cd',
  'halointegration.com',
  'cloudflare'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Halo Integration');

-- Personal blog (jbmangum.com)
INSERT INTO projects (client_id, name, description, project_type, status, started_at, cloudflare_zone_tag, analytics_domain, analytics_source)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'Brian Mangum (personal)',
  'Personal blog / brand site. Substack mirror.',
  'personal',
  'in_progress',
  datetime('now'),
  '50b2a419b435b1bebbb17364d2342114',
  'jbmangum.com',
  'cloudflare'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Brian Mangum (personal)');

-- Suite Manager LLC (Chris's hotel ops site)
INSERT INTO projects (client_id, name, description, project_type, status, started_at, cloudflare_zone_tag, analytics_domain, analytics_source)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'Suite Manager LLC',
  'Marketing site for Chris''s hotel-management LLC. Client favor.',
  'client_site',
  'in_progress',
  datetime('now'),
  '1ff9ab551e2dcff65ad8d11e1f30123a',
  'suitemanagerllc.com',
  'cloudflare'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Suite Manager LLC');

-- 3. CREATE on_hold projects (newly identified)

INSERT INTO projects (client_id, name, description, project_type, status, started_at, cloudflare_zone_tag, analytics_domain, analytics_source)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'Bike Shop Index',
  'Bike shop directory experiment. On hold May 4 — see ON-HOLD.md when added to on-hold/ folder.',
  'internal_product',
  'on_hold',
  datetime('now'),
  '15611cb0e9da161dd1193c81f9d29e3e',
  'bikeshopindex.com',
  'cloudflare'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Bike Shop Index');

INSERT INTO projects (client_id, name, description, project_type, status, started_at, cloudflare_zone_tag, analytics_domain, analytics_source)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'Funeral Home Lookup',
  'Funeral home directory experiment. On hold May 4.',
  'internal_product',
  'on_hold',
  datetime('now'),
  '2871757a020af36560b4eb2609012440',
  'funeralhomelookup.com',
  'cloudflare'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Funeral Home Lookup');

INSERT INTO projects (client_id, name, description, project_type, status, started_at, cloudflare_zone_tag, analytics_domain, analytics_source)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'Headbangers Ball Project',
  'On hold May 4.',
  'internal_product',
  'on_hold',
  datetime('now'),
  'c3a2942841cb5fe6536f78f4db784f6d',
  'headbangersballproject.com',
  'cloudflare'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Headbangers Ball Project');

-- 4. CREATE on_hold projects for existing on-hold sites (so they're visible in CRM)

INSERT INTO projects (client_id, name, description, project_type, status, started_at, cloudflare_zone_tag, analytics_domain, analytics_source)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'Best US National Parks',
  'Directory of all 63 US national parks with NPS live data + drip email + checklist. ON HOLD May 4 — no GA/GSC verified, hard SEO ceiling vs nps.gov.',
  'internal_product',
  'on_hold',
  datetime('now'),
  '3193c890dca20da8ebe0bad6fa6dd287',
  'bestusnationalparks.com',
  'cloudflare'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Best US National Parks');

INSERT INTO projects (client_id, name, description, project_type, status, started_at, cloudflare_zone_tag, analytics_domain, analytics_source)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'Best Waterfalls',
  '258 waterfalls, 33 states, 577 pages. ON HOLD May 4 — 100 pv/mo verified (GSC). Best position of outdoor trio but 12-24mo compounding bet.',
  'internal_product',
  'on_hold',
  datetime('now'),
  '02f27fd7537c732c27fda7f7b7a78cf0',
  'bestwaterfalls.com',
  'cloudflare'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Best Waterfalls');

INSERT INTO projects (client_id, name, description, project_type, status, started_at, cloudflare_zone_tag, analytics_domain, analytics_source)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'Camping Native',
  '83 gear-review blog posts + Sasquatch Sam mascot. ON HOLD May 4 — no analytics, no moat vs Wirecutter/REI. Kill candidate.',
  'internal_product',
  'on_hold',
  datetime('now'),
  'e3687c5df01a3776034d282ad5141d54',
  'campingnative.com',
  'cloudflare'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Camping Native');

INSERT INTO projects (client_id, name, description, project_type, status, started_at, cloudflare_zone_tag, analytics_domain, analytics_source)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'TXDPS Alerts',
  'Texas DPS appointment alerts. ON HOLD May 4 — premature SCDMV expansion + scraper legal risk (TX Penal Code 33.02 felony exposure flagged).',
  'internal_product',
  'on_hold',
  datetime('now'),
  '275ad3f55bdfdecaf1d9a1e3f5abb16c',
  'texasdpsalerts.com',
  'cloudflare'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'TXDPS Alerts');

-- 5. CREATE on_hold projects with NO domain (PRD-only)

INSERT INTO projects (client_id, name, description, project_type, status, started_at)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'Church Directory',
  'NC church finder, 15-20k listings via Google Places. PRD ready, never built. Highest keyword volume in portfolio (550K-1.5M monthly searches per kw research).',
  'internal_product',
  'on_hold',
  datetime('now')
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Church Directory');

INSERT INTO projects (client_id, name, description, project_type, status, started_at)
SELECT
  (SELECT id FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1),
  'State Hunting Leases',
  'SE US hunting lease marketplace. PRD ready, never built. Two-sided marketplace = hardest shape to bootstrap.',
  'internal_product',
  'on_hold',
  datetime('now')
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'State Hunting Leases');
