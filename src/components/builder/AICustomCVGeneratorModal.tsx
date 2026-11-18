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
      category: 'Teknik & Otomotif',
      label: 'SMK Otomotif (TKR/TBSM)',
      prompt: 'Buatkan CV profesional untuk teknisi otomotif SMK TKR fokus servis berkala, tune-up sistem injeksi, dan overhaul mesin, warna tema Emerald Green.',
    },
    {
      category: 'Bisnis & Akuntansi',
      label: 'SMK Akuntansi (AKL)',
      prompt: 'Buatkan CV staf akuntansi & keuangan SMK AKL dengan keahlian jurnal umum, rekonsiliasi bank, Accurate, dan Excel, template formal Corporate Navy.',
    },
    {
      category: 'Perkantoran',
      label: 'SMK Administrasi (MPLB)',
      prompt: 'Buatkan CV staf administrasi perkantoran SMK MPLB fokus korespondensi surat niaga, pengarsipan digital, dan pelayanan tamu, warna Deep Navy.',
    },
    {
      category: 'Kreatif & Desain',
      label: 'SMK DKV / Desain Grafis',
      prompt: 'Buatkan CV kreatif desainer grafis & media SMK DKV dengan portfolio branding Adobe Photoshop, Illustrator, dan Premiere, warna Royal Violet.',
    },
    {
      category: 'Jaringan & IT',
      label: 'SMK TKJ (Teknisi Jaringan)',
      prompt: 'Buatkan CV teknisi jaringan SMK TKJ fokus konfigurasi Mikrotik, instalasi LAN/WLAN, routing, dan troubleshooting, warna Electric Blue.',
    },
    {
      category: 'Kuliner & Pariwisata',
      label: 'SMK Tata Boga / Perhotelan',
      prompt: 'Buatkan CV cook helper / staf restoran SMK Tata Boga dengan keahlian pengolahan makanan higienis standar HACCP dan hospitality service.',
    },
    {
      category: 'Kesehatan',
      label: 'SMK Farmasi / Keperawatan',
      prompt: 'Buatkan CV asisten tenaga kefarmasian SMK Farmasi dengan keahlian peracikan sediaan obat, resep dokter, dan pelayanan pasien.',
    },
    {
      category: 'Akademik & Beasiswa',
      label: 'SMA / Beasiswa Kuliah',
      prompt: 'Buatkan CV akademik untuk pendaftaran beasiswa, highlight prestasi karya ilmiah (KIR), kepengurusan OSIS, dan nilai rapor, template ATS.',
    },
    {
      category: 'Software & Rekayasa',
      label: 'SMK PPLG / Web Developer',
      prompt: 'Buatkan CV modern untuk junior web developer SMK PPLG dengan fokus Next.js, framework web, dan database MySQL.',
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
      <div className="relative w-full max-w-2xl rounded-3xl glass-card border border-white/90 shadow-2xl p-6 sm:p-8 bg-white/95 max-h-[90vh] overflow-y-auto">
        {/* Glow ambient */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#172B49] flex items-center justify-center text-white shadow-lg shadow-[#172B49]/20">
              <Wand2 className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#172B49]">
                AI Custom CV Creator (Semua Jurusan)
              </h3>
              <p className="text-xs text-[#718096]">
                Ketik jurusan atau profesi impianmu (Otomotif, Akuntansi, DKV, TKJ, Boga, Farmasi, SMA, dll), AI akan merancangnya!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prompt Input Box */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#172B49] mb-1.5">
              Jelaskan CV yang Ingin Anda Buat:
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: Saya siswa SMK Akuntansi ingin membuat CV lamaran staf keuangan magang, fokus pada pembukuan, Excel, dan pajak dengan template formal..."
              className="w-full text-xs p-3.5 rounded-2xl glass-inset border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#172B49]/20 text-[#172B49] resize-none"
            />
          </div>

          {/* Presets by Major */}
          <div>
            <span className="text-[11px] font-bold text-[#496A96] block mb-2">
              Pilih Cepat Berdasarkan Jurusan / Minat:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setPrompt(preset.prompt);
                    handleGenerate(preset.prompt);
                  }}
                  className="px-3 py-1.5 rounded-xl glass-inset hover:bg-white text-[11px] font-semibold text-[#172B49] transition-all hover:scale-105 shadow-sm"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3 rounded-2xl bg-[#172B49] hover:bg-[#243B80] text-white text-xs font-bold shadow-lg shadow-[#172B49]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-blue-300" />
                <span>AI Sedang Merancang CV Jurusan Anda...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-300" />
                <span>Rancang CV Sekarang dengan AI</span>
              </>
            )}
          </button>
        </div>

        {/* AI Result Preview */}
        {generatedCV && (
          <div className="mt-6 pt-5 border-t border-slate-200/80 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>CV Berhasil Dirancang Khusus untuk Anda!</span>
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#172B49]">
                {generatedCV.templateId.toUpperCase()}
              </span>
            </div>

            <div className="p-4 rounded-2xl glass-inset border border-white space-y-2 text-left bg-white/70">
              <div className="text-xs font-bold text-[#172B49]">
                {generatedCV.personalInfo.jobTitle}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                &ldquo;{generatedCV.summary}&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-2 text-[11px] text-[#718096]">
                <Palette className="w-3.5 h-3.5" />
                <span>Warna Aksen:</span>
                <span
                  className="w-3.5 h-3.5 rounded-full inline-block shadow-sm"
                  style={{ backgroundColor: generatedCV.accentColor }}
                />
              </div>
            </div>

            <button
              onClick={handleApply}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>Terapkan CV Ini ke Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
