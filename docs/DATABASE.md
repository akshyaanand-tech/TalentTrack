# Database Documentation

## Overview

TalentTrack uses Supabase PostgreSQL with Row Level Security (RLS). Every table enforces that users can only access their own data. Admin users have elevated read access on profiles and admin_logs.

## Entity Relationship Diagram

```
auth.users
    │
    └── profiles (1:1)
            │
            ├── resumes (1:N)
            │       └── resume_sections (1:N)
            │
            ├── ats_reports (1:N) ── references resumes
            ├── cover_letters (1:N)
            ├── portfolios (1:N)
            ├── skills (1:N)
            ├── learning_paths (1:N)
            ├── jobs (1:N)
            │       ├── applications (1:N)
            │       └── saved_jobs (1:N)
            ├── user_activity (1:N)
            └── admin_logs (1:N, admin only)
```

## Tables

### profiles

Extends Supabase auth.users. Auto-created on signup via trigger.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | References auth.users |
| email | TEXT | User email |
| full_name | TEXT | Display name |
| avatar_url | TEXT | Profile picture URL |
| role | TEXT | `user` or `admin` |
| plan | TEXT | `free`, `student`, or `professional` |
| skills | TEXT[] | Array of skill names |
| education | JSONB | Education entries |
| experience | JSONB | Work experience entries |

### resumes

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Resume ID |
| user_id | UUID (FK) | Owner |
| title | TEXT | Resume name |
| template | TEXT | Template identifier |
| personal_info | JSONB | Name, email, summary, etc. |
| is_primary | BOOLEAN | Primary resume flag |

### resume_sections

Structured content blocks within a resume.

| Column | Type | Description |
|--------|------|-------------|
| section_type | TEXT | education, experience, projects, skills, etc. |
| content | JSONB | Section-specific data |
| sort_order | INTEGER | Display order |

### ats_reports

| Column | Type | Description |
|--------|------|-------------|
| ats_score | INTEGER | 0–100 compatibility score |
| missing_keywords | TEXT[] | Keywords not found in resume |
| skill_match | TEXT[] | Matched skills |
| suggestions | TEXT[] | Improvement suggestions |
| improvement_areas | TEXT[] | Areas needing work |

### applications

| Column | Type | Description |
|--------|------|-------------|
| status | TEXT | applied, under_review, interview, rejected, accepted |
| applied_date | DATE | Date of application |
| resume_id | UUID (FK) | Resume used for application |

## Row Level Security

All tables use `auth.uid()` to restrict access:

- **SELECT/INSERT/UPDATE/DELETE**: Users can only operate on rows where `user_id = auth.uid()`
- **resume_sections**: Access controlled via parent resume ownership
- **profiles**: Admins can SELECT all profiles
- **admin_logs**: Only admins can access

## Triggers

| Trigger | Purpose |
|---------|---------|
| `on_auth_user_created` | Creates profile row when user signs up |
| `*_updated_at` | Auto-updates `updated_at` timestamp on row changes |

## Storage Buckets

| Bucket | Access | Purpose |
|--------|--------|---------|
| avatars | Public read, user write | Profile pictures |
| resumes | Private, user only | Uploaded resume files |

## Indexes

Indexes on all `user_id` foreign keys and `applications.status` for query performance.
