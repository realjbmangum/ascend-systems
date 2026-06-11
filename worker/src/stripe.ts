const STRIPE_API = "https://api.stripe.com/v1";

export async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  let timestamp: string | undefined;
  let hash: string | undefined;
  for (const part of signature.split(",")) {
    const [k, v] = part.split("=");
    if (k === "t") timestamp = v;
    if (k === "v1") hash = v;
  }

  if (!timestamp || !hash) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${payload}`)
  );
  const computed = Array.from(new Uint8Array(sigBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

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

export async function createSubscription(
  secretKey: string,
  customerId: string,
  amountCents: number,
  interval: "month" | "year" | "week",
  description: string
): Promise<{
  id?: string;
  status?: string;
  latest_invoice?: { hosted_invoice_url?: string };
  error?: { message?: string };
}> {
  // Subscription price_data requires an EXISTING product id (inline
  // product_data is only valid for Checkout/invoice items, not subscriptions),
  // so create the product first and reference it.
  const productRes = await fetch(`${STRIPE_API}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ name: description }),
  });
  const product = (await productRes.json()) as {
    id?: string;
    error?: { message?: string };
  };
  if (!product?.id) return product; // bubble the Stripe error up to the caller

  // Bill by emailed invoice each period (net 15), matching the engagement's
  // "invoiced monthly in advance, net 15" — no saved card required; the client
  // pays via the hosted invoice link Stripe emails them.
  const res = await fetch(`${STRIPE_API}/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      customer: customerId,
      "items[0][price_data][currency]": "usd",
      "items[0][price_data][product]": product.id,
      "items[0][price_data][unit_amount]": String(amountCents),
      "items[0][price_data][recurring][interval]": interval,
      collection_method: "send_invoice",
      days_until_due: "15",
      expand: "latest_invoice",
    }),
  });
  return res.json() as Promise<any>;
}

export async function cancelSubscription(
  secretKey: string,
  subscriptionId: string
): Promise<{ id: string; status: string }> {
  const res = await fetch(`${STRIPE_API}/subscriptions/${subscriptionId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${secretKey}` },
  });
  return res.json() as Promise<any>;
}
