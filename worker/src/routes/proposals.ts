import { Hono } from "hono";
import type { Bindings, Variables } from "../types";
import { requireAuth } from "../middleware";

const proposals = new Hono<{ Bindings: Bindings; Variables: Variables }>();

proposals.use("*", requireAuth("admin"));

proposals.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT pr.*, c.company_name AS client_name, p.name AS project_name
     FROM proposals pr
     LEFT JOIN clients c ON c.id = pr.client_id
     LEFT JOIN projects p ON p.id = pr.project_id
     ORDER BY pr.created_at DESC`
  ).all();
  return c.json(results);
});

proposals.get("/:id", async (c) => {
  const proposal = await c.env.DB.prepare(
    `SELECT pr.*, c.company_name AS client_name, c.contact_name, c.email AS client_email,
            p.name AS project_name
     FROM proposals pr
     LEFT JOIN clients c ON c.id = pr.client_id
     LEFT JOIN projects p ON p.id = pr.project_id
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
    title?: string;
    intro?: string;
    scope?: string;
    deliverables?: string;
    timeline?: string;
    price_summary?: string;
    total_cents?: number;
  }>();
  if (!body.title) {
    return c.json({ error: "title is required" }, 400);
  }
  const sign_token = crypto.randomUUID();
  const result = await c.env.DB.prepare(
    `INSERT INTO proposals
       (client_id, project_id, title, intro, scope, deliverables, timeline,
        price_summary, total_cents, sign_token)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      body.client_id ?? null,
      body.project_id ?? null,
      body.title,
      body.intro ?? null,
      body.scope ?? null,
      body.deliverables ?? null,
      body.timeline ?? null,
      body.price_summary ?? null,
      body.total_cents ?? 0,
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

proposals.post("/:id/send", async (c) => {
  const id = c.req.param("id");
  const proposal = await c.env.DB.prepare(
    "SELECT id, sign_token FROM proposals WHERE id = ?"
  )
    .bind(id)
    .first<{ id: number; sign_token: string | null }>();
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

  const origin = c.env.APP_ORIGIN ?? "https://ascendsystems.ai";
  return c.json({
    success: true,
    sign_url: `${origin}/proposals/${token}`,
  });
});

export default proposals;
