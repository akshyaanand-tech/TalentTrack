import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { ReactNode } from 'react';

interface GuestRouteProps {
  children: ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-surface">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
