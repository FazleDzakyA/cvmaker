'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StudentDiscoveryWizard } from '@/components/student/StudentDiscoveryWizard';
import { GraduationCap, Sparkles, CheckCircle2, ShieldCheck, Star } from 'lucide-react';

export default function StudentModePage() {
  return (
    <div className="min-h-screen cvgenie-ambient-bg flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Header Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mb-4 shadow-sm">
            <GraduationCap className="w-4 h-4" />
            <span>Dedicated Student & SMK Mode</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#101A3C] tracking-tight mb-4">
            No Work Experience? <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              No Problem. Your Potential Matters.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            School projects, student organization leadership (OSIS/BEM), class assignments, competitions, and practical coursework demonstrate real competencies when presented with professional clarity.
          </p>
        </div>

        {/* Wizard Container */}
        <div className="mb-16">
          <StudentDiscoveryWizard />
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
          <div className="p-6 rounded-3xl glass-card border border-white/80 shadow-md space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">AI Experience Transformer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Turns ordinary school projects into impactful bullet points without fabricating achievements or false technologies.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-white/80 shadow-md space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">PKL & Internship Tailored</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Formats specifically structured for Indonesian SMK Prakerin / PKL, campus internships, and fresh graduate applications.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-white/80 shadow-md space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Zero Fabrication Guarantee</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict ethical boundaries: We articulate what you have genuinely learned, tested, and built, keeping your integrity intact.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
