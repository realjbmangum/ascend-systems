import { Hono } from "hono";
import type { Bindings, Variables } from "../types";
import { requireAuth } from "../middleware";
import { sendSequenceStep } from "../email";

const sequences = new Hono<{ Bindings: Bindings; Variables: Variables }>();

sequences.use("*", requireAuth("admin"));

sequences.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT s.*,
       (SELECT COUNT(*) FROM email_sequence_steps WHERE sequence_id = s.id) AS step_count,
       (SELECT COUNT(*) FROM email_enrollments WHERE sequence_id = s.id AND completed_at IS NULL) AS active_enrollments
     FROM email_sequences s ORDER BY s.created_at DESC`
  ).all();
  return c.json(results);
});

sequences.post("/", async (c) => {
  const body = await c.req.json<{ name?: string; trigger?: string }>();
  if (!body.name || !body.trigger) {
    return c.json({ error: "name and trigger required" }, 400);
  }
  const result = await c.env.DB.prepare(
    `INSERT INTO email_sequences (name, trigger) VALUES (?, ?)`
  )
    .bind(body.name, body.trigger)
    .run();
  return c.json({ success: true, id: result.meta.last_row_id });
});

sequences.get("/:id", async (c) => {
  const seq = await c.env.DB.prepare(
    "SELECT * FROM email_sequences WHERE id = ?"
  )
    .bind(c.req.param("id"))
    .first();
  if (!seq) return c.json({ error: "not found" }, 404);
  const { results: steps } = await c.env.DB.prepare(
    "SELECT * FROM email_sequence_steps WHERE sequence_id = ? ORDER BY step_order"
  )
    .bind(c.req.param("id"))
    .all();
  return c.json({ ...seq, steps });
});

sequences.post("/:id/steps", async (c) => {
  const body = await c.req.json<{
    subject?: string;
    body_html?: string;
    delay_hours?: number;
    step_order?: number;
  }>();
  if (!body.subject || !body.body_html) {
    return c.json({ error: "subject and body_html required" }, 400);
  }
  const result = await c.env.DB.prepare(
    `INSERT INTO email_sequence_steps (sequence_id, subject, body_html, delay_hours, step_order)
     VALUES (?, ?, ?, ?, ?)`
  )
    .bind(
      c.req.param("id"),
      body.subject,
      body.body_html,
      body.delay_hours ?? 0,
      body.step_order ?? 0
    )
    .run();
  return c.json({ success: true, id: result.meta.last_row_id });
});

export default sequences;

// ---- Helpers callable from other routes / cron (no auth) ----

export async function enrollEmail(
  db: D1Database,
  sequenceId: number,
  email: string,
  clientId?: number | null
): Promise<void> {
  // Avoid duplicate active enrollments
  const existing = await db
    .prepare(
      `SELECT id FROM email_enrollments
       WHERE sequence_id = ? AND email = ? AND completed_at IS NULL`
    )
    .bind(sequenceId, email)
    .first();
  if (existing) return;
  await db
    .prepare(
      `INSERT INTO email_enrollments (sequence_id, email, client_id) VALUES (?, ?, ?)`
    )
    .bind(sequenceId, email, clientId ?? null)
    .run();
}

export async function enrollByTrigger(
  db: D1Database,
  trigger: string,
  email: string,
  clientId?: number | null
): Promise<void> {
  const { results } = await db
    .prepare(
      "SELECT id FROM email_sequences WHERE trigger = ? AND active = 1"
    )
    .bind(trigger)
    .all<{ id: number }>();
  for (const seq of results) {
    await enrollEmail(db, seq.id, email, clientId);
  }
}

// Cron worker: send all enrollments whose next step delay has elapsed.
export async function processEnrollments(db: D1Database): Promise<{
  sent: number;
  completed: number;
}> {
  const { results: enrollments } = await db
    .prepare(
      `SELECT * FROM email_enrollments WHERE completed_at IS NULL`
    )
    .all<{
      id: number;
      sequence_id: number;
      email: string;
      step_index: number;
      last_sent_at: string | null;
      created_at: string;
    }>();

  let sent = 0;
  let completed = 0;

  for (const e of enrollments) {
    const { results: steps } = await db
      .prepare(
        "SELECT * FROM email_sequence_steps WHERE sequence_id = ? ORDER BY step_order"
      )
      .bind(e.sequence_id)
      .all<{
        id: number;
        subject: string;
        body_html: string;
        delay_hours: number;
      }>();

    if (e.step_index >= steps.length) {
      await db
        .prepare(
          "UPDATE email_enrollments SET completed_at = datetime('now') WHERE id = ?"
        )
        .bind(e.id)
        .run();
      completed++;
      continue;
    }

    const step = steps[e.step_index];
    const referenceTime = e.last_sent_at ?? e.created_at;
    const dueRow = await db
      .prepare(
        `SELECT (julianday('now') - julianday(?)) * 24 AS hours_elapsed`
      )
      .bind(referenceTime)
      .first<{ hours_elapsed: number }>();
    const hoursElapsed = dueRow?.hours_elapsed ?? 0;

    if (hoursElapsed >= step.delay_hours) {
      const ok = await sendSequenceStep(e.email, step.subject, step.body_html);
      if (ok) {
        await db
          .prepare(
            `UPDATE email_enrollments
             SET step_index = step_index + 1, last_sent_at = datetime('now')
             WHERE id = ?`
          )
          .bind(e.id)
          .run();
        sent++;
      }
    }
  }

  return { sent, completed };
}
