'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles } from 'lucide-react';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen cvgenie-ambient-bg flex items-center justify-center p-4">
        <div className="rounded-3xl glass-card border border-white/90 p-8 text-center bg-white/80 shadow-2xl max-w-sm w-full backdrop-blur-xl animate-in fade-in">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <h2 className="text-sm font-bold text-slate-800 mb-1">Memeriksa Akun...</h2>
          <p className="text-xs text-slate-500">Menyiapkan sesi Anda ke CVGenie.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen cvgenie-ambient-bg flex items-center justify-center p-4">
        <div className="rounded-3xl glass-card border border-white/90 p-8 text-center bg-white/80 shadow-2xl max-w-sm w-full backdrop-blur-xl">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-bold text-slate-800 mb-1">Mengarahkan ke Login...</h2>
          <p className="text-xs text-slate-500">Silakan login atau daftar akun terlebih dahulu.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
