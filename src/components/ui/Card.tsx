import { cn } from '@/utils/helpers';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingMap = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className, padding = 'md' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-surface-card',
        paddingMap[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}
