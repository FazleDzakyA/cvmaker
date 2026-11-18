'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ShieldCheck, CheckCircle2, AlertCircle, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { getActiveCV } from '@/lib/storage';
import { analyzeCVWithATS } from '@/lib/atsScorer';
import { defaultCVData } from '@/data/initialCVData';
import { ATSAnalysisReport } from '@/types/cv';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function ATSCheckerPage() {
  const [report, setReport] = useState<ATSAnalysisReport | null>(null);

  useEffect(() => {
    const cv = getActiveCV() || defaultCVData;
    const res = analyzeCVWithATS(cv);
    setReport(res);
  }, []);

  if (!report) return null;

  return (
    <AuthGuard>
      <div className="misty-mountain-viewport min-h-screen flex flex-col justify-between selection:bg-blue-200">
        <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-4 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Applicant Tracking System Audit</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#101A3C] tracking-tight mb-4">
            Is Your CV ATS-Ready?
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Over 75% of resumes are filtered out by automated screening bots before reaching a recruiter. We analyze your structure, keywords, and action verbs in real-time.
          </p>
        </div>

        {/* ATS Score Overview Card */}
        <div className="rounded-3xl glass-card border border-white/90 p-8 shadow-xl bg-white/85 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Score Ring Gauge (5 cols) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-[#101A3C] to-[#243B80] text-white shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
              <div className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-2">
                Overall Compatibility Score
              </div>
              <div className="text-6xl font-black tracking-tight text-white mb-2 flex items-baseline gap-1">
                <span>{report.overallScore}</span>
                <span className="text-base font-normal text-slate-400">/ 100</span>
              </div>
              <div className="px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{report.statusLabel}</span>
              </div>
              <p className="text-[11px] text-slate-300 text-center mt-4 max-w-xs leading-relaxed">
                Your resume demonstrates strong structural completeness and active action verbs.
              </p>
            </div>

            {/* Checklist items (7 cols) */}
            <div className="md:col-span-7 space-y-3.5">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Detailed Heuristic Checklist</h3>

              {[
                { label: 'Content Structure & Contact Information', pass: report.structureScore >= 15 },
                { label: 'Industry & Technical Keyword Relevance', pass: report.keywordScore >= 12 },
                { label: 'Readability & Quantifiable Action Verbs', pass: report.readabilityScore >= 12 },
                { label: 'Section Formatting & Standard Margins', pass: report.formattingScore >= 14 },
                { label: 'Categorized Skills Density', pass: report.skillsScore >= 15 },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        item.pass
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-amber-100 text-amber-600'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800">{item.label}</span>
                  </div>
                  <span
                    className={`text-[11px] font-bold ${
                      item.pass ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {item.pass ? 'Optimal' : 'Needs Polish'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actionable Suggestions */}
        <div className="rounded-3xl glass-card border border-white/90 p-8 shadow-md bg-white/80 mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Key Improvement Recommendations</h2>
              <p className="text-xs text-slate-500">Heuristics to help your resume stand out to hiring managers.</p>
            </div>
            <Link
              href="/builder"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
            >
              <span>Edit in Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {report.suggestions.map((sug) => (
              <div
                key={sug.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3.5"
              >
                <AlertCircle
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    sug.severity === 'high' ? 'text-amber-500' : 'text-blue-500'
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">{sug.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-600">
                      {sug.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{sug.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 text-xs text-slate-500 leading-relaxed text-center max-w-2xl mx-auto">
          <span className="font-semibold text-slate-700">Important Disclaimer: </span>
          This ATS score is an estimate based on industry best practices and standard ATS parsing rules. It is not an absolute guarantee of passing any specific company’s internal applicant tracking filter.
        </div>
      </main>

      <Footer />
    </div>
    </AuthGuard>
  );
}
