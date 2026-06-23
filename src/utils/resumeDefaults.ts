import type { PersonalInfo, ResumeSectionType } from '@/types';

export const EMPTY_PERSONAL_INFO: PersonalInfo = {
  full_name: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
  linkedin: '',
  github: '',
  website: '',
};

export const RESUME_TEMPLATES = [
  { id: 'modern', name: 'Modern', description: 'Clean layout with accent header' },
  { id: 'professional', name: 'Professional', description: 'Traditional single-column format' },
  { id: 'minimal', name: 'Minimal', description: 'Simple typography-focused design' },
] as const;

export const SECTION_LABELS: Record<ResumeSectionType, string> = {
  education: 'Education',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
  certifications: 'Certifications',
  achievements: 'Achievements',
  languages: 'Languages',
};

export const DEFAULT_SECTION_CONTENT: Record<ResumeSectionType, Record<string, unknown>> = {
  education: { items: [] },
  experience: { items: [] },
  projects: { items: [] },
  skills: { items: [] },
  certifications: { items: [] },
  achievements: { items: [] },
  languages: { items: [] },
};

export function generateId(): string {
  return crypto.randomUUID();
}
