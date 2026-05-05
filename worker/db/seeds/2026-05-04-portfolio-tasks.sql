-- =============================================================================
-- Seed: Portfolio tasks from May 4, 2026 triage
-- Run after: migration_003_add_project_id_to_tasks.sql
-- Command:   wrangler d1 execute ascend-db --remote --file=worker/db/seeds/2026-05-04-portfolio-tasks.sql
--
-- This seed loads the following into the Ascend CRM as the source of truth:
--   1. Lighthouse 27 internal client (Brian's own portfolio)
--   2. Three projects: Patriot Directory, SCDMV Alerts, Masonry Contract Review
--   3. ~40 tasks from the May 4 triage deep-dives
--
-- After running, manage everything at https://ascendsystems.ai/admin/projects.
-- Stop maintaining task lists in markdown.
-- =============================================================================

-- 1. Internal client for Brian's own portfolio
INSERT INTO clients (company_name, contact_name, email, notes)
VALUES (
  'Lighthouse 27 LLC (Internal)',
  'Brian Mangum',
  'bmangum1@gmail.com',
  'Internal client wrapper for Brian''s own product portfolio. Use this for projects he owns (Patriot Directory, SCDMV Alerts, etc.) so they live in the same CRM as client work.'
);

-- 2. Three projects under the internal client.
-- Uses sub-selects so this works without knowing the auto-incremented IDs.

INSERT INTO projects (client_id, name, description, project_type, status, started_at)
SELECT id, 'Patriot Directory', 'Directory of patriot/American-owned businesses. 67 listings as of May 4. Wedge: NC+SC, 200 verified listings with 100-word stories. Compete on curation vs. PublicSq''s scale.', 'internal_product', 'active', datetime('now')
FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' ORDER BY id DESC LIMIT 1;

INSERT INTO projects (client_id, name, description, project_type, status, started_at)
SELECT id, 'SCDMV Alerts', 'SC DMV appointment alerts service at scdmvappointments.com. Free / Pro $5.99 / CDL $19.99. Last work Feb 12, 2026 — DORMANT. Press emails written but never sent.', 'internal_product', 'active', datetime('now')
FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' ORDER BY id DESC LIMIT 1;

INSERT INTO projects (client_id, name, description, project_type, status, started_at)
SELECT id, 'Masonry Contract Review', 'Built for cousin Mike (Carolina Masonry & Concrete). NC contract review SaaS. Last work Apr 7. Demo cold ~4 weeks. No payment terms ever discussed.', 'internal_product', 'active', datetime('now')
FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' ORDER BY id DESC LIMIT 1;

-- =============================================================================
-- TASKS — Patriot Directory
-- =============================================================================

INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  ('marketing', 'Buy patriotdirectory.com domain (or alt)', 'Step 1 of validation plan. No more code until evidence of demand exists. Time: 30 min.', 'high', (SELECT id FROM projects WHERE name='Patriot Directory' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Install GA4 + connect to domain', 'Without measurement, no further decisions are possible. Trio lesson applied. Time: 30 min.', 'high', (SELECT id FROM projects WHERE name='Patriot Directory' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Submit sitemap to GSC + pull baseline', 'Establish baseline before any marketing push. Time: 30 min.', 'high', (SELECT id FROM projects WHERE name='Patriot Directory' ORDER BY id DESC LIMIT 1)),
  ('marketing', 'Draft outreach email to all 67 existing listings', 'Two asks: (1) verify your listing + send a 100-word story, (2) refer 2 other businesses. Use email-outreach-agent skill. Time: 1 hr.', 'high', (SELECT id FROM projects WHERE name='Patriot Directory' ORDER BY id DESC LIMIT 1)),
  ('marketing', 'Send outreach campaign to 67 listings', 'Track open + reply rates. Target: >40% reply rate, >15 referrals = green light. <20% = drop back to Side/Fun. Time: 1 hr.', 'high', (SELECT id FROM projects WHERE name='Patriot Directory' ORDER BY id DESC LIMIT 1)),
  ('marketing', 'Create @PatriotDir X account', 'Bio + header + pinned tweet linking to map. Time: 30 min.', 'medium', (SELECT id FROM projects WHERE name='Patriot Directory' ORDER BY id DESC LIMIT 1)),
  ('content', 'Draft 14 daily X posts — one listing per day with story + map link', 'Use existing 67 listings as inventory. Format: photo + 100-word story + map URL. Time: 2 hr.', 'medium', (SELECT id FROM projects WHERE name='Patriot Directory' ORDER BY id DESC LIMIT 1)),
  ('marketing', 'Schedule 14 X posts (one per day)', 'Post at 9am ET. Engage with replies. Time: 30 min.', 'medium', (SELECT id FROM projects WHERE name='Patriot Directory' ORDER BY id DESC LIMIT 1)),
  ('decision', 'Decide monetization: affiliate-first OR premium-listing-first', 'Triage recommendation: affiliate first (~30 e-commerce listings can earn at any traffic level). Premium listings need referral-volume proof first.', 'medium', (SELECT id FROM projects WHERE name='Patriot Directory' ORDER BY id DESC LIMIT 1)),
  ('content', 'Write editorial filter doc (celebratory not angry, patriotic not partisan)', 'Per PRD. Establish before listings come in or brand drifts. Time: 30 min.', 'medium', (SELECT id FROM projects WHERE name='Patriot Directory' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Set up Square as Stripe backup processor', 'Stripe has terminated patriot/Christian-values merchants. Have a backup live before turning on premium. Time: 1 hr.', 'low', (SELECT id FROM projects WHERE name='Patriot Directory' ORDER BY id DESC LIMIT 1)),
  ('decision', 'Day 30: review evidence + go/no-go decision', 'GSC impressions? X follower growth? Email reply rate? Decide BEFORE adding more code or content.', 'high', (SELECT id FROM projects WHERE name='Patriot Directory' ORDER BY id DESC LIMIT 1)),
  ('decision', 'Day 90: kill criterion check (<100 verified listings = pause)', 'Pre-committed kill criterion to avoid sunk-cost trap.', 'low', (SELECT id FROM projects WHERE name='Patriot Directory' ORDER BY id DESC LIMIT 1));

-- =============================================================================
-- TASKS — SCDMV Alerts
-- =============================================================================

INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  ('marketing', 'Send 3 press pitches to WIS, WLTX, WYFF Columbia/Greenville', 'THE single highest-leverage hour in the entire portfolio. Templates pre-written in PRESS-KIT.md, contacts verified. Sitting in markdown for 100 days. NC competitor got 2,000+ users from local TV. Time: 1 hr.', 'high', (SELECT id FROM projects WHERE name='SCDMV Alerts' ORDER BY id DESC LIMIT 1)),
  ('analysis', 'Verify actual paying subscriber count in Stripe', '"Live & accepting payments" claim is unsubstantiated. Last documented count: 4 free users (Jan 23). Need ground truth on MRR. Time: 15 min.', 'high', (SELECT id FROM projects WHERE name='SCDMV Alerts' ORDER BY id DESC LIMIT 1)),
  ('analysis', 'Query D1 for current subscriber count by tier (free/pro/cdl)', 'Real numbers required to size the funnel. Time: 15 min.', 'high', (SELECT id FROM projects WHERE name='SCDMV Alerts' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Configure UptimeRobot on /api/health endpoint', '3 scraper outages in 3 weeks before going dormant. DO alarm helps but external eyes still needed. Time: 20 min.', 'high', (SELECT id FROM projects WHERE name='SCDMV Alerts' ORDER BY id DESC LIMIT 1)),
  ('marketing', 'Upload promo-vertical.mp4 to TikTok, Reels, YouTube Shorts', 'Video has been sitting in /promo-video/out/ since Jan 22. Zero distribution. Time: 45 min.', 'high', (SELECT id FROM projects WHERE name='SCDMV Alerts' ORDER BY id DESC LIMIT 1)),
  ('marketing', 'Send 5 follow-up press pitches (WCSC, WMBF, WACH, FITSNews, The State)', 'Cast wider net after first batch. Templates already written. Blocked on first batch sending. Time: 1 hr.', 'medium', (SELECT id FROM projects WHERE name='SCDMV Alerts' ORDER BY id DESC LIMIT 1)),
  ('marketing', 'Email 10 SC driving schools with referral pitch', 'High-intent partnership channel — teens getting licenses are exact ICP. Draft $5/mo affiliate or kickback. Time: 2 hr.', 'medium', (SELECT id FROM projects WHERE name='SCDMV Alerts' ORDER BY id DESC LIMIT 1)),
  ('marketing', 'Post in 3 SC Facebook groups (Charleston/Columbia/Greenville parents)', 'Hyperlocal organic. Warm up account first, post helpfully, link in bio. Recurring 1 hr/wk for 4 wks.', 'medium', (SELECT id FROM projects WHERE name='SCDMV Alerts' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Add Stripe Customer Portal link for self-service cancellation', 'Currently "email support to cancel" — friction blocks signups. Time: 30 min.', 'medium', (SELECT id FROM projects WHERE name='SCDMV Alerts' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Add error alert on consecutiveFailures > 2 in DO scheduler', 'Catch outage #4 before user does. Time: 30 min.', 'medium', (SELECT id FROM projects WHERE name='SCDMV Alerts' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Test Pro checkout end-to-end with real card', 'Welcome email for paid tier untested post-Feb-5 copy changes. Time: 30 min.', 'medium', (SELECT id FROM projects WHERE name='SCDMV Alerts' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Enable Cloudflare Crawler Hints + Bing Webmaster Tools', 'Faster reindex of programmatic SEO pages. Time: 20 min.', 'low', (SELECT id FROM projects WHERE name='SCDMV Alerts' ORDER BY id DESC LIMIT 1)),
  ('decision', 'Decide: switch SMS to Telnyx or kill SMS feature entirely', 'Twilio dead since January. Telnyx ($0.0055/SMS) approves faster — or commit email-only. Time: 4 hr if Telnyx route.', 'low', (SELECT id FROM projects WHERE name='SCDMV Alerts' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Fix admin panel edit functionality', 'Quality of life. Not blocking revenue. Time: 1 hr.', 'low', (SELECT id FROM projects WHERE name='SCDMV Alerts' ORDER BY id DESC LIMIT 1)),
  ('marketing', 'Pitch 3 SC podcasts (Cola Daily, FITSNews podcast, etc.)', 'Press kit doesn''t include podcast contacts. Time: 2 hr including research.', 'low', (SELECT id FROM projects WHERE name='SCDMV Alerts' ORDER BY id DESC LIMIT 1));

-- =============================================================================
-- TASKS — Masonry Contract Review
-- =============================================================================

INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  ('relationship', 'Text Mike: "Are you using it? Yes/no in 1 word."', 'Demo has been cold for 4+ weeks. One sentence ends the ambiguity. Send before 9am tomorrow. Time: 5 min.', 'high', (SELECT id FROM projects WHERE name='Masonry Contract Review' ORDER BY id DESC LIMIT 1)),
  ('relationship', 'Schedule 20-min call with Mike to walk through 1 real recent contract', 'Demos die in async. Either Mike uses it live (you have a customer) or you find out it''s dead and reclaim the time. Time: 30 min schedule + 20 min call.', 'high', (SELECT id FROM projects WHERE name='Masonry Contract Review' ORDER BY id DESC LIMIT 1)),
  ('decision', 'Decide commercial model BEFORE the call ($X/contract or $Y/mo)', 'Cousin discount fine — undefined is not. Suggested: $99/mo unlimited or $49/contract. Time: 30 min.', 'high', (SELECT id FROM projects WHERE name='Masonry Contract Review' ORDER BY id DESC LIMIT 1)),
  ('relationship', 'Write 3-line "here''s what I built / what it costs / want to keep it?" message', 'Forces the financial conversation that hasn''t happened. Even if call doesn''t happen, this does. Time: 15 min.', 'high', (SELECT id FROM projects WHERE name='Masonry Contract Review' ORDER BY id DESC LIMIT 1)),
  ('content', 'Create STATUS.md per the kept-project template', 'Project violates Brian''s own doc standard. Documenting it forces the keep-or-kill question. Time: 30 min.', 'high', (SELECT id FROM projects WHERE name='Masonry Contract Review' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Connect custom domain (contractreview.carolinamasonry.com)', 'Pages.dev URLs feel like a demo, not a product. Real domain signals "this is a thing you pay for." Time: 30 min.', 'medium', (SELECT id FROM projects WHERE name='Masonry Contract Review' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Verify SendGrid sender on carolinamasonry.com', 'Currently sends from jbmangum.com — looks unprofessional when GCs receive kickback emails. Blocks Mike from using externally. Time: 1 hr.', 'medium', (SELECT id FROM projects WHERE name='Masonry Contract Review' ORDER BY id DESC LIMIT 1)),
  ('security', 'Change default owner password from changeme + add login rate limiting', 'Production security gap. Listed in next-steps for 2 sessions running and never done. Time: 45 min.', 'medium', (SELECT id FROM projects WHERE name='Masonry Contract Review' ORDER BY id DESC LIMIT 1)),
  ('decision', 'Decide: fold under Ascend Systems or kill standalone', 'Ascend is the services brand. A one-client tool isn''t a product, it''s a deliverable. Time: 30 min.', 'medium', (SELECT id FROM projects WHERE name='Masonry Contract Review' ORDER BY id DESC LIMIT 1)),
  ('marketing', 'List 3 other NC masonry/concrete subs and email 1', 'Validates whether this generalizes beyond Mike. If nobody else bites, that''s the answer. Time: 1 hr.', 'medium', (SELECT id FROM projects WHERE name='Masonry Contract Review' ORDER BY id DESC LIMIT 1));
