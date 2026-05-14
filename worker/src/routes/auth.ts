import { Hono } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import type { Bindings, Variables } from "../types";
import { generateToken, loadSession, SESSION_COOKIE } from "../middleware";
import { sendMagicLink } from "../email";

const auth = new Hono<{ Bindings: Bindings; Variables: Variables }>();

const MAGIC_LINK_TTL_MIN = 15;
const SESSION_TTL_DAYS = 30;

auth.post("/magic-link", async (c) => {
  const { email } = await c.req.json<{ email?: string }>();
  if (!email) return c.json({ error: "email required" }, 400);

  const normalized = email.trim().toLowerCase();

  // Determine role: admin if in ADMIN_EMAILS, client if matches a client record.
  const adminEmails = (c.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  let role: "admin" | "client" = "client";
  if (adminEmails.includes(normalized)) {
    role = "admin";
  } else {
    const client = await c.env.DB.prepare(
      "SELECT id FROM clients WHERE lower(email) = ?"
    )
      .bind(normalized)
      .first();
    if (!client) {
      // Don't reveal whether the email exists — return success either way.
      return c.json({ success: true });
    }
  }

  const token = generateToken(32);
  await c.env.DB.prepare(
    `INSERT INTO magic_links (email, token, role, expires_at)
     VALUES (?, ?, ?, datetime('now', '+${MAGIC_LINK_TTL_MIN} minutes'))`
  )
    .bind(normalized, token, role)
    .run();

  // Admin + portal moved to subdomains after the Astro migration so the
  // public marketing site doesn't ship the SPA shell. Magic-link URLs
  // must point at the role's origin, not the public site origin.
  const defaultOrigin = c.env.APP_ORIGIN ?? new URL(c.req.url).origin;
  const adminOrigin = c.env.ADMIN_ORIGIN ?? defaultOrigin;
  const portalOrigin = c.env.PORTAL_ORIGIN ?? defaultOrigin;
  const origin = role === "admin" ? adminOrigin : portalOrigin;
  if (!c.env.SENDGRID_API_KEY) {
    console.error("[AUTH] SENDGRID_API_KEY not configured");
    return c.json({ error: "email service not configured" }, 500);
  }
  await sendMagicLink(c.env.SENDGRID_API_KEY, normalized, token, role, origin);

  return c.json({ success: true });
});

auth.get("/verify/:token", async (c) => {
  const token = c.req.param("token");
  const link = await c.env.DB.prepare(
    `SELECT * FROM magic_links
     WHERE token = ? AND used_at IS NULL AND expires_at > datetime('now')`
  )
    .bind(token)
    .first<{
      id: number;
      email: string;
      role: "admin" | "client";
    }>();

  if (!link) return c.json({ error: "invalid or expired token" }, 400);

  await c.env.DB.prepare(
    "UPDATE magic_links SET used_at = datetime('now') WHERE id = ?"
  )
    .bind(link.id)
    .run();

  let clientId: number | null = null;
  if (link.role === "client") {
    const client = await c.env.DB.prepare(
      "SELECT id FROM clients WHERE lower(email) = ?"
    )
      .bind(link.email)
      .first<{ id: number }>();
    clientId = client?.id ?? null;
  }

  const sessionToken = generateToken(48);
  await c.env.DB.prepare(
    `INSERT INTO sessions (session_token, email, role, client_id, expires_at)
     VALUES (?, ?, ?, ?, datetime('now', '+${SESSION_TTL_DAYS} days'))`
  )
    .bind(sessionToken, link.email, link.role, clientId)
    .run();

  setCookie(c, SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });

  return c.json({
    success: true,
    role: link.role,
    email: link.email,
    client_id: clientId,
  });
});

auth.post("/logout", async (c) => {
  const session = await loadSession(c);
  if (session) {
    await c.env.DB.prepare("DELETE FROM sessions WHERE id = ?")
      .bind(session.id)
      .run();
  }
  deleteCookie(c, SESSION_COOKIE, { path: "/" });
  return c.json({ success: true });
});

auth.get("/me", async (c) => {
  const session = await loadSession(c);
  if (!session) return c.json({ authenticated: false });
  return c.json({
    authenticated: true,
    email: session.email,
    role: session.role,
    client_id: session.client_id,
  });
});

export default auth;
