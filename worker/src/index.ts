import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS
app.use(
  "/api/*",
  cors({
    origin: [
      "https://ascendsystems.ai",
      "https://www.ascendsystems.ai",
      "https://ascend-systems.pages.dev",
      "http://localhost:5173",
    ],
    allowMethods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

// ---------------------------------------------------------------------------
// PUBLIC
// ---------------------------------------------------------------------------

// Submit a lead (contact form)
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

// ---------------------------------------------------------------------------
// ADMIN ROUTES
// Protected by Cloudflare Access — add Access policy for /api/* minus POST /api/leads
// ---------------------------------------------------------------------------

// List leads
app.get("/api/leads", async (c) => {
  const status = c.req.query("status");
  let query = "SELECT * FROM leads";
  const params: string[] = [];

  if (status) {
    query += " WHERE status = ?";
    params.push(status);
  }
  query += " ORDER BY created_at DESC";

  const { results } = await c.env.DB.prepare(query)
    .bind(...params)
    .all();

  return c.json(results);
});

// Single lead
app.get("/api/leads/:id", async (c) => {
  const lead = await c.env.DB.prepare("SELECT * FROM leads WHERE id = ?")
    .bind(c.req.param("id"))
    .first();

  if (!lead) return c.json({ error: "not found" }, 404);
  return c.json(lead);
});

// Update lead status / notes
app.patch("/api/leads/:id", async (c) => {
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

  if (sets.length === 0) {
    return c.json({ error: "nothing to update" }, 400);
  }

  sets.push("updated_at = datetime('now')");
  params.push(c.req.param("id"));

  await c.env.DB.prepare(
    `UPDATE leads SET ${sets.join(", ")} WHERE id = ?`
  )
    .bind(...params)
    .run();

  return c.json({ success: true });
});

// Convert lead to client + project
app.post("/api/leads/:id/convert", async (c) => {
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

  // Create client
  const clientResult = await c.env.DB.prepare(
    `INSERT INTO clients (company_name, contact_name, email, lead_id)
     VALUES (?, ?, ?, ?)`
  )
    .bind(lead.company ?? lead.name, lead.name, lead.email, lead.id)
    .run();

  const clientId = clientResult.meta.last_row_id;

  // Create project stub
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

  // Mark lead as won
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

// ---------------------------------------------------------------------------
// CLIENTS
// ---------------------------------------------------------------------------

// List clients with project count
app.get("/api/clients", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT c.*, COUNT(p.id) AS project_count
     FROM clients c
     LEFT JOIN projects p ON p.client_id = c.id
     GROUP BY c.id
     ORDER BY c.created_at DESC`
  ).all();

  return c.json(results);
});

// Single client with projects
app.get("/api/clients/:id", async (c) => {
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

// Create client
app.post("/api/clients", async (c) => {
  const body = await c.req.json<{
    company_name?: string;
    contact_name?: string;
    email?: string;
    phone?: string;
    notes?: string;
  }>();

  if (!body.company_name || !body.contact_name || !body.email) {
    return c.json({ error: "company_name, contact_name, and email are required" }, 400);
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

// Update client
app.patch("/api/clients/:id", async (c) => {
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

  await c.env.DB.prepare(
    `UPDATE clients SET ${sets.join(", ")} WHERE id = ?`
  )
    .bind(...params)
    .run();

  return c.json({ success: true });
});

// ---------------------------------------------------------------------------
// PROJECTS
// ---------------------------------------------------------------------------

// List projects with client name
app.get("/api/projects", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT p.*, c.company_name AS client_name
     FROM projects p
     JOIN clients c ON c.id = p.client_id
     ORDER BY p.created_at DESC`
  ).all();

  return c.json(results);
});

// Single project with client info
app.get("/api/projects/:id", async (c) => {
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

// Create project
app.post("/api/projects", async (c) => {
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

// Update project
app.patch("/api/projects/:id", async (c) => {
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

  await c.env.DB.prepare(
    `UPDATE projects SET ${sets.join(", ")} WHERE id = ?`
  )
    .bind(...params)
    .run();

  return c.json({ success: true });
});

// ---------------------------------------------------------------------------
// STATS
// ---------------------------------------------------------------------------

app.get("/api/stats", async (c) => {
  const totalLeads =
    (await c.env.DB.prepare("SELECT COUNT(*) AS count FROM leads").first<{ count: number }>())
      ?.count ?? 0;

  const newThisWeek =
    (
      await c.env.DB.prepare(
        "SELECT COUNT(*) AS count FROM leads WHERE created_at >= datetime('now', '-7 days')"
      ).first<{ count: number }>()
    )?.count ?? 0;

  const activeClients =
    (await c.env.DB.prepare("SELECT COUNT(*) AS count FROM clients").first<{ count: number }>())
      ?.count ?? 0;

  const activeProjects =
    (
      await c.env.DB.prepare(
        "SELECT COUNT(*) AS count FROM projects WHERE status IN ('scoping', 'in_progress')"
      ).first<{ count: number }>()
    )?.count ?? 0;

  return c.json({ totalLeads, newThisWeek, activeClients, activeProjects });
});

export default app;
