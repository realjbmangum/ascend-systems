-- =============================================================================
-- app-fanvue — new project + initial task backlog
-- May 11, 2026
--
-- AI ops layer for Fanvue creators. Phase 1: Brian's own account.
-- Phase 2: SaaS for other creators. Phase 3: Fanvue App Store.
-- Apply: wrangler d1 execute ascend-db --remote --file=worker/db/seeds/2026-05-11-app-fanvue-tasks.sql
-- =============================================================================

-- ----- Project -----
INSERT INTO projects (client_id, name, description, project_type, status, started_at)
SELECT id, 'Fanvue Creator OS', 'AI ops layer on the Fanvue API (DM auto-draft, mass-message scheduler, vault recycler, competitor intel). Built as multi-tenant SaaS from day one. Brian = tenant #1. Stack: Next.js + Cloudflare Pages + Workers + D1 + Anthropic. Docs at /Users/jbm/new-project/app-fanvue/. API access not yet granted by Fanvue.', 'internal_product', 'scoping', datetime('now')
FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' ORDER BY id DESC LIMIT 1;

-- =============================================================================
-- TASKS — Fanvue Creator OS
-- =============================================================================

-- ----- BLOCKERS (must complete before any code) -----
INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  (
    'manual',
    'Register OAuth app at fanvue.com/developers',
    'Why: nothing real ships without OAuth credentials. Self-serve — no Discord queue. Steps: (1) confirm Fanvue creator account is KYC-verified; (2) go to https://fanvue.com/developers; (3) create new app; (4) set redirect URI to http://localhost:8787/oauth/callback for dev (and prod Worker URL later); (5) select scopes (openid, offline_access, offline are auto; pick read:self + others matching app needs); (6) copy client_id + client_secret; (7) drop into app-fanvue/.dev.vars and `npx wrangler secret put` for production. See app-fanvue/ACCESS.md for the full step list. 7-day kill criterion in PRD: if KYC stuck or app rejected within a week, something is wrong.',
    'urgent',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  ),
  (
    'manual',
    'Read Fanvue developer agreement for AI auto-reply ToS language',
    'Why: Stage 1c (autopilot) is illegal to ship if the dev agreement prohibits automated replies. Stage 1a (approval queue) sidesteps the issue. Read before flipping any auto-send switch. If ToS forbids it, the SaaS thesis evaporates — kill criterion in PRD.',
    'high',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  ),
  (
    'decision',
    'Pick final product name (working: Lighthouse Creator OS)',
    'Why: marketing site, domain, Stripe product all hinge on it. Constraint: cannot use "Fanvue" in user-facing name without written trademark permission. Candidates: Lighthouse, Beacon, Tides. Check .com availability before committing.',
    'medium',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  );

-- ----- SPRINT 0 — Foundations -----
INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  (
    'product_dev',
    'Scaffold fanvue-worker (Cloudflare Worker + Hono)',
    'Why: this is the backend everything else hangs on. wrangler init fanvue-worker, Hono router with /webhook + /api/* + scheduled(), JWT auth between Pages and Worker. Mirror the app-lovenotes shape.',
    'high',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  ),
  (
    'product_dev',
    'Create fanvue-db D1 + apply schema',
    'Why: every domain table has tenant_id from day one — no retrofit later. Schema is in app-fanvue/tasks/TECHNICAL-SPEC.md. Apply via wrangler d1 execute. Seed Brian as tenant #1 with status=internal.',
    'high',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  ),
  (
    'product_dev',
    'Init Next.js 15 app on Cloudflare Pages',
    'Why: dashboard host. Match app-lovenotes shape: App Router, Tailwind, shadcn/ui, auth-gated layout, mobile-first. Deploy to app-fanvue.pages.dev. Do NOT use Astro for this product — it is app-shaped, not content-shaped (decision locked in PRD).',
    'high',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  ),
  (
    'product_dev',
    'Build mock Fanvue API client returning documented response shapes',
    'Why: API access not granted yet but we cannot wait to build. Stub /chats, /messages, /vault, /insights, /agency/* endpoints with structures matching the documented Fanvue examples. Every shape gets a comment with the docs URL it came from so we can verify on access grant.',
    'high',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  );

-- ----- SPRINT 1 — Module 1 (DM Agent) against mocks -----
INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  (
    'product_dev',
    'Persona editor UI (markdown + voice samples + no-go list)',
    'Why: this prompt IS the product. Per-tenant editor for system prompt + voice samples (fan message → ideal reply pairs) + no-go topics. Cache-key derived from content so Anthropic prompt caching invalidates on edits.',
    'medium',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  ),
  (
    'product_dev',
    'Mobile-first approval queue UI',
    'Why: Stage 1a is "you approve every send from your phone". Swipe to approve, swipe to edit, swipe to reject. Fan profile + conversation history collapsible. Tap to expand suggested vault-attach action.',
    'medium',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  ),
  (
    'product_dev',
    'Draft generator: Anthropic call with persona + context + vault catalog',
    'Why: the engine. Sonnet 4.6 default, Opus 4.7 for top-10% spender fans. Prompt caching on the persona block. Output: draft body + optional proposed_action (attach vault item X at $Y) + confidence score. Persist to drafts table + R2 prompt_context for audit.',
    'high',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  ),
  (
    'product_dev',
    'Audit log writer (every AI call + every send + every persona change)',
    'Why: ToS defense + tuning signal. Every draft generated, every approval/rejection, every actual send recorded with tenant_id + actor + ref + metadata.',
    'medium',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  );

-- ----- SPRINT 2 — Live API integration (BLOCKED on access grant) -----
INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  (
    'product_dev',
    'OAuth2 flow end-to-end: authorize → callback → encrypted token storage',
    'Why: tenant onboarding flow. Per-tenant DEK wrapped by master KEK in Workers Secrets. Tokens never stored in plaintext. Token refresh cron every 10 min.',
    'high',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  ),
  (
    'product_dev',
    'Webhook receiver with HMAC verification + idempotency',
    'Why: events from Fanvue trigger draft generation and lifecycle actions. Store event id as PK in webhook_events; re-deliveries are no-ops. Ack < 200ms, enqueue work for async processing.',
    'high',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  ),
  (
    'product_dev',
    'Replace mock Fanvue client with real API calls',
    'Why: switch to production. Each endpoint verified against real response shape; any mock that drifted gets corrected. Live test with Brian''s account = tenant #1.',
    'high',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  );

-- ----- SPRINT 3 — Module 2 (Mass-Message Scheduler) -----
INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  (
    'product_dev',
    'Segment builder: smart-list + custom-list + ad-hoc filter',
    'Why: blunt mass sends underperform. Smart lists pulled from Fanvue (system-computed). Custom lists built in our UI with a filter DSL: spend, recency, churn risk, list membership. Mirror approved lists back to Fanvue when possible.',
    'medium',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  ),
  (
    'product_dev',
    'Mass-message composer + scheduler with timezone-aware send windows',
    'Why: 3am sends kill open rate. Compose once, schedule for tenant TZ. A/B subject lines. Cron dispatcher fires at minute granularity.',
    'medium',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  );

-- ----- SPRINT 4 — Module 3 (Vault Recycler) -----
INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  (
    'product_dev',
    'Vault sync + auto-tag via vision model',
    'Why: old vault content is dead inventory until tagged. Cron pulls /vault/folders + items every 6h. Claude vision tags subject/mood/type. Manual override per item.',
    'medium',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  ),
  (
    'product_dev',
    'Churn win-back automation on subscription.cancelled webhook',
    'Why: 48h after churn is the highest-converting win-back window. Webhook fires → schedule auto-message with matched vault content + discount offer. Track conversion rate; kill the rule if <2%.',
    'medium',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  );

-- ----- SPRINT 5 — Module 4 (Competitor Intel) -----
INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  (
    'analysis',
    'Pick 5–10 top creators in target niche to subscribe to as fan',
    'Why: Module 4 reads YOUR fan-side data with read:fan scope. The list of who you subscribe to IS the intel set. Pick creators who are 6–18 months ahead in their funnel maturity. Brian''s call on niche + names.',
    'medium',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  ),
  (
    'product_dev',
    'Competitor intel pipeline: pull → structure → rank',
    'Why: the moat vs other AI-DM tools. Cron every 2h reads new content sent to YOU by competitor subs. Claude extracts patterns (cadence, hooks, PPV prices, welcome sequence). Dashboard ranks tactics by observable signals (post likes, send frequency = doubled-down = working).',
    'medium',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  );

-- ----- SPRINT 6 — Productize (Phase 2 — gate behind 90-day decision) -----
INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  (
    'product_dev',
    'Public tenant signup flow with Stripe billing',
    'Why: switch from internal-only to SaaS. Three tiers: Starter $79, Pro $199, Agency $499 + per-creator. Annual gets 2 months free. Brian stays free (tenant #1). Gate this work behind the Month-4 productize-or-kill decision.',
    'low',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  ),
  (
    'marketing',
    'Marketing site + launch playbook',
    'Why: Phase 2 launch. Channels: Twitter/X creator-economy threads, Fanvue Discord, agency cold outreach. Submit to Fanvue App Store when it opens. Don''t use "Fanvue" in the brand name.',
    'low',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  );

-- ----- KILL CHECKPOINTS -----
INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  (
    'decision',
    'KILL CHECKPOINT — Day 7: OAuth credentials in hand?',
    'Why: PRD kill criterion. Self-serve developer area means credentials should be in hand within hours, not weeks. If still blocked after 7 days (KYC stuck, app rejected, scope mismatch), something is fundamentally wrong — pause the project until resolved.',
    'medium',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  ),
  (
    'decision',
    'KILL CHECKPOINT — Day 60: Phase 1 lifted Fanvue revenue $500+/mo?',
    'Why: PRD kill criterion. 60 days after live launch on Brian''s account, if the tool has not added $500+/mo to Fanvue revenue, kill. No proof the wedge works.',
    'medium',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  ),
  (
    'decision',
    'KILL CHECKPOINT — Day 90: productize or stay personal?',
    'Why: PRD kill criterion. After 90 days of personal use, decide: build the SaaS or keep the tool internal. ROI on additional Phase-2 work has to clear the bar set by the next-best portfolio project.',
    'medium',
    (SELECT id FROM projects WHERE name = 'Fanvue Creator OS' ORDER BY id DESC LIMIT 1)
  );
