# API Documentation

## Overview

TalentTrack has no custom REST API. All data operations go through the Supabase JavaScript client, and AI features call the Gemini API directly.

## Supabase Client

Initialized in `src/lib/supabase.ts`:

```typescript
import { supabase } from '@/lib/supabase';
```

## Authentication API

| Method | Supabase Call | Description |
|--------|--------------|-------------|
| Sign Up | `supabase.auth.signUp()` | Create account with email/password |
| Sign In | `supabase.auth.signInWithPassword()` | Authenticate user |
| Sign Out | `supabase.auth.signOut()` | End session |
| Reset Password | `supabase.auth.resetPasswordForEmail()` | Send reset email |
| Update Password | `supabase.auth.updateUser()` | Set new password |
| Get Session | `supabase.auth.getSession()` | Current session |
| Auth Listener | `supabase.auth.onAuthStateChange()` | Session change events |

## Database Operations

All queries use the Supabase query builder with RLS enforcing access control.

### Profiles

```typescript
// Read own profile
supabase.from('profiles').select('*').eq('id', userId).single()

// Update profile
supabase.from('profiles').update({ full_name, bio }).eq('id', userId)
```

### Resumes

```typescript
// List resumes
supabase.from('resumes').select('*').eq('user_id', userId).order('updated_at', { ascending: false })

// Create resume
supabase.from('resumes').insert({ user_id, title, template, personal_info })

// Delete resume
supabase.from('resumes').delete().eq('id', resumeId)
```

### ATS Reports

```typescript
// Save report
supabase.from('ats_reports').insert({
  user_id, resume_id, job_description, ats_score,
  missing_keywords, skill_match, suggestions, improvement_areas
})

// List reports
supabase.from('ats_reports').select('*').eq('user_id', userId).order('created_at', { ascending: false })
```

### Applications

```typescript
// Create application
supabase.from('applications').insert({
  user_id, company_name, job_title, status, applied_date
})

// Filter by status
supabase.from('applications').select('*').eq('user_id', userId).eq('status', 'interview')
```

### User Activity

```typescript
// Log activity
supabase.from('user_activity').insert({
  user_id, activity_type, description, metadata
})
```

## Storage API

```typescript
// Upload avatar
supabase.storage.from('avatars').upload(`${userId}/avatar.png`, file)

// Get public URL
supabase.storage.from('avatars').getPublicUrl(`${userId}/avatar.png`)
```

## Gemini API

Called via fetch from the client for AI-powered features.

### ATS Analysis

```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
```

Input: Resume text + job description
Output: ATS score, missing keywords, skill matches, suggestions

### Cover Letter Generation

Input: Company name, job title, experience, skills
Output: Professional cover letter text

### Skill Gap Analysis

Input: Current skills, target career
Output: Recommended skills, learning roadmap, improvement suggestions

## Error Handling

All service functions catch Supabase errors and return structured results:

```typescript
const { data, error } = await supabase.from('table').select('*');
if (error) {
  console.error('Operation failed:', error.message);
  return null;
}
```

Components display error states via loading/error flags in custom hooks.

## Environment Variables

| Variable | Used By | Required |
|----------|---------|----------|
| `VITE_SUPABASE_URL` | Supabase client | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase client | Yes |
| `VITE_GEMINI_API_KEY` | AI features | Yes (for AI modules) |
