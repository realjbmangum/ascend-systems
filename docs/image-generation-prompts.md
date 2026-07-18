# Image Generation Prompts — Ascend Systems

> [!info] What this is
> Prompts for every generated image on the site, with the **exact filename and
> path** each must be saved to. Templates check the filesystem at build time, so
> dropping a file in makes it appear with no code change, and a missing file is
> skipped rather than rendered broken.

## Two sets, two different styles

| Set | Where | Style | Status |
|---|---|---|---|
| **A — UI mockups** | `/services/[slug]` detail pages | Photorealistic app screenshots | ✅ in place |
| **B — Concept illustrations** | `/services` overview page | Flat, iconic, one idea per image | ⏳ to generate |

Set B replaces `MockDashboard.tsx` and `MockPhoneUI.tsx` — the grey skeleton
placeholders currently on the overview page, which read as unfinished
wireframes.

> [!tip] Illustration dodges the failure mode that bit Set A
> `internal-tools.jpg` renders **"Siter"** instead of "Sites". Generated UI is
> full of near-miss text like that, and it is the single most common tell.
> **Set B prompts specify no text at all** — nothing to misspell.

> [!note] Case study pages have no images, by design
> The `screenshots`/`hero` frontmatter and the gallery were removed Jul 18 2026.
> The write-ups stand on text. If one ever earns an image, capture a real
> one — four of the five products are live. Never synthesize a screenshot of
> the City of Charlotte work.

---

# Set B — Concept illustrations (`/services` overview)

**Save to:** `public/images/services/concepts/`
**Format:** PNG with transparent background if your tool supports it, otherwise
off-white `#FAFAF8`. Square (1:1). These render around 400–500px, so they must
read clearly when small.

| # | Filename | Service |
|---|----------|---------|
| 1 | `custom-saas.png` | Custom SaaS Development |
| 2 | `ai-integrations.png` | AI Integrations & Agents |
| 3 | `internal-tools.png` | Internal Tools & Dashboards |
| 4 | `legacy-modernization.png` | Legacy System Modernization |
| 5 | `fractional-cto.png` | Fractional CTO |

### House style — prepend to every Set B prompt

```
Flat vector-style conceptual illustration. Simple, iconic, editorial — the kind
of single-idea illustration that sits beside a paragraph in a well-designed
report. Not a screenshot, not a UI, not isometric, not 3D, no gradients beyond
a single subtle tint.

Palette, strictly limited to four values: deep charcoal #1E2A32 for primary
shapes, burnt orange #D4632C as the single accent on one focal element only,
light warm gray #E2E8F0 for secondary shapes, off-white #FAFAF8 background.
Nothing else — no blues, no greens, no purple.

Clean geometric forms, consistent stroke weight where strokes are used,
generous negative space, centered composition with even margins, balanced and
calm. Square 1:1 aspect ratio.

ABSOLUTELY NO TEXT, no letters, no numbers, no labels, no logos, no watermarks,
no UI chrome, no human faces. The idea must be legible from the shapes alone at
small size.
```

### 1 — `custom-saas.png` · Custom SaaS Development

```
Subject: software that runs as a recurring service. Three flat rounded
rectangles stacked in slight offset depth like layered cards, viewed
straight-on and centered. A continuous circular arrow orbits the stack,
suggesting an ongoing subscription cycle rather than a one-time delivery. The
topmost card is burnt orange; the two beneath are charcoal and light gray.
Simple and confident, with no interface detail inside the cards.
```

### 2 — `ai-integrations.png` · AI Integrations & Agents

```
Subject: a huge document reduced to what matters. On the left, a tall stack of
many thin horizontal lines representing a long dense document, in light gray.
These converge through a simple funnel or lens form in charcoal. On the right,
emerging from it, just three short bold bars in burnt orange — the distilled,
important few. The visual argument is many-to-few: signal pulled out of volume.
No brain iconography, no robot, no neural-network cliché.
```

### 3 — `internal-tools.png` · Internal Tools & Dashboards

```
Subject: scattered work consolidated into one place. Around the outside,
several small disconnected shapes of different sizes in light gray — squares,
circles, a triangle — drifting apart. Thin charcoal lines draw them inward to a
single clean rounded panel at the center, divided into a simple grid of four
equal cells. One cell is burnt orange. The idea is many scattered sources
becoming one organized view.
```

### 4 — `legacy-modernization.png` · Legacy System Modernization

```
Subject: replacing something one piece at a time without knocking it down. Two
vertical towers built of stacked blocks, side by side, connected by a simple
bridge. The left tower is older and heavier in light gray with slightly uneven,
weathered blocks. The right tower is clean and precise in charcoal. Two or
three blocks are shown mid-transfer across the bridge, and one of those is
burnt orange. Both towers remain standing — nothing is collapsing or demolished.
```

### 5 — `fractional-cto.png` · Fractional CTO

```
Subject: judgement at a decision point. A path splits into three diverging
routes, drawn as simple clean lines. At the fork sits a single small compass
form in burnt orange. Two of the three routes are light gray; the third — the
chosen one — is charcoal and slightly bolder. Calm and deliberate: the image
should read as choosing well, not as being lost. No human figure, no chess
pieces, no lightbulb.
```

---

# Set A — UI mockups (detail pages) · DONE

All five are generated and live at `public/images/services/*.jpg`. Kept here so
any single image can be regenerated consistently. Rendered in the hero of each
`/services/[slug]` page, captioned "Illustrative mockup — not a client system."

| # | Filename | Page |
|---|----------|------|
| 1 | `custom-saas-development.jpg` | /services/custom-saas-development |
| 2 | `ai-integrations.jpg` | /services/ai-integrations |
| 3 | `internal-tools.jpg` | /services/internal-tools ⚠️ "Siter" typo |
| 4 | `legacy-modernization.jpg` | /services/legacy-modernization |
| 5 | `fractional-cto.jpg` | /services/fractional-cto |

### House style — prepend to every Set A prompt

```
Photorealistic screenshot of a modern web application UI, viewed straight-on,
no perspective distortion, no device frame, no browser chrome, no cursor.
16:9, sharp, pixel-crisp text.

Design system: dark charcoal #1E2A32 for sidebars and headers, off-white
#FAFAF8 page background, white #FFFFFF cards, burnt orange #D4632C used
sparingly for exactly one primary action and one active nav item, muted gray
#6B7280 for secondary text, 1px #E2E8F0 borders, 8px corner radius, soft
low-opacity shadows. Inter typeface for UI text, JetBrains Mono for numbers
and IDs. Generous whitespace, clear visual hierarchy, 8px spacing grid.

Realistic short data — real-sounding names, plausible dates, sensible numbers.
No lorem ipsum, no placeholder boxes, no logos, no watermarks, no invented
brand names other than the one specified. Text must be legible and correctly
spelled.
```

**1 — `custom-saas-development.jpg`**
```
A SaaS billing and subscriptions admin screen. Left dark sidebar with icons for
Overview, Customers, Subscriptions, Invoices, Settings — Subscriptions active in
orange. Main area: page title "Subscriptions", four stat tiles across the top
(Active 1,284 / MRR $18,340 / Churn 2.1% / Trials 47), a smooth line chart of
MRR over 12 months, and below it a table of customers with columns Customer,
Plan, Status, Next invoice, Amount. Status pills read Active, Past due, Trialing.
Three plan tiers visible: Starter, Growth, Scale. One orange "New plan" button
top right.
```

**2 — `ai-integrations.jpg`**
```
An AI document-processing review queue. Left dark sidebar, "Processing queue"
active. Main area: a table of documents being extracted, columns Document, Type,
Confidence, Status, Reviewer. Confidence shown as a percentage with a small
horizontal bar — most rows 94-99% in green, three rows 61-72% in amber flagged
"Needs review". A right-hand detail panel shows one contract page thumbnail
beside the extracted clauses (indemnification, payment terms, termination) with
each field's confidence beside it and an orange "Approve" button. A top strip
shows Processed today 1,847 / Auto-approved 91% / Avg cost per doc $0.004.
```

**3 — `internal-tools.jpg`** ⚠️ regenerate — current version reads "Siter"
```
An operations dashboard for a distributed equipment fleet. Left dark sidebar,
"Overview" active. Four stat tiles: Sites 46, Units 208, Online 197, Needs
attention 11. Below, a two-column layout: left a bar chart of utilization by
site for the last 30 days, right a donut of unit status (Online / Idle /
Unreachable / Faulted). Beneath, a maintenance table with columns Unit, Site,
Status, Last seen, Action — a few rows flagged Unreachable in amber and Faulted
in red. A small role switcher in the header reading "Operations".
```

**4 — `legacy-modernization.jpg`**
```
A migration control console showing an old and a new system running in parallel.
Top: a horizontal progress strip of workflow migration phases — Invoicing
(complete, green check), Scheduling (complete), Reporting (in progress, orange,
64%), Payroll (queued, gray). Main area split into two labeled columns, "Legacy
system" and "New system", each showing the same record counts side by side with
a center reconciliation column of green matched checks and two amber
"Discrepancy" rows. Bottom: a table titled Reconciliation log with columns
Timestamp, Workflow, Records compared, Matched, Variance. One orange "Promote
workflow" button.
```

**5 — `fractional-cto.jpg`**
```
A technical decision and roadmap board. Left dark sidebar, "Roadmap" active.
Main area: a kanban-style board with four columns — Decisions pending, Under
review, Approved, Shipped — holding compact cards. Card titles read like real
technical decisions: "Vendor quote — CRM replacement", "Auth provider: build vs
buy", "Hire: senior backend engineer", "Database migration plan", "SOC 2
readiness gap". Each card shows a small risk chip (Low / Medium / High) and an
owner avatar initial. A right-hand panel shows one decision expanded with
Context, Options, Recommendation, and Cost impact sections.
```

---

## After you drop files in

1. `npm run build` — picked up automatically, no code change needed.
2. Check what's present:
   ```bash
   for s in custom-saas-development ai-integrations internal-tools \
            legacy-modernization fractional-cto; do
     [ -f "public/images/services/$s.jpg" ] && echo "A ok      $s" || echo "A MISSING $s"
   done
   for s in custom-saas ai-integrations internal-tools \
            legacy-modernization fractional-cto; do
     [ -f "public/images/services/concepts/$s.png" ] && echo "B ok      $s" || echo "B MISSING $s"
   done
   ```
3. Set B also needs the mock components swapped out in `src/pages/Services.tsx`
   — tell Claude when the files are in; it's a small change.
