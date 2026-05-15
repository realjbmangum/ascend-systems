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
import proposalRoutes from "./routes/proposals";
import analyticsRoutes, { refreshAllProjectAnalytics } from "./routes/analytics";
import resourceRoutes from "./routes/resources";
import toolsRoutes from "./routes/tools";
import activityRoutes from "./routes/activities";
import { sendFormConfirmation, sendAdminAlert } from "./email";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use(
  "/api/*",
  cors({
    origin: [
      "https://ascendsystems.ai",
      "https://www.ascendsystems.ai",
      "https://admin.ascendsystems.ai",
      "https://ascend-systems.pages.dev",
      "https://ascend-admin.pages.dev",
      "http://localhost:5173",
      "http://localhost:4321",
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

  if (c.env.SENDGRID_API_KEY) {
    c.executionCtx.waitUntil(
      Promise.all([
        sendFormConfirmation(c.env.SENDGRID_API_KEY, body.email, "contact", body.name),
        sendAdminAlert(
          c.env.SENDGRID_API_KEY,
          {
            name: body.name,
            email: body.email,
            company: body.company,
            project_type: body.project_type,
            budget_range: body.budget_range,
            message: body.message,
          },
          "contact",
          leadId
        ),
      ]).then(() => undefined)
    );
  }

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

  if (c.env.SENDGRID_API_KEY) {
    c.executionCtx.waitUntil(
      Promise.all([
        sendFormConfirmation(c.env.SENDGRID_API_KEY, body.email, "intake", body.name),
        sendAdminAlert(
          c.env.SENDGRID_API_KEY,
          {
            name: body.name,
            email: body.email,
            company: body.company,
            project_type: body.project_type,
            budget_range: body.budget_range,
            timeline: body.timeline,
            goals: body.goals,
            current_stack: body.current_stack,
            message: body.message,
          },
          "intake",
          leadId
        ),
      ]).then(() => undefined)
    );
  }

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
// PUBLIC PROPOSAL SIGN — read + sign by token, no auth required.
// ---------------------------------------------------------------------------

app.get("/api/proposals/sign/:token", async (c) => {
  const token = c.req.param("token");
  const proposal = await c.env.DB.prepare(
    `SELECT pr.id, pr.status, pr.title, pr.intro, pr.scope, pr.deliverables,
            pr.timeline, pr.price_summary, pr.total_cents, pr.signed_at,
            pr.signer_name, c.company_name AS client_name
     FROM proposals pr
     LEFT JOIN clients c ON c.id = pr.client_id
     WHERE pr.sign_token = ?`
  )
    .bind(token)
    .first();
  if (!proposal) return c.json({ error: "not found" }, 404);
  return c.json(proposal);
});

app.post("/api/proposals/sign/:token", async (c) => {
  const token = c.req.param("token");
  const body = await c.req.json<{ signer_name?: string }>();
  const signerName = (body.signer_name ?? "").trim();
  if (!signerName) {
    return c.json({ error: "signer_name is required" }, 400);
  }
  const proposal = await c.env.DB.prepare(
    "SELECT id, status FROM proposals WHERE sign_token = ?"
  )
    .bind(token)
    .first<{ id: number; status: string }>();
  if (!proposal) return c.json({ error: "not found" }, 404);
  if (proposal.status !== "draft" && proposal.status !== "sent") {
    return c.json({ error: "proposal is not signable" }, 400);
  }
  const ip =
    c.req.header("cf-connecting-ip") ??
    c.req.header("x-forwarded-for") ??
    "unknown";
  await c.env.DB.prepare(
    `UPDATE proposals
       SET status = 'accepted',
           signed_at = datetime('now'),
           signer_name = ?,
           signer_ip = ?,
           updated_at = datetime('now')
     WHERE id = ?`
  )
    .bind(signerName, ip, proposal.id)
    .run();
  const updated = await c.env.DB.prepare(
    "SELECT signed_at FROM proposals WHERE id = ?"
  )
    .bind(proposal.id)
    .first<{ signed_at: string }>();
  return c.json({ success: true, signed_at: updated?.signed_at });
});

// ---------------------------------------------------------------------------
// AUTH ROUTES (public — generate / verify / logout / me)
// ---------------------------------------------------------------------------
app.route("/api/auth", authRoutes);

// ---------------------------------------------------------------------------
// TOOLS ROUTES (public — cost calculator + future free tools)
// ---------------------------------------------------------------------------
app.route("/api/tools", toolsRoutes);

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

admin.delete("/leads/:id", async (c) => {
  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM tasks WHERE lead_id = ?").bind(id).run();
  await c.env.DB.prepare("DELETE FROM lead_activities WHERE lead_id = ?")
    .bind(id)
    .run();
  const files = await c.env.FILES_BUCKET.list({ prefix: `leads/${id}/` });
  await Promise.all(
    files.objects.map((obj) => c.env.FILES_BUCKET.delete(obj.key))
  );
  await c.env.DB.prepare("DELETE FROM leads WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

const LEAD_EDITABLE_FIELDS = [
  "name",
  "email",
  "company",
  "project_type",
  "budget_range",
  "message",
  "status",
  "notes",
  "phone",
  "website",
  "linkedin",
  "title",
  "address",
  "industry",
  "employee_count",
  "annual_revenue",
  "deal_value_cents",
  "expected_close_date",
  "source_origin",
  "source_channel",
  "source_channel_id",
  "owner",
  "labels",
] as const;

admin.patch("/leads/:id", async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  const sets: string[] = [];
  const params: (string | number | null)[] = [];
  for (const key of LEAD_EDITABLE_FIELDS) {
    if (key in body) {
      sets.push(`${key} = ?`);
      params.push(body[key] as string | number | null);
    }
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
      phone: string | null;
      website: string | null;
    }>();
  if (!lead) return c.json({ error: "lead not found" }, 404);

  const clientResult = await c.env.DB.prepare(
    `INSERT INTO clients (company_name, contact_name, email, phone, website_url, lead_id)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(
      lead.company ?? lead.name,
      lead.name,
      lead.email,
      lead.phone ?? null,
      lead.website ?? null,
      lead.id
    )
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

  // Carry the lead's uploaded files (PRDs, docs) over to the new project.
  const newProjectId = projectResult.meta.last_row_id;
  const leadFiles = await c.env.FILES_BUCKET.list({
    prefix: `leads/${leadId}/`,
  });
  await Promise.all(
    leadFiles.objects.map(async (obj) => {
      const src = await c.env.FILES_BUCKET.get(obj.key);
      if (!src) return;
      const filename = obj.key.slice(`leads/${leadId}/`.length);
      await c.env.FILES_BUCKET.put(
        `projects/${newProjectId}/${filename}`,
        src.body,
        { httpMetadata: src.httpMetadata }
      );
    })
  );

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
    website_url?: string;
  }>();
  if (!body.company_name || !body.contact_name || !body.email) {
    return c.json(
      { error: "company_name, contact_name, and email are required" },
      400
    );
  }
  const result = await c.env.DB.prepare(
    `INSERT INTO clients (company_name, contact_name, email, phone, notes, website_url)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(
      body.company_name,
      body.contact_name,
      body.email,
      body.phone ?? null,
      body.notes ?? null,
      body.website_url ?? null
    )
    .run();
  return c.json({ success: true, id: result.meta.last_row_id });
});

admin.delete("/clients/:id", async (c) => {
  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM invoice_line_items WHERE invoice_id IN (SELECT id FROM invoices WHERE client_id = ?)").bind(id).run();
  await c.env.DB.prepare("DELETE FROM invoices WHERE client_id = ?").bind(id).run();
  await c.env.DB.prepare("DELETE FROM project_notes WHERE project_id IN (SELECT id FROM projects WHERE client_id = ?)").bind(id).run();
  await c.env.DB.prepare("DELETE FROM tasks WHERE client_id = ?").bind(id).run();
  await c.env.DB.prepare("DELETE FROM projects WHERE client_id = ?").bind(id).run();
  await c.env.DB.prepare("DELETE FROM sessions WHERE client_id = ?").bind(id).run();
  await c.env.DB.prepare("DELETE FROM clients WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

admin.patch("/clients/:id", async (c) => {
  const body = await c.req.json<Record<string, string | null>>();
  const allowed = ["company_name", "contact_name", "email", "phone", "notes", "website_url"];
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

admin.delete("/projects/:id", async (c) => {
  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM invoice_line_items WHERE invoice_id IN (SELECT id FROM invoices WHERE project_id = ?)").bind(id).run();
  await c.env.DB.prepare("DELETE FROM invoices WHERE project_id = ?").bind(id).run();
  await c.env.DB.prepare("DELETE FROM project_notes WHERE project_id = ?").bind(id).run();
  await c.env.DB.prepare("UPDATE tasks SET project_id = NULL WHERE project_id = ?").bind(id).run();
  await c.env.DB.prepare("DELETE FROM projects WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

admin.get("/projects/:id/tasks", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at DESC"
  ).bind(c.req.param("id")).all();
  return c.json(results);
});

// ---------------------------------------------------------------------------
// PROJECT FILES (R2)
// ---------------------------------------------------------------------------

function r2FileName(key: string): string {
  return (key.split("/").pop() ?? key).replace(/^\d+-/, "");
}

// Map a filename extension to a content type when the browser didn't supply
// one (common for locally-generated .html PRDs dragged in from disk).
const EXT_CONTENT_TYPES: Record<string, string> = {
  html: "text/html",
  htm: "text/html",
  pdf: "application/pdf",
  txt: "text/plain",
  md: "text/markdown",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

function contentTypeFor(filename: string, providedType: string): string {
  if (providedType && providedType !== "application/octet-stream")
    return providedType;
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return EXT_CONTENT_TYPES[ext] ?? providedType ?? "application/octet-stream";
}

// Files the browser can render in a tab; everything else downloads.
function isInlineType(contentType: string): boolean {
  return (
    contentType.startsWith("text/html") ||
    contentType.startsWith("application/pdf") ||
    contentType.startsWith("text/plain") ||
    contentType.startsWith("image/")
  );
}

function serveR2Object(obj: R2ObjectBody, key: string): Response {
  const contentType =
    obj.httpMetadata?.contentType ?? "application/octet-stream";
  const filename = r2FileName(key);
  const inline = isInlineType(contentType);
  // Strip CR/LF so a crafted filename can't inject response headers.
  const safeName = filename.replace(/[\r\n"]/g, "");
  const headers = new Headers();
  headers.set("Content-Type", contentType);
  headers.set(
    "Content-Disposition",
    `${inline ? "inline" : "attachment"}; filename="${safeName}"`
  );
  // Uploaded HTML (e.g. PRDs) renders in-browser. The `sandbox` directive
  // gives the document an opaque origin: no scripts, no forms, no access to
  // the admin session cookie — so a malicious uploaded doc is inert.
  if (contentType.startsWith("text/html")) {
    headers.set(
      "Content-Security-Policy",
      "default-src 'none'; img-src data: https:; style-src 'unsafe-inline' https:; font-src https: data:; sandbox"
    );
  }
  return new Response(obj.body, { headers });
}

// Uploaded file keys always have the shape `<timestamp>-<sanitized-name>`.
// Reject anything else so a client-supplied :filekey can't address an
// arbitrary R2 object outside the intended prefix.
const FILE_KEY_RE = /^\d+-[A-Za-z0-9._-]+$/;

admin.get("/projects/:id/files", async (c) => {
  const prefix = `projects/${c.req.param("id")}/`;
  const listed = await c.env.FILES_BUCKET.list({ prefix });
  return c.json(
    listed.objects.map((obj) => ({
      key: obj.key.slice(prefix.length),
      name: r2FileName(obj.key),
      size: obj.size,
      uploaded: obj.uploaded.toISOString(),
    }))
  );
});

admin.post("/projects/:id/files", async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file") as File | null;
  if (!file || !file.name) return c.json({ error: "no file provided" }, 400);
  const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filekey = `${Date.now()}-${sanitized}`;
  const key = `projects/${c.req.param("id")}/${filekey}`;
  await c.env.FILES_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: contentTypeFor(file.name, file.type) },
  });
  return c.json({ key: filekey, name: file.name, size: file.size });
});

admin.get("/projects/:id/files/:filekey", async (c) => {
  const filekey = c.req.param("filekey");
  if (!FILE_KEY_RE.test(filekey))
    return c.json({ error: "invalid file key" }, 400);
  const key = `projects/${c.req.param("id")}/${filekey}`;
  const obj = await c.env.FILES_BUCKET.get(key);
  if (!obj) return c.json({ error: "not found" }, 404);
  return serveR2Object(obj, key);
});

admin.delete("/projects/:id/files/:filekey", async (c) => {
  const filekey = c.req.param("filekey");
  if (!FILE_KEY_RE.test(filekey))
    return c.json({ error: "invalid file key" }, 400);
  const key = `projects/${c.req.param("id")}/${filekey}`;
  await c.env.FILES_BUCKET.delete(key);
  return c.json({ success: true });
});

// ---- Lead files (R2) — mirrors the project files pattern ----

admin.get("/leads/:id/files", async (c) => {
  const prefix = `leads/${c.req.param("id")}/`;
  const listed = await c.env.FILES_BUCKET.list({ prefix });
  return c.json(
    listed.objects.map((obj) => ({
      key: obj.key.slice(prefix.length),
      name: r2FileName(obj.key),
      size: obj.size,
      uploaded: obj.uploaded.toISOString(),
    }))
  );
});

admin.post("/leads/:id/files", async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file") as File | null;
  if (!file || !file.name) return c.json({ error: "no file provided" }, 400);
  const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filekey = `${Date.now()}-${sanitized}`;
  const key = `leads/${c.req.param("id")}/${filekey}`;
  await c.env.FILES_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: contentTypeFor(file.name, file.type) },
  });
  return c.json({ key: filekey, name: file.name, size: file.size });
});

admin.get("/leads/:id/files/:filekey", async (c) => {
  const filekey = c.req.param("filekey");
  if (!FILE_KEY_RE.test(filekey))
    return c.json({ error: "invalid file key" }, 400);
  const key = `leads/${c.req.param("id")}/${filekey}`;
  const obj = await c.env.FILES_BUCKET.get(key);
  if (!obj) return c.json({ error: "not found" }, 404);
  return serveR2Object(obj, key);
});

admin.delete("/leads/:id/files/:filekey", async (c) => {
  const filekey = c.req.param("filekey");
  if (!FILE_KEY_RE.test(filekey))
    return c.json({ error: "invalid file key" }, 400);
  const key = `leads/${c.req.param("id")}/${filekey}`;
  await c.env.FILES_BUCKET.delete(key);
  return c.json({ success: true });
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
    "cloudflare_zone_tag",
    "analytics_domain",
    "analytics_source",
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

admin.get("/subscriptions", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT s.*, c.company_name AS client_name
     FROM subscriptions s
     JOIN clients c ON c.id = s.client_id
     ORDER BY s.created_at DESC`
  ).all();
  return c.json(results);
});

admin.delete("/subscriptions/:id", async (c) => {
  const row = await c.env.DB.prepare(
    "SELECT * FROM subscriptions WHERE id = ?"
  )
    .bind(c.req.param("id"))
    .first<{ stripe_subscription_id?: string }>();
  if (row?.stripe_subscription_id && c.env.STRIPE_SECRET_KEY) {
    const { cancelSubscription } = await import("./stripe");
    await cancelSubscription(c.env.STRIPE_SECRET_KEY, row.stripe_subscription_id);
  }
  await c.env.DB.prepare("DELETE FROM subscriptions WHERE id = ?")
    .bind(c.req.param("id"))
    .run();
  return c.json({ success: true });
});

// Mount sub-routers under admin
admin.route("/tasks", taskRoutes);
admin.route("/projects", noteRoutes); // /projects/:id/notes
admin.route("/invoices", invoiceRoutes);
admin.route("/proposals", proposalRoutes);
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
  if (!c.env.SENDGRID_API_KEY) {
    return c.json({ error: "SENDGRID_API_KEY not configured" }, 500);
  }
  const stats = await processEnrollments(c.env.DB, c.env.SENDGRID_API_KEY);
  return c.json(stats);
});

admin.route("/analytics", analyticsRoutes);
admin.route("/resources", resourceRoutes);
admin.route("/activities", activityRoutes);

app.route("/api", admin);

// ---------------------------------------------------------------------------
// SCHEDULED HANDLER — drip processor
// ---------------------------------------------------------------------------

export default {
  fetch: app.fetch.bind(app),
  async scheduled(
    event: ScheduledEvent,
    env: Bindings,
    ctx: ExecutionContext
  ) {
    if (env.SENDGRID_API_KEY) {
      ctx.waitUntil(
        processEnrollments(env.DB, env.SENDGRID_API_KEY).then(() => undefined)
      );
    }
    // Daily Cloudflare Analytics refresh — runs once per day at the 03:xx UTC slot.
    // Cron fires every 15 min; we only do the analytics work in one of those windows.
    const now = new Date(event.scheduledTime);
    if (now.getUTCHours() === 3 && now.getUTCMinutes() < 15 && env.CF_API_TOKEN) {
      ctx.waitUntil(
        refreshAllProjectAnalytics(env).then(() => undefined)
      );
    }
  },
};
