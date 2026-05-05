export type Bindings = {
  DB: D1Database;
  FILES_BUCKET: R2Bucket;
  SENDGRID_API_KEY?: string;
  APP_ORIGIN?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  ADMIN_EMAILS?: string;
  CF_API_TOKEN?: string;
};

export type SessionRow = {
  id: number;
  session_token: string;
  email: string;
  role: "admin" | "client";
  client_id: number | null;
  expires_at: string;
};

export type Variables = {
  session: SessionRow;
};
