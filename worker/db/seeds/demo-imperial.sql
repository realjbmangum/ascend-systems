-- Seed data for the Ascend demo tenant: IMPERIAL CLIMATE CONTROL.
--
-- Apply after tenant-schema.sql:
--   npx wrangler d1 execute voice-c00 --remote --file=./db/seeds/demo-imperial.sql
--
-- A deliberately absurd HVAC and life-support contractor, structured exactly like
-- a real trades client: customers with service plans, open work orders, a
-- technician roster, and a balance owing. The comedy is the wrapper; the SHAPE is
-- the demo. A prospect watching this sees their own dispatch board.
--
-- Everything here is parody of a fictional universe. No real person, likeness or
-- voice is used, and no real company is named.
--
-- Bare DDL/DML only — remote D1 rejects explicit transaction blocks.

DELETE FROM work_orders;
DELETE FROM customers;
DELETE FROM lead_activities;
DELETE FROM tasks;
DELETE FROM leads;

-- ---------------------------------------------------------------------------
-- Customers — the accounts the agent can recognise by caller ID
-- ---------------------------------------------------------------------------
INSERT INTO customers (id,name,phone,email,account_ref,site_name,address,service_plan,balance_cents,notes) VALUES
 (1,'Grand Moff Tarkin','+19805550101','tarkin@imperial-demo.test','IMP-0001','Overbridge Level 1','Death Star I, Sector A','Platinum — 4hr response',0,
  'Insists on being transferred to a human immediately. Good demo of the escalation path.'),
 (2,'Admiral Ozzel','+19805550102','ozzel@imperial-demo.test','IMP-0002','Executor Bridge','Star Destroyer Executor','Gold — next business day',48500,
  'Account past due. Demonstrates the agent handling a balance question without quoting policy it should not.'),
 (3,'Captain Needa','+19805550103','needa@imperial-demo.test','IMP-0003','Avenger Hangar 3','Star Destroyer Avenger','Silver — 3 business days',0,
  'Apologises constantly. Calls about the same hangar door every month.'),
 (4,'Moff Jerjerrod','+19805550104','jerjerrod@imperial-demo.test','IMP-0004','Construction Site B','Death Star II, Endor orbit','Platinum — 4hr response',1250000,
  'Large active construction account. Always behind schedule, always escalating.'),
 (5,'Lt. Piett','+19805550105','piett@imperial-demo.test','IMP-0005','Executor Deck 12','Star Destroyer Executor','Gold — next business day',0,
  'Recently promoted. Twice.'),
 (6,'Wilhuff Facilities Group','+19805550106','ops@imperial-demo.test','IMP-0006','Multiple','Outer Rim — 14 sites','Platinum — multi-site',0,
  'Multi-site account. Use this one to demo routing a caller to the right location.');

-- ---------------------------------------------------------------------------
-- Work orders — open jobs the agent can look up mid-call
-- ---------------------------------------------------------------------------
INSERT INTO work_orders (customer_id,reference,summary,status,priority,technician,scheduled_for,notes) VALUES
 (2,'WO-4471','Thermal exhaust port — recurring pressure alarm','dispatched','urgent','TK-421','2026-07-25 13:00',
  'Third callout this quarter. Engineering flagged the port diameter as out of spec but the change order was never approved.'),
 (4,'WO-4472','Superlaser coolant loop — intermittent overheat','scheduled','emergency','Chief Bast','2026-07-25 09:00',
  'Customer describes it as "fully operational". Technician notes disagree.'),
 (3,'WO-4468','Hangar 3 blast door — will not seal','scheduled','normal','TK-509','2026-07-28 11:00',
  'Fourth visit. Root cause is almost certainly the track, not the seal.'),
 (1,'WO-4470','Overbridge climate zone 1 — too cold','complete','normal','TK-421','2026-07-22 15:00',
  'Setpoint was 18C. Adjusted to 21C. Customer unsatisfied for unrelated reasons.'),
 (6,'WO-4473','Quarterly filter replacement — 14 sites','scheduled','normal','Crew 7','2026-08-01 08:00',
  'Recurring contract work. Good example of a routine call the agent should handle without escalating.'),
 (5,'WO-4469','Deck 12 humidity out of tolerance','complete','normal','TK-509','2026-07-19 10:30',
  'Resolved. Condensate drain was blocked.');

-- ---------------------------------------------------------------------------
-- Leads — prior calls the agent captured, so the demo has history on day one
-- ---------------------------------------------------------------------------
INSERT INTO leads (id,name,phone,email,company,project_type,message,status,source_origin,source_channel,source_channel_id,created_at) VALUES
 (1,'Bib Fortuna','+19805550201',NULL,'Jabba Palace Holdings','emergency-service',
  'Throne room cooling failed entirely. Says the temperature is "affecting the guests". Would not elaborate.',
  'new','voice','voice-c00','demo_call_001','2026-07-23 19:42:00'),
 (2,'Lando Calrissian','+19805550202','lando@cloudcity-demo.test','Cloud City Facilities','maintenance-contract',
  'Wants a quote for atmospheric processors across the whole platform. Asked twice whether the deal would be altered later.',
  'qualified','voice','voice-c00','demo_call_002','2026-07-24 10:15:00'),
 (3,'Sy Snootles','+19805550203',NULL,NULL,'emergency-service',
  'Venue air handling. Called during a performance; extremely loud in the background. Good test of noisy-environment handling.',
  'new','voice','voice-c00','demo_call_003','2026-07-24 21:03:00'),
 (4,'Dexter Jettster','+19805550204','dex@dinerdemo.test','Dex Diner','install-quote',
  'Kitchen extraction replacement. Knows exactly what he wants and is not interested in being qualified.',
  'qualified','voice','voice-c00','demo_call_004','2026-07-22 08:20:00');

INSERT INTO lead_activities (lead_id,type,subject,notes,due_at,duration_minutes,done,done_at) VALUES
 (1,'call','Inbound: throne room cooling failure','Emergency intake. Transferred to on-call after confirming the site address.',NULL,3,1,'2026-07-23 19:45:00'),
 (2,'call','Inbound: multi-site quote request','Captured scope and decision timeline. Booked a survey.',NULL,6,1,'2026-07-24 10:21:00'),
 (2,'meeting','Site survey — Cloud City','Confirmed for the 29th at 10:00 local. Agent booked it directly into the calendar.','2026-07-29 14:00:00',60,0,NULL),
 (4,'call','Inbound: kitchen extraction','Caller declined qualification questions. Agent stopped asking and took the details.',NULL,2,1,'2026-07-22 08:22:00');

INSERT INTO tasks (type,title,description,priority,lead_id,metadata_json) VALUES
 ('lead_inquiry','Voice lead: Bib Fortuna (Jabba Palace Holdings)',
  'Emergency cooling failure. Transferred to on-call, needs same-day follow-up.','high',1,
  '{"captured_by":"voice agent: Lord Vader","call_id":"demo_call_001"}'),
 ('lead_inquiry','Voice lead: Lando Calrissian (Cloud City Facilities)',
  'Multi-site atmospheric processor quote. Survey booked.','medium',2,
  '{"captured_by":"voice agent: Lord Vader","call_id":"demo_call_002"}'),
 ('callback','Return call: Sy Snootles',
  'Called from a venue mid-performance. Agent could not confirm the address over the noise.','medium',3,
  '{"captured_by":"voice agent: Lord Vader","call_id":"demo_call_003"}');
