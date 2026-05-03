import crypto from "node:crypto";

const STRIPE_API = "https://api.stripe.com/v1";

export async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const [timestamp, hash] = signature.split(",").map((part) => {
    const [key, value] = part.split("=");
    return value;
  });

  if (!timestamp || !hash) return false;

  const signedContent = `${timestamp}.${payload}`;
  const computed = crypto
    .createHmac("sha256", secret)
    .update(signedContent)
    .digest("hex");

  return computed === hash;
}

export async function findOrCreateCustomer(
  secretKey: string,
  email: string,
  name: string
): Promise<{ id: string }> {
  const listRes = await fetch(`${STRIPE_API}/customers?email=${email}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });
  const { data } = (await listRes.json()) as { data: Array<{ id: string }> };

  if (data.length > 0) {
    return { id: data[0].id };
  }

  const createRes = await fetch(`${STRIPE_API}/customers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      email,
      name,
    }),
  });

  const customer = (await createRes.json()) as { id: string };
  return customer;
}

export async function createInvoiceItem(
  secretKey: string,
  customerId: string,
  amountCents: number,
  description: string
): Promise<{ id: string }> {
  const res = await fetch(`${STRIPE_API}/invoiceitems`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      customer: customerId,
      amount: String(amountCents),
      currency: "usd",
      description,
    }),
  });

  const item = (await res.json()) as { id: string };
  return item;
}

export async function createStripeInvoice(
  secretKey: string,
  customerId: string,
  description?: string
): Promise<{ id: string }> {
  const body = new URLSearchParams({
    customer: customerId,
    currency: "usd",
    auto_advance: "false",
  });
  if (description) {
    body.append("description", description);
  }

  const res = await fetch(`${STRIPE_API}/invoices`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const invoice = (await res.json()) as { id: string };
  return invoice;
}

export async function sendStripeInvoice(
  secretKey: string,
  invoiceId: string
): Promise<{ hosted_invoice_url: string }> {
  const res = await fetch(`${STRIPE_API}/invoices/${invoiceId}/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  });

  const invoice = (await res.json()) as { hosted_invoice_url: string };
  return invoice;
}
