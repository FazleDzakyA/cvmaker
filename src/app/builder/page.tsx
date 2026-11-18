'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Download,
  Printer,
  Eye,
  ZoomIn,
  ZoomOut,
  Palette,
  LayoutTemplate,
  ShieldCheck,
  GraduationCap,
  Check,
  ChevronRight,
  ArrowLeft,
  Wand2,
  Database,
  RotateCcw,
} from 'lucide-react';
import { CVData } from '@/types/cv';
import { blankCVData } from '@/data/initialCVData';
import { getActiveCV, saveActiveCV } from '@/lib/storage';
import { SectionForm } from '@/components/builder/SectionForm';
import { CVRenderer } from '@/components/templates/CVRenderer';
import { ATSAnalysisModal } from '@/components/ats/ATSAnalysisModal';
import { AICustomCVGeneratorModal } from '@/components/builder/AICustomCVGeneratorModal';
import { analyzeCVWithATS } from '@/lib/atsScorer';
import { downloadCVPdf, triggerPrintDialog } from '@/lib/pdfExporter';
import { TEMPLATES_CATALOG } from '@/data/templateCatalog';
import { useAuth } from '@/context/AuthContext';

export default function BuilderPage() {
  const { user, isConfigured, saveCVToDB } = useAuth();
  const [cvData, setCvData] = useState<CVData>(blankCVData);
  const [zoomScale, setZoomScale] = useState<number>(0.85);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [atsModalOpen, setAtsModalOpen] = useState<boolean>(false);
  const [aiCustomModalOpen, setAiCustomModalOpen] = useState<boolean>(false);
  const [templateMenuOpen, setTemplateMenuOpen] = useState<boolean>(false);
  const [colorPickerOpen, setColorPickerOpen] = useState<boolean>(false);

  // Load from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cvgenie_user_cvs_v1');
      localStorage.removeItem('cvgenie_active_cv_id_v1');
    }
    const saved = getActiveCV();
    if (saved && saved.personalInfo?.fullName !== 'Fazle Dzaky Aryaguna' && saved.id !== 'cv-fazle-01') {
      setCvData(saved);
    } else {
      const fresh: CVData = {
        ...blankCVData,
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cv-${Date.now()}`,
      };
      setCvData(fresh);
      saveActiveCV(fresh);
    }
  }, []);

  const handleResetBlank = () => {
    if (confirm('Kosongkan semua data dan mulai CV baru dari lembar kosong?')) {
      const fresh: CVData = {
        ...blankCVData,
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cv-${Date.now()}`,
      };
      setCvData(fresh);
      saveActiveCV(fresh);
    }
  };

  // Auto-save on changes (LocalStorage + Supabase DB)
  const handleDataChange = async (updated: CVData) => {
    setCvData(updated);
    setIsSaved(false);
    saveActiveCV(updated);
    if (user && isConfigured) {
      await saveCVToDB(updated);
    }
    setTimeout(() => setIsSaved(true), 400);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const fileName = `${cvData.personalInfo.fullName || 'CVGenie'}_CV`;
      await downloadCVPdf('cv-document-sheet', fileName);
    } catch (e) {
      console.error(e);
      triggerPrintDialog();
    } finally {
      setIsExporting(false);
    }
  };

  const atsReport = analyzeCVWithATS(cvData);

  const ACCENT_COLORS = [
    { label: 'Electric Blue', hex: '#6685FF' },
    { label: 'Deep Blue', hex: '#243B80' },
    { label: 'Royal Violet', hex: '#8B5CF6' },
    { label: 'Emerald Mint', hex: '#10B981' },
    { label: 'Rose Pink', hex: '#EC4899' },
    { label: 'Amber Gold', hex: '#F59E0B' },
    { label: 'Slate Charcoal', hex: '#334155' },
  ];

  return (
    <div className="min-h-screen cvgenie-ambient-bg flex flex-col overflow-x-hidden">
      {/* Top Studio Header with Liquid Glass Blur */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-white/80 shadow-sm px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Breadcrumbs & Brand */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/" className="flex items-center gap-1.5 text-slate-800 hover:text-blue-600 font-bold group">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xs shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                ✦
              </div>
              <span className="text-[#101A3C]">CV<span className="text-blue-600">Genie</span></span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Studio</span>

            {/* Sync & Saved indicator */}
            <span className="hidden sm:inline-flex items-center gap-1 ml-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
              <span>{isConfigured && user ? 'Synced to Supabase' : isSaved ? 'Auto-saved' : 'Saving...'}</span>
            </span>
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex items-center gap-2">
            {/* New / Reset Blank CV */}
            <button
              onClick={handleResetBlank}
              className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 shadow-sm"
              title="Kosongkan dan mulai CV baru dari lembar kosong"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Mulai Lembar Kosong</span>
            </button>

            {/* AI Custom CV Generator Button ("Kalau ga suka template nya, AI nya suruh buat") */}
            <button
              onClick={() => setAiCustomModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-purple-500/25 hover:scale-105 animate-pulse"
              title="Gak suka template? Suruh AI rancang CV khusus Anda!"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>AI Custom CV</span>
            </button>

            {/* Student Mode Shortcut */}
            <Link
              href="/student-mode"
              className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-purple-200"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Student Mode</span>
            </Link>

            {/* ATS Score Button */}
            <button
              onClick={() => setAtsModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ATS {atsReport.overallScore}/100</span>
            </button>

            {/* Print / Vector */}
            <button
              onClick={triggerPrintDialog}
              title="Print / Vector Save"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Export PDF Button */}
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Generating PDF...' : 'Export PDF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Two-Column Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: CV Editing Form (5 cols) */}
        <section className="lg:col-span-5 h-[calc(100vh-120px)] sticky top-20 flex flex-col">
          <SectionForm cvData={cvData} onChange={handleDataChange} />
        </section>

        {/* Right Column: Live A4 Document Preview Canvas (7 cols) */}
        <section className="lg:col-span-7 flex flex-col space-y-3">
          {/* Preview Controls Bar with Glass Styling */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl glass-card border border-white/90 shadow-sm bg-white/75 backdrop-blur-xl">
            {/* Template Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setTemplateMenuOpen(!templateMenuOpen)}
                className="px-3 py-1.5 rounded-xl bg-white/90 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <LayoutTemplate className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  Template:{' '}
                  {TEMPLATES_CATALOG.find((t) => t.id === cvData.templateId)?.name || 'Minimalist'}
                </span>
              </button>

              {templateMenuOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/90 shadow-2xl p-2 z-30 space-y-1 animate-in fade-in">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Pilih Desain Template
                  </div>
                  {TEMPLATES_CATALOG.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => {
                        handleDataChange({ ...cvData, templateId: tpl.id });
                        setTemplateMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        cvData.templateId === tpl.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div>{tpl.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{tpl.category}</div>
                      </div>
                      {cvData.templateId === tpl.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Accent Color Palette Dropdown */}
            <div className="relative">
              <button
                onClick={() => setColorPickerOpen(!colorPickerOpen)}
                className="px-3 py-1.5 rounded-xl bg-white/90 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-slate-300"
                  style={{ backgroundColor: cvData.accentColor }}
                />
                <span>Accent Color</span>
              </button>

              {colorPickerOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/90 shadow-2xl p-3 z-30 space-y-2 animate-in fade-in">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Pilih Warna Aksen
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {ACCENT_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => {
                          handleDataChange({ ...cvData, accentColor: c.hex });
                          setColorPickerOpen(false);
                        }}
                        title={c.label}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          cvData.accentColor === c.hex
                            ? 'border-slate-900 scale-110 shadow-sm'
                            : 'border-white hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white/90 border border-slate-200 rounded-xl px-2 py-1 text-xs shadow-sm">
              <button
                onClick={() => setZoomScale(Math.max(0.5, zoomScale - 0.1))}
                className="p-1 hover:text-blue-600 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="w-12 text-center font-semibold text-slate-700">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale(Math.min(1.2, zoomScale + 0.1))}
                className="p-1 hover:text-blue-600 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Live Document Canvas Sheet with Liquid Glass Pedestal */}
          <div className="relative rounded-3xl glass-card border border-white/90 p-4 sm:p-6 overflow-auto max-h-[calc(100vh-180px)] flex justify-center shadow-xl bg-slate-300/30 backdrop-blur-md">
            <CVRenderer data={cvData} scale={zoomScale} containerId="cv-document-sheet" />
          </div>
        </section>
      </main>

      {/* ATS Analysis Modal */}
      <ATSAnalysisModal
        isOpen={atsModalOpen}
        onClose={() => setAtsModalOpen(false)}
        report={atsReport}
      />

      {/* AI Custom CV Generator Modal */}
      <AICustomCVGeneratorModal
        isOpen={aiCustomModalOpen}
        onClose={() => setAiCustomModalOpen(false)}
        currentCV={cvData}
        onApplyCustomCV={handleDataChange}
      />
    </div>
  );
}
