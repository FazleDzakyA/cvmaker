'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle, Database, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, signIn, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const res = await signIn(email, password);
    setIsLoading(false);
    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMsg(res.error || 'Login gagal. Periksa kembali email dan password Anda.');
    }
  };

  return (
    <div className="misty-mountain-viewport min-h-screen flex items-center justify-center p-4 selection:bg-blue-200">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl glass-card overflow-hidden shadow-2xl relative z-10 border border-white/80">
        {/* Left Side: Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-between bg-white/40">
          <div>
            {/* Brand */}
            <div className="flex items-center gap-2 mb-8 group">
              <div className="w-9 h-9 rounded-2xl bg-[#172B49] flex items-center justify-center text-white shadow-md shadow-[#172B49]/20">
                <Sparkles className="w-5 h-5 text-blue-300" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#172B49]">
                CV<span className="text-blue-600">Genie</span>
              </span>
            </div>

            <h1 className="text-2xl font-bold text-[#172B49] mb-1">Welcome Back! 👋</h1>
            <p className="text-xs text-[#718096] mb-6">
              Masuk ke akun Anda untuk mengelola CV profesional Anda.
            </p>

            {isConfigured && (
              <div className="mb-4 px-3 py-1.5 rounded-xl glass-inset text-[11px] text-[#172B49] flex items-center gap-1.5 font-medium">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span>Supabase Real Database Terhubung</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50/80 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B49] mb-1">Alamat Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#718096] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl glass-inset bg-white/70 text-[#172B49] placeholder:text-[#718096] focus:outline-none focus:ring-2 focus:ring-[#172B49]/20"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-[#172B49]">Password</label>
                  <Link href="/forgot-password" className="text-[11px] font-semibold text-[#496A96] hover:underline">
                    Lupa Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#718096] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl glass-inset bg-white/70 text-[#172B49] placeholder:text-[#718096] focus:outline-none focus:ring-2 focus:ring-[#172B49]/20"
                    placeholder="Minimal 6 karakter"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-[#172B49] hover:bg-[#243B80] text-white text-xs font-bold shadow-lg shadow-[#172B49]/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? 'Sedang Masuk...' : 'Masuk Sekarang'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          <div className="mt-8 text-center text-xs text-[#718096]">
            Belum punya akun?{' '}
            <Link href="/register" className="font-bold text-[#172B49] hover:underline">
              Daftar Akun Baru
            </Link>
          </div>
        </div>

        {/* Right Side: Visual Glass Graphic */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-[#172B49] to-[#243B80] text-white relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-semibold text-blue-200 mb-6 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Student CV Platform</span>
            </div>
            <h2 className="text-2xl font-extrabold leading-tight mb-3">
              Mulai Masa Depan Karir Profesionalmu Hari Ini.
            </h2>
            <p className="text-xs text-white/80 leading-relaxed">
              Desain CV modern berstandar ATS, integrasi AI cerdas, dan sinkronisasi real-time cloud database.
            </p>
          </div>

          <div className="relative z-10 space-y-3 pt-6">
            {[
              'Tanpa pengalaman kerja? Maksimalkan potensi tugas & praktek SMK.',
              'Export PDF langsung dengan proporsi standar A4 pixel-perfect.',
              'Fitur AI Custom CV: Biarkan AI merancang tata letak CV terbaikmu.',
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-white/90">
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
