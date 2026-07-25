/**
 * Per-state search-demand snapshot for PottyDirectory's /demand map.
 *
 * Uses the GSC per-page query (client.byPage) to measure how much search
 * demand each /{state}/ directory page captured, as a renter-demand proxy.
 * Output feeds pottydirectory.com/demand (the "search-demand layer" on top of
 * the population/coverage base). Aggregate + non-sensitive — safe to publish.
 */
import { createGscClient, defaultWindow, type GscPageRow } from "./gsc";
import type { Bindings } from "../types";

export type StateDemand = Record<string, { impressions: number; clicks: number }>;

export type DemandSnapshot = {
  ok: boolean;
  generatedAt: string;
  window: { startDate: string; endDate: string };
  property: string;
  byState: StateDemand;
  error?: string;
};

// Top-level pages that are NOT states — excluded from the per-state rollup.
const NON_STATE_SLUGS = new Set([
  "blog", "services", "about", "contact", "data", "demand", "cost-by-state",
  "calculator", "pricing", "states", "faq", "submit", "get-verified", "pro",
  "restroom-near-me", "terms", "privacy", "msa", "search", "sitemap", "methodology",
]);

/**
 * Extract the state slug from a single-segment directory URL:
 *   https://pottydirectory.com/texas/  → "texas"
 * Returns null for city pages (2+ segments), non-state top-level pages, home.
 */
export function stateSlugFromUrl(u: string): string | null {
  let path: string;
  try {
    path = new URL(u).pathname;
  } catch {
    return null;
  }
  const parts = path.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  if (parts.length !== 1) return null; // only /{state}/ — excludes cities, blog, etc.
  const slug = parts[0].toLowerCase();
  if (NON_STATE_SLUGS.has(slug)) return null;
  return slug;
}

/** Sum impressions/clicks per state slug from GSC page rows. */
export function aggregateByState(rows: GscPageRow[]): StateDemand {
  const out: StateDemand = {};
  for (const r of rows) {
    const slug = stateSlugFromUrl(r.page);
    if (!slug) continue;
    if (!out[slug]) out[slug] = { impressions: 0, clicks: 0 };
    out[slug].impressions += r.impressions;
    out[slug].clicks += r.clicks;
  }
  return out;
}

/** Pull GSC per-page data for a property and roll it up to per-state demand. */
export async function buildStateDemand(
  env: Bindings,
  property = "sc-domain:pottydirectory.com",
  days = 90
): Promise<DemandSnapshot> {
  const generatedAt = new Date().toISOString();
  const window = defaultWindow(days);
  if (!env.GSC_SA_KEY) {
    return { ok: false, generatedAt, window, property, byState: {}, error: "GSC_SA_KEY not set" };
  }
  try {
    const client = await createGscClient(env.GSC_SA_KEY);
    const rows = await client.byPage(property, window.startDate, window.endDate, 5000);
    return { ok: true, generatedAt, window, property, byState: aggregateByState(rows) };
  } catch (e) {
    return { ok: false, generatedAt, window, property, byState: {}, error: (e as Error).message };
  }
}
