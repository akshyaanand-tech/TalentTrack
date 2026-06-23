import { callGeminiJson } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { logActivity } from '@/services/dashboardService';
import { resumeToPlainText, fetchResumeWithSections } from '@/services/resumeService';
import type { ATSReport } from '@/types';

export interface ATSAnalysisResult {
  ats_score: number;
  missing_keywords: string[];
  skill_match: string[];
  suggestions: string[];
  improvement_areas: string[];
}

function mapReport(row: Record<string, unknown>): ATSReport {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    resume_id: row.resume_id as string | null,
    job_title: row.job_title as string | null,
    company_name: row.company_name as string | null,
    job_description: row.job_description as string,
    ats_score: row.ats_score as number,
    missing_keywords: (row.missing_keywords as string[]) || [],
    skill_match: (row.skill_match as string[]) || [],
    suggestions: (row.suggestions as string[]) || [],
    improvement_areas: (row.improvement_areas as string[]) || [],
    created_at: row.created_at as string,
  };
}

export async function analyzeResumeATS(
  resumeText: string,
  jobDescription: string,
): Promise<ATSAnalysisResult> {
  const prompt = `You are an ATS (Applicant Tracking System) analyzer. Compare the resume against the job description and return a JSON object with exactly these fields:
- ats_score: number 0-100 indicating compatibility
- missing_keywords: array of important keywords from the job description missing in the resume
- skill_match: array of skills that match between resume and job description
- suggestions: array of specific actionable suggestions to improve the resume
- improvement_areas: array of areas needing improvement

Resume:
${resumeText}

Job Description:
${jobDescription}

Return only valid JSON, no markdown.`;

  return callGeminiJson<ATSAnalysisResult>(prompt);
}

export async function saveATSReport(
  userId: string,
  data: {
    resume_id?: string | null;
    job_title?: string;
    company_name?: string;
    job_description: string;
  } & ATSAnalysisResult,
): Promise<ATSReport> {
  const { data: row, error } = await supabase
    .from('ats_reports')
    .insert([
      {
        user_id: userId,
        resume_id: data.resume_id || null,
        job_title: data.job_title || null,
        company_name: data.company_name || null,
        job_description: data.job_description,
        ats_score: data.ats_score,
        missing_keywords: data.missing_keywords,
        skill_match: data.skill_match,
        suggestions: data.suggestions,
        improvement_areas: data.improvement_areas,
      },
    ] as never)
    .select()
    .single();

  if (error || !row) throw new Error(error?.message || 'Failed to save report');

  await logActivity(userId, 'ats_analysis', `ATS score: ${data.ats_score}%`);
  return mapReport(row as Record<string, unknown>);
}

export async function fetchATSReports(userId: string): Promise<ATSReport[]> {
  const { data, error } = await supabase
    .from('ats_reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapReport(row as Record<string, unknown>));
}

export async function getResumeText(resumeId: string): Promise<string> {
  const data = await fetchResumeWithSections(resumeId);
  if (!data) throw new Error('Resume not found');
  return resumeToPlainText(data.resume, data.sections);
}

export async function deleteATSReport(reportId: string): Promise<void> {
  const { error } = await supabase.from('ats_reports').delete().eq('id', reportId);
  if (error) throw new Error(error.message);
}
