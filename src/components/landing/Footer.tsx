import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ],
  Account: [
    { label: 'Login', href: '/login' },
    { label: 'Sign Up', href: '/signup' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              A career development platform built by final-year engineering students.
              Resume building, ATS analysis, and job tracking in one place.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h4>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('#') ? (
                      <a
                        href={link.href}
                        className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary-400"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary-400"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} TalentTrack. Academic Project — All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
