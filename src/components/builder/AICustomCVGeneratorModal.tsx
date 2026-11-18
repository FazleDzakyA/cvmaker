'use client';

import React, { useState } from 'react';
import { Sparkles, Wand2, Check, ArrowRight, X, RefreshCw, Palette, LayoutTemplate } from 'lucide-react';
import { CVData } from '@/types/cv';

interface AICustomCVGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCV: CVData;
  onApplyCustomCV: (newCV: CVData) => void;
}

export const AICustomCVGeneratorModal: React.FC<AICustomCVGeneratorModalProps> = ({
  isOpen,
  onClose,
  currentCV,
  onApplyCustomCV,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCV, setGeneratedCV] = useState<CVData | null>(null);

  if (!isOpen) return null;

  const presets = [
    {
      label: 'SMK RPL / Web Developer',
      prompt: 'Buatkan CV modern untuk siswa SMK RPL magang web developer dengan fokus Next.js, Laravel, dan MySQL, warna tema Electric Blue.',
    },
    {
      label: 'UI/UX Creative Designer',
      prompt: 'Buatkan CV kreatif untuk desainer UI/UX & multimedia SMK DKV, warna tema Royal Violet, highlight portfolio Figma dan prototipe.',
    },
    {
      label: 'Corporate Admin / Finance',
      prompt: 'Buatkan CV profesional untuk posisi Administrasi & Keuangan, tata letak formal ATS, warna Deep Navy.',
    },
    {
      label: 'Beasiswa Kuliah / LPDP',
      prompt: 'Buatkan CV akademik untuk pendaftaran beasiswa, highlight prestasi lomba, kepengurusan OSIS/BEM, dan nilai akademik.',
    },
  ];

  const handleGenerate = async (customPrompt?: string) => {
    const textToUse = customPrompt || prompt;
    if (!textToUse.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_custom_cv',
          payload: {
            userPrompt: textToUse,
            currentCV,
          },
        }),
      });

      const data = await res.json();
      if (data.data) {
        setGeneratedCV(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedCV) {
      onApplyCustomCV(generatedCV);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl glass-card border border-white/90 shadow-2xl p-6 sm:p-8 bg-white/90 max-h-[90vh] overflow-y-auto">
        {/* Glow ambient */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                AI Custom CV Creator
              </h3>
              <p className="text-xs text-slate-500">
                Gak suka template bawaan? Suruh AI rancang CV dan tata letak khusus sesuai keinginan Anda!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Chips */}
        <div className="mb-4">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
            Ide Cepat / Inspirasi:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(preset.prompt);
                  handleGenerate(preset.prompt);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60 transition-colors text-left"
              >
                ✨ {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* User Prompt Input */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-700 mb-1 block">
            Jelaskan CV impian Anda (posisi, warna, gaya, atau fokus keahlian):
          </label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Contoh: Buatkan CV magang SMK RPL untuk web developer dengan warna Cyan Emerald, sorot proyek Laravel kasir perpustakaan, dan summary yang percaya diri..."
            className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* Generate Button */}
        <div className="flex justify-end mb-5">
          <button
            type="button"
            onClick={() => handleGenerate()}
            disabled={isGenerating || !prompt.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs font-bold shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI Merancang CV Anda...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Buatkan CV Custom dengan AI</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Preview Card */}
        {generatedCV && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/90 to-blue-50/90 border border-purple-200 shadow-md animate-in fade-in space-y-3">
            <div className="flex items-center justify-between border-b border-purple-200/60 pb-2">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                Rancangan CV dari AI:
              </span>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                <span className="flex items-center gap-1">
                  <LayoutTemplate className="w-3.5 h-3.5 text-blue-600" />
                  Template: <b className="capitalize">{generatedCV.templateId}</b>
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className="w-3 h-3 rounded-full border border-slate-300"
                    style={{ backgroundColor: generatedCV.accentColor }}
                  />
                  Aksen Warna
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-800">
              <div>
                <span className="font-semibold text-slate-600">Posisi: </span>
                <span className="font-bold text-slate-900">{generatedCV.personalInfo.jobTitle}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-600">Summary: </span>
                <span className="leading-relaxed text-slate-700">{generatedCV.summary}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-purple-200/60 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-white transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all"
              >
                <span>Terapkan ke Studio Live</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
