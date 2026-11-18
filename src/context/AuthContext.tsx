'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { CVData } from '@/types/cv';
import { getStoredCVs, saveStoredCVs, getActiveCV, saveActiveCV } from '@/lib/storage';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  jobTitle?: string;
  institution?: string;
}

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  saveCVToDB: (cv: CVData) => Promise<{ success: boolean; error?: string }>;
  deleteCVFromDB: (cvId: string) => Promise<{ success: boolean; error?: string }>;
  fetchUserCVs: () => Promise<CVData[]>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  isConfigured: false,
  signUp: async () => ({ success: false }),
  signIn: async () => ({ success: false }),
  signInWithGoogle: async () => {},
  signOut: async () => {},
  saveCVToDB: async () => ({ success: false }),
  deleteCVFromDB: async () => ({ success: false }),
  fetchUserCVs: async () => [],
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      // Local fallback without Supabase
      const localUser = localStorage.getItem('cvgenie_auth_user');
      if (localUser) {
        try {
          const parsed = JSON.parse(localUser);
          setUser(parsed);
          setProfile(parsed);
        } catch {
          // ignore
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
      return;
    }

    // Real Supabase Auth listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    const supabase = createClient();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setProfile({
          id: data.id,
          email: data.email,
          fullName: data.full_name,
          avatarUrl: data.avatar_url,
          jobTitle: data.job_title,
          institution: data.institution,
        });
      } else {
        setProfile({
          id: userId,
          email,
          fullName: email.split('@')[0] || 'Student User',
        });
      }
    } catch {
      // ignore
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const supabase = createClient();
    if (!supabase) {
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        email,
        fullName,
      };
      localStorage.setItem('cvgenie_auth_user', JSON.stringify(newUser));
      setUser(newUser);
      setProfile(newUser);
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        const newProf: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          fullName,
        };
        setProfile(newProf);
      }

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Registration failed' };
    }
  };

  const signIn = async (email: string, password: string) => {
    const supabase = createClient();
    if (!supabase) {
      const localUser: UserProfile = {
        id: `user-${Date.now()}`,
        email,
        fullName: email.split('@')[0],
      };
      localStorage.setItem('cvgenie_auth_user', JSON.stringify(localUser));
      setUser(localUser);
      setProfile(localUser);
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id, data.user.email || email);
      }

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Login failed' };
    }
  };

  const signInWithGoogle = async () => {
    const supabase = createClient();
    if (!supabase) return;

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard`,
      },
    });
  };

  const signOut = async () => {
    const supabase = createClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Sign out error:', e);
      }
    }
    localStorage.removeItem('cvgenie_auth_user');
    setUser(null);
    setProfile(null);
  };

  const saveCVToDB = async (cv: CVData): Promise<{ success: boolean; error?: string }> => {
    saveActiveCV(cv);

    const supabase = createClient();
    if (!supabase || !user) {
      return { success: true };
    }

    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(cv.id);
      const resumeId = isUUID ? cv.id : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : undefined);
      if (resumeId && cv.id !== resumeId) {
        cv.id = resumeId;
        saveActiveCV(cv);
      }

      const payload: any = {
        user_id: user.id,
        title: cv.title || 'Untitled CV',
        template_id: cv.templateId,
        accent_color: cv.accentColor,
        ats_score: 95,
        content: cv,
        updated_at: new Date().toISOString(),
      };
      if (resumeId) {
        payload.id = resumeId;
      }

      const { error } = await supabase
        .from('resumes')
        .upsert(payload);

      if (error) {
        console.error('Supabase save error:', error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const deleteCVFromDB = async (cvId: string): Promise<{ success: boolean; error?: string }> => {
    const current = getStoredCVs().filter(c => c.id !== cvId);
    saveStoredCVs(current);

    const supabase = createClient();
    if (!supabase || !user) {
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', cvId)
        .eq('user_id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const fetchUserCVs = async (): Promise<CVData[]> => {
    const supabase = createClient();
    if (!supabase || !user) {
      return getStoredCVs();
    }

    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return getStoredCVs();
      }

      const dbCVs: CVData[] = data.map((item: any) => ({
        ...item.content,
        id: item.id,
        title: item.title,
        templateId: item.template_id,
        accentColor: item.accent_color,
        updatedAt: new Date(item.updated_at).toLocaleDateString(),
      }));

      return dbCVs;
    } catch {
      return getStoredCVs();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isConfigured,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        saveCVToDB,
        deleteCVFromDB,
        fetchUserCVs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
