import { supabase } from '@/lib/supabase';

export interface AdminStats {
  totalUsers: number;
  totalResumes: number;
  totalATSReports: number;
  totalPortfolios: number;
  totalApplications: number;
  userGrowth: Array<{ month: string; count: number }>;
  resumeUsage: Array<{ month: string; count: number }>;
  atsUsage: Array<{ month: string; count: number }>;
}

function groupByMonth(dates: string[]): Array<{ month: string; count: number }> {
  const counts: Record<string, number> = {};
  for (const date of dates) {
    const month = date.slice(0, 7);
    counts[month] = (counts[month] || 0) + 1;
  }
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const [users, resumes, atsReports, portfolios, applications] = await Promise.all([
    supabase.from('profiles').select('created_at'),
    supabase.from('resumes').select('created_at'),
    supabase.from('ats_reports').select('created_at'),
    supabase.from('portfolios').select('created_at'),
    supabase.from('applications').select('created_at'),
  ]);

  const userDates = ((users.data ?? []) as Array<{ created_at: string }>).map((r) => r.created_at);
  const resumeDates = ((resumes.data ?? []) as Array<{ created_at: string }>).map((r) => r.created_at);
  const atsDates = ((atsReports.data ?? []) as Array<{ created_at: string }>).map((r) => r.created_at);

  return {
    totalUsers: users.data?.length ?? 0,
    totalResumes: resumes.data?.length ?? 0,
    totalATSReports: atsReports.data?.length ?? 0,
    totalPortfolios: portfolios.data?.length ?? 0,
    totalApplications: applications.data?.length ?? 0,
    userGrowth: groupByMonth(userDates),
    resumeUsage: groupByMonth(resumeDates),
    atsUsage: groupByMonth(atsDates),
  };
}

export async function logAdminAction(
  adminId: string,
  action: string,
  details: Record<string, unknown> = {},
): Promise<void> {
  await supabase.from('admin_logs').insert([
    { admin_id: adminId, action, details },
  ] as never);
}
