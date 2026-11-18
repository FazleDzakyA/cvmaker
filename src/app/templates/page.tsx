'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TEMPLATES_CATALOG, TemplateMeta } from '@/data/templateCatalog';
import { samplePreviewCVData } from '@/data/samplePreviewCVData';
import { CVRenderer } from '@/components/templates/CVRenderer';
import {
  LayoutTemplate,
  Sparkles,
  ArrowRight,
  Eye,
  X,
  Check,
  FileText,
  Wand2,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { saveActiveCV, getActiveCV } from '@/lib/storage';
import { blankCVData } from '@/data/initialCVData';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppSidebar } from '@/components/layout/AppSidebar';

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateMeta | null>(null);
  const [methodModalTemplate, setMethodModalTemplate] = useState<TemplateMeta | null>(null);

  const categories = ['All', 'Student Focused', 'Modern', 'Professional', 'ATS Optimized', 'Engineering'];

  const filtered =
    selectedCategory === 'All'
      ? TEMPLATES_CATALOG
      : TEMPLATES_CATALOG.filter((t) => t.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  // Triggered when user selects one of the 3 modes for the selected template
  const handleSelectCreationMethod = (mode: 'blank' | 'ai' | 'student') => {
    if (!methodModalTemplate) return;
    const tplId = methodModalTemplate.id;

    if (mode === 'blank') {
      // 1. Lembar Kosong: Manual isi dari awal dengan template ini
      const fresh = {
        ...blankCVData,
        templateId: tplId,
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cv-${Date.now()}`,
      };
      saveActiveCV(fresh);
      router.push('/builder');
    } else if (mode === 'ai') {
      // 2. AI Custom CV: Buka kuesioner form di studio untuk susun prompt & salin / generate
      const current = getActiveCV();
      saveActiveCV({ ...current, templateId: tplId });
      router.push('/builder?openAI=true');
    } else if (mode === 'student') {
      // 3. Student Mode: Panduan bertahap khusus siswa SMK/pelajar
      const current = getActiveCV();
      saveActiveCV({ ...current, templateId: tplId });
      router.push('/student-mode');
    }
  };

  return (
    <AuthGuard>
      <div className="misty-mountain-viewport min-h-screen flex flex-col md:flex-row p-3 sm:p-5 lg:p-6 gap-4 lg:gap-6 overflow-x-hidden selection:bg-blue-200">
        {/* Single Unified App Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 flex flex-col max-w-[1400px] mx-auto w-full pb-20 md:pb-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-[#172B49] text-xs font-bold mb-3 shadow-sm">
              <LayoutTemplate className="w-4 h-4 text-blue-600" />
              <span>Katalog 6 Template Standar ATS Terverifikasi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B49] tracking-tight mb-2">
              Pilih Desain CV Impian Anda
            </h1>
            <p className="text-xs sm:text-sm text-[#718096]">
              Seluruh template dirancang dengan proporsi cetak A4, susunan font ramah bot ATS, dan tata letak elegan.
            </p>
          </div>

          {/* Categories Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#172B49] text-white shadow-md shadow-[#172B49]/20 scale-105'
                    : 'glass-card bg-white/70 text-[#496A96] hover:text-[#172B49] hover:bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tpl) => (
              <div
                key={tpl.id}
                className="rounded-3xl glass-card border border-white/90 p-5 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group bg-white/80"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                      {tpl.category}
                    </span>
                    {tpl.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {tpl.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#172B49] mb-1 group-hover:text-blue-600 transition-colors">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-[#718096] leading-relaxed mb-4">{tpl.description}</p>

                  {/* Visual Document Preview Sheet Container with Sample Candidate Data */}
                  <div
                    onClick={() => setPreviewTemplate(tpl)}
                    className="w-full h-56 rounded-2xl bg-white border border-slate-200 overflow-hidden relative cursor-pointer group-hover:border-blue-400 transition-all shadow-inner mb-4"
                  >
                    <div className="w-[794px] absolute left-1/2 -translate-x-1/2 top-1 origin-top pointer-events-none">
                      <CVRenderer
                        data={{ ...samplePreviewCVData, templateId: tpl.id }}
                        scale={0.38}
                        containerId={`grid-preview-${tpl.id}`}
                      />
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#172B49]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-xs">
                      <Eye className="w-4 h-4" />
                      <span>Buka Pratinjau Penuh</span>
                    </div>
                  </div>

                  {/* Cocok Untuk */}
                  <div className="space-y-1 mb-4">
                    {tpl.recommendedFor.slice(0, 2).map((rec: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-[#496A96]">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setPreviewTemplate(tpl)}
                    className="flex-1 py-2 rounded-xl glass-inset hover:bg-white text-xs font-semibold text-[#172B49] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#496A96]" />
                    <span>Lihat Preview</span>
                  </button>
                  <button
                    onClick={() => setMethodModalTemplate(tpl)}
                    className="flex-1 py-2 rounded-xl bg-[#172B49] hover:bg-[#243B80] text-white text-xs font-bold transition-all shadow-md shadow-[#172B49]/20 flex items-center justify-center gap-1.5"
                  >
                    <span>Pakai Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Modal 1: Live Fullscreen Preview Modal with Sample Data */}
        {previewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-4xl max-h-[92vh] glass-card bg-white/95 rounded-3xl shadow-2xl p-5 sm:p-6 overflow-hidden flex flex-col border border-white">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4 shrink-0">
                <div>
                  <h3 className="text-base font-bold text-[#172B49] flex items-center gap-2">
                    <span>Pratinjau Template: {previewTemplate.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      Sample Data Aktif
                    </span>
                  </h3>
                  <p className="text-xs text-[#718096]">{previewTemplate.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const t = previewTemplate;
                      setPreviewTemplate(null);
                      setMethodModalTemplate(t);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#172B49] hover:bg-[#243B80] text-white text-xs font-bold shadow-md shadow-[#172B49]/20 transition-all flex items-center gap-1.5"
                  >
                    <span>Pakai Template Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* A4 Rendered Canvas with Sample Data */}
              <div className="flex-1 overflow-y-auto p-4 bg-slate-100/80 rounded-2xl flex justify-center shadow-inner">
                <CVRenderer
                  data={{ ...samplePreviewCVData, templateId: previewTemplate.id }}
                  scale={0.82}
                  containerId="preview-modal-sheet"
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: 3-Options Creation Method Selector Modal */}
        {methodModalTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-2xl rounded-3xl glass-card border border-white/90 shadow-2xl p-6 sm:p-8 bg-white/95 flex flex-col overflow-hidden">
              {/* Glow ambient */}
              <div className="absolute -top-12 -right-12 w-44 h-44 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#172B49] text-white flex items-center justify-center font-bold shadow-md">
                    <Sparkles className="w-5 h-5 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#172B49]">
                      Pilih Cara Memulai CV Anda
                    </h3>
                    <p className="text-xs text-[#718096]">
                      Template terpilih: <span className="font-semibold text-blue-600">{methodModalTemplate.name}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMethodModalTemplate(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 3 Interactive Cards */}
              <div className="space-y-3.5 mb-2">
                {/* Opsi 1: Lembar Kosong (Manual Isi) */}
                <div
                  onClick={() => handleSelectCreationMethod('blank')}
                  className="p-4 sm:p-5 rounded-2xl glass-card border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 cursor-pointer transition-all hover:scale-[1.01] shadow-sm flex items-start gap-4 group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 group-hover:bg-[#172B49] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-sm">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-[#172B49] group-hover:text-blue-600 transition-colors">
                        1. Mulai Lembar Kosong (Manual Isi)
                      </h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        Kontrol Penuh
                      </span>
                    </div>
                    <p className="text-xs text-[#718096] leading-relaxed">
                      Mulai dari kanvas kosong bersih dengan tata letak template ini. Anda mengisi seluruh informasi kontak, pendidikan, dan pengalaman secara mandiri.
                    </p>
                  </div>
                </div>

                {/* Opsi 2: AI Custom CV (Kuesioner & Salin Prompt) */}
                <div
                  onClick={() => handleSelectCreationMethod('ai')}
                  className="p-4 sm:p-5 rounded-2xl glass-card border border-blue-200 hover:border-blue-600 hover:bg-blue-50/50 cursor-pointer transition-all hover:scale-[1.01] shadow-sm flex items-start gap-4 group bg-blue-50/20"
                >
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-[#172B49] group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                        <span>2. AI Custom CV (Form & Salin Prompt)</span>
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        Bisa Salin ke AI Lain
                      </span>
                    </div>
                    <p className="text-xs text-[#718096] leading-relaxed">
                      Isi kuesioner singkat jurusan/keahlian. Dapatkan <strong>prompt profesional siap salin</strong> untuk digunakan di ChatGPT/Claude, atau generate langsung ke CV Anda.
                    </p>
                  </div>
                </div>

                {/* Opsi 3: Student Mode (Bimbingan Siswa & Lengkapi Sendiri) */}
                <div
                  onClick={() => handleSelectCreationMethod('student')}
                  className="p-4 sm:p-5 rounded-2xl glass-card border border-emerald-200 hover:border-emerald-600 hover:bg-emerald-50/50 cursor-pointer transition-all hover:scale-[1.01] shadow-sm flex items-start gap-4 group bg-emerald-50/20"
                >
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-[#172B49] group-hover:text-emerald-700 transition-colors">
                        3. Student Mode (Siswa SMK / Pelajar)
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Khusus Pelajar
                      </span>
                    </div>
                    <p className="text-xs text-[#718096] leading-relaxed">
                      Ikuti alur pengisian form terpandu untuk mengubah tugas praktikum kejuruan dan organisasi sekolah menjadi poin CV bernilai tinggi, lalu lengkapi sisanya di Studio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
