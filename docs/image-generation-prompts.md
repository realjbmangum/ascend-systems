# Image Generation Prompts — Ascend Systems

> [!info] What this is
> Every image the site references but does not yet have, with a ready-to-paste
> generation prompt and the **exact filename and path** it must be saved to.
> Drop files at the given paths and they appear automatically — the templates
> check the filesystem at build time, so a missing file is skipped rather than
> rendered as a broken image.
>
> **5 images:** one illustration per service page. Case study pages are text
> only, by design — see the note at the bottom.
>
> **Status: all five generated and in place** (`public/images/services/*.jpg`).
> These prompts are kept so any single image can be regenerated consistently.

---

## House style — prepend to every prompt

Paste this block ahead of any prompt below. It carries the brand and kills the
usual generated-UI tells.

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

---

## 1 · Service page illustrations (5)

Save to `public/images/services/`. Rendered on each `/services/[slug]` page,
captioned "illustrative mockup, not a client system" — they depict the kind of
software built, never a specific client's system.

| # | Filename | Page |
|---|----------|------|
| 1 | `custom-saas-development.jpg` | /services/custom-saas-development |
| 2 | `ai-integrations.jpg` | /services/ai-integrations |
| 3 | `internal-tools.jpg` | /services/internal-tools |
| 4 | `legacy-modernization.jpg` | /services/legacy-modernization |
| 5 | `fractional-cto.jpg` | /services/fractional-cto |

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
"Needs review". A right-hand detail panel shows one invoice PDF thumbnail beside
the extracted fields (vendor, date, line items, total) with each field's
confidence beside it and an orange "Approve" button. A top strip shows Processed
today 1,847 / Auto-approved 91% / Avg cost per doc $0.004.
```

**3 — `internal-tools.jpg`**
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

## Case studies — deliberately no images

Case study pages are **text only**. The `screenshots` and `hero` frontmatter
fields and the gallery that rendered them were removed on Jul 18 2026 — the
write-ups stand on their own, and 34 generated mockups was solving a problem
nobody had.

If a specific case study ever earns an image, capture a real one: four of the
five products (`scdmvappointments.com`, `recordstops.com`, `pottydirectory.com`,
`sendmylove.app`) are live. Do not synthesize a screenshot of the City of
Charlotte work.

---

## After you drop the files

1. `npm run build` — images are picked up automatically, no code change needed.
2. Confirm all five are present:
   ```bash
   for s in custom-saas-development ai-integrations internal-tools \
            legacy-modernization fractional-cto; do
     [ -f "public/images/services/$s.jpg" ] && echo "ok      $s" || echo "MISSING $s"
   done
   ```
