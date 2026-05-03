import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';

export default function PortalLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const verifyToken = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error' | 'verifying'>(
    verifyToken ? 'verifying' : 'idle'
  );
  const [error, setError] = useState('');

  useEffect(() => {
    if (!verifyToken) return;
    (async () => {
      try {
        const result = await api.verifyMagicLink(verifyToken);
        if (result.ok) {
          navigate(result.role === 'admin' ? '/admin' : '/portal/projects', { replace: true });
        } else {
          setError('That link is invalid or has expired.');
          setStatus('error');
        }
      } catch (err: any) {
        setError(err.message || 'That link is invalid or has expired.');
        setStatus('error');
      }
    })();
  }, [verifyToken, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setError('');
    try {
      await api.requestMagicLink(email);
      setStatus('sent');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="bg-charcoal text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Ascend Systems" className="h-9" />
            <span className="text-sm font-bold text-orange tracking-tight">CLIENT PORTAL</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {status === 'verifying' ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <h1 className="text-xl font-bold text-charcoal mb-2">Signing you in…</h1>
              <p className="text-gray-500 text-sm">Verifying your link.</p>
            </div>
          ) : status === 'sent' ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <svg
                className="w-12 h-12 text-green-500 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h1 className="text-2xl font-bold text-charcoal mb-2">Check your email</h1>
              <p className="text-gray-500">
                We sent a magic link to <span className="font-medium text-charcoal">{email}</span>.
                It expires in 15 minutes.
              </p>
              <button
                onClick={() => {
                  setStatus('idle');
                  setEmail('');
                }}
                className="mt-6 text-sm text-orange hover:text-orange-dark font-medium"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h1 className="text-2xl font-bold text-charcoal mb-2">Sign in to your portal</h1>
              <p className="text-gray-500 text-sm mb-6">
                Enter your email and we'll send you a secure sign-in link.
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {status === 'error' && error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
                    placeholder="you@company.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-orange hover:bg-orange-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? 'Sending…' : 'Send magic link'}
                </button>
              </form>

              <p className="mt-6 text-xs text-gray-400 text-center">
                No account?{' '}
                <Link to="/contact" className="text-orange hover:text-orange-dark">
                  Contact us
                </Link>{' '}
                to get started.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
