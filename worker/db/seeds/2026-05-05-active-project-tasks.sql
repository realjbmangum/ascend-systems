-- =============================================================================
-- Seed: Baseline tasks for the 7 remaining active portfolio projects
-- Run after: 2026-05-04-portfolio-tasks.sql (which creates the internal client
--            wrapper "Lighthouse 27 LLC (Internal)") and after the 7 project
--            rows below exist in the projects table.
--
-- Command:   wrangler d1 execute ascend-db --remote --file=worker/db/seeds/2026-05-05-active-project-tasks.sql
--
-- WARNING: this seed is a pure INSERT. Running it twice will create duplicate
--          tasks. Either run once or DELETE FROM tasks WHERE project_id IN (...)
--          before re-running.
--
-- Project name lookups MUST match exactly:
--   LoveNotes, RecordStops, Potty Directory, Ringdocket, Heirloom,
--   Ascend Systems, Indie Pharmacy
--
-- This seed assumes those 7 projects already exist (one row per name) under
-- the Lighthouse 27 LLC (Internal) client. If any are missing, add them first
-- with the same INSERT INTO projects pattern used in the May 4 seed.
-- =============================================================================

-- =============================================================================
-- TASKS — LoveNotes  (V2 pivot to $99/yr Anniversary & Birthday Concierge)
-- Context: V1 earned $0 MRR in 3.5 months. V2 backend ~shipped to prod May 2.
-- Phase 8 manual setup (Anthropic key, Stripe prices, webhook URL) is the only
-- thing standing between code-complete and "actually sellable." Then it has to
-- pass the 3-friend live-fire test before any public push.
-- =============================================================================

INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  ('product_dev', 'Phase 8 setup: Anthropic key + 3 Stripe price IDs + webhook URL', 'V2 ships nothing until these 3 dashboard tasks are done (~10 min total). Without them: no card drafts, no checkout, no subscription state sync. STATUS.md §Phase 8.', 'high', (SELECT id FROM projects WHERE name='LoveNotes' ORDER BY id DESC LIMIT 1)),
  ('decision', 'Decide: ship V2 publicly OR run 3 free friends-of-husbands first', 'PRD plan is friends-first (collect reflections, tighten gift recs). Skipping straight to public risks repeating V1 mistake of $0 MRR with no qualitative signal. Recommend: friends-first.', 'high', (SELECT id FROM projects WHERE name='LoveNotes' ORDER BY id DESC LIMIT 1)),
  ('relationship', 'Recruit 3 married-husband friends for free V2 trial run', 'Each one needs a real upcoming event in next 60 days (anniversary or her birthday). They get the full plan free in exchange for a recorded reflection call. Time: 1 hr texts.', 'high', (SELECT id FROM projects WHERE name='LoveNotes' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Decommission V1 daily message cron', 'V2 cron is live. V1 still firing = users get duplicate spam. Risk-free fix; just needs to happen before any new signup.', 'high', (SELECT id FROM projects WHERE name='LoveNotes' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Verify SendGrid domain auth on sendmylove.app (DKIM/SPF/DMARC)', 'Plan emails ride SendGrid. Unauthenticated sends = Gmail spam folder = $99/yr customer never gets the runway they paid for.', 'medium', (SELECT id FROM projects WHERE name='LoveNotes' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Build reflection capture form (post-event)', 'Reflection data is the V2 moat — every submission sharpens YoY recs. Without it the product is just a fancy reminder. STATUS Phase 1.', 'medium', (SELECT id FROM projects WHERE name='LoveNotes' ORDER BY id DESC LIMIT 1)),
  ('content', 'Rewrite pricing page: $99/yr lead, $12.99/mo, $29 rescue', 'Current site still echoes V1 $5/mo language in places. Pricing page is the conversion surface; cannot ship until it matches V2 PRD.', 'medium', (SELECT id FROM projects WHERE name='LoveNotes' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Add Amazon Associates affiliate links to gift recommender', 'Day 1 monetization layer per PRD. Even at low traffic, gift clicks compound. Catalog already exists; just needs tag wrap.', 'medium', (SELECT id FROM projects WHERE name='LoveNotes' ORDER BY id DESC LIMIT 1)),
  ('content', 'Reshoot promo video — kill V1 voice-buttons creative', 'Old video is on V1 positioning. Cannot post anywhere socially until reshot. Husband-POV format per DESIGN-BRIEF.', 'low', (SELECT id FROM projects WHERE name='LoveNotes' ORDER BY id DESC LIMIT 1)),
  ('decision', 'Month 4 kill check: <10 paying = hard kill, move on', 'Pre-committed kill criterion in CLAUDE.md so we don''t fall in love with V2 the way we did with V1. Schedule the review now.', 'low', (SELECT id FROM projects WHERE name='LoveNotes' ORDER BY id DESC LIMIT 1));

-- =============================================================================
-- TASKS — RecordStops  (296 stores, 0 paying Featured. Right product, no sales.)
-- Context: GHL canceled May 4, so the outreach pipeline migration is fresh.
-- The hard rule from CLAUDE.md: "stop building until something is sold."
-- Patrick Foster podcast lead is the warmest opportunity in the portfolio.
-- =============================================================================

INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  ('marketing', 'Send 5 outreach pitches via /admin/templates this week', 'Per STATUS.md "Do Next" #1. Templates are seeded, /api/admin/outreach/send is wired. Highest-leverage hour for the project. Goal: first paying Featured Listing.', 'high', (SELECT id FROM projects WHERE name='RecordStops' ORDER BY id DESC LIMIT 1)),
  ('relationship', 'Reply to Patrick Foster podcast lead with 3 date options', 'Warmest inbound the portfolio has. Already replied-to once and dropped. Time: 15 min. Cost of no-reply: forever.', 'high', (SELECT id FROM projects WHERE name='RecordStops' ORDER BY id DESC LIMIT 1)),
  ('decision', 'Decide post-GHL outreach stack: native admin + SendGrid OR new CRM', 'GHL canceled May 4. Native admin/templates flow already shipped. Picking native = $0/mo, faster iteration. Picking CRM = monthly cost + setup. Recommend: stay native.', 'high', (SELECT id FROM projects WHERE name='RecordStops' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Verify SendGrid domain auth on recordstops.com (DKIM/SPF/DMARC)', 'Outreach From-line currently unbranded. Stores ignore unbranded cold email. STATUS.md "Do Next" #4.', 'high', (SELECT id FROM projects WHERE name='RecordStops' ORDER BY id DESC LIMIT 1)),
  ('marketing', 'Publish 1 X post + 1 Facebook post from 60-day calendar', 'Calendar has 105 posts ready since Feb 9. Zero published. Start the cadence with the 2 lowest-friction posts. Recurring weekly after.', 'medium', (SELECT id FROM projects WHERE name='RecordStops' ORDER BY id DESC LIMIT 1)),
  ('decision', 'Decide where Amazon affiliate links live (gear page killed)', 'PRD §11 #5. Affiliate is the only revenue lever that earns at current 683 user/mo traffic. Without a home, nothing earns.', 'medium', (SELECT id FROM projects WHERE name='RecordStops' ORDER BY id DESC LIMIT 1)),
  ('marketing', 'Send 5 more outreach pitches week 2 (different city)', 'Outreach is volume + iteration. One round of 5 is a sample, not a campaign. Recurring until first paying Featured.', 'medium', (SELECT id FROM projects WHERE name='RecordStops' ORDER BY id DESC LIMIT 1)),
  ('analysis', 'Pull GA4 monthly: confirm 683 user baseline + top traffic sources', 'Pitch emails reference visitor numbers ("23 visits in March"). Need fresh per-store numbers, not stale aggregates. Time: 30 min.', 'medium', (SELECT id FROM projects WHERE name='RecordStops' ORDER BY id DESC LIMIT 1)),
  ('decision', 'Aug 1 kill check: <5 paying Featured = pivot or sell on Acquire.com', 'Pre-committed kill criterion. Calendar the review now so it actually happens.', 'low', (SELECT id FROM projects WHERE name='RecordStops' ORDER BY id DESC LIMIT 1));

-- =============================================================================
-- TASKS — Potty Directory  (3,704 vendors, AdSense live, ~190 real organic/mo)
-- Context: 96% of GA traffic is bots. Real organic is small. AdSense is live
-- so the question is "how do we earn more from the real 190 humans" not "let's
-- build more features." Phase 2 (multi-service) is premature.
-- =============================================================================

INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  ('analysis', 'Pull AdSense + Amazon affiliate revenue YTD — is it earning anything?', 'Site is "monetized" but no one has actually checked the dollars. If AdSense is <$10/mo at current traffic, that informs every other decision. Time: 20 min.', 'high', (SELECT id FROM projects WHERE name='Potty Directory' ORDER BY id DESC LIMIT 1)),
  ('decision', 'Decide: maintenance-only OR Phase 2 multi-service expansion', 'Phase 2 (dumpsters + fencing) is a months-long build on a 190-real-user/mo site. Honest call: leave it alone, harvest AdSense, ship nothing new until traffic crosses 1k real users.', 'high', (SELECT id FROM projects WHERE name='Potty Directory' ORDER BY id DESC LIMIT 1)),
  ('analysis', 'Check Search Console CTR — did Mar 3 title/meta rewrites move it?', 'Target was 2-3% (was 0.47%). 8 weeks later, the answer is in GSC. If yes, do another pass. If no, stop optimizing titles.', 'medium', (SELECT id FROM projects WHERE name='Potty Directory' ORDER BY id DESC LIMIT 1)),
  ('marketing', 'Confirm crapperking.com backlink (verbal commit on call)', 'One real backlink to a thin-traffic directory moves SEO more than any code change. Time: 1 reply email.', 'medium', (SELECT id FROM projects WHERE name='Potty Directory' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Enable AdSense Auto Ads (one toggle in dashboard)', 'Manual placements are on 45 pages. Auto Ads covers the long tail. 5 min, low-risk RPM uplift.', 'medium', (SELECT id FROM projects WHERE name='Potty Directory' ORDER BY id DESC LIMIT 1)),
  ('decision', 'Decide fate of PottyPro CRM landing page (hidden, noindex since Jan)', 'Either kill it (one less thing to maintain) or schedule the validation call with Brian Solomonson. Sitting in noindex limbo is the worst option.', 'medium', (SELECT id FROM projects WHERE name='Potty Directory' ORDER BY id DESC LIMIT 1)),
  ('content', 'Cross-reference PSAI 286-operator member list against DB', 'Find missing legitimate operators + badge candidates. Real listings improve directory quality more than fake city pages do. Time: 1 hr.', 'low', (SELECT id FROM projects WHERE name='Potty Directory' ORDER BY id DESC LIMIT 1));

-- =============================================================================
-- TASKS — Ringdocket  (iOS Phase 4a/4b shipped Apr 29. Solo install on Brian's
-- iPhone with 28,546 active blocked numbers.)
-- Context: Cannot expand beyond solo until Apple Developer enrollment + real
-- icon + universal links. TestFlight beta is the ONLY meaningful next step.
-- =============================================================================

INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  ('product_dev', 'Apple Developer Program enrollment ($99/yr)', 'Hard prerequisite for TestFlight + App Store. Currently solo on Brian''s phone. No friends-and-family beta possible without this. Single highest-leverage move.', 'high', (SELECT id FROM projects WHERE name='Ringdocket' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Ship real app icon (kill placeholder)', 'Per docs/brand/03-visual-identity.md — wordmark seal in Forensic Ledger Light tokens. Cannot submit to TestFlight with a placeholder.', 'high', (SELECT id FROM projects WHERE name='Ringdocket' ORDER BY id DESC LIMIT 1)),
  ('relationship', 'Identify + ask 3 friends-and-family beta testers', 'Phase 4 was built for corroboration (3-account threshold). Solo install proves nothing about the corroboration flow. Need 3 real testers to validate the entire premise.', 'high', (SELECT id FROM projects WHERE name='Ringdocket' ORDER BY id DESC LIMIT 1)),
  ('decision', 'Decide: pursue TestFlight beta now OR wait for App Store v1', 'TestFlight = faster iteration with 3 testers. App Store = real users but heavier review. Recommend TestFlight first to validate corroboration before public risk.', 'medium', (SELECT id FROM projects WHERE name='Ringdocket' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Ship Universal Links to replace ringdocket:// scheme', 'Custom URL schemes break in Brave/Chrome cross-browser. Universal Links via .well-known/apple-app-site-association removes the brittleness entirely. Required for shareable invite links.', 'medium', (SELECT id FROM projects WHERE name='Ringdocket' ORDER BY id DESC LIMIT 1)),
  ('content', 'Draft App Store listing copy per docs/brand/04-messaging.md', 'Listing copy review is its own block of work; do it BEFORE submitting so review isn''t the bottleneck. Time: 1.5 hr.', 'medium', (SELECT id FROM projects WHERE name='Ringdocket' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Add physical mailing address for CAN-SPAM footer', 'Blocks any email send (digest, magic link, etc.). One-line config change but currently a hard blocker on retention hooks.', 'medium', (SELECT id FROM projects WHERE name='Ringdocket' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Stripe go-live: flip from test to live keys + first real payment test', 'After Phase 4 ships per progress.txt. Required before any paid tier launch. Stripe products ready: Full $3.99/mo, $29.99/yr, Founding Flagger $19.99/yr.', 'low', (SELECT id FROM projects WHERE name='Ringdocket' ORDER BY id DESC LIMIT 1));

-- =============================================================================
-- TASKS — Heirloom  (50/50 with Oliver. MVP at theheirloom.site.
-- Last work Feb 27, 2026.)
-- Context: monorepo copy is STALE — code work happens in github.com/realjbmangum/heirloom.
-- These tasks are about coordination, security debt, and shipping the email
-- template work Oliver is blocked on.
-- =============================================================================

INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  ('relationship', 'Sync with Oliver: status check + agree on 1 next milestone', 'Last documented work Feb 27 — over 2 months ago. Partner projects die in silence. Pick ONE milestone (e.g. Mapbox stories, real SMTP, beta launch) and commit to it.', 'high', (SELECT id FROM projects WHERE name='Heirloom' ORDER BY id DESC LIMIT 1)),
  ('security', 'Fix 4 HIGH security issues from Feb 17 review', 'Story viewer ownership, family-join brute-force, family-member role check, file-type validation. Pre-launch fixes; cannot invite outside testers until done.', 'high', (SELECT id FROM projects WHERE name='Heirloom' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Set up custom SMTP (SendGrid) on Supabase Auth', 'Currently sends from noreply@mail.app.supabase.io = lands in spam, looks unprofessional. Brand-killer for a sentimental product. STATUS.md Quick Wins.', 'high', (SELECT id FROM projects WHERE name='Heirloom' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Paste branded email templates into Supabase Auth Templates', 'Already drafted in emails/email-templates. Just needs to be pasted in dashboard. 10 min task that''s been sitting open.', 'medium', (SELECT id FROM projects WHERE name='Heirloom' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Verify Google OAuth still works post-Feb-27 redeploy', 'Production outage already burned a day. Confirming the OAuth path before users hit it costs 5 min vs hours of triage later.', 'medium', (SELECT id FROM projects WHERE name='Heirloom' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Set up auto-deploy from git (still manual wrangler pages deploy)', 'Manual deploys = friction = fewer ships. Standard CF Pages git connection. ~20 min.', 'medium', (SELECT id FROM projects WHERE name='Heirloom' ORDER BY id DESC LIMIT 1)),
  ('decision', 'Decide: keep building OR pause until Oliver has bandwidth', 'Honest fork. Brian can''t carry a 50/50 partnership solo. If Oliver is busy elsewhere, formally pause vs. limping. Avoids passive resentment.', 'medium', (SELECT id FROM projects WHERE name='Heirloom' ORDER BY id DESC LIMIT 1));

-- =============================================================================
-- TASKS — Ascend Systems  (the consultancy + the CRM Brian is reading right now)
-- Context: massive May 3-4 backend build. Stripe wired. One real client (Chris
-- Rutherford). 30+ competitors per brand-strategy.md. Winnable only on local-
-- managed angle for Charlotte ICP.
-- =============================================================================

INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  ('security', 'Delete /api/auth/test-login endpoint from worker/src/routes/auth.ts', 'Dev-only bypass that''s still in production code. Listed P2 in BACKEND-SESSION-MAY3 but it''s P0 — anyone with the URL can grant themselves admin. Time: 5 min.', 'high', (SELECT id FROM projects WHERE name='Ascend Systems' ORDER BY id DESC LIMIT 1)),
  ('relationship', 'Send Chris Rutherford his first real Stripe invoice or proposal', 'One paying client validates the entire product. Stripe is wired, proposals are wired, invoice flow is wired. If Chris isn''t billed, the platform is theater.', 'high', (SELECT id FROM projects WHERE name='Ascend Systems' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'End-to-end test: invoice send → Stripe push → webhook → status update', 'Built but never tested with real card. Shipping a billing system without a live transaction is the highest-risk thing in the portfolio.', 'high', (SELECT id FROM projects WHERE name='Ascend Systems' ORDER BY id DESC LIMIT 1)),
  ('decision', 'Decide ICP: Charlotte local-services OR portfolio companies only', 'Brand-strategy.md says winnable on local-managed angle for tight Charlotte ICP. CRM build suggests serving own portfolio. These are different products. Pick one.', 'high', (SELECT id FROM projects WHERE name='Ascend Systems' ORDER BY id DESC LIMIT 1)),
  ('marketing', 'Pick the ONE Charlotte ICP and write 5 outbound emails', 'Plumbing? HVAC? Electrical? Pick one vertical so messaging is sharp. 5 emails > 50 generic ones. Use Ascend''s own task system to track.', 'medium', (SELECT id FROM projects WHERE name='Ascend Systems' ORDER BY id DESC LIMIT 1)),
  ('content', 'Seed lead_welcome email sequence (was deferred from May 3)', 'Sequence infra exists; templates don''t. New leads get nothing right now. 3 emails, drip cadence per spec. Time: 1 hr.', 'medium', (SELECT id FROM projects WHERE name='Ascend Systems' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Test client portal magic link end-to-end with Chris', 'Portal exists, login works in test mode. First real client opening their first real magic link is the scariest UX moment — rehearse it.', 'medium', (SELECT id FROM projects WHERE name='Ascend Systems' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Test recurring billing setup + first cycle on a real subscription', 'Recurring code shipped May 4, untested live. Without proof, can''t pitch retainers — which is the entire local-managed business model.', 'medium', (SELECT id FROM projects WHERE name='Ascend Systems' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Add PDF export for proposals + invoices', 'Clients expect a PDF, not a web link. Required for any non-technical buyer. Per next-steps in May 4 progress.txt.', 'low', (SELECT id FROM projects WHERE name='Ascend Systems' ORDER BY id DESC LIMIT 1));

-- =============================================================================
-- TASKS — Indie Pharmacy  (340 listings, IndiePro $297/mo wired but no Stripe.
-- GHL canceled May 4. Standalone repo since Feb 1.)
-- Context: dual product — free directory + IndiePro CRM upsell at $297/mo.
-- The CRM has no checkout. The directory has SEO problems. Pick a lane.
-- =============================================================================

INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  ('decision', 'Decide: kill IndiePro upsell OR wire Stripe checkout for $297/mo tier', 'Pricing page advertises $297 + $497 tiers. There''s no checkout. Either build it or remove the pricing — the current state damages credibility.', 'high', (SELECT id FROM projects WHERE name='Indie Pharmacy' ORDER BY id DESC LIMIT 1)),
  ('decision', 'Decide post-GHL CRM strategy: rebuild on Ascend stack OR kill upsell', 'GHL canceled May 4. IndiePro''s entire $297 value prop was GHL-powered automations. No GHL = no product. Ascend Systems CRM could absorb it. Or kill the tier.', 'high', (SELECT id FROM projects WHERE name='Indie Pharmacy' ORDER BY id DESC LIMIT 1)),
  ('analysis', 'Pull GA4 + Search Console — confirm if 340 listings drive any organic traffic', 'No traffic numbers in CLAUDE.md or progress.txt. Cannot make any monetization decisions blind. If <50 sessions/mo, kill or repurpose.', 'high', (SELECT id FROM projects WHERE name='Indie Pharmacy' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Resubmit sitemap-index.xml in Search Console after Mar 3 fixes', 'Mar 3 commits fixed 6 missing pages but next-step never happened. Without resubmission, Google might never recrawl. Time: 5 min.', 'medium', (SELECT id FROM projects WHERE name='Indie Pharmacy' ORDER BY id DESC LIMIT 1)),
  ('content', 'Write 1 link-magnet article: "Why CVS Caremark steers your prescriptions"', 'PRD identifies vertically-integrated PBM conflict as the wedge. Without a flagship article, there''s no reason to link to the directory. Time: 2 hr.', 'medium', (SELECT id FROM projects WHERE name='Indie Pharmacy' ORDER BY id DESC LIMIT 1)),
  ('marketing', 'Email NCPA (independent pharmacy association) about partnership listing', 'Single highest-leverage outreach for this vertical. They have 19,400 member pharmacies; we have 340 listings. Even a footer mention on their site would 10x traffic.', 'medium', (SELECT id FROM projects WHERE name='Indie Pharmacy' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Add GoodRx affiliate links on pharmacy detail pages', 'Per PRD Phase 3 — only revenue lever that earns at any traffic level. Skip premium until traffic exists; ship affiliate now.', 'low', (SELECT id FROM projects WHERE name='Indie Pharmacy' ORDER BY id DESC LIMIT 1));
