import { Hono } from "hono";
import type { Bindings, Variables } from "../types";
import { createTask } from "./tasks";
import { enrollByTrigger } from "./email-sequences";
import { sendCalculatorReport, sendAdminAlert } from "../email";

const tools = new Hono<{ Bindings: Bindings; Variables: Variables }>();

type CalcInput = {
  name?: string;
  email?: string;
  company?: string;
  hours_per_week?: number;
  hourly_cost?: number;
  error_rate?: number;
  customer_impact?: "none" | "slows" | "loses";
  process_description?: string;
};

const IMPACT_MULTIPLIER: Record<string, number> = {
  none: 1.0,
  slows: 1.3,
  loses: 1.8,
};

export type CalcResult = {
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

export function computeCostResult(input: {
  hours_per_week: number;
  hourly_cost: number;
  error_rate: number;
  customer_impact: "none" | "slows" | "loses";
}): CalcResult {
  const base = input.hours_per_week * 52 * input.hourly_cost;
  const error_overhead = base * (input.error_rate / 100);
  const multiplier = IMPACT_MULTIPLIER[input.customer_impact] ?? 1.0;
  const customer_cost = (base + error_overhead) * (multiplier - 1);
  const total = base + error_overhead + customer_cost;

  let band: CalcResult["build_band"];
  let lo: number, hi: number, rec: string;
  if (total < 10000) {
    band = "diy";
    lo = 0;
    hi = 2000;
    rec =
      "At this scale, a custom build is overkill. Solve it with Zapier or a no-code tool. Save the consulting dollars for a bigger lever in your business.";
  } else if (total < 50000) {
    band = "light";
    lo = 5000;
    hi = 15000;
    rec =
      "This is a real cost. A light automation build — a few connected tools, a small internal app, or an AI workflow — pays back fast and removes the daily friction.";
  } else if (total < 150000) {
    band = "custom";
    lo = 15000;
    hi = 40000;
    rec =
      "You are losing the equivalent of a full salary. A custom build (a focused internal app, a real CRM, or a connected ops platform) is the right move. Discovery sprint first, then a fixed-scope build.";
  } else {
    band = "strategic";
    lo = 40000;
    hi = 100000;
    rec =
      "This is a strategic problem, not an automation problem. A full custom platform or CRM is justified. A fractional CTO engagement plus a phased build is the right shape — we sequence the highest-leverage piece first and ship in 90 days.";
  }
  const paybackLow = lo > 0 ? Math.max(1, Math.round((lo / total) * 12)) : 0;
  const paybackHigh = hi > 0 ? Math.max(1, Math.round((hi / total) * 12)) : 0;

  return {
    base_waste: Math.round(base),
    error_overhead: Math.round(error_overhead),
    customer_cost: Math.round(customer_cost),
    total_annual: Math.round(total),
    total_monthly: Math.round(total / 12),
    build_band: band,
    build_price_low: lo,
    build_price_high: hi,
    payback_months_low: paybackLow,
    payback_months_high: paybackHigh,
    recommendation: rec,
  };
}

tools.post("/cost-calculator", async (c) => {
  const body = await c.req.json<CalcInput>();

  const errors: string[] = [];
  if (!body.name) errors.push("name");
  if (!body.email) errors.push("email");
  if (typeof body.hours_per_week !== "number" || body.hours_per_week <= 0)
    errors.push("hours_per_week");
  if (typeof body.hourly_cost !== "number" || body.hourly_cost <= 0)
    errors.push("hourly_cost");
  if (typeof body.error_rate !== "number" || body.error_rate < 0 || body.error_rate > 100)
    errors.push("error_rate");
  if (!body.customer_impact || !(body.customer_impact in IMPACT_MULTIPLIER))
    errors.push("customer_impact");
  if (errors.length) {
    return c.json({ error: "invalid input", fields: errors }, 400);
  }

  const result = computeCostResult({
    hours_per_week: body.hours_per_week!,
    hourly_cost: body.hourly_cost!,
    error_rate: body.error_rate!,
    customer_impact: body.customer_impact!,
  });

  const summaryLine = `~$${result.total_annual.toLocaleString()}/yr (${body.hours_per_week} hrs/wk, $${body.hourly_cost}/hr, ${body.error_rate}% error, impact=${body.customer_impact})`;

  const insert = await c.env.DB.prepare(
    `INSERT INTO leads (name, email, company, project_type, budget_range, message, status)
     VALUES (?, ?, ?, ?, ?, ?, 'new')`
  )
    .bind(
      body.name!,
      body.email!.toLowerCase().trim(),
      body.company ?? null,
      "automation_audit",
      `$${result.build_price_low.toLocaleString()}–$${result.build_price_high.toLocaleString()}`,
      `Cost Calculator: ${summaryLine}${body.process_description ? `\n\nProcess: ${body.process_description}` : ""}`
    )
    .run();
  const leadId = insert.meta.last_row_id as number;

  await createTask(c.env.DB, {
    type: "lead_inquiry",
    title: `Calculator lead: ${body.name}${body.company ? ` (${body.company})` : ""} — ${result.build_band}`,
    description: `${summaryLine}\n\nProcess: ${body.process_description ?? "(not provided)"}\n\nRecommendation: ${result.recommendation}`,
    lead_id: leadId,
    priority: result.build_band === "custom" || result.build_band === "strategic" ? "high" : "medium",
    metadata: {
      email: body.email,
      tool: "cost_calculator",
      total_annual: result.total_annual,
      build_band: result.build_band,
      hours_per_week: body.hours_per_week,
      hourly_cost: body.hourly_cost,
      error_rate: body.error_rate,
      customer_impact: body.customer_impact,
    },
  });

  await enrollByTrigger(c.env.DB, "calculator_followup", body.email!.toLowerCase().trim()).catch(
    () => undefined
  );

  if (c.env.SENDGRID_API_KEY) {
    c.executionCtx.waitUntil(
      Promise.all([
        sendCalculatorReport(c.env.SENDGRID_API_KEY, {
          to: body.email!,
          name: body.name!,
          company: body.company,
          inputs: {
            hours_per_week: body.hours_per_week!,
            hourly_cost: body.hourly_cost!,
            error_rate: body.error_rate!,
            customer_impact: body.customer_impact!,
            process_description: body.process_description,
          },
          result,
        }),
        sendAdminAlert(
          c.env.SENDGRID_API_KEY,
          {
            name: body.name!,
            email: body.email!,
            company: body.company,
            project_type: "Cost Calculator submission",
            budget_range: `$${result.build_price_low.toLocaleString()}–$${result.build_price_high.toLocaleString()} (${result.build_band})`,
            message: `Annual waste: $${result.total_annual.toLocaleString()}\n${summaryLine}\n\nProcess: ${body.process_description ?? "(not provided)"}`,
          },
          "contact",
          leadId
        ),
      ]).then(() => undefined)
    );
  }

  return c.json({ success: true, id: leadId, result });
});

export default tools;
