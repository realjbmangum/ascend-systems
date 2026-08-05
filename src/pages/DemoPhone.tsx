/**
 * Live demo board for the AI phone agent.
 *
 * Shown to a prospect while Brian calls the demo number in front of them. Polls
 * the public read-only feed every three seconds and flashes any row that is new
 * since the last poll, so a lead the agent just captured visibly lands on the
 * screen mid-conversation. Click any row for the full record.
 *
 * Not behind the admin login on purpose: a prospect should never meet a password
 * prompt, and should never be one tab away from Ascend's real pipeline. The feed
 * is hardcoded to the demo tenant and every name in it is fictional.
 *
 * CHART COLOR — validated, do not eyeball a replacement.
 * Two series on the #1E2A32 surface: #DB7530 (leads) and #3E93C7 (bookings).
 * Passes lightness band, chroma floor, CVD separation (ΔE 20.4 protan),
 * normal-vision floor (26.4) and 3:1 contrast. Both series are direct-labeled
 * and legended, so identity never rests on colour alone.
 */

import { useEffect, useRef, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { siteConfig } from '../config/site';

const C_LEADS = '#DB7530';
const C_BOOKINGS = '#3E93C7';
const SURFACE = '#1E2A32';
const POLL_MS = 3000;

// Dedicated line for the AI phone agent demo — deliberately NOT
// siteConfig.phone, which is Ascend's real business number shown in the
// footer, Contact page, and site-wide schema.org NAP data.
const DEMO_PHONE = '(980) 577-1231';

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
  tenant: string;
  metrics: { leads_7d: number; bookings: number; open_jobs: number; customers: number; call_minutes: number };
  series: Array<{ day: string; label: string; leads: number; bookings: number }>;
  statuses: Array<{ status: string; n: number }>;
  leads: Lead[]; customers: Customer[]; work_orders: WorkOrder[]; activities: Activity[];
};
type Selected = { kind: 'lead' | 'work_order' | 'customer' | 'activity'; data: any } | null;

function timeAgo(ts: string): string {
  const t = Date.parse(ts.replace(' ', 'T') + (ts.endsWith('Z') ? '' : 'Z'));
  if (Number.isNaN(t)) return ts;
  const s = Math.max(0, Math.round((Date.now() - t) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}

export default function DemoPhone() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const [live, setLive] = useState(true);
  const [sel, setSel] = useState<Selected>(null);
  const seen = useRef<Set<string> | null>(null);

  useEffect(() => {
    let dead = false;
    async function poll() {
      try {
        const res = await fetch(`${siteConfig.apiUrl}/voice/demo`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`feed returned ${res.status}`);
        const data: Feed = await res.json();
        if (dead) return;
        const keys = new Set<string>([
          ...data.leads.map((l) => `lead:${l.id}`),
          ...data.work_orders.map((w) => `wo:${w.reference}`),
          ...data.activities.map((a) => `act:${a.id}`),
        ]);
        if (seen.current) {
          const added = [...keys].filter((k) => !seen.current!.has(k));
          if (added.length) {
            setFresh(new Set(added));
            setTimeout(() => !dead && setFresh(new Set()), 6000);
          }
        }
        seen.current = keys;
        setFeed(data);
        setErr(null);
      } catch (e) {
        if (!dead) setErr(e instanceof Error ? e.message : 'could not reach the feed');
      }
    }
    poll();
    const id = live ? setInterval(poll, POLL_MS) : undefined;
    return () => { dead = true; if (id) clearInterval(id); };
  }, [live]);

  const isNew = (k: string) => fresh.has(k);

  return (
    <div className="min-h-screen bg-charcoal text-white/90">
      <div className="max-w-[1500px] mx-auto px-5 py-7">

        <header className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-white/15">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-orange mb-2">
              Ascend Systems · live demonstration
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Imperial Climate Control — dispatch board
            </h1>
            <p className="text-white/55 text-sm mt-1.5 max-w-2xl">
              Fed by the same database the phone agent writes to. Call the number and watch a
              caller appear here, live, before you hang up. Click any row for the full record.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${DEMO_PHONE.replace(/[^\d+]/g, '')}`}
               className="font-mono text-lg text-orange hover:underline">{DEMO_PHONE}</a>
            <button onClick={() => setLive((v) => !v)}
              aria-pressed={live}
              className="font-mono text-[10px] tracking-[0.14em] uppercase px-3 py-2 rounded border border-white/25 hover:border-orange hover:text-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange transition">
              {live ? '● live' : '‖ paused'}
            </button>
          </div>
        </header>

        {err && (
          <div className="mt-5 rounded border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {err} — retrying every {POLL_MS / 1000}s.
          </div>
        )}
        {!feed && !err && <p className="mt-8 font-mono text-sm text-white/45">Connecting…</p>}

        {feed && (
          <>
            {/* ---- headline numbers ---- */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
              <Stat label="Callers this week" value={feed.metrics.leads_7d} accent />
              <Stat label="Visits booked" value={feed.metrics.bookings} />
              <Stat label="Open jobs" value={feed.metrics.open_jobs} />
              <Stat label="Accounts" value={feed.metrics.customers} />
              <Stat label="Minutes handled" value={feed.metrics.call_minutes} />
            </div>

            {/* ---- charts ---- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
              <div className="lg:col-span-2 rounded-md border border-white/12 bg-white/[0.03] p-4">
                <h2 className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/75 mb-3">
                  Activity, last 7 days
                </h2>
                <div style={{ width: '100%', height: 210 }}>
                  <ResponsiveContainer>
                    <BarChart data={feed.series} margin={{ top: 6, right: 6, left: -22, bottom: 0 }} barGap={2}>
                      <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                      <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                             axisLine={{ stroke: 'rgba(255,255,255,0.15)' }} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                             axisLine={false} tickLine={false} width={38} />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ background: SURFACE, border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: 4, fontSize: 12 }}
                        labelStyle={{ color: 'rgba(255,255,255,0.6)' }} />
                      <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }} />
                      <Bar dataKey="leads" name="Callers captured" fill={C_LEADS} radius={[4, 4, 0, 0]} maxBarSize={26} />
                      <Bar dataKey="bookings" name="Visits booked" fill={C_BOOKINGS} radius={[4, 4, 0, 0]} maxBarSize={26} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-md border border-white/12 bg-white/[0.03] p-4">
                <h2 className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/75 mb-3">
                  Jobs by status
                </h2>
                <StatusBars rows={feed.statuses} />
              </div>
            </div>

            {/* ---- panels ---- */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
              <Panel title="Callers captured" count={feed.leads.length} accent>
                {feed.leads.map((l) => (
                  <Row key={l.id} flash={isNew(`lead:${l.id}`)}
                       onClick={() => setSel({ kind: 'lead', data: l })}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-semibold text-white">{l.name}</span>
                      <span className="font-mono text-[11px] text-white/40 whitespace-nowrap">{timeAgo(l.created_at)}</span>
                    </div>
                    <div className="font-mono text-[11px] text-white/50 mt-0.5">
                      {[l.phone, l.company].filter(Boolean).join(' · ') || '—'}
                    </div>
                    {l.message && <p className="text-[13px] text-white/70 mt-1.5 leading-snug">{l.message}</p>}
                  </Row>
                ))}
              </Panel>

              <Panel title="Work orders" count={feed.work_orders.length}>
                {feed.work_orders.map((w) => (
                  <Row key={w.reference} flash={isNew(`wo:${w.reference}`)}
                       onClick={() => setSel({ kind: 'work_order', data: w })}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-mono text-[12px] text-orange">{w.reference}</span>
                      <StatusChip value={w.status} priority={w.priority} />
                    </div>
                    <div className="text-[13px] text-white/85 mt-1 leading-snug">{w.summary}</div>
                    <div className="font-mono text-[11px] text-white/45 mt-1">
                      {[w.customer, w.technician, w.scheduled_for].filter(Boolean).join(' · ')}
                    </div>
                  </Row>
                ))}
              </Panel>

              <Panel title="Call log" count={feed.activities.length}>
                {feed.activities.map((a) => (
                  <Row key={a.id} flash={isNew(`act:${a.id}`)}
                       onClick={() => setSel({ kind: 'activity', data: a })}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[13px] text-white/85">{a.subject}</span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">{a.type}</span>
                    </div>
                    <div className="font-mono text-[11px] text-white/45 mt-0.5">
                      {[a.lead, a.duration_minutes ? `${a.duration_minutes} min` : null, a.due_at].filter(Boolean).join(' · ')}
                    </div>
                  </Row>
                ))}
              </Panel>

              <Panel title="Customer accounts" count={feed.customers.length}>
                {feed.customers.map((c) => (
                  <Row key={c.id} onClick={() => setSel({ kind: 'customer', data: c })}>
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
          </>
        )}

        <footer className="mt-9 pt-5 border-t border-white/12 text-[12px] text-white/40 leading-relaxed">
          <b className="text-white/60">Imperial Climate Control is not a real company.</b>{' '}
          It is a demonstration tenant built by Ascend Systems to show an AI phone agent working
          against a live database. Every name is fictional and no service is dispatched. Your own
          agent would run on your data, in your own isolated database.
        </footer>
      </div>

      {sel && <Detail sel={sel} onClose={() => setSel(null)} />}
    </div>
  );
}

/* ---------------------------------------------------------------- pieces */

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-md border px-4 py-3 ${accent ? 'border-orange/45 bg-orange/[0.07]' : 'border-white/12 bg-white/[0.03]'}`}>
      <div className="font-mono text-[9.5px] tracking-[0.15em] uppercase text-white/45">{label}</div>
      <div className="text-2xl font-bold tabular-nums mt-1 text-white">{value}</div>
    </div>
  );
}

/**
 * Jobs by status. Horizontal bars rather than a donut — at this many rows a
 * donut is decoration, and length is easier to compare than angle. Status is a
 * reserved palette, never the categorical series colours, and every bar carries
 * a written label so state is not encoded by colour alone.
 */
function StatusBars({ rows }: { rows: Array<{ status: string; n: number }> }) {
  const tone: Record<string, string> = {
    scheduled: '#3E93C7', dispatched: '#D9A24E', complete: '#57B183', cancelled: 'rgba(255,255,255,0.28)',
  };
  const max = Math.max(1, ...rows.map((r) => r.n));
  if (!rows.length) return <p className="text-sm text-white/40">No jobs yet.</p>;
  return (
    <div className="flex flex-col gap-2.5">
      {rows.map((r) => (
        <div key={r.status}>
          <div className="flex items-baseline justify-between text-[12px] mb-1">
            <span className="text-white/75 capitalize">{r.status}</span>
            <span className="font-mono text-white/50 tabular-nums">{r.n}</span>
          </div>
          <div className="h-2.5 rounded-sm bg-white/[0.07] overflow-hidden">
            <div className="h-full rounded-sm" style={{ width: `${(r.n / max) * 100}%`, background: tone[r.status] ?? 'rgba(255,255,255,0.3)' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Panel({ title, count, accent, children }: {
  title: string; count: number; accent?: boolean; children: React.ReactNode;
}) {
  return (
    <section className={`rounded-md border bg-white/[0.03] overflow-hidden ${accent ? 'border-orange/45' : 'border-white/12'}`}>
      <div className="flex items-baseline justify-between px-4 py-3 border-b border-white/12 bg-white/[0.04]">
        <h2 className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/75">{title}</h2>
        <span className="font-mono text-[11px] text-white/35 tabular-nums">{count}</span>
      </div>
      <div className="max-h-[340px] overflow-y-auto divide-y divide-white/8">{children}</div>
    </section>
  );
}

function Row({ flash, onClick, children }: {
  flash?: boolean; onClick?: () => void; children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick}
      className={`w-full text-left px-4 py-3 transition-colors duration-700 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange focus-visible:-outline-offset-2 ${flash ? 'bg-orange/25' : ''}`}>
      {children}
    </button>
  );
}

function StatusChip({ value, priority }: { value: string; priority: string }) {
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

const LABELS: Record<string, string> = {
  name: 'Name', phone: 'Phone', company: 'Company', message: 'What they wanted',
  created_at: 'Captured', status: 'Status', reference: 'Job', summary: 'Work',
  priority: 'Priority', technician: 'Technician', scheduled_for: 'Scheduled',
  customer: 'Customer', account_ref: 'Account', site_name: 'Site',
  service_plan: 'Plan', subject: 'Subject', duration_minutes: 'Duration',
  due_at: 'Due', type: 'Type', lead: 'Lead', id: 'Record',
};

function Detail({ sel, onClose }: { sel: NonNullable<Selected>; onClose: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  const title =
    sel.data.name ?? sel.data.reference ?? sel.data.subject ?? 'Record';
  const kindLabel = sel.kind.replace('_', ' ');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 p-4"
         onClick={onClose} role="dialog" aria-modal="true" aria-label={`${kindLabel} detail`}>
      <div className="w-full max-w-lg rounded-md border border-white/20 bg-charcoal max-h-[85vh] overflow-y-auto"
           onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-white/12 sticky top-0 bg-charcoal">
          <div>
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-orange">{kindLabel}</p>
            <h3 className="text-lg font-bold text-white mt-0.5">{title}</h3>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="font-mono text-xs text-white/50 hover:text-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange px-2 py-1">
            ESC ✕
          </button>
        </div>
        <dl className="px-5 py-4 grid gap-3">
          {Object.entries(sel.data)
            .filter(([, v]) => v !== null && v !== '' && v !== undefined)
            .map(([k, v]) => (
              <div key={k} className="grid grid-cols-[120px_1fr] gap-3 items-start">
                <dt className="font-mono text-[10px] tracking-[0.1em] uppercase text-white/40 pt-0.5">
                  {LABELS[k] ?? k.replace(/_/g, ' ')}
                </dt>
                <dd className="text-[13.5px] text-white/85 break-words">{String(v)}</dd>
              </div>
            ))}
        </dl>
        <p className="px-5 pb-5 text-[11.5px] text-white/40 leading-relaxed">
          Captured by the phone agent and written straight into this business's own database —
          not a transcript, not a voicemail, a record their staff can work from.
        </p>
      </div>
    </div>
  );
}
