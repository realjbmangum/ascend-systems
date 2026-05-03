// Email helper using MailChannels (Cloudflare's free email API for Workers).
// Requires SPF/DKIM DNS records on FROM_DOMAIN.

const FROM_EMAIL = "noreply@ascendsystems.ai";
const FROM_NAME = "Ascend Systems";

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

async function sendEmail({ to, subject, html, text }: SendArgs): Promise<boolean> {
  const res = await fetch("https://api.mailchannels.net/tx/v1/send", {
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
    const body = await res.text();
    console.error("MailChannels send failed", res.status, body);
    return false;
  }
  return true;
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
