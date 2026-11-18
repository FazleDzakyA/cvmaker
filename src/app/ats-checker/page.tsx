'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FileText,
  Check,
  Folder,
  Layers,
  ChevronDown,
  ExternalLink,
  Plus,
  Wand2,
} from 'lucide-react';
import { getActiveCV, saveActiveCV, getStoredCVs } from '@/lib/storage';
import { analyzeCVWithATS } from '@/lib/atsScorer';
import { samplePreviewCVData } from '@/data/samplePreviewCVData';
import { ATSAnalysisReport, CVData } from '@/types/cv';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { useAuth } from '@/context/AuthContext';

export default function ATSCheckerPage() {
  const router = useRouter();
  const { fetchUserCVs, user } = useAuth();
  const [cvList, setCvList] = useState<CVData[]>([]);
  const [selectedCV, setSelectedCV] = useState<CVData | null>(null);
  const [report, setReport] = useState<ATSAnalysisReport | null>(null);
  const [isLoadingCVs, setIsLoadingCVs] = useState<boolean>(true);
  const [jobDescInput, setJobDescInput] = useState<string>('');
  const [isAnalyzingJD, setIsAnalyzingJD] = useState<boolean>(false);
  const [jdMatchResult, setJdMatchResult] = useState<{
    matchScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    recommendations: string[];
  } | null>(null);

  // Load available CVs from DB and local storage
  useEffect(() => {
    const loadCVs = async () => {
      setIsLoadingCVs(true);
      try {
        let dbCVs: CVData[] = [];
        if (user) {
          dbCVs = await fetchUserCVs();
        }
        const localCVs = getStoredCVs();
        const active = getActiveCV();

        // Combine and deduplicate CVs
        const combinedMap = new Map<string, CVData>();

        // 1. Always add benchmark sample CV as an option
        combinedMap.set('sample-benchmark', {
          ...samplePreviewCVData,
          id: 'sample-benchmark',
          title: 'CV Contoh Standar (Sample Benchmark)',
        });

        // 2. Add active CV if exists
        if (active && active.id) {
          combinedMap.set(active.id, active);
        }

        // 3. Add local CVs
        localCVs.forEach((c) => {
          if (c.id && !combinedMap.has(c.id)) {
            combinedMap.set(c.id, c);
          }
        });

        // 4. Add DB CVs
        dbCVs.forEach((c) => {
          if (c.id) {
            combinedMap.set(c.id, c);
          }
        });

        const list = Array.from(combinedMap.values());
        setCvList(list);

        // Pick initial selected CV: preferred active CV or first item
        const initial =
          (active && active.personalInfo?.fullName && combinedMap.get(active.id)) ||
          list.find((c) => c.id !== 'sample-benchmark') ||
          list[0];

        setSelectedCV(initial);
        setReport(analyzeCVWithATS(initial));
      } catch (e) {
        console.error('Error loading CVs for ATS checker:', e);
        setSelectedCV(samplePreviewCVData);
        setReport(analyzeCVWithATS(samplePreviewCVData));
      } finally {
        setIsLoadingCVs(false);
      }
    };

    loadCVs();
  }, [user]);

  // Handle switching selected CV
  const handleSelectCV = (cv: CVData) => {
    setSelectedCV(cv);
    const updatedReport = analyzeCVWithATS(cv);
    setReport(updatedReport);
    setJdMatchResult(null);
  };

  // Analyze match against job description
  const handleAnalyzeJobMatch = async () => {
    if (!jobDescInput.trim() || !selectedCV) return;
    setIsAnalyzingJD(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ats_job_match',
          payload: {
            cvData: selectedCV,
            jobDescription: jobDescInput,
          },
        }),
      });
      const data = await res.json();
      if (data.data) {
        setJdMatchResult(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingJD(false);
    }
  };

  // Open the selected CV in studio
  const handleOpenInStudio = () => {
    if (selectedCV) {
      if (selectedCV.id !== 'sample-benchmark') {
        saveActiveCV(selectedCV);
      }
      router.push('/builder');
    }
  };

  if (!report || !selectedCV) {
    return (
      <div className="misty-mountain-viewport min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs text-[#172B49] font-semibold">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
          <span>Memuat data audit ATS...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="misty-mountain-viewport min-h-screen flex flex-col md:flex-row p-3 sm:p-5 lg:p-6 gap-4 lg:gap-6 overflow-x-hidden selection:bg-blue-200">
        {/* Single Unified App Sidebar */}
        <AppSidebar />

        <main className="flex-1 min-w-0 flex flex-col max-w-4xl mx-auto w-full pb-20 md:pb-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-6 pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-emerald-800 text-xs font-bold mb-3 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Applicant Tracking System (ATS) Audit Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B49] tracking-tight mb-2">
              Apakah CV Anda Siap Lolos ATS?
            </h1>
            <p className="text-xs sm:text-sm text-[#718096]">
              Pilih CV yang ingin Anda audit. Robot algoritma kami mengevaluasi hierarki, kata kerja aksi industri, dan tingkat keterbacaan secara instan.
            </p>
          </div>

          {/* 1. CV SELECTOR SECTION ("ats checker bisa pilih cv mana yang mau di check") */}
          <div className="mb-6 rounded-3xl glass-card border border-white/90 p-5 bg-white/85 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-200/70">
              <div>
                <h3 className="text-xs font-bold text-[#172B49] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Pilih CV yang Ingin Diaudit:</span>
                </h3>
                <p className="text-[11px] text-[#718096]">
                  Klik pada kartu CV di bawah ini untuk melihat audit skor dan saran optimasi spesifik untuk CV tersebut:
                </p>
              </div>
              <Link
                href="/builder"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat CV Baru</span>
              </Link>
            </div>

            {/* List of selectable CV cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cvList.map((cv) => {
                const isSelected = selectedCV.id === cv.id;
                const cvScore = analyzeCVWithATS(cv).overallScore;

                return (
                  <div
                    key={cv.id}
                    onClick={() => handleSelectCV(cv)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all border relative flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-[#172B49] text-white border-[#172B49] shadow-lg shadow-[#172B49]/20 scale-[1.02]'
                        : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200/80 hover:border-blue-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-white/20 text-blue-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {cv.templateId || 'minimalist'}
                        </span>
                        <span
                          className={`text-xs font-extrabold ${
                            isSelected
                              ? 'text-emerald-300'
                              : cvScore >= 80
                              ? 'text-emerald-600'
                              : 'text-amber-600'
                          }`}
                        >
                          ATS {cvScore}/100
                        </span>
                      </div>

                      <h4
                        className={`text-xs font-bold truncate ${
                          isSelected ? 'text-white' : 'text-[#172B49]'
                        }`}
                      >
                        {cv.title || 'Untitled CV'}
                      </h4>
                      <p
                        className={`text-[11px] truncate mt-0.5 ${
                          isSelected ? 'text-slate-300' : 'text-[#718096]'
                        }`}
                      >
                        {cv.personalInfo?.fullName || 'Belum Ada Nama'} • {cv.personalInfo?.jobTitle || 'Belum Ada Posisi'}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                      <span className={isSelected ? 'text-slate-300' : 'text-slate-400'}>
                        {cv.updatedAt || 'Baru'}
                      </span>
                      {isSelected ? (
                        <span className="flex items-center gap-1 font-bold text-emerald-300">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Sedang Diaudit</span>
                        </span>
                      ) : (
                        <span className="text-blue-600 group-hover:underline font-semibold">
                          Audit CV Ini $\rightarrow$
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. ATS SCORE OVERVIEW CARD (For the Selected CV) */}
          <div className="rounded-3xl glass-card border border-white/90 p-6 sm:p-8 shadow-xl mb-6 relative overflow-hidden bg-white/85">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {/* Radial Score Gauge */}
                <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="46"
                      stroke="currentColor"
                      strokeWidth="9"
                      className="text-slate-200/80"
                      fill="transparent"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="46"
                      stroke="currentColor"
                      strokeWidth="9"
                      strokeDasharray={289}
                      strokeDashoffset={289 - (289 * report.overallScore) / 100}
                      strokeLinecap="round"
                      className="text-emerald-500 transition-all duration-1000 ease-out"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-[#172B49]">{report.overallScore}</span>
                    <span className="text-[10px] font-bold text-slate-400">/ 100</span>
                  </div>
                </div>

                <div>
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-1.5 bg-emerald-100 text-emerald-800">
                    Status: {report.statusLabel || 'Sangat Siap Lolos ATS'}
                  </div>
                  <h2 className="text-lg font-bold text-[#172B49]">
                    {selectedCV.title || 'Untitled CV'}
                  </h2>
                  <p className="text-xs text-[#718096] max-w-sm mt-0.5">
                    Kandidat: <strong>{selectedCV.personalInfo?.fullName || 'Belum diisi'}</strong> ({selectedCV.personalInfo?.jobTitle || 'Tanpa Posisi'}).
                  </p>
                </div>
              </div>

              {/* Action: Open selected CV in Studio */}
              <button
                onClick={handleOpenInStudio}
                className="w-full md:w-auto px-5 py-3 rounded-2xl bg-[#172B49] hover:bg-[#243B80] text-white text-xs font-bold shadow-lg shadow-[#172B49]/20 flex items-center justify-center gap-2 transition-all shrink-0 hover:scale-105"
              >
                <FileText className="w-4 h-4" />
                <span>Buka & Edit CV Ini di Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Score Metrics Progress Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-200/80">
              <div className="p-3 rounded-xl bg-slate-50/80 text-center">
                <span className="text-[10px] font-bold text-slate-500 block mb-1">Struktur CV</span>
                <span className="text-sm font-extrabold text-[#172B49]">{report.structureScore}/100</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50/80 text-center">
                <span className="text-[10px] font-bold text-slate-500 block mb-1">Kata Kunci (Keywords)</span>
                <span className="text-sm font-extrabold text-[#172B49]">{report.keywordScore}/100</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50/80 text-center">
                <span className="text-[10px] font-bold text-slate-500 block mb-1">Keterbacaan (Font/Layout)</span>
                <span className="text-sm font-extrabold text-[#172B49]">{report.readabilityScore}/100</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50/80 text-center">
                <span className="text-[10px] font-bold text-slate-500 block mb-1">Format Bersih A4</span>
                <span className="text-sm font-extrabold text-[#172B49]">{report.formattingScore}/100</span>
              </div>
            </div>
          </div>

          {/* 3. BREAKDOWN & SUGGESTIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* Strengths */}
            <div className="p-5 rounded-3xl glass-card bg-white/75 border border-white/80 space-y-3">
              <h3 className="text-xs font-bold text-[#172B49] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kekuatan CV {selectedCV.personalInfo?.fullName || ''}</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>
                    {selectedCV.personalInfo?.email && selectedCV.personalInfo?.phone
                      ? 'Kontak penting (Email & No. HP) lengkap dan mudah dideteksi bot.'
                      : 'Pastikan melengkapi Email dan No. HP di formulir Studio.'}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>
                    {selectedCV.education && selectedCV.education.length > 0
                      ? `Memuat riwayat pendidikan (${selectedCV.education[0]?.institution}).`
                      : 'Tambahkan data sekolah atau universitas.'}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Menggunakan rasio margin A4 standar tanpa tabel tersembunyi.</span>
                </li>
              </ul>
            </div>

            {/* Suggestions */}
            <div className="p-5 rounded-3xl glass-card bg-white/75 border border-white/80 space-y-3">
              <h3 className="text-xs font-bold text-[#172B49] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Saran Optimasi Tambahan</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {report.suggestions && report.suggestions.length > 0 ? (
                  report.suggestions.slice(0, 3).map((sug, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <span>
                        <strong>{sug.title}:</strong> {sug.description}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-center gap-2 text-slate-500">
                    <span>CV ini telah memiliki struktur yang sangat optimal untuk bot ATS.</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* 4. JOB DESCRIPTION MATCHER (AI RELEVANCE EVALUATION) */}
          <div className="rounded-3xl glass-card border border-white/90 p-6 sm:p-7 bg-white/85 shadow-lg mb-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#172B49]">
                    Cocokkan dengan Deskripsi Lowongan (Job Description Matcher)
                  </h3>
                  <p className="text-[11px] text-[#718096]">
                    Tempel teks lowongan kerja untuk mengukur kecocokan kata kunci resume Anda.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                AI Heuristic
              </span>
            </div>

            <textarea
              rows={3}
              value={jobDescInput}
              onChange={(e) => setJobDescInput(e.target.value)}
              placeholder="Tempel syarat, kualifikasi, atau deskripsi pekerjaan dari LinkedIn, JobStreet, atau situs karir di sini..."
              className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 bg-white text-[#172B49] focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none leading-relaxed"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <p className="text-[10px] text-slate-500 leading-tight">
                *Skor ini dihitung secara internal sebagai panduan optimasi kata kunci, bukan jaminan mutlak kelulusan sistem ATS pihak ketiga.
              </p>
              <button
                type="button"
                onClick={handleAnalyzeJobMatch}
                disabled={isAnalyzingJD || !jobDescInput.trim()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50 shrink-0"
              >
                {isAnalyzingJD ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menganalisis Kecocokan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analisis Kecocokan Lowongan</span>
                  </>
                )}
              </button>
            </div>

            {/* Match Results Display */}
            {jdMatchResult && (
              <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-purple-50/80 via-blue-50/50 to-white border border-purple-200 space-y-3.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    <span>Hasil Evaluasi Kesesuaian Lowongan:</span>
                  </div>
                  <span className="text-sm font-extrabold text-purple-800 bg-white px-3 py-1 rounded-xl shadow-sm border border-purple-100">
                    Kecocokan: {jdMatchResult.matchScore}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/80 border border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-800 block mb-1">
                      ✓ Kata Kunci yang Sudah Cocok:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {jdMatchResult.matchedKeywords.map((kw, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/80 border border-amber-200">
                    <span className="text-[11px] font-bold text-amber-800 block mb-1">
                      ⚠ Kata Kunci yang Perlu Ditambahkan:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {jdMatchResult.missingKeywords.map((kw, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {jdMatchResult.recommendations && jdMatchResult.recommendations.length > 0 && (
                  <div className="pt-2 border-t border-purple-100 text-xs text-purple-900 space-y-1">
                    <span className="font-bold text-[11px] block">Rekomendasi Tindakan:</span>
                    <ul className="space-y-1">
                      {jdMatchResult.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-purple-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1 shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
