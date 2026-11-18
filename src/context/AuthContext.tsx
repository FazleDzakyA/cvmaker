'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { CVData } from '@/types/cv';
import { getStoredCVs, saveStoredCVs, getActiveCV, saveActiveCV } from '@/lib/storage';
import { defaultCVData } from '@/data/initialCVData';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  jobTitle?: string;
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
      // Use local session demo
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
        // Default demo profile matching Fazle Dzaky
        const demoProfile = {
          id: 'demo-fazle',
          email: 'fazle.dzaky@gmail.com',
          fullName: 'Fazle Dzaky Aryaguna',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
          jobTitle: 'Software Developer',
        };
        setUser(demoProfile);
        setProfile(demoProfile);
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
      // Offline/Local Demo registration
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        fullName,
        jobTitle: 'Aspiring Professional',
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
        setProfile({
          id: data.user.id,
          email: data.user.email || email,
          fullName,
        });
      }

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Registration failed' };
    }
  };

  const signIn = async (email: string, password: string) => {
    const supabase = createClient();
    if (!supabase) {
      // Offline/Local Demo sign in
      const demoUser = {
        id: 'user-fazle',
        email,
        fullName: email.includes('fazle') ? 'Fazle Dzaky Aryaguna' : email.split('@')[0],
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
        jobTitle: 'Software Developer',
      };
      localStorage.setItem('cvgenie_auth_user', JSON.stringify(demoUser));
      setUser(demoUser);
      setProfile(demoUser);
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
    if (!supabase) {
      // Local fallback
      const googleUser = {
        id: 'google-fazle',
        email: 'fazle.dzaky@gmail.com',
        fullName: 'Fazle Dzaky Aryaguna',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
        jobTitle: 'Software Developer',
      };
      localStorage.setItem('cvgenie_auth_user', JSON.stringify(googleUser));
      setUser(googleUser);
      setProfile(googleUser);
      return;
    }

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  const signOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('cvgenie_auth_user');
    setUser(null);
    setProfile(null);
  };

  const saveCVToDB = async (cv: CVData): Promise<{ success: boolean; error?: string }> => {
    // Save to local storage first
    saveActiveCV(cv);

    const supabase = createClient();
    if (!supabase || !user) {
      return { success: true }; // saved to local
    }

    try {
      const { error } = await supabase
        .from('resumes')
        .upsert({
          id: cv.id.includes('-') && cv.id.length > 20 ? cv.id : undefined,
          user_id: user.id,
          title: cv.title || 'My Professional CV',
          template_id: cv.templateId,
          accent_color: cv.accentColor,
          ats_score: 98,
          content: cv,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Supabase save error:', error);
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

      if (data && !error && data.length > 0) {
        const parsed = data.map((d: any) => ({
          ...d.content,
          id: d.id,
          title: d.title,
          templateId: d.template_id,
          accentColor: d.accent_color,
          updatedAt: 'Recently synced with Supabase',
        }));
        saveStoredCVs(parsed);
        return parsed;
      }
      return getStoredCVs();
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
        fetchUserCVs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
