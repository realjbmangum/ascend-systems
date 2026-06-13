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

  // Attach the most recent invoice generated from this proposal (if any), so
  // the admin UI can show "View Invoice #X" instead of re-billing.
  const linkedInvoice = await c.env.DB.prepare(
    `SELECT id, status, billing_type, recurring_interval, amount_cents,
            stripe_invoice_id, stripe_subscription_id
     FROM invoices WHERE proposal_id = ? ORDER BY id DESC LIMIT 1`
  )
    .bind(c.req.param("id"))
    .first();

  return c.json({ ...proposal, linked_invoice: linkedInvoice ?? null });
});

// Generate a draft invoice from a signed proposal. Maps the pricing model to a
// recurring (retainer) or one-time invoice, links it back to the proposal, and
// is idempotent — if an invoice already exists for this proposal, it returns
// that one instead of creating a duplicate. Does NOT touch Stripe; the admin
// reviews the draft and pushes it from the invoice page.
proposals.post("/:id/generate-invoice", async (c) => {
  const id = c.req.param("id");
  const proposal = await c.env.DB.prepare(
    `SELECT id, client_id, project_id, title, total_cents, pricing_model,
            status, signed_at, selected_tier, tiers, payment_schedule,
            price_summary, deliverables, scope
     FROM proposals WHERE id = ?`
  )
    .bind(id)
    .first<{
      id: number;
      client_id: number | null;
      project_id: number | null;
      title: string;
      total_cents: number | null;
      pricing_model: string | null;
      status: string | null;
      signed_at: string | null;
      selected_tier: string | null;
      tiers: string | null;
      payment_schedule: string | null;
      price_summary: string | null;
      deliverables: string | null;
      scope: string | null;
    }>();
  if (!proposal) return c.json({ error: "not found" }, 404);
  if (proposal.status !== "accepted" && !proposal.signed_at) {
    return c.json(
      { error: "Proposal must be signed/accepted before it can be billed." },
      400
    );
  }
  if (!proposal.client_id) {
    return c.json(
      { error: "Proposal has no client — convert the lead to a client first." },
      400
    );
  }
  const amount = proposal.total_cents ?? 0;
  if (amount <= 0) {
    return c.json({ error: "Proposal has no amount to bill." }, 400);
  }

  // Idempotent guard against double-billing.
  const existing = await c.env.DB.prepare(
    `SELECT id FROM invoices WHERE proposal_id = ? ORDER BY id DESC LIMIT 1`
  )
    .bind(id)
    .first<{ id: number }>();
  if (existing) {
    return c.json({ success: true, id: existing.id, already_existed: true });
  }

  const recurring = proposal.pricing_model === "retainer";
  const billingType = recurring ? "recurring" : "one_time";
  const interval = recurring ? "month" : null;

  // Carry the proposal's real detail onto the invoice. When the proposal has
  // pricing tiers, pull the SELECTED tier's name + included features so the
  // invoice itemizes what the retainer covers instead of a bare one-liner.
  const stripMd = (s: string | null | undefined) =>
    (s || "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim();

  let selectedTier:
    | { name?: string; optionKey?: string; features?: string[] }
    | null = null;
  if (proposal.tiers && proposal.selected_tier) {
    try {
      const arr = JSON.parse(proposal.tiers);
      if (Array.isArray(arr)) {
        selectedTier =
          arr.find(
            (t: { key?: string }) =>
              String(t.key).toLowerCase() ===
              String(proposal.selected_tier).toLowerCase()
          ) ?? null;
      }
    } catch {
      // malformed tiers JSON — fall back to the title
    }
  }

  // Itemize what the price covers as $0 detail lines under the main billable
  // line — tier features for a tiered retainer, or the deliverables list for a
  // fixed-fee / project proposal. Falls back to the title when there's nothing.
  const parseList = (raw: string | null | undefined): string[] => {
    if (!raw) return [];
    // Split a "1) ... 2) ... 3) ..." or semicolon-separated list into items.
    const parts = /\d+\)/.test(raw)
      ? raw.split(/\s*\d+\)\s*/)
      : raw.split(/;\s*/);
    return parts
      .map((p) => stripMd(p).replace(/[;.]+$/, "").trim())
      .filter(Boolean);
  };

  const detailLines: string[] = [];
  let mainLabel = recurring
    ? `${proposal.title} — monthly retainer`
    : proposal.title;
  let invoiceDescription = mainLabel;

  if (selectedTier) {
    const tierLabel = [
      stripMd(selectedTier.name),
      selectedTier.optionKey ? `(${stripMd(selectedTier.optionKey)})` : "",
    ]
      .filter(Boolean)
      .join(" ");
    mainLabel = `Fractional CTO Retainer — ${tierLabel}`.trim();
    const feats = (selectedTier.features ?? []).map(stripMd).filter(Boolean);
    for (const f of feats) detailLines.push(`Included — ${f}`);
    const terms = stripMd(proposal.payment_schedule) || "Net 15 days.";
    invoiceDescription =
      `${mainLabel}.` +
      (feats.length ? ` Includes: ${feats.join("; ")}.` : "") +
      ` ${terms}`;
  } else {
    for (const d of parseList(proposal.deliverables)) {
      detailLines.push(`Deliverable — ${d}`);
    }
    const summary = stripMd(proposal.scope) || stripMd(proposal.price_summary) || "";
    const terms = stripMd(proposal.payment_schedule);
    invoiceDescription =
      [`${mainLabel}.`, summary, terms].filter(Boolean).join(" ").slice(0, 800) ||
      mainLabel;
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO invoices
       (client_id, project_id, proposal_id, amount_cents, description,
        billing_type, recurring_interval, status, due_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', date('now','+15 day'))`
  )
    .bind(
      proposal.client_id,
      proposal.project_id ?? null,
      id,
      amount,
      invoiceDescription,
      billingType,
      interval
    )
    .run();
  const invoiceId = result.meta.last_row_id as number;

  // Main billable line.
  await c.env.DB.prepare(
    `INSERT INTO invoice_line_items (invoice_id, description, quantity, unit_price_cents)
     VALUES (?, ?, 1, ?)`
  )
    .bind(invoiceId, mainLabel, amount)
    .run();
  // Itemized detail as $0 lines (tier inclusions or project deliverables).
  for (const line of detailLines) {
    await c.env.DB.prepare(
      `INSERT INTO invoice_line_items (invoice_id, description, quantity, unit_price_cents)
       VALUES (?, ?, 1, 0)`
    )
      .bind(invoiceId, line)
      .run();
  }

  return c.json({ success: true, id: invoiceId, already_existed: false });
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
    "tiers", // JSON string — admin pricing-tier editor
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

// Mark a proposal accepted on the client's behalf (e.g. a verbal yes), so it
// can be converted to an invoice without the public e-sign flow. Records
// signed_at + a signer name for the audit trail.
proposals.post("/:id/mark-accepted", async (c) => {
  const id = c.req.param("id");
  const body = await c.req
    .json<{ signer_name?: string }>()
    .catch(() => ({} as { signer_name?: string }));
  const row = await c.env.DB.prepare(
    `SELECT pr.id, c.contact_name
     FROM proposals pr LEFT JOIN clients c ON c.id = pr.client_id
     WHERE pr.id = ?`
  )
    .bind(id)
    .first<{ id: number; contact_name: string | null }>();
  if (!row) return c.json({ error: "not found" }, 404);

  const signer =
    body.signer_name?.trim() ||
    (row.contact_name ? `${row.contact_name} (verbal)` : "Accepted offline");

  await c.env.DB.prepare(
    `UPDATE proposals
     SET status = 'accepted', signed_at = datetime('now'),
         signer_name = ?, updated_at = datetime('now')
     WHERE id = ?`
  )
    .bind(signer, id)
    .run();

  return c.json({ success: true, signer_name: signer });
});

export default proposals;
