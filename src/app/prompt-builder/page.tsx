'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  FileText,
  Upload,
  BookOpen,
  Briefcase,
  Layers,
  History,
  AlertCircle,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { saveActiveCV, getActiveCV } from '@/lib/storage';
import { CVData } from '@/types/cv';
import { blankCVData } from '@/data/initialCVData';

export default function PromptBuilderPage() {
  const router = useRouter();

  // Inputs
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>('');
  const [majorCategory, setMajorCategory] = useState<string>('Teknik Otomotif (TKR/TBSM)');
  const [experienceLevel, setExperienceLevel] = useState<string>('student');
  const [skillsInput, setSkillsInput] = useState<string>('');
  const [projectsInput, setProjectsInput] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [writingStyle, setWritingStyle] = useState<string>('Professional, ATS-Optimized, and Confident');
  const [language, setLanguage] = useState<'id' | 'en'>('id');

  // Outputs & State
  const [formulatedPrompt, setFormulatedPrompt] = useState<string>('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isFormulating, setIsFormulating] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [revisionHistory, setRevisionHistory] = useState<Array<{ id: string; timestamp: string; role: string; prompt: string }>>([]);

  const PROMPT_LIBRARY = [
    {
      category: 'Teknik Otomotif (TKR)',
      role: 'Teknisi Servis Berkala & Tune-Up Mesin',
      major: 'Teknik Otomotif (TKR/TBSM)',
      skills: 'Tune-Up Mesin Injeksi, Scanner OBD-II, Perawatan Sistem Rem, Standar Keselamatan K3',
      projects: 'Melakukan servis berkala 10.000 KM armada kendaraan roda empat di bengkel praktikum sekolah.',
      samplePrompt: 'Buatkan CV profesional untuk siswa SMK Teknik Otomotif yang melamar posisi teknisi servis berkala. Tonjolkan keahlian tune-up mesin injeksi, diagnosa scanner OBD, dan kepatuhan SOP bengkel resmi.',
    },
    {
      category: 'Akuntansi & Keuangan (AKL)',
      role: 'Staf Administrasi Keuangan & Pembukuan',
      major: 'Akuntansi & Keuangan Lembaga (AKL)',
      skills: 'Jurnal Umum, Buku Besar, Software Accurate, Microsoft Excel (VLOOKUP, Pivot), Rekonsiliasi Bank',
      projects: 'Penyusunan siklus akuntansi dan laporan laba rugi koperasi siswa dengan 100% balance.',
      samplePrompt: 'Buatkan CV staf akuntansi pemula untuk lulusan SMK AKL. Highlight penguasaan jurnal penyesuaian, Accurate Accounting, dan Excel laporan neraca saldo.',
    },
    {
      category: 'Manajemen Perkantoran (MPLB)',
      role: 'Staf Administrasi & Kearsipan Digital',
      major: 'Manajemen Perkantoran (MPLB)',
      skills: 'Kearsipan Digital (E-Filing), Korespondensi Surat Niaga, Notulensi Rapat, Customer Service',
      projects: 'Digitalisasi 250+ berkas arsip dan penataan sistem penomoran surat resmi sekolah.',
      samplePrompt: 'Buatkan CV staf administrasi perkantoran yang mengedepankan ketelitian pengelolaan dokumen digital, surat dinas, dan komunikasi profesional.',
    },
    {
      category: 'Desain Grafis & Media (DKV)',
      role: 'Junior Graphic Designer & Branding Specialist',
      major: 'Desain Komunikasi Visual (DKV)',
      skills: 'Adobe Illustrator, Adobe Photoshop, Figma, Tipografi, Branding Identity, Mockup 3D',
      projects: 'Perancangan identitas visual, logo, dan kemasan produk untuk 2 UMKM kuliner lokal.',
      samplePrompt: 'Rancang CV kreatif untuk desainer grafis SMK DKV yang memiliki portfolio branding visual, packaging design, dan penguasaan Adobe Suite.',
    },
    {
      category: 'Jaringan & IT Support (TKJ)',
      role: 'Teknisi Komputer & Jaringan (IT Support)',
      major: 'Teknik Komputer & Jaringan (TKJ)',
      skills: 'Mikrotik RouterOS, Pengkabelan UTP/STP, Konfigurasi LAN/WLAN, Troubleshooting PC Hardware',
      projects: 'Instalasi jaringan lokal 40 PC lab sekolah, manajemen bandwidth, dan firewall filtering.',
      samplePrompt: 'Buatkan CV teknisi jaringan SMK TKJ dengan spesialisasi konfigurasi Mikrotik, crimping kabel LAN Cat6, dan penanganan kendala hardware PC.',
    },
    {
      category: 'Software & Web (PPLG)',
      role: 'Junior Frontend Web Developer',
      major: 'Rekayasa Perangkat Lunak (PPLG)',
      skills: 'Next.js, React, Tailwind CSS, TypeScript, REST API, Git & GitHub',
      projects: 'Membangun aplikasi e-commerce katalog produk sekolah dengan fitur keranjang belanja responsif.',
      samplePrompt: 'Buatkan CV modern untuk junior web developer SMK PPLG dengan fokus React.js, Next.js, dan integrasi API publik.',
    },
  ];

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cvgenie_prompt_history');
      if (stored) {
        setRevisionHistory(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to history helper
  const saveToHistory = (role: string, promptText: string) => {
    const item = {
      id: `rev-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      role: role || 'Prompt Baru',
      prompt: promptText,
    };
    const updated = [item, ...revisionHistory.slice(0, 9)];
    setRevisionHistory(updated);
    try {
      localStorage.setItem('cvgenie_prompt_history', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // STEP 1: Formulate the 14-point structured prompt (Does NOT generate CV)
  const handleFormulatePrompt = async () => {
    setIsFormulating(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_complete_prompt',
          payload: {
            rawInput: userPrompt,
            targetRole: targetRole || 'Spesialis Profesional',
            majorCategory,
            experienceLevel,
            skills: skillsInput,
            projects: projectsInput,
            jobDescription,
            writingStyle,
            language,
          },
        }),
      });

      const data = await res.json();
      if (data.data?.formulatedPrompt) {
        setFormulatedPrompt(data.data.formulatedPrompt);
        setAiSuggestions(data.data.suggestions || []);
        saveToHistory(targetRole || majorCategory, data.data.formulatedPrompt);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFormulating(false);
    }
  };

  // Copy prompt to clipboard
  const handleCopyPrompt = async () => {
    if (!formulatedPrompt) return;
    try {
      await navigator.clipboard.writeText(formulatedPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = formulatedPrompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  // STEP 2: Execute Prompt to generate actual CV in Studio
  const handleExecutePrompt = async () => {
    const promptToExecute = formulatedPrompt || userPrompt;
    if (!promptToExecute.trim()) return;

    setIsExecuting(true);
    try {
      const current = getActiveCV();
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_custom_cv',
          payload: {
            userPrompt: promptToExecute,
            currentCV: current || blankCVData,
          },
        }),
      });

      const data = await res.json();
      if (data.data) {
        saveActiveCV(data.data);
        router.push('/builder');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExecuting(false);
    }
  };

  // Select sample preset from library
  const handleSelectPreset = (p: (typeof PROMPT_LIBRARY)[0]) => {
    setUserPrompt(p.samplePrompt);
    setTargetRole(p.role);
    setMajorCategory(p.major);
    setSkillsInput(p.skills);
    setProjectsInput(p.projects);
  };

  return (
    <AuthGuard>
      <div className="misty-mountain-viewport min-h-screen flex flex-col md:flex-row p-3 sm:p-5 lg:p-6 gap-4 lg:gap-6 overflow-x-hidden selection:bg-blue-200">
        <AppSidebar />

        <main className="flex-1 min-w-0 flex flex-col max-w-[1400px] mx-auto w-full pb-20 md:pb-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-[#172B49] text-xs font-bold mb-3 shadow-sm">
              <Wand2 className="w-4 h-4 text-purple-600" />
              <span>Metode 1: AI Prompt Builder Mandiri</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B49] tracking-tight mb-2">
              Rancang & Susun Prompt CV Profesional
            </h1>
            <p className="text-xs sm:text-sm text-[#718096] leading-relaxed">
              Ketik instruksi bebas atau gunakan parameter spesifik. Dapatkan <strong>14-poin prompt profesional</strong> siap salin untuk digunakan di ChatGPT / Claude / DeepSeek, atau eksekusi langsung ke Studio CV kami.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: INPUT PARAMETERS (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Card 1: Main Prompt Input Box */}
              <div className="rounded-3xl glass-card border border-white/90 p-5 sm:p-6 bg-white/85 shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                  <h3 className="text-xs sm:text-sm font-bold text-[#172B49] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Instruksi Awal CV Anda (Natural Language):</span>
                  </h3>
                  <span className="text-[10px] font-medium text-[#718096]">
                    {userPrompt.length} karakter
                  </span>
                </div>

                <textarea
                  rows={4}
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Contoh: Buatkan CV untuk posisi Magang Teknisi Otomotif SMK TKR. Saya punya pengalaman servis berkala armada Toyota Avanza, keahlian tune-up injeksi, dan ingin CV dengan gaya bahasa profesional serta ATS friendly..."
                  className="w-full text-xs p-4 rounded-2xl glass-inset border border-slate-200 bg-white/90 text-[#172B49] placeholder:text-[#718096] focus:outline-none focus:ring-2 focus:ring-[#172B49]/20 resize-none leading-relaxed"
                />

                {/* Specific Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#172B49] mb-1">
                      Target Posisi / Profesi:
                    </label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Teknisi Tune-Up, Staf Akuntansi"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172B49] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#172B49] mb-1">
                      Jurusan / Bidang Kejuruan:
                    </label>
                    <select
                      value={majorCategory}
                      onChange={(e) => setMajorCategory(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172B49] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="Teknik Otomotif (TKR/TBSM)">Teknik Otomotif (TKR/TBSM)</option>
                      <option value="Akuntansi & Keuangan (AKL)">Akuntansi & Keuangan (AKL)</option>
                      <option value="Manajemen Perkantoran (MPLB)">Manajemen Perkantoran (MPLB)</option>
                      <option value="Desain Komunikasi Visual (DKV)">Desain Komunikasi Visual (DKV)</option>
                      <option value="Teknik Komputer & Jaringan (TKJ)">Teknik Komputer & Jaringan (TKJ)</option>
                      <option value="Rekayasa Perangkat Lunak (PPLG)">Rekayasa Perangkat Lunak (PPLG)</option>
                      <option value="Tata Boga & Kuliner">Tata Boga & Kuliner</option>
                      <option value="Perhotelan & Pariwisata">Perhotelan & Pariwisata</option>
                      <option value="Farmasi & Tenaga Kesehatan">Farmasi & Tenaga Kesehatan</option>
                      <option value="SMA (MIPA / IPS / Bahasa)">SMA (MIPA / IPS / Bahasa)</option>
                      <option value="Mahasiswa / Fresh Graduate">Mahasiswa / Fresh Graduate</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#172B49] mb-1">
                      Tingkat Pengalaman:
                    </label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172B49] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="student">Pelajar SMK / SMA (Praktikum & Tugas Sekolah)</option>
                      <option value="fresh_grad">Fresh Graduate (Magang PKL Industri)</option>
                      <option value="junior">Junior Profesional (1-2 Tahun)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#172B49] mb-1">
                      Bahasa Dokumen:
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172B49] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="id">Bahasa Indonesia (Standar Nasional)</option>
                      <option value="en">Bahasa Inggris (English Standard)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#172B49] mb-1">
                    Keahlian & Tools Utama (Opsional):
                  </label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="e.g. Scanner OBD, Tune-Up, Photoshop, Excel VLOOKUP, Mikrotik..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172B49] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#172B49] mb-1">
                    Proyek Praktikum / Tugas Unggulan (Opsional):
                  </label>
                  <input
                    type="text"
                    value={projectsInput}
                    onChange={(e) => setProjectsInput(e.target.value)}
                    placeholder="e.g. Servis berkala sistem rem mobil Toyota, Laporan neraca koperasi..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172B49] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#172B49] mb-1">
                    Deskripsi Lowongan Kerja Sasaran / Job Description (Opsional):
                  </label>
                  <textarea
                    rows={2}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Tempel syarat atau kualifikasi lowongan pekerjaan di sini agar prompt disesuaikan dengan kebutuhan recruiter..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white text-[#172B49] focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  />
                </div>

                {/* Primary Action Button: Formulate Prompt ONLY */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-[#718096]">
                    *Menyusun prompt tidak akan langsung menimpa CV Anda.
                  </span>
                  <button
                    type="button"
                    onClick={handleFormulatePrompt}
                    disabled={isFormulating}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#172B49] hover:bg-[#243B80] text-white text-xs font-bold shadow-lg shadow-[#172B49]/20 flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-60"
                  >
                    {isFormulating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Menyusun 14-Poin Prompt...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 text-blue-300" />
                        <span>Susun 14-Poin Prompt Profesional</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Card 2: Example Prompt Library */}
              <div className="rounded-3xl glass-card border border-white/90 p-5 bg-white/80 shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <h4 className="text-xs font-bold text-[#172B49]">Pustaka Contoh Prompt Siap Pakai:</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PROMPT_LIBRARY.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectPreset(item)}
                      className="p-3 rounded-xl glass-inset hover:bg-white border border-slate-200/80 cursor-pointer transition-all hover:border-blue-400 group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <h5 className="text-xs font-bold text-[#172B49] truncate">{item.role}</h5>
                      <p className="text-[11px] text-[#718096] line-clamp-2 mt-0.5">{item.samplePrompt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: STRUCTURED PROMPT OUTPUT & ACTIONS (5 Cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Card 3: Formulated Prompt Output Box */}
              <div className="rounded-3xl glass-card border border-white/90 p-5 sm:p-6 bg-white/95 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#172B49] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>Output Prompt Terstruktur</span>
                    </h3>
                    <p className="text-[11px] text-[#718096]">Dapat disalin atau dieksekusi</p>
                  </div>

                  {formulatedPrompt && (
                    <button
                      type="button"
                      onClick={handleCopyPrompt}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white hover:bg-slate-50 text-[#172B49] border border-slate-200'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-blue-600" />
                          <span>Salin Prompt</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {formulatedPrompt ? (
                  <div className="space-y-4">
                    <textarea
                      rows={14}
                      value={formulatedPrompt}
                      onChange={(e) => setFormulatedPrompt(e.target.value)}
                      className="w-full text-xs font-mono p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none leading-relaxed"
                    />

                    {/* AI Suggestions Pill */}
                    {aiSuggestions.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1.5">
                        <span className="text-[10px] font-bold text-blue-900 block">
                          💡 Rekomendasi Kata Kunci Tambahan:
                        </span>
                        <ul className="space-y-1">
                          {aiSuggestions.map((sug, i) => (
                            <li key={i} className="text-[11px] text-blue-800 flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                              <span>{sug}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Execution Action Button */}
                    <div className="pt-2 border-t border-slate-200/80 space-y-2">
                      <button
                        type="button"
                        onClick={handleExecutePrompt}
                        disabled={isExecuting}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs font-bold shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
                      >
                        {isExecuting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>AI Sedang Merancang CV di Studio...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Eksekusi & Generate CV di Studio</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      <p className="text-[10px] text-center text-[#718096]">
                        Hasil generate akan langsung dimuat ke Live Preview Studio CV.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                      <Wand2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-xs font-bold text-[#172B49]">Belum Ada Prompt yang Disusun</h4>
                    <p className="text-[11px] text-[#718096] max-w-xs mx-auto">
                      Isi instruksi di kolom kiri atau pilih salah satu contoh di pustaka, lalu klik <strong>"Susun 14-Poin Prompt Profesional"</strong>.
                    </p>
                  </div>
                )}
              </div>

              {/* Card 4: Revision History */}
              {revisionHistory.length > 0 && (
                <div className="rounded-3xl glass-card border border-white/90 p-5 bg-white/80 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-[#496A96]" />
                      <h4 className="text-xs font-bold text-[#172B49]">Riwayat Prompt Sesi Ini:</h4>
                    </div>
                    <span className="text-[10px] text-slate-400">{revisionHistory.length} item</span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {revisionHistory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setFormulatedPrompt(item.prompt)}
                        className="p-2.5 rounded-xl glass-inset hover:bg-white cursor-pointer transition-all border border-slate-200/60 flex items-center justify-between text-xs"
                      >
                        <div className="truncate mr-2">
                          <span className="font-bold text-[#172B49] block truncate">{item.role}</span>
                          <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                        </div>
                        <span className="text-[10px] text-blue-600 font-semibold hover:underline shrink-0">
                          Muat Ulang
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
