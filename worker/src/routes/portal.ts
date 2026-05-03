import { Hono } from "hono";
import type { Bindings, Variables } from "../types";
import { requireAuth } from "../middleware";

const portal = new Hono<{ Bindings: Bindings; Variables: Variables }>();

portal.use("*", requireAuth("client"));

portal.get("/projects", async (c) => {
  const session = c.get("session");
  if (!session.client_id) return c.json([]);
  const { results } = await c.env.DB.prepare(
    `SELECT id, name, description, project_type, status, started_at, completed_at, created_at
     FROM projects WHERE client_id = ? ORDER BY created_at DESC`
  )
    .bind(session.client_id)
    .all();
  return c.json(results);
});

portal.get("/projects/:id", async (c) => {
  const session = c.get("session");
  const project = await c.env.DB.prepare(
    `SELECT id, client_id, name, description, project_type, status,
            started_at, completed_at, created_at
     FROM projects WHERE id = ? AND client_id = ?`
  )
    .bind(c.req.param("id"), session.client_id)
    .first();
  if (!project) return c.json({ error: "not found" }, 404);

  const { results: notes } = await c.env.DB.prepare(
    `SELECT id, author, content, created_at
     FROM project_notes
     WHERE project_id = ? AND visible_to_client = 1
     ORDER BY created_at DESC`
  )
    .bind(c.req.param("id"))
    .all();

  return c.json({ ...project, notes });
});

portal.get("/invoices", async (c) => {
  const session = c.get("session");
  if (!session.client_id) return c.json([]);
  const { results } = await c.env.DB.prepare(
    `SELECT i.id, i.amount_cents, i.status, i.description, i.due_date,
            i.paid_at, i.created_at, i.stripe_invoice_id, p.name AS project_name
     FROM invoices i
     LEFT JOIN projects p ON p.id = i.project_id
     WHERE i.client_id = ? AND i.status != 'draft'
     ORDER BY i.created_at DESC`
  )
    .bind(session.client_id)
    .all();
  return c.json(results);
});

export default portal;
