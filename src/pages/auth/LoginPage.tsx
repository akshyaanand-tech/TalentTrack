import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { getSupabaseConfigError } from '@/lib/supabase';

export function LoginPage() {
  const { signIn } = useAuth();
  const configError = getSupabaseConfigError();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await signIn(email, password);
    setLoading(false);

    if (signInError) {
      setError(signInError);
      return;
    }

    navigate(from, { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-surface">
      <header className="flex items-center justify-between px-6 py-4">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
              Sign in to TalentTrack
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Access your resumes, applications, and career tools.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-surface-card"
          >
            {configError && (
              <div className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                {configError}
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                required
                autoComplete="email"
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            <div className="mt-2 text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary-700"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} className="mt-6 w-full" size="lg">
              Sign In
            </Button>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-medium text-primary hover:text-primary-700">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
