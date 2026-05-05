-- =============================================================================
-- Seed: PottyPro CRM (new project) + Brian Solomonson as lead + 3 docs as Resources
-- Run:  wrangler d1 execute ascend-db --remote --file=worker/db/seeds/2026-05-05-pottypro-crm-project.sql
-- =============================================================================

-- 1. Create the project under Lighthouse 27 internal client.
INSERT INTO projects (client_id, name, description, project_type, status, started_at)
SELECT id,
  'PottyPro CRM',
  'Broker CRM SaaS for portable sanitation / dumpster / temp-fencing rental industry. Built on top of Potty Directory''s 3,699-vendor dataset. Target: rental brokers managing 10-30 events/jobs/month who currently use Service Corps + spreadsheets. Pricing: $199-499/mo. Validation lead: Brian Solomonson (15+ yr industry, ex-brokerage owner, met at WWETT).',
  'internal_product',
  'in_progress',
  datetime('now')
FROM clients WHERE company_name = 'Lighthouse 27 LLC (Internal)' LIMIT 1;

-- 2. Add Brian Solomonson as a lead (validation customer / advisor)
INSERT INTO leads (name, email, company, project_type, message, status)
VALUES (
  'Brian Solomonson',
  '',
  'Waste Rentals (independent broker)',
  'PottyPro CRM advisor / target customer',
  'Met at WWETT 2026. 15+ years portable sanitation industry. Former brokerage owner (sold business). Now manages 10-30 events/construction jobs per month. Has 50+ supplier relationships across multiple states. Service Corps doesn''t fit broker workflow — wants real CRM for supplier mgmt, quote requests, order tracking. Validation source for the PottyPro CRM project. Email + bi-weekly call cadence proposed in tasks/ pending send.',
  'qualified'
);

-- 3. Load 3 docs as Resources on the new project
INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'PRD — Broker CRM Platform', '# Product Requirements Document: Broker CRM Platform

**Product Name:** Potty Directory Broker CRM
**Version:** 1.0 (Draft)
**Date:** January 30, 2026
**Author:** JBM
**Status:** 🟡 Planning - Awaiting Validation with Brian Solomonson

---

## Executive Summary

A broker-focused CRM platform for the portable sanitation, dumpster, and temporary fencing rental industry. The platform enables brokers to manage supplier relationships, send quote requests to multiple vendors, track orders through fulfillment, and analyze pricing trends—all built on top of the existing Potty Directory with 3,699+ verified suppliers.

**Target Users:** Rental brokers (former brokerage owners, independent operators, small brokerage teams)
**Primary Use Case:** Replace Service Corps and manual spreadsheets with purpose-built broker workflow
**Business Model:** SaaS subscription ($199-499/mo per broker)

---

## Problem Statement

### Current State (Pain Points)

Brokers in the portable sanitation and rental equipment industry face significant operational challenges:

1. **Supplier Management is Manual**
   - No centralized database of trusted suppliers
   - Pricing history scattered across emails and spreadsheets
   - No performance tracking (on-time delivery, quality issues)
   - Availability information is always out-of-date

2. **Quote Requests are Inefficient**
   - Call/email 5-10 suppliers individually for every customer request
   - Wait hours or days for responses
   - Difficult to compare pricing across suppliers
   - No standardized format for quotes

3. **Service Corps Doesn''t Solve This**
   - Generic platform not built for rental brokerage workflows
   - Missing critical features (pricing intelligence, availability calendar)
   - Poor UX for broker-specific tasks
   - Built by people who''ve never run a rental business

4. **Order Tracking is Chaotic**
   - No visibility into delivery status
   - Confirmation relies on phone calls or texts
   - Revenue reporting done manually in spreadsheets
   - Hard to track supplier performance over time

### Impact

- **Time waste:** 10-15 hours/week on manual quote requests and supplier coordination
- **Lost revenue:** Slow quote turnaround = lost deals to faster competitors
- **Poor decisions:** No pricing data = can''t optimize margins or choose best suppliers
- **Scalability bottleneck:** Can''t grow beyond ~20-30 active orders/month without hiring help

---

## Target Users

### Primary Persona: Brian (The Experienced Broker)

**Background:**
- Former brokerage owner (sold business)
- Now works independently or for Waste Rentals
- 15+ years in portable sanitation industry
- Manages 10-30 events/construction jobs per month
- Has relationships with 50+ suppliers across multiple states

**Goals:**
- Streamline quote process (respond to customers in minutes, not hours)
- Build pricing intelligence (know fair market rates by city/season)
- Track supplier performance (which vendors deliver on time?)
- Manage customer relationships (quote history, repeat clients)
- Grow revenue without hiring staff

**Pain Points:**
- Service Corps doesn''t fit broker workflow
- Spreadsheets everywhere (suppliers, pricing, customers)
- Too much time on phone/email chasing quotes
- Hard to scale beyond current capacity

**Tech Savvy:** Moderate - uses email, Zoom, Google Sheets, basic software

---

### Secondary Persona: Sarah (The New Broker)

**Background:**
- Worked for large rental company for 5 years
- Starting independent brokerage
- Small customer base (~10 jobs/month)
- Limited supplier network (20-30 vendors)

**Goals:**
- Build supplier rolodex quickly (find reliable vendors by city)
- Learn market pricing (what should I charge for porta-potties in Austin?)
- Look professional to customers (fast quotes, organized)
- Grow customer base efficiently

**Pain Points:**
- Doesn''t have decades of industry relationships like Brian
- Unsure of fair pricing (risk of over/under-quoting)
- Manual processes don''t scale
- Hard to compete with established brokers

---

## Product Vision

### Mission Statement

**"Give rental brokers the tools to manage supplier relationships, win more deals, and scale their business—without the spreadsheets and phone tag."**

### Long-Term Vision (18-24 months)

The platform becomes the **operating system for rental brokers**:
- All supplier relationships managed in one place
- Quote requests sent in seconds, not hours
- Pricing intelligence shows fair market rates in real-time
- Order tracking provides delivery visibility and performance metrics
- Customer CRM tracks quote history and repeat business
- Platform fee (3%) on transactions creates revenue share with brokers

### Success Metrics (12 months)

- **100 paying broker accounts** ($199/mo tier)
- **500+ suppliers** upgraded to Pro tier ($199/mo) for quote response access
- **2,000+ quote requests** per month flowing through platform
- **$200k+ MRR** (Monthly Recurring Revenue)
- **80% retention** rate for brokers after 6 months

---

## User Stories

### Epic 1: Supplier Management

**As a broker, I want to...**

1. **Build a supplier rolodex**
   - Search directory for suppliers by city + service type
   - "Claim" suppliers to add them to my personal rolodex
   - Add private notes (e.g., "Great for weddings, slow on construction")
   - Tag suppliers (e.g., "Preferred", "Emergency Only", "Austin Area")

2. **Track pricing history**
   - See past quotes from each supplier (what did they charge last time?)
   - Compare pricing across suppliers for similar jobs
   - View pricing trends over time (seasonal fluctuations)

3. **Rate supplier performance**
   - Mark deliveries as on-time or late
   - Rate quality (equipment condition, professionalism)
   - See aggregate performance score (4.5 stars over 20 orders)
   - Filter rolodex by highest-rated suppliers

4. **Check availability**
   - See supplier''s availability calendar (if they provide it)
   - Know which suppliers have capacity before sending quote request

**Acceptance Criteria:**
- Broker can search directory and claim suppliers in under 30 seconds
- Notes and tags are private (only visible to broker, not supplier)
- Pricing history shows date, service type, quote amount, and job details
- Performance ratings are calculated automatically from order tracking data

---

### Epic 2: Quote Request Workflow

**As a broker, I want to...**

1. **Create quote requests quickly**
   - Fill out form: Customer name, job date, location, service type, details
   - Select 3-5 suppliers from my rolodex
   - Send request to all suppliers with one click
   - Set expiration (e.g., "Need response by tomorrow 5pm")

2. **Receive and compare quotes**
   - Get email notification when supplier responds
   - View all quotes in one dashboard (side-by-side comparison)
   - See supplier''s past performance rating alongside quote
   - Accept best quote with one click

3. **Respond to customers fast**
   - Draft quote request in under 2 minutes
   - Receive supplier responses within hours (not days)
   - Add margin and send to customer (quote → customer quote with markup)

4. **Track quote status**
   - See quote pipeline: Draft → Sent → Quoted → Accepted → Rejected
   - Know which suppliers haven''t responded yet
   - Follow up with non-responsive suppliers

**Acceptance Criteria:**
- Quote request form takes under 2 minutes to complete
- Suppliers receive email + in-app notification immediately
- Quote comparison dashboard shows all responses in sortable table
- Broker can accept quote and convert to order in one click

---

### Epic 3: Order Tracking

**As a broker, I want to...**

1. **Track order status**
   - Pipeline: Confirmed → Delivered → Invoiced → Paid
   - Get notification when supplier marks delivery complete
   - See delivery photos (if supplier uploads them)
   - Confirm delivery with customer

2. **Manage invoicing**
   - Track what I charged customer vs. what supplier charged me
   - See margin/profit for each order
   - Export invoice data for accounting (CSV or QuickBooks integration)

3. **Analyze revenue**
   - Dashboard: Total revenue, profit margin, orders per month
   - Breakdown by service type (potties vs dumpsters vs fencing)
   - Top customers (repeat business)
   - Top suppliers (most orders placed)

4. **Review supplier performance**
   - On-time delivery rate per supplier
   - Average rating per supplier
   - Total orders placed with each supplier

**Acceptance Criteria:**
- Order status updates in real-time when supplier takes action
- Revenue dashboard shows accurate profit margins
- Performance metrics calculate automatically from order data
- Broker can export order history to CSV in under 10 seconds

---

### Epic 4: Pricing Intelligence

**As a broker, I want to...**

1. **See market pricing**
   - What are porta-potties going for in Austin this month?
   - Average price for 20-yard dumpster in Phoenix
   - Price ranges (low, average, high) by city and service

2. **Get pricing suggestions**
   - Platform suggests fair markup based on historical data
   - Warning if my quote is significantly below/above market rate

3. **Understand seasonality**
   - Peak season pricing (e.g., porta-potties in summer vs winter)
   - Event pricing vs construction pricing

**Acceptance Criteria:**
- Pricing intelligence shows data from last 90 days minimum
- Data is anonymized (brokers can''t see competitor''s exact pricing)
- Suggestions are optional (broker can override)

---

### Epic 5: Customer Management (Future)

**As a broker, I want to...**

1. **Track customer history**
   - See all past quote requests for a customer
   - Know if they''re a repeat customer
   - Track win rate (how many quotes convert to orders)

2. **Manage customer contacts**
   - Store customer details (name, email, phone, company)
   - Tag customers (e.g., "Event Planner", "Construction", "VIP")

**Acceptance Criteria:**
- Customer profiles show quote and order history
- Win rate calculates automatically

---

## Supplier-Side Features

### Epic 6: Supplier Quote Response

**As a supplier, I want to...**

1. **Receive quote requests**
   - Email notification when broker sends quote request
   - In-app dashboard shows all pending quote requests
   - See job details (date, location, service type, special requests)

2. **Respond to quotes**
   - Fill out quote form (price, availability, notes)
   - Submit quote to broker
   - Track status (pending, accepted, rejected)

3. **Manage availability**
   - Update availability calendar (which days I have capacity)
   - Set service areas (cities I cover)
   - Mark inventory levels (10 standard units available, 2 luxury trailers)

4. **Track order status**
   - See confirmed orders from brokers
   - Upload delivery photo as proof
   - Mark order complete

**Acceptance Criteria:**
- Supplier receives email within 1 minute of quote request
- Quote response form takes under 3 minutes to complete
- Availability calendar syncs with quote request system
- Delivery photo uploads work on mobile (suppliers in the field)

---

## Technical Architecture

### Platform Components

**Frontend (Broker Dashboard):**
- Framework: Astro (existing) or SvelteKit (if need more interactivity)
- URL: `pottydirectory.com/dashboard`
- Authentication: Supabase Auth (email/password, magic link)
- Real-time updates: Supabase Realtime (quote responses, order status)

**Frontend (Supplier Portal):**
- URL: `pottydirectory.com/supplier`
- Same tech stack as broker dashboard
- Mobile-first design (suppliers often in trucks)

**Backend:**
- Database: Supabase (PostgreSQL)
- API: Astro API routes or Supabase Edge Functions
- File storage: Supabase Storage (delivery photos)

**Notifications:**
- Email: SendGrid or Resend
- In-app: Supabase Realtime
- SMS (future): Twilio for urgent quote requests

**Billing:**
- Stripe for subscriptions and transaction fees
- Pricing tiers: Starter ($199/mo), Pro ($499/mo)

---

### Database Schema (New Tables)

**broker_accounts:**
```sql
id, user_id, company_name, subscription_tier,
stripe_customer_id, stripe_subscription_id,
active, created_at
```

**broker_supplier_relationships:**
```sql
id, broker_id, vendor_id, notes, tags,
preferred, avg_rating, total_orders, created_at
```

**quote_requests:**
```sql
id, broker_id, customer_name, event_date,
delivery_location, service_type, details (jsonb),
status, expires_at, created_at
```

**quote_responses:**
```sql
id, quote_request_id, vendor_id, quoted_amount,
availability_confirmed, notes, status, created_at
```

**orders:**
```sql
id, quote_request_id, broker_id, vendor_id,
customer_price, vendor_cost, broker_margin, platform_fee,
status, delivery_photo_url, delivered_at, created_at
```

**vendor_availability:**
```sql
id, vendor_id, service_type, date_range,
units_available, notes, created_at
```

---

## Monetization Strategy

### Broker Pricing Tiers

**Starter - $199/month:**
- Unlimited supplier rolodex
- 50 quote requests/month
- Order tracking
- Basic revenue reporting
- Email support

**Pro - $499/month:**
- Everything in Starter
- Unlimited quote requests
- Pricing intelligence dashboard
- API access (integrate with own systems)
- Priority support
- White-label option (custom branding)

### Supplier Pricing Tiers

**Free:**
- Basic listing in directory
- Receive quote requests (via email only)

**Featured - $99/month:**
- Gold badge in directory
- Top of search results
- Featured on state/city pages

**Pro - $199/month:**
- Everything in Featured
- In-app quote response dashboard
- Availability calendar
- Performance analytics
- Priority placement in broker quote requests

### Transaction Fees (Future)

**3% platform fee on confirmed orders:**
- Broker books order through platform
- Supplier fulfills order
- Platform takes 3% fee from broker margin
- Automated invoicing and payment processing

**Example:**
- Customer pays broker: $500
- Broker pays supplier: $350
- Broker margin: $150
- Platform fee (3% of $500): $15
- Broker keeps: $135

**Target:** $50k/month in transaction fees by month 12

---

## MVP Feature Set (Phase 1)

**Must Have for Launch:**

1. **Authentication & Accounts**
   - Broker signup and login
   - Subscription management (Stripe integration)
   - User profiles

2. **Supplier Rolodex**
   - Search directory for suppliers
   - Claim suppliers to rolodex
   - Add notes and tags
   - View supplier details (pulled from existing directory)

3. **Basic Quote Requests**
   - Create quote request form
   - Select suppliers from rolodex
   - Send email notifications to suppliers
   - Supplier responds via email (manual for MVP)

4. **Order Tracking (Manual)**
   - Create order record when quote accepted
   - Manual status updates (broker updates status)
   - Basic revenue tracking (customer price vs supplier cost)

5. **Dashboard**
   - Quote request list (pending, sent, accepted)
   - Order list (active orders)
   - Simple stats (total orders, revenue this month)

**Intentionally Excluded from MVP:**
- Supplier in-app quote response (email-based for MVP)
- Availability calendar (Phase 2)
- Pricing intelligence (Phase 2)
- Automated invoicing (Phase 2)
- Customer CRM (Phase 3)
- Transaction fees (Phase 3)

---

## MVP User Flow

### Broker Onboarding (First Use)

1. Broker signs up at `pottydirectory.com/signup`
2. Fills out profile (company name, phone, service areas)
3. Chooses subscription tier (Starter or Pro)
4. Enters payment info (Stripe Checkout)
5. Lands on dashboard (empty state with tutorial)

### Creating First Quote Request

1. Click "New Quote Request"
2. Fill out form:
   - Customer name: "ABC Construction"
   - Event date: "2026-03-15"
   - Location: "Austin, TX"
   - Service type: "Porta Potties"
   - Details: "Need 5 standard units for construction site, 3-month rental"
3. Click "Select Suppliers"
4. Searches directory: "porta potty Austin"
5. Claims 5 suppliers to rolodex
6. Selects 3 suppliers for this quote
7. Clicks "Send Quote Request"
8. Suppliers receive email:
   - Subject: "Quote Request from [Broker Name]"
   - Body: Job details, respond by email or phone
9. Broker waits for responses (1-24 hours)
10. Supplier emails back: "$500 for 5 units, 3-month rental"
11. Broker manually creates quote response record in dashboard
12. Compares quotes, selects best option
13. Marks quote as "Accepted" → creates order
14. Responds to customer with marked-up price ($650)

### Managing Active Orders

1. Dashboard shows active orders
2. Broker calls supplier to confirm delivery
3. Marks order as "Delivered" in dashboard
4. Gets delivery confirmation from customer
5. Updates order to "Invoiced"
6. Tracks revenue (customer paid $650, supplier cost $500, margin $150)

---

## Success Criteria

### MVP Success (3 months after launch)

- **5+ paying broker accounts** (beta users, including Brian)
- **50+ quote requests** sent through platform
- **20+ orders** tracked to completion
- **80% user satisfaction** (would recommend to other brokers)
- **Key feedback collected** for Phase 2 features

### Phase 2 Success (6 months)

- **25+ broker accounts**
- **100+ suppliers** using Pro tier for quote response
- **500+ quote requests** per month
- **Pricing intelligence** launched with 90 days of data
- **Availability calendar** in use by top 50 suppliers

### Phase 3 Success (12 months)

- **100+ broker accounts**
- **500+ Pro suppliers**
- **2,000+ quote requests** per month
- **Transaction processing** live (3% platform fee)
- **$200k+ MRR** (subscriptions + transaction fees)

---

## User Research & Validation

### Questions for Brian (Next Calls)

**Supplier Management:**
1. How many suppliers do you typically work with? (Total and "preferred")
2. What information do you track about each supplier?
3. How do you currently manage supplier contacts and notes?
4. What makes a supplier "preferred" vs backup?

**Quote Workflow:**
1. Walk me through your current quote request process (step-by-step)
2. How long does it take to get quotes back from suppliers?
3. What information do you need in a quote to compare suppliers?
4. How often do suppliers fail to respond?

**Pricing:**
1. How do you determine what to charge customers?
2. What''s your typical margin? (% markup)
3. How do you know if you''re getting a fair price from suppliers?
4. Does pricing vary significantly by city or season?

**Order Tracking:**
1. What information do you need to track for active orders?
2. How do you currently track revenue and margins?
3. What reports do you wish you had?

**Pain Points:**
1. What takes the most time in your current workflow?
2. What''s the most frustrating part of being a broker?
3. If you could automate one thing, what would it be?

**Service Corps:**
1. What specifically doesn''t work about Service Corps?
2. What features are missing that you need?
3. What would make you switch to a new platform?

---

## Open Questions

**Before Building:**
1. ✅ Should brokers see pricing from other brokers? (Answer: No - anonymized aggregates only)
2. ❓ Do suppliers want in-app quote response or is email sufficient? (Ask suppliers)
3. ❓ What''s fair pricing for broker subscription? ($199 vs $299 vs $499?)
4. ❓ Should we charge suppliers for quote response access? (Pro tier at $199/mo?)
5. ❓ Transaction fees: 3% is reasonable or too high? (Ask Brian)

**During MVP:**
1. How much email vs in-app notifications do brokers want?
2. Mobile app needed or mobile-responsive web is enough?
3. Integration with QuickBooks/accounting software? (Priority?)

---

## Risks & Mitigations

### Risk 1: Suppliers Don''t Respond to Quotes
**Impact:** High - platform useless if suppliers ignore quote requests
**Mitigation:**
- Offer Pro tier to suppliers (in-app dashboard makes responding easy)
- Track response rates and surface high-responders to brokers
- Allow brokers to rate supplier responsiveness

### Risk 2: Brokers Don''t Want to Pay $199/mo
**Impact:** High - no revenue if pricing is wrong
**Mitigation:**
- Validate pricing with Brian and other brokers before launch
- Offer free trial (30 days)
- Show ROI calculator (time saved = money saved)
- Start lower ($99/mo) if needed to prove value

### Risk 3: Service Corps Copies Features
**Impact:** Medium - they have market share and resources
**Mitigation:**
- Move fast - launch MVP in 3-4 months
- Focus on broker-specific features they can''t easily replicate
- Build direct relationships with brokers (community, not just software)

### Risk 4: Low Adoption (Chicken-Egg Problem)
**Impact:** High - need both brokers and suppliers to create value
**Mitigation:**
- Start with directory (already have 3,699 suppliers)
- Target broker beta users first (Brian + 5-10 others)
- Suppliers already on platform (easier to upgrade than recruit)

### Risk 5: Technical Complexity
**Impact:** Medium - CRM is more complex than static directory
**Mitigation:**
- Start with MVP (simple features, email-based quotes)
- Use proven tech stack (Supabase, Astro, Stripe)
- Hire contractor if needed for specific features

---

## Timeline & Milestones

### Month 1-2: Research & Design
- [ ] 5+ calls with Brian to validate features
- [ ] Interview 3-5 other brokers for feedback
- [ ] Finalize MVP feature set
- [ ] Design wireframes for broker dashboard
- [ ] Design supplier quote response flow

### Month 3-4: Build MVP
- [ ] Set up authentication (Supabase Auth)
- [ ] Build supplier rolodex (search, claim, notes)
- [ ] Build quote request form
- [ ] Build order tracking dashboard
- [ ] Integrate Stripe for subscriptions
- [ ] Email notification system

### Month 5: Beta Launch
- [ ] Recruit 5-10 broker beta users (including Brian)
- [ ] Launch MVP to beta users
- [ ] Collect feedback (bi-weekly calls)
- [ ] Fix bugs and iterate on UX

### Month 6-8: Phase 2 Features
- [ ] Supplier in-app quote response
- [ ] Availability calendar
- [ ] Pricing intelligence dashboard
- [ ] Performance analytics

### Month 9-12: Scale & Phase 3
- [ ] Public launch (open to all brokers)
- [ ] Recruit suppliers to Pro tier
- [ ] Build transaction processing (3% platform fee)
- [ ] Customer CRM features
- [ ] Target: 100 broker accounts, $200k MRR

---

## Next Steps

1. **Send email to Brian** → schedule first call
2. **Conduct 5 validation calls** with Brian (bi-weekly)
3. **Refine PRD** based on feedback
4. **Get sign-off** from Brian on MVP features
5. **Begin Phase 3 development** (3-4 months from now)

---

## Appendix: Competitive Landscape

**Service Corps:**
- Generic platform for service businesses (not rental-specific)
- Missing broker workflows (quote comparison, pricing intelligence)
- Poor UX for rental industry
- Opportunity: Build rental-specific features they can''t easily replicate

**Spreadsheets + Email:**
- Current solution for most brokers
- Free but time-consuming and error-prone
- Opportunity: Show ROI of time saved = money saved

**Other CRMs (Salesforce, HubSpot):**
- Generic sales CRM, not rental brokerage workflow
- Expensive and complex
- Opportunity: Purpose-built, affordable, easy to use

**No direct competitors** in rental brokerage CRM space → **blue ocean opportunity**

---

**Document Status:** 🟡 Draft - Awaiting validation with Brian Solomonson
**Last Updated:** January 30, 2026
**Next Review:** After 3-5 calls with Brian (February-March 2026)', 1, 'site-pottydirectory/PRD-BROKER-CRM-PLATFORM.md'
FROM projects WHERE name = 'PottyPro CRM' ORDER BY id DESC LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'Phase 2 Ready to Execute', '# Phase 2 Multi-Service Expansion - Ready to Execute

**Status:** ✅ Planning Complete | 🔧 Ready for Implementation
**Created:** January 30, 2026

---

## What Was Built Today

### 1. Database Migration (Production-Ready)
**File:** `data/phase2-multi-service-migration.sql`

This SQL file:
- Adds `service_types` array column (which services vendor offers)
- Adds service-specific columns: `dumpster_services_offered`, `fencing_services_offered`
- Renames `services_offered` → `potty_services_offered` for clarity
- Creates `service_types` config table (potties, dumpsters, fencing)
- Backfills all 3,699 existing vendors with `service_types = ''{potties}''`
- Creates GIN indexes for fast array queries
- **Includes rollback plan** if anything goes wrong

**Safe to run:** Yes - includes verification queries and rollback commands.

---

### 2. Updated TypeScript Code
**File:** `src/lib/supabase-phase2.ts`

New features:
- All query functions support `serviceType` filter parameter
- `getVendorsByService(''dumpsters'')` - get all dumpster vendors
- `getSiteStats(''dumpsters'')` - stats for specific service
- Updated `Vendor` interface with multi-service fields
- Backward compatible (existing code works unchanged)

**How to use:**
```typescript
// Get all vendors (all services)
const vendors = await getVendors();

// Get only dumpster vendors
const dumpsters = await getVendors(undefined, ''dumpsters'');

// Get Texas porta-potty vendors
const texasPotties = await getVendorsByState(''Texas'', ''potties'');
```

---

### 3. Site Configuration Update
**File:** `src/data/site-config-phase2.json`

Changes:
- Updated tagline to include all 3 services
- Added `services` array with metadata (slug, name, icon, description)
- Added `features.multiServiceEnabled` feature flag (OFF by default)
- Updated stats to reflect current vendor count (3,699+)

**Feature Flag Strategy:**
Deploy code with flag OFF → test → flip flag ON → full multi-service mode

---

### 4. Data Collection Scripts
**Files:**
- `scripts/outscraper-dumpster-vendors.js`
- `scripts/outscraper-fencing-vendors.js`

What they do:
- Scrape Google Maps for dumpster/fencing vendors (20 top cities)
- Deduplicate by phone number or name+city
- Infer service offerings from business description
- Generate SQL INSERT statements ready to paste in Supabase
- Handle multi-service vendors (append to service_types array)

**Requirements:**
- Outscraper API key (free tier: 5 requests/day)
- `npm install outscraper`

**Output:**
- `data/dumpster-vendors-raw.json` (scraped data)
- `data/dumpster-vendors-import.sql` (ready to import)

---

### 5. Implementation Checklist
**File:** `PHASE2-IMPLEMENTATION-PLAN.md`

Comprehensive 15-step guide covering:
- **Phase 2A:** Database migration (Week 1)
- **Phase 2B:** Data collection with Outscraper (Week 2-3)
- **Phase 2C:** UI/UX updates (Week 4)
- **Phase 2D:** SEO content & deployment (Week 5)

Each step includes:
- Exact commands to run
- Verification queries
- Expected results
- Rollback procedures

---

## Domain Strategy Decision

**Chosen Approach:** Hybrid Strategy ✅

1. **Core Platform:** pottydirectory.com
   - Expand to multi-service (potties + dumpsters + fencing)
   - Preserve all existing SEO value
   - Single codebase, single database

2. **Marketing Aliases:** Optional vanity domains (if available)
   - Example: `rentalsdirectory.com` → 301 redirect → `pottydirectory.com`
   - Use in marketing materials for credibility
   - Not required - can skip if domains unavailable/expensive

3. **URL Structure:** Location-first (no changes)
   - `/texas/houston/abc-rentals` - vendor detail (shows all their services)
   - `/texas?service=dumpsters` - filter by service (query param)
   - `/dumpsters` - service landing page

**Why this works:**
- ✅ Preserve existing SEO rankings
- ✅ Enable Phase 3 CRM (single platform for brokers)
- ✅ No 301 redirects = no traffic loss
- ✅ Low cost (~$20/year for vanity domains if desired)

---

## What Happens Next (Your Choice)

### Option A: Execute Phase 2 Now (2-3 months)

**Week 1: Database Migration**
1. Backup Supabase database
2. Run `data/phase2-multi-service-migration.sql` in Supabase SQL Editor
3. Replace `src/lib/supabase.ts` with Phase 2 version
4. Update `src/data/site-config.json`
5. Test build locally

**Week 2-3: Data Collection**
1. Get Outscraper API key
2. Run scraper scripts (or use free tier over 80 days)
3. Import dumpster vendors
4. Import fencing vendors
5. Verify multi-service vendor deduplication

**Week 4: UI Updates**
1. Update VendorCard with service badges
2. Add service dropdown to Header
3. Create service landing pages (/dumpsters, /fencing)
4. Add service filtering to state/city pages
5. Update vendor detail for multi-service tabs

**Week 5: Deploy**
1. Test build on preview branch
2. Enable feature flag
3. Deploy to production
4. Submit updated sitemap to Google
5. Monitor for 404 errors

**Timeline:** 2-3 months (flexible based on data collection speed)

---

### Option B: Defer Phase 2 (Focus on Other Projects)

**Keep these files for later:**
- All migration and implementation files are ready
- Can execute Phase 2 anytime (3 months, 6 months, 1 year from now)
- No urgency - current site is stable and performing well

**Alternative priorities:**
- Continue email outreach to existing potty vendors
- Build backlinks for better SEO
- Wait for Google to fully index current 6,000 pages
- Focus on other directory sites or apps

---

## Cost Summary

| Item | Free Tier | Paid Option | Notes |
|------|-----------|-------------|-------|
| **Outscraper API** | 5 requests/day | $49/mo (5,000 requests) | 80 days to scrape 100 cities on free tier |
| **Vanity Domains** | N/A | $10-20/year | Optional marketing aliases |
| **Supabase** | 10GB database | N/A | Free tier handles 10,000+ vendors easily |
| **Cloudflare Pages** | Unlimited builds | N/A | Free tier sufficient |
| **Total** | **$0** | **$0-49/mo** | Can be done entirely free (slower) |

**Recommendation:** Use Outscraper free tier (5 req/day) to scrape gradually over 2-3 months.

---

## Phase 3 CRM Preview (6-12 months out)

Once Phase 2 is stable and generating multi-service traffic:

**Features:**
- Broker accounts (Supabase Auth)
- Supplier rolodex (track vendors, pricing, notes)
- Quote request system (broker sends to suppliers, suppliers respond)
- Order tracking (delivery confirmation, revenue reporting)
- Subscription billing ($199-499/mo for brokers)

**Platform URL:** `pottydirectory.com/dashboard` (requires login)

**Validation:** Brian Solomonson committed to beta testing.

---

## Files Created (All in site-pottydirectory/)

```
data/
  phase2-multi-service-migration.sql    ← Database migration

src/
  lib/supabase-phase2.ts                ← Updated query functions
  data/site-config-phase2.json          ← Updated site config

scripts/
  outscraper-dumpster-vendors.js        ← Dumpster scraper
  outscraper-fencing-vendors.js         ← Fencing scraper

PHASE2-IMPLEMENTATION-PLAN.md           ← 15-step execution guide
PHASE2-READY-TO-EXECUTE.md              ← This file
progress.txt                            ← Updated with session notes
```

---

## Decision Points

Before starting Phase 2:

1. **Data Collection Budget**
   - Use Outscraper free tier (slow but free)?
   - Pay $49/mo for faster scraping?
   - Use alternative data sources?

2. **Timeline**
   - Execute Phase 2 now (2-3 months)?
   - Defer to later (focus on other priorities)?
   - Gradual approach (migrate DB now, add data over 6 months)?

3. **Vanity Domains**
   - Buy alternative domains for marketing?
   - Skip and just use pottydirectory.com?

4. **Phase 3 Commitment**
   - Plan to build CRM platform after Phase 2?
   - Keep Phase 2 standalone (just expand directory)?

---

## Rollback Safety

**If Phase 2 breaks something:**

1. **Feature Flag Rollback** (no data loss)
   ```json
   "features": { "multiServiceEnabled": false }
   ```
   Commit and push → site returns to potty-only mode.

2. **Database Rollback** (if needed)
   Run rollback SQL at bottom of migration file.

3. **Code Rollback**
   ```bash
   git revert HEAD && git push origin main
   ```

**Risk Level:** Low - all changes are backward compatible with feature flag.

---

## Next Steps (When Ready)

1. **Decide:** Execute now, defer, or gradual approach?
2. **If executing now:**
   - Backup Supabase database
   - Run Phase 2A (database migration)
   - Get Outscraper API key
   - Follow PHASE2-IMPLEMENTATION-PLAN.md

3. **If deferring:**
   - Files are ready whenever you want to start
   - No action needed - current site is stable

---

**Questions?** All implementation details are in `PHASE2-IMPLEMENTATION-PLAN.md`.

Ready to begin? Let me know when you want to run the database migration!', 2, 'site-pottydirectory/PHASE2-READY-TO-EXECUTE.md'
FROM projects WHERE name = 'PottyPro CRM' ORDER BY id DESC LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'template', 'Email — Brian Solomonson Phase 2 vision (DRAFT, unsent)', '**To:** Brian Solomonson
**From:** [Your Name]
**Subject:** Following up from WWETT

---

Hey Brian,

Thanks for the time at WWETT. Your insights on the brokerage side and Service Corps pain points were really valuable—helped clarify the direction.

Here''s what I heard: brokers need a real CRM for supplier relationships, quote management, and order tracking. Something built for how you actually work, not generic software that misses the mark.

Long-term vision is to build exactly that—a broker-focused platform on top of the directory. While I''m cleaning up the potty directory (still got work to do there), I''d like to start sketching out ideas with you in parallel. Regular calls to architect this thing right from the start.

Would you be open to that? Maybe bi-weekly or monthly to bounce ideas around and make sure we''re building what actually solves the problem?

Also—do you think we need a formal PRD or business plan for this, or should we start more informal and iterate?

Let me know what works.

Appreciate you,

[Your Name]', 3, 'site-pottydirectory/email-brian-phase2-vision.md'
FROM projects WHERE name = 'PottyPro CRM' ORDER BY id DESC LIMIT 1;

-- 4. Baseline tasks for PottyPro CRM (urgent + high)
INSERT INTO tasks (type, title, description, priority, project_id, lead_id) VALUES
  ('relationship', 'Send the WWETT follow-up email to Brian Solomonson (DRAFT exists in Resources)', 'Email body is in Resources tab → "Email — Brian Solomonson Phase 2 vision (DRAFT, unsent)". Add your name + send today. The single highest-leverage action — he''s the validation lead and a potential paying customer 1.', 'urgent', (SELECT id FROM projects WHERE name='PottyPro CRM' ORDER BY id DESC LIMIT 1), (SELECT id FROM leads WHERE name='Brian Solomonson' ORDER BY id DESC LIMIT 1)),
  ('relationship', 'Schedule first call with Brian Solomonson (bi-weekly cadence)', 'Per the email proposal. Use the call to validate the existing PRD against his actual workflow. Take notes; come back and edit the PRD with what you learn.', 'urgent', (SELECT id FROM projects WHERE name='PottyPro CRM' ORDER BY id DESC LIMIT 1), (SELECT id FROM leads WHERE name='Brian Solomonson' ORDER BY id DESC LIMIT 1)),
  ('decision', 'Decide brand: PottyPro vs alternative (PottyBroker, RentalDesk, ServiceLane?)', '"PottyPro" might be too literal — narrows to potties when the PRD covers dumpsters + fencing too. Brian Solomonson''s feedback should drive this.', 'high', (SELECT id FROM projects WHERE name='PottyPro CRM' ORDER BY id DESC LIMIT 1), NULL);

INSERT INTO tasks (type, title, description, priority, project_id) VALUES
  ('decision', 'Decide pricing tier split — what''s in  vs ?', 'PRD says $199-$499/mo per broker. Validate which features are upsell vs base with Brian Solomonson on the first call.', 'high', (SELECT id FROM projects WHERE name='PottyPro CRM' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Audit existing /pro/ landing page (currently noindex) — take to launch quality', 'Pages exist: index/login/signup/api/auth/suppliers + 3 dashboard mockup screenshots in public/images/pottypro-*.png. Pull off noindex once content is real, not before.', 'high', (SELECT id FROM projects WHERE name='PottyPro CRM' ORDER BY id DESC LIMIT 1)),
  ('product_dev', 'Decide architecture — extend Potty Directory (Astro+Supabase) or new app on Ascend stack', 'Tradeoff: extend = ships faster, shares vendor data. New app = clean separation, easier per-tenant billing. Mirror the Path A vs B decision from Contract Review SaaS.', 'high', (SELECT id FROM projects WHERE name='PottyPro CRM' ORDER BY id DESC LIMIT 1)),
  ('content', 'Re-run portfolio-triage skill on PottyPro CRM (after Brian Solomonson''s first call validates direction)', 'Triage with real customer input. Output: refined PRD + tasks. Don''t triage before the call — the existing PRD is hypothesis, not validated.', 'medium', (SELECT id FROM projects WHERE name='PottyPro CRM' ORDER BY id DESC LIMIT 1)),
  ('decision', 'Decide if PottyPro is its own LLC/entity or under Lighthouse 27', 'Same question as Contract Review SaaS. New entity = clean liability. DBA = faster.', 'medium', (SELECT id FROM projects WHERE name='PottyPro CRM' ORDER BY id DESC LIMIT 1)),
  ('marketing', 'Plan WWETT 2027 booth strategy — meet 20+ brokers in person', 'Brian Solomonson came from WWETT. Best lead source for this audience. Booth + 1:1 meetings = direct customer pipeline.', 'low', (SELECT id FROM projects WHERE name='PottyPro CRM' ORDER BY id DESC LIMIT 1));
