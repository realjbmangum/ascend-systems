/**
 * ProposalDocument — the badass branded document body used on BOTH
 *   - /admin/proposals/:id (admin preview, with edit controls layered above)
 *   - /proposals/:token    (public sign page, with sign form layered below)
 *
 * Same content rendering on both surfaces, so the admin always sees
 * exactly what the client will see. Brand: Ascend Systems — charcoal +
 * burnt orange, Inter display, JetBrains Mono for eyebrows/data.
 */

import RichText from './RichText';

interface ProposalLike {
  id: number;
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
}

const PRICING_LABELS: Record<string, string> = {
  time_materials: 'Time & Materials',
  fixed: 'Fixed Fee',
  retainer: 'Monthly Retainer',
};

function formatMoney(cents: number) {
  const n = (cents || 0) / 100;
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function formatDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function BrandMark({ className = 'w-6 h-6' }: { className?: string }) {
  // Ascending chevron — the geometric mark from the brand kit.
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3 L22 19 H15.5 L12 13 L8.5 19 H2 L12 3 Z" />
    </svg>
  );
}

export default function ProposalDocument({
  proposal,
}: {
  proposal: ProposalLike;
}) {
  const contentSections = (
    [
      ['Introduction', proposal.intro],
      ['Scope of Work', proposal.scope],
      ['Deliverables', proposal.deliverables],
      ['Out of Scope', proposal.out_of_scope],
      ['Timeline', proposal.timeline],
      ['Client Responsibilities', proposal.client_responsibilities],
      ['Acceptance Criteria', proposal.acceptance_criteria],
    ] as [string, string | null | undefined][]
  ).filter(([, body]) => body && String(body).trim()) as [string, string][];

  const hasInvestment =
    !!proposal.pricing_model ||
    !!proposal.price_summary ||
    !!proposal.payment_schedule ||
    (proposal.total_cents ?? 0) > 0;

  const msaVersion = proposal.msa_version || '2026-05';

  return (
    <article className="bg-surface print:bg-white">
      {/* ───────────────────────────────────────────── Cover ── */}
      <section className="relative bg-charcoal text-white overflow-hidden print:bg-white print:text-charcoal print:border-b print:border-surface-200">
        {/* Subtle orange ambient glow in top-right (web only) */}
        <div
          className="absolute top-0 right-0 w-[420px] h-[420px] -translate-y-1/2 translate-x-1/4 bg-orange/15 rounded-full blur-3xl pointer-events-none print:hidden"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-px h-12 bg-orange print:hidden"
          aria-hidden="true"
        />

        <div className="relative max-w-3xl mx-auto px-8 sm:px-12 py-14 sm:py-20">
          {/* Brand row */}
          <div className="flex items-center gap-3 mb-12 sm:mb-16">
            <BrandMark className="w-5 h-5 text-orange" />
            <span className="text-sm font-bold tracking-tight text-white print:text-charcoal">
              ASCEND&nbsp;SYSTEMS
            </span>
            <span className="ml-auto font-mono text-[11px] text-white/40 uppercase tracking-[0.18em] print:text-gray-500">
              MSA v{msaVersion}
            </span>
          </div>

          {/* Eyebrow */}
          <p className="font-mono text-[11px] text-orange uppercase tracking-[0.22em] mb-4 print:text-orange-dark">
            Statement of Work&nbsp;&nbsp;·&nbsp;&nbsp;#
            {String(proposal.id).padStart(4, '0')}
          </p>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.05] tracking-tight mb-8 print:text-charcoal">
            {proposal.title}
          </h1>

          {/* Meta block */}
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3 text-sm">
            {proposal.client_name && (
              <div>
                <div className="font-mono text-[10px] text-white/40 uppercase tracking-[0.18em] mb-1 print:text-gray-500">
                  Prepared for
                </div>
                <div className="text-base font-semibold text-white print:text-charcoal">
                  {proposal.client_name}
                </div>
              </div>
            )}
            {proposal.project_name && (
              <div>
                <div className="font-mono text-[10px] text-white/40 uppercase tracking-[0.18em] mb-1 print:text-gray-500">
                  Project
                </div>
                <div className="text-base font-semibold text-white print:text-charcoal">
                  {proposal.project_name}
                </div>
              </div>
            )}
            {proposal.created_at && (
              <div>
                <div className="font-mono text-[10px] text-white/40 uppercase tracking-[0.18em] mb-1 print:text-gray-500">
                  Issued
                </div>
                <div className="text-base font-semibold text-white print:text-charcoal">
                  {formatDate(proposal.created_at)}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────── Body ── */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-8 sm:px-12 py-16 space-y-16 print:py-10 print:space-y-12">
          {contentSections.length === 0 && !hasInvestment && (
            <p className="text-sm text-gray-400">
              This Statement of Work has no content yet.
            </p>
          )}

          {contentSections.map(([title, body], i) => (
            <DocSection key={title} index={i + 1} title={title} body={body} />
          ))}

          {hasInvestment && (
            <InvestmentBlock
              index={contentSections.length + 1}
              pricingModel={proposal.pricing_model || undefined}
              priceSummary={proposal.price_summary || undefined}
              paymentSchedule={proposal.payment_schedule || undefined}
              totalCents={proposal.total_cents ?? 0}
            />
          )}
        </div>
      </section>

      {/* ──────────────────────────────────────── Governing band ── */}
      <section className="bg-orange-glow border-y border-orange/20 print:bg-white print:border-surface-200">
        <div className="max-w-3xl mx-auto px-8 sm:px-12 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-y-3 gap-x-8">
            <div className="font-mono text-[11px] text-orange-dark uppercase tracking-[0.22em] pt-1">
              Governing
              <br />
              Agreement
            </div>
            <div>
              <p className="text-sm text-charcoal leading-relaxed">
                This Statement of Work is governed by the{' '}
                <strong className="font-semibold">
                  Ascend Systems Master Services Agreement (v{msaVersion})
                </strong>
                . The MSA sets the legal terms — intellectual property,
                confidentiality, liability, and termination. Signing this
                Statement of Work also accepts the MSA.
              </p>
              <a
                href="https://ascendsystems.ai/msa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-orange-dark hover:text-orange transition-colors"
              >
                Read the Master Services Agreement
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

/* ─────────────────────────────────────────── helpers ── */

function DocSection({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: string;
}) {
  return (
    <section className="grid grid-cols-[42px_1fr] sm:grid-cols-[72px_1fr] gap-x-5 sm:gap-x-8">
      <div>
        <div className="font-mono text-xs font-medium text-orange-dark tracking-wide tabular-nums pt-1">
          {String(index).padStart(2, '0')}
        </div>
        <div className="h-px w-8 bg-orange/40 mt-3" aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-charcoal mb-4 tracking-tight">
          {title}
        </h2>
        <div className="text-charcoal leading-relaxed">
          <RichText text={body} />
        </div>
      </div>
    </section>
  );
}

function InvestmentBlock({
  index,
  pricingModel,
  priceSummary,
  paymentSchedule,
  totalCents,
}: {
  index: number;
  pricingModel?: string;
  priceSummary?: string;
  paymentSchedule?: string;
  totalCents: number;
}) {
  const modelLabel = pricingModel ? PRICING_LABELS[pricingModel] || pricingModel : null;
  const isRetainer = pricingModel === 'retainer';
  const showTotal = totalCents > 0;

  return (
    <section className="grid grid-cols-[42px_1fr] sm:grid-cols-[72px_1fr] gap-x-5 sm:gap-x-8">
      <div>
        <div className="font-mono text-xs font-medium text-orange-dark tracking-wide tabular-nums pt-1">
          {String(index).padStart(2, '0')}
        </div>
        <div className="h-px w-8 bg-orange/40 mt-3" aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-charcoal mb-5 tracking-tight">
          Investment
        </h2>

        {/* Headline card */}
        {showTotal && (
          <div className="relative rounded-2xl bg-charcoal text-white overflow-hidden mb-6 print:bg-surface print:text-charcoal print:border print:border-surface-200">
            <div
              className="absolute inset-0 bg-gradient-to-br from-orange/12 via-transparent to-transparent pointer-events-none print:hidden"
              aria-hidden="true"
            />
            <div
              className="absolute top-0 right-0 w-64 h-64 -translate-y-1/2 translate-x-1/4 bg-orange/10 rounded-full blur-3xl pointer-events-none print:hidden"
              aria-hidden="true"
            />
            <div className="relative px-7 py-7 sm:px-9 sm:py-9">
              <p className="font-mono text-[11px] text-orange uppercase tracking-[0.22em] mb-4 print:text-orange-dark">
                {modelLabel || 'Total Investment'}
              </p>
              <div className="flex items-baseline gap-3 flex-wrap">
                <p className="text-5xl sm:text-6xl font-extrabold tracking-tight tabular-nums">
                  {formatMoney(totalCents)}
                </p>
                {isRetainer && (
                  <span className="font-mono text-sm text-white/50 print:text-gray-500 tracking-wide">
                    /&nbsp;month
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* If no total but we have a pricing model only */}
        {!showTotal && modelLabel && (
          <div className="mb-6">
            <h3 className="font-mono text-[11px] text-charcoal uppercase tracking-[0.22em] font-semibold mb-2">
              Pricing model
            </h3>
            <p className="text-charcoal font-medium">{modelLabel}</p>
          </div>
        )}

        {/* Pricing detail */}
        {priceSummary && (
          <div className="mb-6 last:mb-0">
            <h3 className="font-mono text-[11px] text-charcoal uppercase tracking-[0.22em] font-semibold mb-3">
              Pricing details
            </h3>
            <div className="text-charcoal leading-relaxed">
              <RichText text={priceSummary} />
            </div>
          </div>
        )}

        {/* Payment schedule */}
        {paymentSchedule && (
          <div>
            <h3 className="font-mono text-[11px] text-charcoal uppercase tracking-[0.22em] font-semibold mb-3">
              Payment schedule
            </h3>
            <div className="text-charcoal leading-relaxed">
              <RichText text={paymentSchedule} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
