import { supabase } from '@/lib/supabase';
import { logActivity } from '@/services/dashboardService';
import type { PersonalInfo, Resume, ResumeSection, ResumeSectionType } from '@/types';
import { DEFAULT_SECTION_CONTENT, EMPTY_PERSONAL_INFO } from '@/utils/resumeDefaults';

function mapResume(row: Record<string, unknown>): Resume {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    title: row.title as string,
    template: row.template as string,
    personal_info: (row.personal_info as PersonalInfo) || EMPTY_PERSONAL_INFO,
    is_primary: row.is_primary as boolean,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function mapSection(row: Record<string, unknown>): ResumeSection {
  return {
    id: row.id as string,
    resume_id: row.resume_id as string,
    section_type: row.section_type as ResumeSectionType,
    title: row.title as string,
    content: (row.content as Record<string, unknown>) || {},
    sort_order: row.sort_order as number,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function fetchResumes(userId: string): Promise<Resume[]> {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapResume(row as Record<string, unknown>));
}

export async function fetchResumeWithSections(
  resumeId: string,
): Promise<{ resume: Resume; sections: ResumeSection[] } | null> {
  const [resumeResult, sectionsResult] = await Promise.all([
    supabase.from('resumes').select('*').eq('id', resumeId).single(),
    supabase
      .from('resume_sections')
      .select('*')
      .eq('resume_id', resumeId)
      .order('sort_order', { ascending: true }),
  ]) as [
    { data: Record<string, unknown> | null; error: { message: string } | null },
    { data: Record<string, unknown>[] | null; error: { message: string } | null },
  ];

  if (resumeResult.error || !resumeResult.data) return null;

  const resumeData = resumeResult.data as Record<string, unknown>;
  const sectionsData = (sectionsResult.data ?? []) as Record<string, unknown>[];

  return {
    resume: mapResume(resumeData),
    sections: sectionsData.map((row) => mapSection(row)),
  };
}

export async function createResume(
  userId: string,
  title: string,
  template = 'modern',
  personalInfo: PersonalInfo = EMPTY_PERSONAL_INFO,
): Promise<Resume> {
  const { data, error } = await supabase
    .from('resumes')
    .insert([
      {
        user_id: userId,
        title,
        template,
        personal_info: personalInfo,
        is_primary: false,
      },
    ] as never)
    .select()
    .single();

  if (error || !data) throw new Error(error?.message || 'Failed to create resume');

  const resume = mapResume(data as Record<string, unknown>);

  const defaultSections: ResumeSectionType[] = [
    'experience',
    'education',
    'projects',
    'skills',
  ];

  await supabase.from('resume_sections').insert(
    defaultSections.map((type, index) => ({
      resume_id: resume.id,
      section_type: type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      content: DEFAULT_SECTION_CONTENT[type],
      sort_order: index,
    })) as never,
  );

  await logActivity(userId, 'resume_created', `Created resume "${title}"`);
  return resume;
}

export async function updateResume(
  resumeId: string,
  updates: Partial<Pick<Resume, 'title' | 'template' | 'personal_info' | 'is_primary'>>,
): Promise<void> {
  const { error } = await supabase
    .from('resumes')
    .update(updates as never)
    .eq('id', resumeId);

  if (error) throw new Error(error.message);
}

export async function deleteResume(userId: string, resumeId: string): Promise<void> {
  const { error } = await supabase.from('resumes').delete().eq('id', resumeId);
  if (error) throw new Error(error.message);
  await logActivity(userId, 'resume_deleted', 'Deleted a resume');
}

export async function duplicateResume(userId: string, resumeId: string): Promise<Resume> {
  const existing = await fetchResumeWithSections(resumeId);
  if (!existing) throw new Error('Resume not found');

  const newResume = await createResume(
    userId,
    `${existing.resume.title} (Copy)`,
    existing.resume.template,
    existing.resume.personal_info,
  );

  if (existing.sections.length > 0) {
    await supabase.from('resume_sections').delete().eq('resume_id', newResume.id);

    await supabase.from('resume_sections').insert(
      existing.sections.map((section) => ({
        resume_id: newResume.id,
        section_type: section.section_type,
        title: section.title,
        content: section.content,
        sort_order: section.sort_order,
      })) as never,
    );
  }

  await logActivity(userId, 'resume_duplicated', `Duplicated resume "${existing.resume.title}"`);
  return newResume;
}

export async function updateSection(
  sectionId: string,
  updates: Partial<Pick<ResumeSection, 'title' | 'content' | 'sort_order'>>,
): Promise<void> {
  const { error } = await supabase
    .from('resume_sections')
    .update(updates as never)
    .eq('id', sectionId);

  if (error) throw new Error(error.message);
}

export async function addSection(
  resumeId: string,
  sectionType: ResumeSectionType,
  sortOrder: number,
): Promise<ResumeSection> {
  const { data, error } = await supabase
    .from('resume_sections')
    .insert([
      {
        resume_id: resumeId,
        section_type: sectionType,
        title: sectionType.charAt(0).toUpperCase() + sectionType.slice(1),
        content: DEFAULT_SECTION_CONTENT[sectionType],
        sort_order: sortOrder,
      },
    ] as never)
    .select()
    .single();

  if (error || !data) throw new Error(error?.message || 'Failed to add section');
  return mapSection(data as Record<string, unknown>);
}

export async function deleteSection(sectionId: string): Promise<void> {
  const { error } = await supabase.from('resume_sections').delete().eq('id', sectionId);
  if (error) throw new Error(error.message);
}

export async function setPrimaryResume(userId: string, resumeId: string): Promise<void> {
  await supabase.from('resumes').update({ is_primary: false } as never).eq('user_id', userId);
  await updateResume(resumeId, { is_primary: true });
}

export function resumeToPlainText(resume: Resume, sections: ResumeSection[]): string {
  const info = resume.personal_info;
  let text = `${info.full_name}\n${info.email} | ${info.phone} | ${info.location}\n\n`;
  if (info.summary) text += `SUMMARY\n${info.summary}\n\n`;

  for (const section of sections) {
    text += `${section.title.toUpperCase()}\n`;
    const items = (section.content.items as Array<Record<string, unknown>>) || [];
    for (const item of items) {
      text += Object.values(item)
        .filter((v) => v !== null && v !== undefined && v !== '')
        .join(' | ');
      text += '\n';
    }
    text += '\n';
  }

  return text;
}
