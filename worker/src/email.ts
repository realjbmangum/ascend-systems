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

  const html = `
    <div style="font-family:'Inter',-apple-system,BlinkMacSystemFont,system-ui,sans-serif;max-width:640px;margin:0 auto;padding:0;color:#1C1C1E;background:#FAFAF8">
      <div style="background:#1C1C1E;padding:28px 32px">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#D4703F;margin-bottom:6px">Ascend Systems · Manual Process Audit</div>
        <div style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px">Your Cost Report</div>
      </div>

      <div style="padding:36px 32px 12px;background:#ffffff;border-top:4px solid #C45A2C">
        <p style="font-size:16px;line-height:1.6;margin:0 0 16px;color:#1C1C1E">Hi ${escapeHtml(firstName)},</p>
        <p style="font-size:16px;line-height:1.6;margin:0 0 16px;color:#1C1C1E">Here is the breakdown for ${
          company ? `<strong>${escapeHtml(company)}</strong>` : "your team"
        } based on what you entered. Numbers are estimates — the goal is order of magnitude, not decimal precision.</p>
      </div>

      <div style="padding:0 32px;background:#ffffff">
        <div style="background:#1C1C1E;color:#ffffff;padding:28px 28px;border-radius:8px;margin:16px 0 28px">
          <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#D4703F;margin-bottom:8px">Annual cost of the manual process</div>
          <div style="font-size:42px;font-weight:700;letter-spacing:-1px;line-height:1.1;color:#ffffff">${fmtMoney(result.total_annual)}</div>
          <div style="font-size:14px;color:#9CA3AF;margin-top:8px">~${fmtMoney(result.total_monthly)} every month, before you account for opportunity cost.</div>
        </div>
      </div>

      <div style="padding:0 32px 8px;background:#ffffff">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6B7280;margin-bottom:10px">Your inputs</div>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
          <tr><td style="padding:8px 0;color:#6B7280;width:55%">Hours per week on this process</td><td style="padding:8px 0;color:#1C1C1E;font-weight:600;text-align:right">${inputs.hours_per_week} hrs</td></tr>
          <tr><td style="padding:8px 0;color:#6B7280;border-top:1px solid #E5E5E3">Average fully-loaded hourly cost</td><td style="padding:8px 0;color:#1C1C1E;font-weight:600;text-align:right;border-top:1px solid #E5E5E3">${fmtMoney(inputs.hourly_cost)}/hr</td></tr>
          <tr><td style="padding:8px 0;color:#6B7280;border-top:1px solid #E5E5E3">Error / rework rate</td><td style="padding:8px 0;color:#1C1C1E;font-weight:600;text-align:right;border-top:1px solid #E5E5E3">${inputs.error_rate}%</td></tr>
          <tr><td style="padding:8px 0;color:#6B7280;border-top:1px solid #E5E5E3">Customer impact</td><td style="padding:8px 0;color:#1C1C1E;font-weight:600;text-align:right;border-top:1px solid #E5E5E3">${IMPACT_LABEL[inputs.customer_impact]}</td></tr>
        </table>

        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6B7280;margin-bottom:10px">How the number breaks down</div>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:28px">
          <tr><td style="padding:10px 0;color:#1C1C1E">Direct labor (hours × wage × 52 weeks)</td><td style="padding:10px 0;color:#1C1C1E;font-weight:600;text-align:right">${fmtMoney(result.base_waste)}</td></tr>
          <tr><td style="padding:10px 0;color:#1C1C1E;border-top:1px solid #E5E5E3">Error and rework overhead</td><td style="padding:10px 0;color:#1C1C1E;font-weight:600;text-align:right;border-top:1px solid #E5E5E3">${fmtMoney(result.error_overhead)}</td></tr>
          <tr><td style="padding:10px 0;color:#1C1C1E;border-top:1px solid #E5E5E3">Customer-impact multiplier (slow responses, lost deals)</td><td style="padding:10px 0;color:#1C1C1E;font-weight:600;text-align:right;border-top:1px solid #E5E5E3">${fmtMoney(result.customer_cost)}</td></tr>
          <tr><td style="padding:12px 0;color:#1C1C1E;font-weight:700;border-top:2px solid #1C1C1E">Total annual cost</td><td style="padding:12px 0;color:#1C1C1E;font-weight:700;text-align:right;border-top:2px solid #1C1C1E">${fmtMoney(result.total_annual)}</td></tr>
        </table>
      </div>

      <div style="padding:0 32px 8px;background:#ffffff">
        <div style="background:#FDF3ED;border-left:3px solid #C45A2C;padding:20px 24px;border-radius:0 4px 4px 0;margin-bottom:24px">
          <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#A84820;margin-bottom:8px">Recommendation: ${BAND_LABEL[result.build_band]}</div>
          <div style="font-size:15px;line-height:1.6;color:#1C1C1E">${escapeHtml(result.recommendation)}</div>
        </div>

        ${
          result.build_price_low > 0
            ? `
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:28px">
          <tr><td style="padding:10px 0;color:#6B7280;width:55%">Typical build investment</td><td style="padding:10px 0;color:#1C1C1E;font-weight:600;text-align:right">${fmtMoney(result.build_price_low)} – ${fmtMoney(result.build_price_high)}</td></tr>
          <tr><td style="padding:10px 0;color:#6B7280;border-top:1px solid #E5E5E3">Expected payback</td><td style="padding:10px 0;color:#1C1C1E;font-weight:600;text-align:right;border-top:1px solid #E5E5E3">${paybackText}</td></tr>
        </table>
        `
            : ""
        }
      </div>

      <div style="padding:0 32px 32px;background:#ffffff">
        <div style="background:#1C1C1E;color:#ffffff;padding:24px 24px;border-radius:8px;text-align:center">
          <div style="font-size:18px;font-weight:700;color:#ffffff;margin-bottom:8px">Want a free 30-minute audit?</div>
          <div style="font-size:14px;color:#9CA3AF;margin-bottom:20px;line-height:1.5">I will look at your specific process with you, point out the highest-leverage fix, and give you a written next-step plan. No pitch.</div>
          <a href="https://ascendsystems.ai/contact" style="display:inline-block;background:#C45A2C;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 28px;border-radius:6px;font-size:14px">Book the audit →</a>
        </div>
      </div>

      <div style="padding:24px 32px;background:#FAFAF8;border-top:1px solid #E5E5E3;font-size:12px;color:#6B7280;text-align:center;font-family:'JetBrains Mono',monospace">
        Ascend Systems · Charlotte, NC · ascendsystems.ai
      </div>
    </div>
  `;

  return sendEmail(apiKey, {
    to: args.to,
    subject: `Your Manual Process Cost Report — ${fmtMoney(result.total_annual)}/yr`,
    html,
  });
}
