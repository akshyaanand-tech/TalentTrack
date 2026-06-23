import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchDashboardStats, fetchRecentActivity } from '@/services/dashboardService';
import type { DashboardStats, UserActivity } from '@/types';

export function useDashboardData() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    resumeCount: 0,
    avgAtsScore: 0,
    portfolioCompletion: 0,
    skillProgress: 0,
    applicationCount: 0,
  });
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [statsData, activityData] = await Promise.all([
          fetchDashboardStats(user!.id),
          fetchRecentActivity(user!.id),
        ]);
        if (!cancelled) {
          setStats(statsData);
          setActivities(activityData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { stats, activities, loading, error };
}
