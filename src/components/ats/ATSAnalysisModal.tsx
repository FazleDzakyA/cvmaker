'use client';

import React from 'react';
import { ATSAnalysisReport } from '@/types/cv';
import { CheckCircle2, AlertCircle, X, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

interface ATSAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ATSAnalysisReport;
  onAutoFix?: (suggestionId: string) => void;
}

export const ATSAnalysisModal: React.FC<ATSAnalysisModalProps> = ({
  isOpen,
  onClose,
  report,
  onAutoFix,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl glass-card border border-white/90 shadow-2xl p-6 sm:p-8 bg-white/95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">ATS CV Compatibility Checker</h3>
              <p className="text-xs text-slate-500">Applicant Tracking System heuristic scannability score & audit.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Main Score Card */}
          <div className="sm:col-span-1 rounded-2xl bg-gradient-to-br from-slate-900 to-[#101A3C] text-white p-5 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 rounded-full blur-xl" />
            <div className="text-[11px] uppercase tracking-wider font-bold text-blue-300 mb-1">
              Overall Score
            </div>
            <div className="text-4xl font-extrabold tracking-tight text-white mb-1 flex items-baseline gap-1">
              <span>{report.overallScore}</span>
              <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{report.statusLabel}</span>
            </div>
          </div>

          {/* Sub-metrics Breakdown */}
          <div className="sm:col-span-2 grid grid-cols-2 gap-2.5">
            {[
              { label: 'Content Structure', score: report.structureScore, max: 20 },
              { label: 'Keyword Relevance', score: report.keywordScore, max: 20 },
              { label: 'Readability & Verbs', score: report.readabilityScore, max: 20 },
              { label: 'Skills Density', score: report.skillsScore, max: 20 },
            ].map((metric, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-700">{metric.label}</span>
                <div className="mt-2 flex items-center justify-between">
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mr-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${(metric.score / metric.max) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-900 shrink-0">
                    {metric.score}/{metric.max}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detected Keywords Tags */}
        <div className="mb-6">
          <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">
            Identified Industry Keywords ({report.detectedKeywords.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {report.detectedKeywords.map((kw, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium"
              >
                ✓ {kw}
              </span>
            ))}
            {report.missingKeywords.slice(0, 4).map((kw, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 border border-dashed border-slate-300 font-normal"
              >
                + Consider: {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Detailed Suggestions */}
        <div className="mb-6">
          <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2.5">
            Improvement Recommendations
          </h4>
          {report.suggestions.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Great job! Your CV contains strong section balance, clear keywords, and actionable metrics.</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {report.suggestions.map((sug) => (
                <div
                  key={sug.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-white hover:border-slate-200 shadow-sm flex items-start gap-3"
                >
                  <AlertCircle
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      sug.severity === 'high' ? 'text-amber-500' : 'text-blue-500'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-slate-900">{sug.title}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-100 text-slate-600">
                        {sug.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{sug.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-500 leading-normal">
          <span className="font-semibold text-slate-700">Disclaimer: </span>
          This ATS score is an automated estimation based on standard applicant tracking system criteria (scannability, keyword density, section headers, active verbs). Different recruitment systems vary in parsing algorithms and weightings.
        </div>

        {/* Close Button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
};
