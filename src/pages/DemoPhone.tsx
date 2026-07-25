/**
 * Live demo board for the AI phone agent.
 *
 * Shown to a prospect while Brian calls the demo number in front of them. It
 * polls the public read-only feed every three seconds and flashes any row that
 * is new since the last poll, so a lead the agent just captured visibly lands on
 * the screen mid-conversation.
 *
 * That is the whole pitch and the reason this is not behind the admin login: a
 * prospect should never see a password prompt, and should never see a real
 * client's pipeline. The feed is hardcoded to the demo tenant and every name in
 * it is fictional.
 */

import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '../config/site';

type Lead = {
  id: number; name: string; phone: string | null; company: string | null;
  message: string | null; status: string; created_at: string;
};
type Customer = {
  id: number; name: string; phone: string | null; account_ref: string | null;
  site_name: string | null; service_plan: string | null;
};
type WorkOrder = {
  reference: string; summary: string; status: string; priority: string;
  technician: string | null; scheduled_for: string | null; customer: string | null;
};
type Activity = {
  id: number; type: string; subject: string; duration_minutes: number | null;
  due_at: string | null; created_at: string; lead: string | null;
};
type Feed = {
  tenant: string; note: string;
  leads: Lead[]; customers: Customer[]; work_orders: WorkOrder[]; activities: Activity[];
};

const POLL_MS = 3000;

function timeAgo(ts: string): string {
  const then = Date.parse(ts.replace(' ', 'T') + (ts.endsWith('Z') ? '' : 'Z'));
  if (Number.isNaN(then)) return ts;
  const secs = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.round(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.round(secs / 3600)}h ago`;
  return `${Math.round(secs / 86400)}d ago`;
}

export default function DemoPhone() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const [live, setLive] = useState(true);
  const seen = useRef<Set<string> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`${siteConfig.apiUrl}/voice/demo`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`feed returned ${res.status}`);
        const data: Feed = await res.json();
        if (cancelled) return;

        const keys = new Set<string>([
          ...data.leads.map((l) => `lead:${l.id}`),
          ...data.work_orders.map((w) => `wo:${w.reference}`),
          ...data.activities.map((a) => `act:${a.id}`),
        ]);

        // First poll establishes the baseline — nothing should flash on load.
        if (seen.current) {
          const added = [...keys].filter((k) => !seen.current!.has(k));
          if (added.length) {
            setFresh(new Set(added));
            setTimeout(() => !cancelled && setFresh(new Set()), 6000);
          }
        }
        seen.current = keys;
        setFeed(data);
        setErr(null);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : 'could not reach the feed');
      }
    }

    poll();
    const id = live ? setInterval(poll, POLL_MS) : undefined;
    return () => { cancelled = true; if (id) clearInterval(id); };
  }, [live]);

  const isNew = (k: string) => fresh.has(k);

  return (
    <div className="min-h-screen bg-charcoal text-white/90">
      <div className="max-w-[1400px] mx-auto px-5 py-8">

        <header className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-white/15">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-orange mb-2">
              Ascend Systems · live demonstration
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Imperial Climate Control — dispatch board
            </h1>
            <p className="text-white/55 text-sm mt-1.5 max-w-2xl">
              This screen is fed by the same database the phone agent writes to. Call the
              number and watch a new caller appear here, live, before you hang up.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${siteConfig.phone.replace(/[^\d+]/g, '')}`}
              className="font-mono text-lg text-orange hover:underline"
            >
              {siteConfig.phone}
            </a>
            <button
              onClick={() => setLive((v) => !v)}
              className="font-mono text-[10px] tracking-[0.14em] uppercase px-3 py-2 rounded border border-white/25 hover:border-orange hover:text-orange transition"
            >
              {live ? '● live' : '‖ paused'}
            </button>
          </div>
        </header>

        {err && (
          <div className="mt-5 rounded border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {err} — retrying every {POLL_MS / 1000}s.
          </div>
        )}

        {!feed && !err && (
          <p className="mt-8 font-mono text-sm text-white/45">Connecting to the board…</p>
        )}

        {feed && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-6">

            {/* ---- callers captured ---- */}
            <Panel title="Callers captured" count={feed.leads.length} accent>
              {feed.leads.map((l) => (
                <Row key={l.id} flash={isNew(`lead:${l.id}`)}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold text-white">{l.name}</span>
                    <span className="font-mono text-[11px] text-white/40 whitespace-nowrap">
                      {timeAgo(l.created_at)}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-white/50 mt-0.5">
                    {[l.phone, l.company].filter(Boolean).join(' · ') || '—'}
                  </div>
                  {l.message && (
                    <p className="text-[13px] text-white/70 mt-1.5 leading-snug">{l.message}</p>
                  )}
                </Row>
              ))}
            </Panel>

            {/* ---- jobs ---- */}
            <Panel title="Work orders" count={feed.work_orders.length}>
              {feed.work_orders.map((w) => (
                <Row key={w.reference} flash={isNew(`wo:${w.reference}`)}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-[12px] text-orange">{w.reference}</span>
                    <Status value={w.status} priority={w.priority} />
                  </div>
                  <div className="text-[13px] text-white/85 mt-1 leading-snug">{w.summary}</div>
                  <div className="font-mono text-[11px] text-white/45 mt-1">
                    {[w.customer, w.technician, w.scheduled_for].filter(Boolean).join(' · ')}
                  </div>
                </Row>
              ))}
            </Panel>

            {/* ---- call log ---- */}
            <Panel title="Call log" count={feed.activities.length}>
              {feed.activities.map((a) => (
                <Row key={a.id} flash={isNew(`act:${a.id}`)}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[13px] text-white/85">{a.subject}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                      {a.type}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-white/45 mt-0.5">
                    {[a.lead, a.duration_minutes ? `${a.duration_minutes} min` : null, a.due_at]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                </Row>
              ))}
            </Panel>

            {/* ---- accounts ---- */}
            <Panel title="Customer accounts" count={feed.customers.length}>
              {feed.customers.map((c) => (
                <Row key={c.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold text-white">{c.name}</span>
                    <span className="font-mono text-[11px] text-white/40">{c.account_ref}</span>
                  </div>
                  <div className="font-mono text-[11px] text-white/50 mt-0.5">
                    {[c.phone, c.site_name].filter(Boolean).join(' · ')}
                  </div>
                  <div className="text-[12px] text-white/60 mt-1">{c.service_plan}</div>
                </Row>
              ))}
            </Panel>
          </div>
        )}

        <footer className="mt-10 pt-5 border-t border-white/12 text-[12px] text-white/40 leading-relaxed">
          <b className="text-white/60">Imperial Climate Control is not a real company.</b>{' '}
          It is a demonstration tenant built by Ascend Systems to show an AI phone agent
          working against a live database. Every name is fictional and no service is
          dispatched. Your own agent would run on your data, in your own isolated database.
        </footer>
      </div>
    </div>
  );
}

function Panel({
  title, count, accent, children,
}: { title: string; count: number; accent?: boolean; children: React.ReactNode }) {
  return (
    <section
      className={`rounded-md border bg-white/[0.03] overflow-hidden ${
        accent ? 'border-orange/45' : 'border-white/12'
      }`}
    >
      <div className="flex items-baseline justify-between px-4 py-3 border-b border-white/12 bg-white/[0.04]">
        <h2 className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/75">{title}</h2>
        <span className="font-mono text-[11px] text-white/35 tabular-nums">{count}</span>
      </div>
      <div className="max-h-[380px] overflow-y-auto divide-y divide-white/8">{children}</div>
    </section>
  );
}

function Row({ flash, children }: { flash?: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`px-4 py-3 transition-colors duration-700 ${
        flash ? 'bg-orange/25' : 'bg-transparent'
      }`}
    >
      {children}
    </div>
  );
}

function Status({ value, priority }: { value: string; priority: string }) {
  const tone =
    priority === 'emergency' ? 'text-red-300 border-red-300/50'
    : priority === 'urgent' ? 'text-amber-300 border-amber-300/50'
    : value === 'complete' ? 'text-emerald-300 border-emerald-300/50'
    : 'text-white/50 border-white/25';
  return (
    <span className={`font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${tone}`}>
      {value}
    </span>
  );
}
