'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Code,
  Award,
  Palette,
  User,
  Wand2,
  RefreshCw,
  FileCheck,
} from 'lucide-react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { saveActiveCV } from '@/lib/storage';
import { CVData } from '@/types/cv';
import { TEMPLATES_CATALOG } from '@/data/templateCatalog';

export default function QuickBuilderPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 10;
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Form State
  const [purpose, setPurpose] = useState<string>('Internship');
  const [experienceLevel, setExperienceLevel] = useState<string>('Student Projects');

  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    github: '',
    summary: '',
  });

  const [educationList, setEducationList] = useState([
    {
      id: 'edu-1',
      institution: '',
      degree: 'Sekolah Menengah Kejuruan (SMK)',
      fieldOfStudy: '',
      startDate: '2021',
      endDate: '2024',
      gpa: '',
      relevantCourses: '',
    },
  ]);

  const [experienceList, setExperienceList] = useState<any[]>([]);

  const [projectsList, setProjectsList] = useState([
    {
      id: 'proj-1',
      title: '',
      role: 'Pelaksana Proyek',
      technologies: '',
      link: '',
      description: '',
      result: '',
    },
  ]);

  const [skills, setSkills] = useState({
    technical: '',
    software: '',
    soft: 'Kerja Sama Tim, Komunikasi Terbuka, Disiplin Waktu, Cepat Beradaptasi',
    languages: 'Bahasa Indonesia (Native), Bahasa Inggris (Intermediate)',
  });

  const [certificationsList, setCertificationsList] = useState<any[]>([]);
  const [achievementsList, setAchievementsList] = useState<any[]>([]);

  const [designPreferences, setDesignPreferences] = useState({
    templateId: 'minimalist' as 'minimalist' | 'corporate' | 'creative' | 'ats' | 'student' | 'tech',
    accentColor: '#6685FF',
    language: 'id',
  });

  // Step 1: Purpose options
  const PURPOSE_OPTIONS = [
    { label: 'Magang / PKL Industri (Internship)', val: 'Internship', desc: 'Fokus pada kesiapan belajar dan tugas praktikum sekolah' },
    { label: 'Pekerjaan Pertama (First Job)', val: 'First Job', desc: 'Untuk fresh graduate SMK, SMA, atau sarjana' },
    { label: 'Beasiswa Pendidikan (Scholarship)', val: 'Scholarship', desc: 'Fokus pada capaian akademik dan keaktifan organisasi' },
    { label: 'Pendaftaran Universitas', val: 'University Application', desc: 'Mendaftar ke perguruan tinggi dalam atau luar negeri' },
    { label: 'Karir Profesional', val: 'Professional Career', desc: 'Melamar ke jenjang karir spesialis dengan portofolio' },
  ];

  // Step 2: Experience options
  const EXP_OPTIONS = [
    { label: 'Belum Ada Pengalaman Kerja Formal', val: 'No Work Experience', desc: 'Akan menonjolkan tugas praktikum dan karakter belajar' },
    { label: 'Proyek / Tugas Praktikum Sekolah', val: 'Student Projects', desc: 'Pernah mengerjakan tugas kejuruan terapan' },
    { label: 'Pengalaman Magang / PKL Industri', val: 'Internship Experience', desc: 'Pernah magang beberapa bulan di perusahaan/instansi' },
    { label: 'Keaktifan Organisasi & Ekskul', val: 'Organizational Experience', desc: 'Aktif di OSIS, kepanitiaan, atau komunitas' },
    { label: 'Pengalaman Kerja 1+ Tahun', val: 'Professional Experience', desc: 'Memiliki riwayat pekerjaan tetap atau kontrak' },
  ];

  // Education Helpers
  const addEducation = () => {
    setEducationList([
      ...educationList,
      {
        id: `edu-${Date.now()}`,
        institution: '',
        degree: 'SMK / Sederajat',
        fieldOfStudy: '',
        startDate: '2021',
        endDate: '2024',
        gpa: '',
        relevantCourses: '',
      },
    ]);
  };

  const removeEducation = (id: string) => {
    if (educationList.length > 1) {
      setEducationList(educationList.filter((e) => e.id !== id));
    }
  };

  // Experience Helpers
  const addExperience = () => {
    setExperienceList([
      ...experienceList,
      {
        id: `exp-${Date.now()}`,
        position: '',
        company: '',
        location: '',
        startDate: '2023',
        endDate: '2024',
        responsibilities: '',
        achievements: '',
      },
    ]);
  };

  const removeExperience = (id: string) => {
    setExperienceList(experienceList.filter((e) => e.id !== id));
  };

  // Projects Helpers
  const addProject = () => {
    setProjectsList([
      ...projectsList,
      {
        id: `proj-${Date.now()}`,
        title: '',
        role: 'Pelaksana Proyek',
        technologies: '',
        link: '',
        description: '',
        result: '',
      },
    ]);
  };

  const removeProject = (id: string) => {
    if (projectsList.length > 1) {
      setProjectsList(projectsList.filter((p) => p.id !== id));
    }
  };

  // Certifications Helpers
  const addCertification = () => {
    setCertificationsList([
      ...certificationsList,
      {
        id: `cert-${Date.now()}`,
        name: '',
        issuer: '',
        issueDate: '2024',
        credentialUrl: '',
      },
    ]);
  };

  const removeCertification = (id: string) => {
    setCertificationsList(certificationsList.filter((c) => c.id !== id));
  };

  // Final AI Generation (Step 10)
  const handleGenerateFinalCV = async () => {
    setIsGenerating(true);
    try {
      const skillsArray = [
        {
          category: 'Keahlian Teknis',
          skills: (skills.technical || '').split(',').map((s) => s.trim()).filter(Boolean),
        },
        {
          category: 'Software & Tools',
          skills: (skills.software || '').split(',').map((s) => s.trim()).filter(Boolean),
        },
        {
          category: 'Keterampilan Interpersonal (Soft Skills)',
          skills: (skills.soft || '').split(',').map((s) => s.trim()).filter(Boolean),
        },
      ].filter((cat) => cat.skills.length > 0);

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'quick_builder_generate',
          payload: {
            purpose,
            experienceLevel,
            personalInfo,
            education: educationList,
            experience: experienceList,
            projects: projectsList,
            skills: skillsArray,
            certifications: certificationsList,
            achievements: achievementsList,
            designPreferences,
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
      setIsGenerating(false);
    }
  };

  return (
    <AuthGuard>
      <div className="misty-mountain-viewport min-h-screen flex flex-col md:flex-row p-3 sm:p-5 lg:p-6 gap-4 lg:gap-6 overflow-x-hidden selection:bg-blue-200">
        <AppSidebar />

        <main className="flex-1 min-w-0 flex flex-col max-w-4xl mx-auto w-full pb-20 md:pb-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-6 pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-[#172B49] text-xs font-bold mb-3 shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Metode 2: Quick CV Builder (10 Langkah Terpadu)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B49] tracking-tight mb-2">
              Buat CV Profesional dalam Hitungan Menit
            </h1>
            <p className="text-xs sm:text-sm text-[#718096]">
              Ikuti formulir bertahap ini. AI kami akan memoles tata bahasa, menyusun ringkasan, dan merapikan format ke standar ATS.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="rounded-3xl glass-card border border-white/90 p-4 sm:p-5 bg-white/85 shadow-md mb-6">
            <div className="flex items-center justify-between text-xs font-bold text-[#172B49] mb-2">
              <span>Langkah {currentStep} dari {totalSteps}</span>
              <span className="text-blue-600 font-extrabold">{Math.round((currentStep / totalSteps) * 100)}% Selesai</span>
            </div>
            <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* MAIN STEP CONTAINER */}
          <div className="rounded-3xl glass-card border border-white/90 p-6 sm:p-8 bg-white/95 shadow-xl mb-6">
            {/* STEP 1: CV PURPOSE */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-base font-bold text-[#172B49] flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <span>1. Apa Tujuan Utama Pembuatan CV Anda?</span>
                </h3>
                <p className="text-xs text-[#718096]">
                  Pilih keperluan Anda agar formula kalimat dan penekanan poin CV dapat disesuaikan.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {PURPOSE_OPTIONS.map((opt) => (
                    <div
                      key={opt.val}
                      onClick={() => setPurpose(opt.val)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        purpose === opt.val
                          ? 'bg-[#172B49] text-white border-[#172B49] shadow-md scale-[1.01]'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <h4 className="text-xs font-bold mb-1">{opt.label}</h4>
                      <p className={`text-[11px] ${purpose === opt.val ? 'text-slate-300' : 'text-slate-500'}`}>
                        {opt.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: EXPERIENCE LEVEL */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-base font-bold text-[#172B49] flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  <span>2. Seberapa Jauh Pengalaman Anda Saat Ini?</span>
                </h3>
                <p className="text-xs text-[#718096]">
                  Tidak punya pengalaman kerja? Tenang! Kami akan memprioritaskan tugas praktikum dan karakter kerja Anda.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {EXP_OPTIONS.map((opt) => (
                    <div
                      key={opt.val}
                      onClick={() => setExperienceLevel(opt.val)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        experienceLevel === opt.val
                          ? 'bg-[#172B49] text-white border-[#172B49] shadow-md scale-[1.01]'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <h4 className="text-xs font-bold mb-1">{opt.label}</h4>
                      <p className={`text-[11px] ${experienceLevel === opt.val ? 'text-slate-300' : 'text-slate-500'}`}>
                        {opt.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: PERSONAL INFORMATION */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-base font-bold text-[#172B49] flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>3. Informasi Kontak & Identitas Pribadi</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#172B49] mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      value={personalInfo.fullName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                      placeholder="e.g. Raditya Pratama"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172B49] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#172B49] mb-1">Target Posisi / Profesi *</label>
                    <input
                      type="text"
                      required
                      value={personalInfo.jobTitle}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, jobTitle: e.target.value })}
                      placeholder="e.g. Teknisi Otomotif, Staf Akuntansi, Web Developer"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172B49] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#172B49] mb-1">Alamat Email *</label>
                    <input
                      type="email"
                      required
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                      placeholder="nama@email.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172B49] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#172B49] mb-1">Nomor WhatsApp / HP *</label>
                    <input
                      type="tel"
                      required
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      placeholder="+62 812 3456 7890"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172B49] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#172B49] mb-1">Kota Domisili *</label>
                    <input
                      type="text"
                      value={personalInfo.location}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                      placeholder="e.g. Jakarta, Semarang, Surabaya"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172B49] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#172B49] mb-1">LinkedIn / Portfolio Link (Opsional)</label>
                    <input
                      type="text"
                      value={personalInfo.linkedin}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                      placeholder="linkedin.com/in/username"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172B49] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: EDUCATION */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#172B49] flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <span>4. Riwayat Pendidikan & Kejuruan</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Sekolah</span>
                  </button>
                </div>

                {educationList.map((edu, idx) => (
                  <div key={edu.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 relative">
                    {educationList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(edu.id)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#172B49] mb-1">Nama Sekolah / Kampus *</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...educationList];
                            updated[idx].institution = e.target.value;
                            setEducationList(updated);
                          }}
                          placeholder="e.g. SMK Negeri 1 Jakarta / Universitas Negeri"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#172B49] mb-1">Jurusan / Program Studi *</label>
                        <input
                          type="text"
                          value={edu.fieldOfStudy}
                          onChange={(e) => {
                            const updated = [...educationList];
                            updated[idx].fieldOfStudy = e.target.value;
                            setEducationList(updated);
                          }}
                          placeholder="e.g. Teknik Otomotif, Akuntansi, DKV"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#172B49] mb-1">Tahun Masuk - Kelulusan</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={edu.startDate}
                            onChange={(e) => {
                              const updated = [...educationList];
                              updated[idx].startDate = e.target.value;
                              setEducationList(updated);
                            }}
                            placeholder="2021"
                            className="w-1/2 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
                          />
                          <span>-</span>
                          <input
                            type="text"
                            value={edu.endDate}
                            onChange={(e) => {
                              const updated = [...educationList];
                              updated[idx].endDate = e.target.value;
                              setEducationList(updated);
                            }}
                            placeholder="2024"
                            className="w-1/2 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#172B49] mb-1">Nilai Rata-rata / IPK (Opsional)</label>
                        <input
                          type="text"
                          value={edu.gpa}
                          onChange={(e) => {
                            const updated = [...educationList];
                            updated[idx].gpa = e.target.value;
                            setEducationList(updated);
                          }}
                          placeholder="e.g. 89.5 / 100 atau 3.75 / 4.00"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 5: EXPERIENCE (SKIPPABLE) */}
            {currentStep === 5 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#172B49] flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      <span>5. Pengalaman Kerja / Magang PKL (Opsional)</span>
                    </h3>
                    <p className="text-xs text-[#718096]">
                      Bila Anda belum pernah magang atau bekerja formal, lewati bagian ini dengan langsung klik Selanjutnya.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Pengalaman</span>
                  </button>
                </div>

                {experienceList.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                    <p className="text-xs text-slate-600">Belum ada pengalaman kerja yang ditambahkan.</p>
                    <button
                      type="button"
                      onClick={addExperience}
                      className="px-4 py-2 rounded-xl bg-[#172B49] text-white text-xs font-bold"
                    >
                      + Tambah Pengalaman PKL / Kerja
                    </button>
                  </div>
                ) : (
                  experienceList.map((exp, idx) => (
                    <div key={exp.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => removeExperience(exp.id)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-[#172B49] mb-1">Perusahaan / Bengkel / Instansi</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const updated = [...experienceList];
                              updated[idx].company = e.target.value;
                              setExperienceList(updated);
                            }}
                            placeholder="e.g. PT Industri Otomotif Mitra / Kantor Koperasi"
                            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#172B49] mb-1">Posisi / Jabatan</label>
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => {
                              const updated = [...experienceList];
                              updated[idx].position = e.target.value;
                              setExperienceList(updated);
                            }}
                            placeholder="e.g. Staf Magang Teknisi, Asisten Keuangan"
                            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#172B49] mb-1">Tanggung Jawab & Hasil Kerja Utama</label>
                        <textarea
                          rows={2}
                          value={exp.responsibilities}
                          onChange={(e) => {
                            const updated = [...experienceList];
                            updated[idx].responsibilities = e.target.value;
                            setExperienceList(updated);
                          }}
                          placeholder="e.g. Melakukan pengecekan sistem rem dan servis berkala 10 kendaraan per hari sesuai SOP..."
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 resize-none"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* STEP 6: PROJECTS & PRACTICUM */}
            {currentStep === 6 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#172B49] flex items-center gap-2">
                      <FolderGit2 className="w-5 h-5 text-indigo-600" />
                      <span>6. Proyek / Tugas Praktikum Terbesar</span>
                    </h3>
                    <p className="text-xs text-[#718096]">
                      Ini adalah bagian paling penting bagi pelajar/fresh graduate untuk membuktikan kompetensi nyata Anda!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addProject}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Proyek</span>
                  </button>
                </div>

                {projectsList.map((proj, idx) => (
                  <div key={proj.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 relative">
                    {projectsList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProject(proj.id)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#172B49] mb-1">Judul Proyek / Praktikum *</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const updated = [...projectsList];
                            updated[idx].title = e.target.value;
                            setProjectsList(updated);
                          }}
                          placeholder="e.g. Servis Overhaul Transmisi Avanza / Pembukuan Keuangan Koperasi"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#172B49] mb-1">Alat / Software / Metode yang Digunakan</label>
                        <input
                          type="text"
                          value={proj.technologies}
                          onChange={(e) => {
                            const updated = [...projectsList];
                            updated[idx].technologies = e.target.value;
                            setProjectsList(updated);
                          }}
                          placeholder="e.g. Engine Scanner, Accurate, Photoshop, Multimeter"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#172B49] mb-1">Deskripsi & Hasil yang Dicapai</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => {
                          const updated = [...projectsList];
                          updated[idx].description = e.target.value;
                          setProjectsList(updated);
                        }}
                        placeholder="e.g. Melakukan pembongkaran, pembersihan injektor, dan pengujian emisi dengan tingkat akurasi sesuai standar bengkel..."
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 7: SKILLS */}
            {currentStep === 7 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-base font-bold text-[#172B49] flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  <span>7. Keahlian & Keterampilan Utama</span>
                </h3>
                <p className="text-xs text-[#718096]">
                  Pisahkan setiap keahlian dengan tanda koma (,).
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#172B49] mb-1">Keahlian Teknis Kejuruan (Hard Skills)</label>
                    <input
                      type="text"
                      value={skills.technical}
                      onChange={(e) => setSkills({ ...skills, technical: e.target.value })}
                      placeholder="e.g. Tune-Up Injeksi, Kearsipan Digital, Rekonsiliasi Bank, Instalasi LAN"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#172B49] mb-1">Software & Peralatan Kerja</label>
                    <input
                      type="text"
                      value={skills.software}
                      onChange={(e) => setSkills({ ...skills, software: e.target.value })}
                      placeholder="e.g. Scanner OBD, Accurate, Microsoft Excel, Adobe Illustrator, Mikrotik"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#172B49] mb-1">Karakter Kerja & Soft Skills</label>
                    <input
                      type="text"
                      value={skills.soft}
                      onChange={(e) => setSkills({ ...skills, soft: e.target.value })}
                      placeholder="e.g. Kerja Sama Tim, Disiplin Waktu, Cepat Beradaptasi"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: CERTIFICATIONS & ACHIEVEMENTS */}
            {currentStep === 8 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#172B49] flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-600" />
                      <span>8. Sertifikasi & Prestasi Kejuruan (Opsional)</span>
                    </h3>
                    <p className="text-xs text-[#718096]">
                      Sertifikasi UKK, BNSP, piagam pelatihan, atau lomba kompetensi siswa (LKS).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addCertification}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Sertifikasi</span>
                  </button>
                </div>

                {certificationsList.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-xs text-slate-500">
                    Belum ada sertifikasi yang ditambahkan. Anda dapat melewati bagian ini jika belum memilikinya.
                  </div>
                ) : (
                  certificationsList.map((cert, idx) => (
                    <div key={cert.id} className="p-3.5 rounded-2xl border border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-3 gap-2.5 relative">
                      <button
                        type="button"
                        onClick={() => removeCertification(cert.id)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Nama Sertifikat</label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => {
                            const updated = [...certificationsList];
                            updated[idx].name = e.target.value;
                            setCertificationsList(updated);
                          }}
                          placeholder="e.g. Sertifikat UKK Grade A"
                          className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Penerbit</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => {
                            const updated = [...certificationsList];
                            updated[idx].issuer = e.target.value;
                            setCertificationsList(updated);
                          }}
                          placeholder="e.g. BNSP / Lembaga Sertifikasi"
                          className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Tahun</label>
                        <input
                          type="text"
                          value={cert.issueDate}
                          onChange={(e) => {
                            const updated = [...certificationsList];
                            updated[idx].issueDate = e.target.value;
                            setCertificationsList(updated);
                          }}
                          placeholder="2024"
                          className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-200"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* STEP 9: DESIGN PREFERENCES */}
            {currentStep === 9 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-base font-bold text-[#172B49] flex items-center gap-2">
                  <Palette className="w-5 h-5 text-indigo-600" />
                  <span>9. Pilih Template & Gaya Tampilan CV</span>
                </h3>
                <p className="text-xs text-[#718096]">
                  Pilih tata letak yang paling sesuai dengan target industri Anda:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {TEMPLATES_CATALOG.map((tpl) => (
                    <div
                      key={tpl.id}
                      onClick={() => setDesignPreferences({ ...designPreferences, templateId: tpl.id as any })}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        designPreferences.templateId === tpl.id
                          ? 'bg-[#172B49] text-white border-[#172B49] shadow-md scale-105'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 block w-max mb-1.5">
                        {tpl.category}
                      </span>
                      <h4 className="text-xs font-bold truncate">{tpl.name}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 10: AI GENERATION & FINAL COMPILATION */}
            {currentStep === 10 && (
              <div className="space-y-5 text-center py-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
                  <Wand2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#172B49]">Siap Memoles & Menyusun CV Anda!</h3>
                  <p className="text-xs text-[#718096] max-w-md mx-auto mt-1 leading-relaxed">
                    Semua data 10 langkah telah terkumpul. Klik tombol di bawah agar AI memoles kalimat, mengoptimalkan format ATS, dan membuka hasilnya di Studio CV.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nama:</span>
                    <span className="font-bold text-[#172B49]">{personalInfo.fullName || 'Belum diisi'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target:</span>
                    <span className="font-bold text-[#172B49]">{personalInfo.jobTitle || 'Belum diisi'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pendidikan:</span>
                    <span className="font-bold text-[#172B49]">{educationList[0]?.institution || '1 Sekolah'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Proyek:</span>
                    <span className="font-bold text-[#172B49]">{projectsList.length} Proyek Praktikum</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateFinalCV}
                  disabled={isGenerating}
                  className="px-8 py-3.5 rounded-2xl bg-[#172B49] hover:bg-[#243B80] text-white text-xs font-bold shadow-xl shadow-[#172B49]/25 transition-all hover:scale-105 inline-flex items-center gap-2 disabled:opacity-60"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>AI Sedang Memoles CV Anda...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-blue-300" />
                      <span>Generate & Buka di Studio CV</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* NAVIGATION BUTTONS */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200/80 mt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1 || isGenerating}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-30 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>

              {currentStep < 10 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.min(10, currentStep + 1))}
                  className="px-6 py-2.5 rounded-xl bg-[#172B49] hover:bg-[#243B80] text-white text-xs font-bold shadow-md shadow-[#172B49]/20 flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <span>Selanjutnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
