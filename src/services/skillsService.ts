import { callGeminiJson } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { logActivity } from '@/services/dashboardService';
import type { LearningPath, RoadmapItem, Skill } from '@/types';
import { generateId } from '@/utils/resumeDefaults';

function mapSkill(row: Record<string, unknown>): Skill {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    name: row.name as string,
    category: row.category as string,
    proficiency: row.proficiency as number,
    is_target: row.is_target as boolean,
    created_at: row.created_at as string,
  };
}

function mapLearningPath(row: Record<string, unknown>): LearningPath {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    target_career: row.target_career as string,
    current_skills: (row.current_skills as string[]) || [],
    recommended_skills: (row.recommended_skills as string[]) || [],
    roadmap: (row.roadmap as RoadmapItem[]) || [],
    progress: row.progress as number,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export interface SkillGapResult {
  recommended_skills: string[];
  roadmap: Array<{
    skill: string;
    priority: 'high' | 'medium' | 'low';
    resources: string[];
  }>;
  improvement_suggestions: string[];
}

export async function analyzeSkillGap(
  currentSkills: string[],
  targetCareer: string,
): Promise<SkillGapResult> {
  const prompt = `Analyze the skill gap for someone targeting the career role "${targetCareer}".

Current skills: ${currentSkills.join(', ')}

Return JSON with:
- recommended_skills: array of skills they should learn
- roadmap: array of objects with skill, priority (high/medium/low), and resources (array of learning resource names/URLs)
- improvement_suggestions: array of actionable suggestions

Return only valid JSON.`;

  return callGeminiJson<SkillGapResult>(prompt);
}

export async function fetchSkills(userId: string): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapSkill(row as Record<string, unknown>));
}

export async function upsertSkill(
  userId: string,
  skill: { id?: string; name: string; category: string; proficiency: number; is_target: boolean },
): Promise<Skill> {
  if (skill.id) {
    const { error } = await supabase
      .from('skills')
      .update({ name: skill.name, category: skill.category, proficiency: skill.proficiency, is_target: skill.is_target } as never)
      .eq('id', skill.id);
    if (error) throw new Error(error.message);
    const skills = await fetchSkills(userId);
    return skills.find((s) => s.id === skill.id)!;
  }

  const { data, error } = await supabase
    .from('skills')
    .insert([{ user_id: userId, ...skill }] as never)
    .select()
    .single();

  if (error || !data) throw new Error(error?.message || 'Failed to save skill');
  return mapSkill(data as Record<string, unknown>);
}

export async function deleteSkill(id: string): Promise<void> {
  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function fetchLearningPaths(userId: string): Promise<LearningPath[]> {
  const { data, error } = await supabase
    .from('learning_paths')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapLearningPath(row as Record<string, unknown>));
}

export async function saveLearningPath(
  userId: string,
  data: {
    target_career: string;
    current_skills: string[];
    recommended_skills: string[];
    roadmap: RoadmapItem[];
  },
): Promise<LearningPath> {
  const progress = data.roadmap.length > 0
    ? Math.round((data.roadmap.filter((r) => r.completed).length / data.roadmap.length) * 100)
    : 0;

  const { data: row, error } = await supabase
    .from('learning_paths')
    .insert([
      {
        user_id: userId,
        target_career: data.target_career,
        current_skills: data.current_skills,
        recommended_skills: data.recommended_skills,
        roadmap: data.roadmap.map((r) => ({ ...r, id: r.id || generateId() })),
        progress,
      },
    ] as never)
    .select()
    .single();

  if (error || !row) throw new Error(error?.message || 'Failed to save learning path');
  await logActivity(userId, 'skill_analysis', `Skill gap analysis for ${data.target_career}`);
  return mapLearningPath(row as Record<string, unknown>);
}

export async function updateRoadmapProgress(
  pathId: string,
  roadmap: RoadmapItem[],
): Promise<void> {
  const progress = roadmap.length > 0
    ? Math.round((roadmap.filter((r) => r.completed).length / roadmap.length) * 100)
    : 0;

  const { error } = await supabase
    .from('learning_paths')
    .update({ roadmap, progress } as never)
    .eq('id', pathId);

  if (error) throw new Error(error.message);
}

export async function deleteLearningPath(id: string): Promise<void> {
  const { error } = await supabase.from('learning_paths').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
