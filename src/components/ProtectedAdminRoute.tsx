import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../lib/api';

type ProtectedAdminRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    api
      .me()
      .then((user) => {
        setAuthenticated(user?.role === 'admin');
      })
      .catch(() => {
        setAuthenticated(false);
      });
  }, []);

  if (authenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
