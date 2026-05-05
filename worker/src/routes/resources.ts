import { Hono } from "hono";
import type { Bindings, Variables } from "../types";
import { requireAuth } from "../middleware";

const resources = new Hono<{ Bindings: Bindings; Variables: Variables }>();
resources.use("*", requireAuth("admin"));

const ALLOWED_TYPES = [
  "template",
  "contacts",
  "checklist",
  "brand_asset",
  "link",
  "doc",
];

resources.get("/", async (c) => {
  const projectId = c.req.query("project_id");
  const where = projectId ? "WHERE project_id = ?" : "";
  const stmt = c.env.DB.prepare(
    `SELECT * FROM project_resources ${where} ORDER BY sort_order ASC, created_at DESC`
  );
  const bound = projectId ? stmt.bind(projectId) : stmt;
  const { results } = await bound.all();
  return c.json(results);
});

resources.post("/", async (c) => {
  const body = await c.req.json<{
    project_id?: number;
    type?: string;
    title?: string;
    content_markdown?: string;
    url?: string;
    sort_order?: number;
    source_path?: string;
  }>();
  if (!body.project_id || !body.type || !body.title) {
    return c.json({ error: "project_id, type, and title required" }, 400);
  }
  if (!ALLOWED_TYPES.includes(body.type)) {
    return c.json({ error: `type must be one of ${ALLOWED_TYPES.join(", ")}` }, 400);
  }
  const result = await c.env.DB.prepare(
    `INSERT INTO project_resources
       (project_id, type, title, content_markdown, url, sort_order, source_path)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      body.project_id,
      body.type,
      body.title,
      body.content_markdown ?? null,
      body.url ?? null,
      body.sort_order ?? 0,
      body.source_path ?? null
    )
    .run();
  return c.json({ success: true, id: result.meta.last_row_id });
});

resources.patch("/:id", async (c) => {
  const body = await c.req.json<Record<string, string | number | null>>();
  const allowed = ["type", "title", "content_markdown", "url", "sort_order"];
  const sets: string[] = [];
  const params: (string | number | null)[] = [];
  for (const key of allowed) {
    if (key in body) {
      if (key === "type" && !ALLOWED_TYPES.includes(String(body[key]))) {
        return c.json({ error: "invalid type" }, 400);
      }
      sets.push(`${key} = ?`);
      params.push(body[key] as string | number | null);
    }
  }
  if (sets.length === 0) return c.json({ error: "nothing to update" }, 400);
  sets.push("updated_at = datetime('now')");
  params.push(c.req.param("id"));
  await c.env.DB.prepare(
    `UPDATE project_resources SET ${sets.join(", ")} WHERE id = ?`
  )
    .bind(...params)
    .run();
  return c.json({ success: true });
});

resources.delete("/:id", async (c) => {
  await c.env.DB.prepare("DELETE FROM project_resources WHERE id = ?")
    .bind(c.req.param("id"))
    .run();
  return c.json({ success: true });
});

export default resources;
