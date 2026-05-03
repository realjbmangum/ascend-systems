// Email via MailChannels API from Cloudflare Workers
// Requires SPF/DKIM DNS records on the sending domain

const FROM_EMAIL = "noreply@mail.ascendsystems.ai";
const FROM_NAME = "Ascend Systems";
const MAILCHANNELS_API = "https://api.mailchannels.net/tx/v1/send";

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

async function sendEmail({ to, subject, html, text }: SendArgs): Promise<boolean> {
  try {
    const res = await fetch(MAILCHANNELS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    if (!res.ok) {
      const error = await res.text();
      console.error(`[EMAIL] MailChannels error (${res.status}): ${error}`);
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
  email: string,
  token: string,
  role: "admin" | "client",
  appOrigin: string
): Promise<boolean> {
  const path = role === "admin" ? "/admin" : "/portal";
  const link = `${appOrigin}${path}/auth/verify?token=${encodeURIComponent(token)}`;
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a">
      <h1 style="font-size:20px;margin:0 0 12px">Sign in to Ascend Systems</h1>
      <p style="font-size:15px;line-height:1.55;color:#334155">
        Click the link below to sign in. It expires in 15 minutes.
      </p>
      <p style="margin:24px 0">
        <a href="${link}"
           style="background:#0f172a;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">
          Sign in
        </a>
      </p>
      <p style="font-size:13px;color:#64748b">
        Or paste this URL into your browser:<br>
        <a href="${link}">${link}</a>
      </p>
    </div>
  `;
  return sendEmail({ to: email, subject: "Your Ascend Systems sign-in link", html });
}

export async function sendSequenceStep(
  to: string,
  subject: string,
  bodyHtml: string
): Promise<boolean> {
  return sendEmail({ to, subject, html: bodyHtml });
}

const ADMIN_EMAIL = "bmangum1@gmail.com";

export async function sendFormConfirmation(
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
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1C1C1E">
      <div style="border-top:4px solid #C45A2C;padding-top:20px">
        <h1 style="font-size:22px;margin:0 0 16px;color:#1C1C1E">${heading}</h1>
        <p style="font-size:15px;line-height:1.6;color:#1C1C1E">
          Hi ${escapeHtml(submitterName)},
        </p>
        <p style="font-size:15px;line-height:1.6;color:#1C1C1E">
          ${body}
        </p>
        <p style="font-size:15px;line-height:1.6;color:#1C1C1E">
          In the meantime, if anything urgent comes up, just reply to this email.
        </p>
        <p style="font-size:15px;line-height:1.6;margin-top:24px;color:#1C1C1E">
          — Ascend Systems
        </p>
      </div>
    </div>
  `;
  return sendEmail({
    to,
    subject:
      formType === "intake"
        ? "We got your project intake — Ascend Systems"
        : "We got your message — Ascend Systems",
    html,
  });
}

export async function sendAdminAlert(
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
    <div style="font-family:system-ui,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#1C1C1E">
      <div style="border-top:4px solid #C45A2C;padding-top:20px">
        <h1 style="font-size:20px;margin:0 0 8px">New ${formType === "intake" ? "intake" : "contact"} submission</h1>
        <p style="font-size:13px;color:#666;margin:0 0 16px">Lead ID: #${leadId}</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${rows}
        </table>
      </div>
    </div>
  `;
  return sendEmail({
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
