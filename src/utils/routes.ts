export const ROUTES = {
  HOME: '/',
  FEATURES: '/#features',
  PRICING: '/#pricing',
  FAQ: '/#faq',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  RESUME: '/dashboard/resume',
  RESUME_NEW: '/dashboard/resume/new',
  RESUME_EDIT: '/dashboard/resume/:id',
  ATS: '/dashboard/ats',
  COVER_LETTER: '/dashboard/cover-letter',
  PORTFOLIO: '/dashboard/portfolio',
  SKILLS: '/dashboard/skills',
  JOBS: '/dashboard/jobs',
  PROFILE: '/dashboard/profile',
  ADMIN: '/admin',
} as const;

export type RouteKey = keyof typeof ROUTES;
