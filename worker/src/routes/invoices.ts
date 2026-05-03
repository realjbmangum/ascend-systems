import { Hono } from "hono";
import type { Bindings, Variables } from "../types";
import { requireAuth } from "../middleware";
import {
  findOrCreateCustomer,
  createInvoiceItem,
  createStripeInvoice,
  sendStripeInvoice,
} from "../stripe";
import { createTask } from "./tasks";

const invoices = new Hono<{ Bindings: Bindings; Variables: Variables }>();

invoices.use("*", requireAuth("admin"));

invoices.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT i.*, c.company_name AS client_name, p.name AS project_name
     FROM invoices i
     JOIN clients c ON c.id = i.client_id
     LEFT JOIN projects p ON p.id = i.project_id
     ORDER BY i.created_at DESC`
  ).all();
  return c.json(results);
});

invoices.get("/:id", async (c) => {
  const id = c.req.param("id");
  const invoice = await c.env.DB.prepare(
    `SELECT i.*, c.company_name AS client_name, c.email AS client_email,
            c.contact_name, p.name AS project_name
     FROM invoices i
     JOIN clients c ON c.id = i.client_id
     LEFT JOIN projects p ON p.id = i.project_id
     WHERE i.id = ?`
  )
    .bind(id)
    .first();
  if (!invoice) return c.json({ error: "not found" }, 404);
  const { results: lineItems } = await c.env.DB.prepare(
    "SELECT * FROM invoice_line_items WHERE invoice_id = ? ORDER BY id"
  )
    .bind(id)
    .all();
  return c.json({ ...invoice, line_items: lineItems });
});

invoices.post("/", async (c) => {
  const body = await c.req.json<{
    client_id?: number;
    project_id?: number;
    description?: string;
    due_date?: string;
    line_items?: Array<{
      description: string;
      quantity?: number;
      unit_price_cents: number;
    }>;
  }>();
  if (!body.client_id || !body.line_items?.length) {
    return c.json({ error: "client_id and line_items required" }, 400);
  }
  const total = body.line_items.reduce(
    (sum, li) => sum + li.unit_price_cents * (li.quantity ?? 1),
    0
  );
  const result = await c.env.DB.prepare(
    `INSERT INTO invoices (client_id, project_id, amount_cents, description, due_date)
     VALUES (?, ?, ?, ?, ?)`
  )
    .bind(
      body.client_id,
      body.project_id ?? null,
      total,
      body.description ?? null,
      body.due_date ?? null
    )
    .run();
  const invoiceId = result.meta.last_row_id as number;

  for (const li of body.line_items) {
    await c.env.DB.prepare(
      `INSERT INTO invoice_line_items (invoice_id, description, quantity, unit_price_cents)
       VALUES (?, ?, ?, ?)`
    )
      .bind(invoiceId, li.description, li.quantity ?? 1, li.unit_price_cents)
      .run();
  }

  return c.json({ success: true, id: invoiceId });
});

invoices.patch("/:id", async (c) => {
  const body = await c.req.json<{
    status?: string;
    description?: string;
    due_date?: string;
  }>();
  const sets: string[] = [];
  const params: (string | number)[] = [];
  for (const [k, v] of Object.entries(body)) {
    if (v !== undefined && ["status", "description", "due_date"].includes(k)) {
      sets.push(`${k} = ?`);
      params.push(v as string);
    }
  }
  if (sets.length === 0) return c.json({ error: "nothing to update" }, 400);
  sets.push("updated_at = datetime('now')");
  params.push(c.req.param("id"));
  await c.env.DB.prepare(
    `UPDATE invoices SET ${sets.join(", ")} WHERE id = ?`
  )
    .bind(...params)
    .run();
  return c.json({ success: true });
});

invoices.post("/:id/send", async (c) => {
  if (!c.env.STRIPE_SECRET_KEY) {
    return c.json({ error: "STRIPE_SECRET_KEY not configured" }, 500);
  }
  const id = c.req.param("id");
  const invoice = await c.env.DB.prepare(
    `SELECT i.*, c.email AS client_email, c.contact_name
     FROM invoices i JOIN clients c ON c.id = i.client_id WHERE i.id = ?`
  )
    .bind(id)
    .first<{
      id: number;
      client_id: number;
      client_email: string;
      contact_name: string;
      description: string | null;
    }>();
  if (!invoice) return c.json({ error: "not found" }, 404);

  const { results: lineItems } = await c.env.DB.prepare(
    "SELECT * FROM invoice_line_items WHERE invoice_id = ?"
  )
    .bind(id)
    .all<{
      description: string;
      quantity: number;
      unit_price_cents: number;
    }>();

  const customerId = await findOrCreateCustomer(
    c.env.STRIPE_SECRET_KEY,
    invoice.client_email,
    invoice.contact_name
  );

  for (const li of lineItems) {
    await createInvoiceItem(
      c.env.STRIPE_SECRET_KEY,
      customerId,
      li.unit_price_cents * li.quantity,
      li.description
    );
  }

  const stripeInvoice = await createStripeInvoice(
    c.env.STRIPE_SECRET_KEY,
    customerId,
    invoice.description ?? undefined
  );
  const sent = await sendStripeInvoice(
    c.env.STRIPE_SECRET_KEY,
    stripeInvoice.id
  );

  await c.env.DB.prepare(
    `UPDATE invoices SET stripe_invoice_id = ?, status = 'sent',
       updated_at = datetime('now') WHERE id = ?`
  )
    .bind(stripeInvoice.id, id)
    .run();

  return c.json({
    success: true,
    stripe_invoice_id: stripeInvoice.id,
    hosted_invoice_url: sent.hosted_invoice_url,
  });
});

// Stripe webhook — must NOT use requireAuth. This sub-router is admin-only,
// so the webhook is mounted separately in index.ts.
export async function handleStripeWebhook(
  c: import("hono").Context<{ Bindings: Bindings; Variables: Variables }>
) {
  if (!c.env.STRIPE_WEBHOOK_SECRET) {
    return c.json({ error: "webhook not configured" }, 500);
  }
  const sig = c.req.header("stripe-signature");
  if (!sig) return c.json({ error: "missing signature" }, 400);

  const payload = await c.req.raw.text();
  const { verifyStripeSignature } = await import("../stripe");
  const ok = await verifyStripeSignature(payload, sig, c.env.STRIPE_WEBHOOK_SECRET);
  if (!ok) return c.json({ error: "invalid signature" }, 400);

  const event = JSON.parse(payload) as {
    type: string;
    data: { object: Record<string, unknown> };
  };
  const obj = event.data.object as {
    id?: string;
    payment_intent?: string;
    customer_email?: string;
  };

  if (event.type === "invoice.paid" && obj.id) {
    const row = await c.env.DB.prepare(
      "SELECT id, client_id FROM invoices WHERE stripe_invoice_id = ?"
    )
      .bind(obj.id)
      .first<{ id: number; client_id: number }>();
    if (row) {
      await c.env.DB.prepare(
        `UPDATE invoices SET status = 'paid', paid_at = datetime('now'),
           stripe_payment_intent_id = ?, updated_at = datetime('now') WHERE id = ?`
      )
        .bind(obj.payment_intent ?? null, row.id)
        .run();
      await createTask(c.env.DB, {
        type: "payment_received",
        title: `Invoice #${row.id} paid`,
        client_id: row.client_id,
        priority: "low",
        metadata: { invoice_id: row.id, stripe_invoice_id: obj.id },
      });
    }
  } else if (
    (event.type === "invoice.payment_failed" ||
      event.type === "invoice.marked_uncollectible") &&
    obj.id
  ) {
    const row = await c.env.DB.prepare(
      "SELECT id, client_id FROM invoices WHERE stripe_invoice_id = ?"
    )
      .bind(obj.id)
      .first<{ id: number; client_id: number }>();
    if (row) {
      await c.env.DB.prepare(
        `UPDATE invoices SET status = 'overdue', updated_at = datetime('now') WHERE id = ?`
      )
        .bind(row.id)
        .run();
      await createTask(c.env.DB, {
        type: "payment_failed",
        title: `Invoice #${row.id} payment failed`,
        client_id: row.client_id,
        priority: "high",
        metadata: { invoice_id: row.id, event: event.type },
      });
    }
  }

  return c.json({ received: true });
}

export default invoices;
