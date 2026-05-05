import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';

function formatMoney(cents: number) {
  return `$${((cents || 0) / 100).toFixed(2)}`;
}

export default function ProposalSign() {
  const { token } = useParams<{ token: string }>();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [signerName, setSignerName] = useState('');
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
    if (!name) {
      setError('Please type your full name to sign.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const result = await api.signProposal(token, name);
      setSignedJustNow({ name, at: result.signed_at });
      setProposal((prev: any) => ({
        ...prev,
        status: 'accepted',
        signed_at: result.signed_at,
        signer_name: name,
      }));
    } catch (e: any) {
      setError(e?.message || 'Could not sign the proposal.');
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
            Proposal not found
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
            Proposal
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
          <div className="px-8 sm:px-12 py-10 space-y-8">
            {proposal.intro && (
              <Section title="Introduction" body={proposal.intro} />
            )}
            {proposal.scope && (
              <Section title="Scope" body={proposal.scope} />
            )}
            {proposal.deliverables && (
              <Section title="Deliverables" body={proposal.deliverables} />
            )}
            {proposal.timeline && (
              <Section title="Timeline" body={proposal.timeline} />
            )}
            {proposal.price_summary && (
              <Section title="Pricing" body={proposal.price_summary} />
            )}

            {proposal.total_cents > 0 && (
              <div className="border-t border-surface-100 pt-6 flex items-baseline justify-between">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                  Total
                </span>
                <span className="text-3xl font-bold text-charcoal">
                  {formatMoney(proposal.total_cents)}
                </span>
              </div>
            )}
          </div>

          {/* Sign / accepted */}
          <div className="px-8 sm:px-12 py-10 bg-surface/50 border-t border-surface-100">
            {accepted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="text-green-700 text-sm font-semibold uppercase tracking-widest mb-1">
                  Proposal accepted
                </div>
                <p className="text-charcoal font-semibold mt-1">
                  Thank you{acceptedName ? `, ${acceptedName}` : ''}.
                </p>
                {acceptedAt && (
                  <p className="text-sm text-gray-600 mt-1">
                    Signed {new Date(acceptedAt).toLocaleString()}
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSign} className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-charcoal mb-1">
                    Accept and sign
                  </h2>
                  <p className="text-sm text-gray-500">
                    Type your full name below to accept this proposal.
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="signer_name"
                    className="block text-xs font-medium text-gray-500 mb-1.5"
                  >
                    Your Name
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
                  {submitting ? 'Signing...' : 'Accept & Sign Proposal'}
                </button>
              </form>
            )}
          </div>
        </div>

        <footer className="text-center text-xs text-gray-400 mt-8">
          &copy; {new Date().getFullYear()} Ascend Systems
        </footer>
      </main>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
        {title}
      </h2>
      <p className="text-charcoal whitespace-pre-wrap leading-relaxed">{body}</p>
    </div>
  );
}
