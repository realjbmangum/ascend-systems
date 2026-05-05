-- =============================================================================
-- Seed: 90-day baseline tasks for the Contract Review SaaS project pivot
-- Run:  wrangler d1 execute ascend-db --remote --file=worker/db/seeds/2026-05-05-contract-review-saas-90day-tasks.sql
--
-- 32 tasks across 4 phases (Foundation, Build, Launch, Convert) plus
-- decision forks and pre-committed kill checkpoints. Sourced from PRD +
-- Marketing Plan + Technical Spec written same day.
-- =============================================================================

-- Phase 1 — Foundation (Week 1-2, no code yet)
INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  ('decision', 'Decide brand name + buy domain (Subline / Trade Counsel / other)', 'Design brief recommends Subline → Trade Counsel fallback. Check .com availability first. Don''t commit to a name without an owned domain.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('decision', 'Decide entity structure: new LLC vs Lighthouse 27 DBA', 'PRD flags this. New LLC = clean liability separation. DBA = faster, no extra annual fees.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('security', 'Get E&O insurance quote (Hiscox or Next, $1.2-2.5k/yr)', 'AI legal-adjacent product = E&O risk. Get quote before launch.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('security', 'Pre-launch attorney review of "not legal advice" disclaimer language', 'Have a construction lawyer (Bradley NC, Smith Anderson) review the disclaimer + ToS in 1 hour. ~$300-500 cost.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('relationship', 'Get Mike to sign one-page free-tier user agreement', 'Mike is validator not customer. Even free needs a signed ToS so liability is clear and the testimonial relationship is documented.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1));

-- Phase 2 — Build (Weeks 3-6)
INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  ('product_dev', 'Multi-tenant migration: add org_id to existing Masonry tables', 'Path A from Tech Spec: refactor app-masonry-contract-review in place. Every existing query gets org_id scope.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('product_dev', 'Magic-link auth: scaffold (token table + 15-min expiry + SendGrid)', 'Same pattern as Ascend CRM. 64-char tokens, single-use, no passwords.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('product_dev', 'Trade + state selector at signup (3-step onboarding)', 'Step 1 trade tile picker, step 2 state dropdown, step 3 company info. Drives clause library load.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('product_dev', 'Refactor Claude prompt to parameterize (trade, state)', 'Port from app-masonry-contract-review/src/lib/analyze-contract.ts. Load clauses_library rows into cached system block.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('product_dev', 'Seed clauses_library Trade #1 (masonry-NC) — port existing standard_positions', 'Use the existing Carolina Masonry seed as v1. 8 core clauses: pay-if-paid, retainage, indemnification, lien waiver timing, no-damage-for-delay, flow-down, change-order, termination-for-convenience.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('product_dev', 'Stripe checkout wired ($999/yr annual, no card-required trial)', 'One product, annual interval, 14-day trial without card. Customer Portal for cancellation.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('product_dev', 'Stripe webhook handler (subscription lifecycle + invoice events)', 'Mirror to D1 subscriptions table. Pattern from Ascend CRM.', 'medium', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('product_dev', 'Build 30-sec free risk-score lead magnet (the wedge CTA)', 'Marketing plan says this is the hero of the landing page, not a separate page. Email gate for full report.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('content', 'Build single-page landing (hero / free-review / 6 clauses / kickback / pricing)', 'Per design brief 5-section structure. Steel + hi-vis palette. IBM Plex Sans + Inter.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('product_dev', 'GA4 + Search Console + Stripe analytics tracking on new domain', 'Tracking in place before any outbound traffic.', 'medium', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1));

-- Phase 3 — Launch (Weeks 7-9)
INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  ('product_dev', 'Migrate Mike from single-tenant tool to the new SaaS (org_carolina_masonry)', 'Friction-free cutover. Mike tests as the customer-zero org.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('marketing', 'Build list of top 50 NC subs across 8 trades (state contractor licensing board)', 'Direct outbound foundation. Marketing plan: 5 emails/day = 250 in 50 days.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('marketing', 'Send first 50 cold emails to NC subs (cousin/Mike angle, free-trial CTA)', 'Use email-outreach-agent skill. Track replies. SCDMV playbook shape.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('marketing', 'Pitch ABC Carolinas — $799 member rate offer to Carolyn Floyd (membership)', '1,000+ NC merit-shop subs. Newsletter feature in exchange for member discount.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('marketing', 'Pitch NUCA-NC + state masonry/electrical/plumbing chapters (30% chapter discount)', 'Mike provides peer testimonial as the warm intro.', 'medium', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('marketing', 'Pitch 3 construction-tech podcasts (Construction Brothers / Bridging the Gap / Construction Leading Edge)', 'Lead with Mike''s story. One pitch per week.', 'medium', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('content', 'Substack: "We Reviewed 100 Construction Contracts" — clause-by-clause teardown', 'Founder-content channel. Drives to lead magnet.', 'medium', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('content', 'X/LinkedIn case study: "How a 22-person mason shop caught a $40k indemnity bomb"', '3x/week posting cadence. Bio link to landing page.', 'medium', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('content', 'Weekly Reddit posts in r/Construction, r/Plumbing, r/Electricians', 'Helpful clause breakdown first, link in bio second. Avoid "I built a thing" tone.', 'low', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1));

-- Phase 4 — Convert (Weeks 10-12)
INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  ('product_dev', 'Trial-to-paid email sequence (7 emails over 14 days)', 'Subjects + body in marketing plan. Day 0 welcome → Day 12 last-chance.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('product_dev', 'Win-back sequence for trials that didn''t convert (4 emails over 30 days)', 'Catch lapsed-but-engaged users. Cheap to run.', 'medium', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('content', 'Mike''s contract teardown case study (redacted) for social proof', 'Real before/after on a real Carolina Masonry contract. Visual + email + landing page social proof.', 'medium', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1));

-- Decision forks (open questions from PRD)
INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  ('decision', 'Decide Trade #2 via FB-group reply-count test', 'Post the same clause-of-the-week question in 3 trade FB groups. Whichever has the most replies = Trade #2 priority.', 'medium', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('decision', 'Decide DOCX parsing strategy (keep mammoth workaround or replace)', 'Tech spec flags this. Existing arrayBuffer workaround is shipping in Masonry tool. Monorepo CLAUDE.md says avoid mammoth — but if it''s working, decide whether to migrate.', 'low', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('decision', 'Decide auth fallback: magic-link only OR password as backup', 'Recommend magic-link only for v1. Decide before launch.', 'low', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1));

-- Kill checkpoints (pre-commit so you don't sunk-cost it)
INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  ('decision', 'Day 30 checkpoint: Mike actively using the SaaS version?', 'PRD kill criterion. If Mike doesn''t pull the tool out for every new GC contract, the workflow hypothesis is wrong. Hard re-evaluate.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('decision', 'Day 60 checkpoint: 3 paying customers OR kill', 'PRD kill criterion. <3 paying after 60 days of weekly outreach = wedge isn''t sharp enough.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1)),
  ('decision', 'Day 90 checkpoint: $1.5k MRR target OR kill', 'PRD kill criterion. <$1.5k MRR after 90 days = move on.', 'high', (SELECT id FROM projects WHERE name='Contract Review SaaS' LIMIT 1));
