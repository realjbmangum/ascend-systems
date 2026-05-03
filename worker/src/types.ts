export type MailChannelsSend = {
  send(message: {
    personalizations: Array<{ to: Array<{ email: string }> }>;
    from: { email: string; name?: string };
    subject: string;
    content: Array<{ type: string; value: string }>;
  }): Promise<{ success: boolean }>;
};

export type Bindings = {
  DB: D1Database;
  MAILCHANNELS: MailChannelsSend;
  APP_ORIGIN?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  ADMIN_EMAILS?: string;
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
