import { useEffect, useState } from 'react';
import { Users, FileText, ScanSearch, Layout, Briefcase } from 'lucide-react';
import { fetchAdminStats, type AdminStats } from '@/services/adminService';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

function SimpleBarChart({
  data,
  label,
}: {
  data: Array<{ month: string; count: number }>;
  label: string;
}) {
  const max = Math.max(...data.map((d) => d.count), 1);

  if (data.length === 0) {
    return <p className="text-sm text-slate-500">No data yet.</p>;
  }

  return (
    <div>
      <h3 className="mb-4 text-sm font-medium text-slate-900 dark:text-white">{label}</h3>
      <div className="flex items-end gap-2" style={{ height: 120 }}>
        {data.map((item) => (
          <div key={item.month} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.count}</span>
            <div
              className="w-full rounded-t bg-primary/80 transition-all"
              style={{ height: `${(item.count / max) * 100}%`, minHeight: item.count > 0 ? 4 : 0 }}
            />
            <span className="text-[10px] text-slate-500">{item.month.slice(5)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: number;
}) {
  return (
    <Card padding="sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      </div>
    </Card>
  );
}

export function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !stats) {
    return <p className="text-red-500">{error || 'Failed to load admin data'}</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Platform overview and usage statistics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} />
        <StatCard icon={FileText} label="Total Resumes" value={stats.totalResumes} />
        <StatCard icon={ScanSearch} label="ATS Reports" value={stats.totalATSReports} />
        <StatCard icon={Layout} label="Portfolios" value={stats.totalPortfolios} />
        <StatCard icon={Briefcase} label="Applications" value={stats.totalApplications} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <SimpleBarChart data={stats.userGrowth} label="User Growth" />
        </Card>
        <Card>
          <SimpleBarChart data={stats.resumeUsage} label="Resume Usage" />
        </Card>
        <Card>
          <SimpleBarChart data={stats.atsUsage} label="ATS Usage" />
        </Card>
      </div>
    </div>
  );
}
