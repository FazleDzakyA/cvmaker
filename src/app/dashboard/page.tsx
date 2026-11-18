'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { CVData } from '@/types/cv';
import { getActiveCV, saveActiveCV } from '@/lib/storage';
import { blankCVData } from '@/data/initialCVData';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, signOut, fetchUserCVs, deleteCVFromDB, isLoading } = useAuth();
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [activeCV, setActiveCV] = useState<CVData | null>(null);

  // Live Digital Clock & Greeting
  const [currentTime, setCurrentTime] = useState({
    timeStr: '09:18',
    ampm: 'PM',
    dateStr: 'Thursday, 18 November',
    greeting: 'Good evening',
  });

  // Interactive To-Do list state
  const [todos, setTodos] = useState([
    { id: 1, text: 'Lengkapi Informasi Kontak & Media Sosial', completed: true },
    { id: 2, text: 'Tulis Ringkasan Profil Profesional (Summary)', completed: true },
    { id: 3, text: 'Tambahkan 2 Proyek Sekolah / Praktikum SMK', completed: false },
    { id: 4, text: 'Scan Skor ATS & Ekspor CV ke format PDF', completed: false },
  ]);

  // Focus Lo-Fi Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Clock Ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hours12 = (hours % 12 || 12).toString().padStart(2, '0');

      let greeting = 'Good morning';
      if (hours >= 12 && hours < 17) greeting = 'Good afternoon';
      else if (hours >= 17) greeting = 'Good evening';

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      };
      const dateStr = now.toLocaleDateString('en-US', options);

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

  const displayName = profile?.fullName || user?.email?.split('@')[0] || 'Reza';
  const firstName = displayName.split(' ')[0] || 'Reza';

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = todos.filter((t) => t.completed).length;

  const handleCreateNewCV = () => {
    const fresh: CVData = {
      ...blankCVData,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cv-${Date.now()}`,
    };
    saveActiveCV(fresh);
    router.push('/builder');
  };

  const handleDeleteCV = async (cvId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Hapus CV ini dari database?')) {
      await deleteCVFromDB(cvId);
      setCvs((prev) => prev.filter((c) => c.id !== cvId));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  // Filter CVs for search
  const filteredCVs = cvs.filter((cv) =>
    (cv.title || 'Untitled CV').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cv.personalInfo?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="misty-mountain-viewport text-[#172B49] min-h-screen flex p-3 sm:p-5 lg:p-6 overflow-x-hidden selection:bg-blue-200">
      {/* 1. Floating Glass Sidebar (Left) */}
      <aside className="hidden md:flex flex-col items-center justify-between py-6 px-3 glass-sidebar w-16 shrink-0 my-auto h-[92vh] sticky top-6 z-30">
        {/* Top App Icons */}
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Active Home Button */}
          <Link
            href="/dashboard"
            className="w-11 h-11 rounded-2xl bg-[#172B49] text-white flex items-center justify-center shadow-md shadow-[#172B49]/20 hover:scale-105 transition-all"
            title="Dashboard"
          >
            <Home className="w-5 h-5" />
          </Link>

          {/* Templates */}
          <Link
            href="/templates"
            className="w-10 h-10 rounded-2xl text-[#496A96] hover:text-[#172B49] hover:bg-white/60 flex items-center justify-center transition-all"
            title="Templates Gallery"
          >
            <Star className="w-5 h-5" />
          </Link>

          {/* ATS Checker */}
          <Link
            href="/ats-checker"
            className="w-10 h-10 rounded-2xl text-[#496A96] hover:text-[#172B49] hover:bg-white/60 flex items-center justify-center transition-all"
            title="ATS Scanner"
          >
            <ShieldCheck className="w-5 h-5" />
          </Link>

          {/* CV Studio / Folder */}
          <Link
            href="/builder"
            className="w-10 h-10 rounded-2xl text-[#496A96] hover:text-[#172B49] hover:bg-white/60 flex items-center justify-center transition-all"
            title="CV Studio"
          >
            <Folder className="w-5 h-5" />
          </Link>

          {/* Student Mode */}
          <Link
            href="/student-mode"
            className="w-10 h-10 rounded-2xl text-[#496A96] hover:text-[#172B49] hover:bg-white/60 flex items-center justify-center transition-all"
            title="Student Mode"
          >
            <FileText className="w-5 h-5" />
          </Link>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Add New CV */}
          <button
            onClick={handleCreateNewCV}
            className="w-10 h-10 rounded-2xl glass-inset flex items-center justify-center text-[#172B49] hover:bg-white/90 hover:scale-110 transition-all shadow-sm"
            title="Create New Blank CV"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Log Out */}
          <button
            onClick={handleSignOut}
            className="w-10 h-10 rounded-2xl text-[#718096] hover:text-red-600 hover:bg-red-50/80 flex items-center justify-center transition-all"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* 2. Main Workspace Layout */}
      <main className="flex-1 flex flex-col md:pl-6 max-w-[1440px] mx-auto w-full min-w-0">
        {/* Top Header Section */}
        <header className="grid grid-cols-1 md:grid-cols-3 items-start justify-between gap-4 mb-6">
          {/* Top Left: Greeting Pill */}
          <div className="flex items-center gap-3">
            <div className="glass-pill px-4 py-2 flex items-center gap-2 text-xs font-semibold text-[#172B49] shadow-sm">
              <span>
                {currentTime.greeting}, {firstName} 👋
              </span>
            </div>
          </div>

          {/* Top Center: Large Minimalist Clock */}
          <div className="text-center flex flex-col items-center">
            <div className="flex items-baseline justify-center gap-1.5 font-light tracking-tight text-[#172B49]">
              <span className="text-5xl sm:text-6xl font-light tracking-tighter">
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
          <div className="flex flex-col items-end gap-2.5">
            {/* Quick Utility Pill */}
            <div className="glass-pill px-3 py-1.5 flex items-center gap-3 text-[#496A96]">
              <button
                onClick={() => router.push('/builder')}
                title="Edit Resume"
                className="hover:text-[#172B49] transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                title="Brightness"
                className="hover:text-[#172B49] transition-colors"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleSignOut}
                title="Log Out"
                className="hover:text-red-600 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Weather Glass Card */}
            <div className="glass-card px-4 py-3 rounded-2xl flex items-center gap-3.5 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-blue-100/60 flex items-center justify-center text-blue-700">
                <Moon className="w-5 h-5 fill-blue-600/30 text-blue-700" />
              </div>
              <div className="text-right leading-tight">
                <div className="text-sm font-bold text-[#172B49]">24°C</div>
                <div className="text-[11px] text-[#496A96] font-medium">Clear Sky</div>
                <div className="text-[10px] text-[#718096]">Semarang, ID</div>
              </div>
            </div>
          </div>
        </header>

        {/* Center Pill Search Bar */}
        <div className="max-w-xl mx-auto w-full mb-8">
          <div className="glass-pill px-4 py-2.5 flex items-center gap-3 w-full shadow-sm hover:shadow-md transition-all">
            <Search className="w-4 h-4 text-[#718096]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search CVs, templates, or AI prompts..."
              className="bg-transparent text-xs text-[#172B49] placeholder:text-[#718096] flex-1 focus:outline-none"
            />
            <span className="text-[10px] font-mono font-semibold text-[#718096] bg-white/60 px-1.5 py-0.5 rounded-md border border-white/80">
              ⌘K
            </span>
          </div>
        </div>

        {/* 3. Main Dashboard Grid Layout matching Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Column 1: Bookmarks / My Resumes + Notes (3.5 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Bookmarks Card */}
            <div className="glass-card p-5 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold tracking-tight text-[#172B49]">Bookmarks</h3>
                <Link
                  href="/builder"
                  className="text-[11px] font-semibold text-[#496A96] hover:text-[#172B49] transition-colors"
                >
                  View all
                </Link>
              </div>

              {/* Bookmarks List */}
              <div className="space-y-2">
                {[
                  { name: 'YouTube', domain: 'youtube.com', color: 'bg-red-500' },
                  { name: 'Reddit', domain: 'reddit.com', color: 'bg-orange-500' },
                  { name: 'GitHub', domain: 'github.com', color: 'bg-slate-900' },
                  { name: 'Hacker News', domain: 'news.ycombinator.com', color: 'bg-amber-600' },
                  { name: 'Twitter', domain: 'x.com', color: 'bg-black' },
                  { name: 'Netflix', domain: 'netflix.com', color: 'bg-red-600' },
                ].map((item, i) => (
                  <div
                    key={i}
                    onClick={() => router.push('/builder')}
                    className="flex items-center justify-between p-2.5 rounded-xl glass-inset hover:scale-[1.01] cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg ${item.color} flex items-center justify-center text-white text-[10px] font-bold shadow-sm`}>
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#172B49] leading-tight group-hover:text-blue-700 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-[#718096]">{item.domain}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#718096] group-hover:text-[#172B49] group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Card */}
            <div className="glass-card p-5 rounded-3xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#496A96]" />
                  <h3 className="text-xs font-bold text-[#172B49]">Notes</h3>
                </div>
                <button
                  onClick={handleCreateNewCV}
                  className="w-5 h-5 rounded-lg glass-inset flex items-center justify-center text-xs font-bold text-[#172B49] hover:bg-white"
                  title="Add Note / New CV"
                >
                  +
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/50 border border-white/80 shadow-sm">
                <p className="text-xs text-[#172B49] leading-relaxed font-medium">
                  Don&apos;t forget to focus on progress, not perfection. Keep CV concise and ATS-optimized.
                </p>
                <div className="text-[10px] text-[#718096] mt-2 font-mono">
                  Today, {currentTime.timeStr} {currentTime.ampm}
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Access + Quote + Activity (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Quick Access Card */}
            <div className="glass-card p-5 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-[#172B49]">Quick Access</h3>
                <button
                  onClick={() => router.push('/builder')}
                  className="text-[11px] font-semibold text-[#496A96] hover:text-[#172B49]"
                >
                  Edit
                </button>
              </div>

              {/* 8 Glass Icon Tiles Grid */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'AI Custom', icon: Wand2, color: 'bg-purple-100 text-purple-700', href: '/builder' },
                  { label: 'GitHub', icon: ExternalLink, color: 'bg-slate-100 text-slate-800', href: 'https://github.com/FazleDzakyA/cvmaker' },
                  { label: 'Student', icon: GraduationCap, color: 'bg-blue-100 text-blue-700', href: '/student-mode' },
                  { label: 'PDF Export', icon: Download, color: 'bg-emerald-100 text-emerald-700', href: '/builder' },
                  { label: 'ATS Scan', icon: ShieldCheck, color: 'bg-indigo-100 text-indigo-700', href: '/ats-checker' },
                  { label: 'Gemini AI', icon: Sparkles, color: 'bg-sky-100 text-sky-700', href: '/builder' },
                  { label: 'Templates', icon: LayoutTemplate, color: 'bg-amber-100 text-amber-700', href: '/templates' },
                  { label: 'New Blank', icon: Plus, color: 'bg-white text-[#172B49]', action: handleCreateNewCV },
                ].map((tile, i) => {
                  const Icon = tile.icon;
                  return (
                    <div
                      key={i}
                      onClick={() => (tile.action ? tile.action() : router.push(tile.href))}
                      className="glass-inset p-3 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 hover:bg-white/80 transition-all group"
                    >
                      <div className={`w-10 h-10 rounded-2xl ${tile.color} flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#172B49] truncate max-w-full">
                        {tile.label}
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
                &ldquo;The best way to predict the future is to create it.&rdquo;
              </p>
              <div className="text-[11px] text-[#718096] font-semibold mt-2">
                — Peter Drucker
              </div>
            </div>

            {/* Recently Closed / Activity Card */}
            <div className="glass-card p-5 rounded-3xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-[#172B49]">Recently Closed</h3>
                <button
                  onClick={() => setCvs([])}
                  className="text-[11px] font-semibold text-[#496A96] hover:text-[#172B49]"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { title: 'Design Inspiration – Dribbble', tag: 'dribbble.com', time: '2m ago', color: 'bg-pink-500' },
                  { title: 'Build beautiful products faster', tag: 'linear.app', time: '15m ago', color: 'bg-blue-600' },
                  { title: 'Dashboard – CVGenie Studio', tag: 'cvgenie.app', time: '1h ago', color: 'bg-amber-600' },
                ].map((act, i) => (
                  <div
                    key={i}
                    onClick={() => router.push('/builder')}
                    className="flex items-center justify-between p-2.5 rounded-xl glass-inset hover:bg-white/80 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-3 h-3 rounded-full ${act.color}`} />
                      <div>
                        <div className="text-xs font-semibold text-[#172B49]">{act.title}</div>
                        <div className="text-[10px] text-[#718096]">{act.tag}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#718096]">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: To Do + Tall Lo-Fi Focus Music Player (3.5 cols) */}
          <div className="lg:col-span-3 space-y-5">
            {/* To Do Widget */}
            <div className="glass-card p-5 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-[#172B49]">To Do</h3>
                <button
                  onClick={() => {
                    const text = prompt('Tambah tugas baru:');
                    if (text) {
                      setTodos([...todos, { id: Date.now(), text, completed: false }]);
                    }
                  }}
                  className="text-[11px] font-semibold text-[#496A96] hover:text-[#172B49]"
                >
                  + Add
                </button>
              </div>

              {/* To Do Checkbox items */}
              <div className="space-y-2 mb-4">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    onClick={() => toggleTodo(todo.id)}
                    className="flex items-start gap-2.5 p-2 rounded-xl glass-inset hover:bg-white/70 cursor-pointer transition-all"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#718096] shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-xs leading-snug ${
                        todo.completed
                          ? 'line-through text-[#718096]'
                          : 'font-semibold text-[#172B49]'
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="pt-2 border-t border-white/60">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#496A96] mb-1.5">
                  <span>Completed</span>
                  <span>
                    {completedCount} / {todos.length}
                  </span>
                </div>
                <div className="w-full bg-white/60 h-1.5 rounded-full overflow-hidden border border-white/80">
                  <div
                    className="bg-[#172B49] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(completedCount / todos.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Tall Vertical Music Player (Focus: Lo-Fi Beats) */}
            <div className="glass-card rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between h-[300px] shadow-lg group">
              {/* Lake Landscape Image Background inside card */}
              <div
                className="absolute inset-0 bg-cover bg-center brightness-95 transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(23, 43, 73, 0.1) 0%, rgba(23, 43, 73, 0.75) 100%), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop')`,
                }}
              />

              {/* Top Label */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 bg-black/25 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  Focus Mode
                </span>
                <span className="text-white/80 text-xs">♫</span>
              </div>

              {/* Bottom Player Info & Controls */}
              <div className="relative z-10 text-white space-y-3">
                <div>
                  <div className="text-sm font-bold tracking-tight text-white drop-shadow-sm">
                    Focus
                  </div>
                  <div className="text-[11px] text-white/80">Lo-Fi Beats</div>
                </div>

                {/* Glass Audio Controls */}
                <div className="flex items-center justify-center gap-4 pt-1">
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-white text-[#172B49] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-[#172B49]" /> : <Play className="w-4 h-4 fill-[#172B49] ml-0.5" />}
                  </button>
                  <button
                    onClick={() => setIsPlaying(true)}
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
            <span>Stay curious, keep learning.</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
