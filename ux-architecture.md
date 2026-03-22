# UX Architecture — [BRAND NAME]

> [!info] UX Architecture Deliverable
> Complete UX architecture for the AI phone answering service website.
> Includes site map, wireframes, conversion flows, trust architecture, and technical specs.
> **Architect:** Claude (UX Agent) | **Date:** Feb 13, 2026

---

## Table of Contents

1. [Site Map & Navigation](#1-site-map--navigation)
2. [User Journeys](#2-user-journeys)
3. [Homepage Wireframe](#3-homepage-wireframe)
4. [Pricing Page Wireframe](#4-pricing-page-wireframe)
5. [How It Works Page Wireframe](#5-how-it-works-page-wireframe)
6. [About Page Wireframe](#6-about-page-wireframe)
7. [Demo Experience Design](#7-demo-experience-design)
8. [Contact / Get Started Page Wireframe](#8-contact--get-started-page-wireframe)
9. [Conversion Flow Design](#9-conversion-flow-design)
10. [Trust Architecture](#10-trust-architecture)
11. [Technical Specs](#11-technical-specs)
12. [Accessibility Checklist](#12-accessibility-checklist)
13. [Competitor Insights Applied](#13-competitor-insights-applied)

---
---

# 1. Site Map & Navigation

## Page Hierarchy

```
/                          Homepage (primary conversion page)
/how-it-works              Step-by-step walkthrough
/pricing                   Plans, comparison, guarantee
/about                     Brian's story, local angle
/contact                   Get started form + calendar booking
/demo                      Try the AI — call the demo number
/privacy                   Privacy policy
/terms                     Terms of service
```

## Priority Phasing

| Priority | Page | Rationale |
|----------|------|-----------|
| **P1 — Launch** | Homepage | Primary landing + conversion page. Must be perfect. |
| **P1 — Launch** | Pricing | Prospects always check pricing. Removes friction. |
| **P1 — Launch** | About | Trust page. Brian's local story is the differentiator. |
| **P1 — Launch** | Contact / Get Started | Conversion endpoint. Form + calendar embed. |
| **P1 — Launch** | Demo | The killer feature. Lets prospects call the AI live. |
| **P1 — Launch** | Privacy / Terms | Legal requirement for any business site. |
| **P2 — Post-Launch** | How It Works | Detailed walkthrough. Homepage covers basics at launch. |
| **P2 — Post-Launch** | /industries/[type] | Vertical landing pages (plumbers, dentists, HVAC, etc.) |
| **P2 — Post-Launch** | /blog | SEO content — "missed call statistics," "AI receptionist vs answering service" |
| **P2 — Post-Launch** | /case-studies | Real customer results (once testimonials exist) |

## Primary Navigation (Desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│  [LOGO]     How It Works    Pricing    About    Demo    [Book a Demo →]  │
└─────────────────────────────────────────────────────────────────┘
```

- **Logo** — links to homepage
- **How It Works** — `/how-it-works` (P2: links to homepage #how-it-works anchor at launch)
- **Pricing** — `/pricing`
- **About** — `/about`
- **Demo** — `/demo`
- **Book a Demo** — primary CTA button (styled, colored, stands out). Links to `/contact`

> [!tip] Navigation Principle
> Maximum 5 nav items + 1 CTA button. This audience does not want complexity.
> No dropdowns. No mega-menus. Every link is a direct destination.

## Primary Navigation (Mobile)

```
┌──────────────────────────────────┐
│  [LOGO]              [≡ Menu]   │
└──────────────────────────────────┘
```

- Hamburger menu opens a full-screen overlay (not a sidebar)
- Same 5 links + CTA button, stacked vertically
- **Sticky bottom bar** on mobile (see Conversion Flow section):

```
┌──────────────────────────────────┐
│  [📞 Call Demo]  [📅 Book Demo] │
└──────────────────────────────────┘
```

## Footer Structure

```
┌─────────────────────────────────────────────────────────┐
│  [LOGO]                                                 │
│                                                         │
│  Company          Quick Links        Contact            │
│  --------         -----------        -------            │
│  About            How It Works       Brian's Cell       │
│  Privacy Policy   Pricing            Email              │
│  Terms            Demo               Charlotte, NC      │
│                                                         │
│  ───────────────────────────────────────────────────── │
│  © 2026 Lighthouse 27 LLC · Charlotte, NC               │
│  Locally owned and operated                             │
└─────────────────────────────────────────────────────────┘
```

---
---

# 2. User Journeys

## Path A: Chamber Meeting Prospect

> Brian meets prospect at a Chamber of Commerce event. Prospect Googles the company later on their phone.

```
Chamber meeting → Brian gives pitch + card/sheet
        ↓
   Prospect pulls out phone (likely same day or next morning)
        ↓
   Googles "[BRAND NAME]" or visits URL from card
        ↓
   Lands on HOMEPAGE (mobile)
        ↓
   Reads hero — recognizes what Brian described
        ↓
   Scrolls to Problem section — "yep, that's me"
        ↓
   Sees demo phone number — taps to call (mobile click-to-call)
        ↓
   Hears their own business type answered by AI
        ↓
   Impressed → taps sticky "Book a Demo" bar
        ↓
   Fills short form (name, phone, business type) OR books Calendly
        ↓
   Brian follows up within 24 hours
```

**Key UX requirements for Path A:**
- Homepage must load fast on mobile (< 2 seconds)
- Demo phone number must be tappable (click-to-call) and visible without scrolling
- Form must be dead simple (4 fields max)
- Brian's face/name should appear — they met him in person, recognition builds trust

---

## Path B: Cold Google Visitor

> Prospect searches "AI phone answering service Charlotte" or "never miss a business call" and finds the site organically or via future ad.

```
Google search → Clicks result or ad
        ↓
   Lands on HOMEPAGE (desktop or mobile)
        ↓
   Hero grabs attention — "$1,200 every missed call"
        ↓
   Scrolls through problem section — feels the pain
        ↓
   Reads solution — "15 minutes, no contracts"
        ↓
   Sees pricing preview — "starts at $199"
        ↓
   Needs more convincing → clicks "How It Works"
        ↓
   Reads step-by-step walkthrough with scenario
        ↓
   Clicks "Try the Demo" → calls the number
        ↓
   Calls demo → hears AI answer → impressed
        ↓
   Returns to site → clicks "Book a Demo" / fills form
        ↓
   Brian follows up
```

**Key UX requirements for Path B:**
- Hero headline must stop the scroll (pain-point driven)
- Page must answer "what is this?" within 5 seconds
- Social proof needed early (even placeholder-style at launch)
- Pricing must be transparent — this audience hates hidden pricing
- Multiple CTAs throughout the page (not just top and bottom)

---

## Path C: Pitch Sheet / QR Code

> Prospect received a printed pitch sheet from Brian. Scans QR code later.

```
Scans QR code on pitch sheet
        ↓
   Lands on /demo page (dedicated demo landing)
        ↓
   Sees: "Hear Your AI Assistant Live — Call Now"
        ↓
   Big phone number, big "Call Now" button
        ↓
   Calls demo number → hears AI answer
        ↓
   Returns to page → sees "Ready to get started?"
        ↓
   Quick form (name, phone, biz) or "Call Brian" button
        ↓
   Brian follows up
```

**Key UX requirements for Path C:**
- QR code links to `/demo`, NOT homepage
- `/demo` page is stripped down — one job: get them to call the demo number
- No navigation distractions on this page (minimal chrome)
- After the call, the page should have a clear next step
- Must work perfectly on mobile (100% of QR scanners use phones)

---
---

# 3. Homepage Wireframe

> [!warning] The Most Important Page
> The homepage is where 80% of conversions will happen. Every block is intentional.
> The page follows a direct-response structure: Pain → Agitate → Solution → Proof → CTA.

## Content Blocks (Top to Bottom)

### Block 1: Sticky Navigation Bar

```
DESKTOP:
┌──────────────────────────────────────────────────────────────┐
│ [LOGO]    How It Works  Pricing  About  Demo  [Book Demo →] │
└──────────────────────────────────────────────────────────────┘

MOBILE:
┌────────────────────────────────┐
│ [LOGO]                [≡]     │
└────────────────────────────────┘
```

- **Sticky** on scroll (both desktop and mobile)
- Background becomes opaque/blurred on scroll
- CTA button always visible in nav
- Height: 64px desktop, 56px mobile

---

### Block 2: Hero Section

```
DESKTOP:
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   Stop Losing $1,200 Every         ┌──────────────────┐    │
│   Time Your Phone Rings             │                  │    │
│   and Nobody Picks Up                │  [Hero Image:   │    │
│                                      │   Phone ringing  │    │
│   Your customers are calling now.    │   on desk, or    │    │
│   If you don't answer, your          │   Brian on       │    │
│   competitor will. [BRAND] picks     │   phone smiling] │    │
│   up every call — 24/7.             │                  │    │
│                                      └──────────────────┘    │
│   [Book a Free Demo →]                                       │
│                                                              │
│   Setup: 15 min · No contracts · Cancel anytime              │
│                                                              │
│   ── or try it right now ──                                  │
│   Call the demo: (704) XXX-XXXX                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘

MOBILE (stacked):
┌────────────────────────────────┐
│                                │
│  Stop Losing $1,200 Every     │
│  Time Your Phone Rings        │
│  and Nobody Picks Up          │
│                                │
│  Your customers are calling    │
│  now. If you don't answer,    │
│  your competitor will.        │
│                                │
│  [Book a Free Demo →]         │
│                                │
│  15 min setup · No contracts  │
│                                │
│  ── or try it now ──          │
│  [📞 Call Demo: (704) XXX]    │
│                                │
│  ┌──────────────────────┐     │
│  │   [Hero Image]       │     │
│  └──────────────────────┘     │
│                                │
└────────────────────────────────┘
```

**Specifications:**
- Headline: H1, largest text on page (36px mobile / 56px desktop)
- Subheadline: 18px mobile / 20px desktop, muted color
- Primary CTA: large button, high contrast, full-width on mobile
- Demo phone number: styled as a tappable link on mobile (`tel:` href)
- Supporting line: small, gray, reduces perceived risk
- Hero image: right-aligned on desktop, below CTA on mobile
- Background: subtle gradient or solid light color. No busy patterns.
- **No video autoplay in the hero.** Keep it fast and clean.

---

### Block 3: Quick Trust Bar

```
┌──────────────────────────────────────────────────────────────┐
│  🏠 Locally Owned    ⚡ 15-Min Setup    🔒 30-Day Guarantee    📞 24/7  │
└──────────────────────────────────────────────────────────────┘
```

- Horizontal strip, 4 trust signals with small icons
- Light background to visually separate from hero
- On mobile: 2x2 grid instead of horizontal row
- Purpose: immediate credibility before they read anything else

---

### Block 4: Problem Section

```
DESKTOP & MOBILE (full-width, dark or contrasting background):
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  You're Bleeding Money Every Time                            │
│  Your Phone Goes to Voicemail                                │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │   62%    │  │   85%    │  │  $1,200  │                  │
│  │ of calls │  │ never    │  │ lost per │                  │
│  │ missed   │  │ call back│  │ missed   │                  │
│  └──────────┘  └──────────┘  │ call     │                  │
│                               └──────────┘                  │
│                                                              │
│  [2-3 short paragraphs from copy — the story about being    │
│   on a ladder, in a meeting, at dinner]                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Three stat cards in a row (desktop) or stacked (mobile)
- Large numbers (48px+) with supporting text below
- Stats should feel alarming — use red or warning accent color
- Body text: 16px, comfortable line height (1.6)
- Dark or contrasting background to create visual break
- On mobile: stat cards become a horizontal scroll or 1-column stack

---

### Block 5: Solution Section

```
DESKTOP:
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  What If Every Call Got Answered —                            │
│  Without Hiring Anyone?                                      │
│                                                              │
│  ┌─────┐  ┌─────────────────────────────────────────┐       │
│  │  1  │  │ We set up your AI assistant (15 min)    │       │
│  └─────┘  └─────────────────────────────────────────┘       │
│  ┌─────┐  ┌─────────────────────────────────────────┐       │
│  │  2  │  │ Calls get answered instantly, 24/7      │       │
│  └─────┘  └─────────────────────────────────────────┘       │
│  ┌─────┐  ┌─────────────────────────────────────────┐       │
│  │  3  │  │ You get a text with the details          │       │
│  └─────┘  └─────────────────────────────────────────┘       │
│                                                              │
│  No apps. No dashboards. No staff. Just more jobs.           │
│                                                              │
│  [See It In Action — Book a Demo →]                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Specifications:**
- 3-step process with numbered circles (large, colored)
- Each step: number + headline + 1-2 sentence description
- Clean white/light background
- CTA button after the 3 steps
- On mobile: steps stack vertically (they already read well this way)
- Optional: small illustration or icon next to each step

---

### Block 6: Features / Benefits Grid

```
DESKTOP (2-column grid):
┌──────────────────────────┐  ┌──────────────────────────┐
│ [icon] 24/7 Answering    │  │ [icon] Natural AI Voice  │
│ Nights, weekends,        │  │ Callers think it's a     │
│ holidays covered.        │  │ real person.             │
└──────────────────────────┘  └──────────────────────────┘
┌──────────────────────────┐  ┌──────────────────────────┐
│ [icon] Instant Booking   │  │ [icon] SMS Lead Alerts   │
│ Books into your          │  │ Every lead, texted to    │
│ calendar directly.       │  │ you instantly.           │
└──────────────────────────┘  └──────────────────────────┘
┌──────────────────────────┐  ┌──────────────────────────┐
│ [icon] Custom Training   │  │ [icon] Bilingual         │
│ Knows your biz like     │  │ English + Spanish.       │
│ your best employee.     │  │ Don't lose those jobs.   │
└──────────────────────────┘  └──────────────────────────┘

MOBILE (1-column):
┌──────────────────────────────┐
│ [icon] 24/7 Answering        │
│ Nights, weekends, holidays.  │
├──────────────────────────────┤
│ [icon] Natural AI Voice      │
│ Callers can't tell.         │
├──────────────────────────────┤
│ ...                          │
└──────────────────────────────┘
```

**Specifications:**
- 6 feature cards, 2-column grid on desktop, 1-column on mobile
- Each card: icon (top-left or centered) + headline + 1-2 lines
- Keep descriptions SHORT. This audience skims.
- Subtle card styling (light border or shadow, not heavy)
- No "read more" links — everything visible immediately

---

### Block 7: Demo CTA Section (Mid-Page Conversion Point)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Hear It For Yourself — Call the Demo Right Now              │
│                                                              │
│  ┌────────────────────────────────────────┐                  │
│  │                                        │                  │
│  │      📞  (704) XXX-XXXX               │                  │
│  │                                        │                  │
│  │      [Call the Demo Now →]             │                  │
│  │                                        │                  │
│  └────────────────────────────────────────┘                  │
│                                                              │
│  Call this number and hear an AI assistant answer as if      │
│  it were YOUR business. Takes 60 seconds.                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Full-width, high-contrast background (brand color or dark)
- Phone number: LARGE (32px+ mobile, 48px+ desktop)
- Click-to-call on mobile
- This is the most important conversion block on the page
- Positioned after they understand the value but before pricing/proof
- Short supporting text explaining what happens when they call

---

### Block 8: Social Proof Section

```
DESKTOP:
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  What Local Business Owners Are Saying                       │
│                                                              │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐  │
│  │ "First week,   │ │ "My old        │ │ "I couldn't    │  │
│  │  I booked 4    │ │  answering     │ │  tell it       │  │
│  │  jobs I would  │ │  service cost  │ │  wasn't a      │  │
│  │  have lost."   │ │  $400/mo..."   │ │  person."      │  │
│  │                │ │                │ │                │  │
│  │ — Name         │ │ — Name         │ │ — Name         │  │
│  │   Biz, Mint    │ │   Biz,         │ │   Biz,         │  │
│  │   Hill NC      │ │   Matthews NC  │ │   Waxhaw NC    │  │
│  └────────────────┘ └────────────────┘ └────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Powered by Telnyx Voice AI · Enterprise-grade       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Specifications:**
- 3 testimonial cards side by side on desktop, horizontal scroll or stack on mobile
- Each card: quote (in quotation marks), name, business type, location
- **At launch:** use placeholder testimonials (marked internally) or collect 2-3 beta users before go-live
- "Powered by Telnyx" badge provides tech credibility without Brian needing his own
- If no real testimonials yet, use the "social proof alternatives" from Trust Architecture section below

---

### Block 9: Pricing Preview

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Simple Pricing. No Surprises.                               │
│                                                              │
│  ┌────────────┐  ┌─────────────────┐  ┌────────────┐       │
│  │  Starter   │  │  Professional   │  │ Enterprise │       │
│  │  $199/mo   │  │  $299/mo ★      │  │  $499/mo   │       │
│  │  200 min   │  │  500 min        │  │  Unlimited │       │
│  │            │  │  + Bilingual    │  │  + Dedicated│       │
│  │            │  │  + CRM          │  │    Manager  │       │
│  │ [Start →]  │  │  [Start →]      │  │ [Call →]    │       │
│  └────────────┘  └─────────────────┘  └────────────┘       │
│                                                              │
│  Every plan: 24/7 answering · SMS alerts · Call recordings  │
│  30-day money-back guarantee · No contracts                 │
│                                                              │
│  [See Full Pricing Details →]                                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Specifications:**
- 3-column layout on desktop, horizontal scroll or vertical stack on mobile
- Professional plan visually emphasized (border, "Most Popular" badge, slight scale-up)
- Show price + 2-3 key differentiators per plan. Not full feature list.
- Link to full `/pricing` page for details
- "30-day money-back guarantee" line below the cards
- On mobile: show Professional first (most popular), then Starter, then Enterprise

---

### Block 10: FAQ Section (Collapsed Accordion)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Questions We Get All the Time                               │
│                                                              │
│  ▶ Does it really sound like a real person?                  │
│  ▶ What if the caller has a question AI can't handle?       │
│  ▶ How long does setup take?                                 │
│  ▶ Will my customers know it's AI?                          │
│  ▶ Can I keep my existing phone number?                     │
│  ▶ Is there a contract?                                     │
│  ▶ How is this different from a regular answering service?  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Accordion — collapsed by default, click to expand
- Show 6-8 most common questions (not all from the copy — save some for pricing page)
- Use `<details>/<summary>` HTML elements for no-JS progressive enhancement
- Each answer: 2-4 sentences max on the homepage version
- On mobile: full-width, generous tap targets (48px+ height per question row)

---

### Block 11: Final CTA Section

```
┌──────────────────────────────────────────────────────────────┐
│                  (dark/brand background)                      │
│                                                              │
│  Every Missed Call Is a Customer                             │
│  Who Chose Someone Else                                      │
│                                                              │
│  [BRAND NAME] fixes this in 15 minutes.                      │
│  No hiring. No training. No contracts.                       │
│                                                              │
│  [Book Your Free Demo →]                                     │
│                                                              │
│  Or call Brian directly: (704) XXX-XXXX                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Full-width, high-contrast background (dark or brand primary)
- Emotional headline + logical supporting line
- Primary CTA button + Brian's direct number
- This is the "last chance" conversion point before footer
- On mobile: CTA button full-width, phone number click-to-call

---

### Block 12: Footer

(See footer structure from Site Map section above)

---

### Block 13: Mobile Sticky Bottom Bar (Mobile Only)

```
┌──────────────────────────────────┐
│ [📞 Call Demo]  [📅 Book Demo]  │
└──────────────────────────────────┘
```

**Specifications:**
- Fixed to bottom of viewport on mobile only
- Two buttons, equal width, side by side
- "Call Demo" = `tel:` link to demo phone number
- "Book Demo" = scrolls to form or links to `/contact`
- Semi-transparent background with backdrop blur
- Appears after user scrolls past the hero section (not immediately)
- 56px tall, generous touch targets
- Z-index above all content but below modals

---
---

# 4. Pricing Page Wireframe

## Content Blocks (Top to Bottom)

### Block 1: Pricing Hero

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Simple Pricing. No Surprises. No Contracts.                 │
│                                                              │
│  Every plan pays for itself with 1-2 extra jobs per month.   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

- Clean, centered text
- No image needed — let the pricing speak

---

### Block 2: Plan Cards (Primary Content)

```
DESKTOP (3-column):
┌──────────────────┐  ┌───────────────────────┐  ┌──────────────────┐
│    STARTER       │  │    PROFESSIONAL ★     │  │    ENTERPRISE    │
│    $199/mo       │  │    $299/mo            │  │    $499/mo       │
│                  │  │    Most Popular        │  │                  │
│  Best for solo   │  │  Best for growing     │  │  Best for multi- │
│  operators       │  │  businesses           │  │  location        │
│                  │  │                       │  │                  │
│  ✓ 200 min      │  │  ✓ 500 min           │  │  ✓ Unlimited    │
│  ✓ 24/7         │  │  ✓ 24/7              │  │  ✓ 24/7         │
│  ✓ SMS alerts   │  │  ✓ SMS alerts        │  │  ✓ SMS alerts   │
│  ✓ Booking      │  │  ✓ Booking           │  │  ✓ Booking      │
│  ✓ Recordings   │  │  ✓ Recordings        │  │  ✓ Recordings   │
│  ✓ Basic AI     │  │  ✓ Advanced AI       │  │  ✓ Premium AI   │
│                  │  │  ✓ Bilingual         │  │  ✓ Bilingual    │
│                  │  │  ✓ CRM Integration   │  │  ✓ CRM          │
│                  │  │                       │  │  ✓ Multi-loc    │
│                  │  │                       │  │  ✓ Dedicated AM │
│                  │  │                       │  │                  │
│ [Start Trial →]  │  │ [Start Trial →]       │  │ [Contact Brian] │
└──────────────────┘  └───────────────────────┘  └──────────────────┘
```

**Specifications:**
- Professional plan visually larger/highlighted (scaled up, colored border, badge)
- All checkmarks aligned vertically across cards for easy scanning
- Missing features shown as blank space (NOT crossed out — that feels negative)
- CTA buttons at bottom of each card
- On mobile: vertical stack, Professional on top

---

### Block 3: "Which Plan Is Right For Me?" Guide

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Not sure? Here's a quick guide:                             │
│                                                              │
│  ┌──────────────────────────────────────┐                    │
│  │  Solo operator, < 50 calls/mo → Starter                │  │
│  │  Small team, 50-200 calls/mo → Professional            │  │
│  │  Multi-location, 200+ calls → Enterprise               │  │
│  └──────────────────────────────────────┘                    │
│                                                              │
│  Still not sure? Book a demo — Brian will recommend          │
│  the right plan based on your call volume. No pressure.      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### Block 4: Competitor Comparison Table

Full comparison table from the copy (see website-copy.md Section 3).

**Specifications:**
- Responsive table: on mobile, use a scrollable container or restructure as cards
- [BRAND NAME] column highlighted with brand color background
- Checkmarks for yes, dashes for no, specific values where relevant
- Competitors listed: Ruby, Smith.ai, Dialzara, Traditional Answering Service

---

### Block 5: Money-Back Guarantee

```
┌──────────────────────────────────────────────────────────────┐
│                    (green/success background)                 │
│                                                              │
│  ✅ 30-Day Money-Back Guarantee                              │
│                                                              │
│  If [BRAND NAME] doesn't pay for itself in 30 days,         │
│  full refund. No forms, no hoops. That's a handshake         │
│  promise from a local guy.                                   │
│                                                              │
│  [Start Risk-Free →]                                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### Block 6: FAQ (Pricing-Specific)

Accordion with pricing-related questions:
- What happens if I go over my minutes?
- Can I switch plans?
- Is there a contract?
- Do you offer annual discounts?

---

### Block 7: Final CTA

Same pattern as homepage Block 11.

---
---

# 5. How It Works Page Wireframe

## Content Blocks (Top to Bottom)

### Block 1: Hero

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  From Missed Call to Booked Job in 60 Seconds                │
│                                                              │
│  No apps. No hardware. No staff. Just a phone that           │
│  finally gets answered.                                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### Block 2: Real Scenario Walkthrough

This is the hero content of this page — the plumber-at-9pm story from the copy. Laid out as a visual comparison:

```
DESKTOP:
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌─────────────────────┐    ┌─────────────────────────┐     │
│  │  WITHOUT [BRAND]    │    │  WITH [BRAND]           │     │
│  │                     │    │                         │     │
│  │  Phone rings        │    │  Phone rings            │     │
│  │  → Voicemail        │    │  → AI answers instantly │     │
│  │  → Caller hangs up  │    │  → Natural conversation │     │
│  │  → Calls competitor │    │  → Appointment booked   │     │
│  │  → You never know   │    │  → You get a text       │     │
│  │                     │    │                         │     │
│  │  ❌ $1,500 lost     │    │  ✅ $1,500 earned       │     │
│  └─────────────────────┘    └─────────────────────────┘     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Side-by-side comparison (desktop), stacked with clear labels (mobile)
- Left side: red/muted tones. Right side: green/positive tones.
- Dollar amount at bottom creates a visceral comparison

---

### Block 3: The 4 Steps (Detailed)

Each step from the copy gets its own full-width section with alternating layout:

```
STEP 1:
┌──────────────────────────────────────────────────────────────┐
│  ┌────────────────────┐                                      │
│  │                    │   Step 1: AI Answers Instantly        │
│  │  [Screenshot of    │                                      │
│  │   incoming call]   │   "Hi, thanks for calling [Business]!│
│  │                    │    This is Sarah. How can I help?"    │
│  └────────────────────┘                                      │
│                           Not a robot. Not a menu. A natural │
│                           voice that greets by your name.    │
└──────────────────────────────────────────────────────────────┘

STEP 2 (alternating - image right):
┌──────────────────────────────────────────────────────────────┐
│                           ┌────────────────────┐             │
│   Step 2: AI Has a        │                    │             │
│   Real Conversation       │  [Screenshot of    │             │
│                           │   transcript]      │             │
│   Captures name, phone,   │                    │             │
│   what they need, books   └────────────────────┘             │
│   the appointment.                                           │
└──────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Alternating image/text layout on desktop (image left, image right, etc.)
- On mobile: image above text, stacked
- Screenshots or illustrations for each step (placeholders at launch)
- Conversational quotes in a "speech bubble" or "chat transcript" style

---

### Block 4: Setup Process

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Setup Is Stupid Simple                                      │
│                                                              │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                    │
│  │ 10m  │  │ 15m  │  │  2m  │  │  GO  │                    │
│  │ Book │→│Train │→│Forward│→│ Live │                    │
│  │ demo │  │  AI  │  │calls │  │      │                    │
│  └──────┘  └──────┘  └──────┘  └──────┘                    │
│                                                              │
│  Total: under 30 minutes from "yes" to live.                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

- Horizontal progress bar / timeline on desktop
- Vertical timeline on mobile
- Each step: time estimate + 1-line description

---

### Block 5: Integrations

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Works With Your Existing Tools                              │
│                                                              │
│  [Google Cal]  [Calendly]  [Jobber]  [ServiceTitan]         │
│  [HousecallPro]  [Your Phone Number]                        │
│                                                              │
│  No new software to learn.                                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

- Logo grid of supported integrations
- On mobile: 3-column grid of logos
- "Your phone number stays the same" emphasized

---

### Block 6: Demo CTA + Final CTA

Same pattern as homepage Blocks 7 and 11.

---
---

# 6. About Page Wireframe

## Content Blocks (Top to Bottom)

### Block 1: About Hero

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Built in Charlotte. For Charlotte.                          │
│                                                              │
│  I Got Tired of Watching Local Businesses                    │
│  Lose Money to Voicemail                                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### Block 2: Brian's Story (with Photo)

```
DESKTOP:
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌──────────────┐                                            │
│  │              │   My name's Brian Mangum. I live here in   │
│  │  [Photo of   │   Charlotte, and I've spent the last few  │
│  │   Brian -    │   years building software that helps      │
│  │   headshot   │   small businesses make more money.       │
│  │   or casual  │                                           │
│  │   business]  │   Here's how [BRAND NAME] started...      │
│  │              │                                           │
│  └──────────────┘   [Full story from copy]                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Brian's photo is CRITICAL for this page. Headshot or casual business photo.
- Photo on left (desktop), above story (mobile)
- Story told in first person, conversational tone
- Break into short paragraphs (3-4 sentences each)
- Key stat callouts (62%, 85%) can be pull-quotes or highlighted

---

### Block 3: Values / What I Believe

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌───────────────────┐  ┌───────────────────┐               │
│  │ Your time is      │  │ Technology should │               │
│  │ worth more than   │  │ be invisible.     │               │
│  │ answering phones. │  │                   │               │
│  └───────────────────┘  └───────────────────┘               │
│  ┌───────────────────┐  ┌───────────────────┐               │
│  │ If it doesn't     │  │ Local matters.    │               │
│  │ pay for itself,   │  │ When you grow,    │               │
│  │ it's not worth it.│  │ my community      │               │
│  └───────────────────┘  │ grows.            │               │
│                          └───────────────────┘               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

- 2x2 grid of value cards on desktop, vertical stack on mobile
- Bold statement as headline, 1-line explanation below
- Light card styling

---

### Block 4: Trust Signals Grid

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Locally owned — Charlotte, NC · Lighthouse 27 LLC          │
│  Real person support — Brian's cell, not a ticket queue     │
│  No contracts — Month-to-month, cancel anytime              │
│  Money-back guarantee — 30 days, full refund                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### Block 5: CTA

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Meet Brian — Book a Demo and Put a Face to the Name        │
│                                                              │
│  [Book a Demo →]                                             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---
---

# 7. Demo Experience Design

> [!warning] Critical Section
> The demo experience is the #1 conversion tool. A prospect who calls the demo number
> and hears the AI answer is 5-10x more likely to convert than one who only reads the website.

## How a Visitor Tries the AI

**Primary method: Call a phone number.**

This is the right approach for this audience because:
1. The product IS a phone service — let them experience it via phone
2. Non-tech audience. No web widgets, no chat demos, no app downloads.
3. It's impressive. Hearing a natural AI voice answer "your business" is the "wow moment."
4. It's memorable. They'll tell their spouse about it.

**NOT recommended for launch:**
- Web-based voice widget (adds complexity, not how the product actually works)
- Chat demo (wrong modality — this is a PHONE product)
- Pre-recorded audio samples (passive, not experiential)

## Demo Phone Number Strategy

```
┌─────────────────────────────────────────────────┐
│  DEMO LINE ARCHITECTURE                         │
│                                                 │
│  One demo number: (704) XXX-XXXX                │
│  Configured to answer as a generic business:    │
│                                                 │
│  "Hi, thanks for calling! This is Sarah with    │
│   [Generic Business Name]. How can I help?"     │
│                                                 │
│  The AI should:                                 │
│  1. Greet naturally                             │
│  2. Ask what they need help with                │
│  3. Answer 2-3 basic questions                  │
│  4. Book a fake appointment                     │
│  5. Say goodbye professionally                  │
│                                                 │
│  Total demo call: 45-90 seconds                 │
└─────────────────────────────────────────────────┘
```

> [!tip] Pro Move
> For in-person demos, Brian can configure the demo line to answer as the PROSPECT'S
> business name. This is the "wow" moment. "Call this number and hear YOUR business
> answered by AI." The copy already references this in the sales scripts.

## What Happens After They Try the Demo

```
Prospect calls demo number
        ↓
   AI answers, has 60-second conversation
        ↓
   Call ends → prospect returns to website (or is still with Brian)
        ↓
   ONLINE: /demo page shows "Impressed? Let's set this up for YOUR business."
        ↓
   Short form: Name, Phone, Business Name, Business Type
        ↓
   Brian gets notified → follows up within 24 hours
        ↓
   OR: Calendly embed to book a setup call
```

## /demo Page Design

This page has ONE JOB: get the visitor to call the demo number.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Hear Your AI Assistant — Live, Right Now                    │
│                                                              │
│  ┌────────────────────────────────────────┐                  │
│  │                                        │                  │
│  │        📞  (704) XXX-XXXX             │                  │
│  │                                        │                  │
│  │        [Call Now →]                    │                  │
│  │                                        │                  │
│  └────────────────────────────────────────┘                  │
│                                                              │
│  What to expect:                                             │
│  1. An AI assistant will answer the phone                    │
│  2. It will greet you and ask how it can help                │
│  3. Try asking about services, hours, or booking             │
│  4. The whole thing takes about 60 seconds                   │
│                                                              │
│  ─────────────────────────────────────────                   │
│                                                              │
│  Impressed? Let's set this up for YOUR business.             │
│                                                              │
│  ┌────────────────────────────────────┐                      │
│  │  Name:     [________________]     │                      │
│  │  Phone:    [________________]     │                      │
│  │  Business: [________________]     │                      │
│  │  Type:     [v Plumber       ]     │                      │
│  │                                    │                      │
│  │  [Get Started →]                   │                      │
│  └────────────────────────────────────┘                      │
│                                                              │
│  Or call Brian: (704) XXX-XXXX                               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Minimal navigation (logo + maybe "Back to Home")
- NO distracting content — this is a focused landing page
- Phone number: biggest element on the page
- "What to expect" sets expectations and reduces call anxiety
- Form appears BELOW the demo CTA (post-call conversion)
- QR code on pitch sheet links directly here

---
---

# 8. Contact / Get Started Page Wireframe

## Content Blocks (Top to Bottom)

### Block 1: Hero

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Let's Get Your Phone Answered                               │
│                                                              │
│  Pick whichever works for you — book a time, fill out        │
│  the form, or just call Brian directly.                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Block 2: Three Contact Options (Side by Side)

```
DESKTOP:
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  📅              │  │  📋              │  │  📞              │
│  Book a Time     │  │  Send a Message  │  │  Call Brian      │
│                  │  │                  │  │                  │
│  Pick a slot on  │  │  Fill out the    │  │  (704) XXX-XXXX  │
│  Brian's         │  │  form below and  │  │                  │
│  calendar.       │  │  he'll reach out │  │  He answers his  │
│  10-min demo.    │  │  within 24 hours.│  │  own phone.      │
│                  │  │                  │  │                  │
│  [Book Now →]    │  │  [Jump to Form ↓]│  │  [Call Now →]    │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

**Specifications:**
- Three equal cards on desktop, vertical stack on mobile
- "Book a Time" = Calendly embed or link
- "Send a Message" = anchor link to form below
- "Call Brian" = click-to-call on mobile

### Block 3: Contact Form

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Tell Us About Your Business                                 │
│                                                              │
│  Name:           [________________________]                  │
│  Phone:          [________________________]                  │
│  Email:          [________________________]                  │
│  Business Name:  [________________________]                  │
│  Business Type:  [v Select...            ]                  │
│                  │ Plumber                │                  │
│                  │ HVAC                   │                  │
│                  │ Electrician            │                  │
│                  │ Dentist                │                  │
│                  │ Attorney               │                  │
│                  │ Contractor             │                  │
│                  │ Auto Shop              │                  │
│                  │ Salon                  │                  │
│                  │ Other                  │                  │
│                  └────────────────────────┘                  │
│  Anything else?  [________________________]                  │
│                  [________________________]                  │
│                                                              │
│  [Get Started →]                                             │
│                                                              │
│  We'll reach out within 24 hours. Usually same day.         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Specifications:**
- 6 fields maximum. Every extra field kills conversions.
- Business Type dropdown pre-populates common verticals
- "Anything else?" is optional textarea, collapsed by default on mobile
- Submit button: full-width on mobile
- Success message: "Thanks! Brian will reach out within 24 hours."
- Form submits to Cloudflare Worker (see Technical Specs)

### Block 4: Calendly Embed

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Or Book a Time That Works For You                           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │                                                    │     │
│  │            [Calendly Embed Widget]                 │     │
│  │                                                    │     │
│  │         10-Minute Demo with Brian                  │     │
│  │                                                    │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Calendly inline embed (not popup — clearer for non-tech users)
- Shows Brian's actual availability
- 10-minute slots
- Calendly handles confirmations and reminders

---
---

# 9. Conversion Flow Design

## Primary Flow: Demo Call to Form Fill

```
VISITOR → sees demo phone number (homepage, /demo, pitch sheet)
    ↓
CALLS demo number → hears AI answer their "business"
    ↓
IMPRESSED → returns to website
    ↓
FILLS form (name, phone, business) → OR books Calendly slot
    ↓
BRIAN follows up within 24 hours → closes in person or on phone
```

**Where the demo number appears:**
1. Homepage hero section (Block 2)
2. Homepage mid-page demo CTA (Block 7)
3. /demo page (primary element)
4. Mobile sticky bar (persistent)
5. Pitch sheet (printed QR code + phone number)
6. Email signature
7. Business card

## Secondary Flow: Direct Calendar Booking

```
VISITOR → reads enough to be convinced
    ↓
CLICKS "Book a Demo" button (any page)
    ↓
LANDS on /contact → sees Calendly embed
    ↓
BOOKS 10-minute slot → receives confirmation email
    ↓
BRIAN calls at scheduled time → does live demo → closes
```

## Exit Intent Strategy

> [!warning] Be careful with exit intent on mobile.
> Mobile doesn't support mouse-based exit detection. Use scroll-based triggers instead.

**Desktop exit intent popup:**
```
┌──────────────────────────────────────────────────┐
│                                                  │
│  Before You Go —                                 │
│  Hear the AI Answer YOUR Phone                   │
│                                                  │
│  Call this number right now. 60 seconds.          │
│  No signup required.                             │
│                                                  │
│        📞  (704) XXX-XXXX                        │
│                                                  │
│  [No thanks, I'll keep missing calls]            │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Specifications:**
- Trigger: mouse moves toward browser close/back button
- Only shows ONCE per session (cookie-based)
- Dismiss link text uses light guilt ("I'll keep missing calls")
- Does NOT ask for email. Just pushes the demo call.
- On mobile: do NOT use exit intent popup. Instead, rely on the sticky bottom bar.

## Mobile-Specific CTAs

| Location | CTA Type | Action |
|----------|----------|--------|
| Hero section | "Call Demo" button | `tel:` link |
| Sticky bottom bar | "Call Demo" + "Book Demo" | `tel:` link + `/contact` |
| Mid-page demo block | "Call Demo" button | `tel:` link |
| Final CTA | "Call Brian" link | `tel:` link to Brian's number |
| Every phone number on page | Tappable | Automatic via `tel:` href |

> [!tip] Mobile Click-to-Call Priority
> On mobile, EVERY phone number must be wrapped in a `tel:` link.
> This audience will tap-to-call instinctively. Never display a phone number
> as plain text on mobile.

---
---

# 10. Trust Architecture

## Progressive Trust Building

The visitor sees trust signals in this order, mapped to their psychological state:

| Stage | Visitor Thinking | Trust Signal | Location |
|-------|-----------------|--------------|----------|
| **1. Arrival** | "What is this?" | Clear headline + professional design | Hero |
| **2. Curiosity** | "Is this legit?" | Trust bar (Locally Owned, 15-min setup, Guarantee, 24/7) | Below hero |
| **3. Interest** | "Does this actually work?" | Stats (62%, 85%, $1,200) + solution walkthrough | Problem/Solution blocks |
| **4. Consideration** | "Can I hear it?" | Demo phone number — experiential proof | Mid-page CTA |
| **5. Evaluation** | "Who's behind this?" | Brian's photo, story, local angle | Social proof block |
| **6. Comparison** | "How does pricing compare?" | Transparent pricing + competitor table | Pricing preview |
| **7. Decision** | "What if it doesn't work?" | 30-day money-back guarantee | Below pricing |
| **8. Action** | "How do I start?" | Simple form + Calendly + Brian's direct number | Final CTA |

## Trust Signals Inventory

### Tier 1: Always Visible (Header/Footer/Sticky)

- "Locally owned in Charlotte, NC"
- Brian's direct phone number
- "No contracts — cancel anytime"

### Tier 2: Homepage Above-the-Fold

- Professional design (quality = credibility)
- Clear, specific headline (not vague/corporate)
- "15-minute setup" (low commitment)
- "30-day money-back guarantee" (risk reversal)

### Tier 3: Social Proof

- **At launch (before real testimonials):**
  - "Powered by Telnyx Voice AI — Enterprise-grade reliability" (borrowed credibility)
  - Brian's personal story + photo (human connection)
  - Specific Charlotte-area references (Mint Hill, Matthews, Waxhaw — proves local)
  - "Lighthouse 27 LLC" (real business, not a fly-by-night)
  - Integration logos (Google Calendar, ServiceTitan, etc.)

- **After first 5 customers:**
  - Real testimonials with name, business, location
  - Specific results ("booked 4 extra jobs first week")
  - Photos of real local businesses (with permission)

- **After 20+ customers:**
  - Case study page with detailed before/after
  - Video testimonials
  - "X businesses in Charlotte trust [BRAND NAME]"

### Tier 4: Technical Trust

- "Powered by Telnyx Voice AI" badge
- "Call recordings available" (transparency)
- "Your phone number stays the same" (no disruption)
- "Setup in 15 minutes" (low barrier)
- Privacy policy and terms of service links

### Tier 5: Risk Reversal

- 30-day money-back guarantee (mentioned 3+ times across site)
- No contracts
- "If it doesn't pay for itself, walk away"
- "Cancel with a quick email"

## Social Proof Before Having Testimonials

> [!warning] Launch Challenge
> You cannot have testimonials on day one. Here is the plan:

**Phase 1 (Launch — 0 customers):**
- Brian's personal story and photo (About page)
- "Powered by Telnyx" tech credibility
- Local area references (Charlotte, Mint Hill, etc.)
- Demo phone number (the product IS the proof)
- Integration logos
- 30-day guarantee (risk reversal replaces social proof)

**Phase 2 (First 5 customers):**
- Reach out to early customers for quotes
- Even 1 real testimonial with a local business name is powerful
- Add to homepage social proof section

**Phase 3 (10+ customers):**
- Three testimonials from different industries
- Start building case studies
- Add "X local businesses trust [BRAND NAME]" counter

---
---

# 11. Technical Specs

## Astro Page Structure

```
site-ai-tech-co/
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro        # HTML head, nav, footer, meta
│   ├── components/
│   │   ├── Nav.astro                # Sticky navigation
│   │   ├── MobileBottomBar.astro    # Sticky mobile CTA bar
│   │   ├── Hero.astro               # Reusable hero pattern
│   │   ├── TrustBar.astro           # 4-item trust strip
│   │   ├── StatCard.astro           # 62%, 85%, $1,200 cards
│   │   ├── StepCard.astro           # Numbered step cards
│   │   ├── FeatureCard.astro        # Icon + title + description
│   │   ├── TestimonialCard.astro    # Quote + name + business
│   │   ├── PricingCard.astro        # Plan card with features
│   │   ├── FAQ.astro                # Accordion (details/summary)
│   │   ├── ContactForm.astro        # Form with validation
│   │   ├── CalendlyEmbed.astro      # Calendly inline embed
│   │   ├── DemoCTA.astro            # Phone number CTA block
│   │   ├── FinalCTA.astro           # Bottom conversion block
│   │   └── Footer.astro             # Site footer
│   ├── pages/
│   │   ├── index.astro              # Homepage
│   │   ├── pricing.astro            # Pricing page
│   │   ├── how-it-works.astro       # How It Works
│   │   ├── about.astro              # About page
│   │   ├── demo.astro               # Demo landing page
│   │   ├── contact.astro            # Contact / Get Started
│   │   ├── privacy.astro            # Privacy policy
│   │   └── terms.astro              # Terms of service
│   ├── styles/
│   │   └── global.css               # Tailwind + custom styles
│   └── data/
│       └── site-config.json         # Phone numbers, URLs, brand name
├── public/
│   ├── images/                      # Brian's photo, screenshots, logos
│   ├── favicon.svg
│   └── robots.txt
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── CLAUDE.md
```

## Key Components Detail

### ContactForm.astro

- Client-side validation (HTML5 `required`, `type="tel"`, `type="email"`)
- Submit via `fetch()` to Cloudflare Worker endpoint
- Loading state on button during submission
- Success state replaces form with "Thanks! Brian will reach out within 24 hours."
- Error state shows inline message, does NOT clear the form

### MobileBottomBar.astro

- `position: fixed; bottom: 0;` on mobile only (`@media (max-width: 768px)`)
- Two buttons: "Call Demo" (`tel:` link) and "Book Demo" (link to `/contact`)
- Appears after user scrolls past hero (Intersection Observer, minimal JS)
- `backdrop-filter: blur(8px)` for semi-transparent background
- `z-index: 40` (below modals, above all content)
- `padding-bottom: env(safe-area-inset-bottom)` for iPhone notch

### FAQ.astro

- Pure HTML `<details>` / `<summary>` elements (no JavaScript needed)
- Progressive enhancement: works without JS
- Accepts array of `{ question, answer }` as props
- Styled with Tailwind: border-bottom on each item, rotate chevron on open

## Form Handling

**Recommended: Cloudflare Worker endpoint**

```
POST /api/contact
Content-Type: application/json

{
  "name": "Mike Thompson",
  "phone": "704-555-0187",
  "email": "mike@example.com",
  "business": "Thompson Plumbing",
  "type": "plumber",
  "message": "Interested in the Professional plan"
}
```

**Worker responsibilities:**
1. Validate input (server-side)
2. Store in D1 database (leads table)
3. Send SMS notification to Brian via Twilio (or fallback to email via SendGrid)
4. Send confirmation email to prospect
5. Return success/error JSON

**Alternative (simpler, for launch):**
- Calendly for booking (handles everything)
- Formspree or Cloudflare Pages Form for contact form
- Brian gets email notifications

## Analytics & Tracking

| Tool | Purpose | Implementation |
|------|---------|----------------|
| **Cloudflare Web Analytics** | Privacy-friendly page views, referrers | Script tag in BaseLayout |
| **Plausible or Fathom** | Goal tracking, custom events | Alternative to CF Analytics |
| **UTM parameters** | Track which CTAs drive demos | URL parameters on CTA links |
| **Custom events** | Track: demo call CTA clicks, form submits, Calendly bookings | `data-event` attributes + minimal JS |

**Key Events to Track:**
1. `demo_cta_click` — clicked the demo phone number
2. `form_submit` — submitted the contact form
3. `calendly_book` — booked a Calendly slot
4. `pricing_view` — scrolled to pricing section
5. `faq_open` — opened an FAQ item (shows what concerns people have)

**Do NOT add at launch:**
- Google Analytics (overkill, slows page down, privacy concerns)
- Facebook Pixel (no Facebook ads planned)
- Heatmaps (interesting but not actionable yet)

## Page Speed Priorities

| Priority | Action | Impact |
|----------|--------|--------|
| **P0** | No JavaScript frameworks (Astro ships zero JS by default) | Massive |
| **P0** | Optimize images (WebP, proper sizing, lazy loading) | Large |
| **P0** | Inline critical CSS | Medium |
| **P1** | Preconnect to Calendly domain | Small |
| **P1** | Defer non-critical scripts (analytics, Calendly embed) | Medium |
| **P1** | Use system font stack or single variable font (not 3+ font files) | Medium |
| **P2** | Service worker for repeat visits | Small |

**Target Performance:**
- Lighthouse Performance: 95+
- First Contentful Paint: < 1.0s
- Largest Contentful Paint: < 2.0s
- Total Blocking Time: < 100ms
- Cumulative Layout Shift: < 0.05

> [!tip] Astro Advantage
> Astro ships zero JavaScript by default. The only JS on this site should be:
> 1. Mobile bottom bar scroll trigger (Intersection Observer, ~10 lines)
> 2. Exit intent listener (desktop only, ~20 lines)
> 3. Calendly embed script (external, deferred)
> 4. Analytics script (deferred)
> 5. Form submission handler (~30 lines)
>
> Total custom JS budget: < 5KB.

---
---

# 12. Accessibility Checklist

## Color Contrast

| Element | Requirement | Minimum Ratio |
|---------|-------------|---------------|
| Body text on background | WCAG AA | 4.5:1 |
| Large text (24px+ or 18.66px bold) | WCAG AA | 3:1 |
| CTA buttons (text on button background) | WCAG AA | 4.5:1 |
| Links (distinguishable from body text) | WCAG AA | 3:1 + underline or other visual cue |
| Stat cards (numbers on card background) | WCAG AA | 4.5:1 |
| Placeholder text in form fields | WCAG AA | 4.5:1 |

> [!warning] Common Mistake
> Light gray placeholder text in form fields often fails contrast.
> Use a proper label ABOVE the field instead of relying on placeholders.

## Font Sizes

| Element | Minimum Mobile | Minimum Desktop |
|---------|---------------|-----------------|
| Body text | 16px | 16px |
| H1 (hero headline) | 32px | 48px |
| H2 (section headings) | 24px | 32px |
| H3 (card headings) | 18px | 20px |
| Small text (supporting lines) | 14px | 14px |
| CTA button text | 16px | 16px |
| Nav links | 16px | 16px |
| Form labels | 16px | 16px |
| Form inputs | 16px (prevents iOS zoom) | 16px |

> [!warning] iOS Auto-Zoom
> If form `<input>` font size is below 16px, iOS Safari will auto-zoom on focus.
> Always use 16px minimum for input fields.

## Focus States

- All interactive elements (links, buttons, inputs, accordions) must have visible focus outlines
- Use `focus-visible` (not just `focus`) to avoid outlines on mouse clicks
- Focus outline: 2px solid, high-contrast color (brand color or black)
- Tab order must follow visual reading order (top-to-bottom, left-to-right)
- Skip-to-content link as first focusable element (hidden until focused)

**Tailwind implementation:**
```css
/* Base focus styles */
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[brand-color]
```

## Keyboard Navigation

- All FAQ accordions operable via Enter/Space keys (native with `<details>`)
- Mobile menu openable and closable via keyboard
- Form submission via Enter key
- Calendly embed accessible via keyboard (handled by Calendly)
- No keyboard traps (user can always Tab out of any element)

## Alt Text Guidance

| Image Type | Alt Text Strategy |
|------------|-------------------|
| Brian's headshot | "Brian Mangum, founder of [BRAND NAME], Charlotte NC" |
| Hero illustration/photo | Descriptive: "Business owner answering phone at desk" |
| Feature icons | Empty alt="" (decorative, meaning conveyed by text) |
| Integration logos | "Google Calendar logo", "ServiceTitan logo" |
| Screenshots of product | Descriptive: "SMS notification showing new lead details" |
| Background/decorative | Empty alt="" or CSS background-image |

## Additional Accessibility

- `<html lang="en">` on all pages
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- One `<h1>` per page
- Heading hierarchy (no skipping levels)
- Link text is descriptive (not "click here")
- Form fields have associated `<label>` elements (not just placeholder text)
- Error messages associated with fields via `aria-describedby`
- Reduced motion: `@media (prefers-reduced-motion: reduce)` for any animations

---
---

# 13. Competitor Insights Applied

> [!info] Research Basis
> Analyzed: Smith.ai, Ruby.com, Dialzara, Rosie (heyrosie.com), Goodcall
> Key patterns applied to [BRAND NAME]'s UX architecture.

## What Competitors Do Well (Adopted)

| Insight | Competitor Source | How We Applied It |
|---------|-------------------|-------------------|
| **Live demo call** — let prospects call and hear AI answer | Dialzara (866 number) | Demo phone number is our #1 conversion tool |
| **Stats-first credibility** | Smith.ai (5K clients, 20M calls), Goodcall (97% interaction rate) | Problem section stat cards (62%, 85%, $1,200) |
| **Transparent pricing on homepage** | Dialzara ($29-$199), Goodcall | Pricing preview on homepage + full pricing page |
| **7-day or 30-day trial** | Dialzara (7-day), Rosie (7-day) | 30-day money-back guarantee (better for in-person sales) |
| **Industry-specific pages** (P2) | Goodcall (healthcare, HVAC, etc.), Dialzara (80+ industries) | Planned for Phase 2 launch |
| **Self-service signup** | Goodcall ("Get started" 6x on page) | Multiple CTAs throughout every page |
| **Plain-language explanations** | Rosie, Goodcall ("AI phone calls made easy") | Copy already written in non-tech language |

## What Competitors Do Poorly (Avoided)

| Anti-Pattern | Competitor | Our Approach |
|--------------|------------|--------------|
| **Complex navigation with dropdowns** | Smith.ai (6 dropdowns, 30+ links) | 5 nav items, zero dropdowns |
| **No human face / no founder story** | Dialzara, Goodcall | Brian's photo + story is a key differentiator |
| **Pricing hidden or deprioritized** | Goodcall (not on homepage) | Pricing on homepage + dedicated page |
| **Corporate/impersonal tone** | Smith.ai, Ruby | First-person, local-business-owner voice |
| **Feature overload on homepage** | Smith.ai (12+ feature sections) | 6 features max, benefit-focused |
| **Self-service only, no human contact** | Dialzara, Goodcall | Brian's cell number everywhere |
| **Web-based demo (chat widget)** | Goodcall | Phone demo only — matches the actual product |

## Key Differentiator vs. All Competitors

Every competitor studied is a SaaS product selling nationally. [BRAND NAME] is a **local service business**. This changes everything:

| SaaS Competitors | [BRAND NAME] |
|-----------------|--------------|
| Sell via website self-service | Sell in-person, website is support |
| National / anonymous | Charlotte, NC — Brian's face and number |
| Support = ticket queue | Support = Brian's cell phone |
| Trust = logos + stats | Trust = "I'm at every Chamber meeting" |
| Demo = self-service onboard | Demo = call a number + Brian follows up |

This local angle is the UX secret weapon. The website should feel like meeting Brian in person — warm, direct, trustworthy, no-BS.

---
---

> [!success] UX Architecture Complete
> All 13 sections delivered. Ready for design brief to add visual identity
> and for development to begin building pages.
>
> **Key files referenced:**
> - Website copy: `site-ai-tech-co/website-copy.md`
> - This document: `site-ai-tech-co/ux-architecture.md`
>
> **Recommended build order:**
> 1. Homepage (80% of conversions happen here)
> 2. /demo (QR code destination + demo conversion page)
> 3. /contact (form + Calendly — closes the loop)
> 4. /pricing (prospects always check pricing)
> 5. /about (Brian's story — trust builder)
> 6. /how-it-works (detailed walkthrough — can wait for P2)
