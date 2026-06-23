import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: resetError } = await resetPassword(email);
    setLoading(false);

    if (resetError) {
      setError(resetError);
      return;
    }

    setSuccess(true);
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
              Reset your password
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-surface-card"
          >
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            {success ? (
              <div className="text-center">
                <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
                  Check your email for a password reset link.
                </div>
                <Link to="/login" className="text-sm font-medium text-primary hover:text-primary-700">
                  Back to sign in
                </Link>
              </div>
            ) : (
              <>
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  required
                  autoComplete="email"
                />

                <Button type="submit" loading={loading} className="mt-6 w-full" size="lg">
                  Send Reset Link
                </Button>

                <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                  <Link to="/login" className="font-medium text-primary hover:text-primary-700">
                    Back to sign in
                  </Link>
                </p>
              </>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
