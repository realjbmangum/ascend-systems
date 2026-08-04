// Logs AI-crawl and AI-referral signal for ascendsystems.ai.
//
// This does NOT use a D1 binding on this Pages project — that path was
// tried (three different binding configs, 14+ hours, confirmed via local
// testing that the code was correct and the dashboard config was correct)
// and never reached the Function at runtime. Cloudflare-side issue,
// unresolved. Instead this posts to the ascend-api Worker's own
// /api/ai-signal endpoint, which has a proven-working D1 binding already.
// Server-to-server edge call, so no CORS concerns.

const AI_SIGNAL_ENDPOINT = 'https://ascend-api.bmangum1.workers.dev/api/ai-signal';

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
  const { request, next } = context;
  const response = await next();

  try {
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
      fetch(AI_SIGNAL_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          kind,
          source,
          path: url.pathname.slice(0, 512),
          user_agent: ua.slice(0, 300),
        }),
      }).catch(() => {
        // Never let logging break the response.
      })
    );
  } catch {
    // Never let logging break the response.
  }

  return response;
}
