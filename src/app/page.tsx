'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/login');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen cvgenie-ambient-bg flex items-center justify-center p-4">
      {/* Background ambient orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="rounded-3xl glass-card border border-white/90 p-8 text-center bg-white/85 shadow-2xl max-w-sm w-full relative z-10 backdrop-blur-2xl animate-in fade-in">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/30">
          <Sparkles className="w-7 h-7 animate-spin" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[#101A3C] mb-1">
          CV<span className="text-blue-600">Genie</span>
        </h1>
        <p className="text-xs text-slate-500">
          Mengarahkan Anda ke halaman akun...
        </p>
      </div>
    </div>
  );
}
