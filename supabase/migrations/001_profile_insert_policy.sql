-- Run this in Supabase SQL Editor if profile page was empty for existing users
-- Adds missing INSERT policy so the app can create a profile row when needed

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Backfill profiles for auth users missing a row
INSERT INTO profiles (id, email, full_name)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', '')
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
