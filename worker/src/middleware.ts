import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import type { Bindings, SessionRow, Variables } from "./types";

export const SESSION_COOKIE = "ascend_session";

export async function loadSession(
  c: Context<{ Bindings: Bindings; Variables: Variables }>
): Promise<SessionRow | null> {
  const token = getCookie(c, SESSION_COOKIE);
  if (!token) return null;
  const row = await c.env.DB.prepare(
    `SELECT id, session_token, email, role, client_id, expires_at
     FROM sessions WHERE session_token = ? AND expires_at > datetime('now')`
  )
    .bind(token)
    .first<SessionRow>();
  return row ?? null;
}

export function requireAuth(role?: "admin" | "client") {
  return async (
    c: Context<{ Bindings: Bindings; Variables: Variables }>,
    next: Next
  ) => {
    const session = await loadSession(c);
    if (!session) return c.json({ error: "unauthorized" }, 401);
    if (role && session.role !== role) {
      return c.json({ error: "forbidden" }, 403);
    }
    c.set("session", session);
    await next();
  };
}

export function generateToken(bytes = 32): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
