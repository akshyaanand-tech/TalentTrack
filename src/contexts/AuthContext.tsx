import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, getSupabaseConfigError } from '@/lib/supabase';
import { ensureProfile, fetchProfile } from '@/services/profileService';
import type { Profile } from '@/types';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (authUser: User) => {
    try {
      const profileData = await ensureProfile(authUser);
      setProfile(profileData);
      return profileData;
    } catch (err) {
      console.error('Failed to load profile:', err);
      const fallback = await fetchProfile(authUser.id);
      if (fallback) setProfile(fallback);
      return fallback;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const profileData = await fetchProfile(user.id);
    if (profileData) {
      setProfile(profileData);
    } else {
      await loadProfile(user);
    }
  }, [user, loadProfile]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        loadProfile(currentSession.user).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        loadProfile(currentSession.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      const configError = getSupabaseConfigError();
      if (configError) return { error: configError };

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      return { error: error?.message ?? null };
    },
    [],
  );

  const signIn = useCallback(async (email: string, password: string) => {
    const configError = getSupabaseConfigError();
    if (configError) return { error: configError };

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error: error?.message ?? null };
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return { error: error?.message ?? null };
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
      refreshProfile,
    }),
    [
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
