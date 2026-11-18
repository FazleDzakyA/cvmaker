'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, AlertCircle, Sparkles, ArrowRight, RefreshCw, FileText } from 'lucide-react';
import { getActiveCV } from '@/lib/storage';
import { analyzeCVWithATS } from '@/lib/atsScorer';
import { samplePreviewCVData } from '@/data/samplePreviewCVData';
import { ATSAnalysisReport } from '@/types/cv';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppSidebar } from '@/components/layout/AppSidebar';

export default function ATSCheckerPage() {
  const [report, setReport] = useState<ATSAnalysisReport | null>(null);

  useEffect(() => {
    const active = getActiveCV();
    const cvToScore = active && active.personalInfo?.fullName ? active : samplePreviewCVData;
    const res = analyzeCVWithATS(cvToScore);
    setReport(res);
  }, []);

  if (!report) return null;

  return (
    <AuthGuard>
      <div className="misty-mountain-viewport min-h-screen flex flex-col md:flex-row p-3 sm:p-5 lg:p-6 overflow-x-hidden selection:bg-blue-200">
        {/* Single Unified App Sidebar */}
        <AppSidebar />

        <main className="flex-1 flex flex-col md:pl-20 max-w-4xl mx-auto w-full min-w-0 pb-20 md:pb-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-emerald-800 text-xs font-bold mb-3 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Applicant Tracking System (ATS) Audit Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B49] tracking-tight mb-2">
              Apakah CV Anda Siap Lolos ATS?
            </h1>
            <p className="text-xs sm:text-sm text-[#718096]">
              Lebih dari 75% CV disaring oleh robot pemindai otomatis sebelum dibaca HRD. Algoritma kami memvalidasi format, kata kerja aktif, dan keterbacaan data Anda secara instan.
            </p>
          </div>

          {/* ATS Score Overview Card */}
          <div className="rounded-3xl glass-card border border-white/90 p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden bg-white/85">
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
                  <h2 className="text-lg font-bold text-[#172B49]">Kualitas Resume Terverifikasi</h2>
                  <p className="text-xs text-[#718096] max-w-sm mt-0.5">
                    Format tata letak bersih dan tidak menggunakan tabel bersarang yang membingungkan bot parser.
                  </p>
                </div>
              </div>

              <Link
                href="/builder"
                className="w-full md:w-auto px-5 py-3 rounded-2xl bg-[#172B49] hover:bg-[#243B80] text-white text-xs font-bold shadow-lg shadow-[#172B49]/20 flex items-center justify-center gap-2 transition-all shrink-0"
              >
                <FileText className="w-4 h-4" />
                <span>Buka & Edit di Studio CV</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-5 rounded-3xl glass-card bg-white/75 border border-white/80 space-y-3">
              <h3 className="text-xs font-bold text-[#172B49] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kekuatan Resume Anda</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Struktur hierarki kontak dan pendidikan terbaca jelas.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Ukuran proporsi kertas standar A4 sesuai mesin cetak.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Format tipografi bersih bebas elemen grafis berat.</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-3xl glass-card bg-white/75 border border-white/80 space-y-3">
              <h3 className="text-xs font-bold text-[#172B49] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Saran Optimasi Tambahan</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Sertakan tautan portofolio atau media sosial profesional.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Gunakan tombol AI di Studio untuk memperkuat poin kalimat.</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
