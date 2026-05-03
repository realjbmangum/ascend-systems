import { Hono } from "hono";
import type { Bindings, Variables } from "../types";
import { requireAuth } from "../middleware";

const notes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Admin-only: full read + write on project notes.
notes.use("*", requireAuth("admin"));

notes.get("/:id/notes", async (c) => {
  const projectId = c.req.param("id");
  const { results } = await c.env.DB.prepare(
    `SELECT * FROM project_notes WHERE project_id = ? ORDER BY created_at DESC`
  )
    .bind(projectId)
    .all();
  return c.json(results);
});

notes.post("/:id/notes", async (c) => {
  const projectId = c.req.param("id");
  const body = await c.req.json<{
    content?: string;
    visible_to_client?: boolean;
    author?: string;
  }>();
  if (!body.content) return c.json({ error: "content required" }, 400);
  const session = c.get("session");
  const result = await c.env.DB.prepare(
    `INSERT INTO project_notes (project_id, author, content, visible_to_client)
     VALUES (?, ?, ?, ?)`
  )
    .bind(
      projectId,
      body.author ?? session.email ?? "Brian",
      body.content,
      body.visible_to_client ? 1 : 0
    )
    .run();
  return c.json({ success: true, id: result.meta.last_row_id });
});

notes.patch("/:id/notes/:noteId", async (c) => {
  const body = await c.req.json<{
    content?: string;
    visible_to_client?: boolean;
  }>();
  const sets: string[] = [];
  const params: (string | number)[] = [];
  if (body.content !== undefined) {
    sets.push("content = ?");
    params.push(body.content);
  }
  if (body.visible_to_client !== undefined) {
    sets.push("visible_to_client = ?");
    params.push(body.visible_to_client ? 1 : 0);
  }
  if (sets.length === 0) return c.json({ error: "nothing to update" }, 400);
  sets.push("updated_at = datetime('now')");
  params.push(c.req.param("noteId"), c.req.param("id"));
  await c.env.DB.prepare(
    `UPDATE project_notes SET ${sets.join(", ")} WHERE id = ? AND project_id = ?`
  )
    .bind(...params)
    .run();
  return c.json({ success: true });
});

notes.delete("/:id/notes/:noteId", async (c) => {
  await c.env.DB.prepare(
    "DELETE FROM project_notes WHERE id = ? AND project_id = ?"
  )
    .bind(c.req.param("noteId"), c.req.param("id"))
    .run();
  return c.json({ success: true });
});

export default notes;
