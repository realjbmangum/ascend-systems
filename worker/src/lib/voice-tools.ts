// Tool definitions exposed to voice agents over the MCP server at /api/mcp.
//
// These are ACTIONS and LIVE DATA only. Static knowledge — what the five
// services are, what a case study says, what the MSA covers — is not here: it
// lives in the xAI collection built by scripts/build-voice-kb.mjs and is
// reached by the agent's file_search tool. Keeping the split clean means the
// caller-facing agent can be given depth without being given tool access.
//
// Every tool declares the scopes allowed to see it. tools/list filters by the
// calling agent's scope, and tools/call re-checks — a receptionist token can
// never reach the pipeline or invoices even if it guesses a tool name.

import type { Bindings } from "../types";
import { createTask } from "../routes/tasks";
import { enrollByTrigger } from "../routes/email-sequences";
import { sendAdminAlert } from "../email";
import { createCalendarEvent, listCalendarBusy } from "../graph";

export type ToolScope = "receptionist" | "assistant" | "client";

export type VoiceAgentRow = {
  id: number;
  key: string;
  label: string;
  scope: ToolScope;
  client_id: number | null;
  daily_cost_ceiling_cents: number;
  /**
   * Which D1 binding this agent's caller data lands in — 'DB' for Ascend's own
   * agents, 'DB_<CODE>' for a tenant. Resolved to a live D1Database in mcp.ts.
   * Per-tenant databases, never a shared table with a tenant_id column: the same
   * rule as the directory playbook, and what makes a clean client exit possible.
   */
  db_binding: string;
  /** Tenant display name the agent speaks — "Imperial Climate Control". */
  tenant_name: string | null;
};

export type ToolCtx = {
  env: Bindings;
  agent: VoiceAgentRow;
  /**
   * The TENANT database. For Ascend's own agents this is env.DB; for a client
   * agent it is that client's own D1. Every tool that touches caller data must
   * use this, never env.DB directly.
   */
  db: D1Database;
  waitUntil: (p: Promise<unknown>) => void;
};

export type ToolDef = {
  name: string;
  description: string;
  scopes: ToolScope[];
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
  handler: (args: Record<string, any>, ctx: ToolCtx) => Promise<unknown>;
};

// TENANT tools operate on ctx.db — whichever database the calling agent's row
// points at. Safe for a client agent because a client's caller can only ever
// reach that client's own database.
const TENANT: ToolScope[] = ["receptionist", "assistant", "client"];
// ASCEND-ONLY tools read Ascend's own business (our projects, our invoices, our
// SEO). They stay on env.DB and are never granted to a client or a caller.
const ASSISTANT_ONLY: ToolScope[] = ["assistant"];

// Business hours the receptionist may offer, in BUSINESS_TZ.
const BUSINESS_TZ = "America/New_York";
const DAY_START_HOUR = 9;
const DAY_END_HOUR = 17;
const SLOT_MINUTES = 30;

/**
 * Sentinel address for a caller who never gives an email. leads.email is
 * NOT NULL and stays that way (see the note in db/migrations/2026-07-24-voice.sql),
 * so we write an address that is guaranteed undeliverable by RFC 2606 and
 * suppress the drip enrollment. Greppable, and obvious in /admin/leads.
 */
function sentinelEmail(callId?: string): string {
  const suffix = (callId ?? `t${Date.now()}`).replace(/[^A-Za-z0-9_-]/g, "");
  return `voice+${suffix}@no-email.invalid`;
}

function isRealEmail(email: string | undefined | null): email is string {
  return Boolean(email && /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email) && !email.endsWith(".invalid"));
}

// --- timezone helpers -------------------------------------------------------
// Workers ships full ICU, so Intl does the DST work. We only need wall-time in
// BUSINESS_TZ <-> UTC instant, which the format-and-diff trick handles.

function tzOffsetMs(instant: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  // Intl renders midnight as hour 24 in some locales/engines; normalise.
  const hour = get("hour") % 24;
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    hour,
    get("minute"),
    get("second")
  );
  return asUtc - instant.getTime();
}

/** Wall-clock time in `tz` -> the UTC instant it refers to. */
function zonedToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  tz: string
): Date {
  const naive = Date.UTC(year, month - 1, day, hour, minute);
  // Two passes so a slot that straddles a DST transition still lands correctly.
  let guess = new Date(naive - tzOffsetMs(new Date(naive), tz));
  guess = new Date(naive - tzOffsetMs(guess, tz));
  return guess;
}

function parseDateParts(dateStr: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!match) return null;
  return { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) };
}

/** Human-readable local time, for speaking back to a caller. */
function speakTime(instant: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TZ,
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(instant);
}

// --- tools ------------------------------------------------------------------

const createLead: ToolDef = {
  name: "create_lead",
  description:
    "Record a new inbound lead captured on a phone call. Call this once you have at least the caller's name. Everything else is optional — never hold the caller on the line to fill in fields. Returns the lead id.",
  scopes: TENANT,
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Caller's full name." },
      phone: { type: "string", description: "Caller's phone number in E.164 if known." },
      email: { type: "string", description: "Caller's email, only if they offer it." },
      company: { type: "string", description: "Company or organisation name." },
      project_type: {
        type: "string",
        description:
          "Short slug for what the caller wants, in this business's own vocabulary — e.g. emergency-service, install-quote, maintenance-contract.",
      },
      budget_range: {
        type: "string",
        description: "Budget band, only if the caller volunteers one. Never push for it.",
      },
      message: {
        type: "string",
        description: "What the caller actually asked for, in their own words where possible.",
      },
      call_id: { type: "string", description: "The xAI call_id for this call." },
    },
    required: ["name"],
  },
  async handler(args, ctx) {
    const name = String(args.name).trim();
    if (!name) throw new Error("name is required");

    const realEmail = isRealEmail(args.email) ? String(args.email).toLowerCase() : null;
    const email = realEmail ?? sentinelEmail(args.call_id);

    const result = await ctx.db.prepare(
      `INSERT INTO leads (name, email, phone, company, project_type, budget_range, message,
                          source_origin, source_channel, source_channel_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'voice', ?, ?)`
    )
      .bind(
        name,
        email,
        args.phone ?? null,
        args.company ?? null,
        args.project_type ?? null,
        args.budget_range ?? null,
        args.message ?? null,
        ctx.agent.key === "receptionist" ? "phone-980" : `voice-${ctx.agent.key}`,
        args.call_id ?? null
      )
      .run();
    const leadId = result.meta.last_row_id as number;

    await createTask(ctx.db, {
      type: "lead_inquiry",
      title: `Voice lead: ${name}${args.company ? ` (${args.company})` : ""}`,
      description: args.message ? String(args.message) : undefined,
      lead_id: leadId,
      priority: "high", // someone picked up the phone — treat it as warmer than a form fill
      metadata: {
        email: realEmail ?? undefined,
        phone: args.phone,
        project_type: args.project_type,
        budget_range: args.budget_range,
        call_id: args.call_id,
        captured_by: ctx.agent.key,
      },
    });

    // Drip enrolment is an Ascend construct — email_sequences only exists in
    // ascend-db, and a tenant's caller must never be enrolled in our marketing.
    // Also: only enrol a deliverable address. The sentinel would hard-bounce and
    // damage the sending domain's reputation.
    if (realEmail && ctx.agent.db_binding === "DB") {
      await enrollByTrigger(ctx.env.DB, "lead_welcome", realEmail);
    }

    // voice_calls is a PLATFORM table and always lives in ascend-db, so Ascend
    // keeps one operational view across every tenant.
    if (args.call_id) {
      await ctx.env.DB.prepare(
        `UPDATE voice_calls SET lead_id = ?, updated_at = datetime('now') WHERE call_id = ?`
      )
        .bind(leadId, args.call_id)
        .run();
    }

    if (ctx.env.SENDGRID_API_KEY) {
      ctx.waitUntil(
        sendAdminAlert(
          ctx.env.SENDGRID_API_KEY,
          {
            name,
            email: realEmail ?? "(not given on the call)",
            phone: args.phone,
            company: args.company,
            project_type: args.project_type,
            budget_range: args.budget_range,
            message: args.message,
            captured_by: `voice agent: ${ctx.agent.label}`,
          },
          "contact",
          leadId
        )
      );
    }

    return {
      lead_id: leadId,
      email_captured: Boolean(realEmail),
      message: "Lead recorded.",
    };
  },
};

const logCallActivity: ToolDef = {
  name: "log_call_activity",
  description:
    "Log a summary of the call against an existing lead. Use at the end of a call, after create_lead.",
  scopes: TENANT,
  inputSchema: {
    type: "object",
    properties: {
      lead_id: { type: "number", description: "The lead id returned by create_lead." },
      subject: { type: "string", description: "One-line summary of the call." },
      notes: { type: "string", description: "What was discussed and what was promised." },
      duration_minutes: { type: "number", description: "Call length in minutes." },
    },
    required: ["lead_id", "subject"],
  },
  async handler(args, ctx) {
    const result = await ctx.db.prepare(
      `INSERT INTO lead_activities (lead_id, type, subject, notes, duration_minutes, done, done_at)
       VALUES (?, 'call', ?, ?, ?, 1, datetime('now'))`
    )
      .bind(
        args.lead_id,
        String(args.subject),
        args.notes ?? null,
        args.duration_minutes ?? null
      )
      .run();
    return { activity_id: result.meta.last_row_id, message: "Call logged." };
  },
};

const checkAvailability: ToolDef = {
  name: "check_availability",
  description:
    "List open meeting slots on a given date, in Eastern time. Use before offering a caller a time. Returns at most 6 slots; offer two or three, never the whole list.",
  scopes: TENANT,
  inputSchema: {
    type: "object",
    properties: {
      date: { type: "string", description: "Date to check, as YYYY-MM-DD." },
      duration_minutes: {
        type: "number",
        description: "Meeting length. Defaults to 30.",
      },
    },
    required: ["date"],
  },
  async handler(args, ctx) {
    const parts = parseDateParts(String(args.date));
    if (!parts) throw new Error("date must be in YYYY-MM-DD format");
    const duration = Number(args.duration_minutes) > 0 ? Number(args.duration_minutes) : SLOT_MINUTES;

    const dayStart = zonedToUtc(parts.y, parts.m, parts.d, DAY_START_HOUR, 0, BUSINESS_TZ);
    const dayEnd = zonedToUtc(parts.y, parts.m, parts.d, DAY_END_HOUR, 0, BUSINESS_TZ);

    // Weekend check uses the local weekday, not UTC's.
    const weekday = new Intl.DateTimeFormat("en-US", {
      timeZone: BUSINESS_TZ,
      weekday: "short",
    }).format(dayStart);
    if (weekday === "Sat" || weekday === "Sun") {
      return { date: args.date, slots: [], message: "That's a weekend — offer a weekday instead." };
    }

    const busy = await listCalendarBusy(
      ctx.env,
      dayStart.toISOString(),
      dayEnd.toISOString()
    );
    const busyRanges = busy.map((b) => ({
      start: Date.parse(b.start),
      end: Date.parse(b.end),
    }));

    const now = Date.now();
    const slots: Array<{ start: string; spoken: string }> = [];
    for (
      let t = dayStart.getTime();
      t + duration * 60_000 <= dayEnd.getTime() && slots.length < 6;
      t += SLOT_MINUTES * 60_000
    ) {
      const slotEnd = t + duration * 60_000;
      if (t < now) continue; // never offer a time that has already passed
      const clashes = busyRanges.some((b) => t < b.end && slotEnd > b.start);
      if (clashes) continue;
      slots.push({ start: new Date(t).toISOString(), spoken: speakTime(new Date(t)) });
    }

    return {
      date: args.date,
      duration_minutes: duration,
      slots,
      calendar_connected: busy.length > 0 || undefined,
    };
  },
};

const bookMeeting: ToolDef = {
  name: "book_meeting",
  description:
    "Book a meeting into the business calendar and log it against a lead. Only call this with a start time returned by check_availability, and only after the caller has agreed to it out loud.",
  scopes: TENANT,
  inputSchema: {
    type: "object",
    properties: {
      lead_id: { type: "number", description: "The lead id returned by create_lead." },
      start: { type: "string", description: "Slot start as a full ISO-8601 UTC instant." },
      duration_minutes: { type: "number", description: "Defaults to 30." },
      subject: { type: "string", description: "What the meeting is about." },
      notes: { type: "string", description: "Context for the meeting." },
    },
    required: ["lead_id", "start", "subject"],
  },
  async handler(args, ctx) {
    const start = new Date(String(args.start));
    if (Number.isNaN(start.getTime())) throw new Error("start must be a valid ISO-8601 instant");
    const duration = Number(args.duration_minutes) > 0 ? Number(args.duration_minutes) : SLOT_MINUTES;

    const lead = await ctx.db.prepare(
      `SELECT id, name, company FROM leads WHERE id = ?`
    )
      .bind(args.lead_id)
      .first<{ id: number; name: string; company: string | null }>();
    if (!lead) throw new Error(`no lead with id ${args.lead_id}`);

    const activity = {
      type: "meeting",
      subject: `${args.subject} — ${lead.name}${lead.company ? ` (${lead.company})` : ""}`,
      notes: args.notes ? String(args.notes) : null,
      due_at: start.toISOString(),
      duration_minutes: duration,
    };

    const graphEventId = await createCalendarEvent(ctx.env, activity);

    const result = await ctx.db.prepare(
      `INSERT INTO lead_activities (lead_id, type, subject, notes, due_at, duration_minutes, graph_event_id)
       VALUES (?, 'meeting', ?, ?, ?, ?, ?)`
    )
      .bind(
        lead.id,
        activity.subject,
        activity.notes,
        activity.due_at,
        duration,
        graphEventId
      )
      .run();

    return {
      activity_id: result.meta.last_row_id,
      calendar_synced: Boolean(graphEventId),
      start: start.toISOString(),
      spoken: speakTime(start),
      message: `Booked for ${speakTime(start)}.`,
    };
  },
};

/**
 * Recognise a returning caller.
 *
 * A trades business does not treat a ten-year customer as a stranger, and this
 * is the tool that makes the agent sound like it works there. Tenant-scoped:
 * a client's agent can only ever read that client's own customer list.
 */
const lookupCustomer: ToolDef = {
  name: "lookup_customer",
  description:
    "Find an existing customer account by phone number, name, or site. Call this EARLY — ideally on the caller's phone number before they say anything — so you know who you are speaking to, which site they are at, and what service plan they hold.",
  scopes: TENANT,
  inputSchema: {
    type: "object",
    properties: {
      phone: { type: "string", description: "Caller's number. The best identifier if you have it." },
      name: { type: "string", description: "Person or company name." },
      site: { type: "string", description: "Site or location name." },
    },
  },
  async handler(args, ctx) {
    const clauses: string[] = [];
    const binds: unknown[] = [];
    if (args.phone) {
      // Match on the last 10 digits so formatting differences don't miss.
      const digits = String(args.phone).replace(/\D/g, "").slice(-10);
      clauses.push("replace(replace(replace(replace(phone,'+',''),'-',''),' ',''),'()','') LIKE ?");
      binds.push(`%${digits}`);
    }
    if (args.name) {
      clauses.push("name LIKE ?");
      binds.push(`%${String(args.name).trim()}%`);
    }
    if (args.site) {
      clauses.push("(site_name LIKE ? OR address LIKE ?)");
      binds.push(`%${String(args.site).trim()}%`, `%${String(args.site).trim()}%`);
    }
    if (!clauses.length) throw new Error("give at least a phone, name, or site");

    const { results } = await ctx.db
      .prepare(
        `SELECT id, name, phone, account_ref, site_name, address, service_plan,
                balance_cents, notes
           FROM customers
          WHERE ${clauses.join(" OR ")}
          LIMIT 5`
      )
      .bind(...binds)
      .all();

    return {
      found: results.length,
      customers: results,
      // The agent must not read a balance aloud, so say so at the point of use
      // rather than relying on the system prompt alone to remember.
      reminder:
        "Do not read balance_cents aloud. If they ask about a balance, take a message for accounts receivable.",
    };
  },
};

/**
 * "Where is my technician?" — the single most common call a trades business
 * gets, and the one an answering service can never handle.
 */
const getWorkOrders: ToolDef = {
  name: "get_work_orders",
  description:
    "Look up jobs for a customer, or one job by its reference (e.g. WO-4471). Use this whenever a caller asks about an existing job, a visit, a technician, or when someone is coming.",
  scopes: TENANT,
  inputSchema: {
    type: "object",
    properties: {
      customer_id: { type: "number", description: "From lookup_customer." },
      reference: { type: "string", description: "Job reference such as WO-4471." },
      status: {
        type: "string",
        description: "Filter: scheduled, dispatched, complete, cancelled. Omit for all.",
      },
    },
  },
  async handler(args, ctx) {
    const clauses: string[] = [];
    const binds: unknown[] = [];
    if (args.customer_id) {
      clauses.push("w.customer_id = ?");
      binds.push(args.customer_id);
    }
    if (args.reference) {
      clauses.push("w.reference LIKE ?");
      binds.push(`%${String(args.reference).trim()}%`);
    }
    if (args.status) {
      clauses.push("w.status = ?");
      binds.push(String(args.status));
    }
    if (!clauses.length) throw new Error("give a customer_id or a reference");

    const { results } = await ctx.db
      .prepare(
        `SELECT w.reference, w.summary, w.status, w.priority, w.technician,
                w.scheduled_for, w.completed_at, w.notes, c.name AS customer
           FROM work_orders w
           LEFT JOIN customers c ON c.id = w.customer_id
          WHERE ${clauses.join(" AND ")}
          ORDER BY w.scheduled_for DESC
          LIMIT 10`
      )
      .bind(...binds)
      .all();

    return {
      found: results.length,
      work_orders: results,
      reminder:
        "Internal notes are for your understanding, not for reading aloud. Never blame a named technician to a caller.",
    };
  },
};

// --- assistant-only ---------------------------------------------------------

const lookupLead: ToolDef = {
  name: "lookup_lead",
  description:
    "Search leads by name, company, email, or phone. Returns the closest matches with their pipeline status.",
  scopes: ASSISTANT_ONLY,
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Name, company, email, or phone fragment." },
      limit: { type: "number", description: "Defaults to 5, max 20." },
    },
    required: ["query"],
  },
  async handler(args, ctx) {
    const q = `%${String(args.query).trim()}%`;
    const limit = Math.min(Number(args.limit) || 5, 20);
    const { results } = await ctx.db.prepare(
      `SELECT id, name, company, email, phone, status, project_type, budget_range,
              deal_value_cents, source_origin, created_at
         FROM leads
        WHERE name LIKE ? OR company LIKE ? OR email LIKE ? OR phone LIKE ?
        ORDER BY updated_at DESC
        LIMIT ?`
    )
      .bind(q, q, q, q, limit)
      .all();
    return { count: results.length, leads: results };
  },
};

const listLeads: ToolDef = {
  name: "list_leads",
  description:
    "List leads in the pipeline, most recently updated first. Use for questions like 'what's in the pipeline' or 'who came in this week'.",
  scopes: ASSISTANT_ONLY,
  inputSchema: {
    type: "object",
    properties: {
      status: { type: "string", description: "Filter by pipeline stage, e.g. new, qualified, won." },
      since: { type: "string", description: "Only leads created on or after this YYYY-MM-DD." },
      limit: { type: "number", description: "Defaults to 10, max 50." },
    },
  },
  async handler(args, ctx) {
    const limit = Math.min(Number(args.limit) || 10, 50);
    const clauses: string[] = [];
    const binds: unknown[] = [];
    if (args.status) {
      clauses.push("status = ?");
      binds.push(String(args.status));
    }
    if (args.since) {
      clauses.push("created_at >= ?");
      binds.push(String(args.since));
    }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    binds.push(limit);
    const { results } = await ctx.db.prepare(
      `SELECT id, name, company, status, project_type, budget_range, deal_value_cents,
              source_origin, created_at
         FROM leads ${where}
        ORDER BY updated_at DESC
        LIMIT ?`
    )
      .bind(...binds)
      .all();
    return { count: results.length, leads: results };
  },
};

const listProjects: ToolDef = {
  name: "list_projects",
  description: "List client projects and their status.",
  scopes: ASSISTANT_ONLY,
  inputSchema: {
    type: "object",
    properties: {
      status: { type: "string", description: "Filter by status, e.g. scoping, active, complete." },
      limit: { type: "number", description: "Defaults to 20, max 50." },
    },
  },
  async handler(args, ctx) {
    const limit = Math.min(Number(args.limit) || 20, 50);
    const where = args.status ? "WHERE p.status = ?" : "";
    const binds: unknown[] = args.status ? [String(args.status)] : [];
    binds.push(limit);
    const { results } = await ctx.env.DB.prepare(
      `SELECT p.id, p.name, p.status, p.project_type, p.started_at, p.completed_at,
              c.company_name AS client
         FROM projects p
         JOIN clients c ON c.id = p.client_id
         ${where}
        ORDER BY p.updated_at DESC
        LIMIT ?`
    )
      .bind(...binds)
      .all();
    return { count: results.length, projects: results };
  },
};

const getInvoiceStatus: ToolDef = {
  name: "get_invoice_status",
  description:
    "Check invoice status, optionally for one client. Answers 'has X paid yet' and 'what's outstanding'.",
  scopes: ASSISTANT_ONLY,
  inputSchema: {
    type: "object",
    properties: {
      client: { type: "string", description: "Client company name fragment." },
      status: { type: "string", description: "Filter: draft, sent, paid, overdue." },
    },
  },
  async handler(args, ctx) {
    const clauses: string[] = [];
    const binds: unknown[] = [];
    if (args.client) {
      clauses.push("c.company_name LIKE ?");
      binds.push(`%${String(args.client).trim()}%`);
    }
    if (args.status) {
      clauses.push("i.status = ?");
      binds.push(String(args.status));
    }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const { results } = await ctx.env.DB.prepare(
      `SELECT i.id, i.amount_cents, i.status, i.description, i.due_date, i.paid_at,
              c.company_name AS client
         FROM invoices i
         JOIN clients c ON c.id = i.client_id
         ${where}
        ORDER BY i.created_at DESC
        LIMIT 25`
    )
      .bind(...binds)
      .all<{ amount_cents: number; status: string }>();
    const outstanding = results
      .filter((r) => r.status !== "paid")
      .reduce((sum, r) => sum + (r.amount_cents ?? 0), 0);
    return {
      count: results.length,
      outstanding_cents: outstanding,
      invoices: results,
    };
  },
};

const createTaskTool: ToolDef = {
  name: "create_task",
  description: "Add a task to the Ascend task list.",
  scopes: ASSISTANT_ONLY,
  inputSchema: {
    type: "object",
    properties: {
      title: { type: "string", description: "What needs doing." },
      description: { type: "string" },
      priority: { type: "string", description: "low, medium, or high. Defaults to medium." },
      lead_id: { type: "number" },
      client_id: { type: "number" },
    },
    required: ["title"],
  },
  async handler(args, ctx) {
    const id = await createTask(ctx.env.DB, {
      type: "voice_note",
      title: String(args.title),
      description: args.description ? String(args.description) : undefined,
      priority: args.priority ? String(args.priority) : "medium",
      lead_id: args.lead_id ?? null,
      client_id: args.client_id ?? null,
      metadata: { captured_by: `voice agent: ${ctx.agent.label}` },
    });
    return { task_id: id, message: "Task created." };
  },
};

const getSeoSummary: ToolDef = {
  name: "get_seo_summary",
  description:
    "Latest Search Console snapshot per tracked site — clicks, impressions, and average position.",
  scopes: ASSISTANT_ONLY,
  inputSchema: {
    type: "object",
    properties: {
      site: { type: "string", description: "Site key, e.g. ascend or recordstops. Omit for all." },
    },
  },
  async handler(args, ctx) {
    const where = args.site ? "WHERE s.key = ?" : "";
    const binds: unknown[] = args.site ? [String(args.site)] : [];
    const { results } = await ctx.env.DB.prepare(
      `SELECT s.key, s.label, m.captured_on, m.clicks, m.impressions, m.ctr, m.avg_position
         FROM seo_sites s
         JOIN seo_metrics m ON m.id = (
           SELECT id FROM seo_metrics WHERE site_id = s.id
            ORDER BY captured_on DESC, id DESC LIMIT 1
         )
         ${where}
        ORDER BY s.is_priority DESC, s.key`
    )
      .bind(...binds)
      .all();
    return { count: results.length, sites: results };
  },
};

export const TOOLS: ToolDef[] = [
  createLead,
  logCallActivity,
  checkAvailability,
  bookMeeting,
  lookupCustomer,
  getWorkOrders,
  lookupLead,
  listLeads,
  listProjects,
  getInvoiceStatus,
  createTaskTool,
  getSeoSummary,
];

export function toolsForScope(scope: ToolScope): ToolDef[] {
  return TOOLS.filter((t) => t.scopes.includes(scope));
}

export function findTool(name: string, scope: ToolScope): ToolDef | undefined {
  return TOOLS.find((t) => t.name === name && t.scopes.includes(scope));
}
