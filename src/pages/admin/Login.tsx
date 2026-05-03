import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      await api.requestMagicLink(email);
      setStatus('sent');
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-charcoal">Ascend Admin</h1>
            <p className="text-gray-500 text-sm mt-2">Sign in with your email</p>
          </div>

          {status === 'sent' ? (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
              <p className="text-green-700 font-medium">Magic link sent!</p>
              <p className="text-green-600 text-sm mt-2">
                Check your email for the sign-in link. It expires in 15 minutes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'error' && (
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
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-orange hover:bg-orange-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-orange hover:text-orange-dark transition-colors">
              ← Back to site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
