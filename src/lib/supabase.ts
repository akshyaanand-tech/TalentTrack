import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Supabase client expects the project URL only, e.g.:
 *   https://your-project-ref.supabase.co
 *
 * Do NOT append /rest/v1/ or other paths — that causes
 * "Invalid path specified in request URL" on auth requests.
 */
function normalizeSupabaseUrl(raw: string): string {
  let url = raw.trim();
  if (!url) return url;

  url = url.replace(/\/+$/, '');
  url = url.replace(/\/rest\/v1\/?$/i, '');
  url = url.replace(/\/auth\/v1\/?$/i, '');

  return url;
}

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string)?.trim();

export const supabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl || '');
const supabaseAnonKeyClean = supabaseAnonKey || '';

if (!supabaseUrl || !supabaseAnonKeyClean) {
  console.warn(
    'Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
  );
} else if (rawSupabaseUrl && normalizeSupabaseUrl(rawSupabaseUrl) !== rawSupabaseUrl.replace(/\/+$/, '')) {
  console.warn(
    `VITE_SUPABASE_URL was normalized to "${supabaseUrl}". Use the project URL only (no /rest/v1/).`,
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKeyClean || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKeyClean);

export function getSupabaseConfigError(): string | null {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.';
  }
  if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    return 'VITE_SUPABASE_URL should look like https://your-project-ref.supabase.co (no /rest/v1/ path).';
  }
  return null;
}
