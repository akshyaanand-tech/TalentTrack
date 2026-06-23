-- TalentTrack Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  headline TEXT,
  bio TEXT,
  phone TEXT,
  location TEXT,
  website TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  skills TEXT[] DEFAULT '{}',
  education JSONB DEFAULT '[]',
  experience JSONB DEFAULT '[]',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'student', 'professional')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RESUMES
-- ============================================================
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  template TEXT DEFAULT 'modern',
  personal_info JSONB DEFAULT '{}',
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE resume_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL CHECK (section_type IN (
    'education', 'experience', 'projects', 'skills',
    'certifications', 'achievements', 'languages'
  )),
  title TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ATS REPORTS
-- ============================================================
CREATE TABLE ats_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
  job_title TEXT,
  company_name TEXT,
  job_description TEXT NOT NULL,
  ats_score INTEGER NOT NULL CHECK (ats_score >= 0 AND ats_score <= 100),
  missing_keywords TEXT[] DEFAULT '{}',
  skill_match TEXT[] DEFAULT '{}',
  suggestions TEXT[] DEFAULT '{}',
  improvement_areas TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COVER LETTERS
-- ============================================================
CREATE TABLE cover_letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  content TEXT NOT NULL,
  experience_level TEXT,
  skills_used TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PORTFOLIOS
-- ============================================================
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  bio TEXT DEFAULT '',
  theme TEXT DEFAULT 'modern' CHECK (theme IN ('modern', 'professional', 'minimal')),
  skills TEXT[] DEFAULT '{}',
  projects JSONB DEFAULT '[]',
  experience JSONB DEFAULT '[]',
  github_url TEXT,
  linkedin_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SKILLS & LEARNING PATHS
-- ============================================================
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  proficiency INTEGER DEFAULT 0 CHECK (proficiency >= 0 AND proficiency <= 100),
  is_target BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_career TEXT NOT NULL,
  current_skills TEXT[] DEFAULT '{}',
  recommended_skills TEXT[] DEFAULT '{}',
  roadmap JSONB DEFAULT '[]',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- JOBS & APPLICATIONS
-- ============================================================
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  url TEXT,
  description TEXT,
  salary_range TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  status TEXT DEFAULT 'applied' CHECK (status IN (
    'applied', 'under_review', 'interview', 'rejected', 'accepted'
  )),
  applied_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE saved_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ACTIVITY & ADMIN
-- ============================================================
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resume_sections_resume_id ON resume_sections(resume_id);
CREATE INDEX idx_ats_reports_user_id ON ats_reports(user_id);
CREATE INDEX idx_cover_letters_user_id ON cover_letters(user_id);
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_skills_user_id ON skills(user_id);
CREATE INDEX idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER resumes_updated_at BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER resume_sections_updated_at BEFORE UPDATE ON resume_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER cover_letters_updated_at BEFORE UPDATE ON cover_letters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER portfolios_updated_at BEFORE UPDATE ON portfolios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER learning_paths_updated_at BEFORE UPDATE ON learning_paths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Resumes
CREATE POLICY "Users manage own resumes" ON resumes FOR ALL USING (auth.uid() = user_id);

-- Resume Sections (via resume ownership)
CREATE POLICY "Users manage own resume sections" ON resume_sections FOR ALL USING (
  EXISTS (SELECT 1 FROM resumes WHERE resumes.id = resume_sections.resume_id AND resumes.user_id = auth.uid())
);

-- ATS Reports
CREATE POLICY "Users manage own ATS reports" ON ats_reports FOR ALL USING (auth.uid() = user_id);

-- Cover Letters
CREATE POLICY "Users manage own cover letters" ON cover_letters FOR ALL USING (auth.uid() = user_id);

-- Portfolios
CREATE POLICY "Users manage own portfolios" ON portfolios FOR ALL USING (auth.uid() = user_id);

-- Skills
CREATE POLICY "Users manage own skills" ON skills FOR ALL USING (auth.uid() = user_id);

-- Learning Paths
CREATE POLICY "Users manage own learning paths" ON learning_paths FOR ALL USING (auth.uid() = user_id);

-- Jobs
CREATE POLICY "Users manage own jobs" ON jobs FOR ALL USING (auth.uid() = user_id);

-- Applications
CREATE POLICY "Users manage own applications" ON applications FOR ALL USING (auth.uid() = user_id);

-- Saved Jobs
CREATE POLICY "Users manage own saved jobs" ON saved_jobs FOR ALL USING (auth.uid() = user_id);

-- User Activity
CREATE POLICY "Users manage own activity" ON user_activity FOR ALL USING (auth.uid() = user_id);

-- Admin Logs
CREATE POLICY "Admins manage admin logs" ON admin_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- STORAGE BUCKET (run separately in Storage settings)
-- ============================================================
-- Create bucket: avatars (public)
-- Create bucket: resumes (private)

INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users upload own avatar" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own avatar" ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users upload own resume files" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users access own resume files" ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
