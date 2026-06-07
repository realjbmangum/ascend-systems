import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import ProposalDocument from '../components/ProposalDocument';

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
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [signedJustNow, setSignedJustNow] = useState<{
    name: string;
    at: string;
  } | null>(null);

  const handleTierChange = useCallback((t: string | null) => {
    setSelectedTier(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api
      .getProposalByToken(token)
      .then((data) => setProposal(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSign = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const name = signerName.trim();
    const title = signerTitle.trim();
    const email = signerEmail.trim();
    if (!name) return setError('Please type your full name to sign.');
    if (!EMAIL_RE.test(email)) return setError('Please enter a valid email address.');
    if (!msaAccepted)
      return setError(
        'Please confirm you have read and agree to the Master Services Agreement.'
      );

    setSubmitting(true);
    setError('');
    try {
      const result = await api.signProposal(token, {
        signer_name: name,
        signer_title: title,
        signer_email: email,
        msa_accepted: true,
        selected_tier: selectedTier,
      });
      setSignedJustNow({ name, at: result.signed_at });
      setProposal((prev: any) => ({
        ...prev,
        status: 'accepted',
        signed_at: result.signed_at,
        signer_name: name,
        signer_title: title,
        selected_tier: selectedTier,
      }));
      // Scroll the success state into view smoothly.
      setTimeout(() => {
        document.getElementById('sign-block')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    } catch (e: any) {
      setError(e?.message || 'Could not sign the agreement.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !proposal) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center px-4 text-white">
        <div className="bg-charcoal-light rounded-2xl border border-charcoal-lighter p-10 max-w-md text-center">
          <p className="font-mono text-[11px] text-orange uppercase tracking-[0.22em] mb-3">
            404
          </p>
          <h1 className="text-2xl font-bold mb-2 tracking-tight">
            Agreement not found
          </h1>
          <p className="text-sm text-white/60">
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

  return (
    <div className="min-h-screen bg-surface">
      {/* Slim top bar with print button (hidden in print) */}
      <div className="bg-charcoal-900 border-b border-charcoal-lighter print:hidden">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between text-xs">
          <span className="font-mono text-white/40 uppercase tracking-[0.18em]">
            Statement of Work · Suite Manager
          </span>
          <button
            onClick={() => window.print()}
            className="font-semibold px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>

      <main>
        <ProposalDocument
          proposal={proposal}
          onSelectedTierChange={handleTierChange}
        />

        {/* Sign / accepted block */}
        <section
          id="sign-block"
          className="bg-charcoal text-white print:hidden"
        >
          <div className="max-w-3xl mx-auto px-8 sm:px-12 py-14 sm:py-20">
            {accepted ? (
              <AcceptedBlock
                name={acceptedName}
                at={acceptedAt}
                msaVersion={msaVersion}
              />
            ) : (
              <form onSubmit={handleSign} className="space-y-6">
                <div>
                  <p className="font-mono text-[11px] text-orange uppercase tracking-[0.22em] mb-3">
                    Accept &amp; Sign
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                    Make it official
                  </h2>
                  <p className="text-base text-white/60 max-w-xl leading-relaxed">
                    Filling in the fields below forms a binding agreement
                    between your organization and Ascend Systems
                    (Lighthouse&nbsp;27&nbsp;LLC).
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="Full name"
                    id="signer_name"
                    value={signerName}
                    onChange={setSignerName}
                    placeholder="Type your full name"
                    autoComplete="name"
                  />
                  <Field
                    label="Title"
                    id="signer_title"
                    value={signerTitle}
                    onChange={setSignerTitle}
                    placeholder="e.g. Owner, Director"
                    optional
                    autoComplete="organization-title"
                  />
                </div>
                <Field
                  label="Email"
                  id="signer_email"
                  type="email"
                  value={signerEmail}
                  onChange={setSignerEmail}
                  placeholder="you@company.com"
                  autoComplete="email"
                />

                <label className="flex items-start gap-3 text-sm text-white/80 cursor-pointer pt-1">
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
                      className="text-orange hover:text-orange-light font-medium underline underline-offset-2"
                    >
                      Master Services Agreement
                    </a>{' '}
                    (v{msaVersion}).
                  </span>
                </label>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange hover:bg-orange-light disabled:opacity-50 text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg shadow-orange/20"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing…
                      </>
                    ) : (
                      <>
                        Accept &amp; Sign
                        <span aria-hidden="true">→</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-white/40 font-mono tracking-wide pt-2">
                  Your name, title, email, time of signing, and IP address are
                  recorded as your electronic signature.
                </p>
              </form>
            )}
          </div>
        </section>

        {/* Footer brand strip */}
        <footer className="bg-charcoal-900 text-white/40">
          <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between text-xs">
            <div className="font-mono uppercase tracking-[0.18em]">
              Ascend Systems · Lighthouse 27 LLC
            </div>
            <div className="font-mono tabular-nums">
              © {new Date().getFullYear()}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  optional,
  autoComplete,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  optional?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-mono text-[11px] text-white/50 uppercase tracking-[0.18em] mb-2"
      >
        {label}
        {optional && (
          <span className="text-white/30 normal-case tracking-normal font-sans">
            {' '}
            (optional)
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full bg-charcoal-light border border-charcoal-lighter rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/30 transition-colors"
      />
    </div>
  );
}

function AcceptedBlock({
  name,
  at,
  msaVersion,
}: {
  name?: string | null;
  at?: string | null;
  msaVersion: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-400/40 flex items-center justify-center text-green-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-4 h-4">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="font-mono text-[11px] text-green-400 uppercase tracking-[0.22em]">
          Agreement Accepted
        </p>
      </div>
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
        Thank you{name ? `, ${name}` : ''}.
      </h2>
      <p className="text-base text-white/60 leading-relaxed mb-4">
        This Statement of Work and the Master Services Agreement (v{msaVersion})
        are now in effect. We&rsquo;ll follow up with next steps shortly.
      </p>
      {at && (
        <p className="font-mono text-xs text-white/40 tracking-wide">
          Signed {new Date(at).toLocaleString()}
        </p>
      )}
    </div>
  );
}
