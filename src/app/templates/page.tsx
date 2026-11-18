'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TEMPLATES_CATALOG, TemplateMeta } from '@/data/templateCatalog';
import { samplePreviewCVData } from '@/data/samplePreviewCVData';
import { CVRenderer } from '@/components/templates/CVRenderer';
import { LayoutTemplate, Sparkles, ArrowRight, Eye, X, Check } from 'lucide-react';
import { saveActiveCV, getActiveCV } from '@/lib/storage';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppSidebar } from '@/components/layout/AppSidebar';

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateMeta | null>(null);

  const categories = ['All', 'Student Focused', 'Modern', 'Professional', 'ATS Optimized', 'Engineering'];

  const filtered =
    selectedCategory === 'All'
      ? TEMPLATES_CATALOG
      : TEMPLATES_CATALOG.filter((t) => t.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleUseTemplate = (templateId: any) => {
    const currentCV = getActiveCV();
    saveActiveCV({ ...currentCV, templateId });
    router.push('/builder');
  };

  return (
    <AuthGuard>
      <div className="misty-mountain-viewport min-h-screen flex flex-col md:flex-row p-3 sm:p-5 lg:p-6 overflow-x-hidden selection:bg-blue-200">
        {/* Single Unified App Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col md:pl-20 max-w-[1400px] mx-auto w-full min-w-0 pb-20 md:pb-6">
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
                    ? 'bg-[#172B49] text-white shadow-md shadow-[#172B49]/20'
                    : 'glass-inset text-[#718096] hover:text-[#172B49] hover:bg-white border border-white/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid with Visual Mini Previews */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filtered.map((tpl) => (
              <div
                key={tpl.id}
                className="rounded-3xl glass-card border border-white/90 p-5 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group bg-white/75"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {tpl.category}
                    </span>
                    {tpl.badge && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">
                        {tpl.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#172B49] mb-1 group-hover:text-blue-700 transition-colors">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-[#718096] leading-relaxed mb-4">{tpl.description}</p>

                  {/* Visual Document Preview Sheet Container */}
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
                    onClick={() => handleUseTemplate(tpl.id)}
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

        {/* Live Fullscreen Preview Modal with Sample Data */}
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
                    onClick={() => handleUseTemplate(previewTemplate.id)}
                    className="px-4 py-2 rounded-xl bg-[#172B49] hover:bg-[#243B80] text-white text-xs font-bold shadow-md shadow-[#172B49]/20 transition-all flex items-center gap-1.5"
                  >
                    <span>Gunakan di Studio CV</span>
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
      </div>
    </AuthGuard>
  );
}
