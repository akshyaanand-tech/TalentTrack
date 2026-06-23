import { cn } from '@/utils/helpers';

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export function ProgressRing({
  value,
  size = 80,
  strokeWidth = 6,
  label,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-all duration-500"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-lg font-semibold text-slate-900 dark:text-white">{value}%</span>
        {label && <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>}
      </div>
    </div>
  );
}
