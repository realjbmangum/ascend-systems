-- =============================================================================
-- Import: project resources from app-lovenotes → "LoveNotes"
-- Generated: 2026-05-05T16:23:33.730Z
-- Run:  wrangler d1 execute ascend-db --remote --file=worker/db/seeds/2026-05-05-import-app-lovenotes.sql
--
-- 6 resources found.
-- =============================================================================

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'Market Research', '# Market Research: Anniversary & Birthday Concierge

> [!info] Date: 2026-05-02 · For: SendMyLove pivot · Replaces archived `competitive-analysis.md`

The question this research answers: **does anyone already do "scaffold the husband on his big dates" as a product, and if not, why hasn''t someone obvious moved into the gap?**

Short answer: **no one is in this exact slot.** The closest competitors split into four buckets, none of which serve the husband-as-buyer for his own marriage''s calendar in a year-round, scaffolding-not-replacing way. The gap is real and defensible.

---

## 1. The four competitor buckets

### 1.1 Couples relationship apps (require both partners)

| Player | Pricing | What it does | Why it doesn''t compete |
|---|---|---|---|
| **Paired** | $14.99/mo or $59.99/yr | Daily questions + quizzes for both partners. ~$2.4M ARR, 8M downloads, $7.32M raised, 4.7★ on App Store | Requires the wife to participate. Husband can''t drive value alone. Different job (improvement work, not event execution). |
| **Lasting** (Talkspace) | $29.99/mo | Therapy-adjacent self-guided counseling | Feels like homework. Targets couples in distress, not "I want to nail her birthday." |
| **Lovewick** | Free (ads) | Question app, date ideas | Free product, no monetization moat |
| **Happy Couple** | $4.99/mo | Daily quiz on partner knowledge | Different job; both partners required |
| **Cupla** | Free | Shared calendar | Not occasion-aware; commodity calendar |

**The lesson:** every couples app dies if one partner stops engaging. Husband-driven solo products have no head-to-head competitor in this category.

### 1.2 Gift concierge services (one-off, premium)

| Player | Pricing | What it does | Why it doesn''t compete |
|---|---|---|---|
| **The Gift Concierge** | $$$ per gift (consult-based) | Phone consult → 2 hand-picked gift recs | One-off, expensive, not subscription, not calendar-aware |
| **Grace & Haven** | Per gift | Curated 2–3 options + wrap + ship | Service-heavy, high CAC, not scaling |
| **Feel Good Shop Local** | Per gift | Personality-matched gift picks | Not subscription, no card/date/messaging layer |
| **MADIANITE** | Premium per gift | Full-service end-to-end | Luxury B2B-leaning, not for the $99/yr buyer |
| **Baskits Gift Concierge** | Corporate | Personalized at scale | B2B, not consumer marriage |
| **Laguna Box "Set & Forget"** | Premium pre-paid plan | Pre-schedule luxury gifts for the year, sends reminders | **Closest in spirit.** But: gift-only, no card/date/messaging, premium price, no card-writing scaffolding. |

**The lesson:** the concierge category exists, proving willingness-to-pay, but everyone''s selling the *gift transaction*. No one is selling the *complete moment* (gift + card + date + message rhythm) as a subscription.

### 1.3 Gift-tracking / list apps

| Player | Pricing | What it does | Why it doesn''t compete |
|---|---|---|---|
| **Giftist (giftist.ai)** | Free + Credit Packs | AI gift concierge, "Gift DNA" profile per recipient, AI suggestions, list management | Generic recipient list (friends, family, kids), no marriage-specific scaffolding, no card/date/messaging layer. Closest *interaction model*, weakest *positioning*. |
| **GiftPlanner** (iOS) | Free / paid | Track everyone''s birthdays + gift ideas | Pure organizational tool, no recommendation, no card, no plan |
| **Hint** | Free | Wishlist sharing for partners | Wife-driven, not husband-buyer |
| **Greetabl** | $30+ per box, $39/yr Insider for free shipping | Personalized gift box (3 photos + small gift + note) | One-shot, not subscription, no card-drafting or date-planning, no calendar runway |

**The lesson:** the tools that exist are **passive organizers** ("here''s a list of dates and gifts"). None turn the calendar into an *active 30-day runway* with content beyond gifts.

### 1.4 Date-night / experience subscriptions

| Player | Pricing | What it does | Why it doesn''t compete |
|---|---|---|---|
| **DateBox Club** | ~$30/mo | Mailed date-night box (activities + snacks) | Both partners, physical fulfillment, no event-specific runway |
| **Happily** (formerly Datebox) | App-based | Date personalization + boxes | Generic date nights, not anchored to anniversaries |
| **Bonding Bees / Unbox Love** | Subscription boxes | Monthly date kits | Generic monthly, not marriage-event-specific |

**The lesson:** date-night subs are about generic monthly bonding. They don''t address the *forgotten anniversary* anxiety or build toward a specific date.

---

## 2. The gap, drawn

```
                            FOR HUSBAND ALONE         REQUIRES BOTH PARTNERS
                           ┌──────────────────────┬──────────────────────────┐
ONE-OFF / PER-EVENT        │  Greetabl, gift     │  (n/a — single events    │
                           │  concierge services │   don''t pair well)        │
                           ├──────────────────────┼──────────────────────────┤
ONGOING / SUBSCRIPTION     │  ★ EMPTY SLOT ★    │  Paired, Lasting,        │
                           │  → SendMyLove V2    │   DateBox, Cupla         │
                           └──────────────────────┴──────────────────────────┘
```

**SendMyLove V2 sits in the only quadrant nobody owns.** Husband-driven, ongoing subscription, year-round event runway. Closest neighbor is Laguna Box''s "Set & Forget" — but that''s gift-only and premium-priced.

---

## 3. Pricing landscape

| Tier | Examples | Implication |
|---|---|---|
| Free | Cupla, GiftPlanner, Lovewick | Commodity, no monetization moat |
| $5/mo | Happy Couple ($4.99), V1 SendMyLove ($5) | Fails to fund customer success or AI costs at scale |
| $39/yr | Greetabl Insider | Just shipping perk, no plan content |
| $59.99/yr | Paired annual | Full couples app baseline |
| **$99/yr** | **(open slot — SendMyLove V2)** | Sits between "couples app" and "premium concierge" |
| $14.99/mo | Paired monthly | Monthly couples app |
| $29.99/mo | Lasting | Therapy-adjacent ceiling |
| $$$ per gift | Concierge services | Per-event premium, not subscription |

**$99/year is structurally defensible.** It''s high enough to fund AI + curation + support, low enough that the "marriage insurance" framing makes the math obvious for any household over $75k.

---

## 4. Buyer-intent demand signals

These show the buyer exists and is searching:

- **Reddit:** r/Marriage threads about forgotten anniversaries are a perennial top-post category. Comments converge on the same advice ("set reminders," "tell him a week ahead"). The advice itself is a product spec.
- **Quora / WeddingWire / Mumsnet:** "How would you react if your husband forgot your anniversary" is one of the most-asked relationship questions on every platform.
- **TikTok:** "Wife reaction to husband forgetting anniversary" and "POV: he didn''t plan anything" are recurring viral formats — proven attention.
- **Google:** long-tail buyer-intent queries like "what to get my wife for our 5th anniversary" / "how to plan an anniversary date in [city]" have steady volume + low CPC. SEO opportunity is real.
- **Hallmark + greeting card market:** $4.4B/yr in the US alone. People pay for words they didn''t write — but they want the words to feel personal. That''s the emotional friction we attack.

---

## 5. Vulnerabilities of the incumbents we exploit

1. **Couples apps require both partners.** We don''t. Solo-husband activation is our entire growth motion.
2. **Concierge services don''t subscribe.** They monetize once per event at high price. We monetize once per year at moderate price + own the relationship for compounding profile data.
3. **Gift apps are organizational, not generative.** Giftist gives him a list. We give him a plan. The card. The date. The toast.
4. **Subscription boxes are generic.** They send the same dish-night-kit to everyone. We send the plan that''s specific to *his* wife''s love language, his city, his budget, this year.
5. **Daily-cadence couples apps churn fast.** Husband stops engaging after week 2. We don''t show up daily — we show up at -30/-14/-7/-3/-1/0/+1. Six event cycles per year. Low-touch, high-impact. Hard to churn from.

---

## 6. Why no one has built this yet (and why we can)

- The category is **emotionally narrow** (husband-as-buyer for his own marriage''s calendar). Most consumer founders aim broader (couples, gift-recipients, partners, dating).
- The **AI/LLM unlock** is recent. Personalized card drafts that don''t feel like AI slop weren''t possible 2 years ago. Now they are — but the *guardrails* (don''t replace him, scaffold him) are the differentiator and require taste, not capital.
- The **infra is lightweight**. We can ship this on the existing Cloudflare stack in 2–4 weeks of focused dev. A funded startup wouldn''t bother — TAM is too small for VC math, but plenty large for $500 MRR → $5k MRR solo.
- **Existing assets compound:** the founder has shipped 14 deployed products on this exact stack. The plumbing is not the bottleneck. Marketing fit is.

---

## 7. Three risks the research surfaces

1. **Greetabl could vertically integrate.** They already have automated gifting + customer base. If they added a card-writing layer + date-night plan, they''d be in our slot. Mitigation: ship fast, build the reflection-loop moat, lock in 12-month retention before they notice.
2. **Paired could add a "him-only" mode.** They have the funding and the audience. Mitigation: their brand is built around couples; the husband-solo positioning would dilute. Low probability inside 12 months.
3. **AI-native challengers will arrive.** Once one of these gets featured on TikTok or PH, copycats emerge in weeks. Mitigation: the moat is the **profile + reflection loop**, not the AI. Year-2 customers get year-2 recommendations no copycat can match for them on day one.

---

## 8. Channels the research validates

| Channel | Evidence |
|---|---|
| TikTok | Wife-reaction + forgotten-anniversary content already viral; husband-POV format underexploited |
| Reddit r/Marriage | Recurring high-engagement threads; story-form posts perform |
| SEO long-tail | "Anniversary gift for wife" / "anniversary date ideas [city]" — proven CPC, organic-ranking achievable |
| Podcast pitches | Marriage / dad / men''s-life shows have hosts who fit the buyer profile |
| Meta paid (later) | Couples-targeting infrastructure mature on Meta (per Paired''s reported +49% subscription lift via Partnership Ads) |

---

## 9. Sources

- [Paired — App Store](https://apps.apple.com/us/app/paired-couples-relationship/id1469609343), [Growjo](https://growjo.com/company/Paired), [TechCrunch funding](https://techcrunch.com/2021/05/27/paired-pulls-in-3-6m-to-encourage-more-couples-to-get-cosy-with-app-based-relationship-care/)
- [Lasting — getlasting.com](https://getlasting.com/), [Talkspace acquisition](https://www.businesswire.com/news/home/20201112005199/en/Talkspace-Announces-Acquisition-of-Leading-Relationship-Counseling-App-Lasting)
- [The Giftist — giftist.ai](https://giftist.ai/)
- [Laguna Box "Set & Forget"](https://www.lagunabox.com/products/laguna-box-concierge-gifting-service)
- [MADIANITE Concierge Gifting](https://madianite.com/)
- [Greetabl pricing](https://greetabl.com/pricing_plans), [Greetabl reviews](https://greetabl.com/pages/reviews)
- [Cupla — best-couple-apps 2026](https://cupla.app/blog/best-date-night-apps-couples-2026/)
- [Hello Subscription — best couples date-night subs 2026](https://hellosubscription.com/best-couples-date-night-subscriptions/)
- [Spoonful of Comfort — gift-giving apps](https://www.spoonfulofcomfort.com/blog/5-gift-giving-apps-so-youll-never-forget-an-important-day-again)
- [Business Research Insights — Relationship Apps for Couples Market](https://www.businessresearchinsights.com/market-reports/relationship-apps-for-couples-market-117629)
- [LoveTrackApp — Husband Forgot Anniversary](https://lovetrackapp.com/articles/husband-forgot-anniversary/)
- [Newsweek — viral forgotten-anniversary thread](https://www.newsweek.com/reddit-husband-forgets-wedding-anniversary-1754175)
', 30, 'app-lovenotes/tasks/MARKET-RESEARCH.md'
FROM projects WHERE name = 'LoveNotes' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'Design Brief', '# Design Brief: SendMyLove V2

> [!info] Date: 2026-05-02 · Pairs with [PRD.md](./PRD.md) and [MARKET-RESEARCH.md](./MARKET-RESEARCH.md)

This brief defines the look, voice, and experience of the rebranded SendMyLove. The V1 visual language (gradient pinks, floating hearts, romantic blossoms, cursive, Lottie-style flourishes) is dead — it signals "greeting card subscription," and that''s the category we''re escaping.

---

## 1. Brand posture

> **The Encourager Coach.** A buddy who''s already been married 20 years and texts you on game day. Direct. Warm. No fluff. "I got you."

Not: a poet, a therapist, a Hallmark writer, an AI assistant, a wedding-planner aesthetic, a "girlboss productivity app."

Closest cultural reference points:
- **Field Notes** notebooks (utilitarian, dignified, masculine-but-warm)
- **Ace Hotel** signage (confident, calm, lived-in)
- **Onnit / Huberman** newsletter tone, minus the supplements
- **Ramit Sethi** "I will teach you" decisiveness, minus the finance
- **The Art of Manliness** topical fit, modernized typography

---

## 2. Voice & tone

### Voice principles
1. **Second person, present tense, active voice.** "You ordered the gift. Good. Now write the card."
2. **Short sentences. Ones a husband would actually say to his buddy.** Cut every adverb. Cut "really," "very," "just."
3. **Specificity over sentiment.** "Her birthday is March 14" beats "your loved one''s special day."
4. **No exclamation marks.** Unless we''re being dry.
5. **No emojis except as functional dividers** (✓ checkmarks, → arrows). No 🥰 ❤️ 💕 anywhere, ever.
6. **Decisive, not optional.** "Order this one." not "Maybe consider one of these options."
7. **He''s the hero. We''re the caddy.** We tell him the yardage and hand him the club. He hits the shot.

### Words we never use
- "Journey"
- "Intentional"
- "Show up" (LinkedIn-therapist)
- "Love language" — only when functionally required (onboarding label)
- "Babe," "sweetheart," "honey" — unless he set it as her pet name
- "Relationship" — say "marriage"
- "Loved one" — say "your wife"
- "Special day" — say "anniversary" or "her birthday"
- "Spark," "magic," "ignite"
- "AI-powered" — even though we use AI

### Words we lean into
- Plan. Runway. Brief. Move. Win. Show up (only as in "show up at the dinner"). Specifically. This year. Last year. Handwrite.

### Sample copy

| ❌ V1 voice | ✅ V2 voice |
|---|---|
| "Help her feel loved daily 💕" | "Be the husband she brags about." |
| "Your daily love note is ready! 🥰" | "Anniversary in 30 days. Here''s the plan." |
| "What sweet message will you send today?" | "Order one of these by Friday." |
| "Pick your romantic vibe ✨" | "Pick a budget. We''ll handle the rest." |
| "We''ve got 2,515 ways to say I love you" | "We hand you the runway. You hand her the moment." |

---

## 3. Visual system

### Color palette (locked-in from Claude Design export, 2026-05-02)

These are the **production tokens** — values are pulled from `app/globals.css` which mirrors the exported design.

| Role | Token | Hex | Notes |
|---|---|---|---|
| Background | `--bg` | `#F2EEE6` | Warm cream. Page background, not pure white. |
| Background mid | `--bg-mid` | `#EAE5DB` | Section variation (FAQ, "what''s in a plan"). |
| Background dark | `--bg-dark` | `#DDD7CB` | Form input wells, gift thumb placeholders. |
| Ink primary | `--ink` | `#1E1A16` | Near-black with warm undertone. Body text + dark sections. |
| Ink-2 | `--ink-2` | `#3D3730` | Body copy on cream. |
| Ink-3 | `--ink-3` | `#6B6358` | Labels, secondary copy. |
| **Crimson** (accent) | `--crimson` | `#C0292B` | CTAs, brand mark, countdown numerals. Replaces all pink. |
| Crimson-d | `--crimson-d` | `#A82325` | Hover state for primary buttons. |
| Tan | `--tan` | `#8C7355` | Section kickers, italic accents. |
| Sage | `--sage` | `#4A6741` | Confirmation states, ✓ marks, proof dots. |
| Rule | `--rule` | `#D5CFC4` | Borders, dividers, gridlines. |

### Typography (from Google Fonts, loaded in `app/layout.tsx`)

| Use | Font | Notes |
|---|---|---|
| Display headlines | **Libre Baskerville** (`''Libre Baskerville'', Georgia, serif`) | Italic for second-line headlines, regular for numerals (countdowns), bold for H1/H2. |
| Body + UI | **DM Sans** (`''DM Sans'', sans-serif`) | All buttons, labels, body copy, form inputs. |
| Numerals (countdowns, prices) | Libre Baskerville bold | The "30 days" countdown is `font-size: 104px` Libre Baskerville crimson. |

> **Note:** the original brief speculated Fraunces + Inter. The actual design (Claude Design export) shipped Libre Baskerville + DM Sans. Source-of-truth lives in `app/globals.css` and `app/layout.tsx`. Update both if changing.

### Layout principles
- **One decision per screen.** Onboarding, plan emails, dashboard — never present three actions of equal weight. Always a primary.
- **Generous whitespace.** This is not an app for power users; it''s an app for stressed husbands at 11pm.
- **Long-form text is fine.** A husband reading a 200-word email about his anniversary plan feels seen, not annoyed. Don''t over-chunk.
- **Mobile-first** but never *only* mobile. He''ll read the plan on his phone but order the gift on his laptop.

### Imagery
- **No stock romantic photography.** No couples-on-beach, no rose petals, no sunset silhouettes.
- **Allowed:** their wedding photo (he uploads it), simple line illustrations, photographs of objects (a card on a desk, a typewriter, a packed bag), a Polaroid of an actual restaurant.
- **No floating hearts. No blossoms. No sparkles.**

---

## 4. Key screens

### 4.1 Landing page

**Hero:**
> Be the husband she brags about.
> Not the one who forgot.

Sub-hero:
> SendMyLove hands you the plan 30 days out — gift, card, date, the texts. You hand her the moment.

Primary CTA: `Start the 14-day trial` → Stripe checkout

Below the fold:
- "How it works" — 5 steps with screenshots of an actual plan email, not a hero illustration
- "What''s in a plan" — gift options, card draft, date plan, build-up texts
- Three short testimonials (when we have them; quotes only, no photos until we earn them)
- Pricing — `$99/year` lead, `$12.99/month` secondary, `$29 one-shot rescue` tertiary
- FAQ (skeptical-husband questions, not marketing FAQs)
- Footer: privacy, terms, founder note

### 4.2 Onboarding flow

Single-page, scrolling, sectioned. **Not** a multi-step wizard with progress bars — those feel like forms. This should feel like a buddy taking notes on a legal pad.

Section header style:
> **Tell me about her.**
> The more specific you are, the better next year gets.

Each input has a one-sentence rationale ("we use this to suggest gifts she hasn''t gotten before"). Skip-buttons everywhere. Auto-save. Returns to where he left off.

### 4.3 Dashboard

One-screen view:
- **Top:** Next event countdown — large, Fraunces, terracotta number ("Anniversary in 23 days").
- **Middle:** This event''s plan status — checkboxes (gift ordered, card written, dinner booked) — clickable to expand.
- **Below:** Last reflection (if any) — "Last year, she loved the silk robe. Avoid roses this year."
- **Footer:** Upcoming events list (her birthday, Mother''s Day, Valentine''s), each with their own countdown.

No widgets. No streaks. No analytics. Husband doesn''t want a Strava for his marriage.

### 4.4 Plan email (the core deliverable)

Template structure (~200–300 words, not more):
1. **Subject line:** `Anniversary in 30 days. Here''s the plan.`
2. **Opening:** One line. "Your 8th anniversary is May 15. Here''s everything."
3. **Section 1 — Gift (3 options):** Each option is a card with image, name, price, 1-sentence rationale ("she mentioned wanting one of these in March"), and a `Buy on Amazon` button.
4. **Section 2 — Date:** A primary suggestion (specific restaurant in his city, with a `Book on Resy` button), plus a stay-in alternative and a weekend-trip alternative.
5. **Section 3 — Card draft:** A 4-sentence draft built on their story. Two alt versions in a collapsible block. Note: "buy a card on the way home — Target sells decent ones."
6. **Section 4 — Build-up texts:** Four short messages he''ll receive at -7, -3, -1, morning-of. Heads-up only — actual messages arrive on those dates.
7. **Footer:** A reflection link from last year (if exists), and a `Adjust the plan` button (one-click reroll).

Visual: cream background, ink text, terracotta CTAs. No images except the gift cards. Width capped at ~600px so it reads cleanly in Gmail / Apple Mail / Outlook.

### 4.5 Reflection form (post-event)

Three questions, one screen, takes 60 seconds:
1. **What did she love most?** (free text or pick from plan items)
2. **What missed?** (free text)
3. **One thing to remember for next year?** (free text — gold for the recommender)

Submits → "Got it. We''ll see you 30 days before her birthday."

---

## 5. What to throw out from current site

Concrete deletions for the rewrite:

- Gradient hero blobs (pink/coral)
- Floating decorative icons on landing page
- Pulsing heart bubble illustration
- Lottie animations and `useAnimReady` hooks (they were a workaround for the over-animated V1; V2 doesn''t need them)
- "Random theme" picker
- "8 voice buttons" screenshot anywhere
- "Help her feel loved daily" tagline
- Promo video at `promo-video/out/lovenotes-vertical.mp4` (re-shoot for new positioning)
- Existing dashboard layout (full redesign)
- "$5/month" pricing emphasis

What to keep:
- Domain (`sendmylove.app`) — workable
- Stripe checkout flow (just rewrite the success-page copy)
- Logo (evaluate — the current heart-letter mark may survive; if not, redesign in terracotta + ink)
- Privacy + Terms pages (update product description)

---

## 6. Copy principles for emails

The plan email is the product. It must always:

1. **Lead with the date.** First line names the event and the day count.
2. **Tell him the next decision.** Always one primary action this email is asking him to make.
3. **Show, don''t describe.** Show the actual gift, the actual restaurant name, the actual card draft. Never "here are some ideas to consider."
4. **Reference last year if we have it.** "She loved the silk robe last year. This year skip the apparel."
5. **End with a single button.** No "click here to view your dashboard and adjust your preferences." Just `View the plan` or `Adjust this`.
6. **Subject lines are imperative or factual.** `Anniversary in 30 days. Here''s the plan.` / `Order the gift by Friday.` / `Tomorrow''s plan.`

---

## 7. Brand promises (write these on the wall)

1. We never send anything to her. He''s the one she gets.
2. We never write a card and pretend he wrote it. We hand him a draft to make his.
3. We never recommend something we wouldn''t buy our own wife.
4. We never use the word "journey."

---

## 8. Open design questions

1. **Logo:** keep the current heart-letter mark or redesign? Lean: redesign — current logo signals greeting-card subscription. New mark could be a clean wordmark in Fraunces with a subtle envelope or compass glyph.
2. **Brand name:** "SendMyLove" stays as the URL. Do we evolve the spoken name to something punchier ("Anniversary Co.", "Husbands'' Plan", "The Plan")? Lean: keep SendMyLove, lean into the irony — "we send your love, on time, in your handwriting."
3. **Wedding photo upload:** show on dashboard or only in card design? Lean: dashboard — gives him a moment of "oh right, that''s why I''m doing this."
', 31, 'app-lovenotes/tasks/DESIGN-BRIEF.md'
FROM projects WHERE name = 'LoveNotes' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'Technical Spec', '# Technical Spec: SendMyLove V2

> [!info] Date: 2026-05-02 · Pairs with [PRD.md](./PRD.md). This document is the contract a fresh agent reads to wire up D1, Cloudflare Workers, R2, crons, AI calls, and Stripe migration without re-deriving decisions.

---

## 1. System overview

```
┌─────────────────┐    ┌──────────────────────────┐    ┌──────────────┐
│  Next.js Pages  │◄──►│  Cloudflare Worker (API) │◄──►│  Cloudflare  │
│  (sendmylove.   │    │  - REST endpoints        │    │  D1 Database │
│   app)          │    │  - Scheduled handler     │    └──────────────┘
└─────────────────┘    │  - Stripe webhooks       │    ┌──────────────┐
                       │  - SendGrid sender       │◄──►│  Cloudflare  │
                       │  - Claude Haiku card AI  │    │  R2 (photos) │
                       │  - Amazon affiliate URLs │    └──────────────┘
                       └──────────────────────────┘
```

Worker runs the entire backend. D1 holds all state. R2 holds wedding photos. SendGrid delivers emails. Stripe handles billing. Anthropic API generates card drafts. Amazon Associates handles affiliate links.

---

## 2. D1 schema (V2)

Migrate via `wrangler d1 migrations create lovenotes-db v2_schema` then apply. **Do not drop V1 tables** (`subscribers`, `messages`, `subscriber_message_history`, `send_log`) — leave them in place; the V2 product simply does not read from `messages` or write to `subscriber_message_history`.

```sql
-- 0001_relationship_profiles.sql
CREATE TABLE relationship_profiles (
  subscriber_id TEXT PRIMARY KEY,
  wife_name TEXT NOT NULL,
  wife_pet_name TEXT,
  anniversary_date TEXT,                 -- YYYY-MM-DD
  wife_birthday TEXT,                    -- YYYY-MM-DD (year ignored at runtime)
  kids_json TEXT,                        -- JSON: [{"name":"Ava","birthday":"2018-04-12"}]
  dietary TEXT,
  love_language TEXT,                    -- words|acts|gifts|time|touch
  things_she_wants_json TEXT,            -- JSON array of strings
  values_json TEXT,                      -- JSON array of strings
  things_she_said_no_to_json TEXT,       -- JSON array of strings
  date_places_visited_json TEXT,         -- JSON array of strings
  budget_min_cents INTEGER,
  budget_max_cents INTEGER,
  how_we_met TEXT,
  inside_joke TEXT,
  remember_this_year TEXT,
  wedding_photo_r2_key TEXT,             -- e.g. "{subscriber_id}/wedding.jpg"
  city TEXT,
  state TEXT,
  created_at INTEGER NOT NULL,           -- unix seconds
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (subscriber_id) REFERENCES subscribers(id) ON DELETE CASCADE
);

-- 0002_events.sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,                    -- uuid
  subscriber_id TEXT NOT NULL,
  event_type TEXT NOT NULL,               -- anniversary|wife_birthday|mothers_day|valentines
  event_date TEXT NOT NULL,               -- YYYY-MM-DD next occurrence
  recurring INTEGER NOT NULL DEFAULT 1,   -- 1 = roll forward each year
  active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (subscriber_id) REFERENCES subscribers(id) ON DELETE CASCADE
);
CREATE INDEX idx_events_subscriber ON events(subscriber_id);
CREATE INDEX idx_events_date ON events(event_date);

-- 0003_event_runs.sql
CREATE TABLE event_runs (
  id TEXT PRIMARY KEY,                    -- uuid
  event_id TEXT NOT NULL,
  subscriber_id TEXT NOT NULL,
  run_year INTEGER NOT NULL,              -- 2026 — guards against re-triggering
  plan_email_sent_at INTEGER,
  backup_email_sent_at INTEGER,
  card_prompt_sent_at INTEGER,
  dinner_reminder_sent_at INTEGER,
  final_brief_sent_at INTEGER,
  morning_text_sent_at INTEGER,
  reflection_request_sent_at INTEGER,
  reflection_completed INTEGER NOT NULL DEFAULT 0,
  plan_data_json TEXT,                    -- frozen snapshot: gifts, card draft, date, messages
  created_at INTEGER NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  UNIQUE (event_id, run_year)
);
CREATE INDEX idx_runs_subscriber ON event_runs(subscriber_id);

-- 0004_gift_recommendations.sql
CREATE TABLE gift_recommendations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  vendor TEXT NOT NULL,                   -- amazon|etsy|ftd|other
  product_url TEXT NOT NULL,              -- raw URL, affiliate tag appended at render
  price_cents INTEGER NOT NULL,
  price_band TEXT NOT NULL,               -- 25_50|50_150|150_500|500_plus
  love_languages TEXT NOT NULL,           -- csv: words,gifts,touch
  event_types TEXT NOT NULL,              -- csv: anniversary,wife_birthday,mothers_day,valentines
  tags TEXT,                              -- csv free tags: jewelry,experience,handmade,...
  active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_gifts_active ON gift_recommendations(active, price_band);

-- 0005_reflections.sql
CREATE TABLE reflections (
  id TEXT PRIMARY KEY,
  event_run_id TEXT NOT NULL,
  subscriber_id TEXT NOT NULL,
  loved_most TEXT,
  missed TEXT,
  remember_for_next_year TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (event_run_id) REFERENCES event_runs(id) ON DELETE CASCADE
);
CREATE INDEX idx_reflections_subscriber ON reflections(subscriber_id);

-- 0006_subscribers_v2_columns.sql
ALTER TABLE subscribers ADD COLUMN plan_tier TEXT DEFAULT ''v1_legacy'';  -- v1_legacy|annual|monthly|rescue
ALTER TABLE subscribers ADD COLUMN trial_ends_at INTEGER;
ALTER TABLE subscribers ADD COLUMN onboarding_completed_at INTEGER;
```

**Migration plan from V1:**
- Existing V1 subscribers keep `plan_tier=''v1_legacy''` and continue receiving daily emails until V2 onboarding is offered.
- New signups go straight to V2 (`plan_tier IN (''annual'',''monthly'',''rescue'')`).
- Once all V1 subs are migrated or churned, delete the V1 daily cron handler.

---

## 3. Worker file structure

Refactor the current monolithic `worker/index.ts` into a routed structure:

```
worker/
  index.ts                    # Entry: route table, cron registration
  routes/
    profile.ts                # /api/profile/*
    events.ts                 # /api/events/*
    runs.ts                   # /api/runs/*
    reflections.ts            # /api/reflections
    photos.ts                 # /api/photos (R2 signed-URL helper)
    webhooks.ts               # /api/stripe-webhook
    auth.ts                   # /api/signup, /api/login, /api/logout
    health.ts                 # /api/health
  lib/
    auth.ts                   # JWT sign/verify (Web Crypto)
    cors.ts                   # ALLOWED_ORIGINS handling
    db.ts                     # Typed D1 helpers
    runway.ts                 # The -30/-14/-7/-3/-1/0/+1 evaluator
    plan.ts                   # Plan composition (gifts + card + date)
    cards.ts                  # Claude Haiku card-draft generator
    gifts.ts                  # Recommender (love language × budget × event type)
    email.ts                  # SendGrid wrapper
    affiliates.ts             # URL builders per vendor
    r2.ts                     # Signed-URL generation
    stripe.ts                 # Webhook signature verification + event handlers
    ids.ts                    # uuid + slug helpers
    time.ts                   # Date math (event roll-forward, T-minus calc)
  templates/
    plan-email.html           # Day -30
    backup-email.html         # Day -14
    card-prompt-email.html    # Day -7
    dinner-reminder.html      # Day -3
    final-brief.html          # Day -1
    morning-text.html         # Day 0
    reflection-request.html   # Day +1
```

Routing pattern: each route file exports `(req, env, ctx) => Response`. `index.ts` matches by path prefix and dispatches.

---

## 4. API endpoints (V2)

All protected endpoints require valid `lovenotes_auth` JWT cookie. All return JSON. CORS uses existing `ALLOWED_ORIGINS` array.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/signup` | No | Create subscriber + Stripe customer + 14-day trial subscription, return checkout URL |
| POST | `/api/login` | No | Magic-link login (email a one-time JWT) |
| POST | `/api/logout` | Yes | Clear cookie |
| GET | `/api/profile` | Yes | Get relationship profile |
| POST | `/api/profile` | Yes | Create relationship profile (onboarding submit) |
| PATCH | `/api/profile` | Yes | Update individual fields |
| POST | `/api/photos/upload-url` | Yes | Returns R2 pre-signed PUT URL for wedding photo |
| GET | `/api/events` | Yes | List user''s events |
| POST | `/api/events` | Yes | Create event (`{event_type, event_date}`) |
| DELETE | `/api/events/:id` | Yes | Soft delete (set `active=0`) |
| GET | `/api/runs` | Yes | List upcoming event runs (next 90 days) |
| GET | `/api/runs/:id` | Yes | Get run detail + frozen `plan_data_json` |
| POST | `/api/runs/:id/regenerate` | Yes | Regenerate plan options (rate-limited 3/day) |
| POST | `/api/reflections` | Yes | Submit reflection (`{event_run_id, loved_most, missed, remember_for_next_year}`) |
| POST | `/api/stripe-webhook` | Stripe sig | Handle subscription lifecycle |
| GET | `/api/health` | No | Health check |

### Request/response shapes (key endpoints)

**POST /api/signup**
```json
// Request
{
  "email": "him@example.com",
  "plan_tier": "annual"        // annual | monthly | rescue
}
// Response 200
{
  "checkout_url": "https://checkout.stripe.com/..."
}
```

**POST /api/profile** (onboarding submit)
```json
{
  "wife_name": "Sarah",
  "wife_pet_name": "Sare-bear",
  "anniversary_date": "2018-09-22",
  "wife_birthday": "1990-03-14",
  "kids": [{"name":"Ava","birthday":"2020-04-12"}],
  "love_language": "gifts",
  "things_she_wants": ["silk pajamas","weekend in Asheville","new running shoes"],
  "values": ["family time","reading","being heard"],
  "things_she_said_no_to": ["roses","jewelry with diamonds","spa days"],
  "date_places_visited": ["Beauregard''s","The Capital Grille","La Petite"],
  "budget_min_cents": 5000,
  "budget_max_cents": 15000,
  "how_we_met": "...",
  "inside_joke": "...",
  "remember_this_year": "...",
  "city": "Charlotte",
  "state": "NC",
  "wedding_photo_r2_key": "abc-123/wedding.jpg"
}
```

**GET /api/runs/:id** (returns frozen plan)
```json
{
  "id": "run-uuid",
  "event_type": "anniversary",
  "event_date": "2026-09-22",
  "days_until": 30,
  "plan_data": {
    "gifts": [
      {"id":"g1","title":"...","price_cents":8900,"vendor":"amazon","affiliate_url":"https://amzn.to/...","rationale":"You mentioned silk pajamas in onboarding"}
    ],
    "card_draft": {
      "primary": "Eight years.\n\n...",
      "alternate_short": "...",
      "alternate_long": "..."
    },
    "date_plan": {
      "primary": {"name":"Beauregard''s","reservation_url":"...","note":"..."},
      "stay_in": {...},
      "weekend": {...}
    },
    "messages": [
      {"send_at_offset_days":-7,"text":"..."},
      {"send_at_offset_days":-3,"text":"..."},
      {"send_at_offset_days":-1,"text":"..."},
      {"send_at_offset_days":0,"text":"..."}
    ]
  }
}
```

---

## 5. Cron and the runway evaluator

### 5.1 Schedule

`wrangler.toml`:
```toml
[triggers]
crons = ["0 13 * * *"]   # 13:00 UTC = 8am ET / 9am EDT, daily
```

Single daily cron. Worker''s `scheduled` handler routes to `lib/runway.ts`.

### 5.2 Algorithm (pseudocode)

```ts
export async function runRunway(env, today: Date) {
  const todayYMD = formatYMD(today);

  // 1. Roll forward: any event whose date is in the past gets bumped +1 year
  await env.DB.prepare(`
    UPDATE events
    SET event_date = date(event_date, ''+1 year'')
    WHERE recurring = 1
      AND active = 1
      AND event_date < ?
  `).bind(todayYMD).run();

  // 2. Find events whose date is exactly N days out, for N in {30, 14, 7, 3, 1, 0, -1}
  const offsets = [30, 14, 7, 3, 1, 0, -1];
  for (const offset of offsets) {
    const targetDate = formatYMD(addDays(today, offset));
    const events = await env.DB.prepare(`
      SELECT e.*, s.email, s.plan_tier
      FROM events e
      JOIN subscribers s ON s.id = e.subscriber_id
      WHERE e.event_date = ?
        AND e.active = 1
        AND s.plan_tier IN (''annual'',''monthly'',''rescue'')
    `).bind(targetDate).all();

    for (const event of events.results) {
      await processOffset(env, event, offset, today);
    }
  }
}

async function processOffset(env, event, offset, today) {
  // Get-or-create event_run for this year
  const runYear = today.getUTCFullYear();
  let run = await getRun(env, event.id, runYear);
  if (!run) run = await createRun(env, event, runYear);

  // Idempotency: each offset has a corresponding sent_at column.
  // Skip if already sent.
  const stage = stageForOffset(offset);   // -30 → ''plan_email_sent_at'', etc.
  if (run[stage]) return;

  // Compose plan if needed (only at -30; subsequent stages reuse frozen plan_data_json)
  if (offset === 30 && !run.plan_data_json) {
    const plan = await composePlan(env, event, run);
    await env.DB.prepare(`UPDATE event_runs SET plan_data_json = ? WHERE id = ?`)
      .bind(JSON.stringify(plan), run.id).run();
    run.plan_data_json = JSON.stringify(plan);
  }

  // Render and send email for this stage
  await sendStageEmail(env, event, run, offset);

  // Mark sent
  await env.DB.prepare(`UPDATE event_runs SET ${stage} = ? WHERE id = ?`)
    .bind(nowSeconds(), run.id).run();
}
```

### 5.3 Idempotency rules
- A given `(event_id, run_year, stage)` triple can only fire once. The `sent_at` columns guarantee this.
- If cron is delayed or retried, the algorithm re-runs safely — already-sent stages are skipped.
- If a user adds an event mid-runway (e.g., 12 days out), they get the next applicable stage (-7) and skip prior stages.

### 5.4 Stage → column map
| Offset | Column |
|---|---|
| +30 | `plan_email_sent_at` |
| +14 | `backup_email_sent_at` |
| +7 | `card_prompt_sent_at` |
| +3 | `dinner_reminder_sent_at` |
| +1 | `final_brief_sent_at` |
| 0 | `morning_text_sent_at` |
| -1 (day after) | `reflection_request_sent_at` |

---

## 6. Plan composition (`lib/plan.ts`)

Called once per event run, at -30, output frozen as `plan_data_json`.

```ts
async function composePlan(env, event, run) {
  const profile = await getProfile(env, event.subscriber_id);

  const gifts = await selectGifts(env, {
    event_type: event.event_type,
    love_language: profile.love_language,
    budget_band: bandFromBudget(profile.budget_min_cents, profile.budget_max_cents),
    avoid_titles: jsonArr(profile.things_she_said_no_to_json),
    desired_titles: jsonArr(profile.things_she_wants_json),
    n: 3
  });

  const cardDraft = await draftCard(env, { profile, event });   // Anthropic call

  const datePlan = await proposeDatePlan(env, profile, event);  // Static templates by city for V1

  const messages = buildBuildupMessages(profile, event);        // Templated, profile-aware

  return { gifts, card_draft: cardDraft, date_plan: datePlan, messages };
}
```

**`selectGifts`** (V1, deterministic): rank `gift_recommendations` by:
1. `event_type` match
2. `love_language` overlap
3. `price_band` match to budget
4. Prefer items whose tags match `profile.things_she_wants_json` keywords
5. Exclude items matching `profile.things_she_said_no_to_json`
Return top 3.

V2: replace ranker with Anthropic call once we have ≥30 reflections to feed it.

---

## 7. Card-draft AI prompt (`lib/cards.ts`)

Anthropic API, `claude-haiku-4-5-20251001` (fast + cheap). Use prompt caching on the system prompt.

```ts
const SYSTEM_PROMPT = `You are helping a husband write a card to his wife. You do not write FOR him — you draft something he edits and handwrites in his own hand.

Hard rules:
- 3 to 5 sentences. It''s a card, not a letter.
- Sound like HIM speaking to her, not like a poet, therapist, or greeting card.
- Use the SPECIFIC details from his profile (her name, their story, the inside joke, the kids'' names if relevant).
- No flowery language. No clichés. No "always and forever," "soulmate," "my everything," "journey," "blessed."
- No emojis.
- Match the event type: an anniversary card references their years together; a birthday card references HER specifically as a person, not their relationship.
- Always end with a sentence that lands. Not a generic well-wish.

Output format: JSON with keys "primary", "alternate_short", "alternate_long". Primary is 4 sentences. alternate_short is 1-2 sentences. alternate_long is 5-6 sentences. All three should be distinct in approach, not just length.`;

const userPrompt = `
Event: ${event.event_type === ''anniversary'' ? `${yearsTogether(profile.anniversary_date)} year wedding anniversary` : ''her birthday''}

Her name: ${profile.wife_name}
Pet name: ${profile.wife_pet_name || ''(none)''}
How we met: ${profile.how_we_met || ''(skipped)''}
Inside joke: ${profile.inside_joke || ''(skipped)''}
What I want to remember about her this year: ${profile.remember_this_year || ''(skipped)''}
Kids: ${kidsList(profile)}
${lastYearReflection ? `Last year''s reflection — what landed: ${lastYearReflection.loved_most}. What missed: ${lastYearReflection.missed}.` : ''''}

Draft the three card options.`;
```

Cost ceiling: ~$0.001 per card-draft call. Each event_run triggers exactly one call (at -30, frozen). At 60 customers × 4 events/year = 240 calls/year ≈ $0.25/year total.

---

## 8. Gift catalog seed strategy

V1 launch: hand-curate **150 items** (3 price bands × 5 love languages × ~10 items × buffer for occasions). Insert via SQL seed file. Maintenance pace: 10 new items per month.

`data/seed-gifts.sql` to be authored alongside the worker code. Vendor distribution at launch: 80% Amazon (fastest affiliate setup), 20% Etsy (curated handmade for the "she''s said no to mass-market" buyer).

Affiliate URL pattern (`lib/affiliates.ts`):
```ts
function amazonAffiliate(rawUrl: string, env: Env): string {
  const url = new URL(rawUrl);
  url.searchParams.set(''tag'', env.AMAZON_AFFILIATE_TAG);
  return url.toString();
}
```

---

## 9. R2 (wedding photos)

**Bucket:** `lovenotes-photos` (single bucket, all subscribers). **Key pattern:** `{subscriber_id}/wedding.jpg`. **Max size:** 5 MB. **Allowed types:** `image/jpeg`, `image/png`, `image/webp`.

**Upload flow:**
1. Browser hits `POST /api/photos/upload-url` with `{content_type, size}`.
2. Worker validates, returns a pre-signed PUT URL (15-min expiry).
3. Browser uploads directly to R2.
4. Browser POSTs the resulting `r2_key` to `PATCH /api/profile { wedding_photo_r2_key }`.

**Read flow:** Worker generates short-lived signed GET URL on demand when rendering the dashboard or card-design surface.

`wrangler.toml`:
```toml
[[r2_buckets]]
binding = "PHOTOS"
bucket_name = "lovenotes-photos"
preview_bucket_name = "lovenotes-photos-preview"
```

---

## 10. Stripe (V2 changes)

### Products & prices to create in Stripe dashboard:
- `Annual Plan` → recurring yearly, $99 → store ID in `STRIPE_PRICE_ANNUAL`
- `Monthly Plan` → recurring monthly, $12.99 → `STRIPE_PRICE_MONTHLY`
- `Rescue (one-time)` → one-time, $29 → `STRIPE_PRICE_RESCUE`

### Trial: 14 days on annual + monthly. None on rescue.

### Webhook events to handle (in `routes/webhooks.ts`):
- `checkout.session.completed` → set `subscribers.plan_tier`, `trial_ends_at`
- `customer.subscription.updated` → reflect status changes
- `customer.subscription.deleted` → set `plan_tier=''canceled''` (events stop being processed)
- `invoice.payment_failed` → email subscriber, mark grace period
- `invoice.paid` → no-op (Stripe handles renewal silently)

### V1 → V2 price migration
- Existing V1 customers paying $5/mo: leave on legacy price; do not auto-migrate. Offer V2 upgrade via dashboard prompt once V2 is stable.
- New signups: V2 prices only.

---

## 11. Environment variables / secrets

Add to Cloudflare Worker via `wrangler secret put` (production). Local dev via `.dev.vars`.

| Name | Type | Source | Purpose |
|---|---|---|---|
| `JWT_SECRET` | secret | random 32-byte | (existing) |
| `STRIPE_SECRET_KEY` | secret | Stripe | (existing) |
| `STRIPE_WEBHOOK_SECRET` | secret | Stripe | (existing) |
| `STRIPE_PRICE_ANNUAL` | var | Stripe price id | New |
| `STRIPE_PRICE_MONTHLY` | var | Stripe price id | New |
| `STRIPE_PRICE_RESCUE` | var | Stripe price id | New |
| `SENDGRID_API_KEY` | secret | SendGrid | (existing) |
| `SENDGRID_FROM_EMAIL` | var | `plans@sendmylove.app` | (existing) |
| `ANTHROPIC_API_KEY` | secret | Anthropic console | New — card-draft AI |
| `AMAZON_AFFILIATE_TAG` | var | Amazon Associates | New — `bmangum-20` or current tag |
| `ALLOWED_ORIGINS` | var | csv | (existing) |

R2 binding (`PHOTOS`) and D1 binding (`DB`) configured in `wrangler.toml`, not as secrets.

---

## 12. Wrangler config (V2)

```toml
name = "lovenotes-api"
main = "worker/index.ts"
compatibility_date = "2026-05-01"

[triggers]
crons = ["0 13 * * *"]

[[d1_databases]]
binding = "DB"
database_name = "lovenotes-db"
database_id = "<existing>"

[[r2_buckets]]
binding = "PHOTOS"
bucket_name = "lovenotes-photos"

[env.production]
name = "lovenotes-api-production"
# Production-only D1 + R2 bindings here
```

---

## 13. Build order (recommended)

If a fresh agent picks this up, build in this sequence:

1. **D1 migrations** — apply all 6 migration files.
2. **R2 bucket** — create `lovenotes-photos` + preview bucket.
3. **Stripe products + prices** — create the 3 price IDs, store in env vars.
4. **Worker refactor** — split monolith into `routes/` + `lib/`.
5. **Auth + profile + events + photos endpoints** — the surface needed for onboarding to submit.
6. **Gift catalog seed** — author 150 items, load via `wrangler d1 execute --file=...`.
7. **Plan composer + card AI** — `lib/plan.ts` and `lib/cards.ts`.
8. **Cron runway evaluator** — `lib/runway.ts` + scheduled handler wiring.
9. **Email templates** — 7 HTML templates for the runway stages.
10. **Stripe webhook updates** — handle V2 plan tiers.
11. **Frontend integration** — connect Next.js to the new endpoints (separate session, after design).

Each step is testable in isolation. Don''t skip ahead — the cron evaluator depends on plan composition, which depends on the catalog, which depends on the schema.

---

## 14. Testing requirements

- All new `lib/` modules ship with vitest tests under `worker/lib/*.test.ts`.
- The runway evaluator MUST have a test that fast-forwards 365 days of cron invocations and asserts: each event triggers exactly 7 emails, no duplicates, no misses.
- Card-draft tests use a mocked Anthropic client; assert the system prompt is unchanged (regression guard against prompt drift).
- Idempotency test: re-run the same cron day twice — assert zero duplicate emails.

---

## 15. Observability

- Add `console.log` JSON-structured events at: cron start, each stage processed, each email sent, each Stripe webhook received, each Anthropic call. Pipe to `wrangler tail` during launch month.
- Stripe webhook failures must alert (email Brian) — these are revenue-impacting.
- D1 query budget: scheduled handler should complete in <30s. If over, batch by paging through events.

---

## 16. Decommission V1 cron

Once `subscribers.plan_tier=''v1_legacy''` count reaches 0:
1. Remove the daily-message logic from the scheduled handler.
2. Drop the V1 `messages`, `subscriber_message_history`, `send_log` tables (migration 0099).
3. Delete `data/messages/*.json` and `scripts/compile-messages.js`.

Until then: V1 daily emails continue alongside V2 runway. Both flows coexist in the same scheduled handler.

---

## 17. What this spec does NOT cover

- Frontend (Next.js) implementation details — see `DESIGN-BRIEF.md`
- iOS app — separate spec when that work begins
- Marketing site copy — generated by design pass, not specced here
- Specific gift catalog items — curated content, not architecture
', 32, 'app-lovenotes/tasks/TECHNICAL-SPEC.md'
FROM projects WHERE name = 'LoveNotes' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'PRD', '# PRD: SendMyLove — Anniversary & Birthday Concierge

> [!info] Status: **Pivot from V1 (static-message subscription) to V2 (event concierge).**
> Owner: Brian Mangum · Last updated: 2026-05-02 · Replaces all prior PRDs (archived in `tasks/_archive/`).

---

## TL;DR

SendMyLove hands a husband a complete 30-day plan for every event in his marriage that he can''t afford to mail in — wedding anniversary, her birthday, Mother''s Day, Valentine''s. Each plan includes gift options he can buy in two clicks, a card draft built on their actual story, a date plan for his city, and a build-up message rhythm. He still picks, writes, and shows up. **We scaffold; he executes.**

Pricing: **$99/year** (or $12.99/mo). Target: **60 paying customers in 6 months → $500 MRR.**

---

## 1. Why we''re rebuilding

V1 was a $5/mo subscription that emailed the husband daily, pre-written messages to copy and send to his wife. It launched Jan 2026, ran live for 3.5 months, and earned **$0 MRR**. The marketing plan was written and never executed. The product itself was the deeper failure.

### Why V1 failed (psychology)

The wife in this transaction wants exactly one thing: evidence her husband **thought about her specifically**. The note is a receipt for cognitive effort. V1 removed the cognitive effort and shipped the receipt. The wife either:

1. **Doesn''t know** the note is outsourced — the relationship runs on a small lie that compounds, and her gut reads his words as rehearsed.
2. **Does know** — and the note is now worse than nothing, because it admits he automated thinking about her.

Either way, the husband doesn''t develop the skill. The next time there''s an apology, an anniversary, a real moment, he still has nothing.

### The rule we will not break going forward

**Never sell a product that replaces the emotional labor. Sell products that scaffold it, sequence it, or remove the unrelated friction around it.**

V2 obeys this rule absolutely. We never write the message for him. We never buy the gift for him. We never sign the card. We hand him a runway, the research, a draft he edits, and a checklist. He is the one she gets.

---

## 2. The problem

Husbands across every income bracket forget, panic, or mail in the major moments that compound their wife''s view of the marriage. Generic gift cards, last-minute flowers, "thanks babe ❤️" texts erode emotional capital over years even when the marriage is otherwise good.

He''s not a bad guy. He''s overwhelmed. He doesn''t know what she''d love this year that''s different from last year. He can''t write words. He doesn''t have time to research. And he secretly wants to be the husband she brags about — he just doesn''t know how to start.

The cost of forgetting an anniversary is not measured in dollars. It is measured in the look on her face and the conversations that follow for the next three weeks. That''s the willingness-to-pay anchor.

---

## 3. Who it''s for (ICP)

### Primary
- Hetero married men, **28–55**, household income **$75k+**
- **1–25 years married**
- Has at least one of: kids in the house, two-career household, ADHD-tendencies, travel-heavy job, or self-identifies as "bad with this stuff"
- Has been told (or felt) he could be more thoughtful
- Has at least one event per year he cannot afford to mail in
- Owns a smartphone and uses email

### Not for
- Newlyweds in honeymoon phase
- Couples in active crisis (this is not therapy)
- Single people, dating, non-cohabiting, unmarried partners
- Anyone looking for a couples app with two accounts
- Anyone shopping for a wife → husband product (we never serve that direction in V1)

---

## 4. Jobs to be done

In rough order of dollar weight:

1. **"Don''t let me forget the date."**
2. **"Tell me what to get her this year — not the same thing I did last year."**
3. **"Help me write a card she''ll keep in her drawer for 10 years."**
4. **"Plan the night for me — somewhere we haven''t been."**
5. **"Build the moment up so it doesn''t happen cold."**
6. **"Make me look like I had this together for once."** (Identity / status)

---

## 5. The solution: how it works

### 5.1 Onboarding (5 minutes, after Stripe trial-start)

Long-form, conversational, feels like talking to a buddy not a form. Single page with progressive disclosure.

| Section | Captures |
|---|---|
| Her | Name, anniversary date, her birthday, dietary restrictions |
| Family | Kids'' names + birthdays (optional, used for upsells later) |
| What she''d love | 5 things she''s mentioned wanting this year (free text), her love language (5-pick), top 3 things she values (free text) |
| What she''s said NO to | 3+ items he should never give her again (gold for the recommender) |
| Where you''ve already been | 3 places they''ve gone for date night (avoid repeats) |
| Budget bands | $25–50 / $50–150 / $150–500 / $500+ |
| Their story | "How did you meet?" "What''s the inside joke?" "What''s something she said this year that you want to remember?" |
| Wedding photo | Optional — used in card design |

### 5.2 The 30-Day Runway (per event)

Triggered by the event calendar. Cron evaluates each user''s events daily.

| T-minus | Email | Contents |
|---|---|---|
| **30 days** | *Plan email* | 3 gift options (price-band-matched, with affiliate buy links), a date plan in his city + alternate stay-in plan + alternate weekend plan, a card draft built on their story, the build-up text schedule (4 messages he''ll receive at -7/-3/-1/morning-of) |
| **14 days** | *Backup* | "Did you order? Here''s a 3-day-ship backup option." Saves the procrastinator. |
| **7 days** | *Card prompt* | "Time to handwrite the card. Here''s the draft. Buy a card on the way home." |
| **3 days** | *Dinner reminder* | "Reservation confirmed? Here''s the place. Here''s a script for the toast." |
| **1 day** | *Final brief* | Tomorrow''s plan. Wake-up time. Flowers to grab. Things to do / not do / not bring up. |
| **Day 0 — morning** | *First text* | Morning text for him to copy and send. |
| **+1 day** | *Reflection* | "How did it go? What landed? What didn''t?" Feeds the profile so next year is smarter. |

### 5.3 The compounding moat

Every reflection writes back to the profile. Year 2: "Last year you got her the silk robe and she loved it — this year try X." Year 3: the recommender knows her better than her sister. The cost of canceling is exposing himself to the next forgotten event without it.

### 5.4 What we explicitly do not build (V1)

- Generic prewritten daily messages (V1 corpse — archived)
- AI-generated cards she''d spot in 5 seconds (rule violation)
- Surprises *for her* (this is for him; she has no account)
- Couples mode / two-account product
- Subscription gift boxes / physical fulfillment (we recommend; we don''t ship)
- Therapy or counseling content
- Daily message rhythm in V1 (events only — daily is V2)

---

## 6. Pricing & packaging

| Plan | Price | Scope |
|---|---|---|
| **Annual** (lead) | **$99 / year** | Up to 4 events: wedding anniversary, her birthday, Mother''s Day, Valentine''s |
| **Monthly** | $12.99 / month | Same scope; built for skeptics; designed to convert to annual |
| **One-shot rescue** | $29 one-time | Single emergency: "Anniversary''s in 8 days, save me." Low-friction first taste; converts to annual after the event. |
| **Free trial** | 14 days, card required | One full -30/-14/-7 cycle so the value is felt before the bill |

**Why $99/year as the headline:**
- Sits in the gap between Greetabl Insider ($39/yr, just shipping) and Paired ($59.99/yr, full couples app) without being apples-to-apples with either
- Round number that frames as "marriage insurance" not "another subscription"
- Annual lockup = lower churn, no monthly cancel-after-anniversary problem
- Math: 60 annual customers × $99 = $5,940 ARR ≈ $495 MRR

---

## 7. Pricing math → $500 MRR target

Mix realistic at month 6:
- 40 annual @ $99 → $330 MRR equivalent
- 15 monthly @ $12.99 → $195 MRR
- 5 one-shot rescues / month → $145 / month rolling
- **Total ≈ $670/mo recognized + cash. Hits goal with a 25% buffer.**

Or simpler: **60 annual subscribers** is the single number that defines success.

---

## 8. What we keep, build, and kill

### 8.1 Keep (already built, ~80% reusable)
- Cloudflare Worker + D1 + JWT auth + Stripe live keys + SendGrid integration
- Domain `sendmylove.app`
- Cron infrastructure (repurposed: event-triggered, not daily)
- `subscribers` table + Stripe webhook plumbing

### 8.2 Build (V1, ~4 weeks at 5 hr/wk = also realistic for 2 weeks of focused effort)
- Onboarding flow (replaces V1 signup → message-prefs)
- `events` table + `event_runs` table (D1)
- `gift_recommendations` curated dataset (manual to start, by love-language × budget × event-type)
- Plan-email composer (Worker function with Claude Haiku for card draft)
- Card draft generator with strict "his voice" guardrails
- Reflection capture form
- Pricing page rewrite ($99/yr emphasis, V1 $5/mo retired)
- Affiliate integrations: Amazon Associates day 1; FTD/1-800-Flowers + Etsy day 30; jewelry partners day 90
- New landing page (see [DESIGN-BRIEF.md](./DESIGN-BRIEF.md))

### 8.3 Kill
- 2,515 static messages — leave in DB but unused; do not delete (cost = zero)
- Daily-cron message sender — replaced by event cron
- "Random" theme picker / 5-theme buttons — gone
- "8 voice buttons" feature — gone
- Promo video (`promo-video/out/lovenotes-vertical.mp4`) — re-shoot for new positioning
- Marketing plan v1 — archived
- All language using "love note" as the noun — replaced by "plan", "moment", "gift", "card"

---

## 9. Marketing motion (5 hr/week)

Channel-fit ranked by founder-fit + buyer-fit + cost:

1. **TikTok organic, husband-POV** — "I forgot our anniversary three years in a row. Then I built this." Wife-reaction format works because it is the literal product mechanism. **3 posts/week × 30 min = 1.5 hr.**
2. **Reddit (r/Marriage, r/AskMen, r/AskMenOver30, r/DadForADay)** — story-form posts, never sales-y. Comment with link only when asked. **1 post/week + replies = 1 hr.**
3. **SEO long-tail** — "what to get my wife for our 5th anniversary" / "how to plan an anniversary date in [city]" — buyer-intent keywords with low CPC. **1 article/week = 1 hr.**
4. **Direct outreach** — DM 3 husband-POV creators per week, pitch 1 podcast per week. **0.5 hr/week.**
5. **Paid ads** — held until month 5 once organic CAC is known.

Total: ~4 hr/week, leaves 1 hr/week for product fixes.

### 6-month sequence

| Month | Goal | Activities |
|---|---|---|
| 1 | Build, soft-launch to 10 friends, run on 2–3 real events | Don''t pitch; iterate |
| 2 | First 5 paying friends-of-friends + reflection data | Continue iterating runway emails |
| 3 | Public launch — Product Hunt + r/Marriage + first TikTok push | Target 15 paying |
| 4 | Two viral hooks proven; first SEO article ranking | Target 25 paying |
| 5 | Mother''s Day + early V-Day campaigns | Target 40 paying; affiliate live |
| 6 | Monthly → annual conversion push | Target 60 paying / $500 MRR |

---

## 10. Operations

- Solo founder, **5 hr/week**
- Once flywheel is running, ops fits in <1 hr/week:
  - Plan-email QA (10 min × 5 sends/week at scale)
  - Customer support shared inbox (15 min/day in launch month, less later)
  - Affiliate-link rotation, gift-list curation (1 hr/month)
- Gift recommender starts manual (curated lists by love-language × budget). Migrate to AI-assisted at 100+ subs.
- AI cost ceiling: Claude Haiku at ~$0.001/draft × 5 drafts/event × 4 events/year × 60 customers = **~$1.20/yr/customer**. Trivial.

---

## 11. Financials (12-month projection at goal)

| Line | Amount |
|---|---|
| 60 annual × $99 | $5,940 |
| 15 monthly avg × $12.99 × 12 | $2,338 |
| One-shot rescues @ ~$500/yr | $500 |
| Affiliate (10% lift, conservative) | $880 |
| **Year-1 revenue** | **~$9,650** |
| Stripe fees (2.9% + 30¢) | ~$300 |
| Claude API | ~$72 |
| Domain + Cloudflare + SendGrid | $0 (free tiers) |
| **Year-1 net** | **~$9,300 (≈ 96% margin)** |

---

## 12. Kill criteria (do not blink past these)

Evaluated at **month 4 (60 days post-public launch):**

| Outcome | Action |
|---|---|
| **<10 paying customers** | **Hard kill.** Not a marketing problem; the product hypothesis is wrong. Move on to the next portfolio bet. |
| **10–20 customers + <30% renewal intent** at month 3 | Soft kill: monetization is broken. Test reposition or 50% price cut. One more month max. |
| **25+ paying + positive renewal signal** | Continue. Push to $500 MRR by month 6. |

These criteria are written down so we don''t fall in love with the build. If month-4 numbers say stop, we stop.

---

## 13. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Husband doesn''t read the -30 email | Multi-channel: also push notification; subject lines tested for open rate; -14/-7 emails get progressively more urgent |
| Gift recs feel generic | Curated lists by love-language × budget × event-type; reflection loop sharpens YoY; never use stock affiliate feeds |
| Card draft sounds AI-written | Strict guardrails in prompt; show 3 variants always with one being a single sentence; encourage handwrite-with-edits not paste |
| Wife discovers the service | Marketing addresses head-on: "we handed him the runway. He still wrote the card." This is a feature, not a bug. |
| Annual price too high | Monthly + one-shot rescue catch the price-skeptics; conversion path built in |
| Affiliate revenue depends on Amazon | Diversify by month 6: Etsy + FTD + jewelry direct |

---

## 14. Resolved decisions (2026-05-02)

| # | Decision | Resolution |
|---|---|---|
| 1 | **Domain** | Keep `sendmylove.app`. |
| 2 | **Brand name** | Open to rename. Shortlist proposed; selection pending. Brand can evolve while domain stays. |
| 3 | **Trial length** | **14 days**, card required at start. Long enough to feel the -7 email arrive before billing. |
| 4 | **Platforms** | **Web-first** (primary surface for V1). **Parallel iOS build** begins alongside web — no waiting until month 4. |
| 5 | **Design tooling** | Use the `impeccable` skill (Claude design) for landing-page, dashboard, plan-email, and iOS mockups. |
| 6 | **Affiliates** | Amazon Associates day 1 (account active). Etsy + FTD by month 3. Jewelry partners by month 6. |
| 7 | **Free tier** | **None.** Free destroys the cognitive trigger to plan. 14-day trial is the only on-ramp. |

---

## 15. Source documents
- Market research: [MARKET-RESEARCH.md](./MARKET-RESEARCH.md)
- Design direction: [DESIGN-BRIEF.md](./DESIGN-BRIEF.md)
- Archived V1 docs: [tasks/_archive/](./_archive/)
', 33, 'app-lovenotes/tasks/PRD.md'
FROM projects WHERE name = 'LoveNotes' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'README', '# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Read the chat transcripts first.** There are 2 chat transcript(s) in `send-my-love/chats/`. The transcripts show the full back-and-forth between the user and the design assistant — they tell you **what the user actually wants** and **where they landed** after iterating. Don''t skip them. The final HTML files are the output, but the chat is where the intent lives.

**Find the primary design file under `send-my-love/project/` and read it top to bottom.** The chat transcripts will tell you which file the user was last iterating on. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It''s much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don''t copy the prototype''s internal structure unless it happens to fit.

**Don''t render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won''t tell you anything they don''t.

## Bundle contents

- `send-my-love/README.md` — this file
- `send-my-love/chats/` — conversation transcripts (read these!)
- `send-my-love/project/` — the `Send My Love` project files (HTML prototypes, assets, components)
', 90, 'app-lovenotes/Design/Onboarding-handoff/send-my-love/README.md'
FROM projects WHERE name = 'LoveNotes' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'README', '# LoveNotes

> **$5/month subscription that helps husbands send daily love notes to their wives.**

Pick a vibe. Get a message. Copy and send. Simple.

---

## What is LoveNotes?

LoveNotes is a relationship-strengthening app that sends husbands daily SMS reminders with pre-written, personalized love messages to copy and send to their wives. No more "I''m not good with words" excuses.

### Key Features

- **8 Message Voices** - Quick, Flirty, Deep, Grateful, Sorry, Supportive, Proud, Playful
- **2,140+ Messages** - Enough content for 6+ years without repeats
- **Personalized** - Messages include your wife''s name
- **Never Repeats** - Smart rotation ensures fresh content
- **Cookie-based Auth** - Secure JWT authentication
- **Dark Mode Dashboard** - Beautiful, modern interface

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React 19, Tailwind CSS, shadcn/ui |
| **Backend** | Cloudflare Workers |
| **Database** | Cloudflare D1 (SQLite) |
| **Auth** | JWT tokens via httpOnly cookies |
| **Payments** | Stripe Checkout (pending) |
| **SMS** | Twilio (pending) |

---

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm or npm
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account (for D1 database)

### Installation

```bash
# Clone the repository
git clone https://github.com/realjbmangum/app-lovenotes.git
cd app-lovenotes

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at `http://localhost:3000`

### Running the Worker (API)

In a separate terminal:

```bash
# Log into Cloudflare (first time only)
wrangler login

# Start the worker dev server
wrangler dev --remote
```

The API will be running at `http://localhost:8787`

---

## Project Structure

```
app-lovenotes/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page with signup form
│   ├── dashboard/         # Message picker dashboard
│   │   └── page.tsx
│   ├── success/           # Post-signup confirmation
│   │   └── page.tsx
│   └── api/               # API routes
├── worker/                # Cloudflare Worker
│   └── index.ts          # API endpoints
├── lib/                   # Utilities
│   ├── api.ts            # API client + validation
│   └── utils.ts          # Helper functions
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── data/                  # Database files
│   ├── schema.sql        # D1 schema
│   ├── seed-voices.sql   # Message seed data
│   └── voices/           # Message JSON files
├── scripts/               # Build scripts
│   └── compile-voices.js # Compiles messages to SQL
├── tasks/                 # Project documentation
│   └── prd-lovenotes-mvp.md
├── wrangler.toml         # Cloudflare config
└── package.json
```

---

## API Reference

### Public Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/signup` | POST | Create new subscriber |
| `/api/messages/random` | GET | Get random message by theme |
| `/api/health` | GET | Health check |

### Protected Endpoints (Requires Auth Cookie)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/subscriber` | GET | Get current subscriber info |
| `/api/messages/next` | GET | Get next unseen message |

### Dev-Only Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/test/create-user` | POST | Create test user (blocked in prod) |

---

## Database Schema

```sql
-- Subscribers table
CREATE TABLE subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  wife_name TEXT NOT NULL,
  theme TEXT DEFAULT ''romantic'',
  frequency TEXT DEFAULT ''daily'',
  anniversary_date TEXT,
  stripe_customer_id TEXT,
  status TEXT DEFAULT ''trial'',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Messages library (2,140 messages)
CREATE TABLE messages (
  id INTEGER PRIMARY KEY,
  theme TEXT NOT NULL,
  content TEXT NOT NULL
);

-- Message history (prevents repeats)
CREATE TABLE subscriber_message_history (
  subscriber_id TEXT,
  message_id INTEGER,
  sent_at DATETIME,
  PRIMARY KEY (subscriber_id, message_id)
);
```

---

## Message Voices

| Voice | Count | Use Case |
|-------|-------|----------|
| `quick` | 50 | Fast, easy sends |
| `flirty` | 50 | Keep the spark alive |
| `deep` | 50 | Real emotional connection |
| `grateful` | 50 | Genuine appreciation |
| `sorry` | 50 | Real apologies |
| `supportive` | 50 | When she''s struggling |
| `proud` | 50 | Celebrating her wins |
| `playful` | 50 | Lighthearted fun |

**Total: 400 voice messages + 2,000+ themed messages = 2,140+ messages**

---

## Development Commands

```bash
# Start Next.js dev server
npm run dev

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Lint code
npm run lint

# Build for production
npm run build
```

### Cloudflare Commands

```bash
# Start worker locally (connects to remote D1)
wrangler dev --remote

# Seed messages to database
node scripts/compile-voices.js
wrangler d1 execute lovenotes-db --remote --file=data/seed-voices.sql

# Deploy worker to production
wrangler deploy
```

---

## Environment Variables

Create a `.env.local` file:

```bash
# API URL (worker)
NEXT_PUBLIC_API_URL=http://localhost:8787/api

# Stripe (when ready)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Twilio (when ready)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

---

## Deployment

### Frontend (Cloudflare Pages)

```bash
npm run build
# Deploy via Cloudflare Pages dashboard or Wrangler
```

### Backend (Cloudflare Workers)

```bash
wrangler deploy
```

---

## MVP Status

### Completed
- [x] Landing page with signup form
- [x] Mobile-responsive design
- [x] Success page with dashboard link
- [x] Dashboard with 8-voice selector
- [x] Cloudflare Worker API
- [x] D1 database with schema
- [x] 2,140+ messages seeded
- [x] Full signup flow working
- [x] JWT authentication with httpOnly cookies
- [x] CORS restricted to specific origins
- [x] Vitest test infrastructure

### Pending
- [ ] Stripe Checkout integration (needs API keys)
- [ ] Twilio SMS sending (needs credentials)
- [ ] Cron trigger for daily sends
- [ ] Production deployment

---

## Screenshots

### Landing Page
Beautiful gradient landing page with hero section, phone mockup, and call-to-action.

![Landing Page Hero](screenshots/01-landing-hero.png)

### How It Works
Three-step process explained with clean iconography.

![How It Works](screenshots/02-how-it-works.png)

### Pricing
Simple, honest pricing card with feature list.

![Pricing](screenshots/03-pricing.png)

### Signup Form
Clean form with validation for email, phone, wife''s name, and preferences.

![Signup Form](screenshots/04-signup-form.png)

### Success Page
Confirmation page after signup with next steps and personalized messaging.

![Success Page](screenshots/06-success.png)

### Dashboard
Dark-themed dashboard with 8 colorful voice buttons. Tap a vibe, get a message, copy and send.

![Dashboard](screenshots/05-dashboard.png)

### Mobile Views
Fully responsive design that works beautifully on mobile devices.

<p float="left">
  <img src="screenshots/07-mobile-landing.png" width="300" alt="Mobile Landing" />
  <img src="screenshots/08-mobile-dashboard.png" width="300" alt="Mobile Dashboard" />
</p>

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m ''Add amazing feature''`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - feel free to use this for your own projects.

---

## Support

For questions or issues, email: support@lovenotes.app

---

*Built with love for husbands who want to be better at showing it.*
', 90, 'app-lovenotes/README.md'
FROM projects WHERE name = 'LoveNotes' LIMIT 1;
