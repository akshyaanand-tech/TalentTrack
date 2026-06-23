# Deployment Guide

## Vercel Deployment

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial TalentTrack setup"
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New Project**
3. Import your GitHub repository
4. Vercel auto-detects Vite — no custom build settings needed

### Step 3: Environment Variables

Add these in Vercel Project Settings → Environment Variables:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase **Project URL** (e.g. `https://abc123.supabase.co`) — do NOT include `/rest/v1/` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_GEMINI_API_KEY` | Google Gemini API key |

### Step 4: Deploy

Click **Deploy**. Vercel runs `npm install` and `npm run build` automatically.

The `vercel.json` file handles SPA routing — all paths redirect to `index.html`.

## Supabase Configuration

### Authentication

1. In Supabase Dashboard → Authentication → URL Configuration:
   - **Site URL**: `https://your-vercel-domain.vercel.app`
   - **Redirect URLs**: Add `https://your-vercel-domain.vercel.app/reset-password`

2. Enable Email provider under Authentication → Providers

### Database

Run `supabase/schema.sql` in the SQL Editor before deploying.

### Storage

The schema creates `avatars` (public) and `resumes` (private) buckets with RLS policies.

## Local Production Test

```bash
npm run build
npm run preview
```

Verify the build completes without TypeScript or Vite errors before deploying.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page after deploy | Check environment variables are set in Vercel |
| Auth redirect fails | Add your Vercel URL to Supabase redirect URLs |
| 404 on page refresh | Ensure `vercel.json` rewrites are present |
| Database errors | Confirm schema.sql was executed in Supabase |
