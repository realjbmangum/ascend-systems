// Logs AI-crawl and AI-referral signal for ascendsystems.ai into D1
// (table: ai_signal_log, see worker/db/migrations/2026-08-04-ai-signal-log.sql).
//
// Requires a D1 binding named "DB" -> ascend-db on this Cloudflare Pages
// project (Pages dashboard: Settings -> Functions -> D1 database bindings).
// That binding is NOT set up by this file — it has to be added by hand in
// the dashboard. Until it is, this middleware no-ops safely: it never
// throws, never blocks the response, and never adds meaningful latency
// (the D1 write is fire-and-forget via waitUntil).

const AI_CRAWLER_UAS = [
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'CCBot',
];

const AI_REFERRAL_HOSTS = [
  'chatgpt.com',
  'chat.openai.com',
  'perplexity.ai',
  'claude.ai',
  'gemini.google.com',
  'copilot.microsoft.com',
  'you.com',
];

// Skip static assets — only page-ish requests are useful signal.
const SKIP_EXT = /\.(css|js|mjs|png|jpe?g|svg|ico|webp|gif|woff2?|ttf|map|json)$/i;

function matchCrawlerUA(ua) {
  if (!ua) return null;
  const found = AI_CRAWLER_UAS.find((bot) => ua.includes(bot));
  return found || null;
}

function matchReferralHost(referer) {
  if (!referer) return null;
  try {
    const host = new URL(referer).hostname.replace(/^www\./, '');
    return AI_REFERRAL_HOSTS.find((h) => host === h || host.endsWith(`.${h}`)) || null;
  } catch {
    return null;
  }
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const response = await next();

  try {
    const db = env.DB;
    if (!db) return response; // binding not configured yet — no-op

    const url = new URL(request.url);
    if (SKIP_EXT.test(url.pathname)) return response;

    const ua = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';

    const botName = matchCrawlerUA(ua);
    const referralHost = matchReferralHost(referer);

    if (!botName && !referralHost) return response;

    const kind = botName ? 'crawl' : 'referral';
    const source = botName || referralHost;

    context.waitUntil(
      db
        .prepare(
          'INSERT INTO ai_signal_log (kind, source, path, user_agent) VALUES (?1, ?2, ?3, ?4)'
        )
        .bind(kind, source, url.pathname.slice(0, 512), ua.slice(0, 300))
        .run()
        .catch(() => {
          // Never let logging break the response.
        })
    );
  } catch {
    // Never let logging break the response.
  }

  return response;
}
