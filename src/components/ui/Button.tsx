import { cn } from '@/utils/helpers';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-700 focus:ring-primary/30 shadow-sm',
  secondary:
    'bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary/30 shadow-sm',
  outline:
    'border border-slate-300 dark:border-slate-600 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200',
  ghost:
    'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
