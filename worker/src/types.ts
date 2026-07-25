export type Bindings = {
  DB: D1Database;
  FILES_BUCKET: R2Bucket;
  /**
   * OAuth 2.1 store for the MCP server at /mcp. Managed entirely by
   * @cloudflare/workers-oauth-provider — we never read or write it directly.
   */
  OAUTH_KV: KVNamespace;
  /** Injected by the OAuth provider so handlers can call its helper API. */
  OAUTH_PROVIDER?: any;
  SENDGRID_API_KEY?: string;
  /** Public marketing site origin — used for footer links, contact-page CTAs, etc. */
  APP_ORIGIN?: string;
  /** Admin SPA origin — used for admin magic-link emails. Defaults to APP_ORIGIN when unset. */
  ADMIN_ORIGIN?: string;
  /** Client portal origin — used for portal magic-link emails. Defaults to APP_ORIGIN when unset. */
  PORTAL_ORIGIN?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  ADMIN_EMAILS?: string;
  CF_API_TOKEN?: string;
  /** Microsoft Graph calendar sync — all four required for sync to activate. */
  MS_GRAPH_TENANT_ID?: string;
  MS_GRAPH_CLIENT_ID?: string;
  MS_GRAPH_CLIENT_SECRET?: string;
  /** Mailbox UPN whose calendar activities sync into (e.g. brian@ascendsystems.ai). */
  MS_GRAPH_CALENDAR_USER?: string;
  /**
   * Google service-account JSON key (the whole downloaded file, as a string).
   * Used by the weekly SEO cron to read Search Console performance totals.
   * Set via: wrangler secret put GSC_SA_KEY. The SA email must be granted
   * read access to each GSC property in Search Console → Users and permissions.
   */
  GSC_SA_KEY?: string;
  /**
   * xAI API key for the Grok Voice agents. Used to open the realtime control
   * socket for an inbound SIP call and to issue refer/hangup call control.
   * Set via: wrangler secret put XAI_API_KEY
   */
  XAI_API_KEY?: string;
  /**
   * Signing secret for xAI's inbound-call webhook. Returned exactly once when
   * the phone number is registered — xAI will not show it again.
   * Set via: wrangler secret put XAI_WEBHOOK_SECRET
   */
  XAI_WEBHOOK_SECRET?: string;
};

export type SessionRow = {
  id: number;
  session_token: string;
  email: string;
  role: "admin" | "client";
  client_id: number | null;
  expires_at: string;
};

export type Variables = {
  session: SessionRow;
};
