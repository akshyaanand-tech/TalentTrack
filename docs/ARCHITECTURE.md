# Architecture Documentation

## System Overview

TalentTrack is a client-side React SPA that communicates directly with Supabase and the Gemini API. There is no custom backend server.

```
┌─────────────────────────────────────────────┐
│                  Browser (React SPA)         │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐ │
│  │  Pages  │  │ Contexts │  │ Components │ │
│  └────┬────┘  └────┬─────┘  └────────────┘ │
│       │            │                         │
│  ┌────▼────────────▼─────┐  ┌──────────────┐  │
│  │      Services        │  │    Hooks     │  │
│  └──────────┬───────────┘  └──────────────┘  │
│             │                                 │
│  ┌──────────▼───────────┐  ┌──────────────┐  │
│  │   Supabase Client    │  │  Gemini API  │  │
│  └──────────┬───────────┘  └──────┬───────┘  │
└─────────────┼─────────────────────┼───────────┘
              │                     │
     ┌────────▼────────┐   ┌───────▼───────┐
     │    Supabase     │   │ Google Gemini │
     │ Auth + DB +     │   │     API       │
     │    Storage      │   │               │
     └─────────────────┘   └───────────────┘
```

## Frontend Architecture

### Layer Responsibilities

| Layer | Responsibility |
|-------|---------------|
| **Pages** | Route-level components, compose features |
| **Layouts** | Shared page structure (sidebar, header) |
| **Components** | Reusable UI and feature-specific pieces |
| **Contexts** | Global state (auth session, theme) |
| **Hooks** | Data fetching and reusable logic |
| **Services** | Supabase queries and API calls |
| **Types** | TypeScript interfaces and DB types |
| **Utils** | Pure helper functions |

### State Management

- **Auth state**: `AuthContext` wraps Supabase auth session and profile
- **Theme state**: `ThemeContext` with localStorage persistence
- **Feature state**: Local component state and custom hooks per module
- **Server state**: Fetched from Supabase in services, consumed via hooks

### Routing

React Router v7 with three route groups:

1. **Public routes**: Landing page
2. **Guest routes**: Login, signup (redirect to dashboard if authenticated)
3. **Protected routes**: Dashboard and all feature modules (redirect to login if not authenticated)

### Authentication Flow

```
Signup → Supabase Auth → Trigger creates profile → Redirect to Dashboard
Login  → Supabase Auth → Fetch profile → Redirect to Dashboard
Logout → Clear session → Redirect to Login
Reset  → Email link → /reset-password → Update password → Dashboard
```

## Module Architecture

Each feature module follows the same pattern:

```
pages/dashboard/FeaturePage.tsx    → Page component
components/feature/                → Feature-specific components
services/featureService.ts         → Supabase CRUD + Gemini calls
hooks/useFeature.ts                → Data fetching hook
types/index.ts                     → Shared type definitions
```

## AI Integration

Gemini API is called directly from the client for:

- ATS analysis (resume vs job description comparison)
- Cover letter generation
- Skill gap analysis and roadmap generation

API key is stored in `VITE_GEMINI_API_KEY` environment variable.

## Security

- Supabase RLS ensures data isolation per user
- Auth tokens managed by Supabase client with auto-refresh
- No sensitive keys exposed in client code beyond the anon key (designed for client use)
- Storage buckets have per-user upload policies

## Deployment Architecture

```
GitHub → Vercel (static build) → CDN
                │
                ├── Supabase (Auth, DB, Storage)
                └── Gemini API (AI features)
```

Build output is static files served by Vercel with SPA rewrites.

## Design System

- **Colors**: Primary (#4F46E5), Secondary (#06B6D4), Accent (#8B5CF6), Surface (#0F172A)
- **Fonts**: Poppins (headings), Inter (body)
- **Dark/Light mode**: Tailwind `dark:` classes with class-based toggle
- **Icons**: Lucide React (no emojis)
- **Animation**: Framer Motion for landing page scroll animations only
