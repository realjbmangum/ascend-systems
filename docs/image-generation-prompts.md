# Image Generation Prompts — Ascend Systems

> [!info] What this is
> Every image the site references but does not yet have, with a ready-to-paste
> generation prompt and the **exact filename and path** it must be saved to.
> Drop files at the given paths and they appear automatically — the templates
> check the filesystem at build time, so a missing file is skipped rather than
> rendered as a broken image.
>
> **39 images total:** 5 service illustrations + 34 case-study screenshots.

---

## Before you batch these

> [!warning] Four of these five products are live — capture beats generate
> `scdmvappointments.com`, `recordstops.com`, `pottydirectory.com`, and
> `sendmylove.app` are all running right now. A real screenshot of a real
> product is stronger proof than any mockup, and costs a browser window.
> Generate only what you genuinely cannot capture.
>
> Everything generated is captioned **"illustrative mockup"** automatically.
> That labeling is controlled by `IMAGES_ARE_ILLUSTRATIVE` in
> `src/pages/portfolio/[slug].astro` — flip it to `false` once the set is
> replaced with real captures. Leave it `true` while any generated image is in
> the set. Case studies are sales evidence; an unlabeled mockup presented as a
> product capture is the kind of thing a prospect can catch.

> [!note] CLT EV is deliberately absent
> The City of Charlotte dashboard has **no** generated screenshots in this list.
> It is real client work for a government client, a real capture already exists
> at `/images/clt-ev-ss.png`, and synthesizing a municipal system's UI is not a
> risk worth taking. Same reasoning for Ringdocket and Heirloom — no
> screenshots declared, none invented.

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
captioned "illustrative mockup, not a client system."

| # | Filename | Page |
|---|----------|------|
| 1 | `custom-saas-development.png` | /services/custom-saas-development |
| 2 | `ai-integrations.png` | /services/ai-integrations |
| 3 | `internal-tools.png` | /services/internal-tools |
| 4 | `legacy-modernization.png` | /services/legacy-modernization |
| 5 | `fractional-cto.png` | /services/fractional-cto |

**1 — `custom-saas-development.png`**
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

**2 — `ai-integrations.png`**
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

**3 — `internal-tools.png`**
```
An operations dashboard for a distributed equipment fleet. Left dark sidebar,
"Overview" active. Four stat tiles: Sites 46, Units 208, Online 197, Needs
attention 11. Below, a two-column layout: left a bar chart of utilization by
site for the last 30 days, right a donut of unit status (Online / Idle /
Unreachable / Faulted). Beneath, a maintenance table with columns Unit, Site,
Status, Last seen, Action — a few rows flagged Unreachable in amber and Faulted
in red. A small role switcher in the header reading "Operations".
```

**4 — `legacy-modernization.png`**
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

**5 — `fractional-cto.png`**
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

## 2 · Case study screenshots (34)

Save to `public/images/case-studies/`. **This directory does not exist yet —
create it.** Rendered in a "Screenshots" gallery on each case study page,
captioned with the alt text plus "illustrative mockup".

The `-hero` images are wide banners (use 16:9); the rest are standard UI
screens. Note the extensions — some are `.jpg`, most `.png`. **Match them
exactly** or the file will be skipped.

### Deadrop (6) — zero-knowledge burn-on-read secret sharing

| Filename | Prompt |
|---|---|
| `deadrop-hero.png` | `Wide 16:9 hero banner for a security product called Deadrop. Dark charcoal #1E2A32 background. Centered: a single clean input card with a masked secret field showing dots, a burnt-orange "Create link" button, and a small lock glyph above. Below the card, three tiny labels in mono type: "Client-side AES-GCM", "Burns on read", "Zero-knowledge". Subtle abstract encrypted-data texture in the background at very low opacity. Minimal, confident, lots of negative space.` |
| `deadrop-create-link.png` | `A secret-creation screen. A single centered card on a light background titled "Share a secret". A large textarea holding a masked API key, below it a row of controls: Expires after (dropdown reading "24 hours"), Burn after reading (toggle, on), Password protect (toggle, off). A full-width orange "Create secure link" button. Below the button, small gray helper text: "Encrypted in your browser. The server never sees the contents."` |
| `deadrop-view-once-receive.png` | `A recipient view of a one-time secret. Centered card headed "This secret will be destroyed after you view it" with a prominent amber warning strip. A revealed secret value in JetBrains Mono inside a bordered box with a copy icon. Below it a countdown reading "Destroying in 00:04:58" and gray text "Viewed 1 of 1 times". No navigation chrome — a bare single-purpose page.` |
| `deadrop-expired-state.png` | `An expired-secret page. Centered card on a light background with a muted gray broken-link glyph, heading "This secret is gone", and body text "It was either already viewed or it expired. Secrets cannot be recovered — that is the point." A secondary outlined button reading "Create your own secret". Deliberately sparse and calm, not an error-red alarm state.` |
| `deadrop-branding-config.png` | `A white-label configuration screen. Left dark sidebar with "Branding" active. Main area: a form with fields Organization name, Logo upload (showing a small placeholder tile), Primary color (a color swatch picker showing a teal, not orange, to show it is configurable), Custom domain (reading secrets.acmelegal.com with a green Verified pill). To the right, a small live preview pane showing the create-secret card rendered in the chosen teal branding.` |
| `deadrop-architecture.png` | `A clean architecture diagram, not a UI screenshot. Light background, charcoal boxes with thin borders, orange arrows. Left to right: "Browser — AES-GCM encrypt" box, arrow labeled "ciphertext only" to a "Cloudflare Pages Function" box, then to a "KV store — TTL expiry" cylinder. A dashed line from KV back to a second "Browser — decrypt" box labeled "one-time read, then delete". A small side note box reads "Key lives in the URL fragment — never sent to the server." Technical, legible, minimal.` |

### PottyDirectory (7) — 3,447-vendor portable restroom directory

| Filename | Prompt |
|---|---|
| `pottydirectory-hero.jpg` | `Wide 16:9 hero banner for a portable restroom rental directory. Light off-white background. Left side: bold headline area (render as realistic UI text) reading "Find portable restroom rentals near you" with a prominent search bar containing a location field reading "Charlotte, NC" and an orange "Search" button. Right side: a stylized map pin cluster over a simplified US southeast map outline. Clean, utilitarian, trustworthy — a directory, not a consumer app.` |
| `pottydirectory-city-page.png` | `A city listing page headed "Portable Restroom Rental in Charlotte, NC". Below the heading, a filter bar with chips: Event rentals, Construction, ADA accessible, Luxury trailers. Main area is a two-column layout — left a vertical list of eight vendor cards each with company name, star rating, service radius, phone, and an orange "Request quote" button; right a map panel with numbered pins matching the list. A results count reads "34 providers serving Charlotte".` |
| `pottydirectory-vendor-detail.png` | `A single vendor detail page. Top: company name, star rating with review count, an "Verified" badge, address, and phone. A row of service tags: Construction, Events, ADA units, Weekly service. Main body in two columns — left a description block, an equipment list table (Standard unit, Deluxe flushable, ADA compliant, Restroom trailer) with capacity and typical use columns; right a sticky quote-request card with fields Event date, Duration, Units needed and an orange "Request quote" button.` |
| `pottydirectory-admin-leads.png` | `An internal admin leads table. Left dark sidebar with Leads active. Main area titled "Leads" with four stat tiles (New today 4 / This week 19 / Contacted 12 / Closed 3). Below, a table with columns Received, Name, City, Units, Event date, Vendor matched, Status. Status pills read New (orange), Contacted, Quoted, Won. Rows show realistic Charlotte-area names and dates. A search field and a date-range filter sit above the table.` |
| `pottydirectory-request-quote-form.png` | `A quote request form as seen by a customer. Centered card headed "Request a quote". Fields laid out in two columns: Full name, Email, Phone, City, Event type (dropdown showing "Construction site"), Start date, Duration, Number of units, Special requirements (textarea). A small trust line under the submit button reads "Your request goes to up to 3 local providers. No account needed." Full-width orange "Get quotes" button.` |
| `pottydirectory-data-page.png` | `A public data transparency page headed "Our data". Main area shows four stat tiles: Providers listed 3,447 / States covered 12 / Last verified pass March 2026 / Records updated this month 218. Below, a simple table titled "Coverage by state" with columns State, Providers, Cities, Last refreshed. Beneath that, a short changelog list with dated entries describing data updates. Informational and plain — deliberately not marketing-styled.` |
| `pottydirectory-methodology.png` | `A methodology explainer page headed "How this directory is built and maintained". Long-form single-column layout on white, max reading width. Numbered sections with subheadings: 1. Where the data comes from, 2. How we verify a provider, 3. How often records are refreshed, 4. How to report a problem. Each section has two or three lines of body copy and the whole page uses a clear editorial hierarchy. One callout box with a left orange border containing a short note about removal requests.` |

### RecordStops (7) — independent record store directory, 5 states

| Filename | Prompt |
|---|---|
| `recordstops-hero.jpg` | `Wide 16:9 hero banner for an independent record store directory. Warm off-white background with a subtle vinyl-groove circular texture at low opacity in one corner. Center-left: headline area reading "Find independent record stores" with a search bar containing "Asheville, NC" and an orange "Search" button. Below, three small stat chips: 296 stores, 5 states, 16 city guides. Tasteful and editorial, like a good city guide — not a retail site.` |
| `recordstops-homepage.png` | `A directory homepage. Top nav with Stores, City guides, Newsletter, About. Hero search band with a location input. Below, a section headed "Browse by state" showing five cards (North Carolina, South Carolina, Georgia, Tennessee, Virginia) each with a store count. Beneath that, "Recently added" as a three-across grid of store cards with name, city, and a small tag row (New & used, Listening bar, Buys collections). Footer strip promoting a weekly newsletter signup.` |
| `recordstops-city-guide.png` | `A long-form city guide page headed "Record Stores in Asheville, North Carolina". Editorial layout, max reading width. An intro paragraph, then numbered store entries — each with the store name as a heading, a line of address and hours, two or three sentences of genuine-sounding description, and a small tag row. A sticky right-hand mini table of contents lists the stores. Reads like a well-written city guide article, not a listing dump.` |
| `recordstops-store-detail.png` | `A single record store detail page. Top: store name, city, star rating, Open now pill in green, address and phone. A tag row: New & used, Buys collections, Listening bar, Cash or card. Two-column body — left a description, a genres-carried table, and store hours by day; right a sticky card with a small map thumbnail, directions link, website link, and a "Suggest an edit" secondary button.` |
| `recordstops-outreach-admin.png` | `An internal outreach pipeline admin, clearly replacing a CRM. Left dark sidebar with Outreach active. Main area: a pipeline board with columns Not contacted (212), Emailed (58), Replied (19), Listed (7). Cards show store name and city with a small last-touch date. Above the board, four stat tiles: Sequences active 3 / Emails sent this week 84 / Reply rate 22% / Cost $0. A right panel shows one store's contact timeline with dated email events.` |
| `recordstops-sample-email.png` | `An outreach email as rendered in an email client reading pane. Realistic email chrome — From, To, Subject line reading "Adding your store to RecordStops". Body is a short, plain-text-feeling personal email of about five lines offering a free listing, with a single link. Deliberately unpolished and human, not a designed HTML marketing template. A small "Sent via RecordStops outreach" footer line in gray.` |
| `recordstops-featured-listing.png` | `A featured-listing upgrade checkout. Centered card headed "Feature your store". Left side lists what is included with orange check icons: Top placement in your city, Photo gallery, Website link, Monthly performance email. Right side a Stripe-style payment panel with card number, expiry, CVC fields and an orange "Start featured listing — $19/mo" button. Above the fold a small comparison strip shows Standard vs Featured placement.` |

### SC DMV Alerts (7) — appointment monitoring, 65 locations

| Filename | Prompt |
|---|---|
| `scdmv-alerts-hero.jpg` | `Wide 16:9 hero banner for a DMV appointment alert service. Clean light background. Center: headline area reading "Get alerted the moment a DMV road test opens" with an orange "Start monitoring" button. To one side, a stylized notification card mock showing an alert: "Slot opened — Columbia, 9:40 AM tomorrow". Three small chips below: 65 locations, checked every 5 minutes, email + SMS. Calm, practical, service-like.` |
| `scdmv-homepage.png` | `A service homepage. Top nav: How it works, Locations, Pricing, Sign in. Hero band with a location multi-select showing three chosen SC cities as chips and an orange "Watch these locations" button. Below, a three-step "How it works" row with numbered icons: 1 Pick locations, 2 We check every 5 minutes, 3 You get an alert first. Beneath, a live-looking strip reading "Last check 41 seconds ago · 65 locations monitored".` |
| `scdmv-pricing.png` | `A three-tier pricing page. Three cards side by side: Free (email alerts, 1 location, checked every 30 min), Pro $5.99/mo (email + SMS, unlimited locations, checked every 5 min) marked "Most popular" with an orange border and badge, and CDL $19.99/mo (adds CDL road test monitoring and priority delivery). Each card has a feature list with check icons and a button — the Pro button filled orange, the others outlined. A short FAQ strip sits below.` |
| `scdmv-subscription-flow.png` | `A checkout step in a subscription flow. A progress indicator at top with three steps: Locations, Plan, Payment — Payment active. Left: an order summary card listing the chosen plan (Pro, $5.99/mo), the selected locations as chips, and a total. Right: a Stripe-style card entry panel with card number, expiry, CVC, and ZIP fields, and a full-width orange "Start monitoring" button. Small gray text below reads "Cancel anytime. No contract."` |
| `scdmv-locations.png` | `A location picker screen. Left panel: a searchable, scrollable checkbox list of South Carolina DMV branch names with city labels, several checked, a counter at top reading "4 of 65 selected". Right panel: a simplified map of South Carolina with pins, the selected ones highlighted orange and the rest muted gray. A sticky footer bar shows the selection count and an orange "Save locations" button.` |
| `scdmv-international-driver-guide.png` | `A long-form guide article page headed "Getting a South Carolina license as an international driver". Editorial single-column layout, max reading width, with a sticky table of contents on the left listing sections: Documents you need, Which test applies, Booking the road test, Common rejections. Body shows headings, paragraphs, and one bordered checklist box with document items. A subtle inline callout promotes appointment alerts. Reads like genuine helpful content.` |
| `scdmv-alert-email.png` | `An alert email rendered in an email client reading pane. Subject line reads "Road test slot opened — Columbia Main, tomorrow 9:40 AM". Body is a compact card: the location name, the available date and time in large JetBrains Mono, and a prominent orange "Book this slot" button. Below, a short list of two other nearby openings with times. Footer line in gray: "You are watching 4 locations. Manage alerts." Clean transactional email design.` |

### SendMyLove (7) — scheduled message delivery, sunset v1

| Filename | Prompt |
|---|---|
| `sendmylove-hero.jpg` | `Wide 16:9 hero banner for a scheduled personal message service. Soft warm light background, gentle and human rather than corporate — but still using the charcoal and orange system. Center: headline area reading "Never forget to say it" with an orange "Write your first note" button. To one side, a stylized phone showing a received message notification. Warm, calm, uncluttered.` |
| `sendmylove-homepage.png` | `A consumer product homepage. Simple top nav: How it works, Pricing, Sign in. Hero with headline area, subheadline, and an orange call-to-action. Below, a three-step row: 1 Write your notes, 2 Pick a schedule, 3 They arrive on time, every time. Beneath, a soft testimonial strip and a simple pricing mention reading "$5/month, cancel anytime". Warm consumer styling, generous whitespace, friendly but not cutesy.` |
| `sendmylove-composer.png` | `A message composer screen. Centered writing card with a large clean textarea holding a short warm personal note of two sentences. Above it a recipient selector showing one contact chip. Below the textarea: a character count, a delivery channel toggle (Email / SMS) with Email selected, and a "Schedule" button in orange. A left rail lists saved drafts with short preview lines and dates. Distraction-free, writing-focused.` |
| `sendmylove-schedule.png` | `A delivery schedule screen. Main area: a month calendar grid with several dates marked by small orange dots indicating scheduled messages, one date selected showing a side panel with that day's scheduled note preview and delivery time. Above the calendar, a recurrence control row: Frequency (dropdown reading "Weekly"), Day (Friday), Time (8:00 AM), Timezone. An orange "Save schedule" button.` |
| `sendmylove-checkout.png` | `A simple consumer subscription checkout. Centered narrow card headed "Start your subscription". A single plan summary line reading "$5 per month — unlimited scheduled notes". Below, a Stripe-style card entry panel with card number, expiry, CVC. A full-width orange "Subscribe" button, and small gray text beneath reading "Cancel anytime in one click." Deliberately minimal — one plan, no upsells.` |
| `sendmylove-admin.png` | `An internal operations admin for a messaging service. Left dark sidebar with Delivery active. Four stat tiles: Messages delivered 2,515 / Scheduled 189 / Failed 4 / Active subscribers 0. Below, a delivery log table with columns Scheduled for, Recipient (partially masked), Channel, Status, Attempts. Status pills read Delivered, Queued, Failed. A small chart of daily delivery volume sits above the table.` |
| `sendmylove-message-preview.png` | `A delivered message as it appears in the recipient's email client reading pane. Warm, simple design: a soft cream card containing a short handwritten-feeling personal note of two sentences in a comfortable serif, with the sender's first name below it. A very small unobtrusive footer line in light gray reading "Sent with SendMyLove". No marketing chrome, no buttons — it should feel like a personal note, not a product email.` |
```

---

## After you drop the files

1. `npm run build` — images are picked up automatically, no code change needed.
2. Check nothing was skipped for a filename or extension mismatch:
   ```bash
   python3 - <<'EOF'
   import re,pathlib
   miss=[]
   for f in sorted(pathlib.Path('src/content/case-studies').glob('*.md')):
       for p in re.findall(r'(/images/case-studies/[^"\s]+)', f.read_text().split('---')[1]):
           if not pathlib.Path('public'+p).exists(): miss.append(p)
   for p in ['custom-saas-development','ai-integrations','internal-tools','legacy-modernization','fractional-cto']:
       q=f'/images/services/{p}.png'
       if not pathlib.Path('public'+q).exists(): miss.append(q)
   print('\n'.join(miss) if miss else 'all images present')
   EOF
   ```
3. Once real captures replace the generated set, flip `IMAGES_ARE_ILLUSTRATIVE`
   to `false` in `src/pages/portfolio/[slug].astro` to drop the mockup caption.
