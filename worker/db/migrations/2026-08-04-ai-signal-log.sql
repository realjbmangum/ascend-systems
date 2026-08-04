-- Logs two kinds of AI-citation signal for ascendsystems.ai, since the
-- existing seo_metrics.ai_readiness_score is a crawlability/hygiene proxy
-- (schema validity, robots-ai-bots, indexability) and carries zero evidence
-- of whether an AI system actually crawled or referred someone to the site.
-- Apply: (from worker/) wrangler d1 execute ascend-db --remote --file=./db/migrations/2026-08-04-ai-signal-log.sql
--
--   kind = 'crawl'    — an AI crawler bot (GPTBot, ClaudeBot, PerplexityBot,
--                       Google-Extended, CCBot, etc.) requested a page.
--                       Leading indicator: are AI systems ingesting the site.
--   kind = 'referral' — a human arrived with a Referer header from an AI
--                       answer engine (chatgpt.com, perplexity.ai, claude.ai,
--                       gemini.google.com, copilot.microsoft.com).
--                       Lagging indicator: the site actually got cited and
--                       someone clicked through.
--
-- Written by functions/_middleware.ts at the edge. No PII — path, UA, and
-- referer origin only, never query strings or full referer URLs.

CREATE TABLE IF NOT EXISTS ai_signal_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL DEFAULT (datetime('now')),
  kind TEXT NOT NULL,             -- 'crawl' | 'referral'
  source TEXT NOT NULL,           -- bot name (e.g. 'GPTBot') or referrer origin (e.g. 'perplexity.ai')
  path TEXT NOT NULL,
  user_agent TEXT
);
CREATE INDEX IF NOT EXISTS idx_ai_signal_log_ts ON ai_signal_log(ts DESC);
CREATE INDEX IF NOT EXISTS idx_ai_signal_log_kind_source ON ai_signal_log(kind, source);
