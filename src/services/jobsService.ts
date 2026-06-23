import { supabase } from '@/lib/supabase';
import { logActivity } from '@/services/dashboardService';
import type { Application, ApplicationStatus, SavedJob } from '@/types';

function mapApplication(row: Record<string, unknown>): Application {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    job_id: row.job_id as string | null,
    company_name: row.company_name as string,
    job_title: row.job_title as string,
    status: row.status as ApplicationStatus,
    applied_date: row.applied_date as string,
    notes: row.notes as string | null,
    resume_id: row.resume_id as string | null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function mapSavedJob(row: Record<string, unknown>): SavedJob {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    job_id: row.job_id as string | null,
    company_name: row.company_name as string,
    job_title: row.job_title as string,
    url: row.url as string | null,
    notes: row.notes as string | null,
    created_at: row.created_at as string,
  };
}

export async function fetchApplications(
  userId: string,
  statusFilter?: ApplicationStatus,
): Promise<Application[]> {
  let query = supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .order('applied_date', { ascending: false });

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapApplication(row as Record<string, unknown>));
}

export async function createApplication(
  userId: string,
  data: {
    company_name: string;
    job_title: string;
    status?: ApplicationStatus;
    applied_date?: string;
    notes?: string;
    resume_id?: string;
  },
): Promise<Application> {
  const { data: row, error } = await supabase
    .from('applications')
    .insert([
      {
        user_id: userId,
        company_name: data.company_name,
        job_title: data.job_title,
        status: data.status || 'applied',
        applied_date: data.applied_date || new Date().toISOString().split('T')[0],
        notes: data.notes || null,
        resume_id: data.resume_id || null,
      },
    ] as never)
    .select()
    .single();

  if (error || !row) throw new Error(error?.message || 'Failed to create application');
  await logActivity(userId, 'application_created', `Applied to ${data.company_name} - ${data.job_title}`);
  return mapApplication(row as Record<string, unknown>);
}

export async function updateApplication(
  id: string,
  updates: Partial<Pick<Application, 'company_name' | 'job_title' | 'status' | 'notes' | 'applied_date'>>,
): Promise<void> {
  const { error } = await supabase.from('applications').update(updates as never).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteApplication(userId: string, id: string): Promise<void> {
  const { error } = await supabase.from('applications').delete().eq('id', id);
  if (error) throw new Error(error.message);
  await logActivity(userId, 'application_deleted', 'Deleted a job application');
}

export async function fetchSavedJobs(userId: string): Promise<SavedJob[]> {
  const { data, error } = await supabase
    .from('saved_jobs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapSavedJob(row as Record<string, unknown>));
}

export async function saveJob(
  userId: string,
  data: { company_name: string; job_title: string; url?: string; notes?: string },
): Promise<SavedJob> {
  const { data: row, error } = await supabase
    .from('saved_jobs')
    .insert([{ user_id: userId, ...data }] as never)
    .select()
    .single();

  if (error || !row) throw new Error(error?.message || 'Failed to save job');
  return mapSavedJob(row as Record<string, unknown>);
}

export async function deleteSavedJob(id: string): Promise<void> {
  const { error } = await supabase.from('saved_jobs').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
