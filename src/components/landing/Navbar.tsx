import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-surface/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300 dark:hover:text-primary-400"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-surface md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
