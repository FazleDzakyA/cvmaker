'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Home,
  Star,
  Clock,
  Folder,
  Download,
  FileText,
  Plus,
  Search,
  Moon,
  Sun,
  Settings,
  Edit3,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronRight,
  LogOut,
  Wand2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  LayoutTemplate,
  Trash2,
  ExternalLink,
  Quote,
  Eye,
  Check,
  Database,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { CVData } from '@/types/cv';
import { getActiveCV, saveActiveCV } from '@/lib/storage';
import { blankCVData } from '@/data/initialCVData';
import { useAuth } from '@/context/AuthContext';
import { AppSidebar } from '@/components/layout/AppSidebar';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, signOut, fetchUserCVs, deleteCVFromDB, isLoading, isConfigured } = useAuth();
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [activeCV, setActiveCV] = useState<CVData | null>(null);

  // Live Digital Clock & Greeting
  const [currentTime, setCurrentTime] = useState({
    timeStr: '09:18',
    ampm: 'PM',
    dateStr: 'Wednesday, 18 November',
    greeting: 'Selamat Malam',
  });

  // Interactive CV Checklist
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Isi Informasi Kontak Lengkap (Email, No. HP, Kota)', completed: true, route: '/builder' },
    { id: 2, text: 'Tulis Ringkasan Profil Profesional (Summary)', completed: true, route: '/builder' },
    { id: 3, text: 'Tambahkan 2 Proyek Sekolah / Praktikum SMK', completed: false, route: '/student-mode' },
    { id: 4, text: 'Audit Skor ATS & Ekspor CV ke format PDF', completed: false, route: '/ats-checker' },
  ]);

  // Audio Player State (synthesizer ambient lo-fi sound)
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  // Clock Ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hours12 = (hours % 12 || 12).toString().padStart(2, '0');

      let greeting = 'Selamat Pagi';
      if (hours >= 11 && hours < 15) greeting = 'Selamat Siang';
      else if (hours >= 15 && hours < 18) greeting = 'Selamat Sore';
      else if (hours >= 18 || hours < 5) greeting = 'Selamat Malam';

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      };
      const dateStr = now.toLocaleDateString('id-ID', options);

      setCurrentTime({
        timeStr: `${hours12}:${minutes}`,
        ampm,
        dateStr,
        greeting,
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Soft Ambient Audio Synthesizer (Lo-Fi relaxing drone for focus)
  const toggleAudio = () => {
    if (isPlaying) {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch {
          // ignore
        }
        oscillatorRef.current = null;
      }
      setIsPlaying(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, audioCtxRef.current.currentTime); // A3 calm note
        gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime); // very soft ambient
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        oscillatorRef.current = osc;
        setIsPlaying(true);
      } catch (err) {
        console.error('Audio ambient not supported', err);
        setIsPlaying(!isPlaying);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Auth & CV Fetching
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
      return;
    }
    if (user) {
      fetchUserCVs().then((res) => {
        setCvs(res);
      });
      setActiveCV(getActiveCV());
    }
  }, [user, isLoading, router]);

  const displayName = profile?.fullName || user?.email?.split('@')[0] || 'Student';
  const firstName = displayName.split(' ')[0] || 'Student';

  const toggleChecklist = (id: number) => {
    setChecklist((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = checklist.filter((t) => t.completed).length;

  const handleCreateNewCV = () => {
    const fresh: CVData = {
      ...blankCVData,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cv-${Date.now()}`,
    };
    saveActiveCV(fresh);
    router.push('/builder');
  };

  const handleOpenCV = (cv: CVData) => {
    saveActiveCV(cv);
    router.push('/builder');
  };

  const handleDeleteCV = async (cvId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Hapus CV ini dari database Supabase?')) {
      await deleteCVFromDB(cvId);
      setCvs((prev) => prev.filter((c) => c.id !== cvId));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  // Filter CVs for search query
  const filteredCVs = cvs.filter((cv) =>
    (cv.title || 'Untitled CV').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cv.personalInfo?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cv.templateId || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="misty-mountain-viewport text-[#172B49] min-h-screen flex flex-col md:flex-row p-3 sm:p-5 lg:p-6 gap-4 lg:gap-6 overflow-x-hidden selection:bg-blue-200">
      {/* Unified Global Floating Glass Sidebar */}
      <AppSidebar />

      {/* Main Workspace Layout */}
      <main className="flex-1 min-w-0 max-w-[1440px] mx-auto w-full pb-20 md:pb-6">
        {/* Top Header Section */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {/* Top Left: Greeting Pill & Profile */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
            <div className="glass-pill px-4 py-2 flex items-center gap-2.5 text-xs font-semibold text-[#172B49] shadow-sm">
              <div className="w-6 h-6 rounded-full bg-[#172B49] text-white flex items-center justify-center text-[10px] font-bold">
                {firstName.charAt(0).toUpperCase()}
              </div>
              <span>
                {currentTime.greeting}, {firstName}! 👋
              </span>
            </div>

            {/* Supabase status badge */}
            {isConfigured && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium glass-inset text-[#172B49] border border-white/80">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase Live</span>
              </span>
            )}
          </div>

          {/* Top Center: Large Minimalist Clock */}
          <div className="text-center flex flex-col items-center order-first sm:order-none py-2 sm:py-0">
            <div className="flex items-baseline justify-center gap-1.5 font-light tracking-tight text-[#172B49]">
              <span className="text-4xl sm:text-6xl font-light tracking-tighter">
                {currentTime.timeStr}
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#496A96]">
                {currentTime.ampm}
              </span>
            </div>
            <p className="text-xs text-[#718096] font-medium mt-0.5">
              {currentTime.dateStr}
            </p>
          </div>

          {/* Top Right: Weather & Controls Pill */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* Quick Utility Pill */}
            <div className="glass-pill px-3 py-1.5 flex items-center gap-3 text-[#496A96]">
              <button
                onClick={() => router.push('/builder')}
                title="Buka CV Studio"
                className="hover:text-[#172B49] transition-colors p-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCreateNewCV}
                title="Tambah CV Baru"
                className="hover:text-[#172B49] transition-colors p-1"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleSignOut}
                title="Keluar (Log Out)"
                className="hover:text-red-600 transition-colors p-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Weather Glass Card */}
            <div className="glass-card px-3.5 py-2 sm:py-2.5 rounded-2xl flex items-center gap-2.5 shadow-sm">
              <div className="w-7 h-7 rounded-xl bg-blue-100/60 flex items-center justify-center text-blue-700">
                <Moon className="w-4 h-4 fill-blue-600/30 text-blue-700" />
              </div>
              <div className="text-right leading-tight">
                <div className="text-xs sm:text-sm font-bold text-[#172B49]">24°C</div>
                <div className="text-[10px] text-[#496A96] font-medium">Cerah</div>
              </div>
            </div>
          </div>
        </header>

        {/* Center Pill Search Bar */}
        <div className="max-w-xl mx-auto w-full mb-6 sm:mb-8 px-1">
          <div className="glass-pill px-4 py-2.5 flex items-center gap-3 w-full shadow-sm hover:shadow-md transition-all">
            <Search className="w-4 h-4 text-[#718096] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama CV, keahlian, atau ketik kata kunci..."
              className="bg-transparent text-xs text-[#172B49] placeholder:text-[#718096] flex-1 focus:outline-none"
            />
            <span className="text-[10px] font-mono font-semibold text-[#718096] bg-white/60 px-1.5 py-0.5 rounded-md border border-white/80 hidden sm:inline">
              CV Finder
            </span>
          </div>
        </div>

        {/* 3. Main Dashboard Grid Layout (CVGenie Tailored) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Column 1: CV Saya (Daftar Resume) & Tips Karir (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* My CVs / Resumes Card */}
            <div className="glass-card p-5 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-[#172B49]" />
                  <h3 className="text-xs font-bold tracking-tight text-[#172B49]">CV & Resume Saya</h3>
                </div>
                <button
                  onClick={handleCreateNewCV}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Buat Baru</span>
                </button>
              </div>

              {/* CV List Items */}
              {filteredCVs.length === 0 ? (
                <div className="p-5 rounded-2xl glass-inset text-center space-y-2">
                  <FileText className="w-6 h-6 text-[#496A96] mx-auto opacity-60" />
                  <p className="text-xs font-semibold text-[#172B49]">Belum Ada CV Tersimpan</p>
                  <p className="text-[11px] text-[#718096]">
                    Database kamu bersih. Klik tombol di bawah untuk membuat CV pertamamu.
                  </p>
                  <button
                    onClick={handleCreateNewCV}
                    className="mt-2 px-3 py-1.5 rounded-xl bg-[#172B49] text-white text-[11px] font-semibold hover:bg-[#243B80] transition-colors"
                  >
                    + Buat CV Lembar Kosong
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {filteredCVs.map((cv) => (
                    <div
                      key={cv.id}
                      onClick={() => handleOpenCV(cv)}
                      className="flex items-center justify-between p-3 rounded-2xl glass-inset hover:scale-[1.01] hover:bg-white/80 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#172B49] truncate group-hover:text-blue-700 transition-colors">
                            {cv.title || 'Untitled CV'}
                          </div>
                          <div className="text-[10px] text-[#718096] truncate">
                            {cv.personalInfo?.fullName || 'Draft'} • {cv.templateId?.toUpperCase() || 'MINIMALIST'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          onClick={(e) => handleDeleteCV(cv.id, e)}
                          title="Hapus dari Supabase"
                          className="p-1.5 rounded-lg text-[#718096] hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-[#718096] group-hover:text-[#172B49] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes: Tips Karir Pelajar */}
            <div className="glass-card p-5 rounded-3xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#496A96]" />
                  <h3 className="text-xs font-bold text-[#172B49]">Tips Sukses Lolos ATS</h3>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                  Verified ATS
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/50 border border-white/80 shadow-sm space-y-1.5">
                <p className="text-xs text-[#172B49] leading-relaxed font-medium">
                  Gunakan format standar 1-kolom atau 2-kolom bersih. Pastikan memuat kata kerja tindakan aktif seperti <i>&ldquo;Mengembangkan&rdquo;</i>, <i>&ldquo;Merancang&rdquo;</i>, atau <i>&ldquo;Memimpin&rdquo;</i>.
                </p>
                <div className="text-[10px] text-[#718096] font-mono">
                  Saran Algoritma CVGenie • Update Hari Ini
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Akses Cepat Fitur & Kutipan Karir (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Quick Access Card (8 Fitur Utama CVGenie) */}
            <div className="glass-card p-5 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xs font-bold text-[#172B49]">Akses Cepat Fitur CVGenie</h3>
                  <p className="text-[10px] text-[#718096]">Alat bantu cerdas untuk mempercepat pembuatan CV</p>
                </div>
                <button
                  onClick={() => router.push('/builder')}
                  className="text-[11px] font-semibold text-[#496A96] hover:text-[#172B49]"
                >
                  Buka Studio →
                </button>
              </div>

              {/* 8 Functional Feature Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {[
                  {
                    label: 'AI Custom CV',
                    sub: 'Desain Otomatis',
                    icon: Wand2,
                    color: 'bg-purple-100 text-purple-700',
                    action: () => router.push('/builder'),
                  },
                  {
                    label: 'Student Mode',
                    sub: 'Khusus Pelajar/SMK',
                    icon: GraduationCap,
                    color: 'bg-blue-100 text-blue-700',
                    action: () => router.push('/student-mode'),
                  },
                  {
                    label: 'ATS Scanner',
                    sub: 'Cek Skor Bot',
                    icon: ShieldCheck,
                    color: 'bg-emerald-100 text-emerald-700',
                    action: () => router.push('/ats-checker'),
                  },
                  {
                    label: 'Ekspor PDF',
                    sub: 'Standar Cetak A4',
                    icon: Download,
                    color: 'bg-indigo-100 text-indigo-700',
                    action: () => router.push('/builder'),
                  },
                  {
                    label: 'Template CV',
                    sub: '6 Desain ATS',
                    icon: LayoutTemplate,
                    color: 'bg-amber-100 text-amber-700',
                    action: () => router.push('/templates'),
                  },
                  {
                    label: 'Gemini AI',
                    sub: 'Poles Tata Bahasa',
                    icon: Sparkles,
                    color: 'bg-sky-100 text-sky-700',
                    action: () => router.push('/builder'),
                  },
                  {
                    label: 'GitHub Repo',
                    sub: 'Kode Sumber',
                    icon: ExternalLink,
                    color: 'bg-slate-100 text-slate-800',
                    action: () => window.open('https://github.com/FazleDzakyA/cvmaker', '_blank'),
                  },
                  {
                    label: 'Lembar Kosong',
                    sub: '+ Buat dari Nol',
                    icon: Plus,
                    color: 'bg-white text-[#172B49]',
                    action: handleCreateNewCV,
                  },
                ].map((tile, i) => {
                  const Icon = tile.icon;
                  return (
                    <div
                      key={i}
                      onClick={tile.action}
                      className="glass-inset p-3 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 hover:bg-white/85 transition-all group shadow-sm"
                    >
                      <div className={`w-10 h-10 rounded-2xl ${tile.color} flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-[#172B49] truncate max-w-full">
                        {tile.label}
                      </span>
                      <span className="text-[9px] text-[#718096] truncate max-w-full">
                        {tile.sub}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Quote Card */}
            <div className="glass-card p-5 rounded-3xl">
              <Quote className="w-5 h-5 text-[#496A96] mb-2 stroke-[2.5]" />
              <p className="text-xs sm:text-sm font-medium text-[#172B49] italic leading-relaxed">
                &ldquo;Tidak punya pengalaman kerja formal bukan akhir dari segalanya. Potensi kepemimpinan, praktikum kejuruan, dan kemauan belajarmu adalah nilai jual yang sesungguhnya.&rdquo;
              </p>
              <div className="text-[11px] text-[#718096] font-semibold mt-2">
                — Prinsip Student Mode CVGenie
              </div>
            </div>

            {/* Status Sistem & Database */}
            <div className="glass-card p-4 sm:p-5 rounded-3xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-[#172B49]">Status Integrasi Sistem</h3>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                  100% Siap
                </span>
              </div>

              <div className="space-y-2">
                {[
                  { title: 'Supabase PostgreSQL Cloud', desc: 'Sinkronisasi profil & dokumen CV aktif', time: 'Online', color: 'bg-emerald-500' },
                  { title: 'Gemini 2.5 AI Engine', desc: 'Pembuat CV custom & bullet points aktif', time: 'Tersambung', color: 'bg-blue-600' },
                  { title: 'PDF Exporter Engine', desc: 'Konversi A4 langsung via browser client', time: 'Siap Cetak', color: 'bg-purple-600' },
                ].map((act, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-xl glass-inset transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${act.color} animate-pulse`} />
                      <div>
                        <div className="text-xs font-semibold text-[#172B49]">{act.title}</div>
                        <div className="text-[10px] text-[#718096]">{act.desc}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-[#496A96]">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Checklist Kelengkapan & Musik Belajar (3 cols) */}
          <div className="lg:col-span-3 space-y-5">
            {/* Checklist Kelengkapan CV */}
            <div className="glass-card p-5 rounded-3xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold text-[#172B49]">Checklist Kesiapan CV</h3>
                  <p className="text-[10px] text-[#718096]">Langkah menuju CV siap lamar</p>
                </div>
                <span className="text-xs font-bold text-blue-700">
                  {Math.round((completedCount / checklist.length) * 100)}%
                </span>
              </div>

              {/* Checklist items */}
              <div className="space-y-2 mb-4">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className="flex items-start gap-2.5 p-2 rounded-xl glass-inset hover:bg-white/70 cursor-pointer transition-all"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#718096] shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-xs leading-snug ${
                        item.completed
                          ? 'line-through text-[#718096]'
                          : 'font-semibold text-[#172B49]'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="pt-2 border-t border-white/60">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#496A96] mb-1.5">
                  <span>Selesai</span>
                  <span>
                    {completedCount} dari {checklist.length}
                  </span>
                </div>
                <div className="w-full bg-white/60 h-2 rounded-full overflow-hidden border border-white/80">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-[#172B49] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(completedCount / checklist.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Tall Vertical Focus Audio Player */}
            <div className="glass-card rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between h-[280px] shadow-lg group">
              {/* Lake Landscape Image Background inside card */}
              <div
                className="absolute inset-0 bg-cover bg-center brightness-95 transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(23, 43, 73, 0.15) 0%, rgba(23, 43, 73, 0.8) 100%), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop')`,
                }}
              />

              {/* Top Label */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/95 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  Focus Mode
                </span>
                <span className="text-white/80 text-xs">
                  {isPlaying ? <Volume2 className="w-4 h-4 text-emerald-300 animate-pulse" /> : <VolumeX className="w-4 h-4 text-white/60" />}
                </span>
              </div>

              {/* Bottom Player Info & Controls */}
              <div className="relative z-10 text-white space-y-2">
                <div>
                  <div className="text-sm font-bold tracking-tight text-white drop-shadow-sm">
                    Musik Fokus Belajar
                  </div>
                  <div className="text-[11px] text-white/85">
                    {isPlaying ? 'Sedang Memutar: Suara Relaksasi Fokus' : 'Klik Play untuk Menemani Membuat CV'}
                  </div>
                </div>

                {/* Glass Audio Controls */}
                <div className="flex items-center justify-center gap-4 pt-1">
                  <button
                    onClick={toggleAudio}
                    className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    onClick={toggleAudio}
                    className="w-11 h-11 rounded-full bg-white text-[#172B49] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    title={isPlaying ? 'Pause Audio' : 'Play Audio Fokus'}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-[#172B49]" />
                    ) : (
                      <Play className="w-4 h-4 fill-[#172B49] ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={toggleAudio}
                    className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Floating Inspirational Tag */}
        <footer className="mt-8 mb-4 text-center">
          <div className="inline-flex items-center gap-2 glass-pill px-5 py-2 text-xs font-semibold text-[#496A96] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Masa depan cerahmu dimulai dengan CV yang profesional.</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
