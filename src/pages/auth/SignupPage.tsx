import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { getSupabaseConfigError } from '@/lib/supabase';

export function SignupPage() {
  const { signUp } = useAuth();
  const configError = getSupabaseConfigError();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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
    const { error: signUpError } = await signUp(email, password, fullName);
    setLoading(false);

    if (signUpError) {
      setError(signUpError);
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate('/dashboard'), 2000);
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
              Create your account
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Start building your career profile today.
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

            {success && (
              <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
                Account created successfully. Redirecting to dashboard...
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
                autoComplete="name"
              />
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
              Create Account
            </Button>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary-700">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
