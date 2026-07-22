# SEO metrics cron — Cloudflare-native setup

Weekly GSC performance ingestion that runs entirely on Cloudflare — no local
machine, no `seo` CLI. The Worker calls the Google Search Console API on a cron
and writes `seo_metrics`. This is the trend/forecast engine.

## Architecture

```
Cron (Mon 04:xx UTC)  ──►  Worker scheduled()  ──►  GSC Search Analytics API
                                    │                 (service-account auth)
                                    └──►  D1 seo_metrics  (source = 'gsc-cron')
```

- **What it captures:** clicks, impressions, ctr, avg_position — the GSC
  performance totals, per site, appended weekly so history compounds.
- **What it does NOT capture:** crawl-derived fields (page counts,
  ai_readiness_score) and the action list. A Worker has no headless browser, so
  those still come from the local `seo` CLI on-demand (`scripts/seo-ingest.mjs`),
  written under `source = 'seo-cli'`. The two streams never collide.

## One-time setup (only Brian can do these — Google account access)

1. **Google Cloud** → create/pick a project → **APIs & Services** → enable the
   **Google Search Console API**.
2. **IAM & Admin → Service Accounts** → create a service account (any name,
   e.g. `seo-cron`). No project roles needed.
3. On that service account → **Keys** → **Add key → JSON** → download the file.
4. **Search Console** (search.google.com/search-console) → for EACH of the three
   properties (recordstops.com, pottydirectory.com, ascendsystems.ai) →
   **Settings → Users and permissions → Add user** → paste the service
   account's email (`…@….iam.gserviceaccount.com`) → permission **Restricted**
   (read is enough).
5. Set the key as a Worker secret (paste the whole JSON file's contents; do NOT
   commit it and do NOT paste it into chat):
   ```
   cd worker
   wrangler secret put GSC_SA_KEY
   # paste the full JSON, press Enter, Ctrl-D
   ```

## Verify it works (after the secret is set)

Trigger the same work the cron does, on demand, from the admin session:
```
POST /api/seo/ingest-now      # admin-cookie-authed; returns a per-site summary
```
or wait for the Monday 04:xx UTC slot. Each run appends/updates one
`seo_metrics` row per site with `source='gsc-cron'`; the `/admin/seo` trend
chart fills in as weeks accrue.

## Notes

- The cron branch and the `/ingest-now` endpoint both no-op with a clear message
  if `GSC_SA_KEY` is unset — deploying before setup is safe.
- Window: last 90 days ending 3 days ago (GSC finalises on a ~3-day lag).
- One site failing (e.g. SA not yet granted on that property) does not abort the
  others — its row just carries a note.
