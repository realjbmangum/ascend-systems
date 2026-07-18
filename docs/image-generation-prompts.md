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
| **A** | `/services` overview page | Dark abstract 3D render | ⏳ to generate |
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

# SET A — Dark abstract 3D renders

**Save all five to:** `public/images/services/concepts/`

Premium product-render language — glass, metal, orange rim light on deep
charcoal. Abstract form only, no icons and no text.

---

## A1 → save as `custom-saas.png`

*Custom SaaS Development*

```
Abstract 3D product render, square 1:1. Photorealistic materials and studio lighting, in the visual language of a premium technology company's product page — think polished glass, brushed metal, and matte ceramic sculpted into pure geometric form. Not an icon, not an illustration, not a diagram, not a user interface, not a logo.

Deep charcoal #1E2A32 environment fading to near-black at the edges. Forms are dark smoked glass and dark brushed metal. A single burnt-orange #D4632C light source rakes across the geometry as a rim light and catches one emissive edge — the only saturated color in the frame. Soft key light from upper left, subtle reflections, faint caustics through the glass.

Shallow depth of field with the focal plane on the primary form, gentle bokeh falling off behind. Cinematic, high-contrast, expensive. Octane-quality render, 8k detail, physically based materials, no visible polygons.

Composition is centered with generous dark negative space around the subject. Must read clearly at small size, around 500 pixels.

Subject: software that runs as a continuous service rather than a one-time delivery. Three broad slabs of dark smoked glass stacked in parallel with air between them, each rotated slightly off-axis from the one below, floating in the dark. A single unbroken ring of burnt-orange light encircles the whole stack on a tilted orbital plane, passing behind the top slab and in front of the bottom one so it reads as a continuous cycle. The topmost slab catches the strongest rim light along its leading edge. Interior of the glass shows faint depth and internal reflection.

ABSOLUTELY NO TEXT of any kind — no letters, numbers, labels, logos, watermarks, or signatures. No screens, no user interface, no browser chrome, no human figures or hands, no desks or offices. Pure abstract form only.
```

---

## A2 → save as `ai-integrations.png`

*AI Integrations & Agents*

```
Abstract 3D product render, square 1:1. Photorealistic materials and studio lighting, in the visual language of a premium technology company's product page — think polished glass, brushed metal, and matte ceramic sculpted into pure geometric form. Not an icon, not an illustration, not a diagram, not a user interface, not a logo.

Deep charcoal #1E2A32 environment fading to near-black at the edges. Forms are dark smoked glass and dark brushed metal. A single burnt-orange #D4632C light source rakes across the geometry as a rim light and catches one emissive edge — the only saturated color in the frame. Soft key light from upper left, subtle reflections, faint caustics through the glass.

Shallow depth of field with the focal plane on the primary form, gentle bokeh falling off behind. Cinematic, high-contrast, expensive. Octane-quality render, 8k detail, physically based materials, no visible polygons.

Composition is centered with generous dark negative space around the subject. Must read clearly at small size, around 500 pixels.

Subject: enormous volume distilled down to what matters. A dense wall of many hundreds of thin vertical glass rods, tightly packed and receding into darkness on the left, all dark and unlit. They pass through a single solid prism of dark glass at the center. Emerging on the right: just three thick bars of concentrated burnt-orange light, sharply in focus, cleanly separated. The prism is the focal plane. Visible caustics where the light concentrates and exits. The visual argument is many-to-few — signal extracted from overwhelming volume.

ABSOLUTELY NO TEXT of any kind — no letters, numbers, labels, logos, watermarks, or signatures. No screens, no user interface, no browser chrome, no human figures or hands, no desks or offices. Pure abstract form only.
```

---

## A3 → save as `internal-tools.png`

*Internal Tools & Dashboards*

```
Abstract 3D product render, square 1:1. Photorealistic materials and studio lighting, in the visual language of a premium technology company's product page — think polished glass, brushed metal, and matte ceramic sculpted into pure geometric form. Not an icon, not an illustration, not a diagram, not a user interface, not a logo.

Deep charcoal #1E2A32 environment fading to near-black at the edges. Forms are dark smoked glass and dark brushed metal. A single burnt-orange #D4632C light source rakes across the geometry as a rim light and catches one emissive edge — the only saturated color in the frame. Soft key light from upper left, subtle reflections, faint caustics through the glass.

Shallow depth of field with the focal plane on the primary form, gentle bokeh falling off behind. Cinematic, high-contrast, expensive. Octane-quality render, 8k detail, physically based materials, no visible polygons.

Composition is centered with generous dark negative space around the subject. Must read clearly at small size, around 500 pixels.

Subject: scattered work consolidated into one place. Dozens of small irregular fragments of dark metal and glass — different sizes, tumbling, unaligned — drift inward from the dark edges of the frame. Toward the center they resolve into a single seamless monolithic slab of dark glass, perfectly flat and precise, its surface divided by fine inset grooves into a clean grid. One groove glows burnt orange. The fragments nearest the monolith are motion-blurred and out of focus; the monolith itself is razor sharp. Chaos resolving into order.

ABSOLUTELY NO TEXT of any kind — no letters, numbers, labels, logos, watermarks, or signatures. No screens, no user interface, no browser chrome, no human figures or hands, no desks or offices. Pure abstract form only.
```

---

## A4 → save as `legacy-modernization.png`

*Legacy System Modernization*

```
Abstract 3D product render, square 1:1. Photorealistic materials and studio lighting, in the visual language of a premium technology company's product page — think polished glass, brushed metal, and matte ceramic sculpted into pure geometric form. Not an icon, not an illustration, not a diagram, not a user interface, not a logo.

Deep charcoal #1E2A32 environment fading to near-black at the edges. Forms are dark smoked glass and dark brushed metal. A single burnt-orange #D4632C light source rakes across the geometry as a rim light and catches one emissive edge — the only saturated color in the frame. Soft key light from upper left, subtle reflections, faint caustics through the glass.

Shallow depth of field with the focal plane on the primary form, gentle bokeh falling off behind. Cinematic, high-contrast, expensive. Octane-quality render, 8k detail, physically based materials, no visible polygons.

Composition is centered with generous dark negative space around the subject. Must read clearly at small size, around 500 pixels.

Subject: replacing something one piece at a time without knocking it down. Two tall monolithic columns stand side by side in the dark, both fully intact and load-bearing. The left column is old dark concrete — pitted, weathered, matte, its blocks slightly misaligned. The right column is flawless dark polished glass with crisp machined edges. A narrow bridge of light spans between them at mid-height, and three cubic blocks are suspended mid-transit across it, each caught in burnt-orange rim light as it crosses. Nothing is falling, crumbling, or collapsing — both columns stand.

ABSOLUTELY NO TEXT of any kind — no letters, numbers, labels, logos, watermarks, or signatures. No screens, no user interface, no browser chrome, no human figures or hands, no desks or offices. Pure abstract form only.
```

---

## A5 → save as `fractional-cto.png`

*Fractional CTO*

```
Abstract 3D product render, square 1:1. Photorealistic materials and studio lighting, in the visual language of a premium technology company's product page — think polished glass, brushed metal, and matte ceramic sculpted into pure geometric form. Not an icon, not an illustration, not a diagram, not a user interface, not a logo.

Deep charcoal #1E2A32 environment fading to near-black at the edges. Forms are dark smoked glass and dark brushed metal. A single burnt-orange #D4632C light source rakes across the geometry as a rim light and catches one emissive edge — the only saturated color in the frame. Soft key light from upper left, subtle reflections, faint caustics through the glass.

Shallow depth of field with the focal plane on the primary form, gentle bokeh falling off behind. Cinematic, high-contrast, expensive. Octane-quality render, 8k detail, physically based materials, no visible polygons.

Composition is centered with generous dark negative space around the subject. Must read clearly at small size, around 500 pixels.

Subject: judgement at a decision point. Three broad ribbons of dark polished metal sweep out of the darkness and converge at a single point in the center of the frame. Resting exactly at that convergence is one perfect sphere of dark smoked glass, lit from within by a small burnt-orange core that glows through the material. Two of the three ribbons fall away into shadow, unlit and receding. The third catches a clean specular highlight along its full length, leading forward out of frame. Poised and deliberate — the composition should read as choosing well, not as being lost.

ABSOLUTELY NO TEXT of any kind — no letters, numbers, labels, logos, watermarks, or signatures. No screens, no user interface, no browser chrome, no human figures or hands, no desks or offices. Pure abstract form only.
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
