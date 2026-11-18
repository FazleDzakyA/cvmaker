'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroMockup } from '@/components/HeroMockup';
import {
  Sparkles,
  ArrowRight,
  Zap,
  LayoutTemplate,
  ShieldCheck,
  Download,
  Star,
  CheckCircle2,
  GraduationCap,
  ChevronDown,
  Wand2,
  FileText,
  Users,
  Award,
} from 'lucide-react';
import { TEMPLATES_CATALOG } from '@/data/templateCatalog';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [demoInput, setDemoInput] = useState(
    'I created a school website project using HTML, CSS, and JavaScript.'
  );
  const [demoTransformed, setDemoTransformed] = useState(false);

  const faqs = [
    {
      q: 'Is CVGenie truly free for students and fresh graduates?',
      a: 'Yes! All core features including Student Mode, all 6 professional ATS templates, live A4 preview, and direct PDF downloads are completely free to use without requiring any credit card.',
    },
    {
      q: 'How does Student Mode work if I have no formal work experience?',
      a: 'Student Mode specifically highlights academic assignments, vocational capstone projects (SMK RPL/TKJ), student council (OSIS/BEM), competitions, and certifications. Our AI structures these activities into professional action-oriented bullet points without falsifying any credentials.',
    },
    {
      q: 'Does CVGenie fabricate fake achievements or metrics?',
      a: 'Never. CVGenie adheres to strict ethical principles. The AI only reorganizes, clarifies, and elevates your genuine contributions into professional language, asking you for clarifications whenever details are missing.',
    },
    {
      q: 'What is an ATS CV and why does it matter for internships (PKL/Magang)?',
      a: 'Applicant Tracking Systems (ATS) are software used by recruiters to parse and filter resumes automatically. Many graphics-heavy resumes get scrambled. CVGenie templates are engineered with standard scannable headers, clean typography, and optimized keyword placement to pass automated parsers with high scores.',
    },
    {
      q: 'Can I export to PDF with selectable text and true A4 proportions?',
      a: 'Yes. You can export directly with our one-click PDF engine, or use native vector print to produce high-resolution, pixel-perfect A4 documents with selectable text that preserves your chosen styling.',
    },
  ];

  return (
    <div className="min-h-screen cvgenie-ambient-bg flex flex-col justify-between overflow-x-hidden">
      {/* Top Navigation */}
      <Navbar />

      <main className="w-full flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-6 pb-20 md:pt-12 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-white/80 shadow-sm text-xs font-bold text-slate-800">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AI-Powered CV Builder for Students</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-extrabold text-[#101A3C] tracking-tight leading-[1.12]">
                Create Your Professional CV <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  with AI Ease.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Build, customize, and generate a stunning CV in minutes. Let AI help you stand out and get the job or internship you deserve!
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/builder"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <span>Start Creating Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/student-mode"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl glass-card border border-white/80 hover:bg-white text-slate-800 text-xs sm:text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  <span>Try Student Mode</span>
                </Link>
              </div>

              {/* Feature Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4">
                {[
                  { label: 'AI Writing Assistant', icon: Zap },
                  { label: 'Professional Templates', icon: LayoutTemplate },
                  { label: 'ATS Optimized & Analysis', icon: ShieldCheck },
                  { label: 'Export to PDF', icon: Download },
                ].map((feat, i) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={i}
                      className="p-3 rounded-2xl glass-card border border-white/80 text-center flex flex-col items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 leading-tight">
                        {feat.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Social Proof Bar */}
              <div className="pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs text-slate-600">
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
                  ].map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Student Avatar"
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <div className="text-center sm:text-left">
                  <div className="font-bold text-slate-900">Trusted by 500K+ students across Indonesia</div>
                  <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500 text-[11px]">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-semibold text-slate-600 ml-1">4.9/5 from 200K+ reviews</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Mockup (5 cols) */}
            <div className="lg:col-span-5 relative">
              <HeroMockup />
            </div>
          </div>
        </section>

        {/* STUDENT MODE INTERACTIVE SHOWCASE */}
        <section className="py-16 bg-white/50 backdrop-blur-md border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mb-3">
                <GraduationCap className="w-4 h-4" />
                <span>Signature Student Feature</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101A3C] tracking-tight mb-3">
                No Work Experience? No Problem.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                See how CVGenie turns simple everyday school assignments into punchy, recruiter-grade bullet points without fabricating achievements.
              </p>
            </div>

            {/* Interactive Demo Card */}
            <div className="max-w-3xl mx-auto rounded-3xl glass-card border border-white/90 shadow-xl p-6 sm:p-8 bg-white/85">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* User Input */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <span>What You Input (Simple Words)</span>
                  </span>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700">
                    &ldquo;{demoInput}&rdquo;
                  </div>
                  <button
                    onClick={() => setDemoTransformed(!demoTransformed)}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>{demoTransformed ? 'Reset Demo' : 'Transform with AI'}</span>
                  </button>
                </div>

                {/* AI Transformed Output */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/90 to-purple-50/90 border border-purple-200/80 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> What the Recruiter Sees:
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      ATS Verified
                    </span>
                  </div>

                  <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-800 leading-relaxed">
                    <li>Developed a responsive website using HTML, CSS, and modern JavaScript.</li>
                    <li>Implemented interactive user interface components with mobile accessibility.</li>
                    <li>Applied fundamental web development principles through a practical academic project.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TEMPLATES SHOWCASE */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-3">
                <LayoutTemplate className="w-4 h-4" />
                <span>6 Production Templates</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101A3C] tracking-tight">
                Choose from Field-Tested Layouts
              </h2>
            </div>
            <Link
              href="/templates"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start md:self-auto"
            >
              <span>Explore all templates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES_CATALOG.map((tpl) => (
              <div
                key={tpl.id}
                className="rounded-3xl glass-card border border-white/90 p-6 shadow-md hover:shadow-xl transition-all bg-white/80 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                      {tpl.category}
                    </span>
                    {tpl.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">
                        {tpl.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{tpl.description}</p>
                </div>

                <Link
                  href="/builder"
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Build with this Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 bg-white/40 border-t border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101A3C] tracking-tight mb-3">
                How CVGenie Works
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                From blank canvas to recruiter-ready PDF in 4 simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Select Track or Mode',
                  desc: 'Pick Standard Studio or Student Mode designed for SMK & college learners.',
                },
                {
                  step: '02',
                  title: 'Enter Academic Projects',
                  desc: 'List your assignments, coursework, clubs, and extracurricular activities.',
                },
                {
                  step: '03',
                  title: 'AI Polish & ATS Audit',
                  desc: 'Use AI writing tools to articulate your achievements and verify your ATS score.',
                },
                {
                  step: '04',
                  title: 'Export A4 PDF',
                  desc: 'Download crystal-clear vector PDF resumes ready for internship and job submissions.',
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl glass-card border border-white/80 shadow-sm bg-white/70 space-y-3 relative"
                >
                  <span className="text-3xl font-black text-blue-600/30">{step.step}</span>
                  <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STUDENT TESTIMONIALS */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101A3C] tracking-tight mb-3">
              Loved by Students Across Indonesia
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Hear from students who landed their dream internships and entry-level positions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  'As an SMK student applying for PKL/Magang, I was terrified because I had zero formal job history. CVGenie helped me turn our school library app assignment into a legit technical project. Landed my internship at a top software agency in Semarang!',
                name: 'Fazle Dzaky Aryaguna',
                role: 'SMK Negeri 7 Semarang (RPL) -> Frontend Intern',
                img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
              },
              {
                quote:
                  'The ATS checker showed me that my old Word CV was missing industry keywords and active verbs. After 5 minutes with the AI writing assistant, my score jumped from 64 to 98. Got 3 interview invites in 2 weeks!',
                name: 'Nadia Salsabila',
                role: 'Informatics Fresh Graduate (UGM)',
                img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
              },
              {
                quote:
                  'The liquid glass design is stunning and so fast to use. Plus it never makes up fake credentials. Highly recommended for any vocational student preparing their portfolio.',
                name: 'Rian Pratama',
                role: 'Vocational High School (SMKN 1 Jakarta)',
                img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl glass-card border border-white/80 shadow-md bg-white/70 flex flex-col justify-between space-y-4"
              >
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                    <p className="text-[10px] text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101A3C] tracking-tight mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Clear answers to help you navigate your first CV building journey.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl glass-card border border-white/80 bg-white/80 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl p-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl shadow-blue-500/25 space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Your Future Starts With a Better CV.
            </h2>
            <p className="text-xs sm:text-sm text-white/90 max-w-lg mx-auto leading-relaxed">
              Join over 500,000 students and fresh graduates who have unlocked internships, scholarships, and entry-level jobs with CVGenie.
            </p>
            <div className="pt-2">
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-blue-700 text-xs sm:text-sm font-bold hover:bg-blue-50 shadow-lg transition-transform hover:scale-105"
              >
                <span>Start Creating Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
