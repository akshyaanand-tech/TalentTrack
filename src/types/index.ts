export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  headline: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  skills: string[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  role: UserRole;
  plan: 'free' | 'student' | 'professional';
  created_at: string;
  updated_at: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  title: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string | null;
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  template: string;
  personal_info: PersonalInfo;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface PersonalInfo {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  linkedin: string;
  github: string;
  website: string;
}

export type ResumeSectionType =
  | 'education'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'certifications'
  | 'achievements'
  | 'languages';

export interface ResumeSection {
  id: string;
  resume_id: string;
  section_type: ResumeSectionType;
  title: string;
  content: Record<string, unknown>;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ATSReport {
  id: string;
  user_id: string;
  resume_id: string | null;
  job_title: string | null;
  company_name: string | null;
  job_description: string;
  ats_score: number;
  missing_keywords: string[];
  skill_match: string[];
  suggestions: string[];
  improvement_areas: string[];
  created_at: string;
}

export interface CoverLetter {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  content: string;
  experience_level: string | null;
  skills_used: string[];
  created_at: string;
  updated_at: string;
}

export type PortfolioTheme = 'modern' | 'professional' | 'minimal';

export interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  bio: string;
  theme: PortfolioTheme;
  skills: string[];
  projects: PortfolioProject[];
  experience: ExperienceEntry[];
  github_url: string | null;
  linkedin_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string | null;
}

export interface Skill {
  id: string;
  user_id: string;
  name: string;
  category: string;
  proficiency: number;
  is_target: boolean;
  created_at: string;
}

export interface LearningPath {
  id: string;
  user_id: string;
  target_career: string;
  current_skills: string[];
  recommended_skills: string[];
  roadmap: RoadmapItem[];
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface RoadmapItem {
  id: string;
  skill: string;
  priority: 'high' | 'medium' | 'low';
  resources: string[];
  completed: boolean;
}

export interface Job {
  id: string;
  user_id: string;
  title: string;
  company: string;
  location: string | null;
  url: string | null;
  description: string | null;
  salary_range: string | null;
  created_at: string;
}

export type ApplicationStatus =
  | 'applied'
  | 'under_review'
  | 'interview'
  | 'rejected'
  | 'accepted';

export interface Application {
  id: string;
  user_id: string;
  job_id: string | null;
  company_name: string;
  job_title: string;
  status: ApplicationStatus;
  applied_date: string;
  notes: string | null;
  resume_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string | null;
  company_name: string;
  job_title: string;
  url: string | null;
  notes: string | null;
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
}

export interface DashboardStats {
  resumeCount: number;
  avgAtsScore: number;
  portfolioCompletion: number;
  skillProgress: number;
  applicationCount: number;
}

export interface AuthFormData {
  email: string;
  password: string;
  fullName?: string;
}
