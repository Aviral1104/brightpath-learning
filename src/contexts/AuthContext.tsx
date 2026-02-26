import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSupabaseClient, isBackendConfigured } from '@/integrations/backend/client';
import { Session } from '@supabase/supabase-js';

export type UserRole = 'teacher' | 'student' | 'parent';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  school?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, role: UserRole, meta: { name: string; school?: string }) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchUserProfile(userId: string): Promise<AppUser | null> {
  const supabase = getSupabaseClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (!profile || !roleData) return null;

  return {
    id: userId,
    name: profile.name,
    email: profile.email,
    role: roleData.role as UserRole,
    school: profile.school || undefined,
    phone: profile.phone || undefined,
    bio: profile.bio || undefined,
    avatar_url: profile.avatar_url || undefined,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isBackendConfigured) {
      setUser(null);
      setSession(null);
      setLoading(false);
      return;
    }

    const supabase = getSupabaseClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        setTimeout(async () => {
          const appUser = await fetchUserProfile(nextSession.user.id);
          setUser(appUser);
          setLoading(false);
        }, 0);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      if (initialSession?.user) {
        fetchUserProfile(initialSession.user.id).then((appUser) => {
          setUser(appUser);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!isBackendConfigured) return { error: 'Backend is not configured for this build yet.' };
    const { error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signup = async (email: string, password: string, role: UserRole, meta: { name: string; school?: string }) => {
    if (!isBackendConfigured) return { error: 'Backend is not configured for this build yet.' };
    const { error } = await getSupabaseClient().auth.signUp({
      email,
      password,
      options: {
        data: { name: meta.name, role, school: meta.school || '' },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return { error: error.message };
    return {};
  };

  const logout = async () => {
    if (!isBackendConfigured) return;
    await getSupabaseClient().auth.signOut();
    setUser(null);
    setSession(null);
  };

  const refreshProfile = async () => {
    if (session?.user && isBackendConfigured) {
      const appUser = await fetchUserProfile(session.user.id);
      setUser(appUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, signup, logout, refreshProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
