import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

export type UserRole = 'client' | 'student' | 'admin' | 'moderator';

export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  city: string;
  avatar?: string;
  verified: boolean;
  banned: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithPhone: (phone: string, otp: string) => Promise<boolean>;
  sendPhoneOtp: (phone: string) => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: UserRole;
    city?: string;
    university?: string;
    faculty?: string;
    level?: string;
    bio?: string;
    skills?: string[];
  }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function fetchProfile(userId: string): Promise<AppUser | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error || !data) return null;
  return {
    id: data.user_id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    phone: data.phone || '',
    role: (data.role as UserRole) || 'client',
    city: data.city || '',
    avatar: data.avatar_url || undefined,
    verified: data.verified || false,
    banned: data.banned || false,
    createdAt: data.created_at,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          // Use setTimeout to avoid deadlock with Supabase auth
          setTimeout(async () => {
            const profile = await fetchProfile(session.user.id);
            setUser(profile);
            setLoading(false);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id).then((profile) => {
          setUser(profile);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  };

  const sendPhoneOtp = async (phone: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    return !error;
  };

  const loginWithPhone = async (phone: string, otp: string): Promise<boolean> => {
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
    return !error;
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: UserRole;
    city?: string;
    university?: string;
    faculty?: string;
    level?: string;
    bio?: string;
    skills?: string[];
  }): Promise<boolean> => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
        },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error || !data.user) return false;

    // Update profile with additional info
    await supabase
      .from('profiles')
      .update({
        phone: userData.phone || '',
        role: userData.role || 'client',
        city: userData.city || '',
        university: userData.university || null,
        faculty: userData.faculty || null,
        level: userData.level || null,
        bio: userData.bio || null,
        skills: userData.skills || [],
      })
      .eq('user_id', data.user.id);

    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{
      user, session, login, loginWithPhone, sendPhoneOtp, register, logout,
      isAuthenticated: !!user, loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
