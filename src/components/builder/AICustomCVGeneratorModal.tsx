'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Wand2,
  Check,
  ArrowRight,
  X,
  RefreshCw,
  Copy,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  CheckCircle2,
  Layers,
  HelpCircle,
} from 'lucide-react';
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
  // Form States
  const [formData, setFormData] = useState({
    targetRole: '',
    majorCategory: 'smk_otomotif',
    experienceLevel: 'student',
    skills: '',
    projectsOrPracticum: '',
    language: 'id',
    additionalNotes: '',
  });

  const [activeTab, setActiveTab] = useState<'form' | 'output' | 'presets'>('form');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCV, setGeneratedCV] = useState<CVData | null>(null);

  const MAJOR_OPTIONS = [
    { value: 'smk_otomotif', label: 'SMK Teknik Otomotif (TKR / TBSM)', rolePlaceholder: 'Teknisi Otomotif / Mekanik' },
    { value: 'smk_akuntansi', label: 'SMK Akuntansi & Keuangan (AKL)', rolePlaceholder: 'Staf Akuntansi / Pembukuan' },
    { value: 'smk_perkantoran', label: 'SMK Manajemen Perkantoran (MPLB)', rolePlaceholder: 'Staf Administrasi Perkantoran' },
    { value: 'smk_dkv', label: 'SMK Desain Komunikasi Visual (DKV / Multimedia)', rolePlaceholder: 'Desainer Grafis & Kreatif Media' },
    { value: 'smk_tkj', label: 'SMK Teknik Komputer & Jaringan (TKJ)', rolePlaceholder: 'Teknisi Jaringan & IT Support' },
    { value: 'smk_pplg', label: 'SMK Rekayasa Perangkat Lunak (PPLG / RPL)', rolePlaceholder: 'Junior Web / Mobile Developer' },
    { value: 'smk_boga', label: 'SMK Tata Boga / Kuliner', rolePlaceholder: 'Cook Helper / Staf Kitchen' },
    { value: 'smk_perhotelan', label: 'SMK Perhotelan & Pariwisata', rolePlaceholder: 'Front Desk Agent / Hospitality Staff' },
    { value: 'smk_farmasi', label: 'SMK Farmasi & Kesehatan', rolePlaceholder: 'Asisten Tenaga Kefarmasian' },
    { value: 'smk_mesin_listrik', label: 'SMK Teknik Mesin / Pengelasan / Listrik', rolePlaceholder: 'Teknisi Pemeliharaan Mesin / Listrik' },
    { value: 'sma_umum', label: 'SMA / MA (MIPA / IPS / Bahasa)', rolePlaceholder: 'Kandidat Riset Akademik / Trainee' },
    { value: 'kuliah_umum', label: 'Mahasiswa / Fresh Graduate Universitas', rolePlaceholder: 'Entry-Level Specialist / Management Trainee' },
  ];

  const presets = [
    {
      category: 'Teknik Otomotif',
      role: 'Teknisi Servis Berkala Mobil & Motor',
      major: 'smk_otomotif',
      skills: 'Tune-up Mesin Injeksi, Scanner OBD, Perawatan Rem & Transmisi, K3',
      projects: 'Servis berkala 10.000 km pada armada Toyota Avanza di bengkel mitra praktikum.',
    },
    {
      category: 'Akuntansi & Keuangan',
      role: 'Junior Accounting Staff',
      major: 'smk_akuntansi',
      skills: 'Jurnal Umum, Buku Besar, Accurate Accounting, Microsoft Excel (VLOOKUP, Pivot), Rekonsiliasi Bank',
      projects: 'Penyusunan siklus akuntansi dan neraca saldo koperasi siswa.',
    },
    {
      category: 'Administrasi Kantor',
      role: 'Staf Administrasi & Kearsipan',
      major: 'smk_perkantoran',
      skills: 'Kearsipan Digital, Korespondensi Surat Dinas, Pengelolaan Agenda, Pelayanan Tamu',
      projects: 'Digitalisasi 200+ berkas arsip surat masuk dan keluar menggunakan sistem e-filling.',
    },
    {
      category: 'Desain Grafis / DKV',
      role: 'Junior Graphic Designer',
      major: 'smk_dkv',
      skills: 'Adobe Photoshop, Adobe Illustrator, Figma, Tipografi, Branding Identity',
      projects: 'Perancangan identitas visual, logo, dan kemasan produk untuk 2 brand UMKM lokal.',
    },
    {
      category: 'Jaringan & IT Support',
      role: 'Teknisi Jaringan Komputer',
      major: 'smk_tkj',
      skills: 'Mikrotik RouterOS, Pengkabelan UTP/STP, Konfigurasi LAN/WLAN, Troubleshooting Hardware PC',
      projects: 'Rancang bangun hotspot dan manajemen bandwidth lab komputer sekolah.',
    },
    {
      category: 'Software & Web',
      role: 'Junior Frontend Developer',
      major: 'smk_pplg',
      skills: 'React.js, Next.js, Tailwind CSS, TypeScript, Git/GitHub, REST API',
      projects: 'Pembuatan portal e-commerce katalog produk sekolah dengan sistem keranjang belanja.',
    },
  ];

  // Build the formulated professional prompt based on form data
  const formulatePrompt = () => {
    const selectedMajor = MAJOR_OPTIONS.find((m) => m.value === formData.majorCategory)?.label || formData.majorCategory;
    const role = formData.targetRole || 'Profesional / Entry Level';
    const lang = formData.language === 'en' ? 'Bahasa Inggris (English)' : 'Bahasa Indonesia';

    const promptText = `Bertindaklah sebagai Expert Executive Resume Writer dan ATS (Applicant Tracking System) Optimization Specialist bersertifikasi internasional.

Tolong buatkan materi CV (Curriculum Vitae) profesional tingkat tinggi yang ramah bot ATS dan memukau HRD, dengan spesifikasi kandidat sebagai berikut:

1. PROFIL TARGET:
- Target Posisi/Profesi: ${role}
- Latar Belakang/Rumpun Kejuruan: ${selectedMajor}
- Tingkat Pengalaman: ${
      formData.experienceLevel === 'student'
        ? 'Pelajar / Siswa SMK (Fokus pada Tugas Praktikum, Proyek Kejuruan, dan Karakter Kerja)'
        : formData.experienceLevel === 'fresh_grad'
        ? 'Lulusan Baru (Fresh Graduate / Magang PKL Industri)'
        : 'Profesional Muda (1-2 Tahun Pengalaman Kerja)'
    }
- Bahasa Resume: ${lang}

2. KEAHLIAN & KOMPETENSI KANDIDAT:
- Hard Skills & Tools: ${formData.skills || 'Keahlian teknis standar sesuai bidang kejuruan di atas'}
- Soft Skills: Kerja Sama Tim, Komunikasi Efektif, Disiplin Waktu, Cepat Beradaptasi, Problem Solving

3. PENGALAMAN & PRAKTIKUM UTAMA:
- ${formData.projectsOrPracticum || 'Praktikum kejuruan sekolah dan tugas proyek industri terapan'}
${formData.additionalNotes ? `- Catatan Tambahan: ${formData.additionalNotes}` : ''}

4. INSTRUKSI PENYUSUNAN CV:
a. Ringkasan Profil (Summary): Tulis 3-4 kalimat ringkas yang kuat, percaya diri, dan menonjolkan dedikasi kerja.
b. Pengalaman Praktikum / PKL / Proyek: Gunakan formula Google XYZ & Action Verbs aktif (misalnya: "Menerapkan...", "Merancang...", "Mengoptimalkan...", "Melaksanakan...") dengan menyebutkan hasil yang dicapai.
c. Struktur ATS:
   - Header Informasi Kontak (Nama, Email, No. HP, Kota domisili, LinkedIn/Portfolio)
   - Professional Summary
   - Riwayat Pendidikan & Kejuruan
   - Pengalaman Proyek Praktikum / Pengalaman Kerja
   - Keahlian Teknis (Tools & Software)
   - Prestasi / Sertifikasi Kejuruan
d. Hindari klise kosong dan jangan menggunakan format tabel bersarang yang membingungkan bot ATS.`;

    setGeneratedPrompt(promptText);
    return promptText;
  };

  // Update prompt when form changes
  useEffect(() => {
    if (activeTab === 'output') {
      formulatePrompt();
    }
  }, [formData, activeTab]);

  const handleCopyPrompt = async () => {
    const textToCopy = generatedPrompt || formulatePrompt();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      // Fallback copy
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  const handleGenerateInCVGenie = async () => {
    const promptText = generatedPrompt || formulatePrompt();
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_custom_cv',
          payload: {
            userPrompt: promptText,
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

  const handleApplyToStudio = () => {
    if (generatedCV) {
      onApplyCustomCV(generatedCV);
      onClose();
    }
  };

  const handleSelectPreset = (p: (typeof presets)[0]) => {
    setFormData({
      ...formData,
      targetRole: p.role,
      majorCategory: p.major,
      skills: p.skills,
      projectsOrPracticum: p.projects,
    });
    setActiveTab('output');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl glass-card border border-white/90 shadow-2xl p-5 sm:p-8 bg-white/95 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-200/80 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#172B49] flex items-center justify-center text-white shadow-lg shadow-[#172B49]/20 shrink-0">
              <Wand2 className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#172B49] leading-tight">
                AI Custom CV & Prompt Builder
              </h3>
              <p className="text-xs text-[#718096]">
                Isi form kuesioner singkat $\rightarrow$ Dapatkan prompt profesional siap salin untuk AI lain atau generate langsung!
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

        {/* Mode Navigation Tabs */}
        <div className="flex items-center gap-2 mb-4 bg-slate-100/80 p-1.5 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'form'
                ? 'bg-white text-[#172B49] shadow-sm'
                : 'text-[#718096] hover:text-[#172B49]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Isi Form Kuesioner</span>
          </button>

          <button
            onClick={() => {
              formulatePrompt();
              setActiveTab('output');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'output'
                ? 'bg-white text-[#172B49] shadow-sm'
                : 'text-[#718096] hover:text-[#172B49]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>2. Output Prompt Profesional</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-white text-[#172B49] shadow-sm'
                : 'text-[#718096] hover:text-[#172B49]'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">Pilihan Cepat Jurusan</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* TAB 1: FORM KUESIONER */}
          {activeTab === 'form' && (
            <div className="space-y-4">
              {/* Field 1: Rumpun Jurusan / Bidang */}
              <div>
                <label className="block text-xs font-bold text-[#172B49] mb-1">
                  1. Jurusan atau Bidang Keahlian:
                </label>
                <select
                  value={formData.majorCategory}
                  onChange={(e) => {
                    const sel = MAJOR_OPTIONS.find((m) => m.value === e.target.value);
                    setFormData({
                      ...formData,
                      majorCategory: e.target.value,
                      targetRole: formData.targetRole || sel?.rolePlaceholder || '',
                    });
                  }}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-[#172B49]"
                >
                  {MAJOR_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 2: Target Posisi / Profesi */}
              <div>
                <label className="block text-xs font-bold text-[#172B49] mb-1">
                  2. Target Posisi / Profesi yang Dituju:
                </label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  placeholder="Contoh: Teknisi Tune-up, Staf Akuntansi, Desainer Grafis, Admin Gudang..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-[#172B49]"
                />
              </div>

              {/* Field 3: Tingkat Pengalaman & Bahasa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#172B49] mb-1">
                    3. Tingkat Pengalaman:
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-[#172B49]"
                  >
                    <option value="student">Pelajar SMK / SMA (Belum Kerja Formal)</option>
                    <option value="fresh_grad">Lulusan Baru / Magang PKL Industri</option>
                    <option value="junior">Junior Profesional (1-2 Tahun Pengalaman)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172B49] mb-1">
                    Bahasa Resume yang Diinginkan:
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-[#172B49]"
                  >
                    <option value="id">Bahasa Indonesia (Standar Nasional)</option>
                    <option value="en">Bahasa Inggris (English - Standard)</option>
                  </select>
                </div>
              </div>

              {/* Field 4: Keahlian & Tools Utama */}
              <div>
                <label className="block text-xs font-bold text-[#172B49] mb-1">
                  4. Keahlian & Software/Alat yang Dikuasai:
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="Contoh: Photoshop, Illustrator, Accurate, Scanner OBD, Excel, Mikrotik, Servis Injeksi..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-[#172B49]"
                />
              </div>

              {/* Field 5: Praktikum / Proyek / Tugas Terbesar */}
              <div>
                <label className="block text-xs font-bold text-[#172B49] mb-1">
                  5. Pengalaman Praktikum / Tugas Sekolah / Proyek yang Pernah Dibuat:
                </label>
                <textarea
                  rows={3}
                  value={formData.projectsOrPracticum}
                  onChange={(e) => setFormData({ ...formData, projectsOrPracticum: e.target.value })}
                  placeholder="Contoh: Melakukan perbaikan transmisi manual mobil Avanza pada saat PKL di bengkel resmi, menyusun laporan keuangan harian koperasi, atau membuat website landing page..."
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-[#172B49] resize-none"
                />
              </div>

              {/* Action Button: Lanjut ke Output */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    formulatePrompt();
                    setActiveTab('output');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#172B49] hover:bg-[#243B80] text-white text-xs font-bold shadow-md shadow-[#172B49]/20 flex items-center gap-2 transition-all"
                >
                  <span>Lihat & Susun Prompt Profesional</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: OUTPUT PROMPT SIAP SALIN */}
          {activeTab === 'output' && (
            <div className="space-y-4">
              {/* Salin Prompt Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div>
                  <h4 className="text-xs font-bold text-[#172B49] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Prompt Profesional Siap Salin untuk AI Lain!</span>
                  </h4>
                  <p className="text-[11px] text-[#718096] mt-0.5">
                    Klik tombol salin di kanan untuk menempelkannya langsung ke <strong>ChatGPT, Claude, DeepSeek</strong>, atau AI manapun.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shrink-0 ${
                    isCopied
                      ? 'bg-emerald-600 text-white shadow-emerald-500/25 scale-105'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Prompt Ini</span>
                    </>
                  )}
                </button>
              </div>

              {/* Textarea Prompt Output */}
              <div>
                <label className="block text-[11px] font-bold text-[#496A96] mb-1">
                  Isi Prompt Profesional yang Diformulasikan:
                </label>
                <textarea
                  rows={8}
                  readOnly
                  value={generatedPrompt || formulatePrompt()}
                  className="w-full text-xs font-mono p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none leading-relaxed"
                />
              </div>

              {/* Generate via Internal AI Alternative */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className="text-xs text-[#496A96] hover:text-[#172B49] font-semibold"
                >
                  $\leftarrow$ Ubah Data Form
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleGenerateInCVGenie}
                    disabled={isGenerating}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>AI Sedang Merancang CV...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>Buat Langsung di CVGenie (Internal AI)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Preview & Apply Card if Generated via Internal AI */}
              {generatedCV && (
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 mt-4 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>CV Berhasil Dirancang oleh AI!</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyToStudio}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/25 flex items-center gap-1.5 transition-all"
                    >
                      <span>Terapkan ke Studio CV</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Posisi: <strong>{generatedCV.personalInfo?.jobTitle}</strong> | {generatedCV.experience?.length || 0} Pengalaman | {generatedCV.projects?.length || 0} Proyek Praktikum.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRESETS QUICK ACCESS */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-[#718096]">
                Pilih salah satu template jurusan berikut untuk otomatis mengisi form kuesioner dan menyusun prompt:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {presets.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectPreset(p)}
                    className="p-3.5 rounded-2xl glass-card border border-white/80 hover:border-blue-400 cursor-pointer transition-all hover:scale-[1.02] shadow-sm bg-white"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {p.category}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <h5 className="text-xs font-bold text-[#172B49] mb-1">{p.role}</h5>
                    <p className="text-[11px] text-[#718096] line-clamp-2">{p.projects}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
