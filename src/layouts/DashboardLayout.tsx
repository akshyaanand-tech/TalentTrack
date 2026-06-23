import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ScanSearch,
  Mail,
  Layout,
  Target,
  Briefcase,
  User,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { cn, getInitials } from '@/utils/helpers';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Resume', href: '/dashboard/resume', icon: FileText },
  { label: 'ATS Analyzer', href: '/dashboard/ats', icon: ScanSearch },
  { label: 'Cover Letter', href: '/dashboard/cover-letter', icon: Mail },
  { label: 'Portfolio', href: '/dashboard/portfolio', icon: Layout },
  { label: 'Skills', href: '/dashboard/skills', icon: Target },
  { label: 'Job Tracker', href: '/dashboard/jobs', icon: Briefcase },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
];

export function DashboardLayout() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  const displayName = profile?.full_name || profile?.email || 'User';

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-surface">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-surface-card lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          <Logo size="sm" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? location.pathname === '/dashboard'
                : location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}

          {profile?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                location.pathname.startsWith('/admin')
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
              )}
            >
              <Shield className="h-5 w-5 shrink-0" />
              Admin
            </Link>
          )}
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                getInitials(displayName)
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                {displayName}
              </p>
              <p className="truncate text-xs text-slate-500 capitalize">{profile?.plan || 'free'} plan</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="mt-3 w-full justify-start text-slate-600 dark:text-slate-400"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-surface/90 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <ThemeToggle />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
