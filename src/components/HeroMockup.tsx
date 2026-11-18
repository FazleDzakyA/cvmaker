'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, MapPin, Mail, Phone, Award, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './icons/SocialIcons';
import Link from 'next/link';

export const HeroMockup: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none flex items-center justify-center py-6">
      {/* Ambient background glows */}
      <div className="absolute -top-12 -left-10 w-72 h-72 bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />

      {/* Floating 3D Spheres / Orbs */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-tr from-purple-400/40 to-blue-300/40 backdrop-blur-md border border-white/40 shadow-xl pointer-events-none hidden sm:block"
      />
      <motion.div
        animate={{ y: [0, 14, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-8 -left-6 w-20 h-20 rounded-full bg-gradient-to-br from-blue-400/30 to-indigo-300/30 backdrop-blur-md border border-white/50 shadow-xl pointer-events-none hidden sm:block"
      />

      {/* Top Floating Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute -top-6 z-20"
      >
        <div className="px-5 py-2 rounded-full glass-card border border-white/80 shadow-xl flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 backdrop-blur-xl">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>Your Dream Job Starts Here</span>
          <span className="text-amber-400">✦</span>
        </div>
      </motion.div>

      {/* Central Glass CV Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full relative z-10 rounded-3xl bg-white/85 backdrop-blur-2xl p-6 sm:p-8 border border-white/90 shadow-2xl transition-all duration-300 hover:shadow-blue-500/10"
      >
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-slate-100 pb-5 mb-5">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
            alt="Fazle Dzaky"
            className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-blue-500/20"
          />
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Fazle Dzaky Aryaguna
            </h3>
            <p className="text-sm font-semibold text-blue-600 mb-2">Software Developer</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" /> Semarang, Indonesia
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" /> fazle.dzaky@gmail.com
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" /> +62 812 3456 7890
              </span>
              <span className="flex items-center gap-1">
                <GithubIcon className="w-3 h-3 text-slate-400" /> github.com/fazledzaky
              </span>
            </div>
          </div>
        </div>

        {/* About Me */}
        <div className="mb-4">
          <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1">About Me</h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            A passionate Software Developer with a strong interest in web development, UI/UX design, and technology. Eager to contribute foundational skills to high-impact software projects.
          </p>
        </div>

        {/* Skills Pills */}
        <div className="mb-5">
          <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {['Next.js', 'React', 'Laravel', 'Tailwind CSS', 'PHP', 'MySQL', 'TypeScript'].map((skill, i) => (
              <span
                key={i}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50/80 border border-blue-100 text-blue-700 shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Mockup Experience snippet */}
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-medium text-slate-700">SMK & University Graduate Ready</span>
          </div>
          <Link
            href="/builder"
            className="flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>Live Studio</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>

      {/* Bottom Right Floating Badge - ATS Score 98/100 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute -bottom-6 right-2 sm:right-6 z-20"
      >
        <div className="px-5 py-2.5 rounded-2xl bg-[#101A3C]/95 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center gap-3 text-white">
          <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-blue-300">ATS Score</div>
            <div className="text-base sm:text-lg font-black tracking-tight text-white flex items-baseline gap-1">
              <span>98</span>
              <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
