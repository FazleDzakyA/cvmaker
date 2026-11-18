'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  PlusCircle,
  LayoutTemplate,
  Wand2,
  ShieldCheck,
  User,
  Settings,
  Crown,
  Bell,
  ArrowRight,
  Trash2,
  Clock,
  Eye,
  GraduationCap,
  LogOut,
  Database,
} from 'lucide-react';
import { CVData } from '@/types/cv';
import { getActiveCV } from '@/lib/storage';
import { TEMPLATES_CATALOG } from '@/data/templateCatalog';
import { analyzeCVWithATS } from '@/lib/atsScorer';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, isConfigured, signOut, fetchUserCVs, deleteCVFromDB, isLoading } = useAuth();
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [activeCV, setActiveCV] = useState<CVData | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetchUserCVs().then((res) => {
        setCvs(res);
      });
      setActiveCV(getActiveCV());
    }
  }, [user, isLoading, router]);

  const atsReport = activeCV && activeCV.personalInfo.fullName ? analyzeCVWithATS(activeCV) : null;
  const displayName = profile?.fullName || user?.email?.split('@')[0] || 'Student';
  const firstName = displayName.split(' ')[0] || 'Student';

  const handleDeleteCV = async (cvId: string) => {
    if (confirm('Hapus CV ini dari database?')) {
      await deleteCVFromDB(cvId);
      setCvs((prev) => prev.filter((c) => c.id !== cvId));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen cvgenie-ambient-bg flex">
      {/* Left Glass Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col justify-between p-5 bg-white/70 backdrop-blur-2xl border-r border-white/80 shadow-sm shrink-0">
        <div>
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 mb-8 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#101A3C]">
              CV<span className="text-blue-600">Genie</span>
            </span>
          </Link>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            {[
              { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', active: true },
              { label: 'Create CV', icon: PlusCircle, href: '/builder' },
              { label: 'Student Mode', icon: GraduationCap, href: '/student-mode', badge: 'Special' },
              { label: 'Templates', icon: LayoutTemplate, href: '/templates' },
              { label: 'ATS Checker', icon: ShieldCheck, href: '/ats-checker' },
              { label: 'My Profile', icon: User, href: '/builder' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    item.active
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Upgrade to Pro Card */}
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-5 shadow-xl shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-lg" />
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1.5">
            <Crown className="w-4 h-4" />
            <span>AI Studio Active ✦</span>
          </div>
          <p className="text-[11px] text-white/80 leading-snug mb-3.5">
            Supabase PostgreSQL sync & Gemini AI CV Generation active.
          </p>
          <Link
            href="/builder"
            className="block text-center w-full py-2 rounded-xl bg-white text-blue-700 text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm"
          >
            Open CV Studio →
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar with glass effect */}
        <header className="px-6 py-3.5 flex items-center justify-between border-b border-white/80 bg-white/60 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Link href="/" className="lg:hidden flex items-center gap-1.5 text-slate-900 font-bold text-sm mr-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>CVGenie</span>
            </Link>
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Overview Dashboard</span>

            {isConfigured && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Database className="w-3 h-3" />
                <span>Supabase Live</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {displayName}
                </div>
                <div className="text-[10px] text-slate-400">
                  {user?.email || 'Logged In'}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                title="Log Out"
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-6 sm:p-8 max-w-6xl w-full mx-auto space-y-8">
          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101A3C] tracking-tight">
                Welcome, {firstName}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Mulai buat CV profesional ATS-friendly kamu sekarang atau biarkan AI merancangnya.
              </p>
            </div>

            <Link
              href="/builder"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 self-start md:self-auto transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat CV Baru</span>
            </Link>
          </div>

          {/* Student Mode Highlight Banner */}
          <div className="rounded-3xl p-6 bg-gradient-to-r from-purple-600/15 via-indigo-600/15 to-blue-600/15 border border-purple-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Student Mode: Belum Punya Pengalaman Kerja?
                </h3>
                <p className="text-xs text-slate-600">
                  Ubah tugas sekolah/kuliah, organisasi, dan proyek praktek menjadi poin CV profesional berstandar ATS.
                </p>
              </div>
            </div>
            <Link
              href="/student-mode"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all shrink-0"
            >
              <span>Buka Student Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recent CVs Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Daftar CV Tersimpan</h2>
              <Link href="/builder" className="text-xs font-semibold text-blue-600 hover:underline">
                Buka Studio →
              </Link>
            </div>

            {cvs.length === 0 ? (
              <div className="rounded-3xl glass-card border border-dashed border-slate-300 p-8 text-center bg-white/60 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Belum Ada CV Tersimpan</h3>
                <p className="text-xs text-slate-500 max-w-sm mb-4">
                  Database kamu masih bersih dan kosong. Klik tombol di bawah untuk membuat CV pertamamu dari lembar kosong atau buat dengan bantuan AI!
                </p>
                <Link
                  href="/builder"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Mulai Buat CV Sekarang</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cvs.map((cv) => (
                  <div
                    key={cv.id}
                    className="rounded-3xl glass-card border border-white/80 p-5 shadow-sm bg-white/70 hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <button
                          onClick={() => handleDeleteCV(cv.id)}
                          title="Hapus CV"
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm mb-1">{cv.title || 'Untitled CV'}</h3>
                      <p className="text-xs text-slate-500 mb-3">{cv.personalInfo.fullName || 'Draft CV'}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Update: {cv.updatedAt || 'Baru saja'}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100/80 mt-4 flex items-center justify-between">
                      <Link
                        href="/builder"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Edit di Studio</span>
                      </Link>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {cv.templateId?.toUpperCase() || 'MINIMALIST'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Templates */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Pilihan Template CV</h2>
              <Link href="/templates" className="text-xs font-semibold text-blue-600 hover:underline">
                Lihat Semua Template →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {TEMPLATES_CATALOG.map((tpl) => (
                <Link
                  key={tpl.id}
                  href={`/builder?template=${tpl.id}`}
                  className="rounded-2xl p-3 glass-card border border-white/80 bg-white/70 hover:bg-white hover:scale-105 transition-all text-center group"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-800 truncate">{tpl.name}</div>
                  <div className="text-[10px] text-slate-400">{tpl.category}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
