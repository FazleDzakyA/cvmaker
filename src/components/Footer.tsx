'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/60 bg-white/40 backdrop-blur-md pt-12 pb-8 mt-20 text-slate-600 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#101A3C]">
                CV<span className="text-blue-600">Genie</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your Future Starts With a Better CV. Helping vocational (SMK), high school, and university students turn potential into career opportunities.
            </p>
          </div>

          {/* Features Col */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-900 mb-3">Core Features</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/student-mode" className="hover:text-blue-600 transition-colors">
                  Student Mode (No Experience?)
                </Link>
              </li>
              <li>
                <Link href="/builder" className="hover:text-blue-600 transition-colors">
                  AI CV Builder Studio
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-blue-600 transition-colors">
                  ATS-Friendly Templates
                </Link>
              </li>
              <li>
                <Link href="/ats-checker" className="hover:text-blue-600 transition-colors">
                  Real-time ATS Score Checker
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Hub Col */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-900 mb-3">Student Hub</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-500">SMK PKL & Internship Preparation</span>
              </li>
              <li>
                <span className="text-slate-500">Transforming Academic Projects</span>
              </li>
              <li>
                <span className="text-slate-500">Action Verbs & Impact Keywords</span>
              </li>
              <li>
                <span className="text-slate-500">Fresh Graduate Career Roadmap</span>
              </li>
            </ul>
          </div>

          {/* Transparency & Disclaimer Col */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-900 mb-3">Integrity & AI</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-2">
              CVGenie never fabricates experiences, grades, or credentials. We articulate your genuine academic and organizational achievements with professional precision.
            </p>
            <div className="text-[11px] text-slate-400">
              ATS compatibility scores are automated estimations based on standard heuristic guidelines.
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div>© {new Date().getFullYear()} CVGenie Inc. Built for Students Everywhere.</div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>using Liquid Glass UI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
