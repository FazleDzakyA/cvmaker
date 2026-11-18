'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Send,
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
  Bot,
  User,
  Wand2,
  RefreshCw,
  FolderGit2,
  GraduationCap,
  Briefcase,
  HelpCircle,
  Eye,
  SkipForward,
  FileText,
} from 'lucide-react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { saveActiveCV, getActiveCV } from '@/lib/storage';
import { CVData } from '@/types/cv';
import { blankCVData } from '@/data/initialCVData';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  chips?: string[];
  timestamp: string;
}

export default function GuidedBuilderPage() {
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [stepIndex, setStepIndex] = useState<number>(1);
  const totalSteps = 7;
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isGeneratingCV, setIsGeneratingCV] = useState<boolean>(false);

  // Accumulated candidate CV state
  const [accumulatedData, setAccumulatedData] = useState({
    school: '',
    major: '',
    targetRole: '',
    skills: [] as string[],
    project: '',
    organization: '',
    certification: '',
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: 'Halo! Saya Konsultan Karir & Pembuat CV AI CVGenie. Saya akan memandu Anda langkah demi langkah menyusun CV yang profesional, terstruktur, dan siap lolos bot ATS.\n\nMari kita mulai: Di mana Anda bersekolah atau berkuliah saat ini, dan apa jurusan atau program studi Anda? (Ketik bebas nama sekolah dan jurusan Anda pada kolom input di bawah)',
      chips: [],
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle user response (from input or chip click)
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Save into accumulated data based on current step
    const updatedAccumulated = { ...accumulatedData };
    if (stepIndex === 1) {
      updatedAccumulated.school = 'Institusi Terakreditasi';
      updatedAccumulated.major = textToSend;
    } else if (stepIndex === 2) {
      updatedAccumulated.targetRole = textToSend;
    } else if (stepIndex === 3) {
      updatedAccumulated.skills = textToSend.split(',').map((s) => s.trim());
    } else if (stepIndex === 4) {
      updatedAccumulated.project = textToSend;
    } else if (stepIndex === 5) {
      updatedAccumulated.organization = textToSend;
    } else if (stepIndex === 6) {
      updatedAccumulated.certification = textToSend;
    }
    setAccumulatedData(updatedAccumulated);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'conversational_consultant',
          payload: {
            currentStep: stepIndex,
            userMessage: textToSend,
            accumulatedCV: updatedAccumulated,
          },
        }),
      });

      const data = await res.json();
      if (data.data) {
        setStepIndex(data.data.nextStep);
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.data.aiResponse,
          chips: data.data.chips || [],
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (e) {
      console.error(e);
      // Fallback AI message
      setStepIndex((prev) => prev + 1);
      const fallbackMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Terima kasih atas informasinya! Mari kita lanjut ke poin berikutnya.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Skip current question
  const handleSkipQuestion = () => {
    handleSendMessage('Saya belum memiliki bagian ini (Lewati)');
  };

  // Compile and Finalize CV into Studio
  const handleFinalizeCV = async () => {
    setIsGeneratingCV(true);
    try {
      const current = getActiveCV();
      const promptToUse = `Kandidat Jurusan: ${accumulatedData.major || 'Umum'}, Target Posisi: ${
        accumulatedData.targetRole || 'Junior Specialist'
      }, Keahlian: ${accumulatedData.skills.join(', ') || 'Standar Kompetensi'}, Proyek: ${
        accumulatedData.project || 'Praktikum Sekolah'
      }`;

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_custom_cv',
          payload: {
            userPrompt: promptToUse,
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
      setIsGeneratingCV(false);
    }
  };

  return (
    <AuthGuard>
      <div className="misty-mountain-viewport min-h-screen flex flex-col md:flex-row p-3 sm:p-5 lg:p-6 gap-4 lg:gap-6 overflow-x-hidden selection:bg-blue-200">
        <AppSidebar />

        <main className="flex-1 min-w-0 flex flex-col max-w-5xl mx-auto w-full pb-20 md:pb-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-6 pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-[#172B49] text-xs font-bold mb-3 shadow-sm">
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>Metode 3: Guided CV Builder (Konsultan AI Interaktif)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B49] tracking-tight mb-2">
              Obrolan Santai, CV Siap Kerja
            </h1>
            <p className="text-xs sm:text-sm text-[#718096]">
              Bingung harus mulai dari mana? AI Konsultan kami akan bertanya satu per satu dan menyusun pengalaman Anda menjadi CV profesional.
            </p>
          </div>

          {/* Chat & Live Summary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* CHAT CONTAINER (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col h-[650px] rounded-3xl glass-card border border-white/90 bg-white/90 shadow-2xl overflow-hidden">
              {/* Chat Header with Step Indicator */}
              <div className="p-4 px-6 border-b border-slate-200/80 bg-white/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#172B49] text-white flex items-center justify-center font-bold text-xs shadow-md">
                    <Sparkles className="w-4 h-4 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#172B49]">AI CV Consultant</h3>
                    <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Online & Siap Membantu</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-medium">Progress:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold text-[11px]">
                    Langkah {Math.min(stepIndex, totalSteps)} / {totalSteps}
                  </span>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-2xl bg-[#172B49] text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <Bot className="w-4 h-4 text-blue-300" />
                      </div>
                    )}

                    <div className="max-w-[85%] space-y-2">
                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-sm ${
                          msg.sender === 'user'
                            ? 'bg-[#172B49] text-white rounded-tr-none'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* Quick Reply Chips for AI message */}
                      {msg.chips && msg.chips.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {msg.chips.map((chip, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleSendMessage(chip)}
                              className="px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all hover:scale-105"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}

                      <span className="text-[9px] text-slate-400 block px-1">
                        {msg.timestamp}
                      </span>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-8 h-8 rounded-2xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 items-center text-xs text-slate-500">
                    <div className="w-8 h-8 rounded-2xl bg-[#172B49] text-white flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-blue-300" />
                    </div>
                    <div className="p-3 px-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce delay-100" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce delay-200" />
                      <span className="text-[11px] font-medium text-slate-400 ml-1">AI sedang menganalisis...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 sm:p-4 border-t border-slate-200/80 bg-white/60 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputText);
                  }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={handleSkipQuestion}
                    className="px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                    title="Lewati pertanyaan ini jika belum punya"
                  >
                    <SkipForward className="w-4 h-4" />
                    <span className="hidden sm:inline">Lewati</span>
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      stepIndex === 1
                        ? 'Ketik nama sekolah/kampus dan jurusan Anda bebas di sini...'
                        : stepIndex === 2
                        ? 'Ketik target posisi magang / kerja yang Anda tuju...'
                        : 'Ketik jawaban Anda di sini atau gunakan opsi cepat...'
                    }
                    className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#172B49]/20 text-[#172B49] placeholder:text-[#718096]"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim() || isTyping}
                    className="w-10 h-10 rounded-xl bg-[#172B49] hover:bg-[#243B80] text-white flex items-center justify-center shadow-md transition-all hover:scale-105 disabled:opacity-40 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* LIVE DATA ACCUMULATOR CARD (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-3xl glass-card border border-white/90 p-5 sm:p-6 bg-white/95 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="text-xs font-bold text-[#172B49] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Data yang Terkumpul</span>
                  </h3>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                    Live Sync
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Jurusan & Pendidikan</span>
                    <span className="font-bold text-[#172B49]">{accumulatedData.major || 'Belum diisi'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Target Profesi</span>
                    <span className="font-bold text-[#172B49]">{accumulatedData.targetRole || 'Belum diisi'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Keahlian Utama</span>
                    <span className="font-bold text-[#172B49]">
                      {accumulatedData.skills.length > 0 ? accumulatedData.skills.join(', ') : 'Belum diisi'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Proyek Praktikum</span>
                    <p className="text-[#172B49] text-[11px] line-clamp-2">{accumulatedData.project || 'Belum diisi'}</p>
                  </div>
                </div>

                {/* Finalize Button */}
                <div className="pt-3 border-t border-slate-200/80 space-y-2">
                  <button
                    type="button"
                    onClick={handleFinalizeCV}
                    disabled={isGeneratingCV || (!accumulatedData.major && !accumulatedData.targetRole)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {isGeneratingCV ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>AI Sedang Menyusun CV...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>Generate & Buka di Studio CV</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-[#718096]">
                    Anda selalu dapat mengedit semua data ini di Studio setelah di-generate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
