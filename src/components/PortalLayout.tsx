import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

type Session = {
  email: string;
  role: 'admin' | 'client';
  client_id?: number;
  client_name?: string;
};

const navLinks = [
  { to: '/portal/projects', label: 'Projects' },
  { to: '/portal/invoices', label: 'Invoices' },
];

export default function PortalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await api.me();
        if (cancelled) return;
        if (!me || me.role !== 'client') {
          navigate('/portal/login', { replace: true, state: { from: location.pathname } });
          return;
        }
        setSession(me as Session);
      } catch {
        if (!cancelled) navigate('/portal/login', { replace: true });
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate, location.pathname]);

  async function handleLogout() {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    navigate('/portal/login', { replace: true });
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-gray-500 text-sm">Loading…</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="bg-charcoal text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/portal/projects" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Ascend Systems" className="h-9" />
            <span className="text-sm font-bold text-orange tracking-tight hidden sm:inline">
              CLIENT PORTAL
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-orange'
                      : 'text-gray-300 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden md:inline">
              {session.client_name || session.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-300 hover:text-white border border-charcoal-light hover:border-gray-500 px-3 py-1.5 rounded-md transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet context={{ session }} />
      </main>

      <footer className="bg-charcoal text-gray-500 text-xs text-center py-4">
        &copy; {new Date().getFullYear()} Ascend Systems. All rights reserved.
      </footer>
    </div>
  );
}
