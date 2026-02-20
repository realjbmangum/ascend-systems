# Ascend Systems — GHL Architecture Blueprint

> This is the master plan for how GHL is structured. Every sub-account,
> every contact flow, every naming convention. Do not deviate.

---

## The Four Tiers

```
ASCEND SYSTEMS (GHL Agency — admin/billing)
│
├── TIER 1: HQ (1 sub-account)
│   └── Ascend HQ — Brian's sales CRM & operating system
│
├── TIER 2: DIRECTORY OUTREACH (1 per directory site)
│   ├── DIR-music-recordstops
│   ├── DIR-pharmacy-indiepharmacy
│   └── DIR-[vertical]-[directory-name]
│
├── TIER 3: VERTICAL DEMOS (1 per vertical you sell into)
│   ├── DEMO-music-minthill-records
│   ├── DEMO-pharmacy-carolina-pharmacy
│   ├── DEMO-pest-tactical-pest
│   └── DEMO-[vertical]-[mock-business-name]
│
└── TIER 4: CLIENT ACCOUNTS (1 per paying client)
    ├── CLIENT-music-bobs-vinyl
    ├── CLIENT-pest-garys-pest-co
    └── CLIENT-[vertical]-[business-name]
```

---

## Tier 1: Ascend HQ

**Brand:** Ascend Systems
**Purpose:** Brian's own sales pipeline and operating system

**What lives here:**
- Every Ascend prospect from ALL sources (tagged by source)
- Sales pipeline: Lead → Qualified → Demo Scheduled → Demo Done → Proposal Sent → Closed Won / Lost
- Brian's follow-up automations (after demo, after proposal, re-engage cold leads)
- Client onboarding checklist workflow
- Revenue tracking
- Brian's own calendar for demo bookings

**Who's in the CRM:**
- Prospects (from directories, cold outreach, referrals, Chamber, door-to-door)
- Active clients
- Churned clients

**Tags for source tracking:**
- `source:recordstops` — came from RecordStops outreach
- `source:pharmacy-dir` — came from pharmacy directory outreach
- `source:cold-outreach` — Brian found them manually
- `source:referral` — referred by existing client
- `source:inbound` — came through ascendsystems.com
- `source:chamber` — met at Chamber of Commerce
- `source:door-to-door` — Brian walked in

**This is the single source of truth for "how is Ascend the business doing?"**

---

## Tier 2: Directory Outreach Accounts

**Brand:** The directory (RecordStops, etc.)
**Purpose:** Find businesses, warm them up, identify Ascend prospects

**What lives here:**
- Enriched business listings (scraped + cleaned data)
- Outreach email sequences (directory-branded)
- Engagement tracking (opened, clicked, replied, claimed listing)
- Tags: `outreach-sent`, `engaged`, `premium-listing`, `ascend-warm`, `ascend-pitched`, `converted`

**What does NOT live here:**
- Ascend sales pipeline (that's in HQ)
- AI phone agents (that's in Demo accounts)
- Client delivery (that's in Client accounts)

**Outreach sequence example (RecordStops):**
1. Day 0: "Your store is featured on RecordStops" (value-first)
2. Day 3: "Here's how your listing is performing" (engagement data)
3. Day 7: "Claim your premium listing — add photos, hours, events"
4. Day 14: "Other stores in Charlotte are getting 3x more traffic with premium"
5. Day 21+: Nurture / newsletter (monthly roundup, industry tips)

**Handoff to Ascend:**
- When a contact is tagged `ascend-warm`, Brian manually adds them to Ascend HQ
- Brian pitches Ascend personally (call, meeting, walk-in) — NOT via automated email
- Once pitched, tag `ascend-pitched` in directory account
- Once converted, tag `converted` in directory account + mark Closed Won in HQ

---

## Tier 3: Vertical Demo Accounts

**Brand:** Ascend Systems (with a realistic mock business name)
**Purpose:** Close deals + serve as clone templates for new clients

### Each demo sub-account contains:

#### 1. AI Phone Agent
- Local area code phone number
- System prompt (personality, tone, knowledge)
- Full knowledge base (services, pricing, hours, FAQs, service area)
- Call flow: Greeting → Qualifying → Booking → Confirmation → Fallback
- After-call: text to owner, log in CRM, confirmation to caller

#### 2. Sample CRM Data (fake but realistic)
- 15-20 contacts in various pipeline stages
- Pipeline stages customized for vertical
- Notes, tags, activity history on each contact
- Makes the dashboard look alive during sales demos

#### 3. Automations / Workflows
- New lead notification (SMS to owner)
- Appointment reminder (SMS to customer, 24hr + 1hr before)
- Post-job review request (SMS + email, sent 2 hours after job)
- No-show follow-up
- Estimate follow-up (if they didn't book within 48 hours)
- Re-engagement (90 days no contact)
- Birthday / anniversary (if applicable)

#### 4. Reputation Management
- Google review request template (SMS + email)
- Review response templates (5-star thank you, 1-3 star recovery)
- Sample review data in dashboard

#### 5. Social Media Content
- 12-15 pre-built posts for the vertical
- Mix: tips (40%), promos (20%), behind-the-scenes (20%), reviews/social proof (20%)
- Posting schedule template (3x/week)

#### 6. Website / Funnel
- Landing page for the mock business
- Online booking form
- Contact form
- "Powered by Ascend Systems" footer link

#### 7. Email / SMS Templates
- Welcome / new customer
- Appointment confirmation
- Appointment reminder
- Review request
- Seasonal promotion (2-3 per vertical)
- Reactivation ("We miss you")
- Referral request

### Demo accounts to build (priority order):

| # | Vertical | Mock Business Name | Why First |
|---|----------|--------------------|-----------|
| 1 | Record Store / Music Retail | Mint Hill Records | Have RecordStops directory + data |
| 2 | Independent Pharmacy | Carolina Family Pharmacy | Have pharmacy directory + data |
| 3 | Pest Control | Tactical Pest & Termite Solutions | Real reference (Gary), strong use case |

**Future verticals (build as needed):**
- HVAC (e.g., Summit Air Solutions)
- Plumbing (e.g., CLT Plumbing Co)
- Dental (e.g., Bright Smile Family Dental)
- Legal (e.g., Mitchell & Associates)
- Auto Shop (e.g., Independence Auto Works)
- Restaurant (e.g., Dunwellz)
- Salon / Barbershop
- Veterinarian
- Contractor / Remodeling

---

## Tier 4: Client Accounts

**Brand:** Ascend Systems
**Purpose:** Deliver the product to paying clients

**Created by:** Cloning the relevant Vertical Demo account
**Customization checklist (15-minute onboarding):**
- [ ] Business name, address, hours
- [ ] Phone number (port existing or assign new + forwarding)
- [ ] Services and pricing
- [ ] Service area
- [ ] AI agent re-trained on their specific business
- [ ] Calendar / booking availability
- [ ] Google Business Profile connected (for reviews)
- [ ] Social accounts connected
- [ ] Owner notification preferences (SMS, email, both)
- [ ] Delete sample CRM data
- [ ] Test call to verify AI agent

---

## Naming Convention

All sub-accounts follow: `[TYPE]-[VERTICAL]-[NAME]`

| Type | Prefix | Example |
|------|--------|---------|
| HQ | `HQ-` | `HQ-ascend` |
| Directory | `DIR-` | `DIR-music-recordstops` |
| Demo | `DEMO-` | `DEMO-pest-tactical-pest` |
| Client | `CLIENT-` | `CLIENT-pest-garys-pest-co` |

Rules:
- All lowercase, hyphens only
- Vertical is a short keyword (music, pharmacy, pest, hvac, dental, legal, auto, food)
- Name is the business name abbreviated

---

## Contact Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│ LEAD SOURCES                                            │
│                                                         │
│  Directory outreach ──┐                                 │
│  Ascend website ──────┤                                 │
│  Cold outreach ───────┼──→ ASCEND HQ (Brian's pipeline) │
│  Referral ────────────┤    Lead → Qualified → Demo →    │
│  Chamber / networking ┤    Proposal → Closed Won/Lost   │
│  Door-to-door ────────┘                                 │
│                                                         │
│ DEMO                                                    │
│  Brian gives prospect the vertical demo phone number    │
│  Prospect calls → hears AI → impressed                  │
│  Brian shows dashboard in sales meeting                 │
│                                                         │
│ CLOSE                                                   │
│  Clone DEMO account → CLIENT account                    │
│  15-min customization → client is live                  │
│  Mark Closed Won in HQ                                  │
│  Tag "converted" in directory account (if applicable)   │
└─────────────────────────────────────────────────────────┘
```

---

## What Brian and I Build Together

For each vertical demo, I provide:
1. **AI Agent System Prompt** — full personality, instructions, boundaries
2. **Knowledge Base** — services, pricing, hours, FAQs, service area (I think like that business owner)
3. **Pipeline Stages** — customized for the vertical
4. **Sample CRM Contacts** — 15-20 fake but realistic contacts with notes
5. **Automation Workflows** — trigger, action, timing for each workflow
6. **Email/SMS Templates** — ready to paste into GHL
7. **Social Media Posts** — 12-15 posts ready to schedule
8. **Review Request Templates** — SMS + email copy
9. **Website Copy** — headline, subhead, services, CTA for the landing page

Brian creates the sub-account in GHL and configures each piece using my output.

---

## Immediate Next Steps

1. [ ] Create `HQ-ascend` sub-account (Brian's sales CRM)
2. [ ] Rename existing RecordStops sub-account → `DIR-music-recordstops`
3. [ ] Rename existing Pharmacy sub-account → `DIR-pharmacy-indiepharmacy`
4. [ ] Create `DEMO-music-minthill-records` sub-account
5. [ ] Build out Demo #1: Mint Hill Records (AI agent + full contents)
6. [ ] Test AI phone agent by calling it
7. [ ] Create `DEMO-pharmacy-carolina-pharmacy` sub-account
8. [ ] Build out Demo #2: Carolina Family Pharmacy
9. [ ] Create `DEMO-pest-tactical-pest` sub-account
10. [ ] Build out Demo #3: Tactical Pest & Termite Solutions
11. [ ] Update Ascend Systems website /demo page with real phone numbers
12. [ ] Update Ascend Systems website /pricing to reflect full platform

---

*Created: Feb 19, 2026*
*This document is the single source of truth for GHL architecture.*
