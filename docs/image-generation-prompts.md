# Image Generation Prompts — Ascend Systems

> [!info] How to use this
> Every prompt below is **complete and self-contained**. Copy one block, paste
> it into Grok, save the result under the filename in its heading. Nothing to
> combine, nothing to prepend.
>
> Templates check the filesystem at build time, so dropping a file in makes it
> appear with no code change, and a missing file is skipped rather than
> rendered broken.

| Set | Where | Style | Status |
|---|---|---|---|
| **A** | `/services` overview page | Flat concept illustration | ⏳ to generate |
| **B** | `/services/[slug]` detail pages | Photorealistic UI mockup | ✅ in place |

> [!tip] Why Set A forbids text
> `internal-tools.jpg` in Set B renders **"Siter"** instead of "Sites."
> Generated UI is full of near-miss text like that and it is the most common
> tell. Every Set A prompt bans text outright — shapes can't be misspelled.

> [!note] Case study pages have no images, by design
> The `screenshots`/`hero` frontmatter and gallery were removed Jul 18 2026.
> The write-ups stand on text. If one ever earns an image, capture a real
> one — four of the five products are live. Never synthesize a screenshot of
> the City of Charlotte work.

---

# SET A — Concept illustrations

**Save all five to:** `public/images/services/concepts/`

---

## A1 → save as `custom-saas.png`

```
Flat vector-style conceptual illustration, square 1:1. Simple, iconic, editorial — the kind of single-idea illustration that sits beside a paragraph in a well-designed report. Not a screenshot, not a user interface, not isometric, not 3D, no gradients, no photographic texture.

Palette strictly limited to four values: deep charcoal #1E2A32 for primary shapes, burnt orange #D4632C as the single accent on one focal element only, light warm gray #E2E8F0 for secondary shapes, off-white #FAFAF8 background. Nothing else — no blues, no greens, no purples.

Clean geometric forms, consistent stroke weight, generous negative space, centered composition with even margins, calm and balanced. Must read clearly at small size, around 400 pixels.

Subject: software that runs as a recurring service. Three flat rounded rectangles stacked in slight offset depth like layered cards, viewed straight-on and centered. A continuous circular arrow orbits the stack, suggesting an ongoing subscription cycle rather than a one-time delivery. The topmost card is burnt orange; the two beneath are charcoal and light gray. No interface detail inside the cards.

ABSOLUTELY NO TEXT of any kind — no letters, no numbers, no labels, no logos, no watermarks, no signatures. No UI chrome, no browser frames, no human figures or faces. The idea must be legible from the shapes alone.
```

---

## A2 → save as `ai-integrations.png`

```
Flat vector-style conceptual illustration, square 1:1. Simple, iconic, editorial — the kind of single-idea illustration that sits beside a paragraph in a well-designed report. Not a screenshot, not a user interface, not isometric, not 3D, no gradients, no photographic texture.

Palette strictly limited to four values: deep charcoal #1E2A32 for primary shapes, burnt orange #D4632C as the single accent on one focal element only, light warm gray #E2E8F0 for secondary shapes, off-white #FAFAF8 background. Nothing else — no blues, no greens, no purples.

Clean geometric forms, consistent stroke weight, generous negative space, centered composition with even margins, calm and balanced. Must read clearly at small size, around 400 pixels.

Subject: a huge document reduced to what matters. On the left, a tall stack of many thin horizontal lines representing a long dense document, in light gray. These converge through a simple funnel or lens form in charcoal. On the right, emerging from it, just three short bold bars in burnt orange — the distilled, important few. The visual argument is many-to-few: signal pulled out of volume. No brain iconography, no robot, no neural-network cliché, no circuit patterns.

ABSOLUTELY NO TEXT of any kind — no letters, no numbers, no labels, no logos, no watermarks, no signatures. No UI chrome, no browser frames, no human figures or faces. The idea must be legible from the shapes alone.
```

---

## A3 → save as `internal-tools.png`

```
Flat vector-style conceptual illustration, square 1:1. Simple, iconic, editorial — the kind of single-idea illustration that sits beside a paragraph in a well-designed report. Not a screenshot, not a user interface, not isometric, not 3D, no gradients, no photographic texture.

Palette strictly limited to four values: deep charcoal #1E2A32 for primary shapes, burnt orange #D4632C as the single accent on one focal element only, light warm gray #E2E8F0 for secondary shapes, off-white #FAFAF8 background. Nothing else — no blues, no greens, no purples.

Clean geometric forms, consistent stroke weight, generous negative space, centered composition with even margins, calm and balanced. Must read clearly at small size, around 400 pixels.

Subject: scattered work consolidated into one place. Around the outside, several small disconnected shapes of different sizes in light gray — squares, circles, a triangle — drifting apart. Thin charcoal lines draw them inward to a single clean rounded panel at the center, divided into a simple grid of four equal cells. One cell is burnt orange. The idea is many scattered sources becoming one organized view.

ABSOLUTELY NO TEXT of any kind — no letters, no numbers, no labels, no logos, no watermarks, no signatures. No UI chrome, no browser frames, no human figures or faces. The idea must be legible from the shapes alone.
```

---

## A4 → save as `legacy-modernization.png`

```
Flat vector-style conceptual illustration, square 1:1. Simple, iconic, editorial — the kind of single-idea illustration that sits beside a paragraph in a well-designed report. Not a screenshot, not a user interface, not isometric, not 3D, no gradients, no photographic texture.

Palette strictly limited to four values: deep charcoal #1E2A32 for primary shapes, burnt orange #D4632C as the single accent on one focal element only, light warm gray #E2E8F0 for secondary shapes, off-white #FAFAF8 background. Nothing else — no blues, no greens, no purples.

Clean geometric forms, consistent stroke weight, generous negative space, centered composition with even margins, calm and balanced. Must read clearly at small size, around 400 pixels.

Subject: replacing something one piece at a time without knocking it down. Two vertical towers built of stacked blocks, side by side, connected by a simple horizontal bridge. The left tower is older and heavier in light gray with slightly uneven, weathered blocks. The right tower is clean and precise in charcoal. Two or three blocks are shown mid-transfer across the bridge, and one of those is burnt orange. Both towers remain standing — nothing is collapsing, crumbling, or demolished.

ABSOLUTELY NO TEXT of any kind — no letters, no numbers, no labels, no logos, no watermarks, no signatures. No UI chrome, no browser frames, no human figures or faces. The idea must be legible from the shapes alone.
```

---

## A5 → save as `fractional-cto.png`

```
Flat vector-style conceptual illustration, square 1:1. Simple, iconic, editorial — the kind of single-idea illustration that sits beside a paragraph in a well-designed report. Not a screenshot, not a user interface, not isometric, not 3D, no gradients, no photographic texture.

Palette strictly limited to four values: deep charcoal #1E2A32 for primary shapes, burnt orange #D4632C as the single accent on one focal element only, light warm gray #E2E8F0 for secondary shapes, off-white #FAFAF8 background. Nothing else — no blues, no greens, no purples.

Clean geometric forms, consistent stroke weight, generous negative space, centered composition with even margins, calm and balanced. Must read clearly at small size, around 400 pixels.

Subject: judgement at a decision point. A single path splits into three diverging routes, drawn as simple clean lines. At the fork sits one small compass form in burnt orange. Two of the three routes are light gray; the third — the chosen one — is charcoal and slightly bolder. Calm and deliberate: it should read as choosing well, not as being lost. No human figure, no chess pieces, no lightbulb, no question marks.

ABSOLUTELY NO TEXT of any kind — no letters, no numbers, no labels, no logos, no watermarks, no signatures. No UI chrome, no browser frames, no human figures or faces. The idea must be legible from the shapes alone.
```

---

# SET B — UI mockups · already generated

**Save all five to:** `public/images/services/`
Live at `public/images/services/*.jpg`. Rendered in the hero of each
`/services/[slug]` page, captioned "Illustrative mockup — not a client system."
Kept here so any one can be regenerated consistently.

---

## B1 → save as `custom-saas-development.jpg`

```
Photorealistic screenshot of a modern web application UI, viewed straight-on, no perspective distortion, no device frame, no browser chrome, no cursor. 16:9, sharp, pixel-crisp text.

Design system: dark charcoal #1E2A32 for sidebars and headers, off-white #FAFAF8 page background, white #FFFFFF cards, burnt orange #D4632C used sparingly for exactly one primary action and one active nav item, muted gray #6B7280 for secondary text, 1px #E2E8F0 borders, 8px corner radius, soft low-opacity shadows. Inter typeface for UI text, JetBrains Mono for numbers and IDs. Generous whitespace, clear visual hierarchy, 8px spacing grid.

Screen: a SaaS billing and subscriptions admin. Left dark sidebar with icons for Overview, Customers, Subscriptions, Invoices, Settings — Subscriptions active in orange. Main area titled "Subscriptions" with four stat tiles across the top (Active 1,284 / MRR $18,340 / Churn 2.1% / Trials 47), a smooth line chart of MRR over 12 months, and below it a table of customers with columns Customer, Plan, Status, Next invoice, Amount. Status pills read Active, Past due, Trialing. Three plan tiers visible: Starter, Growth, Scale. One orange "New plan" button top right.

Realistic short data — real-sounding names, plausible dates, sensible numbers. No lorem ipsum, no placeholder boxes, no logos, no watermarks, no invented brand names. All text must be legible and correctly spelled.
```

---

## B2 → save as `ai-integrations.jpg`

```
Photorealistic screenshot of a modern web application UI, viewed straight-on, no perspective distortion, no device frame, no browser chrome, no cursor. 16:9, sharp, pixel-crisp text.

Design system: dark charcoal #1E2A32 for sidebars and headers, off-white #FAFAF8 page background, white #FFFFFF cards, burnt orange #D4632C used sparingly for exactly one primary action and one active nav item, muted gray #6B7280 for secondary text, 1px #E2E8F0 borders, 8px corner radius, soft low-opacity shadows. Inter typeface for UI text, JetBrains Mono for numbers and IDs. Generous whitespace, clear visual hierarchy, 8px spacing grid.

Screen: an AI contract-review queue. Left dark sidebar with "Review queue" active. Main area is a table of contracts being processed, columns Document, Type, Confidence, Status, Reviewer. Confidence shown as a percentage with a small horizontal bar — most rows 94-99% in green, three rows 61-72% in amber flagged "Needs review". A right-hand detail panel shows one contract page thumbnail beside extracted clauses (Indemnification, Payment terms, Termination, Scope) with each clause's confidence beside it and an orange "Approve" button. A top strip reads Processed today 1,847 / Auto-approved 91% / Avg review time 15 min.

Realistic short data — real-sounding names, plausible dates, sensible numbers. No lorem ipsum, no placeholder boxes, no logos, no watermarks, no invented brand names. All text must be legible and correctly spelled.
```

---

## B3 → save as `internal-tools.jpg` ⚠️ regenerate — current version reads "Siter"

```
Photorealistic screenshot of a modern web application UI, viewed straight-on, no perspective distortion, no device frame, no browser chrome, no cursor. 16:9, sharp, pixel-crisp text.

Design system: dark charcoal #1E2A32 for sidebars and headers, off-white #FAFAF8 page background, white #FFFFFF cards, burnt orange #D4632C used sparingly for exactly one primary action and one active nav item, muted gray #6B7280 for secondary text, 1px #E2E8F0 borders, 8px corner radius, soft low-opacity shadows. Inter typeface for UI text, JetBrains Mono for numbers and IDs. Generous whitespace, clear visual hierarchy, 8px spacing grid.

Screen: an operations dashboard for a distributed equipment fleet. Left dark sidebar with "Overview" active. Four stat tiles across the top, labelled exactly: "Sites" 46, "Units" 208, "Online" 197, "Needs attention" 11. Below, a two-column layout: left a bar chart of utilization by site over the last 30 days, right a donut chart of unit status (Online / Idle / Unreachable / Faulted). Beneath, a maintenance table with columns Unit, Site, Status, Last seen, Action — a few rows flagged Unreachable in amber and Faulted in red. A small role switcher in the header reading "Operations".

Spelling is critical: the first stat tile must read exactly "Sites" — not "Siter", not "Site". Double-check every label. Realistic short data — real-sounding names, plausible dates, sensible numbers. No lorem ipsum, no placeholder boxes, no logos, no watermarks, no invented brand names. All text must be legible and correctly spelled.
```

---

## B4 → save as `legacy-modernization.jpg`

```
Photorealistic screenshot of a modern web application UI, viewed straight-on, no perspective distortion, no device frame, no browser chrome, no cursor. 16:9, sharp, pixel-crisp text.

Design system: dark charcoal #1E2A32 for sidebars and headers, off-white #FAFAF8 page background, white #FFFFFF cards, burnt orange #D4632C used sparingly for exactly one primary action and one active nav item, muted gray #6B7280 for secondary text, 1px #E2E8F0 borders, 8px corner radius, soft low-opacity shadows. Inter typeface for UI text, JetBrains Mono for numbers and IDs. Generous whitespace, clear visual hierarchy, 8px spacing grid.

Screen: a migration control console showing an old and a new system running in parallel. Top: a horizontal progress strip of workflow migration phases — Invoicing (complete, green check), Scheduling (complete), Reporting (in progress, orange, 64%), Payroll (queued, gray). Main area split into two labelled columns, "Legacy system" and "New system", each showing the same record counts side by side, with a center reconciliation column of green matched checks and two amber "Discrepancy" rows. Bottom: a table titled "Reconciliation log" with columns Timestamp, Workflow, Records compared, Matched, Variance. One orange "Promote workflow" button.

Realistic short data — real-sounding names, plausible dates, sensible numbers. No lorem ipsum, no placeholder boxes, no logos, no watermarks, no invented brand names. All text must be legible and correctly spelled.
```

---

## B5 → save as `fractional-cto.jpg`

```
Photorealistic screenshot of a modern web application UI, viewed straight-on, no perspective distortion, no device frame, no browser chrome, no cursor. 16:9, sharp, pixel-crisp text.

Design system: dark charcoal #1E2A32 for sidebars and headers, off-white #FAFAF8 page background, white #FFFFFF cards, burnt orange #D4632C used sparingly for exactly one primary action and one active nav item, muted gray #6B7280 for secondary text, 1px #E2E8F0 borders, 8px corner radius, soft low-opacity shadows. Inter typeface for UI text, JetBrains Mono for numbers and IDs. Generous whitespace, clear visual hierarchy, 8px spacing grid.

Screen: a technical decision and roadmap board. Left dark sidebar with "Roadmap" active. Main area is a kanban board with four columns — Decisions pending, Under review, Approved, Shipped — holding compact cards. Card titles read like real technical decisions: "Vendor quote — CRM replacement", "Auth provider: build vs buy", "Hire: senior backend engineer", "Database migration plan", "SOC 2 readiness gap". Each card shows a small risk chip (Low / Medium / High) and an owner avatar initial. A right-hand panel shows one decision expanded with Context, Options, Recommendation, and Cost impact sections.

Realistic short data — real-sounding names, plausible dates, sensible numbers. No lorem ipsum, no placeholder boxes, no logos, no watermarks, no invented brand names. All text must be legible and correctly spelled.
```

---

## After you drop files in

1. `npm run build` — picked up automatically, no code change needed.
2. Check what's present:
   ```bash
   for s in custom-saas-development ai-integrations internal-tools \
            legacy-modernization fractional-cto; do
     [ -f "public/images/services/$s.jpg" ] && echo "B ok      $s" || echo "B MISSING $s"
   done
   for s in custom-saas ai-integrations internal-tools \
            legacy-modernization fractional-cto; do
     [ -f "public/images/services/concepts/$s.png" ] && echo "A ok      $s" || echo "A MISSING $s"
   done
   ```
3. Set A also needs the mock components swapped out in `src/pages/Services.tsx`
   — tell Claude when the files are in; it's a small change.
