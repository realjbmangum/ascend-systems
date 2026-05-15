import { Hono } from "hono";
import type { Bindings, Variables } from "../types";
import { requireAuth } from "../middleware";
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  type ActivityForSync,
} from "../graph";

const activities = new Hono<{ Bindings: Bindings; Variables: Variables }>();

activities.use("*", requireAuth("admin"));

const ACTIVITY_TYPES = ["call", "meeting", "email", "task", "note"];

type ActivityRow = {
  id: number;
  lead_id: number;
  type: string;
  subject: string;
  notes: string | null;
  due_at: string | null;
  duration_minutes: number | null;
  done: number;
  graph_event_id: string | null;
};

function toSync(row: {
  type: string;
  subject: string;
  notes: string | null;
  due_at: string | null;
  duration_minutes: number | null;
}): ActivityForSync {
  return {
    type: row.type,
    subject: row.subject,
    notes: row.notes,
    due_at: row.due_at,
    duration_minutes: row.duration_minutes,
  };
}

// GET /api/activities?lead_id=N
activities.get("/", async (c) => {
  const leadId = c.req.query("lead_id");
  if (!leadId) return c.json({ error: "lead_id is required" }, 400);
  const { results } = await c.env.DB.prepare(
    `SELECT * FROM lead_activities WHERE lead_id = ?
     ORDER BY done ASC, COALESCE(due_at, created_at) ASC`
  )
    .bind(leadId)
    .all();
  return c.json(results);
});

// POST /api/activities
activities.post("/", async (c) => {
  const body = await c.req.json<{
    lead_id?: number;
    type?: string;
    subject?: string;
    notes?: string;
    due_at?: string;
    duration_minutes?: number;
  }>();
  if (!body.lead_id || !body.subject?.trim()) {
    return c.json({ error: "lead_id and subject are required" }, 400);
  }
  const type =
    body.type && ACTIVITY_TYPES.includes(body.type) ? body.type : "task";

  const result = await c.env.DB.prepare(
    `INSERT INTO lead_activities (lead_id, type, subject, notes, due_at, duration_minutes)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(
      body.lead_id,
      type,
      body.subject.trim(),
      body.notes?.trim() || null,
      body.due_at || null,
      body.duration_minutes ?? null
    )
    .run();
  const id = result.meta.last_row_id;

  // Calendar sync happens after the response — never block the CRUD call.
  if (body.due_at) {
    const sync: ActivityForSync = {
      type,
      subject: body.subject.trim(),
      notes: body.notes?.trim() || null,
      due_at: body.due_at,
      duration_minutes: body.duration_minutes ?? null,
    };
    c.executionCtx.waitUntil(
      (async () => {
        const graphEventId = await createCalendarEvent(c.env, sync);
        if (graphEventId) {
          await c.env.DB.prepare(
            "UPDATE lead_activities SET graph_event_id = ? WHERE id = ?"
          )
            .bind(graphEventId, id)
            .run();
        }
      })()
    );
  }

  return c.json({ success: true, id });
});

// PATCH /api/activities/:id
activities.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await c.env.DB.prepare(
    "SELECT * FROM lead_activities WHERE id = ?"
  )
    .bind(id)
    .first<ActivityRow>();
  if (!existing) return c.json({ error: "not found" }, 404);

  const body = await c.req.json<{
    type?: string;
    subject?: string;
    notes?: string | null;
    due_at?: string | null;
    duration_minutes?: number | null;
    done?: boolean;
  }>();

  const sets: string[] = [];
  const params: (string | number | null)[] = [];

  if (body.type && ACTIVITY_TYPES.includes(body.type)) {
    sets.push("type = ?");
    params.push(body.type);
  }
  if (body.subject !== undefined) {
    sets.push("subject = ?");
    params.push(body.subject.trim());
  }
  if (body.notes !== undefined) {
    sets.push("notes = ?");
    params.push(body.notes?.trim() || null);
  }
  if (body.due_at !== undefined) {
    sets.push("due_at = ?");
    params.push(body.due_at || null);
  }
  if (body.duration_minutes !== undefined) {
    sets.push("duration_minutes = ?");
    params.push(body.duration_minutes);
  }
  if (body.done !== undefined) {
    sets.push("done = ?", "done_at = ?");
    params.push(body.done ? 1 : 0, body.done ? new Date().toISOString() : null);
  }
  if (sets.length === 0) return c.json({ error: "nothing to update" }, 400);

  sets.push("updated_at = datetime('now')");
  params.push(id);
  await c.env.DB.prepare(
    `UPDATE lead_activities SET ${sets.join(", ")} WHERE id = ?`
  )
    .bind(...params)
    .run();

  // Reconcile the calendar event with the new state.
  const merged = {
    type: body.type ?? existing.type,
    subject: body.subject?.trim() ?? existing.subject,
    notes: body.notes !== undefined ? body.notes?.trim() || null : existing.notes,
    due_at: body.due_at !== undefined ? body.due_at || null : existing.due_at,
    duration_minutes:
      body.duration_minutes !== undefined
        ? body.duration_minutes
        : existing.duration_minutes,
  };

  // Reconcile the calendar after responding — sync never blocks the update.
  c.executionCtx.waitUntil(
    (async () => {
      if (existing.graph_event_id) {
        if (merged.due_at) {
          await updateCalendarEvent(
            c.env,
            existing.graph_event_id,
            toSync(merged)
          );
        } else {
          // Due date was cleared — drop the calendar event.
          await deleteCalendarEvent(c.env, existing.graph_event_id);
          await c.env.DB.prepare(
            "UPDATE lead_activities SET graph_event_id = NULL WHERE id = ?"
          )
            .bind(id)
            .run();
        }
      } else if (merged.due_at) {
        // Newly given a due date — create the calendar event.
        const newEventId = await createCalendarEvent(c.env, toSync(merged));
        if (newEventId) {
          await c.env.DB.prepare(
            "UPDATE lead_activities SET graph_event_id = ? WHERE id = ?"
          )
            .bind(newEventId, id)
            .run();
        }
      }
    })()
  );

  return c.json({ success: true });
});

// DELETE /api/activities/:id
activities.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await c.env.DB.prepare(
    "SELECT graph_event_id FROM lead_activities WHERE id = ?"
  )
    .bind(id)
    .first<{ graph_event_id: string | null }>();
  await c.env.DB.prepare("DELETE FROM lead_activities WHERE id = ?")
    .bind(id)
    .run();
  if (existing?.graph_event_id) {
    const eventId = existing.graph_event_id;
    c.executionCtx.waitUntil(deleteCalendarEvent(c.env, eventId));
  }
  return c.json({ success: true });
});

export default activities;
