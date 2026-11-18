'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  MoreVertical,
  Clock,
  Eye,
  CheckCircle2,
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
  const { user, profile, isConfigured, signOut, fetchUserCVs } = useAuth();
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [activeCV, setActiveCV] = useState<CVData | null>(null);

  useEffect(() => {
    fetchUserCVs().then((res) => {
      setCvs(res);
    });
    setActiveCV(getActiveCV());
  }, [user]);

  const atsReport = activeCV ? analyzeCVWithATS(activeCV) : null;
  const displayName = profile?.fullName || user?.email?.split('@')[0] || 'Fazle Dzaky';
  const firstName = displayName.split(' ')[0] || 'Fazle';

  return (
    <div className="min-h-screen cvgenie-ambient-bg flex">
      {/* Left Glass Sidebar matching mockup */}
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
              { label: 'Settings', icon: Settings, href: '/dashboard' },
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
            <span>Upgrade to Pro 👑</span>
          </div>
          <p className="text-[11px] text-white/80 leading-snug mb-3.5">
            Unlock unlimited Gemini reasoning, custom layouts, and recruiter matching.
          </p>
          <button className="w-full py-2 rounded-xl bg-white text-blue-700 text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm">
            Go Pro →
          </button>
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
            <button className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white/80 transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <img
                src={profile?.avatarUrl || activeCV?.personalInfo.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {displayName}
                </div>
                <div className="text-[10px] text-slate-400">
                  {user?.email || 'Student Account'}
                </div>
              </div>
              <button
                onClick={() => signOut()}
                title="Sign Out"
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
                Welcome back, {firstName}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Let&apos;s create a professional CV and unlock new opportunities.
              </p>
            </div>

            <Link
              href="/builder"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 self-start md:self-auto transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New CV</span>
            </Link>
          </div>

          {/* CV Completion Glass Banner matching mockup */}
          <div className="rounded-3xl glass-card border border-white/90 p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 bg-white/75 backdrop-blur-xl">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-inner">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-sm font-bold text-slate-900">Your CV Completion</h3>
                  <span className="text-xs font-bold text-blue-600">
                    {atsReport ? `${atsReport.overallScore}%` : '85%'}
                  </span>
                </div>
                <div className="w-full sm:w-80 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${atsReport ? atsReport.overallScore : 85}%` }}
                  />
                </div>
              </div>
            </div>

            <Link
              href="/builder"
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all shrink-0"
            >
              <span>Continue Editing</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
                  Student Mode: No Experience? No Problem!
                </h3>
                <p className="text-xs text-slate-600">
                  Turn school assignments, OSIS leadership, and practical projects into professional bullet points with AI.
                </p>
              </div>
            </div>
            <Link
              href="/student-mode"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all shrink-0"
            >
              <span>Try Student Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recent CVs Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Your Recent CVs</h2>
              <Link href="/builder" className="text-xs font-semibold text-blue-600 hover:underline">
                See all →
              </Link>
            </div>

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
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                        ATS {atsReport?.overallScore || 98}/100
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mb-1">{cv.title || 'Professional CV'}</h3>
                    <p className="text-xs text-slate-500 mb-3">{cv.personalInfo.jobTitle || 'Software Developer'}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Updated {cv.updatedAt || 'Recently'}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100/80 mt-4 flex items-center justify-between">
                    <Link
                      href="/builder"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Edit in Studio</span>
                    </Link>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {cv.templateId.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Templates Carousel */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Recommended Templates</h2>
              <Link href="/templates" className="text-xs font-semibold text-blue-600 hover:underline">
                View all templates →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {TEMPLATES_CATALOG.slice(0, 3).map((tpl) => (
                <div
                  key={tpl.id}
                  className="rounded-3xl glass-card border border-white/80 p-5 shadow-sm bg-white/70 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-900">{tpl.name}</span>
                      {tpl.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold">
                          {tpl.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">{tpl.description}</p>
                  </div>
                  <Link
                    href="/builder"
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
