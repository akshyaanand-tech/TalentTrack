import { supabase } from '@/lib/supabase';
import type { DashboardStats, UserActivity } from '@/types';

interface ATSRow {
  ats_score: number;
}

interface PortfolioRow {
  title: string;
  bio: string;
  skills: string[];
  projects: unknown[];
}

interface LearningPathRow {
  progress: number;
}

export async function fetchDashboardStats(userId: string): Promise<DashboardStats> {
  const [resumes, atsReports, portfolios, learningPaths, applications] =
    await Promise.all([
      supabase.from('resumes').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('ats_reports').select('ats_score').eq('user_id', userId),
      supabase.from('portfolios').select('id, title, bio, skills, projects').eq('user_id', userId),
      supabase.from('learning_paths').select('progress').eq('user_id', userId),
      supabase
        .from('applications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId),
    ]);

  const resumeCount = resumes.count ?? 0;
  const applicationCount = applications.count ?? 0;

  const atsData = (atsReports.data ?? []) as ATSRow[];
  const scores = atsData.map((r) => r.ats_score);
  const avgAtsScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  const portfolio = (portfolios.data?.[0] ?? null) as PortfolioRow | null;
  let portfolioCompletion = 0;
  if (portfolio) {
    const fields = [
      portfolio.title,
      portfolio.bio,
      portfolio.skills?.length,
      portfolio.projects?.length,
    ];
    portfolioCompletion = Math.round(
      (fields.filter(Boolean).length / fields.length) * 100,
    );
  }

  const pathsData = (learningPaths.data ?? []) as LearningPathRow[];
  const skillProgress =
    pathsData.length > 0
      ? Math.round(
          pathsData.reduce((sum, lp) => sum + lp.progress, 0) / pathsData.length,
        )
      : 0;

  return {
    resumeCount,
    avgAtsScore,
    portfolioCompletion,
    skillProgress,
    applicationCount,
  };
}

export async function fetchRecentActivity(
  userId: string,
  limit = 5,
): Promise<UserActivity[]> {
  const { data, error } = await supabase
    .from('user_activity')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch activity:', error.message);
    return [];
  }

  return (data ?? []) as UserActivity[];
}

export async function logActivity(
  userId: string,
  activityType: string,
  description: string,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  await supabase.from('user_activity').insert([
    {
      user_id: userId,
      activity_type: activityType,
      description,
      metadata,
    },
  ] as never);
}
