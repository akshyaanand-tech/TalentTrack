import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await updatePassword(password);
    setLoading(false);

    if (updateError) {
      setError(updateError);
      return;
    }

    navigate('/dashboard');
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
              Set new password
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Choose a strong password for your account.
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

            <div className="space-y-4">
              <Input
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                autoComplete="new-password"
              />
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                autoComplete="new-password"
              />
            </div>

            <Button type="submit" loading={loading} className="mt-6 w-full" size="lg">
              Update Password
            </Button>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              <Link to="/login" className="font-medium text-primary hover:text-primary-700">
                Back to sign in
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
