'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TEMPLATES_CATALOG, TemplateMeta } from '@/data/templateCatalog';
import { defaultCVData } from '@/data/initialCVData';
import { CVRenderer } from '@/components/templates/CVRenderer';
import { LayoutTemplate, Sparkles, ArrowRight, Check, Eye, X, GraduationCap } from 'lucide-react';
import { saveActiveCV, getActiveCV } from '@/lib/storage';
import { useRouter } from 'next/navigation';

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
    <div className="min-h-screen cvgenie-ambient-bg flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-4 shadow-sm">
            <LayoutTemplate className="w-4 h-4" />
            <span>Curated CV Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#101A3C] tracking-tight mb-4">
            Professional CV Templates <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Engineered to Get Interviews.
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Choose from 6 genuinely functional layouts designed for vocational students (SMK), university undergraduates, and fresh graduates.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white/80 text-slate-600 hover:bg-white hover:text-blue-600 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filtered.map((tpl) => (
            <div
              key={tpl.id}
              className="rounded-3xl glass-card border border-white/90 p-6 shadow-md hover:shadow-xl transition-all bg-white/80 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                    {tpl.category}
                  </span>
                  {tpl.badge && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">
                      {tpl.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{tpl.description}</p>

                {/* Recommended For pills */}
                <div className="mb-6">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Recommended For:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {tpl.recommendedFor.map((item, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setPreviewTemplate(tpl)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => handleUseTemplate(tpl.id)}
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Student Mode Bottom Callout */}
        <div className="rounded-3xl p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
              <GraduationCap className="w-4 h-4" />
              <span>Specialized Student Architecture</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">First Time Creating a Resume?</h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Use our guided Student Mode questionnaire to transform non-formal school projects and student organization roles into ATS-friendly experiences.
            </p>
          </div>
          <Link
            href="/student-mode"
            className="px-6 py-3 rounded-2xl bg-white text-blue-700 text-xs font-bold hover:bg-blue-50 transition-colors shadow-lg shrink-0 flex items-center gap-2"
          >
            <span>Launch Student Mode</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Live Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">{previewTemplate.name}</h3>
                <p className="text-xs text-slate-500">{previewTemplate.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUseTemplate(previewTemplate.id)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 transition-colors"
                >
                  Use Template in Studio
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-100 rounded-2xl flex justify-center">
              <CVRenderer
                data={{ ...defaultCVData, templateId: previewTemplate.id }}
                scale={0.8}
                containerId="preview-modal-sheet"
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
