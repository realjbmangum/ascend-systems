import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Bindings, Variables } from "./types";
import { requireAuth } from "./middleware";
import authRoutes from "./routes/auth";
import taskRoutes, { createTask } from "./routes/tasks";
import noteRoutes from "./routes/notes";
import invoiceRoutes, { handleStripeWebhook } from "./routes/invoices";
import sequenceRoutes, {
  enrollByTrigger,
  processEnrollments,
} from "./routes/email-sequences";
import portalRoutes from "./routes/portal";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use(
  "/api/*",
  cors({
    origin: [
      "https://ascendsystems.ai",
      "https://www.ascendsystems.ai",
      "https://ascend-systems.pages.dev",
      "http://localhost:5173",
    ],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    credentials: true,
  })
);

// ---------------------------------------------------------------------------
// PUBLIC ROUTES
// ---------------------------------------------------------------------------

// Contact form — creates a lead, a follow-up task, and enrolls in welcome drip.
app.post("/api/contact", async (c) => {
  const body = await c.req.json<{
    name?: string;
    email?: string;
    company?: string;
    project_type?: string;
    budget_range?: string;
    message?: string;
  }>();
  if (!body.name || !body.email) {
    return c.json({ error: "name and email are required" }, 400);
  }
  const result = await c.env.DB.prepare(
    `INSERT INTO leads (name, email, company, project_type, budget_range, message)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(
      body.name,
      body.email,
      body.company ?? null,
      body.project_type ?? null,
      body.budget_range ?? null,
      body.message ?? null
    )
    .run();
  const leadId = result.meta.last_row_id as number;

  await createTask(c.env.DB, {
    type: "lead_inquiry",
    title: `New lead: ${body.name}${body.company ? ` (${body.company})` : ""}`,
    description: body.message ?? undefined,
    lead_id: leadId,
    priority: "medium",
    metadata: {
      email: body.email,
      project_type: body.project_type,
      budget_range: body.budget_range,
    },
  });

  await enrollByTrigger(c.env.DB, "lead_welcome", body.email.toLowerCase());

  return c.json({ success: true, id: leadId });
});

// Intake form — structured project intake with extra fields.
app.post("/api/intake", async (c) => {
  const body = await c.req.json<{
    name?: string;
    email?: string;
    company?: string;
    project_type?: string;
    budget_range?: string;
    timeline?: string;
    goals?: string;
    current_stack?: string;
    message?: string;
  }>();
  if (!body.name || !body.email) {
    return c.json({ error: "name and email are required" }, 400);
  }

  const composedMessage = [
    body.message,
    body.goals && `Goals: ${body.goals}`,
    body.timeline && `Timeline: ${body.timeline}`,
    body.current_stack && `Current stack: ${body.current_stack}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const result = await c.env.DB.prepare(
    `INSERT INTO leads (name, email, company, project_type, budget_range, message, status)
     VALUES (?, ?, ?, ?, ?, ?, 'qualified')`
  )
    .bind(
      body.name,
      body.email,
      body.company ?? null,
      body.project_type ?? null,
      body.budget_range ?? null,
      composedMessage || null
    )
    .run();
  const leadId = result.meta.last_row_id as number;

  await createTask(c.env.DB, {
    type: "intake_submitted",
    title: `Intake submitted: ${body.company ?? body.name}`,
    description: composedMessage,
    lead_id: leadId,
    priority: "high",
    metadata: {
      email: body.email,
      timeline: body.timeline,
      goals: body.goals,
    },
  });

  return c.json({ success: true, id: leadId });
});

// Legacy endpoint — keep for backward compatibility.
app.post("/api/leads", async (c) => {
  const body = await c.req.json<{
    name?: string;
    email?: string;
    company?: string;
    project_type?: string;
    budget_range?: string;
    message?: string;
  }>();
  if (!body.name || !body.email) {
    return c.json({ error: "name and email are required" }, 400);
  }
  const result = await c.env.DB.prepare(
    `INSERT INTO leads (name, email, company, project_type, budget_range, message)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(
      body.name,
      body.email,
      body.company ?? null,
      body.project_type ?? null,
      body.budget_range ?? null,
      body.message ?? null
    )
    .run();
  return c.json({ success: true, id: result.meta.last_row_id });
});

// Stripe webhook — public, signature-verified.
app.post("/api/webhooks/stripe", handleStripeWebhook);

// ---------------------------------------------------------------------------
// AUTH ROUTES (public — generate / verify / logout / me)
// ---------------------------------------------------------------------------
app.route("/api/auth", authRoutes);

// ---------------------------------------------------------------------------
// CLIENT PORTAL (client session required)
// ---------------------------------------------------------------------------
app.route("/api/portal", portalRoutes);

// ---------------------------------------------------------------------------
// ADMIN ROUTES (admin session required)
// ---------------------------------------------------------------------------

const admin = new Hono<{ Bindings: Bindings; Variables: Variables }>();
admin.use("*", requireAuth("admin"));

admin.get("/leads", async (c) => {
  const status = c.req.query("status");
  let query = "SELECT * FROM leads";
  const params: string[] = [];
  if (status) {
    query += " WHERE status = ?";
    params.push(status);
  }
  query += " ORDER BY created_at DESC";
  const { results } = await c.env.DB.prepare(query).bind(...params).all();
  return c.json(results);
});

admin.get("/leads/:id", async (c) => {
  const lead = await c.env.DB.prepare("SELECT * FROM leads WHERE id = ?")
    .bind(c.req.param("id"))
    .first();
  if (!lead) return c.json({ error: "not found" }, 404);
  return c.json(lead);
});

admin.patch("/leads/:id", async (c) => {
  const body = await c.req.json<{ status?: string; notes?: string }>();
  const sets: string[] = [];
  const params: (string | number)[] = [];
  if (body.status) {
    sets.push("status = ?");
    params.push(body.status);
  }
  if (body.notes !== undefined) {
    sets.push("notes = ?");
    params.push(body.notes);
  }
  if (sets.length === 0) return c.json({ error: "nothing to update" }, 400);
  sets.push("updated_at = datetime('now')");
  params.push(c.req.param("id"));
  await c.env.DB.prepare(`UPDATE leads SET ${sets.join(", ")} WHERE id = ?`)
    .bind(...params)
    .run();
  return c.json({ success: true });
});

admin.post("/leads/:id/convert", async (c) => {
  const leadId = c.req.param("id");
  const lead = await c.env.DB.prepare("SELECT * FROM leads WHERE id = ?")
    .bind(leadId)
    .first<{
      id: number;
      name: string;
      email: string;
      company: string | null;
      project_type: string | null;
      message: string | null;
    }>();
  if (!lead) return c.json({ error: "lead not found" }, 404);

  const clientResult = await c.env.DB.prepare(
    `INSERT INTO clients (company_name, contact_name, email, lead_id)
     VALUES (?, ?, ?, ?)`
  )
    .bind(lead.company ?? lead.name, lead.name, lead.email, lead.id)
    .run();
  const clientId = clientResult.meta.last_row_id;

  const projectResult = await c.env.DB.prepare(
    `INSERT INTO projects (client_id, name, project_type, description)
     VALUES (?, ?, ?, ?)`
  )
    .bind(
      clientId,
      `${lead.company ?? lead.name} Project`,
      lead.project_type ?? null,
      lead.message ?? null
    )
    .run();

  await c.env.DB.prepare(
    `UPDATE leads SET status = 'won', updated_at = datetime('now') WHERE id = ?`
  )
    .bind(leadId)
    .run();

  const client = await c.env.DB.prepare("SELECT * FROM clients WHERE id = ?")
    .bind(clientId)
    .first();
  const project = await c.env.DB.prepare("SELECT * FROM projects WHERE id = ?")
    .bind(projectResult.meta.last_row_id)
    .first();
  return c.json({ client, project });
});

admin.get("/clients", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT c.*, COUNT(p.id) AS project_count
     FROM clients c
     LEFT JOIN projects p ON p.client_id = c.id
     GROUP BY c.id
     ORDER BY c.created_at DESC`
  ).all();
  return c.json(results);
});

admin.get("/clients/:id", async (c) => {
  const client = await c.env.DB.prepare("SELECT * FROM clients WHERE id = ?")
    .bind(c.req.param("id"))
    .first();
  if (!client) return c.json({ error: "not found" }, 404);
  const { results: projects } = await c.env.DB.prepare(
    "SELECT * FROM projects WHERE client_id = ? ORDER BY created_at DESC"
  )
    .bind(c.req.param("id"))
    .all();
  return c.json({ ...client, projects });
});

admin.post("/clients", async (c) => {
  const body = await c.req.json<{
    company_name?: string;
    contact_name?: string;
    email?: string;
    phone?: string;
    notes?: string;
  }>();
  if (!body.company_name || !body.contact_name || !body.email) {
    return c.json(
      { error: "company_name, contact_name, and email are required" },
      400
    );
  }
  const result = await c.env.DB.prepare(
    `INSERT INTO clients (company_name, contact_name, email, phone, notes)
     VALUES (?, ?, ?, ?, ?)`
  )
    .bind(
      body.company_name,
      body.contact_name,
      body.email,
      body.phone ?? null,
      body.notes ?? null
    )
    .run();
  return c.json({ success: true, id: result.meta.last_row_id });
});

admin.patch("/clients/:id", async (c) => {
  const body = await c.req.json<Record<string, string | null>>();
  const allowed = ["company_name", "contact_name", "email", "phone", "notes"];
  const sets: string[] = [];
  const params: (string | null)[] = [];
  for (const key of allowed) {
    if (key in body) {
      sets.push(`${key} = ?`);
      params.push(body[key]);
    }
  }
  if (sets.length === 0) return c.json({ error: "nothing to update" }, 400);
  sets.push("updated_at = datetime('now')");
  params.push(c.req.param("id"));
  await c.env.DB.prepare(`UPDATE clients SET ${sets.join(", ")} WHERE id = ?`)
    .bind(...params)
    .run();
  return c.json({ success: true });
});

admin.get("/projects", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT p.*, c.company_name AS client_name
     FROM projects p
     JOIN clients c ON c.id = p.client_id
     ORDER BY p.created_at DESC`
  ).all();
  return c.json(results);
});

admin.get("/projects/:id", async (c) => {
  const project = await c.env.DB.prepare(
    `SELECT p.*, c.company_name AS client_name, c.contact_name, c.email AS client_email
     FROM projects p
     JOIN clients c ON c.id = p.client_id
     WHERE p.id = ?`
  )
    .bind(c.req.param("id"))
    .first();
  if (!project) return c.json({ error: "not found" }, 404);
  return c.json(project);
});

admin.post("/projects", async (c) => {
  const body = await c.req.json<{
    client_id?: number;
    name?: string;
    description?: string;
    project_type?: string;
    notes?: string;
  }>();
  if (!body.client_id || !body.name) {
    return c.json({ error: "client_id and name are required" }, 400);
  }
  const result = await c.env.DB.prepare(
    `INSERT INTO projects (client_id, name, description, project_type, notes)
     VALUES (?, ?, ?, ?, ?)`
  )
    .bind(
      body.client_id,
      body.name,
      body.description ?? null,
      body.project_type ?? null,
      body.notes ?? null
    )
    .run();
  return c.json({ success: true, id: result.meta.last_row_id });
});

admin.patch("/projects/:id", async (c) => {
  const body = await c.req.json<Record<string, string | null>>();
  const allowed = [
    "name",
    "description",
    "project_type",
    "status",
    "notes",
    "started_at",
    "completed_at",
  ];
  const sets: string[] = [];
  const params: (string | null)[] = [];
  for (const key of allowed) {
    if (key in body) {
      sets.push(`${key} = ?`);
      params.push(body[key]);
    }
  }
  if (sets.length === 0) return c.json({ error: "nothing to update" }, 400);
  sets.push("updated_at = datetime('now')");
  params.push(c.req.param("id"));
  await c.env.DB.prepare(`UPDATE projects SET ${sets.join(", ")} WHERE id = ?`)
    .bind(...params)
    .run();
  return c.json({ success: true });
});

admin.get("/stats", async (c) => {
  const totalLeads =
    (
      await c.env.DB.prepare("SELECT COUNT(*) AS count FROM leads").first<{
        count: number;
      }>()
    )?.count ?? 0;
  const newThisWeek =
    (
      await c.env.DB.prepare(
        "SELECT COUNT(*) AS count FROM leads WHERE created_at >= datetime('now', '-7 days')"
      ).first<{ count: number }>()
    )?.count ?? 0;
  const activeClients =
    (
      await c.env.DB.prepare("SELECT COUNT(*) AS count FROM clients").first<{
        count: number;
      }>()
    )?.count ?? 0;
  const activeProjects =
    (
      await c.env.DB.prepare(
        "SELECT COUNT(*) AS count FROM projects WHERE status IN ('scoping', 'in_progress')"
      ).first<{ count: number }>()
    )?.count ?? 0;
  const openTasks =
    (
      await c.env.DB.prepare(
        "SELECT COUNT(*) AS count FROM tasks WHERE status = 'open'"
      ).first<{ count: number }>()
    )?.count ?? 0;
  const unpaidInvoices =
    (
      await c.env.DB.prepare(
        "SELECT COALESCE(SUM(amount_cents), 0) AS total FROM invoices WHERE status IN ('sent', 'overdue')"
      ).first<{ total: number }>()
    )?.total ?? 0;
  return c.json({
    totalLeads,
    newThisWeek,
    activeClients,
    activeProjects,
    openTasks,
    unpaidInvoiceCents: unpaidInvoices,
  });
});

// Mount sub-routers under admin
admin.route("/tasks", taskRoutes);
admin.route("/projects", noteRoutes); // /projects/:id/notes
admin.route("/invoices", invoiceRoutes);
admin.route("/email-sequences", sequenceRoutes);

// Email enrollments (admin)
admin.post("/email-enrollments", async (c) => {
  const body = await c.req.json<{
    sequence_id?: number;
    email?: string;
    client_id?: number;
  }>();
  if (!body.sequence_id || !body.email) {
    return c.json({ error: "sequence_id and email required" }, 400);
  }
  const { enrollEmail } = await import("./routes/email-sequences");
  await enrollEmail(
    c.env.DB,
    body.sequence_id,
    body.email.toLowerCase(),
    body.client_id ?? null
  );
  return c.json({ success: true });
});

admin.post("/email-sequences/process", async (c) => {
  const stats = await processEnrollments(c.env.DB);
  return c.json(stats);
});

app.route("/api", admin);

// ---------------------------------------------------------------------------
// SCHEDULED HANDLER — drip processor
// ---------------------------------------------------------------------------

export default {
  fetch: app.fetch.bind(app),
  async scheduled(
    _event: ScheduledEvent,
    env: Bindings,
    ctx: ExecutionContext
  ) {
    ctx.waitUntil(processEnrollments(env.DB).then(() => undefined));
  },
};
