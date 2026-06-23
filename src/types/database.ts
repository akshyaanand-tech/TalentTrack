export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
          education: Json;
          experience: Json;
          role: string;
          plan: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          headline?: string | null;
          bio?: string | null;
          phone?: string | null;
          location?: string | null;
          website?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          skills?: string[];
          education?: Json;
          experience?: Json;
          role?: string;
          plan?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          template: string;
          personal_info: Json;
          is_primary: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          template?: string;
          personal_info?: Json;
          is_primary?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['resumes']['Insert']>;
      };
      resume_sections: {
        Row: {
          id: string;
          resume_id: string;
          section_type: string;
          title: string;
          content: Json;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          resume_id: string;
          section_type: string;
          title: string;
          content?: Json;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['resume_sections']['Insert']>;
      };
      ats_reports: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_id?: string | null;
          job_title?: string | null;
          company_name?: string | null;
          job_description: string;
          ats_score: number;
          missing_keywords?: string[];
          skill_match?: string[];
          suggestions?: string[];
          improvement_areas?: string[];
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['ats_reports']['Insert']>;
      };
      cover_letters: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          job_title: string;
          content: string;
          experience_level: string | null;
          skills_used: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          job_title: string;
          content: string;
          experience_level?: string | null;
          skills_used?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['cover_letters']['Insert']>;
      };
      portfolios: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          bio: string;
          theme: string;
          skills: string[];
          projects: Json;
          experience: Json;
          github_url: string | null;
          linkedin_url: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          bio?: string;
          theme?: string;
          skills?: string[];
          projects?: Json;
          experience?: Json;
          github_url?: string | null;
          linkedin_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['portfolios']['Insert']>;
      };
      skills: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          proficiency: number;
          is_target: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category?: string;
          proficiency?: number;
          is_target?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['skills']['Insert']>;
      };
      learning_paths: {
        Row: {
          id: string;
          user_id: string;
          target_career: string;
          current_skills: string[];
          recommended_skills: string[];
          roadmap: Json;
          progress: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          target_career: string;
          current_skills?: string[];
          recommended_skills?: string[];
          roadmap?: Json;
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['learning_paths']['Insert']>;
      };
      jobs: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          company: string;
          location: string | null;
          url: string | null;
          description: string | null;
          salary_range: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          company: string;
          location?: string | null;
          url?: string | null;
          description?: string | null;
          salary_range?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['jobs']['Insert']>;
      };
      applications: {
        Row: {
          id: string;
          user_id: string;
          job_id: string | null;
          company_name: string;
          job_title: string;
          status: string;
          applied_date: string;
          notes: string | null;
          resume_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_id?: string | null;
          company_name: string;
          job_title: string;
          status?: string;
          applied_date?: string;
          notes?: string | null;
          resume_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['applications']['Insert']>;
      };
      saved_jobs: {
        Row: {
          id: string;
          user_id: string;
          job_id: string | null;
          company_name: string;
          job_title: string;
          url: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_id?: string | null;
          company_name: string;
          job_title: string;
          url?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['saved_jobs']['Insert']>;
      };
      user_activity: {
        Row: {
          id: string;
          user_id: string;
          activity_type: string;
          description: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_type: string;
          description: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['user_activity']['Insert']>;
      };
      admin_logs: {
        Row: {
          id: string;
          admin_id: string;
          action: string;
          details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          action: string;
          details?: Json;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['admin_logs']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
