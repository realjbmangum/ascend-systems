-- =============================================================================
-- Import: project resources from site-pottydirectory → "Potty Directory"
-- Generated: 2026-05-05T16:23:34.826Z
-- Run:  wrangler d1 execute ascend-db --remote --file=worker/db/seeds/2026-05-05-import-site-pottydirectory.sql
--
-- 3 resources found.
-- =============================================================================

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'Blog Content Expansion', '# PRD: Blog Content Expansion for SEO Rankings

**Created:** January 15, 2026
**Status:** Ready for Implementation
**Audience:** Both event planners AND construction/contractors

---

## Overview

Expand the top 3 highest-potential blog posts from ~1,000 words to 2,500+ words each, matching or exceeding competitor content depth. Each post will leverage Potty Directory''s unique advantages: directory integration, calculator tool, and comprehensive local provider network.

## Goals

1. Improve search rankings for high-volume porta potty queries
2. Drive traffic to the directory (state/city pages) and calculator tool
3. Capture featured snippets with quick answer boxes and FAQ schema
4. Establish authority over generic competitor content

## Non-Goals

- Creating new blog posts (focus on expanding existing)
- Refreshing all 30 posts (only top 3)
- Building new tools or features

---

## Target Posts (Priority Order)

### 1. How Many Porta Potties Do I Need?
**Current slug:** `/blog/how-many-porta-potties-do-i-need/`
**Search volume:** HIGH (core question everyone asks)
**Current state:** ~1,000 words, basic guide

**Expansion plan:**
- [ ] Add quick answer box at top (featured snippet target)
- [ ] Detailed table: event type × duration × guest count = units needed
- [ ] Construction section with OSHA ratios (1 per 10 workers)
- [ ] Wedding-specific guidance with luxury trailer recommendations
- [ ] Festival/large event calculations (1 per 50 attendees)
- [ ] ADA compliance reminder (1 accessible per 20 units)
- [ ] Prominent CTA to `/calculator/` tool
- [ ] State-specific links: "Find providers in [Texas](/texas/)" etc.
- [ ] Embedded FAQ section (6-8 questions) with FAQPage schema
- [ ] Table of contents for easy navigation

**Competitor benchmark:** portapottycalculator.com, allsiterentals.com
**Target word count:** 2,500-3,000 words

---

### 2. Construction Site Restroom Requirements: OSHA Rules
**Current slug:** `/blog/construction-site-restroom-requirements/`
**Search volume:** MEDIUM-HIGH (B2B, high intent)
**Current state:** ~1,000 words, regulations overview

**Expansion plan:**
- [ ] Quick answer box: "OSHA requires 1 toilet per 20 workers (or 1 per 10 for 40-hour weeks)"
- [ ] Detailed OSHA regulation breakdown (29 CFR 1926.51)
- [ ] Table: worker count × shift length = required units
- [ ] Penalties for non-compliance (fines up to $15,625 per violation)
- [ ] High-rise/multi-floor considerations
- [ ] Hand washing station requirements
- [ ] Servicing frequency for job sites
- [ ] Monthly rental cost expectations (link to pricing post)
- [ ] State-specific notes (California OSHA differences, etc.)
- [ ] CTA: "Find construction porta potty providers near you" → directory
- [ ] Embedded FAQ (6 questions) with schema

**Competitor benchmark:** United Rentals, OSHA.gov references
**Target word count:** 2,500 words

---

### 3. Wedding Restroom Trailer vs Porta Potty
**Current slug:** `/blog/wedding-restroom-trailer-vs-porta-potty/`
**Search volume:** MEDIUM (high commercial intent, emotional buyers)
**Current state:** ~1,000 words, basic comparison

**Expansion plan:**
- [ ] Quick answer box: "Budget $800-2,500 for luxury trailer (150 guests) vs $300-600 for standard units"
- [ ] Side-by-side comparison table (features, cost, guest experience)
- [ ] "When standard porta potties are fine" section
- [ ] "When you need a luxury trailer" section
- [ ] Photo placement/decoration tips
- [ ] Vendor questions checklist for wedding planners
- [ ] How many units for wedding size (50/100/150/200+ guests)
- [ ] Real cost breakdown by wedding size
- [ ] Farm wedding / outdoor venue specific tips
- [ ] Links to providers that offer luxury trailers → directory pages
- [ ] Embedded FAQ (6 questions) with schema

**Competitor benchmark:** TheKnot.com, wasted.earth
**Target word count:** 2,500 words

---

## Content Template (For Each Post)

```
1. Quick Answer Box (featured snippet target)
2. Introduction (why this matters)
3. Table of Contents
4. Main content sections with:
   - Data tables where applicable
   - Real pricing ranges
   - Calculator/directory CTAs
5. State-specific callouts with directory links
6. Embedded FAQ section (6-8 Qs)
7. Bottom line summary
8. Strong CTA (Find providers / Use calculator)
9. Related articles
```

## Technical Requirements

- [ ] FAQPage structured data on each post
- [ ] Article structured data (already exists)
- [ ] Internal links to:
  - `/calculator/` (prominent placement)
  - `/states/` and specific state pages
  - `/faq/` for additional questions
  - Other related blog posts
- [ ] All internal links must have trailing slashes

## Success Metrics

- **Primary:** Improved Google rankings (track in Search Console)
  - "how many porta potties" → Target top 10
  - "porta potty OSHA requirements" → Target top 10
  - "wedding porta potty vs trailer" → Target top 10
- **Secondary:** Increased clicks from Search Console
- **Tertiary:** Traffic to calculator and directory pages

---

## Implementation Order

| Post | Priority | Est. Effort | Dependencies |
|------|----------|-------------|--------------|
| How Many Do I Need | 1 | 2 hours | None |
| OSHA Construction | 2 | 2 hours | None |
| Wedding Comparison | 3 | 2 hours | None |

## Acceptance Criteria

For each expanded post:
- [ ] 2,500+ words of comprehensive content
- [ ] Quick answer box at top
- [ ] At least 2 data tables
- [ ] Table of contents
- [ ] 6+ FAQ items with FAQPage schema
- [ ] 3+ internal links to directory/calculator
- [ ] State-specific callouts (at least 3 states mentioned with links)
- [ ] Mobile-responsive tables
- [ ] Updated `updatedAt` in blog-posts.json

---

## Session Workflow

Each post expansion session:
1. Read current post content
2. Research competitor top-ranking content
3. Draft expanded content following template
4. Add structured data (FAQPage)
5. Test locally (`npm run dev`)
6. Commit and push
7. Mark complete in this PRD

---

## Progress Tracking

| Post | Status | Completed | Notes |
|------|--------|-----------|-------|
| porta-potty-rental-cost | DONE | Jan 15, 2026 | Expanded to 2,500 words |
| how-many-porta-potties-do-i-need | DONE | Jan 15, 2026 | Expanded to 2,800 words |
| construction-site-restroom-requirements | DONE | Jan 15, 2026 | Expanded to 3,000 words |
| wedding-restroom-trailer-vs-porta-potty | DONE | Jan 15, 2026 | Expanded to 2,800 words |
', 40, 'site-pottydirectory/tasks/prd-blog-content-expansion.md'
FROM projects WHERE name = 'Potty Directory' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'README', '# Potty Directory

The largest directory of portable restroom rental companies across the United States.

## Tech Stack

- **Framework**: Astro
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Hosting**: Cloudflare Pages

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` and add your Supabase credentials:

```
PUBLIC_SUPABASE_URL=your-supabase-url
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Setup

Run the SQL in `supabase_setup.sql` to create the vendors table.

## Deployment

Connected to Cloudflare Pages for automatic deployments on push to main.

## License

All rights reserved.
', 90, 'site-pottydirectory/README.md'
FROM projects WHERE name = 'Potty Directory' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'README', '# Potty Directory - WWETT 2026 Promo Video

Professional promo video for Potty Directory targeting WWETT 2026 trade show attendees.

## Video Overview

**Duration:** 20 seconds
**Formats:** Horizontal (1920x1080), Vertical (1080x1920), Square (1080x1080)

### Scenes:

1. **Welcome (0-2s)** - WWETT welcome with Potty Directory branding
2. **Stats (2-6s)** - Animated key statistics (4,500+ listings, 50 states, 25K searches, 500 leads/month)
3. **Benefits (6-10s)** - 6 reasons to list (free listing, featured placement, verified badge, SEO, leads, mobile-first)
4. **Comparison (10-14s)** - Basic vs Featured listing side-by-side
5. **CTA (14-18s)** - QR code, "Scan to see your listing", PottyDirectory.com
6. **WWETT Special (18-20s)** - 20% off first year promotion

## Quick Start

### Preview in Browser
```bash
npm start
```

This opens http://localhost:3000 where you can see all 3 compositions and scrub through the timeline.

### Render Videos

**Horizontal (YouTube, presentations):**
```bash
npm run build-horizontal
```

**Vertical (TikTok, Reels, Stories):**
```bash
npm run build-vertical
```

**Both:**
```bash
npm run build-horizontal && npm run build-vertical
```

Rendered videos will be in `out/` folder.

## Customization

### Change Duration
Edit `durationInFrames` in `src/Root.tsx` (currently 600 frames = 20 seconds at 30fps)

### Change Colors
Brand colors defined at top of `src/WWETTPromo.tsx`:
- `BLUE = "#2563eb"` (primary)
- `GOLD = "#fbbf24"` (accent)
- `SLATE = "#64748b"` (text)

### Adjust Timing
Each `<Sequence>` in `src/WWETTPromo.tsx` controls scene timing:
```tsx
<Sequence from={0} durationInFrames={60}> // 0-2 seconds
```

### Add Real QR Code
Replace placeholder in CTAScene with actual QR image:
```tsx
<Img src={staticFile("qr-code.png")} style={{ width: 400, height: 400 }} />
```

## File Structure

```
promo-video/
├── src/
│   ├── index.ts           # Entry point
│   ├── Root.tsx           # Composition registry
│   └── WWETTPromo.tsx     # Main video component
├── public/
│   ├── WWETT-Potty Directory.png
│   └── wwett-logo.webp
├── out/                   # Rendered videos go here
├── package.json
├── tsconfig.json
└── remotion.config.ts
```

## Tips

- **Preview is key**: Use `npm start` to iterate quickly
- **Frame-based**: Everything is controlled by frame numbers (30fps = 30 frames per second)
- **Spring animations**: More natural than linear - used throughout for smooth motion
- **Sequences**: Each scene is its own component in a Sequence for easy timing control

## Export Specs

All videos render at:
- **FPS:** 30
- **Format:** MP4 (H.264)
- **Quality:** High (suitable for social media and presentations)

## Next Steps

1. Run `npm start` to preview
2. Adjust timing/colors/text as needed
3. Add real QR code image if desired
4. Render final videos with `npm run build-horizontal` and `npm run build-vertical`
5. Upload to social media or use in presentations!
', 90, 'site-pottydirectory/promo-video/README.md'
FROM projects WHERE name = 'Potty Directory' LIMIT 1;
