import { supabase } from '@/lib/supabase';
import { logActivity } from '@/services/dashboardService';
import type { ExperienceEntry, Portfolio, PortfolioProject, PortfolioTheme } from '@/types';

function mapPortfolio(row: Record<string, unknown>): Portfolio {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    title: row.title as string,
    bio: row.bio as string,
    theme: row.theme as PortfolioTheme,
    skills: (row.skills as string[]) || [],
    projects: (row.projects as PortfolioProject[]) || [],
    experience: (row.experience as ExperienceEntry[]) || [],
    github_url: row.github_url as string | null,
    linkedin_url: row.linkedin_url as string | null,
    is_published: row.is_published as boolean,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function fetchPortfolios(userId: string): Promise<Portfolio[]> {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapPortfolio(row as Record<string, unknown>));
}

export async function fetchPortfolio(id: string): Promise<Portfolio | null> {
  const { data, error } = await supabase.from('portfolios').select('*').eq('id', id).single();
  if (error || !data) return null;
  return mapPortfolio(data as Record<string, unknown>);
}

export async function createPortfolio(
  userId: string,
  data: Partial<Portfolio> & { title: string },
): Promise<Portfolio> {
  const { data: row, error } = await supabase
    .from('portfolios')
    .insert([
      {
        user_id: userId,
        title: data.title,
        bio: data.bio || '',
        theme: data.theme || 'modern',
        skills: data.skills || [],
        projects: data.projects || [],
        experience: data.experience || [],
        github_url: data.github_url || null,
        linkedin_url: data.linkedin_url || null,
        is_published: false,
      },
    ] as never)
    .select()
    .single();

  if (error || !row) throw new Error(error?.message || 'Failed to create portfolio');
  await logActivity(userId, 'portfolio_created', `Created portfolio "${data.title}"`);
  return mapPortfolio(row as Record<string, unknown>);
}

export async function updatePortfolio(
  id: string,
  updates: Partial<Omit<Portfolio, 'id' | 'user_id' | 'created_at' | 'updated_at'>>,
): Promise<void> {
  const { error } = await supabase.from('portfolios').update(updates as never).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deletePortfolio(userId: string, id: string): Promise<void> {
  const { error } = await supabase.from('portfolios').delete().eq('id', id);
  if (error) throw new Error(error.message);
  await logActivity(userId, 'portfolio_deleted', 'Deleted a portfolio');
}
