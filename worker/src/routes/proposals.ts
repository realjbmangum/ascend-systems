import { Hono } from "hono";
import type { Bindings, Variables } from "../types";
import { requireAuth } from "../middleware";
import { sendProposalEmail } from "../email";

const proposals = new Hono<{ Bindings: Bindings; Variables: Variables }>();

proposals.use("*", requireAuth("admin"));

proposals.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT pr.*, c.company_name AS client_name, p.name AS project_name,
            l.name AS lead_name, l.company AS lead_company
     FROM proposals pr
     LEFT JOIN clients c ON c.id = pr.client_id
     LEFT JOIN projects p ON p.id = pr.project_id
     LEFT JOIN leads l ON l.id = pr.lead_id
     ORDER BY pr.created_at DESC`
  ).all();
  return c.json(results);
});

proposals.get("/:id", async (c) => {
  const proposal = await c.env.DB.prepare(
    `SELECT pr.*, c.company_name AS client_name, c.contact_name, c.email AS client_email,
            p.name AS project_name,
            l.name AS lead_name, l.company AS lead_company, l.email AS lead_email
     FROM proposals pr
     LEFT JOIN clients c ON c.id = pr.client_id
     LEFT JOIN projects p ON p.id = pr.project_id
     LEFT JOIN leads l ON l.id = pr.lead_id
     WHERE pr.id = ?`
  )
    .bind(c.req.param("id"))
    .first();
  if (!proposal) return c.json({ error: "not found" }, 404);
  return c.json(proposal);
});

proposals.post("/", async (c) => {
  const body = await c.req.json<{
    client_id?: number | null;
    project_id?: number | null;
    lead_id?: number | null;
    title?: string;
    intro?: string;
    scope?: string;
    deliverables?: string;
    timeline?: string;
    price_summary?: string;
    total_cents?: number;
    out_of_scope?: string;
    pricing_model?: string;
    payment_schedule?: string;
    client_responsibilities?: string;
    acceptance_criteria?: string;
    msa_version?: string;
  }>();
  if (!body.title) {
    return c.json({ error: "title is required" }, 400);
  }
  const sign_token = crypto.randomUUID();
  const result = await c.env.DB.prepare(
    `INSERT INTO proposals
       (client_id, project_id, lead_id, title, intro, scope, deliverables,
        timeline, price_summary, total_cents, out_of_scope, pricing_model,
        payment_schedule, client_responsibilities, acceptance_criteria,
        msa_version, sign_token)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      body.client_id ?? null,
      body.project_id ?? null,
      body.lead_id ?? null,
      body.title,
      body.intro ?? null,
      body.scope ?? null,
      body.deliverables ?? null,
      body.timeline ?? null,
      body.price_summary ?? null,
      body.total_cents ?? 0,
      body.out_of_scope ?? null,
      body.pricing_model ?? null,
      body.payment_schedule ?? null,
      body.client_responsibilities ?? null,
      body.acceptance_criteria ?? null,
      body.msa_version ?? "2026-05",
      sign_token
    )
    .run();
  return c.json({
    success: true,
    id: result.meta.last_row_id,
    sign_token,
  });
});

proposals.patch("/:id", async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  const allowed = [
    "title",
    "intro",
    "scope",
    "deliverables",
    "timeline",
    "price_summary",
    "total_cents",
    "out_of_scope",
    "pricing_model",
    "payment_schedule",
    "client_responsibilities",
    "acceptance_criteria",
    "msa_version",
    "status",
  ];
  const sets: string[] = [];
  const params: (string | number | null)[] = [];
  for (const key of allowed) {
    if (key in body) {
      sets.push(`${key} = ?`);
      params.push(body[key] as string | number | null);
    }
  }
  if (sets.length === 0) return c.json({ error: "nothing to update" }, 400);
  sets.push("updated_at = datetime('now')");
  params.push(c.req.param("id"));
  await c.env.DB.prepare(
    `UPDATE proposals SET ${sets.join(", ")} WHERE id = ?`
  )
    .bind(...params)
    .run();
  return c.json({ success: true });
});

proposals.delete("/:id", async (c) => {
  await c.env.DB.prepare("DELETE FROM proposals WHERE id = ?")
    .bind(c.req.param("id"))
    .run();
  return c.json({ success: true });
});

// Marks the proposal sent, emails the recipient the sign link, and returns
// the signing URL. If no recipient email is on file (or SendGrid is not
// configured), it still returns the link so the admin can send it manually.
proposals.post("/:id/send", async (c) => {
  const id = c.req.param("id");
  const proposal = await c.env.DB.prepare(
    `SELECT pr.id, pr.sign_token, pr.title,
            pr.pricing_model, pr.total_cents,
            c.email AS client_email, c.contact_name, c.company_name,
            l.email AS lead_email, l.name AS lead_name, l.company AS lead_company
     FROM proposals pr
     LEFT JOIN clients c ON c.id = pr.client_id
     LEFT JOIN leads l ON l.id = pr.lead_id
     WHERE pr.id = ?`
  )
    .bind(id)
    .first<{
      id: number;
      sign_token: string | null;
      title: string;
      pricing_model: string | null;
      total_cents: number | null;
      client_email: string | null;
      contact_name: string | null;
      company_name: string | null;
      lead_email: string | null;
      lead_name: string | null;
      lead_company: string | null;
    }>();
  if (!proposal) return c.json({ error: "not found" }, 404);

  let token = proposal.sign_token;
  if (!token) {
    token = crypto.randomUUID();
    await c.env.DB.prepare(
      `UPDATE proposals SET sign_token = ?, status = 'sent',
         updated_at = datetime('now') WHERE id = ?`
    )
      .bind(token, id)
      .run();
  } else {
    await c.env.DB.prepare(
      `UPDATE proposals SET status = 'sent', updated_at = datetime('now')
       WHERE id = ?`
    )
      .bind(id)
      .run();
  }

  // The public sign page (ProposalSign) is served by the admin SPA, so the
  // client-facing sign link must point at the admin origin — not APP_ORIGIN.
  const origin =
    c.env.ADMIN_ORIGIN ?? c.env.APP_ORIGIN ?? "https://admin.ascendsystems.ai";
  const signUrl = `${origin}/proposals/${token}`;

  const recipientEmail = proposal.client_email ?? proposal.lead_email ?? null;
  const recipientName =
    proposal.contact_name ?? proposal.lead_name ?? undefined;

  // Build a tight pricing headline for the "At a glance" chip in the email.
  // Retainer → "$3,000 / month". Fixed → "$X total". Time/Materials → label only.
  let pricingHeadline: string | undefined;
  if (proposal.pricing_model === "retainer" && (proposal.total_cents ?? 0) > 0) {
    pricingHeadline = `$${((proposal.total_cents ?? 0) / 100).toLocaleString("en-US")} / month retainer`;
  } else if (proposal.pricing_model === "fixed" && (proposal.total_cents ?? 0) > 0) {
    pricingHeadline = `$${((proposal.total_cents ?? 0) / 100).toLocaleString("en-US")} fixed`;
  } else if (proposal.pricing_model === "time_materials") {
    pricingHeadline = "Time & Materials";
  }

  const clientName = proposal.company_name ?? proposal.lead_company ?? undefined;

  let emailed = false;
  if (recipientEmail && c.env.SENDGRID_API_KEY) {
    emailed = await sendProposalEmail(c.env.SENDGRID_API_KEY, {
      to: recipientEmail,
      recipientName,
      proposalTitle: proposal.title,
      signUrl,
      clientName,
      proposalNumber: proposal.id,
      pricingHeadline,
    });
  }

  return c.json({
    success: true,
    sign_url: signUrl,
    emailed,
    recipient: recipientEmail,
  });
});

export default proposals;
