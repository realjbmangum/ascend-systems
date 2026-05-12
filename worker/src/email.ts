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

type CalcReportArgs = {
  to: string;
  name: string;
  company?: string;
  inputs: {
    hours_per_week: number;
    hourly_cost: number;
    error_rate: number;
    customer_impact: "none" | "slows" | "loses";
    process_description?: string;
  };
  result: {
    base_waste: number;
    error_overhead: number;
    customer_cost: number;
    total_annual: number;
    total_monthly: number;
    build_band: "diy" | "light" | "custom" | "strategic";
    build_price_low: number;
    build_price_high: number;
    payback_months_low: number;
    payback_months_high: number;
    recommendation: string;
  };
};

const IMPACT_LABEL: Record<string, string> = {
  none: "Internal only — no customer impact",
  slows: "Slows responses to customers",
  loses: "Loses deals or causes complaints",
};

const BAND_LABEL: Record<string, string> = {
  diy: "DIY (no-code)",
  light: "Light automation",
  custom: "Custom build",
  strategic: "Strategic platform",
};

function fmtMoney(n: number): string {
  return "$" + Math.round(n).toLocaleString();
}

export async function sendCalculatorReport(
  apiKey: string,
  args: CalcReportArgs
): Promise<boolean> {
  const { name, company, inputs, result } = args;
  const firstName = name.split(" ")[0];
  const paybackText =
    result.payback_months_low > 0
      ? result.payback_months_low === result.payback_months_high
        ? `${result.payback_months_low} months`
        : `${result.payback_months_low}–${result.payback_months_high} months`
      : "—";

  // Email-safe font stack — system fonts only. Google Fonts inline-load is
  // unreliable in Gmail/Outlook. Using -apple-system + Segoe + Helvetica gets
  // 95%+ rendering accuracy without webfont risk.
  const FF = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const MONO = "'SF Mono',Menlo,Consolas,monospace";
  const LOGO_URL = "https://ascendsystems.ai/images/logo.png";
  const SITE_URL = "https://ascendsystems.ai";
  const CONTACT_URL = "https://ascendsystems.ai/contact";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your Manual Process Cost Report</title>
</head>
<body style="margin:0;padding:0;background:#EDF2F7;font-family:${FF};color:#1E2A32;">

<!-- Preheader (hidden, shows in inbox preview) -->
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#EDF2F7;opacity:0;">
  Your manual process is costing ${fmtMoney(result.total_annual)} a year. Here is the breakdown.
</div>

<!-- Outer wrapper for email-client centering -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#EDF2F7;padding:24px 0;">
  <tr><td align="center">

  <!-- Email body card -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="max-width:640px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(28,28,30,0.08);">

    <!-- LOGO HEADER (light bg, per brand kit) -->
    <tr><td align="center" style="padding:36px 32px 24px;background:#FFFFFF;">
      <a href="${SITE_URL}" style="text-decoration:none;display:inline-block;">
        <img src="${LOGO_URL}" alt="Ascend Systems" width="200" style="display:block;border:0;width:200px;max-width:200px;height:auto;outline:none;text-decoration:none;">
      </a>
    </td></tr>

    <!-- Orange accent strip -->
    <tr><td style="background:#D4632C;line-height:0;font-size:0;height:4px;">&nbsp;</td></tr>

    <!-- Eyebrow + greeting -->
    <tr><td style="padding:36px 40px 0;background:#FFFFFF;">
      <p style="margin:0 0 8px;font-family:${MONO};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#B85328;">Manual Process Audit</p>
      <h1 style="margin:0 0 20px;font-family:${FF};font-size:28px;line-height:1.2;font-weight:700;color:#1E2A32;letter-spacing:-0.5px;">Your Cost Report</h1>
      <p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#1E2A32;">Hi ${escapeHtml(firstName)},</p>
      <p style="margin:0 0 8px;font-size:16px;line-height:1.6;color:#374151;">Here is the breakdown for ${
        company ? `<strong style="color:#1E2A32;">${escapeHtml(company)}</strong>` : "your team"
      } based on what you entered. Numbers are estimates — the goal is order of magnitude, not decimal precision.</p>
    </td></tr>

    <!-- Big-number hero -->
    <tr><td style="padding:24px 40px;background:#FFFFFF;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#1E2A32;border-radius:10px;">
        <tr><td style="padding:32px;">
          <p style="margin:0 0 10px;font-family:${MONO};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#E07A4F;">Annual cost of the manual process</p>
          <p style="margin:0;font-family:${FF};font-size:48px;line-height:1;font-weight:700;color:#FFFFFF;letter-spacing:-1.5px;">${fmtMoney(result.total_annual)}</p>
          <p style="margin:12px 0 0;font-size:14px;line-height:1.5;color:#9CA3AF;">~${fmtMoney(result.total_monthly)} every month, before opportunity cost.</p>
        </td></tr>
      </table>
    </td></tr>

    <!-- Your inputs -->
    <tr><td style="padding:24px 40px 8px;background:#FFFFFF;">
      <p style="margin:0 0 14px;font-family:${MONO};font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6B7280;">Your inputs</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size:14px;">
        <tr><td style="padding:10px 0;color:#6B7280;width:60%;">Hours per week on this process</td><td style="padding:10px 0;color:#1E2A32;font-weight:600;text-align:right;">${inputs.hours_per_week} hrs</td></tr>
        <tr><td style="padding:10px 0;color:#6B7280;border-top:1px solid #E2E8F0;">Average fully-loaded hourly cost</td><td style="padding:10px 0;color:#1E2A32;font-weight:600;text-align:right;border-top:1px solid #E2E8F0;">${fmtMoney(inputs.hourly_cost)}/hr</td></tr>
        <tr><td style="padding:10px 0;color:#6B7280;border-top:1px solid #E2E8F0;">Error / rework rate</td><td style="padding:10px 0;color:#1E2A32;font-weight:600;text-align:right;border-top:1px solid #E2E8F0;">${inputs.error_rate}%</td></tr>
        <tr><td style="padding:10px 0;color:#6B7280;border-top:1px solid #E2E8F0;">Customer impact</td><td style="padding:10px 0;color:#1E2A32;font-weight:600;text-align:right;border-top:1px solid #E2E8F0;">${IMPACT_LABEL[inputs.customer_impact]}</td></tr>
      </table>
    </td></tr>

    <!-- Breakdown -->
    <tr><td style="padding:24px 40px 8px;background:#FFFFFF;">
      <p style="margin:0 0 14px;font-family:${MONO};font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6B7280;">How the number breaks down</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size:14px;">
        <tr><td style="padding:12px 0;color:#1E2A32;">Direct labor (hours × wage × 52 weeks)</td><td style="padding:12px 0;color:#1E2A32;font-weight:600;text-align:right;">${fmtMoney(result.base_waste)}</td></tr>
        <tr><td style="padding:12px 0;color:#1E2A32;border-top:1px solid #E2E8F0;">Error and rework overhead</td><td style="padding:12px 0;color:#1E2A32;font-weight:600;text-align:right;border-top:1px solid #E2E8F0;">${fmtMoney(result.error_overhead)}</td></tr>
        <tr><td style="padding:12px 0;color:#1E2A32;border-top:1px solid #E2E8F0;">Customer impact (slow responses, lost deals)</td><td style="padding:12px 0;color:#1E2A32;font-weight:600;text-align:right;border-top:1px solid #E2E8F0;">${fmtMoney(result.customer_cost)}</td></tr>
        <tr><td style="padding:14px 0;color:#1E2A32;font-weight:700;border-top:2px solid #1E2A32;">Total annual cost</td><td style="padding:14px 0;color:#1E2A32;font-weight:700;text-align:right;border-top:2px solid #1E2A32;font-size:16px;">${fmtMoney(result.total_annual)}</td></tr>
      </table>
    </td></tr>

    <!-- Recommendation card -->
    <tr><td style="padding:24px 40px 8px;background:#FFFFFF;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FEF5F0;border-left:4px solid #D4632C;border-radius:0 8px 8px 0;">
        <tr><td style="padding:22px 26px;">
          <p style="margin:0 0 10px;font-family:${MONO};font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#B85328;">Recommendation · ${BAND_LABEL[result.build_band]}</p>
          <p style="margin:0;font-size:15px;line-height:1.65;color:#1E2A32;">${escapeHtml(result.recommendation)}</p>
        </td></tr>
      </table>
    </td></tr>

    ${
      result.build_price_low > 0
        ? `
    <!-- Build investment -->
    <tr><td style="padding:24px 40px 8px;background:#FFFFFF;">
      <p style="margin:0 0 14px;font-family:${MONO};font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6B7280;">Typical investment for this kind of work</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size:14px;">
        <tr><td style="padding:10px 0;color:#6B7280;width:55%;">Build investment range</td><td style="padding:10px 0;color:#1E2A32;font-weight:600;text-align:right;">${fmtMoney(result.build_price_low)} – ${fmtMoney(result.build_price_high)}</td></tr>
        <tr><td style="padding:10px 0;color:#6B7280;border-top:1px solid #E2E8F0;">Expected payback</td><td style="padding:10px 0;color:#1E2A32;font-weight:600;text-align:right;border-top:1px solid #E2E8F0;">${paybackText}</td></tr>
      </table>
    </td></tr>
    `
        : ""
    }

    <!-- CTA -->
    <tr><td style="padding:32px 40px 40px;background:#FFFFFF;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#1E2A32;border-radius:10px;">
        <tr><td align="center" style="padding:36px 32px;">
          <h2 style="margin:0 0 10px;font-family:${FF};font-size:22px;line-height:1.3;font-weight:700;color:#FFFFFF;letter-spacing:-0.3px;">Want a free 30-minute audit?</h2>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#9CA3AF;max-width:420px;">I will look at your specific process with you, point out the highest-leverage fix, and give you a written next-step plan. No pitch.</p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td style="background:#D4632C;border-radius:6px;">
            <a href="${CONTACT_URL}" style="display:inline-block;padding:14px 32px;font-family:${FF};font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;letter-spacing:0.01em;">Book the audit &rarr;</a>
          </td></tr></table>
        </td></tr>
      </table>
    </td></tr>

    <!-- Sign-off -->
    <tr><td style="padding:0 40px 32px;background:#FFFFFF;">
      <p style="margin:0;font-size:14px;line-height:1.6;color:#6B7280;">Reply to this email any time — it lands in my inbox.</p>
      <p style="margin:6px 0 0;font-size:14px;line-height:1.6;color:#1E2A32;font-weight:600;">— Brian Mangum, Ascend Systems</p>
    </td></tr>

    <!-- Footer -->
    <tr><td style="padding:24px 32px;background:#1E2A32;text-align:center;">
      <p style="margin:0 0 6px;font-family:${MONO};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#9CA3AF;">Ascend Systems</p>
      <p style="margin:0 0 12px;font-size:12px;color:#6B7280;">Charlotte, NC · <a href="${SITE_URL}" style="color:#E07A4F;text-decoration:none;">ascendsystems.ai</a></p>
      <p style="margin:0;font-size:11px;color:#4B5563;">You received this report because you used the free Cost Calculator on ascendsystems.ai. We do not sell or share your email.</p>
    </td></tr>

  </table>

  </td></tr>
</table>

</body>
</html>
  `;

  return sendEmail(apiKey, {
    to: args.to,
    subject: `Your Manual Process Cost Report — ${fmtMoney(result.total_annual)}/yr`,
    html,
  });
}
