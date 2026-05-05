-- =============================================================================
-- Seed: Load SCDMV Alerts press kit content into project_notes for SCDMV
-- Run:  wrangler d1 execute ascend-db --remote --file=worker/db/seeds/2026-05-05-scdmv-press-kit-content.sql
--
-- Sourced from /Users/jbm/new-project/site-scdmv-alerts/PRESS-KIT.md and
-- /site-scdmv-alerts/emails/*.txt.
--
-- Notes are admin-only (visible_to_client = 0) and attached to the SCDMV
-- Alerts project. Read in admin UI at /admin/projects/<id> → Notes tab.
-- =============================================================================

-- 1. Quick reference (key facts, story angles, contacts summary)
INSERT INTO project_notes (project_id, author, content, visible_to_client)
SELECT id, 'Brian',
'## PRESS KIT — Quick Reference

**Site:** https://scdmvappointments.com
**Coverage:** All 65 SC DMV offices across 8 regions
**Pricing:** Free (email) / Pro $5.99/mo (SMS) / CDL Pro $19.99/mo

### Story Angles (use the right one per outlet)

- **Consumer / Lifestyle:** "Local developer builds free tool to help SC teens get their license faster"
- **Business / Entrepreneurship:** "SC entrepreneur launches DMV appointment alert startup"
- **Commercial / Trucking:** "Tool helps SC truckers book CDL test appointments amid driver shortage"
- **Back-to-School (Aug):** "As teens head back to school, new tool helps them book road tests faster"

### Pitch Priority (send in this order)

1. **WIS Columbia** — counton@wistv.com — largest audience, has "Problem Solvers" segment
2. **WLTX Columbia** — news19@wltx.com — "On Your Side" consumer advocacy
3. **WYFF Greenville** — newstips@wyff4.com — "4 On Your Side" segment

### Best Times to Pitch
Monday-Wednesday AM. Avoid Friday PM (ignored over weekend).

### Hooks Working Right Now
- DMV backlogs frustrating SC families for years
- NC competitor got 2,000+ users from local TV coverage (proven playbook)
- Comparable tool was featured on WRAL', 0
FROM projects WHERE name = 'SCDMV Alerts' LIMIT 1;

-- 2. Consumer pitch template (the one to send to WIS, WLTX, WYFF first)
INSERT INTO project_notes (project_id, author, content, visible_to_client)
SELECT id, 'Brian',
'## EMAIL TEMPLATE — Consumer / Lifestyle Pitch (USE THIS FIRST)

**Best for:** WIS, WLTX, WYFF — local TV consumer/lifestyle segments
**Send from:** your personal Gmail (not press@) — reporters reply faster to a real person
**Format:** Plain text, no HTML signature, no logo

---

**Subject:** Story idea: Free tool helps SC families skip the DMV appointment wait

Hi [First Name],

How many of your viewers have been stuck refreshing the SC DMV website for weeks trying to book an appointment?

I own property in Greenville and was looking into what it would take to transfer my license to South Carolina. That''s when I discovered how broken the appointment system is — everything booked out for weeks, no way to get notified when a slot opens, just endless refreshing.

I''m a software developer, so I built a tool that does the refreshing for you. scdmvappointments.com watches all 65 SC DMV locations around the clock and emails you the moment an appointment opens. It''s free to start.

Right now, families across all 8 SC regions are using it to skip the wait. Most users book an appointment within their first week of alerts.

This is a 2-minute segment your audience would share with every parent they know. I can do a live demo, talk through the DMV scheduling crunch, and share tips families can use today.

Available anytime — in studio, remote, wherever works.

scdmvappointments.com

Brian Mangum
Founder, SC DMV Alerts
[your phone]
scdmvappointments.com', 0
FROM projects WHERE name = 'SCDMV Alerts' LIMIT 1;

-- 3. Entrepreneur / business angle pitch template
INSERT INTO project_notes (project_id, author, content, visible_to_client)
SELECT id, 'Brian',
'## EMAIL TEMPLATE — Entrepreneur / Business Pitch

**Best for:** Business desks, "developer turns frustration into product" angle
**Send from:** your personal Gmail
**Format:** Plain text

---

**Subject:** Story idea: SC developer turns DMV frustration into free tool for families

Hi [First Name],

What happens when a developer discovers a broken system and decides to fix it?

I own property in Greenville and was researching what it would take to transfer my license to South Carolina. That''s when I hit the wall — DMV appointments booked out for weeks, no notification system, nothing to do but refresh the website and hope.

I''m a software developer, so I did what developers do: I wrote a script to watch the DMV scheduler for me. It worked. I had an appointment within days.

Now that script is scdmvappointments.com — a service that monitors all 65 SC DMV locations and emails people the instant a slot opens. Free tier gets you started. Paid tiers cover CDL testers and commercial drivers dealing with the same problem at higher stakes.

  65 locations monitored | 6 appointment types | 24/7 automated scanning

The angle: a developer with ties to South Carolina discovers how broken the DMV appointment system is and turns a personal frustration into a tool that''s now helping families across the state. Happy to talk about the build, the business model, or the broader DMV appointment problem.

Worth a conversation?

scdmvappointments.com

Brian Mangum
Founder, SC DMV Alerts
[your phone]
scdmvappointments.com', 0
FROM projects WHERE name = 'SCDMV Alerts' LIMIT 1;

-- 4. Follow-up template (1 week after no response)
INSERT INTO project_notes (project_id, author, content, visible_to_client)
SELECT id, 'Brian',
'## EMAIL TEMPLATE — Follow-up (send 1 week after no response)

**When:** 5-7 business days after initial pitch with no reply.
Personalize the [X / City / City] placeholders before sending.

---

**Subject:** Quick follow-up: SC DMV story idea

Hi [First Name],

Circling back on the SC DMV story I pitched last week.

Quick update: since I emailed, [X] more families have signed up and users are booking appointments in [City], [City], and [City]. The DMV backlog isn''t going away, and people are finding this tool through word of mouth alone.

Still think this is a story your audience would love. Two minutes, practical, and every parent in SC can relate.

Happy to work around your schedule.

Brian Mangum
Founder, SC DMV Alerts
[your phone]
scdmvappointments.com', 0
FROM projects WHERE name = 'SCDMV Alerts' LIMIT 1;

-- 5. Full TV station contact list (all 4 markets)
INSERT INTO project_notes (project_id, author, content, visible_to_client)
SELECT id, 'Brian',
'## TV STATION CONTACTS — All 4 SC Markets

### Columbia (State Capital — PRIORITY)

| Station | Network | Email | Phone |
|---|---|---|---|
| WIS | NBC | counton@wistv.com | (803) 758-1261 |
| WLTX | CBS | news19@wltx.com | (803) 776-3600 |
| WACH | Fox | news@wach.com | (803) 799-5757 |
| WOLO | ABC | news@abccolumbia.com | (803) 754-2525 |

### Greenville-Spartanburg (Upstate)

| Station | Network | Email | Phone |
|---|---|---|---|
| WYFF | NBC | newstips@wyff4.com | (864) 240-4444 |
| WSPA | CBS | news@wspa.com | (864) 587-4462 |
| WHNS | Fox | foxcarolinanews@foxcarolina.com | (864) 288-2100 |

### Charleston (Lowcountry)

| Station | Network | Email | Phone |
|---|---|---|---|
| WCSC | CBS | news@live5news.com | (843) 402-5555 |
| WCIV | ABC | news@abcnews4.com | (843) 881-4444 |
| WCBD | NBC | news@counton2.com | (843) 884-2222 |

### Myrtle Beach (Grand Strand)

| Station | Network | Email | Phone |
|---|---|---|---|
| WPDE | ABC | news@carolinalive.com | (843) 234-1515 |
| WBTW | CBS | news@wbtw.com | (843) 317-1313 |
| WMBF | NBC | news@wmbfnews.com | (843) 839-9623 |

### Send Order

**Round 1 (Mon AM):** WIS, WLTX, WYFF
**Round 2 (Wed AM, after 48h no reply):** WCSC, WMBF, WACH, WOLO
**Round 3 (Mon AM week 2):** Follow-up email to anyone who didn''t respond

### Tracking

Mark each task in the SCDMV project as `done` when the pitch goes out. Add a project note (Notes tab) with the date, recipient, which template you used, and any reply.', 0
FROM projects WHERE name = 'SCDMV Alerts' LIMIT 1;
