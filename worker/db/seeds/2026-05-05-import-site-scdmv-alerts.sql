-- =============================================================================
-- Import: project resources from site-scdmv-alerts → "SCDMV Alerts"
-- Generated: 2026-05-05T16:15:18.449Z
-- Run:  wrangler d1 execute ascend-db --remote --file=worker/db/seeds/2026-05-05-import-site-scdmv-alerts.sql
--
-- 7 resources found.
-- =============================================================================

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'Press Kit', '# SC DMV Alerts - Press Kit

Last updated: January 24, 2026

---

## Quick Facts

- **Website:** https://scdmvappointments.com
- **What it does:** Monitors SC DMV for road test appointments and sends instant alerts
- **Coverage:** All 65 SC DMV offices across 8 regions
- **Pricing:** Free (email alerts), Pro $5.99/mo (SMS), CDL Pro $19.99/mo
- **Launch date:** January 2026

---

## Press Contact

- **Email:** press@scdmvappointments.com
- **Phone:** [Your phone]
- **Name:** [Your name]

---

## Story Angles

### Consumer Tech / Lifestyle
> "Local developer builds free tool to help SC teens get their driver''s license faster"

### Business / Entrepreneurship
> "SC entrepreneur launches DMV appointment alert startup"

### Commercial Driving / Trucking
> "Tool helps SC truckers book CDL test appointments amid driver shortage"

### Back-to-School (August)
> "As teens head back to school, new tool helps them book road tests faster"

---

## Email Pitch Templates

### Template 1: General (Consumer Tech)

**Subject:** Free tool helps SC teens find DMV appointments faster

```
Hi [Reporter Name],

I built a free tool that''s helping South Carolina residents book DMV road test appointments faster, and I think it could make a great consumer tech story for [Station].

THE PROBLEM:
SC DMV road test appointments often book up weeks or months in advance. Teens and parents end up refreshing the DMV website dozens of times hoping for a cancellation.

THE SOLUTION:
I created scdmvappointments.com - a free alert service that monitors all 65 SC DMV locations every 5 minutes and sends instant notifications when appointments open up.

WHY NOW:
- DMV backlogs have frustrated SC families for years
- Similar services have helped thousands in other states (NC''s version was featured on WRAL)
- Back-to-school season means more teens trying to get their licenses

VISUAL OPPORTUNITIES:
- Demo of how the alert system works
- Interviews with teens/parents who got appointments
- Behind-the-scenes of how the monitoring tech works

I''m happy to do an interview, provide a demo, or connect you with early users who''ve successfully booked appointments.

Would this be a fit for a segment?

Best,
[Your name]
[Phone]
scdmvappointments.com
```

### Template 2: Morning Show (Lifestyle)

**Subject:** Local tool helps SC families skip the DMV wait

```
Hi [Producer Name],

Your viewers probably know the frustration of trying to book a road test appointment at SC DMV - slots fill up in minutes and families end up waiting months.

I built a free tool (scdmvappointments.com) that solves this. It monitors all 65 SC DMV locations and texts/emails families the instant an appointment opens up.

This would make a great 2-3 minute segment:
- Quick demo showing how fast alerts arrive
- Tips for parents helping teens get their license
- Discussion of the DMV appointment crunch

I''m a SC local and available anytime for an interview - in studio, remote, or on location.

Interested?

[Your name]
[Phone]
```

### Template 3: Business/Tech Reporter

**Subject:** SC entrepreneur launches DMV appointment alert startup

```
Hi [Reporter Name],

I recently launched scdmvappointments.com, a SaaS tool that monitors SC DMV and alerts users when appointments open.

THE NUMBERS:
- Monitors 65 DMV locations
- Checks every 5 minutes
- Finds 700+ appointments daily
- Free tier + paid tiers ($5.99 and $19.99/month)

THE TECH:
Built on Cloudflare Workers with real-time monitoring of the public SC DMV scheduler API. Alerts via SendGrid (email) and Twilio (SMS).

THE STORY:
I built this because my [friend/family member/I] spent weeks trying to book a road test. The DMV site has no notification feature, so I built one.

Happy to discuss the technical architecture, business model, or growth strategy.

[Your name]
[Phone]
```

### Template 4: CDL/Trucking Angle

**Subject:** Tool helps SC truckers book CDL test appointments

```
Hi [Reporter Name],

With the trucking industry facing driver shortages, South Carolina residents pursuing CDL licenses are struggling to book skills test appointments at the DMV.

I built scdmvappointments.com to help. The tool monitors all SC DMV locations for CDL Class A, B, and C test slots and sends instant alerts when appointments open.

This is especially relevant for:
- Trucking companies trying to get new drivers licensed
- CDL schools whose students need to schedule tests
- Career changers entering the trucking industry

The service is $19.99/month for CDL alerts, and I''d be happy to discuss how it''s helping SC''s commercial driving community.

[Your name]
[Phone]
```

---

## Follow-Up Email (Send 5-7 days after initial pitch)

**Subject:** Re: Free tool helps SC teens find DMV appointments faster

```
Hi [Name],

Following up on my email about SC DMV Alerts. Since I reached out:

- [X] new users have signed up
- Users have successfully booked appointments in [City], [City], and [City]
- [Any new feature or milestone]

Happy to chat whenever convenient. I''m available [days/times].

Best,
[Name]
```

---

## TV Station Contacts

### Columbia Market (State Capital - Priority Target)
| Station | Call Letters | Email | Phone | Notes |
|---------|--------------|-------|-------|-------|
| NBC | WIS | counton@wistv.com | (803) 758-1261 | Largest audience; use sendit@wistv.com for tips |
| CBS | WLTX | news19@wltx.com | (803) 776-3600 | "News19" branding |
| Fox | WACH | news@wach.com | (803) 799-5757 | |
| ABC | WOLO | news@abccolumbia.com | (803) 754-2525 | |

### Greenville-Spartanburg Market (Upstate)
| Station | Call Letters | Email | Phone | Notes |
|---------|--------------|-------|-------|-------|
| NBC | WYFF | newstips@wyff4.com | (864) 240-4444 | Contact form: wyff4.com/contact |
| CBS | WSPA | news@wspa.com | (864) 587-4462 | wspa.com/contact-us |
| Fox | WHNS | foxcarolinanews@foxcarolina.com | (864) 288-2100 | |

### Charleston Market (Lowcountry)
| Station | Call Letters | Email | Phone | Notes |
|---------|--------------|-------|-------|-------|
| CBS | WCSC | news@live5news.com | (843) 402-5555 | "Live 5 News" |
| ABC | WCIV | news@abcnews4.com | (843) 881-4444 | |
| NBC | WCBD | news@counton2.com | (843) 884-2222 | "Count on 2" |

### Myrtle Beach Market (Grand Strand)
| Station | Call Letters | Email | Phone | Notes |
|---------|--------------|-------|-------|-------|
| ABC | WPDE | news@carolinalive.com | (843) 234-1515 | "Carolina Live" |
| CBS | WBTW | news@wbtw.com | (843) 317-1313 | |
| NBC | WMBF | news@wmbfnews.com | (843) 839-9623 | Morning show good for lifestyle |

### Key Reporters to Target

**Consumer/Tech Reporters:**
- WIS Columbia - Check their "Problem Solvers" segment
- WLTX Columbia - "On Your Side" consumer team
- WYFF Greenville - "4 On Your Side" segment

**Morning Show Producers:**
- Best bet for lifestyle/consumer segments
- WMBF Myrtle Beach has strong local morning show
- WIS "Midday" show covers local interest stories

### Pitch Priority Order
1. **WIS Columbia** - State capital, largest reach, established consumer team
2. **WLTX Columbia** - Strong "On Your Side" consumer advocacy
3. **WYFF Greenville** - Covers Upstate, large population
4. **WCSC Charleston** - Coastal market, tech-savvy audience
5. **WMBF Myrtle Beach** - Local interest, morning show opportunities

---

## Best Times to Pitch

- **Monday-Wednesday AM** - Producers planning the week''s segments
- **Avoid Friday PM** - Inbox ignored over weekend
- **News hooks:**
  - Back-to-school (August) - teens getting licenses
  - DMV system issues/complaints - newsjack with your solution
  - New Year (January) - resolutions to finally get license
  - Summer (June) - teens off school, need license for jobs

---

## Assets

### Logo
- File: `/public/scdmvappt-logo.png`
- High-res available upon request

### Screenshots
- Homepage
- Alert notification (email)
- Alert notification (SMS)

### Video
- Promo video: `/public/promo.mp4` (289KB, 15 sec)
- Can provide longer demo upon request

### One-Sheet / Fact Sheet
[Create PDF version of this press kit]

---

## Tracking Spreadsheet

Create a Google Sheet with columns:
| Station | Contact | Email | Sent Date | Follow-up Date | Response | Notes |
|---------|---------|-------|-----------|----------------|----------|-------|

---

## Sample Q&A (For Interviews)

**Q: How did you come up with this idea?**
A: I own property in Greenville and was looking into what it would take to transfer my license to South Carolina. When I tried to book an appointment, everything was booked out for weeks with no way to get notified when a slot opened. I''m a software developer, so I built a tool to watch the DMV scheduler for me. It worked, and I realized every person in SC dealing with the same problem could use it too.

**Q: How does it work?**
A: Our system checks the SC DMV website every 5 minutes, looking at all 65 locations. When an appointment opens up, we immediately send an alert via email or text so you can grab it before someone else does.

**Q: Is this legal? Is it affiliated with SC DMV?**
A: It''s completely legal and legitimate. We simply monitor publicly available information on the DMV''s website - the same information anyone can see by visiting the site. We''re not affiliated with SC DMV; we''re an independent service helping residents navigate the appointment system.

**Q: How much does it cost?**
A: There''s a free tier that sends one email alert per day. For people who want the best chance of booking, our Pro tier is $5.99/month and includes instant SMS alerts plus up to 3 notifications per day.

**Q: What''s your success rate?**
A: We see hundreds of appointments open up every day across SC. Most of our Pro users who act quickly on alerts find an appointment within 1-2 weeks.

**Q: What''s next for the service?**
A: Right now we''re focused on serving South Carolina well. We may expand to other states in the future - the DMV appointment crunch is a nationwide problem.

---

## Notes

- NC competitor (ncdmvappointments.com) got 2,000+ users primarily from local TV coverage on WRAL
- Local angle is key: "SC developer helps SC families"
- Visual demo of the alert arriving makes for good TV
- Testimonials from early users will strengthen pitches (collect these!)
', 1, 'site-scdmv-alerts/PRESS-KIT.md'
FROM projects WHERE name = 'SCDMV Alerts' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'checklist', 'Launch Checklist', '# SC DMV Alerts & LoveNotes - Launch Checklist

## SC DMV Alerts (scdmvappointments.com)

### Stripe Setup (Required for Paid Tiers)

- [x] **Create CDL Pro Product in Stripe**
  1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
  2. Click "Add Product"
  3. Name: `CDL Pro`
  4. Price: `$19.99/month` (recurring)
  5. Copy the Price ID (starts with `price_`)

- [x] **Add CDL Price ID to Cloudflare**
  1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
  2. Navigate to: Pages → scdmv-alerts → Settings → Environment variables
  3. Add variable: `STRIPE_CDL_PRICE_ID` = `price_xxxxxx` (your new price ID)
  4. Make sure it''s set for Production

- [x] **Verify Pro Tier Price ID Exists**
  - Confirm `STRIPE_PRICE_ID` is set (for $5.99 Pro tier)
  - Confirm `STRIPE_SECRET_KEY` is set
  - Confirm `STRIPE_WEBHOOK_SECRET` is set

---

### Twilio Setup (Required for SMS Alerts)

- [ ] **Create Twilio Account** (if not already)
  1. Go to [twilio.com](https://www.twilio.com)
  2. Sign up or log in
  3. Complete verification

- [ ] **Get Twilio Phone Number**
  1. Go to Console → Phone Numbers → Buy a Number
  2. Get a US number with SMS capability
  3. Note the phone number (format: +1XXXXXXXXXX)

- [ ] **Get Twilio API Credentials**
  1. Go to Console → Account Info
  2. Copy Account SID
  3. Copy Auth Token

- [ ] **Add Twilio Env Vars to Cloudflare**
  1. Go to Cloudflare Pages → scdmv-alerts → Settings → Environment variables
  2. Add these (Production):
     - `TWILIO_ACCOUNT_SID` = your Account SID
     - `TWILIO_AUTH_TOKEN` = your Auth Token
     - `TWILIO_PHONE_NUMBER` = +1XXXXXXXXXX

- [ ] **Test SMS Delivery**
  - Sign up as a Pro user with your phone number
  - Wait for scraper to find matching appointments
  - Verify SMS received

---

### Marketing - Phase 1: Organic Social (Week 1)

- [ ] **Create/Login to Social Accounts**
  - [ ] TikTok
  - [ ] Instagram
  - [ ] YouTube
  - [ ] Twitter/X
  - [ ] Facebook

- [ ] **Post Promo Video**
  - [ ] TikTok (use vertical video: `promo-video/out/scdmv-promo-vertical.mp4`)
  - [ ] Instagram Reels (vertical)
  - [ ] YouTube Shorts (vertical)
  - [ ] Twitter/X
  - [ ] Facebook

- [ ] **Reddit Posts**
  - [ ] r/southcarolina
  - [ ] r/charleston
  - [ ] r/greenville
  - [ ] r/ColumbiYEAH (Columbia SC)

---

### Marketing - Phase 2: Local Outreach (Week 1-2)

- [ ] **Facebook Groups**
  - [ ] Join Charleston community groups
  - [ ] Join Columbia community groups
  - [ ] Join Greenville community groups
  - [ ] Post (follow group rules, don''t spam)

- [ ] **Driving Schools**
  - [ ] Find SC driving schools on Google/Facebook
  - [ ] Reach out about partnership/sharing

- [ ] **Nextdoor**
  - [ ] Post in your neighborhood
  - [ ] Share in nearby areas

---

### Marketing - Phase 2B: Local Media Outreach (Week 2-3)

#### TV News Stations

**Columbia Market**
- [ ] **WIS-TV (NBC 10)** - news@wistv.com
  - News tips: https://www.wistv.com/contact/
  - Good for: Consumer/tech stories
- [ ] **WLTX (CBS 19)** - news@wltx.com
  - News tips: https://www.wltx.com/contact-us
  - Good for: "On Your Side" consumer segments
- [ ] **WACH (Fox 57)** - news@wach.com
  - Contact: https://www.wach.com/contact
- [ ] **WOLO (ABC 25)** - news@abccolumbia.com
  - Contact: https://www.abccolumbia.com/contact/

**Charleston Market**
- [ ] **WCSC (CBS Live 5)** - news@live5news.com
  - News tips: https://www.live5news.com/contact/
  - Good for: Local tech/consumer stories
- [ ] **WCIV (ABC News 4)** - news@abcnews4.com
  - Contact: https://www.abcnews4.com/contact
- [ ] **WCBD (NBC News 2)** - news@counton2.com
  - Contact: https://www.counton2.com/contact/

**Greenville/Spartanburg Market**
- [ ] **WYFF (NBC 4)** - news@wyff4.com
  - News tips: https://www.wyff4.com/contact
  - Good for: Consumer investigations
- [ ] **WSPA (CBS 7)** - news@wspa.com
  - Contact: https://www.wspa.com/contact/
- [ ] **WHNS (Fox Carolina 21)** - news@foxcarolina.com
  - Contact: https://www.foxcarolina.com/contact/

**Myrtle Beach/Florence Market**
- [ ] **WPDE (ABC 15)** - news@wpde.com
  - Contact: https://wpde.com/contact
- [ ] **WBTW (CBS 13)** - news@wbtw.com
  - Contact: https://www.wbtw.com/contact/
- [ ] **WMBF (NBC)** - news@wmbfnews.com
  - Contact: https://www.wmbfnews.com/contact/

#### Radio Stations

**Columbia**
- [ ] **WVOC 560 AM** (Talk Radio) - Good for local interest stories
- [ ] **WXRY 99.3 FM** (Community Radio) - Local business features
- [ ] **WCOS 97.5 FM** (Country) - Morning show segments

**Charleston**
- [ ] **WTMA 1250 AM** (Talk) - Local issues focus
- [ ] **95SX (WSSX 95.1)** - Morning show features

**Greenville**
- [ ] **WORD 106.3 FM** (Talk) - Upstate news/talk
- [ ] **93.3 The Planet** - Morning features

#### Newspapers & Online News

**Statewide**
- [ ] **The State (Columbia)** - statenews@thestate.com
  - Largest SC newspaper, good for statewide reach
- [ ] **Post and Courier (Charleston)** - news@postandcourier.com
  - Major coastal coverage
- [ ] **Greenville News** - news@greenvillenews.com
  - Upstate coverage

**Regional Papers**
- [ ] **Myrtle Beach Sun News** - localnews@thesunnews.com
- [ ] **The Herald (Rock Hill)** - news@heraldonline.com
- [ ] **Spartanburg Herald-Journal** - news@shj.com
- [ ] **Florence Morning News** - news@florencenews.com
- [ ] **Aiken Standard** - news@aikenstandard.com

**Online-Only / Alt News**
- [ ] **FITSNews** - tips@fitsnews.com
  - SC politics/news site, good engagement
- [ ] **Charleston City Paper** - editor@charlestoncitypaper.com
- [ ] **Free Times (Columbia)** - editor@free-times.com
- [ ] **Greenville Journal** - editor@greenvillejournal.com

#### Pitch Template for Media

**Subject:** Free Tool Helps SC Residents Skip 6-Week DMV Wait

**Body:**
```
Hi [Name],

I built a free service that helps South Carolina residents find last-minute
DMV road test appointments - often within days instead of the typical 6+ week wait.

The tool (scdmvappointments.com) monitors all SC DMV locations every 5 minutes
and alerts users when cancellations open up. It''s already helped [X] people
get their licenses faster.

This could make a great consumer segment - the DMV wait time issue affects
thousands of SC residents, especially new drivers and CDL applicants.

Happy to do an interview or provide a demo.

Best,
[Your name]
[Phone]
```

#### Tips for Media Outreach

1. **Best times to pitch:**
   - Tuesday-Thursday, 9-11am
   - Avoid Mondays (busy) and Fridays (weekend prep)

2. **Follow up:**
   - Wait 3-5 days before following up
   - Try different contact (assignment desk vs specific reporter)

3. **News hooks that work:**
   - "Local entrepreneur solves common problem"
   - Consumer advocacy angle ("helping people save time/money")
   - Back-to-school timing (teens getting licenses)
   - New year resolution angle (January)

4. **Have ready:**
   - High-res logo/screenshots
   - Quick demo video (30-60 seconds)
   - User testimonials (if any)
   - Your availability for interviews

---

### Marketing - Phase 3: SEO (Ongoing)

- [ ] **Enable Cloudflare Crawler Hints**
  1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
  2. Select the `scdmvappointments.com` zone
  3. Navigate to: **Caching** → **Configuration**
  4. Scroll to **Crawler Hints** section
  5. Toggle **ON**

  This enables IndexNow protocol - Cloudflare automatically notifies search engines (Google, Bing, Yandex) when content changes, instead of waiting for crawlers to discover updates. Reduces re-indexing delays for new pages and content changes.

- [ ] **Google Search Console**
  1. Go to [search.google.com/search-console](https://search.google.com/search-console)
  2. Add property: scdmvappointments.com
  3. Verify ownership
  4. Submit sitemap: `https://scdmvappointments.com/sitemap.xml`

- [ ] **Bing Webmaster Tools**
  1. Go to [bing.com/webmasters](https://www.bing.com/webmasters)
  2. Add site: scdmvappointments.com
  3. Submit sitemap (Bing is a major IndexNow partner)

- [ ] **Monitor Rankings**
  - Target keywords: "SC DMV appointment", "South Carolina road test", "SC DMV wait times"

---

## LoveNotes (sendmylove.app)

### Billing Verification

- [ ] **Wait for 7-Day Trial to End**
  - Trial started: January 21, 2026
  - First charge expected: ~January 28, 2026
  - Check Stripe dashboard for successful charge

- [ ] **Verify Daily Messages Sending**
  - Check inbox for daily love note emails
  - Confirm cron running at 8am ET

---

### Twilio Setup (Optional - Currently Using Email)

- [ ] **Add Twilio to LoveNotes Worker**
  1. Go to Cloudflare Dashboard → Workers → lovenotes-api-production
  2. Settings → Variables
  3. Add secrets:
     - `TWILIO_ACCOUNT_SID`
     - `TWILIO_AUTH_TOKEN`
     - `TWILIO_PHONE_NUMBER`

---

### Pre-Launch Tasks

- [ ] **Test Full Flow**
  - [ ] New user signup works
  - [ ] Stripe checkout works
  - [ ] Daily email received
  - [ ] Dashboard loads correctly

- [ ] **Domain Setup** (if not done)
  - [ ] sendmylove.app pointing to Cloudflare Pages
  - [ ] SSL certificate active

---

## Quick Links

| Service | URL |
|---------|-----|
| SC DMV Alerts (Live) | https://scdmvappointments.com |
| LoveNotes (Live) | https://sendmylove.app |
| Stripe Dashboard | https://dashboard.stripe.com |
| Cloudflare Dashboard | https://dash.cloudflare.com |
| Twilio Console | https://console.twilio.com |
| SendGrid Dashboard | https://app.sendgrid.com |

---

## Environment Variables Reference

### SC DMV Alerts (Cloudflare Pages)
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID=price_... (Pro $5.99)
STRIPE_CDL_PRICE_ID=price_... (CDL $19.99) ← NEEDS SETUP
STRIPE_WEBHOOK_SECRET=whsec_...
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=alerts@scdmvappointments.com
TWILIO_ACCOUNT_SID=AC... ← NEEDS SETUP
TWILIO_AUTH_TOKEN=... ← NEEDS SETUP
TWILIO_PHONE_NUMBER=+1... ← NEEDS SETUP
SCRAPER_API_SECRET=...
MAPBOX_ACCESS_TOKEN=pk...
```

### LoveNotes (Cloudflare Worker)
```
JWT_SECRET=... ✓
STRIPE_SECRET_KEY=sk_live_... ✓
STRIPE_PRICE_ID=price_... ✓
STRIPE_WEBHOOK_SECRET=whsec_... ✓
SENDGRID_API_KEY=SG... ✓
TWILIO_* (optional)
```

---

*Last updated: January 24, 2026*
', 2, 'site-scdmv-alerts/LAUNCH-CHECKLIST.md'
FROM projects WHERE name = 'SCDMV Alerts' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'template', 'Email — Press Followup', 'Subject: Quick follow-up: SC DMV story idea

Hi [First Name],

Circling back on the SC DMV story I pitched last week.

Quick update: since I emailed, [X] more families have signed up and users are booking appointments in [City], [City], and [City]. The DMV backlog isn''t going away, and people are finding this tool through word of mouth alone.

Still think this is a story your audience would love. Two minutes, practical, and every parent in SC can relate.

Happy to work around your schedule.

Brian Mangum
Founder, SC DMV Alerts
press@scdmvappointments.com
scdmvappointments.com
', 10, 'site-scdmv-alerts/emails/press-followup.txt'
FROM projects WHERE name = 'SCDMV Alerts' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'template', 'Email — Press Pitch Consumer', 'Subject: Story idea: Free tool helps SC families skip the DMV appointment wait

Hi [First Name],

How many of your viewers have been stuck refreshing the SC DMV website for weeks trying to book an appointment?

I own property in Greenville and was looking into what it would take to transfer my license to South Carolina. That''s when I discovered how broken the appointment system is -- everything booked out for weeks, no way to get notified when a slot opens, just endless refreshing.

I''m a software developer, so I built a tool that does the refreshing for you. scdmvappointments.com watches all 65 SC DMV locations around the clock and emails you the moment an appointment opens. It''s free to start.

Right now, families across all 8 SC regions are using it to skip the wait. Most users book an appointment within their first week of alerts.

This is a 2-minute segment your audience would share with every parent they know. I can do a live demo, talk through the DMV scheduling crunch, and share tips families can use today.

Available anytime -- in studio, remote, wherever works.

scdmvappointments.com

Brian Mangum
Founder, SC DMV Alerts
press@scdmvappointments.com
scdmvappointments.com
', 10, 'site-scdmv-alerts/emails/press-pitch-consumer.txt'
FROM projects WHERE name = 'SCDMV Alerts' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'template', 'Email — Press Pitch Entrepreneur', 'Subject: Story idea: SC developer turns DMV frustration into free tool for families

Hi [First Name],

What happens when a developer discovers a broken system and decides to fix it?

I own property in Greenville and was researching what it would take to transfer my license to South Carolina. That''s when I hit the wall -- DMV appointments booked out for weeks, no notification system, nothing to do but refresh the website and hope.

I''m a software developer, so I did what developers do: I wrote a script to watch the DMV scheduler for me. It worked. I had an appointment within days.

Now that script is scdmvappointments.com -- a service that monitors all 65 SC DMV locations and emails people the instant a slot opens. Free tier gets you started. Paid tiers cover CDL testers and commercial drivers dealing with the same problem at higher stakes.

  65 locations monitored | 6 appointment types | 24/7 automated scanning

The angle: a developer with ties to South Carolina discovers how broken the DMV appointment system is and turns a personal frustration into a tool that''s now helping families across the state. Happy to talk about the build, the business model, or the broader DMV appointment problem.

Worth a conversation?

scdmvappointments.com

Brian Mangum
Founder, SC DMV Alerts
press@scdmvappointments.com
scdmvappointments.com
', 10, 'site-scdmv-alerts/emails/press-pitch-entrepreneur.txt'
FROM projects WHERE name = 'SCDMV Alerts' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'README', '# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you''ll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There''s nothing special about `src/components/`, but that''s where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
', 90, 'site-scdmv-alerts/README.md'
FROM projects WHERE name = 'SCDMV Alerts' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'README', '# SC DMV Appointment Scraper

Monitors the SC DMV scheduler for available appointments and sends results to the main API for notification dispatch.

## How It Works

1. Launches headless browser (Playwright)
2. Navigates to https://public.scscheduler.com/
3. Captures network requests to discover API endpoints
4. Extracts available appointment slots
5. Sends results to main API → triggers notifications

## Setup

```bash
cd scraper
npm install
npx playwright install chromium
```

## Environment Variables

```bash
# Required
API_ENDPOINT=https://scdmvalerts.com/api/scraper-results
API_SECRET=your-secret-key

# Optional
HEADLESS=true  # Set to ''false'' to see browser
```

## Running Locally

```bash
# Single run
npm start

# Watch mode (re-runs on file changes)
npm run dev
```

## Deployment Options

### Option 1: Railway (Recommended)
1. Create new project from this directory
2. Set environment variables
3. Add cron job: `*/5 * * * *` (every 5 minutes)

### Option 2: Render
1. Create new Background Worker
2. Set environment variables
3. Use cron schedule in render.yaml

### Option 3: GitHub Actions
```yaml
name: Scrape SC DMV
on:
  schedule:
    - cron: ''*/10 * * * *''  # Every 10 minutes
jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ''20''
      - run: cd scraper && npm ci
      - run: npx playwright install chromium
      - run: npm start
        env:
          API_ENDPOINT: ${{ secrets.API_ENDPOINT }}
          API_SECRET: ${{ secrets.API_SECRET }}
```

## Discovery Mode

On first run, the scraper will:
1. Take a screenshot (`debug-screenshot.png`)
2. Log all discovered API endpoints
3. Print page content preview

Use this output to understand the site structure and refine the extraction logic.

## Refining Extraction

Once we understand the SC DMV scheduler structure, update `extractAppointments()` in `index.js` to:
1. Navigate through the booking flow
2. Select service types
3. Extract actual available slots
4. Parse dates, times, and locations
', 90, 'site-scdmv-alerts/scraper/README.md'
FROM projects WHERE name = 'SCDMV Alerts' LIMIT 1;
