-- Make ascend-db answer the tenant tool contract, without duplicating data.
--
-- Apply: (from worker/) wrangler d1 execute ascend-db --remote --file=./db/migrations/2026-07-25-ascend-tenant-views.sql
--
-- WHY
--   Ascend is the one tenant whose business already lives in the platform
--   database, so it never got a voice-<name> D1. But the tenant tools query
--   `customers` and `work_orders`, and ascend-db has `clients` and `projects`.
--   Both lookup_customer and get_work_orders would fail against Ascend.
--
--   Views rather than tables: no code change, no copied rows, nothing to keep in
--   sync. The tools cannot tell the difference.
--
--   This is the platform thesis holding up rather than breaking. The SHAPE is
--   fixed — someone calls, you identify them, you look up their thing. Only the
--   NOUN varies: Ascend calls it a project, Imperial calls it a work order. A
--   view reconciles them and the tool layer stays untouched.
--
-- READ-ONLY, deliberately. Ascend never writes a work order — book_meeting
-- branches on db_binding === 'DB' and syncs to Microsoft 365 instead.
--
-- Statements are bare DDL; remote D1 rejects transaction blocks and wrangler's
-- splitter scans for those keywords even inside comments.

DROP VIEW IF EXISTS customers;
DROP VIEW IF EXISTS work_orders;

-- clients -> customers
--
-- balance_cents is computed from unpaid invoices rather than stored, so it can
-- never drift. Only the assistant can read it — Ascend's receptionist is not
-- granted get_account_balance, because Brian's rule is that money is never
-- discussed by phone; it is emailed to the address on file.
CREATE VIEW customers AS
  SELECT
    c.id                                   AS id,
    c.company_name                         AS name,
    c.phone                                AS phone,
    c.email                                AS email,
    'CL-' || printf('%04d', c.id)          AS account_ref,
    c.contact_name                         AS site_name,   -- who to ask for
    NULL                                   AS address,
    'Consulting engagement'                AS service_plan,
    COALESCE((
      SELECT SUM(i.amount_cents) FROM invoices i
       WHERE i.client_id = c.id AND i.status != 'paid'
    ), 0)                                  AS balance_cents,
    c.notes                                AS notes,
    c.created_at                           AS created_at,
    c.updated_at                           AS updated_at
  FROM clients c;

-- projects -> work_orders
--
-- "Which of my projects is live and who is on it" is the same question an HVAC
-- caller asks about a work order, so it maps cleanly. Ascend has no technicians,
-- so that column is null rather than invented.
CREATE VIEW work_orders AS
  SELECT
    p.id                                   AS id,
    p.client_id                            AS customer_id,
    'PRJ-' || printf('%04d', p.id)         AS reference,
    p.name                                 AS summary,
    p.status                               AS status,
    'normal'                               AS priority,
    NULL                                   AS technician,
    p.started_at                           AS scheduled_for,
    p.completed_at                         AS completed_at,
    p.description                          AS notes,
    p.created_at                           AS created_at,
    p.updated_at                           AS updated_at
  FROM projects p;
