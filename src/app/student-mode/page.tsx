'use client';

import React from 'react';
import { StudentDiscoveryWizard } from '@/components/student/StudentDiscoveryWizard';
import { GraduationCap, Sparkles, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppSidebar } from '@/components/layout/AppSidebar';

export default function StudentModePage() {
  return (
    <AuthGuard>
      <div className="misty-mountain-viewport min-h-screen flex flex-col md:flex-row p-3 sm:p-5 lg:p-6 gap-4 lg:gap-6 overflow-x-hidden selection:bg-blue-200">
        {/* Single Unified App Sidebar */}
        <AppSidebar />

        <main className="flex-1 min-w-0 flex flex-col max-w-5xl mx-auto w-full pb-20 md:pb-6">
          {/* Header Hero Banner */}
          <div className="text-center max-w-2xl mx-auto mb-8 pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-[#172B49] text-xs font-bold mb-3 shadow-sm">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Dedicated Student & SMK Mode</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B49] tracking-tight mb-3">
              Belum Ada Pengalaman Kerja? <br />
              <span className="text-blue-600">
                Bukan Masalah. Potensimu Berharga!
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#718096] leading-relaxed">
              Ubah praktikum sekolah, organisasi kesiswaan (OSIS/Ekskul), tugas kejuruan, dan perlombaan menjadi poin resume profesional berstandar ATS.
            </p>
          </div>

          {/* Wizard Container */}
          <div className="mb-12">
            <StudentDiscoveryWizard />
          </div>

          {/* 3 Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="p-5 rounded-3xl glass-card border border-white/80 shadow-md space-y-1.5 bg-white/70">
              <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#172B49]">AI Experience Transformer</h3>
              <p className="text-[11px] text-[#718096] leading-relaxed">
                Mengubah cerita tugas praktikum menjadi bullet points profesional berbasis kata kerja aksi nyata tanpa memalsukan fakta.
              </p>
            </div>

            <div className="p-5 rounded-3xl glass-card border border-white/80 shadow-md space-y-1.5 bg-white/70">
              <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#172B49]">Format Ramah PKL & Magang</h3>
              <p className="text-[11px] text-[#718096] leading-relaxed">
                Struktur kurikulum khusus disesuaikan dengan kebutuhan lamaran magang industri dan fresh graduate di Indonesia.
              </p>
            </div>

            <div className="p-5 rounded-3xl glass-card border border-white/80 shadow-md space-y-1.5 bg-white/70">
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#172B49]">Zero Fabrication Guarantee</h3>
              <p className="text-[11px] text-[#718096] leading-relaxed">
                Batasan etis ketat: Menjaga integritas data Anda dan hanya menonjolkan apa yang benar-benar telah Anda pelajari.
              </p>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
