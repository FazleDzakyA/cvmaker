'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Folder,
  Star,
  GraduationCap,
  ShieldCheck,
  Plus,
  LogOut,
  Sparkles,
  Wand2,
  FileText,
  Bot,
} from 'lucide-react';
import { CVData } from '@/types/cv';
import { saveActiveCV } from '@/lib/storage';
import { blankCVData } from '@/data/initialCVData';
import { useAuth } from '@/context/AuthContext';

export const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const handleCreateNewCV = () => {
    const fresh: CVData = {
      ...blankCVData,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cv-${Date.now()}`,
    };
    saveActiveCV(fresh);
    router.push('/builder');
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: Home, href: '/dashboard' },
    { label: 'Studio CV', icon: Folder, href: '/builder' },
    { label: 'AI Prompt Builder', icon: Wand2, href: '/prompt-builder' },
    { label: 'Quick Builder (10 Langkah)', icon: FileText, href: '/quick-builder' },
    { label: 'Guided AI Consultant', icon: Bot, href: '/guided-builder' },
    { label: 'Templates CV', icon: Star, href: '/templates' },
    { label: 'ATS Checker', icon: ShieldCheck, href: '/ats-checker' },
  ];

  return (
    <>
      {/* 1. Desktop Floating Glass Sidebar (Left) */}
      <aside className="hidden md:flex flex-col items-center justify-between py-6 px-3 glass-sidebar w-16 shrink-0 h-[calc(100vh-2.5rem)] sticky top-5 z-40 shadow-xl rounded-3xl">
        {/* Top App Icons */}
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Brand Sparkle Logo */}
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 mb-1 hover:scale-105 transition-transform"
            title="CVGenie"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </Link>

          {/* Navigation Items */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all group relative ${
                  isActive
                    ? 'bg-[#172B49] text-white shadow-md shadow-[#172B49]/20 scale-105'
                    : 'text-[#496A96] hover:text-[#172B49] hover:bg-white/70'
                }`}
                title={item.label}
              >
                <Icon className="w-4 h-4" />
                {/* Tooltip on hover */}
                <span className="absolute left-14 px-2.5 py-1 rounded-xl bg-[#172B49] text-white text-[11px] font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity shadow-lg z-50">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-2.5 w-full">
          {/* Add New Blank CV */}
          <button
            onClick={handleCreateNewCV}
            className="w-10 h-10 rounded-2xl glass-inset flex items-center justify-center text-[#172B49] hover:bg-white hover:scale-110 transition-all shadow-sm group relative"
            title="Mulai CV Baru (Lembar Kosong)"
          >
            <Plus className="w-5 h-5" />
            <span className="absolute left-14 px-2.5 py-1 rounded-xl bg-[#172B49] text-white text-[11px] font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity shadow-lg z-50">
              Buat CV Baru
            </span>
          </button>

          {/* Log Out */}
          <button
            onClick={handleSignOut}
            className="w-10 h-10 rounded-2xl text-[#718096] hover:text-red-600 hover:bg-red-50/80 flex items-center justify-center transition-all group relative"
            title="Keluar (Log Out)"
          >
            <LogOut className="w-4 h-4" />
            <span className="absolute left-14 px-2.5 py-1 rounded-xl bg-red-600 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity shadow-lg z-50">
              Keluar (Log Out)
            </span>
          </button>
        </div>
      </aside>

      {/* 2. Mobile Floating Bottom Navigation Bar (Visible only on phone screens) */}
      <nav className="md:hidden fixed bottom-3 inset-x-3 z-50 glass-card px-3 py-2 rounded-2xl flex items-center justify-around shadow-2xl border border-white/80">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 ${
            pathname === '/dashboard' ? 'text-[#172B49] font-bold' : 'text-[#496A96]'
          }`}
          title="Dashboard"
        >
          <Home className="w-4 h-4" />
          <span className="text-[9px]">Home</span>
        </Link>

        <Link
          href="/quick-builder"
          className={`flex flex-col items-center gap-1 ${
            pathname === '/quick-builder' ? 'text-[#172B49] font-bold' : 'text-[#496A96]'
          }`}
          title="Quick Builder"
        >
          <FileText className="w-4 h-4" />
          <span className="text-[9px]">Quick</span>
        </Link>

        {/* Center Round Add Button */}
        <button
          onClick={handleCreateNewCV}
          className="w-10 h-10 -mt-5 rounded-full bg-[#172B49] text-white flex items-center justify-center shadow-lg shadow-[#172B49]/30 hover:scale-105 transition-transform"
          title="Buat CV Baru"
        >
          <Plus className="w-5 h-5" />
        </button>

        <Link
          href="/guided-builder"
          className={`flex flex-col items-center gap-1 ${
            pathname === '/guided-builder' ? 'text-[#172B49] font-bold' : 'text-[#496A96]'
          }`}
          title="Guided AI"
        >
          <Bot className="w-4 h-4" />
          <span className="text-[9px]">Guided</span>
        </Link>

        <Link
          href="/templates"
          className={`flex flex-col items-center gap-1 ${
            pathname === '/templates' ? 'text-[#172B49] font-bold' : 'text-[#496A96]'
          }`}
          title="Templates"
        >
          <Star className="w-4 h-4" />
          <span className="text-[9px]">Desain</span>
        </Link>
      </nav>
    </>
  );
};
