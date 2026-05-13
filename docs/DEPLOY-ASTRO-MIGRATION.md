# Astro Migration Deploy Notes

> 2026-05-13. After merging this worktree into `main`, the repo produces **two separate builds** for two separate Cloudflare Pages projects.

## Architecture

| Domain | Project | Source | Build command | Output dir | Purpose |
|---|---|---|---|---|---|
| `ascendsystems.ai` | `ascend-systems` (existing — RECONFIGURE) | this repo | `npm run build:public` | `dist/` | Astro static marketing site (pre-rendered HTML, SEO-friendly) |
| `admin.ascendsystems.ai` | `ascend-admin` (NEW — create) | this repo | `npm run build:admin` | `dist-admin/` | React SPA for /admin and /portal (interactive app) |

Both pull from the same GitHub repo (`realjbmangum/ascend-systems`). Different build commands, different output dirs, different domains. No file conflicts.

## What changed at the code level

- `package.json` scripts: `build:public` (astro) + `build:admin` (vite → `dist-admin/`)
- `vite.config.ts` outputs to `dist-admin/`
- `astro.config.mjs` outputs to `dist/`
- `worker/src/index.ts` CORS allowlist now includes `https://admin.ascendsystems.ai` and `https://ascend-admin.pages.dev`
- `dist-admin/_redirects` written post-build with `/* /index.html 200` (SPA fallback)

Worker also needs redeploy after merge so the new CORS origins take effect.

## One-time Cloudflare setup

### Step 1 — Reconfigure the existing `ascend-systems` Pages project (5 min)

Cloudflare dashboard → Pages → `ascend-systems` → Settings → Build & deployments:

- **Framework preset:** Astro (or "None")
- **Build command:** `npm run build:public`
- **Build output directory:** `dist`
- **Node version:** 22

Save. The next push to `main` triggers a build. Should produce static HTML for ascendsystems.ai with full pre-rendered content (verify with `curl -s https://ascendsystems.ai/services | grep -c "<h1"` — should return ≥1).

### Step 2 — Create the new `ascend-admin` Pages project (10 min)

Cloudflare dashboard → Pages → Create application → Connect to Git → select `realjbmangum/ascend-systems` repo.

- **Project name:** `ascend-admin`
- **Production branch:** `main`
- **Framework preset:** None (or Vite)
- **Build command:** `npm run build:admin`
- **Build output directory:** `dist-admin`
- **Root directory:** (leave blank — root of repo)
- **Environment variables (Production):** none required at build time (the SPA uses runtime config from `src/config/site.ts`)
- **Node version:** 22 (add `NODE_VERSION = 22` env var or set in dashboard)

Save and trigger first build. CF will give you a `ascend-admin.pages.dev` URL. Verify the SPA loads at `https://ascend-admin.pages.dev/admin/login`.

### Step 3 — Wire the custom domain (5 min)

Cloudflare dashboard → Pages → `ascend-admin` → Custom domains → Set up a custom domain → `admin.ascendsystems.ai`.

CF auto-creates the CNAME record in your DNS for `admin` → `ascend-admin.pages.dev`. SSL cert provisions automatically.

After DNS propagates (~5 min), `https://admin.ascendsystems.ai/admin/login` works.

### Step 4 — Deploy the worker with new CORS (1 min)

```
cd worker
wrangler deploy
```

The new CORS origins (`https://admin.ascendsystems.ai`, `https://ascend-admin.pages.dev`) are now allowed. Without this, the admin SPA's API calls would fail with CORS errors.

### Step 5 — Verify Cloudflare WAF "Block AI bots" is OFF for ascendsystems.ai zone

Known gotcha (saved in memory from PottyDirectory work). If "Block AI bots" is enabled on the zone, GPTBot/ClaudeBot/PerplexityBot get silent 403s on the public site, killing AI citation visibility.

Cloudflare dashboard → ascendsystems.ai zone → Security → Bots → Configure → ensure "Block AI bots" is **OFF**.

The `public/robots.txt` already has explicit allows for these crawlers, but Cloudflare WAF overrides robots.txt at the edge.

### Step 6 — Verify Google Search Console (15 min)

Once `https://ascendsystems.ai` is serving Astro static HTML:

1. Go to https://search.google.com/search-console
2. Add property → `https://ascendsystems.ai`
3. Verify via DNS TXT record (recommended) or HTML meta tag (Astro can inject via `Layout.astro` — ask if needed)
4. Once verified: Submit sitemap at `https://ascendsystems.ai/sitemap-index.xml`

Repeat for Bing Webmaster Tools at https://www.bing.com/webmasters.

## Post-deploy smoke tests

After both Pages deployments land:

```bash
# Public site — must return rendered HTML, not <div id="root">
curl -s https://ascendsystems.ai/ | grep -c "Ascend Systems"           # ≥ 2
curl -s https://ascendsystems.ai/services | grep -c "<h1"               # ≥ 1
curl -s https://ascendsystems.ai/robots.txt                             # 200 OK
curl -s https://ascendsystems.ai/sitemap-index.xml | grep -c "<loc>"    # ≥ 1
curl -s https://ascendsystems.ai/tools/cost-calculator | grep -c "<h1"  # ≥ 1

# Admin SPA — index.html shell is fine, the app hydrates client-side
curl -s https://admin.ascendsystems.ai/                                 # 200 OK, SPA shell
curl -s https://admin.ascendsystems.ai/admin/login                      # 200 OK, SPA shell (route resolved client-side)

# Worker CORS — preflight from admin subdomain must pass
curl -i -X OPTIONS https://ascend-api.bmangum1.workers.dev/api/contact \
  -H "Origin: https://admin.ascendsystems.ai" \
  -H "Access-Control-Request-Method: POST"
# Should return 204 with Access-Control-Allow-Origin: https://admin.ascendsystems.ai
```

## Rollback plan

If anything goes wrong:

- The original `ascend-systems` Pages project can be reverted by changing build command back to `npm run build` and pointing to a pre-Astro git commit.
- The new `ascend-admin` project can simply be deleted — no impact on the old setup.
- The worker rollback: `wrangler rollback` reverts to the previous deployment.

## Bookmarks change

Admin URL changes from `https://ascendsystems.ai/admin/...` to `https://admin.ascendsystems.ai/admin/...`. Update browser bookmarks. The CRM URL referenced in `CLAUDE.md` ("Ascend Systems CRM at ascendsystems.ai/admin/projects") should be updated to `admin.ascendsystems.ai/admin/projects`.
