import { Link } from 'react-router-dom';
import {
  FileText,
  ScanSearch,
  Layout,
  Briefcase,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatRelativeTime } from '@/utils/helpers';

const quickActions = [
  { label: 'Create Resume', href: '/dashboard/resume/new', icon: FileText },
  { label: 'Analyze ATS', href: '/dashboard/ats', icon: ScanSearch },
  { label: 'Build Portfolio', href: '/dashboard/portfolio', icon: Layout },
  { label: 'Track Application', href: '/dashboard/jobs', icon: Briefcase },
];

export function DashboardPage() {
  const { profile } = useAuth();
  const { stats, activities, loading, error } = useDashboardData();

  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Here is an overview of your career development progress.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card padding="sm" className="flex flex-col items-center text-center">
          <ProgressRing value={stats.resumeCount > 0 ? 100 : 0} size={72} label="Resume" />
          <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
            {stats.resumeCount} Resume{stats.resumeCount !== 1 ? 's' : ''}
          </p>
        </Card>

        <Card padding="sm" className="flex flex-col items-center text-center">
          <ProgressRing value={stats.avgAtsScore} size={72} label="ATS" />
          <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">ATS Score</p>
        </Card>

        <Card padding="sm" className="flex flex-col items-center text-center">
          <ProgressRing value={stats.portfolioCompletion} size={72} label="Portfolio" />
          <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">Portfolio</p>
        </Card>

        <Card padding="sm" className="flex flex-col items-center text-center">
          <ProgressRing value={stats.skillProgress} size={72} label="Skills" />
          <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">Skill Progress</p>
        </Card>

        <Card padding="sm" className="flex flex-col items-center text-center sm:col-span-2 lg:col-span-1">
          <div className="flex h-[72px] w-[72px] items-center justify-center">
            <span className="text-3xl font-bold text-primary">{stats.applicationCount}</span>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">Applications</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Quick Actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                to={action.href}
                className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 transition-colors hover:border-primary/30 hover:bg-primary/5 dark:border-slate-700 dark:hover:border-primary/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {action.label}
                </span>
                <ArrowRight className="ml-auto h-4 w-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Activity
            </h2>
          </div>
          {activities.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              No activity yet. Start by creating a resume or analyzing ATS compatibility.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {activities.map((activity) => (
                <li
                  key={activity.id}
                  className="border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800"
                >
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {activity.description}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {formatRelativeTime(activity.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Resume Statistics
          </h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Total resumes</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {stats.resumeCount}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Primary resume</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {stats.resumeCount > 0 ? 'Set' : 'Not set'}
              </span>
            </div>
          </div>
          <Link to="/dashboard/resume" className="mt-4 block">
            <Button variant="outline" size="sm" className="w-full">
              Manage Resumes
            </Button>
          </Link>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            ATS Performance
          </h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Average score</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {stats.avgAtsScore > 0 ? `${stats.avgAtsScore}%` : 'No reports'}
              </span>
            </div>
          </div>
          <Link to="/dashboard/ats" className="mt-4 block">
            <Button variant="outline" size="sm" className="w-full">
              Run Analysis
            </Button>
          </Link>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Recent Applications
          </h3>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            {stats.applicationCount === 0
              ? 'No applications tracked yet.'
              : `${stats.applicationCount} application${stats.applicationCount !== 1 ? 's' : ''} logged.`}
          </p>
          <Link to="/dashboard/jobs" className="mt-4 block">
            <Button variant="outline" size="sm" className="w-full">
              View Applications
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
