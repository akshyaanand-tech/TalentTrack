# TalentTrack

Career development platform for students and job seekers. Built as a final-year academic project using React, Supabase, and the Gemini API.

## Features

- Resume Builder with templates and PDF export
- ATS Analyzer with keyword and skill matching
- Cover Letter Generator
- Portfolio Generator with multiple themes
- Skills Analyzer with learning roadmap
- Job Application Tracker
- User Profile management
- Admin Dashboard

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion |
| Routing | React Router v7 |
| Backend | Supabase (Auth, PostgreSQL, Storage) |
| AI | Google Gemini API |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- A Gemini API key

### Installation

```bash
git clone <repository-url>
cd TalentTrack
npm install
cp .env.example .env
```

Edit `.env` with your credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-key
```

### Database Setup

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run the contents of `supabase/schema.sql`

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI and feature components
│   ├── auth/       # ProtectedRoute, GuestRoute
│   ├── landing/    # Landing page sections
│   └── ui/         # Button, Input, Card, etc.
├── contexts/       # AuthContext, ThemeContext
├── hooks/          # Custom React hooks
├── layouts/        # DashboardLayout
├── lib/            # Supabase client
├── pages/          # Route pages
│   ├── auth/       # Login, Signup, Password reset
│   └── dashboard/  # Dashboard and feature pages
├── services/       # API/data service functions
├── types/          # TypeScript type definitions
└── utils/          # Helpers and route constants
```

## Route Architecture

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Guest | Sign in |
| `/signup` | Guest | Create account |
| `/forgot-password` | Guest | Request password reset |
| `/reset-password` | Auth | Set new password |
| `/dashboard` | Protected | Main dashboard |
| `/dashboard/resume` | Protected | Resume builder |
| `/dashboard/ats` | Protected | ATS analyzer |
| `/dashboard/cover-letter` | Protected | Cover letter generator |
| `/dashboard/portfolio` | Protected | Portfolio generator |
| `/dashboard/skills` | Protected | Skills analyzer |
| `/dashboard/jobs` | Protected | Job tracker |
| `/dashboard/profile` | Protected | User profile |
| `/admin` | Admin | Admin dashboard |

## Documentation

- [Deployment Guide](docs/DEPLOYMENT.md)
- [Database Documentation](docs/DATABASE.md)
- [Architecture Documentation](docs/ARCHITECTURE.md)
- [API Documentation](docs/API.md)
- [Project Report Notes](docs/PROJECT_REPORT.md)

