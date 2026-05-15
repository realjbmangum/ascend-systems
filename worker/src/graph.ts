import type { Bindings } from "./types";

// Microsoft Graph calendar sync for lead activities.
// Dormant until all four MS_GRAPH_* env vars are set — see types.ts.
// Uses the client-credentials (app-only) OAuth flow, so it requires the
// Calendars.ReadWrite *application* permission with admin consent granted
// in Azure AD. All sync calls are best-effort: a failure logs and returns
// null rather than blocking the activity CRUD operation.

export type ActivityForSync = {
  type: string;
  subject: string;
  notes?: string | null;
  due_at?: string | null;
  duration_minutes?: number | null;
};

export function graphConfigured(env: Bindings): boolean {
  return Boolean(
    env.MS_GRAPH_TENANT_ID &&
      env.MS_GRAPH_CLIENT_ID &&
      env.MS_GRAPH_CLIENT_SECRET &&
      env.MS_GRAPH_CALENDAR_USER
  );
}

// Module-level token cache — persists across requests within an isolate.
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getToken(env: Bindings): Promise<string | null> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }
  const res = await fetch(
    `https://login.microsoftonline.com/${env.MS_GRAPH_TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.MS_GRAPH_CLIENT_ID!,
        client_secret: env.MS_GRAPH_CLIENT_SECRET!,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
    }
  );
  if (!res.ok) {
    // Don't log the response body — Microsoft error payloads can echo
    // request credentials.
    console.error("Graph token request failed", res.status);
    return null;
  }
  const data = await res.json<{ access_token?: string; expires_in?: number }>();
  if (!data.access_token) return null;
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return data.access_token;
}

function eventBody(activity: ActivityForSync) {
  const start = new Date(activity.due_at!);
  const end = new Date(
    start.getTime() + (activity.duration_minutes ?? 30) * 60_000
  );
  return {
    subject: `[Lead] ${activity.subject}`,
    body: { contentType: "text", content: activity.notes ?? "" },
    start: { dateTime: start.toISOString(), timeZone: "UTC" },
    end: { dateTime: end.toISOString(), timeZone: "UTC" },
    categories: [`Ascend CRM`, activity.type],
  };
}

function eventsUrl(env: Bindings, eventId?: string): string {
  const base = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(
    env.MS_GRAPH_CALENDAR_USER!
  )}/events`;
  return eventId ? `${base}/${encodeURIComponent(eventId)}` : base;
}

/** Create a calendar event. Returns the Graph event id, or null on failure. */
export async function createCalendarEvent(
  env: Bindings,
  activity: ActivityForSync
): Promise<string | null> {
  if (!graphConfigured(env) || !activity.due_at) return null;
  try {
    const token = await getToken(env);
    if (!token) return null;
    const res = await fetch(eventsUrl(env), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventBody(activity)),
    });
    if (!res.ok) {
      console.error("Graph create event failed", res.status, await res.text());
      return null;
    }
    const data = await res.json<{ id?: string }>();
    return data.id ?? null;
  } catch (err) {
    console.error("Graph create event error", err);
    return null;
  }
}

/** Update an existing calendar event. Returns true on success. */
export async function updateCalendarEvent(
  env: Bindings,
  eventId: string,
  activity: ActivityForSync
): Promise<boolean> {
  if (!graphConfigured(env) || !activity.due_at) return false;
  try {
    const token = await getToken(env);
    if (!token) return false;
    const res = await fetch(eventsUrl(env, eventId), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventBody(activity)),
    });
    if (!res.ok) {
      console.error("Graph update event failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Graph update event error", err);
    return false;
  }
}

/** Delete a calendar event. Best-effort. */
export async function deleteCalendarEvent(
  env: Bindings,
  eventId: string
): Promise<void> {
  if (!graphConfigured(env)) return;
  try {
    const token = await getToken(env);
    if (!token) return;
    const res = await fetch(eventsUrl(env, eventId), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok && res.status !== 404) {
      console.error("Graph delete event failed", res.status, await res.text());
    }
  } catch (err) {
    console.error("Graph delete event error", err);
  }
}
