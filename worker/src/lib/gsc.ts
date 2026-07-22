/**
 * Google Search Console client for Cloudflare Workers.
 *
 * A Worker can't run the `seo` CLI (no Node runtime / keychain), so the weekly
 * SEO cron talks to the GSC Search Analytics API directly, authenticated with a
 * service account. The service-account JSON key is stored as the GSC_SA_KEY
 * Worker secret, and the SA email must be granted read access to each property
 * in Search Console → Users and permissions.
 *
 * All signing uses Web Crypto (crypto.subtle) — available in Workers.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

type ServiceAccountKey = {
  client_email: string;
  private_key: string;
};

export type GscTotals = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

// base64url without padding, from a Uint8Array or string.
function b64url(input: ArrayBuffer | Uint8Array | string): string {
  let bytes: Uint8Array;
  if (typeof input === "string") {
    bytes = new TextEncoder().encode(input);
  } else if (input instanceof Uint8Array) {
    bytes = input;
  } else {
    bytes = new Uint8Array(input);
  }
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// PEM PKCS#8 private key -> ArrayBuffer of the DER body.
function pemToDer(pem: string): ArrayBuffer {
  const body = pem
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "")
    .replace(/\s+/g, "");
  const raw = atob(body);
  const buf = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);
  return buf.buffer;
}

// Exchange a signed JWT assertion for an access token (server-to-server OAuth).
async function getAccessToken(sa: ServiceAccountKey): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: sa.client_email,
    scope: GSC_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claim))}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToDer(sa.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsigned)
  );
  const jwt = `${unsigned}.${b64url(sig)}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    throw new Error(`GSC token exchange failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("GSC token exchange: no access_token");
  return data.access_token;
}

/**
 * Aggregate Search Console totals for a property over [startDate, endDate].
 * No dimensions → one summary row of clicks/impressions/ctr/position.
 * Returns null when the property has no data in the window.
 */
async function queryTotals(
  accessToken: string,
  property: string,
  startDate: string,
  endDate: string
): Promise<GscTotals | null> {
  const url =
    "https://searchconsole.googleapis.com/webmasters/v3/sites/" +
    encodeURIComponent(property) +
    "/searchAnalytics/query";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ startDate, endDate, dimensions: [], dataState: "final" }),
  });
  if (!res.ok) {
    throw new Error(`GSC query failed for ${property}: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as {
    rows?: { clicks: number; impressions: number; ctr: number; position: number }[];
  };
  const row = data.rows?.[0];
  if (!row) return null;
  return {
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0,
  };
}

/** GSC finalises data on a ~3-day lag; end the window there. */
export function defaultWindow(days = 90): { startDate: string; endDate: string } {
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const end = new Date(Date.now() - 3 * 86400000);
  const start = new Date(end.getTime() - days * 86400000);
  return { startDate: iso(start), endDate: iso(end) };
}

/**
 * One authenticated client, reusable across the sites in a single cron run.
 * Throws if GSC_SA_KEY is missing or malformed.
 */
export async function createGscClient(saKeyJson: string) {
  let sa: ServiceAccountKey;
  try {
    sa = JSON.parse(saKeyJson);
  } catch {
    throw new Error("GSC_SA_KEY is not valid JSON");
  }
  if (!sa.client_email || !sa.private_key) {
    throw new Error("GSC_SA_KEY missing client_email or private_key");
  }
  const token = await getAccessToken(sa);
  return {
    serviceAccountEmail: sa.client_email,
    totals: (property: string, startDate: string, endDate: string) =>
      queryTotals(token, property, startDate, endDate),
  };
}
