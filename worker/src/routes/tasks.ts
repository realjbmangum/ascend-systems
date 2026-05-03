import { Hono } from "hono";
import type { Bindings, Variables } from "../types";
import { requireAuth } from "../middleware";

const tasks = new Hono<{ Bindings: Bindings; Variables: Variables }>();

tasks.use("*", requireAuth("admin"));

tasks.get("/", async (c) => {
  const status = c.req.query("status");
  const type = c.req.query("type");
  const where: string[] = [];
  const params: string[] = [];
  if (status) {
    where.push("status = ?");
    params.push(status);
  }
  if (type) {
    where.push("type = ?");
    params.push(type);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const { results } = await c.env.DB.prepare(
    `SELECT t.*, c.company_name AS client_name, l.name AS lead_name
     FROM tasks t
     LEFT JOIN clients c ON c.id = t.client_id
     LEFT JOIN leads l ON l.id = t.lead_id
     ${whereSql}
     ORDER BY
       CASE status WHEN 'open' THEN 0 WHEN 'in_progress' THEN 1 ELSE 2 END,
       created_at DESC`
  )
    .bind(...params)
    .all();
  return c.json(results);
});

tasks.post("/", async (c) => {
  const body = await c.req.json<{
    type?: string;
    title?: string;
    description?: string;
    priority?: string;
    client_id?: number;
    lead_id?: number;
    metadata?: Record<string, unknown>;
  }>();
  if (!body.type || !body.title) {
    return c.json({ error: "type and title required" }, 400);
  }
  const result = await c.env.DB.prepare(
    `INSERT INTO tasks (type, title, description, priority, client_id, lead_id, metadata_json)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      body.type,
      body.title,
      body.description ?? null,
      body.priority ?? "medium",
      body.client_id ?? null,
      body.lead_id ?? null,
      body.metadata ? JSON.stringify(body.metadata) : null
    )
    .run();
  return c.json({ success: true, id: result.meta.last_row_id });
});

tasks.patch("/:id", async (c) => {
  const body = await c.req.json<{
    status?: string;
    description?: string;
    priority?: string;
  }>();
  const sets: string[] = [];
  const params: (string | number)[] = [];
  if (body.status) {
    sets.push("status = ?");
    params.push(body.status);
    if (body.status === "done") {
      sets.push("completed_at = datetime('now')");
    }
  }
  if (body.description !== undefined) {
    sets.push("description = ?");
    params.push(body.description);
  }
  if (body.priority) {
    sets.push("priority = ?");
    params.push(body.priority);
  }
  if (sets.length === 0) return c.json({ error: "nothing to update" }, 400);
  params.push(c.req.param("id"));
  await c.env.DB.prepare(`UPDATE tasks SET ${sets.join(", ")} WHERE id = ?`)
    .bind(...params)
    .run();
  return c.json({ success: true });
});

// Helper for internal task creation from other routes (contact, intake, webhook).
export async function createTask(
  db: D1Database,
  args: {
    type: string;
    title: string;
    description?: string;
    priority?: string;
    client_id?: number | null;
    lead_id?: number | null;
    metadata?: Record<string, unknown>;
  }
): Promise<number> {
  const result = await db
    .prepare(
      `INSERT INTO tasks (type, title, description, priority, client_id, lead_id, metadata_json)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      args.type,
      args.title,
      args.description ?? null,
      args.priority ?? "medium",
      args.client_id ?? null,
      args.lead_id ?? null,
      args.metadata ? JSON.stringify(args.metadata) : null
    )
    .run();
  return result.meta.last_row_id as number;
}

export default tasks;
