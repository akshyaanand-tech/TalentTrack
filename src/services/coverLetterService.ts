import { callGemini } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { logActivity } from '@/services/dashboardService';
import type { CoverLetter } from '@/types';

function mapCoverLetter(row: Record<string, unknown>): CoverLetter {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    company_name: row.company_name as string,
    job_title: row.job_title as string,
    content: row.content as string,
    experience_level: row.experience_level as string | null,
    skills_used: (row.skills_used as string[]) || [],
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function generateCoverLetter(input: {
  companyName: string;
  jobTitle: string;
  experience: string;
  skills: string;
  candidateName?: string;
}): Promise<string> {
  const prompt = `Write a professional cover letter for a job application. Use formal but natural language. Do not use overly promotional phrases. Keep it to 3-4 paragraphs.

Company: ${input.companyName}
Job Title: ${input.jobTitle}
Candidate Experience: ${input.experience}
Relevant Skills: ${input.skills}
${input.candidateName ? `Candidate Name: ${input.candidateName}` : ''}

Return only the cover letter text, no subject line or markdown formatting.`;

  return callGemini(prompt);
}

export async function saveCoverLetter(
  userId: string,
  data: {
    company_name: string;
    job_title: string;
    content: string;
    experience_level?: string;
    skills_used?: string[];
  },
): Promise<CoverLetter> {
  const { data: row, error } = await supabase
    .from('cover_letters')
    .insert([{ user_id: userId, ...data }] as never)
    .select()
    .single();

  if (error || !row) throw new Error(error?.message || 'Failed to save cover letter');
  await logActivity(userId, 'cover_letter_created', `Cover letter for ${data.company_name}`);
  return mapCoverLetter(row as Record<string, unknown>);
}

export async function updateCoverLetter(
  id: string,
  updates: Partial<Pick<CoverLetter, 'content' | 'company_name' | 'job_title'>>,
): Promise<void> {
  const { error } = await supabase.from('cover_letters').update(updates as never).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function fetchCoverLetters(userId: string): Promise<CoverLetter[]> {
  const { data, error } = await supabase
    .from('cover_letters')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapCoverLetter(row as Record<string, unknown>));
}

export async function deleteCoverLetter(id: string): Promise<void> {
  const { error } = await supabase.from('cover_letters').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
