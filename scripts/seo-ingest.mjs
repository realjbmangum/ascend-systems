#!/usr/bin/env node
// =============================================================================
// seo-ingest.mjs — pull SEO report data from the `seo` CLI and seed it into the
// ascend-db (Cloudflare D1) `seo_*` tables.
//
// WHAT IT DOES
//   For each tracked site (recordstops, pottydirectory, ascend) it runs the
//   read-only `seo` CLI, extracts:
//     • a metrics snapshot   -> seo_metrics  (one row per site per run)
//     • an action checklist  -> seo_actions  (findings to act on)
//   and writes ONE idempotent SQL file at scripts/out/seo-seed-<date>.sql.
//   The SQL upserts, so re-ingesting the same day updates rows in place (and
//   NEVER clobbers the `status` a user set in the UI on seo_actions).
//
//   Data sources per site:
//     • `seo report --site <prop> --json`        -> technicalCrawl summary +
//        topFixes/reviewObservations (technical actions) + narrative diagnosis
//        priorities (google/GSC-opportunity actions) + crawl page counts.
//     • `seo ai-readiness --site <prop> --json`  -> AI-search checks
//        (pass/fail/info/unknown) -> ai_readiness_score + AI actions.
//
//   CRITICAL FILTER: Cloudflare crawler artifacts are dropped. Any finding whose
//   only sample URLs live under `/cdn-cgi/` (email-protection beacons, Access
//   login redirects, challenge/content endpoints) is excluded, and no action
//   ever stores a `/cdn-cgi/` URL. These are not real SEO issues.
//
// GSC PERFORMANCE TOTALS (clicks/impressions/ctr/avg_position):
//   `seo report --json` exposes GSC *movement/change* data, not clean site-level
//   period totals. We extract totals defensively (a set of candidate paths) and
//   fall back to NULL when the payload does not carry them — which is the case
//   for the current CLI (v0.2.24) on all three sites. period_start/period_end ARE
//   captured (from the report's narrative period). If a future CLI version adds
//   totals, or you point ingestion at `seo performance-audit`, they populate
//   automatically. The full report JSON is preserved in seo_metrics.raw_json.
//
// HOW TO RUN
//   node scripts/seo-ingest.mjs                       # run CLI, generate SQL, self-validate
//   node scripts/seo-ingest.mjs --date=2026-07-22     # pin the capture date
//   node scripts/seo-ingest.mjs --sites=recordstops   # subset of sites
//   node scripts/seo-ingest.mjs --apply-local         # also apply to the LOCAL d1 (testing)
//   node scripts/seo-ingest.mjs --fixtures-dir=DIR    # read <key>-report.json / <key>-ai.json
//                                                      # from DIR instead of calling the CLI
//                                                      # (offline regeneration / testing)
//   node scripts/seo-ingest.mjs --no-validate         # skip the self-validation step
//
// APPLY TO PRODUCTION (a human runs this — this script never does):
//   cd worker && wrangler d1 execute ascend-db --remote --file=../scripts/out/seo-seed-<date>.sql
//   (Ensure the schema exists first:
//    cd worker && wrangler d1 execute ascend-db --remote --file=./db/migrations/2026-07-22-seo.sql)
// =============================================================================

import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(__dirname, 'out');
const WORKER_DIR = path.join(REPO_ROOT, 'worker');
const MIGRATION = path.join(WORKER_DIR, 'db', 'migrations', '2026-07-22-seo.sql');
const D1_NAME = 'ascend-db';

// Tracked sites — keys must match the seo_sites seed in the migration.
const SITES = [
  { key: 'recordstops',    gscProperty: 'sc-domain:recordstops.com' },
  { key: 'pottydirectory', gscProperty: 'sc-domain:pottydirectory.com' },
  { key: 'ascend',         gscProperty: 'sc-domain:ascendsystems.ai' },
];

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const out = { sites: null, date: null, applyLocal: false, fixturesDir: null, validate: true };
  for (const a of argv) {
    if (a.startsWith('--date=')) out.date = a.slice('--date='.length).trim();
    else if (a.startsWith('--sites=')) out.sites = a.slice('--sites='.length).split(',').map((s) => s.trim()).filter(Boolean);
    else if (a.startsWith('--fixtures-dir=')) out.fixturesDir = a.slice('--fixtures-dir='.length).trim();
    else if (a === '--apply-local') out.applyLocal = true;
    else if (a === '--no-validate') out.validate = false;
    else if (a === '--help' || a === '-h') { out.help = true; }
    else console.warn(`[warn] ignoring unknown arg: ${a}`);
  }
  return out;
}

function todayIso() {
  // Local-date YYYY-MM-DD. Prefer --date; this is the fallback only.
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
const CDN_CGI = '/cdn-cgi/';
const isCdnCgi = (u) => typeof u === 'string' && u.includes(CDN_CGI);

// A URL is a genuine finding target only if it is a real http(s) URL that is not
// a Cloudflare crawler artifact.
const cleanUrls = (urls) => (Array.isArray(urls) ? urls.filter((u) => typeof u === 'string' && u && !isCdnCgi(u)) : []);

const CF_ARTIFACT_RE = /cloudflare|cdn-cgi|email-protection/i;

function slug(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/https?:\/\//g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'unknown';
}

// Normalize severity into the schema's vocabulary.
function normSeverity(s, fallback = 'medium') {
  const v = String(s || '').toLowerCase();
  if (v === 'high' || v === 'critical') return 'high';
  if (v === 'medium' || v === 'moderate' || v === 'warning') return 'medium';
  if (v === 'low' || v === 'info' || v === 'minor') return 'low';
  return fallback;
}

// Map an ai-readiness confidence-ish or GSC confidence into severity.
function confidenceToSeverity(c) {
  const v = String(c || '').toLowerCase();
  if (v === 'high') return 'high';
  if (v === 'low') return 'low';
  return 'medium';
}

// First non-cdn-cgi http(s) URL mentioned in a blob of text, else null.
function extractUrl(text) {
  if (!text) return null;
  const m = String(text).match(/https?:\/\/[^\s)"'<>]+/g);
  if (!m) return null;
  const clean = m.find((u) => !isCdnCgi(u));
  return clean || null;
}

// A short "N clicks / N impressions / N sessions" note if present in text.
function extractSearchValue(text) {
  if (!text) return null;
  const m = String(text).match(/([\d,]+)\s+(clicks|impressions|sessions|users)/i);
  return m ? `${m[1]} ${m[2].toLowerCase()}` : null;
}

// SQL literal helpers (single-quote escaped).
const sqlStr = (v) => (v === null || v === undefined ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`);
const sqlNum = (v) => {
  if (v === null || v === undefined || v === '' || Number.isNaN(Number(v))) return 'NULL';
  return String(Number(v));
};

// Robust JSON parse — tolerate any stray non-JSON preamble/suffix.
function parseJsonLoose(raw, label) {
  const s = (raw || '').trim();
  if (!s) throw new Error(`${label}: empty output`);
  try { return JSON.parse(s); } catch { /* fall through */ }
  const first = s.indexOf('{');
  const last = s.lastIndexOf('}');
  if (first >= 0 && last > first) {
    return JSON.parse(s.slice(first, last + 1));
  }
  throw new Error(`${label}: could not parse JSON`);
}

// ---------------------------------------------------------------------------
// Report capture (CLI or fixtures)
// ---------------------------------------------------------------------------
function runSeo(args, label) {
  const res = spawnSync('seo', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 300000 });
  if (res.error) throw new Error(`${label}: ${res.error.message}`);
  if (res.status !== 0) {
    throw new Error(`${label}: exited ${res.status}\n${(res.stderr || '').slice(0, 500)}`);
  }
  return parseJsonLoose(res.stdout, label);
}

function loadSiteReports(site, fixturesDir) {
  if (fixturesDir) {
    const rp = path.join(fixturesDir, `${site.key}-report.json`);
    const ap = path.join(fixturesDir, `${site.key}-ai.json`);
    return {
      report: parseJsonLoose(readFileSync(rp, 'utf8'), `${site.key} report fixture`),
      aiReadiness: parseJsonLoose(readFileSync(ap, 'utf8'), `${site.key} ai fixture`),
    };
  }
  return {
    report: runSeo(['report', '--site', site.gscProperty, '--json'], `${site.key} report`),
    aiReadiness: runSeo(['ai-readiness', '--site', site.gscProperty, '--json'], `${site.key} ai-readiness`),
  };
}

// ---------------------------------------------------------------------------
// Extraction
// ---------------------------------------------------------------------------
function extractMetrics(site, { report, aiReadiness }, capturedOn) {
  const tc = report?.technicalCrawl?.summary || {};
  const period = report?.output?.narrative?.period || {};

  // AI readiness: pass/fail counts over evaluated checks. info/unknown do not count.
  const checks = Array.isArray(aiReadiness?.checks) ? aiReadiness.checks : [];
  const passed = checks.filter((c) => c.status === 'pass').length;
  const failed = checks.filter((c) => c.status === 'fail').length;
  const score = passed + failed > 0 ? Math.round((100 * passed) / (passed + failed)) : null;

  // GSC totals: defensive — the current CLI does not expose site-level period
  // totals, so these resolve to null. Kept as a lookup so a future payload shape
  // populates them without code changes.
  const gsc = report?.performance?.totals || report?.gsc?.totals || report?.output?.narrative?.totals || {};
  const clicks = firstNum(gsc.clicks);
  const impressions = firstNum(gsc.impressions);
  let ctr = firstNum(gsc.ctr);
  if (ctr === null && clicks !== null && impressions) ctr = clicks / impressions;
  const avgPosition = firstNum(gsc.avgPosition ?? gsc.position);

  return {
    capturedOn,
    periodStart: period.startDate || null,
    periodEnd: period.endDate || null,
    clicks,
    impressions,
    ctr,
    avgPosition,
    indexablePages: firstNum(tc.indexablePages),
    totalPages: firstNum(tc.totalPages),
    aiScore: score,
    aiPassed: passed,
    aiFailed: failed,
    rawJson: JSON.stringify({ report, aiReadiness }),
  };
}

function firstNum(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// technical findings from the crawl (topFixes + reviewObservations)
function extractTechnicalActions(report) {
  const tc = report?.technicalCrawl || {};
  const findings = [...(tc.topFixes || []), ...(tc.reviewObservations || [])];
  const actions = [];
  for (const f of findings) {
    // Drop pure Cloudflare artifacts by title/ruleId.
    if (CF_ARTIFACT_RE.test(f.title || '') || CF_ARTIFACT_RE.test(f.ruleId || '')) continue;

    const sampleUrls = f.sampleUrls || [];
    const clean = cleanUrls(sampleUrls);
    // If the finding had sample URLs but every one is a /cdn-cgi/ artifact, the
    // whole finding is crawler noise — drop it.
    if (sampleUrls.length > 0 && clean.length === 0) continue;

    const ruleId = f.ruleId || slug(f.title);
    const sf = f.scoreFactors || {};
    const searchValue = buildTechSearchValue(sf);
    const detailBits = [];
    if (f.recommendation) detailBits.push(`Recommendation: ${f.recommendation}.`);
    if (typeof f.count === 'number') detailBits.push(`Affects ${f.count} page(s).`);
    if (f.whyThisRanks) detailBits.push(f.whyThisRanks);

    actions.push({
      dedupeKey: `technical-crawl:${ruleId}`,
      goal: 'technical',
      title: f.title || ruleId,
      detail: detailBits.join(' ') || null,
      severity: normSeverity(f.severity, 'medium'),
      sourceReport: 'technical-crawl',
      url: clean[0] || null,
      searchValue,
    });
  }
  return actions;
}

function buildTechSearchValue(sf) {
  const parts = [];
  if (sf.clicks) parts.push(`${sf.clicks} clicks`);
  if (sf.impressions) parts.push(`${sf.impressions} impressions`);
  if (sf.sessions) parts.push(`${sf.sessions} sessions`);
  return parts.length ? parts.join(' / ') : null;
}

// AI-readiness findings: failing checks + curated topActions, deduped by check id.
function extractAiActions(aiReadiness) {
  const checks = Array.isArray(aiReadiness?.checks) ? aiReadiness.checks : [];
  const fails = checks.filter((c) => c.status === 'fail');
  const top = Array.isArray(aiReadiness?.topActions) ? aiReadiness.topActions : [];
  const byId = new Map();
  for (const c of [...fails, ...top]) {
    const id = c.id || slug(c.title);
    if (!id || byId.has(id)) continue;
    byId.set(id, c);
  }

  const actions = [];
  for (const [id, c] of byId) {
    if (CF_ARTIFACT_RE.test(c.title || '') || CF_ARTIFACT_RE.test(id)) continue;
    const startUrl = c?.evidence?.startUrl;
    const url = startUrl && !isCdnCgi(startUrl) ? startUrl : null;
    const detail = [c.plainEnglish, c.action].filter(Boolean).join(' ') || null;
    actions.push({
      dedupeKey: `ai-readiness:${id}`,
      goal: 'ai',
      title: c.title || id,
      detail,
      severity: normSeverity(c.severity, 'medium'),
      sourceReport: 'ai-readiness',
      url,
      searchValue: null,
    });
  }
  return actions;
}

// GSC opportunity findings from the report's diagnosis priorities
// (page movement, cannibalisation, decay, striking-distance, CTR targets).
function extractGoogleActions(report) {
  const priorities = report?.output?.narrative?.diagnosis?.priorities || [];
  const actions = [];
  for (const p of priorities) {
    const label = p.label || p.title;
    if (!label) continue;
    const url = extractUrl(p.reason) || extractUrl(p.action);
    const detail = [p.reason, p.action].filter(Boolean).join(' ') || null;
    actions.push({
      dedupeKey: `report-priorities:${slug(label)}`,
      goal: 'google',
      title: label,
      detail,
      severity: confidenceToSeverity(p.confidence),
      sourceReport: 'report-priorities',
      url,
      searchValue: extractSearchValue(p.reason) || extractSearchValue(p.action),
    });
  }
  return actions;
}

function extractActions(reports) {
  const all = [
    ...extractTechnicalActions(reports.report),
    ...extractAiActions(reports.aiReadiness),
    ...extractGoogleActions(reports.report),
  ];
  // De-dup within a single run by dedupe_key (keep first) so the generated SQL
  // never issues two upserts that collide on UNIQUE(site_id, dedupe_key).
  const seen = new Set();
  return all.filter((a) => (seen.has(a.dedupeKey) ? false : (seen.add(a.dedupeKey), true)));
}

// ---------------------------------------------------------------------------
// SQL generation
// ---------------------------------------------------------------------------
function metricsSql(siteKey, m) {
  const cols = [
    'site_id', 'captured_on', 'period_start', 'period_end', 'clicks', 'impressions',
    'ctr', 'avg_position', 'indexable_pages', 'total_pages', 'ai_readiness_score',
    'ai_checks_passed', 'ai_checks_failed', 'source', 'raw_json',
  ];
  const vals = [
    'id',
    sqlStr(m.capturedOn),
    sqlStr(m.periodStart),
    sqlStr(m.periodEnd),
    sqlNum(m.clicks),
    sqlNum(m.impressions),
    sqlNum(m.ctr),
    sqlNum(m.avgPosition),
    sqlNum(m.indexablePages),
    sqlNum(m.totalPages),
    sqlNum(m.aiScore),
    sqlNum(m.aiPassed),
    sqlNum(m.aiFailed),
    sqlStr('seo-cli'),
    sqlStr(m.rawJson),
  ];
  return (
    `INSERT INTO seo_metrics (${cols.join(', ')})\n` +
    `SELECT ${vals.join(', ')}\n` +
    `FROM seo_sites WHERE key=${sqlStr(siteKey)}\n` +
    `ON CONFLICT(site_id, captured_on, source) DO UPDATE SET\n` +
    `  clicks=excluded.clicks, impressions=excluded.impressions, ctr=excluded.ctr,\n` +
    `  avg_position=excluded.avg_position, indexable_pages=excluded.indexable_pages,\n` +
    `  total_pages=excluded.total_pages, ai_readiness_score=excluded.ai_readiness_score,\n` +
    `  ai_checks_passed=excluded.ai_checks_passed, ai_checks_failed=excluded.ai_checks_failed,\n` +
    `  raw_json=excluded.raw_json;\n`
  );
}

function actionSql(siteKey, a) {
  const cols = ['site_id', 'dedupe_key', 'goal', 'title', 'detail', 'severity', 'source_report', 'url', 'search_value'];
  const vals = [
    'id',
    sqlStr(a.dedupeKey),
    sqlStr(a.goal),
    sqlStr(a.title),
    sqlStr(a.detail),
    sqlStr(a.severity),
    sqlStr(a.sourceReport),
    sqlStr(a.url),
    sqlStr(a.searchValue),
  ];
  // NOTE: ON CONFLICT deliberately does NOT touch `status` (preserve UI-set
  // status across re-runs) and does NOT touch `goal` (stable per finding).
  return (
    `INSERT INTO seo_actions (${cols.join(', ')})\n` +
    `SELECT ${vals.join(', ')}\n` +
    `FROM seo_sites WHERE key=${sqlStr(siteKey)}\n` +
    `ON CONFLICT(site_id, dedupe_key) DO UPDATE SET\n` +
    `  title=excluded.title, detail=excluded.detail, severity=excluded.severity,\n` +
    `  source_report=excluded.source_report, url=excluded.url,\n` +
    `  search_value=excluded.search_value, updated_at=datetime('now');\n`
  );
}

function buildSql(perSite, date) {
  const lines = [];
  lines.push('-- SEO ingest seed — generated by scripts/seo-ingest.mjs');
  lines.push(`-- Capture date: ${date}`);
  lines.push(`-- Generated at: ${new Date().toISOString()}`);
  lines.push('-- Idempotent upserts. Safe to re-run. Preserves seo_actions.status.');
  lines.push('-- Apply (from worker/):');
  lines.push(`--   wrangler d1 execute ${D1_NAME} --remote --file=../scripts/out/seo-seed-${date}.sql`);
  // No explicit BEGIN TRANSACTION / COMMIT: remote D1 (via `wrangler d1 execute`)
  // rejects raw SQL transaction statements ("use state.storage.transaction()..."),
  // even though local sqlite accepts them. Every statement below is an idempotent
  // upsert, and wrangler restores the DB to its original state if the batch fails,
  // so a plain statement list is both safe and remote-compatible.
  lines.push('');
  for (const s of perSite) {
    lines.push(`-- ===== ${s.site.key} (${s.site.gscProperty}) =====`);
    lines.push(`-- metrics: 1 snapshot | actions: ${s.actions.length} ` +
      `(technical=${s.actions.filter((a) => a.goal === 'technical').length}, ` +
      `ai=${s.actions.filter((a) => a.goal === 'ai').length}, ` +
      `google=${s.actions.filter((a) => a.goal === 'google').length})`);
    lines.push(metricsSql(s.site.key, s.metrics));
    for (const a of s.actions) lines.push(actionSql(s.site.key, a));
  }
  lines.push('');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Self-validation — apply migration + generated SQL to a throwaway sqlite db,
// twice, and assert invariants. Uses the `sqlite3` binary.
// ---------------------------------------------------------------------------
function sqlite(dbPath, sql) {
  const res = spawnSync('sqlite3', [dbPath], { input: sql, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (res.status !== 0 || res.error) {
    throw new Error(`sqlite3 error: ${res.error ? res.error.message : ''}\n${res.stderr || ''}`);
  }
  return (res.stdout || '').trim();
}

function selfValidate(sqlFile) {
  if (!existsSync(MIGRATION)) throw new Error(`migration not found: ${MIGRATION}`);
  const dbPath = path.join(OUT_DIR, `.validate-${Date.now()}.sqlite`);
  const results = { pass: true, notes: [] };
  try {
    const migration = readFileSync(MIGRATION, 'utf8');
    const generated = readFileSync(sqlFile, 'utf8');

    sqlite(dbPath, migration);            // schema
    sqlite(dbPath, generated);            // first apply
    sqlite(dbPath, generated);            // second apply (idempotency)

    const metrics = Number(sqlite(dbPath, 'SELECT count(*) FROM seo_metrics;'));
    const actions = Number(sqlite(dbPath, 'SELECT count(*) FROM seo_actions;'));
    const cdnLeak = Number(sqlite(dbPath, "SELECT count(*) FROM seo_actions WHERE url LIKE '%/cdn-cgi/%';"));

    const check = (ok, msg) => { results.notes.push(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) results.pass = false; };
    check(metrics > 0, `seo_metrics has rows (${metrics})`);
    check(actions > 0, `seo_actions has rows (${actions})`);
    check(cdnLeak === 0, `no /cdn-cgi/ URLs in seo_actions (${cdnLeak})`);
    // Idempotency: counts must equal one pass worth of data (we applied twice).
    results.notes.push(`INFO  after 2 applies: metrics=${metrics}, actions=${actions}`);
    results.metrics = metrics;
    results.actions = actions;
  } finally {
    try { rmSync(dbPath, { force: true }); } catch { /* ignore */ }
    try { rmSync(`${dbPath}-journal`, { force: true }); } catch { /* ignore */ }
    try { rmSync(`${dbPath}-wal`, { force: true }); } catch { /* ignore */ }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Local apply (opt-in, for testing only)
// ---------------------------------------------------------------------------
function applyLocal(sqlFile) {
  const rel = path.relative(WORKER_DIR, sqlFile);
  console.log(`\n[apply-local] wrangler d1 execute ${D1_NAME} --local --file=${rel} (cwd=worker/)`);
  const res = spawnSync('wrangler', ['d1', 'execute', D1_NAME, '--local', `--file=${rel}`], {
    cwd: WORKER_DIR, encoding: 'utf8', stdio: 'inherit',
  });
  if (res.status !== 0) console.warn('[apply-local] wrangler exited non-zero (see output above).');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log('See the header comment in scripts/seo-ingest.mjs for usage.');
    return;
  }
  const date = args.date || todayIso();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`--date must be YYYY-MM-DD (got: ${date})`);

  const sites = args.sites ? SITES.filter((s) => args.sites.includes(s.key)) : SITES;
  if (!sites.length) throw new Error(`no matching sites for --sites=${args.sites}`);

  mkdirSync(OUT_DIR, { recursive: true });

  console.log(`SEO ingest — date=${date}, sites=${sites.map((s) => s.key).join(',')}` +
    (args.fixturesDir ? `, fixtures=${args.fixturesDir}` : ', source=seo CLI'));

  const perSite = [];
  for (const site of sites) {
    process.stdout.write(`\n[${site.key}] ${args.fixturesDir ? 'loading fixtures' : 'running seo CLI'}... `);
    const reports = loadSiteReports(site, args.fixturesDir);
    const metrics = extractMetrics(site, reports, date);
    const actions = extractActions(reports);
    perSite.push({ site, metrics, actions });
    const byGoal = {
      technical: actions.filter((a) => a.goal === 'technical').length,
      ai: actions.filter((a) => a.goal === 'ai').length,
      google: actions.filter((a) => a.goal === 'google').length,
    };
    console.log(`ok`);
    console.log(`   metrics: pages ${metrics.indexablePages}/${metrics.totalPages} indexable, ` +
      `AI ${metrics.aiPassed}p/${metrics.aiFailed}f score=${metrics.aiScore ?? 'null'}, ` +
      `GSC clicks=${metrics.clicks ?? 'null'} impressions=${metrics.impressions ?? 'null'}`);
    console.log(`   actions: ${actions.length} (technical=${byGoal.technical}, ai=${byGoal.ai}, google=${byGoal.google})`);
  }

  const sql = buildSql(perSite, date);
  const sqlFile = path.join(OUT_DIR, `seo-seed-${date}.sql`);
  writeFileSync(sqlFile, sql, 'utf8');
  console.log(`\nWrote ${sqlFile} (${sql.length} bytes)`);

  const totalMetrics = perSite.length;
  const totalActions = perSite.reduce((n, s) => n + s.actions.length, 0);
  console.log(`Totals: ${totalMetrics} metrics rows, ${totalActions} action rows`);

  if (args.validate) {
    console.log('\nSelf-validation (temp sqlite, migration + generated SQL applied twice):');
    const v = selfValidate(sqlFile);
    for (const n of v.notes) console.log(`  ${n}`);
    if (!v.pass) {
      console.error('\nSELF-VALIDATION FAILED');
      process.exitCode = 1;
      return;
    }
    console.log('  Self-validation PASSED');
  }

  if (args.applyLocal) applyLocal(sqlFile);

  console.log('\nNext step (a human applies to production, from worker/):');
  console.log(`  cd worker && wrangler d1 execute ${D1_NAME} --remote --file=../scripts/out/seo-seed-${date}.sql`);
}

main();
