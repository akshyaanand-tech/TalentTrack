export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function calculateCompletion(fields: (unknown)[]): number {
  const filled = fields.filter(
    (field) => field !== null && field !== undefined && field !== '',
  ).length;
  return Math.round((filled / fields.length) * 100);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    under_review: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    interview: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    accepted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  };
  return colors[status] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    applied: 'Applied',
    under_review: 'Under Review',
    interview: 'Interview',
    rejected: 'Rejected',
    accepted: 'Accepted',
  };
  return labels[status] || status;
}
