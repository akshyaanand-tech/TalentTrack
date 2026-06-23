import { Link } from 'react-router-dom';
import { cn } from '@/utils/helpers';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { icon: 'h-7 w-7', text: 'text-lg' },
  md: { icon: 'h-8 w-8', text: 'text-xl' },
  lg: { icon: 'h-10 w-10', text: 'text-2xl' },
};

export function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  return (
    <Link to="/" className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-lg bg-primary font-display font-bold text-white',
          sizeMap[size].icon,
        )}
      >
        T
      </div>
      {showText && (
        <span
          className={cn(
            'font-display font-semibold tracking-tight text-slate-900 dark:text-white',
            sizeMap[size].text,
          )}
        >
          TalentTrack
        </span>
      )}
    </Link>
  );
}
