// Email via SendGrid API

import type { Bindings } from "./types";

const FROM_EMAIL = "noreply@ascendsystems.ai";
const FROM_NAME = "Ascend Systems";
const ADMIN_EMAIL = "bmangum1@gmail.com";

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

async function sendEmail(
  apiKey: string,
  { to, subject, html, text }: SendArgs
): Promise<boolean> {
  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: FROM_EMAIL, name: FROM_NAME },
        subject,
        content: [
          { type: "text/plain", value: text ?? stripHtml(html) },
          { type: "text/html", value: html },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`[EMAIL] SendGrid error (${response.status}):`, err);
      return false;
    }

    console.log(`[EMAIL] Sent to ${to}`);
    return true;
  } catch (err) {
    console.error(`[EMAIL] Exception:`, err);
    return false;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export async function sendMagicLink(
  apiKey: string,
  email: string,
  token: string,
  role: "admin" | "client",
  appOrigin: string
): Promise<boolean> {
  const path = role === "admin" ? "/admin" : "/portal";
  const link = `${appOrigin}${path}/auth/verify?token=${encodeURIComponent(token)}`;
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:0;color:#1C1C1E;background:#ffffff">
      <div style="background:#1C1C1E;padding:24px 32px">
        <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.5px">Ascend Systems</span>
      </div>
      <div style="padding:40px 32px;border-top:4px solid #C45A2C">
        <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;color:#1C1C1E">Your sign-in link</h1>
        <p style="font-size:15px;line-height:1.6;color:#444;margin:0 0 32px">
          Click the button below to sign in to your ${role === "admin" ? "Ascend Systems dashboard" : "client portal"}.
          This link expires in 15 minutes and can only be used once.
        </p>
        <p style="margin:0 0 32px">
          <a href="${link}"
             style="display:inline-block;background:#C45A2C;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px">
            Sign in
          </a>
        </p>
        <p style="font-size:13px;color:#888;margin:0">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
      <div style="padding:16px 32px;background:#f9f9f9;border-top:1px solid #eee">
        <p style="font-size:12px;color:#aaa;margin:0">
          Or copy this link into your browser:<br>
          <a href="${link}" style="color:#C45A2C;word-break:break-all">${link}</a>
        </p>
      </div>
    </div>
  `;
  return sendEmail(apiKey, { to: email, subject: "Your Ascend Systems sign-in link", html });
}

export async function sendSequenceStep(
  apiKey: string,
  to: string,
  subject: string,
  bodyHtml: string
): Promise<boolean> {
  return sendEmail(apiKey, { to, subject, html: bodyHtml });
}

export async function sendFormConfirmation(
  apiKey: string,
  to: string,
  formType: "contact" | "intake",
  submitterName: string
): Promise<boolean> {
  const heading =
    formType === "intake"
      ? "We got your project intake"
      : "We got your message";
  const body =
    formType === "intake"
      ? "Thanks for sharing the details of your project. We'll review your intake and get back to you within 24 hours with next steps."
      : "Thanks for reaching out. We'll review your message and respond within 24 hours.";
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:0;color:#1C1C1E;background:#ffffff">
      <div style="background:#1C1C1E;padding:24px 32px">
        <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.5px">Ascend Systems</span>
      </div>
      <div style="padding:40px 32px;border-top:4px solid #C45A2C">
        <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;color:#1C1C1E">${heading}</h1>
        <p style="font-size:15px;line-height:1.6;color:#1C1C1E;margin:0 0 16px">
          Hi ${escapeHtml(submitterName)},
        </p>
        <p style="font-size:15px;line-height:1.6;color:#1C1C1E;margin:0 0 16px">
          ${body}
        </p>
        <p style="font-size:15px;line-height:1.6;color:#1C1C1E;margin:0 0 24px">
          In the meantime, if anything urgent comes up, just reply to this email.
        </p>
        <p style="font-size:15px;line-height:1.6;margin:0;color:#1C1C1E">
          — Ascend Systems
        </p>
      </div>
    </div>
  `;
  return sendEmail(apiKey, {
    to,
    subject:
      formType === "intake"
        ? "We got your project intake — Ascend Systems"
        : "We got your message — Ascend Systems",
    html,
  });
}

export async function sendAdminAlert(
  apiKey: string,
  formData: Record<string, string | null | undefined>,
  formType: "contact" | "intake",
  leadId: number
): Promise<boolean> {
  const rows = Object.entries(formData)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(
      ([k, v]) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;color:#1C1C1E;vertical-align:top;width:140px">${escapeHtml(k)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#1C1C1E;white-space:pre-wrap">${escapeHtml(String(v))}</td>
        </tr>`
    )
    .join("");
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:640px;margin:0 auto;padding:0;color:#1C1C1E;background:#ffffff">
      <div style="background:#1C1C1E;padding:24px 32px">
        <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.5px">Ascend Systems</span>
      </div>
      <div style="padding:32px;border-top:4px solid #C45A2C">
        <h1 style="font-size:20px;font-weight:700;margin:0 0 8px;color:#1C1C1E">New ${formType === "intake" ? "intake" : "contact"} submission</h1>
        <p style="font-size:13px;color:#666;margin:0 0 16px">Lead ID: #${leadId}</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${rows}
        </table>
      </div>
    </div>
  `;
  return sendEmail(apiKey, {
    to: ADMIN_EMAIL,
    subject: `New ${formType} submission: ${formData.name ?? "unknown"} (#${leadId})`,
    html,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
