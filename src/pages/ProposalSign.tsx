import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import RichText from '../components/RichText';

function formatMoney(cents: number) {
  return `$${((cents || 0) / 100).toFixed(2)}`;
}

const PRICING_LABELS: Record<string, string> = {
  time_materials: 'Time & Materials',
  fixed: 'Fixed Fee',
  retainer: 'Monthly Retainer',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProposalSign() {
  const { token } = useParams<{ token: string }>();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [signerTitle, setSignerTitle] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [msaAccepted, setMsaAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [signedJustNow, setSignedJustNow] = useState<{
    name: string;
    at: string;
  } | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api
      .getProposalByToken(token)
      .then((data) => {
        setProposal(data);
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleSign = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const name = signerName.trim();
    const title = signerTitle.trim();
    const email = signerEmail.trim();
    if (!name) {
      setError('Please type your full name to sign.');
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!msaAccepted) {
      setError(
        'Please confirm you have read and agree to the Master Services Agreement.'
      );
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const result = await api.signProposal(token, {
        signer_name: name,
        signer_title: title,
        signer_email: email,
        msa_accepted: true,
      });
      setSignedJustNow({ name, at: result.signed_at });
      setProposal((prev: any) => ({
        ...prev,
        status: 'accepted',
        signed_at: result.signed_at,
        signer_name: name,
        signer_title: title,
      }));
    } catch (e: any) {
      setError(e?.message || 'Could not sign the agreement.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !proposal) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-surface-100 p-10 max-w-md text-center shadow-sm">
          <h1 className="text-xl font-bold text-charcoal mb-2">
            Agreement not found
          </h1>
          <p className="text-sm text-gray-500">
            This link may have expired or is no longer valid. Reach out to your
            contact at Ascend Systems for a new link.
          </p>
        </div>
      </div>
    );
  }

  const accepted = proposal.status === 'accepted' || signedJustNow;
  const acceptedName = signedJustNow?.name || proposal.signer_name;
  const acceptedAt = signedJustNow?.at || proposal.signed_at;
  const msaVersion = proposal.msa_version || '2026-05';

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
    proposal.total_cents > 0;

  return (
    <div className="min-h-screen bg-surface">
      {/* Brand header */}
      <header className="bg-charcoal text-white">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight">
              Ascend Systems
            </span>
          </div>
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            Statement of Work
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-surface-100 shadow-sm overflow-hidden">
          {/* Hero */}
          <div className="px-8 sm:px-12 py-10 border-b border-surface-100">
            {proposal.client_name && (
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                Prepared for {proposal.client_name}
              </p>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
              {proposal.title}
            </h1>
          </div>

          {/* Sections */}
          <div className="px-8 sm:px-12 py-10 space-y-10">
            {contentSections.length === 0 && !hasInvestment && (
              <p className="text-sm text-gray-400">
                This Statement of Work has no content yet.
              </p>
            )}

            {contentSections.map(([title, body], i) => (
              <Section key={title} index={i + 1} title={title} body={body} />
            ))}

            {hasInvestment && (
              <Investment
                index={contentSections.length + 1}
                pricingModel={proposal.pricing_model}
                priceSummary={proposal.price_summary}
                paymentSchedule={proposal.payment_schedule}
                totalCents={proposal.total_cents}
              />
            )}
          </div>

          {/* Governing agreement */}
          <div className="px-8 sm:px-12 py-8 border-t border-surface-100 bg-orange/5">
            <h2 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
              Governing Agreement
            </h2>
            <p className="text-sm text-charcoal leading-relaxed">
              This Statement of Work is governed by the Ascend Systems
              Master Services Agreement (v{msaVersion}). The Master Services
              Agreement sets the legal terms — intellectual property,
              confidentiality, liability, and termination. Signing this
              Statement of Work also accepts that agreement.
            </p>
            <a
              href="https://ascendsystems.ai/msa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm font-semibold text-orange hover:text-orange-dark"
            >
              Read the Master Services Agreement &rarr;
            </a>
          </div>

          {/* Sign / accepted */}
          <div className="px-8 sm:px-12 py-10 bg-surface/50 border-t border-surface-100">
            {accepted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="text-green-700 text-sm font-semibold uppercase tracking-widest mb-1">
                  Agreement accepted
                </div>
                <p className="text-charcoal font-semibold mt-1">
                  Thank you{acceptedName ? `, ${acceptedName}` : ''}.
                </p>
                {acceptedAt && (
                  <p className="text-sm text-gray-600 mt-1">
                    Signed {new Date(acceptedAt).toLocaleString()}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  This Statement of Work and the Master Services Agreement
                  (v{msaVersion}) are now in effect.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSign} className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-charcoal mb-1">
                    Accept and sign
                  </h2>
                  <p className="text-sm text-gray-500">
                    Completing the fields below forms a binding agreement
                    between your organization and Ascend Systems
                    (Lighthouse 27 LLC).
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="signer_name"
                      className="block text-xs font-medium text-gray-500 mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="signer_name"
                      type="text"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      placeholder="Full name"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="signer_title"
                      className="block text-xs font-medium text-gray-500 mb-1.5"
                    >
                      Title <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      id="signer_title"
                      type="text"
                      value={signerTitle}
                      onChange={(e) => setSignerTitle(e.target.value)}
                      placeholder="e.g. Owner, Director"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="signer_email"
                    className="block text-xs font-medium text-gray-500 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="signer_email"
                    type="email"
                    value={signerEmail}
                    onChange={(e) => setSignerEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
                  />
                </div>
                <label className="flex items-start gap-3 text-sm text-charcoal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={msaAccepted}
                    onChange={(e) => setMsaAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-orange shrink-0"
                  />
                  <span>
                    I have read and agree to this Statement of Work and the{' '}
                    <a
                      href="https://ascendsystems.ai/msa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange hover:text-orange-dark font-medium underline"
                    >
                      Master Services Agreement
                    </a>{' '}
                    (v{msaVersion}).
                  </span>
                </label>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-orange hover:bg-orange-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Signing...' : 'Accept & Sign'}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  Your name, title, email, the time of signing, and your IP
                  address are recorded as your electronic signature.
                </p>
              </form>
            )}
          </div>
        </div>

        <footer className="text-center text-xs text-gray-400 mt-8">
          &copy; {new Date().getFullYear()} Ascend Systems &middot; Lighthouse
          27 LLC
        </footer>
      </main>
    </div>
  );
}

function SectionHeading({ index, title }: { index: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-xs font-bold text-orange tabular-nums">
        {String(index).padStart(2, '0')}
      </span>
      <h2 className="text-lg font-bold text-charcoal tracking-tight">
        {title}
      </h2>
      <span className="flex-1 border-t border-surface-100" />
    </div>
  );
}

function Section({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: string;
}) {
  return (
    <section>
      <SectionHeading index={index} title={title} />
      <div className="sm:pl-8">
        <RichText text={body} />
      </div>
    </section>
  );
}

function Investment({
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
  totalCents?: number;
}) {
  const modelLabel = pricingModel
    ? PRICING_LABELS[pricingModel] || pricingModel
    : null;
  const showTotal = (totalCents ?? 0) > 0;

  return (
    <section>
      <SectionHeading index={index} title="Investment" />
      <div className="sm:pl-8">
        <div className="rounded-2xl border border-surface-100 overflow-hidden">
          {showTotal && (
            <div className="flex items-baseline justify-between gap-4 bg-charcoal px-6 py-5">
              <span className="text-xs uppercase tracking-widest text-white/50 font-semibold">
                {modelLabel ? `Total · ${modelLabel}` : 'Total'}
              </span>
              <span className="text-3xl font-bold text-white">
                {formatMoney(totalCents || 0)}
              </span>
            </div>
          )}
          {(priceSummary || paymentSchedule || (!showTotal && modelLabel)) && (
            <div className="px-6 py-6 space-y-6 bg-surface/30">
              {!showTotal && modelLabel && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
                    Pricing Model
                  </h3>
                  <p className="text-charcoal font-medium">{modelLabel}</p>
                </div>
              )}
              {priceSummary && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
                    Pricing
                  </h3>
                  <RichText text={priceSummary} />
                </div>
              )}
              {paymentSchedule && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
                    Payment Schedule
                  </h3>
                  <RichText text={paymentSchedule} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
