import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types';
import type { User } from '@supabase/supabase-js';

function mapProfile(row: Record<string, unknown>): Profile {
  return {
    id: row.id as string,
    email: row.email as string,
    full_name: row.full_name as string | null,
    avatar_url: row.avatar_url as string | null,
    headline: row.headline as string | null,
    bio: row.bio as string | null,
    phone: row.phone as string | null,
    location: row.location as string | null,
    website: row.website as string | null,
    github_url: row.github_url as string | null,
    linkedin_url: row.linkedin_url as string | null,
    skills: (row.skills as string[]) || [],
    education: (row.education as Profile['education']) || [],
    experience: (row.experience as Profile['experience']) || [],
    role: (row.role as Profile['role']) || 'user',
    plan: (row.plan as Profile['plan']) || 'free',
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch profile:', error.message);
    return null;
  }

  if (!data) return null;
  return mapProfile(data as Record<string, unknown>);
}

/**
 * Ensures a profile row exists for the authenticated user.
 * Creates one if missing (e.g. user signed up before DB trigger was applied).
 */
export async function ensureProfile(user: User): Promise<Profile> {
  const existing = await fetchProfile(user.id);
  if (existing) return existing;

  const fullName =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    '';

  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: user.id,
        email: user.email || '',
        full_name: fullName,
      },
    ] as never)
    .select()
    .single();

  if (error) {
    throw new Error(
      error.message.includes('row-level security')
        ? 'Profile not found and could not be created. Run supabase/schema.sql in your Supabase SQL Editor.'
        : error.message,
    );
  }

  return mapProfile(data as Record<string, unknown>);
}

export async function updateProfile(
  userId: string,
  updates: Partial<Omit<Profile, 'id' | 'email' | 'created_at' | 'updated_at'>>,
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update(updates as never)
    .eq('id', userId);

  if (error) throw new Error(error.message);
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'png';
  const path = `${userId}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  const avatarUrl = `${data.publicUrl}?t=${Date.now()}`;

  await updateProfile(userId, { avatar_url: avatarUrl });
  return avatarUrl;
}
