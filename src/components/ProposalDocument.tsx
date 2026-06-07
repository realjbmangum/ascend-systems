/**
 * ProposalDocument — Ascend V2 paginated-sheet design.
 *
 * Translated from the Ascend V2 CTO Proposal HTML reference into a
 * data-driven React renderer. Used in two places:
 *   - /admin/proposals/:id  (admin preview — what your client will see)
 *   - /proposals/:token     (public sign page)
 *
 * Styles live in ../styles/proposal-document.css and are scoped to the
 * `.proposal-document` root class so V2 brand tokens (warmer charcoal
 * #1C1C1E, deeper orange #C45A2C, paper #FAFAF8) don't leak into the
 * rest of the admin (which still uses the older site tokens).
 */

import { Fragment, useEffect, useState } from 'react';
import '../styles/proposal-document.css';

interface ProposalLike {
  id: number;
  status?: string;
  title: string;
  intro?: string | null;
  scope?: string | null;
  deliverables?: string | null;
  out_of_scope?: string | null;
  timeline?: string | null;
  client_responsibilities?: string | null;
  acceptance_criteria?: string | null;
  pricing_model?: string | null;
  price_summary?: string | null;
  payment_schedule?: string | null;
  total_cents?: number | null;
  client_name?: string | null;
  project_name?: string | null;
  created_at?: string;
  msa_version?: string | null;
  selected_tier?: string | null;
  tiers?: string | null; // JSON-encoded Tier[]
}

const PRICING_LABELS: Record<string, string> = {
  time_materials: 'Time & Materials',
  fixed: 'Fixed Fee',
  retainer: 'Monthly Retainer',
};

function formatMoney(cents: number) {
  const n = (cents || 0) / 100;
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatDollars(dollars: number) {
  return `$${dollars.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatRefDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const y = d.getFullYear();
  return `${m}/${day}/${y}`;
}

/* ─────────────────────────────────────── Tier definitions ── */

export type PortalModel = 'included' | 'separate' | 'none';

export interface Tier {
  key: string;                 // 'a' | 'b'
  optionKey: string;           // "Option A" / "Option B"
  name: string;                // "Bucket" / "Unlimited"
  monthlyDollars: number;      // 2000 / 3000
  sub: string;
  features: string[];
  recommended: boolean;
  portalModel: PortalModel;
  portalPerPropertyDollars?: number; // when portalModel='separate'
  portalPropertyCount?: number;      // when portalModel='separate'
  totalBandTagline: string;
}

/* Default property count fallback when a tier's portalPropertyCount is not
   set (e.g. legacy data from the hard-coded resolver). */
const DEFAULT_PORTAL_PROPERTY_COUNT = 32;

/**
 * Return the structured tier set for this proposal.
 *
 * Priority order:
 *   1. `proposal.tiers` — JSON column populated by the admin tier editor.
 *      This is the source of truth going forward.
 *   2. Legacy fallback for retainer proposals whose price_summary references
 *      the original two-tier convention but predate the JSON column.
 *
 * Returns null when the proposal has no tier-based pricing.
 */
function resolveTiers(proposal: ProposalLike): Tier[] | null {
  // 1) Structured tier data from the admin editor
  if (proposal.tiers) {
    try {
      const parsed = JSON.parse(proposal.tiers) as Tier[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeTier);
      }
    } catch {
      // Fall through to legacy resolver on bad JSON.
    }
  }

  // 2) Legacy fallback
  if (proposal.pricing_model !== 'retainer') return null;
  const blob = proposal.price_summary || '';
  if (!/OPTION\s+A/i.test(blob) || !/OPTION\s+B/i.test(blob)) return null;

  return [
    {
      key: 'a',
      optionKey: 'Option A',
      name: 'Bucket',
      monthlyDollars: 2000,
      sub: 'Up to 10 hours of strategic advisory + vendor management each month.',
      features: [
        'Up to 10 hours/month of advisory + vendor management',
        'Monthly strategy call',
        'Additional hours at $200/hr (with prior notice)',
        '**Document Portal not included** — billed separately at **$35 per active property / month**',
      ],
      recommended: false,
      portalModel: 'separate',
      portalPerPropertyDollars: 35,
      portalPropertyCount: 32,
      totalBandTagline:
        'Monthly retainer + Document Portal billed per property',
    },
    {
      key: 'b',
      optionKey: 'Option B',
      name: 'Unlimited',
      monthlyDollars: 3000,
      sub: 'Unlimited strategic advisory + vendor management (fair use).',
      features: [
        '**Unlimited** advisory + vendor management hours',
        '**Weekly** strategy call (in lieu of monthly)',
        'Vendor contract reviews **bundled** at no extra cost',
        '**Document Portal included** — every active property, no separate billing',
      ],
      recommended: true,
      portalModel: 'included',
      totalBandTagline:
        'Monthly retainer · Document Portal included · weekly calls',
    },
  ];
}

/* Tolerate older saved tier shapes (e.g. portalIncluded:true instead of
   portalModel:'included'). Coerce numeric fields. */
function normalizeTier(raw: any): Tier {
  const portalModel: PortalModel =
    raw.portalModel === 'included' ||
    raw.portalModel === 'separate' ||
    raw.portalModel === 'none'
      ? raw.portalModel
      : raw.portalIncluded
      ? 'included'
      : raw.portalPerPropertyDollars
      ? 'separate'
      : 'none';
  return {
    key: String(raw.key || ''),
    optionKey: String(raw.optionKey || ''),
    name: String(raw.name || ''),
    monthlyDollars: Number(raw.monthlyDollars) || 0,
    sub: String(raw.sub || ''),
    features: Array.isArray(raw.features) ? raw.features.map(String) : [],
    recommended: !!raw.recommended,
    portalModel,
    portalPerPropertyDollars:
      raw.portalPerPropertyDollars != null
        ? Number(raw.portalPerPropertyDollars) || 0
        : undefined,
    portalPropertyCount:
      raw.portalPropertyCount != null
        ? Number(raw.portalPropertyCount) || 0
        : undefined,
    totalBandTagline: String(raw.totalBandTagline || ''),
  };
}

/* ─────────────────────────────────────── Rich-ish renderers ── */

function Paragraphs({ text }: { text: string }) {
  if (!text) return null;
  const blocks = text
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
  return (
    <>
      {blocks.map((b, i) => (
        <p key={i}>{renderInline(b)}</p>
      ))}
    </>
  );
}

function renderInline(text: string) {
  const parts: (string | JSX.Element)[] = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<strong key={key++}>{m[1]}</strong>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <Fragment>{parts}</Fragment>;
}

function NumberedList({ text }: { text: string }) {
  const items = extractListItems(text);
  if (items.length === 0) return <Paragraphs text={text} />;
  return (
    <ul className="pd-delv">
      {items.map((it, i) => (
        <li key={i}>{renderInline(it)}</li>
      ))}
    </ul>
  );
}

function extractListItems(text: string): string[] {
  const cleaned = text.replace(/\r\n/g, '\n').trim();
  const inline = cleaned.match(/(?:^|\s)\d+[).]\s+/g);
  if (inline && inline.length >= 2) {
    return cleaned
      .split(/(?:^|\s)\d+[).]\s+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.replace(/\.\s*$/, ''));
  }
  const lineItems = cleaned
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const bulleted = lineItems
    .map((l) => l.replace(/^[-*•]\s+/, '').replace(/^\d+[).]\s+/, ''))
    .filter((l, idx) => l !== lineItems[idx] || /^[-*•\d]/.test(lineItems[idx]));
  if (bulleted.length >= 2 && bulleted.length === lineItems.length) {
    return bulleted.map((s) => s.replace(/\.\s*$/, ''));
  }
  return [];
}

/* ─────────────────────────────────────── Document ── */

export default function ProposalDocument({
  proposal,
  onSelectedTierChange,
}: {
  proposal: ProposalLike;
  /** Notifies parent when the visible selection changes (so the sign form
   *  can pass it on submit). Optional — preview-only contexts ignore it. */
  onSelectedTierChange?: (tier: string | null) => void;
}) {
  const msaVersion = proposal.msa_version || '2026-05';
  const refDate = formatRefDate(proposal.created_at);
  const refId = `ASC-${new Date(proposal.created_at || Date.now()).getFullYear()} · #${String(
    proposal.id
  ).padStart(4, '0')}`;
  const statusLabel = (proposal.status || 'DRAFT').toUpperCase();

  const tiers = resolveTiers(proposal);
  const accepted = proposal.status === 'accepted';
  // Default to recommended; respect any prior selection on a signed proposal.
  const defaultTier =
    proposal.selected_tier ||
    (tiers ? tiers.find((t) => t.recommended)?.key || tiers[0].key : null);
  const [selectedTierKey, setSelectedTierKey] = useState<string | null>(defaultTier);

  useEffect(() => {
    onSelectedTierChange?.(selectedTierKey);
  }, [selectedTierKey, onSelectedTierChange]);

  // Re-sync if the proposal's stored selection changes after sign.
  useEffect(() => {
    if (proposal.selected_tier && proposal.selected_tier !== selectedTierKey) {
      setSelectedTierKey(proposal.selected_tier);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal.selected_tier]);

  const selectedTier = tiers?.find((t) => t.key === selectedTierKey) || null;

  const isRetainer = proposal.pricing_model === 'retainer';
  const totalCents = proposal.total_cents ?? 0;

  const oosChips = chunkOutOfScope(proposal.out_of_scope || '');
  const facts = facetTimeline(proposal.timeline || '', proposal.pricing_model || '');
  const finePrint = stripTierBlocks(proposal.price_summary || '');

  return (
    <div className="proposal-document">
      <div className="pd-stage">

        {/* ════════ COVER ════════ */}
        <div className="pd-sheet pd-cover">
          <div className="pd-cover-photo" />
          <div className="pd-cover-grid" />
          <div className="pd-cover-glow" />
          <div className="pd-pad">
            <div className="pd-cover-top">
              <div className="pd-cover-brand">
                <img src="/brand-v2/logo-mark-only.png" alt="Ascend Systems mark" />
                <div>
                  <div className="pd-wm">ASCEND&nbsp;SYSTEMS</div>
                  <div className="pd-sub">LEGACY MODERNIZATION · AI · SAAS</div>
                </div>
              </div>
              <div className="pd-cover-ref">
                PROPOSAL<br />
                {refId}<br />
                <span className="pd-ref-status">
                  {statusLabel}
                  {refDate ? ` · ${refDate}` : ''}
                </span>
              </div>
            </div>

            <div className="pd-cover-mid">
              <div className="pd-cover-eyebrow">
                {coverEyebrow(proposal.title)}
              </div>
              <h1>{splitTitle(proposal.title)}</h1>
              {proposal.intro && (
                <div className="pd-cover-for">{firstSentence(proposal.intro)}</div>
              )}
            </div>

            <div className="pd-cover-bottom">
              <div className="pd-cell">
                <div className="pd-k">Prepared for</div>
                <div className="pd-v">{proposal.client_name || '—'}</div>
              </div>
              <div className="pd-cell">
                <div className="pd-k">Engagement</div>
                <div className="pd-v">
                  {PRICING_LABELS[proposal.pricing_model || ''] || 'See pricing'}
                </div>
              </div>
              <div className="pd-cell">
                <div className="pd-k">Governing terms</div>
                <div className="pd-v pd-mono">MSA v{msaVersion}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════ BODY SHEET ════════ */}
        <div className="pd-sheet">
          <div className="pd-pad">

            {proposal.intro && (
              <Section number="01" title="Introduction">
                <Paragraphs text={proposal.intro} />
              </Section>
            )}

            {proposal.scope && (
              <Section number="02" title="Scope">
                <ScopeBlock text={proposal.scope} />
              </Section>
            )}

            {proposal.deliverables && (
              <Section number="03" title="Deliverables">
                <NumberedList text={proposal.deliverables} />
              </Section>
            )}

            {(oosChips.length > 0 || proposal.out_of_scope) && (
              <Section number="04" title="Out of Scope">
                <p>The following are explicitly excluded from this engagement:</p>
                {oosChips.length > 0 ? (
                  <div className="pd-oos">
                    {oosChips.map((c, i) => (
                      <span key={i}>{c}</span>
                    ))}
                  </div>
                ) : (
                  <Paragraphs text={proposal.out_of_scope || ''} />
                )}
              </Section>
            )}

            {(proposal.timeline || facts.length > 0) && (
              <Section number="05" title="Timeline & Terms">
                {facts.length > 0 ? (
                  <div className="pd-facts">
                    {facts.map((f, i) => (
                      <div key={i} className="pd-f">
                        <div className="pd-k">{f.label}</div>
                        <div className="pd-v">{f.value}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Paragraphs text={proposal.timeline || ''} />
                )}
              </Section>
            )}

            {/* ════════ PRICING ════════ */}
            {(tiers || proposal.price_summary) && (
              <div className="pd-sec" style={{ marginTop: '24pt' }}>
                <div className="pd-section-eyebrow">06 — Pricing</div>
                <div
                  className="pd-sec-head"
                  style={{ border: 'none', paddingBottom: 0, marginBottom: '6pt' }}
                >
                  <h2 className="pd-sec-title" style={{ fontSize: '17pt' }}>
                    {tiers ? 'Two tiers. Pick the fit.' : 'Pricing'}
                  </h2>
                </div>
                {tiers && (
                  <p style={{ marginBottom: '6pt' }}>
                    Both tiers sit well below standard fractional-CTO market pricing,
                    reflecting a remote, advisory-only engagement with no on-site
                    presence and no board service.
                  </p>
                )}
                {tiers && !accepted && (
                  <p
                    style={{
                      marginBottom: '14pt',
                      fontFamily: 'var(--pd-font-mono)',
                      fontSize: '8.5pt',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'var(--pd-accent-dark)',
                    }}
                  >
                    Click a card to select it — the total below updates to match.
                  </p>
                )}

                {tiers ? (
                  <div className="pd-tiers">
                    {tiers.map((t) => (
                      <TierCard
                        key={t.key}
                        tier={t}
                        selected={t.key === selectedTierKey}
                        locked={accepted}
                        onSelect={() => !accepted && setSelectedTierKey(t.key)}
                      />
                    ))}
                  </div>
                ) : (
                  <Paragraphs text={proposal.price_summary || ''} />
                )}
              </div>
            )}

            {finePrint && (
              <div className="pd-fineprint">
                <Paragraphs text={finePrint} />
              </div>
            )}

            {proposal.payment_schedule && (
              <Section number="07" title="Payment Schedule">
                <Paragraphs text={proposal.payment_schedule} />
              </Section>
            )}

            {proposal.client_responsibilities && (
              <Section number="08" title="Client Responsibilities">
                <NumberedList text={proposal.client_responsibilities} />
              </Section>
            )}

            {proposal.acceptance_criteria && (
              <Section number="09" title="Acceptance Criteria">
                <NumberedList text={proposal.acceptance_criteria} />
              </Section>
            )}

            {/* Total band */}
            {(selectedTier || totalCents > 0) && (
              <TotalBand
                tier={selectedTier}
                fallbackTotalCents={totalCents}
                fallbackTagline={
                  isRetainer ? 'Monthly retainer' : 'Total investment'
                }
                accepted={accepted}
              />
            )}

            {/* Signature lines */}
            <div className="pd-sign">
              <div>
                <div className="pd-line" />
                <div className="pd-role">For {proposal.client_name || 'Client'}</div>
                <div className="pd-nm">Signature &amp; date</div>
              </div>
              <div>
                <div className="pd-line" />
                <div className="pd-role">For Ascend Systems</div>
                <div className="pd-nm">Brian Mangum · Founder</div>
              </div>
            </div>

            <p
              style={{
                fontSize: '8.5pt',
                color: 'var(--pd-gray-400)',
                marginTop: '20pt',
                lineHeight: 1.6,
              }}
            >
              Governing terms: MSA v{msaVersion}
              {accepted ? ' (accepted).' : ' (not yet accepted).'} This proposal
              is confidential and intended solely for{' '}
              {proposal.client_name || 'the named recipient'}. Pricing valid for 30
              days from the date above.
            </p>

            <div className="pd-foot">
              <span>Ascend Systems · brian@ascendsystems.ai</span>
              <span className="pd-accent">ascendsystems.ai</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────── Pieces ── */

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pd-sec">
      <div className="pd-sec-head">
        <span className="pd-sec-num">{number}</span>
        <h2 className="pd-sec-title">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function TierCard({
  tier,
  selected,
  locked,
  onSelect,
}: {
  tier: Tier;
  selected: boolean;
  locked: boolean;
  onSelect: () => void;
}) {
  const className = [
    'pd-tier',
    tier.recommended ? 'pd-rec' : '',
    selected ? 'pd-selected' : '',
    locked ? 'pd-locked' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      role={locked ? undefined : 'button'}
      tabIndex={locked ? -1 : 0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (!locked && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-pressed={!locked ? selected : undefined}
    >
      {tier.recommended && <span className="pd-rec-flag">Recommended</span>}
      {selected && !locked && (
        <span className="pd-select-flag" aria-hidden="true">
          ✓ Selected
        </span>
      )}
      <div className="pd-opt">
        {tier.optionKey} — {tier.name}
      </div>
      <div className="pd-price">
        {formatDollars(tier.monthlyDollars)}
        <span>/mo</span>
      </div>
      <div className="pd-price-sub">{tier.sub}</div>
      <div className="pd-divider" />
      <ul>
        {tier.features.map((f, i) => (
          <li key={i}>
            <Check accent={tier.recommended || selected} />
            <span>{renderInline(f)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Check({ accent }: { accent: boolean }) {
  if (accent) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <circle cx="7" cy="7" r="6" fill="var(--pd-accent)" />
        <path
          d="M4.5 7l1.8 1.8L9.5 5.3"
          fill="none"
          stroke="#fff"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <circle cx="7" cy="7" r="6" fill="none" stroke="#9CA3AF" strokeWidth="1.3" />
      <path
        d="M4.5 7l1.8 1.8L9.5 5.3"
        fill="none"
        stroke="#6B7280"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TotalBand({
  tier,
  fallbackTotalCents,
  fallbackTagline,
  accepted,
}: {
  tier: Tier | null;
  fallbackTotalCents: number;
  fallbackTagline: string;
  accepted: boolean;
}) {
  // When no tier is resolved, show the proposal's flat total_cents value.
  if (!tier) {
    if (fallbackTotalCents <= 0) return null;
    return (
      <div className="pd-total-band">
        <div className="pd-tb-glow" />
        <div className="pd-tb-l">
          <div className="pd-tb-k">{accepted ? 'Signed total' : 'Total'}</div>
          <div className="pd-tb-desc">{fallbackTagline}</div>
        </div>
        <div className="pd-tb-v">{formatMoney(fallbackTotalCents)}</div>
      </div>
    );
  }

  const headerLabel = accepted
    ? `Selected — ${tier.optionKey} · ${tier.name}`
    : tier.recommended
    ? `Selected — ${tier.optionKey} · ${tier.name} (Recommended)`
    : `Selected — ${tier.optionKey} · ${tier.name}`;

  if (tier.portalModel !== 'separate') {
    // Single number: Portal included (or no Portal at all). One headline.
    return (
      <div className="pd-total-band">
        <div className="pd-tb-glow" />
        <div className="pd-tb-l">
          <div className="pd-tb-k">{headerLabel}</div>
          <div className="pd-tb-desc">{tier.totalBandTagline}</div>
        </div>
        <div className="pd-tb-v">
          {formatDollars(tier.monthlyDollars)}
          <span>/mo</span>
        </div>
      </div>
    );
  }

  // Separate Portal billing: show retainer + portal breakdown + computed total.
  const portalRate = tier.portalPerPropertyDollars || 35;
  const portalCount = tier.portalPropertyCount || DEFAULT_PORTAL_PROPERTY_COUNT;
  const portalMonthly = portalRate * portalCount;
  const allInMonthly = tier.monthlyDollars + portalMonthly;

  return (
    <div className="pd-total-band pd-total-band-split">
      <div className="pd-tb-glow" />
      <div className="pd-tb-l">
        <div className="pd-tb-k">{headerLabel}</div>
        <div className="pd-tb-desc">{tier.totalBandTagline}</div>
      </div>
      <div className="pd-tb-r">
        <div className="pd-tb-line">
          <span className="pd-tb-line-l">Monthly retainer</span>
          <span className="pd-tb-line-v">{formatDollars(tier.monthlyDollars)}</span>
        </div>
        <div className="pd-tb-line">
          <span className="pd-tb-line-l">
            Document Portal
            <span className="pd-tb-line-sub">
              ${portalRate} × {portalCount} properties
            </span>
          </span>
          <span className="pd-tb-line-v">{formatDollars(portalMonthly)}</span>
        </div>
        <div className="pd-tb-line pd-tb-line-total">
          <span className="pd-tb-line-l">All-in / month</span>
          <span className="pd-tb-line-v pd-tb-line-v-total">
            {formatDollars(allInMonthly)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────── Small text helpers ── */

function coverEyebrow(title: string) {
  if (/fractional\s+cto/i.test(title)) return 'Fractional CTO Engagement';
  if (/document\s+portal/i.test(title)) return 'Document Portal Engagement';
  if (/acumatica/i.test(title)) return 'Acumatica Integration';
  return 'Statement of Work';
}

function splitTitle(title: string) {
  const clean = title.split(/\s+[—–-]\s+/)[0] || title;
  const words = clean.trim().split(/\s+/);
  if (words.length <= 1) return clean;
  const lead = words.slice(0, -1).join(' ');
  const last = words[words.length - 1];
  return (
    <>
      {lead}
      <br />
      <span className="pd-accent">{last}</span>
    </>
  );
}

function firstSentence(text: string): string {
  const s = text.split(/(?<=[.!?])\s+/)[0] || text;
  return s.length > 320 ? s.slice(0, 320).trim() + '…' : s;
}

function ScopeBlock({ text }: { text: string }) {
  const m = text.match(/^([^:]+):\s*(.+)$/s);
  if (m && /\(\d+\)/.test(m[2])) {
    const lead = m[1].trim() + ':';
    const items = m[2]
      .split(/\(\d+\)/)
      .map((s) => s.trim().replace(/^[;,]\s*|[;,]\s*$/g, ''))
      .filter(Boolean)
      .map((s) => s.replace(/\.\s*$/, ''));
    if (items.length >= 2) {
      return (
        <>
          <p>{lead}</p>
          <ul className="pd-delv">
            {items.map((it, i) => (
              <li key={i}>{renderInline(it)}.</li>
            ))}
          </ul>
        </>
      );
    }
  }
  return <Paragraphs text={text} />;
}

function chunkOutOfScope(text: string): string[] {
  if (!text) return [];
  const firstChunk = text.split(/\.(?=\s|$)/)[0] || text;
  const parts = firstChunk
    .split(/;\s*|—\s+|,\s+(?=which|and\s+(?:hands|legal|board))/i)
    .map((p) => p.trim().replace(/^and\s+/i, ''))
    .filter(Boolean);
  if (parts.length < 2) return [];
  return parts
    .map((p) =>
      p
        .replace(/^The /, '')
        .replace(/\s+/g, ' ')
        .replace(/\.\s*$/, '')
        .trim()
    )
    .map((p) => (p.length > 0 ? p[0].toUpperCase() + p.slice(1) : p))
    .filter((p) => p.length > 0 && p.length < 120);
}

function facetTimeline(
  text: string,
  pricingModel: string
): { label: string; value: string }[] {
  const facts: { label: string; value: string }[] = [];
  const term = text.match(/(\d+)\s*-?month\s+initial\s+term[^.]*month[-\s]to[-\s]month/i);
  if (term) {
    facts.push({ label: 'Initial term', value: `${term[1]} months, then month-to-month` });
  }
  const notice = text.match(/(\d+)\s+days[''’]?\s+(?:written\s+)?notice/i);
  if (notice) {
    facts.push({
      label: 'Notice to terminate',
      value: `${notice[1]} days, written, either party`,
    });
  }
  if (pricingModel) {
    facts.push({
      label: 'Pricing model',
      value: PRICING_LABELS[pricingModel] || pricingModel,
    });
  }
  facts.push({ label: 'Invoicing', value: 'Monthly · net 15 days' });
  return facts.length >= 2 ? facts : [];
}

function stripTierBlocks(text: string): string {
  if (!text) return '';
  const cleaned = text.replace(
    /OPTION\s+[AB][\s\S]*?(?=\n\s*(?:Reversion|Either tier|$))/gi,
    ''
  );
  return cleaned.trim();
}
