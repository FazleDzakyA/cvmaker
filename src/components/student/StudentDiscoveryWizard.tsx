'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  FolderGit2,
  Users,
  Trophy,
  Wand2,
  RefreshCw,
  Briefcase,
} from 'lucide-react';
import { CVData } from '@/types/cv';
import { getActiveCV, saveActiveCV } from '@/lib/storage';
import { transformStudentExperience, generateProfessionalSummary } from '@/lib/aiTransformer';

export const StudentDiscoveryWizard: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  const MAJOR_PRESETS: { [key: string]: { label: string; defaultRole: string; skills: string[]; sampleProject: { title: string; tools: string; desc: string } } } = {
    otomotif: {
      label: 'Teknik Otomotif (TKR / TBSM)',
      defaultRole: 'Teknisi Otomotif / Mekanik Magang',
      skills: ['Tune-up Mesin Injeksi', 'Diagnosa Scanner Otomotif', 'Perawatan Sistem Rem & Transmisi', 'Standar Keselamatan K3', 'Penggunaan Tool Presisi (Jangka Sorong)'],
      sampleProject: {
        title: 'Servis Berkala & Overhaul Sistem Injeksi Kendaraan',
        tools: 'Engine Scanner, Multimeter, Tool Set Mekanik, Kompresor',
        desc: 'Melakukan pembersihan injektor, penyetelan celah katup, dan pengecekan emisi gas buang pada mobil praktikum sekolah sesuai SOP bengkel resmi.',
      },
    },
    akuntansi: {
      label: 'Akuntansi & Keuangan (AKL)',
      defaultRole: 'Staf Administrasi Keuangan / Pembukuan',
      skills: ['Penyusunan Jurnal Umum', 'Laporan Keuangan & Neraca', 'Microsoft Excel Lanjutan', 'Software Accurate / MYOB', 'Perpajakan PPh/PPN', 'Rekonsiliasi Bank'],
      sampleProject: {
        title: 'Penyusunan Laporan Siklus Akuntansi Koperasi Sekolah',
        tools: 'Microsoft Excel, Accurate Accounting, Bukti Kas/Faktur',
        desc: 'Mencatat transaksi harian, membuat buku besar pembantu piutang, dan menyajikan laporan laba rugi serta neraca saldo dengan 100% balance.',
      },
    },
    perkantoran: {
      label: 'Manajemen Perkantoran (MPLB)',
      defaultRole: 'Staf Administrasi Perkantoran & Resepsionis',
      skills: ['Kearsipan Digital (Filing System)', 'Korespondensi Surat Niaga/Dinas', 'Pengelolaan Agenda & Notulensi', 'Pelayanan Prima (Customer Service)', 'Microsoft Word & PowerPoint'],
      sampleProject: {
        title: 'Digitalisasi Sistem Kearsipan & Surat Menyurat',
        tools: 'Google Workspace, Scanner Dokumen, Microsoft Office',
        desc: 'Mengindeks dan mengarsipkan ratusan dokumen fisik ke sistem cloud serta menyusun format surat dinas resmi untuk rapat tahunan sekolah.',
      },
    },
    dkv: {
      label: 'Desain Komunikasi Visual (DKV / Multimedia)',
      defaultRole: 'Desainer Grafis & Kreatif Media',
      skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe Premiere Pro', 'Figma Prototyping', 'Tipografi & Layout', 'Branding & Identitas Visual'],
      sampleProject: {
        title: 'Perancangan Identitas Visual & Kemasan Produk UMKM Lokal',
        tools: 'Adobe Illustrator, Photoshop, Mockup 3D',
        desc: 'Merancang logo, buku panduan grafis (brand guidelines), dan desain kemasan produk ramah lingkungan untuk praktikum kewirausahaan sekolah.',
      },
    },
    tkj: {
      label: 'Teknik Komputer & Jaringan (TKJ)',
      defaultRole: 'Teknisi Jaringan & IT Support',
      skills: ['Konfigurasi Mikrotik RouterOS', 'Instalasi LAN & Pengkabelan UTP', 'Routing Statis & Dinamis', 'Troubleshooting Hardware & PC', 'Manajemen Bandwidth'],
      sampleProject: {
        title: 'Rancang Bangun Jaringan Lab Komputer & Hotspot Sekolah',
        tools: 'Mikrotik Router, Switch Manageable, Kabel Cat6, Tester LAN',
        desc: 'Membangun infrastruktur jaringan lokal untuk 40 unit PC, mengatur DHCP server, serta membatasi akses konten berbahaya dengan firewall Mikrotik.',
      },
    },
    kuliner: {
      label: 'Tata Boga / Perhotelan (Kuliner)',
      defaultRole: 'Cook Helper / Staf Restoran & F&B',
      skills: ['Pengolahan Makanan Kontinental & Nusantara', 'Standar Higienitas HACCP', 'Teknik Dasar Pisau (Knife Skills)', 'Plating & Food Presentation', 'Hospitality Service'],
      sampleProject: {
        title: 'Pengolahan dan Penyajian Menu Banqueting 3-Course',
        tools: 'Kitchen Equipment Standar Industri, Termometer Makanan',
        desc: 'Menyiapkan appetizer, main course, dan dessert untuk 100 tamu acara sekolah dengan menerapkan kontrol suhu makanan dan ketepatan plating.',
      },
    },
    farmasi: {
      label: 'Farmasi & Keperawatan',
      defaultRole: 'Asisten Tenaga Kefarmasian',
      skills: ['Peracikan Obat (Puyer, Salep, Kapsul)', 'Membaca Resep Dokter', 'Pelayanan Informasi Obat (PIO)', 'Manajemen Stok FIFO/FEFO', 'Standar Sterilisasi Medis'],
      sampleProject: {
        title: 'Praktikum Simulasi Pelayanan Resep & Peracikan Apotek',
        tools: 'Mortir & Stamper, Timbangan Analitik, Buku Farmakope',
        desc: 'Meracik sediaan serbuk bagi dan salep sesuai resep dokter, memeriksa dosis maksimum, dan menuliskan etiket informasi pemakaian obat.',
      },
    },
    sma: {
      label: 'SMA / MA (MIPA, IPS, Bahasa)',
      defaultRole: 'Kandidat Riset Akademik & Organisasi',
      skills: ['Karya Tulis Ilmiah (KIR)', 'Analisis Data Penelitian', 'Public Speaking & Debat', 'Kepemimpinan Kesiswaan (OSIS)', 'Bahasa Inggris Komunikatif'],
      sampleProject: {
        title: 'Penelitian Ilmiah Remaja & Analisis Data Lapangan',
        tools: 'Google Forms, Microsoft Excel, Dokumentasi Lapangan',
        desc: 'Meneliti fenomena sosial/lingkungan di lingkungan sekitar, mengolah data statistik kuesioner, dan mempresentasikan karya tulis di hadapan dewan guru.',
      },
    },
    pplg: {
      label: 'PPLG / Rekayasa Perangkat Lunak (RPL)',
      defaultRole: 'Junior Web & Software Developer',
      skills: ['HTML, CSS & JavaScript', 'Next.js & React', 'PHP & Laravel', 'MySQL & Database Relasional', 'Git & GitHub Version Control'],
      sampleProject: {
        title: 'Sistem Informasi Web Aplikasi Berbasis Database',
        tools: 'Visual Studio Code, MySQL, Web Framework, Git',
        desc: 'Membangun sistem informasi berbasis web dengan fitur autentikasi pengguna, pengolahan data CRUD, dan antarmuka responsif.',
      },
    },
  };

  const [selectedMajorKey, setSelectedMajorKey] = useState<string>('otomotif');

  // Wizard State
  const [studentInfo, setStudentInfo] = useState({
    schoolType: 'SMK (Kejuruan)',
    schoolName: '',
    major: '',
    targetRole: '',
    gradYear: '2025',
  });

  const [projectInput, setProjectInput] = useState({
    title: MAJOR_PRESETS['otomotif'].sampleProject.title,
    tools: MAJOR_PRESETS['otomotif'].sampleProject.tools,
    rawDescription: MAJOR_PRESETS['otomotif'].sampleProject.desc,
  });

  const [orgInput, setOrgInput] = useState({
    organization: 'OSIS / Ekstrakurikuler Sekolah',
    role: 'Pengurus / Anggota Aktif',
    period: '2023 - 2024',
    rawDescription: 'Membantu perencanaan kegiatan sekolah, koordinasi antar seksi acara, dan pengelolaan dokumentasi kepanitiaan.',
  });

  const [skillsSelected, setSkillsSelected] = useState<string[]>(MAJOR_PRESETS['otomotif'].skills);
  const [customSkill, setCustomSkill] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformedProject, setTransformedProject] = useState<{
    highlights: string[];
    skills: string[];
  } | null>(null);

  // Switch Major Preset
  const handleSelectMajor = (key: string) => {
    setSelectedMajorKey(key);
    const preset = MAJOR_PRESETS[key];
    if (preset) {
      setStudentInfo((prev) => ({
        ...prev,
        major: preset.label,
        targetRole: preset.defaultRole,
      }));
      setProjectInput({
        title: preset.sampleProject.title,
        tools: preset.sampleProject.tools,
        rawDescription: preset.sampleProject.desc,
      });
      setSkillsSelected(preset.skills);
      setTransformedProject(null);
    }
  };

  // Transform Project with AI
  const handleAIExperienceTransform = async () => {
    setIsTransforming(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'transform_experience',
          payload: {
            type: 'school_project',
            title: projectInput.title,
            rawDescription: projectInput.rawDescription,
            toolsUsed: projectInput.tools,
            fieldCategory: selectedMajorKey,
          },
        }),
      });
      const data = await res.json();
      if (data.data) {
        setTransformedProject({
          highlights: data.data.highlights,
          skills: data.data.inferredSkills,
        });
      }
    } catch {
      const result = transformStudentExperience({
        type: 'school_project',
        title: projectInput.title,
        rawDescription: projectInput.rawDescription,
        toolsUsed: projectInput.tools,
        fieldCategory: selectedMajorKey,
      });
      setTransformedProject({
        highlights: result.highlights,
        skills: result.inferredSkills,
      });
    } finally {
      setIsTransforming(false);
    }
  };

  // Complete and Apply to CV
  const handleCompleteWizard = () => {
    const existingCV = getActiveCV();

    const summary = generateProfessionalSummary(
      studentInfo.targetRole,
      studentInfo.schoolType,
      skillsSelected
    );

    const updatedCV: CVData = {
      ...existingCV,
      templateId: 'student',
      summary,
      education: [
        {
          id: `edu-${Date.now()}`,
          institution: studentInfo.schoolName || 'SMK / SMA Negeri',
          degree: studentInfo.schoolType.includes('SMK') ? 'Sekolah Menengah Kejuruan (SMK)' : 'SMA / MA',
          fieldOfStudy: studentInfo.major,
          startDate: '2022',
          endDate: studentInfo.gradYear,
          relevantCourses: `Praktikum ${studentInfo.major}, Standar Operasional Prosedur, Kerja Proyek Industri`,
        },
      ],
      projects: [
        {
          id: `proj-${Date.now()}`,
          title: projectInput.title,
          role: 'Pelaksana Proyek Praktikum',
          technologies: projectInput.tools.split(',').map((s) => s.trim()),
          highlights: transformedProject
            ? transformedProject.highlights
            : [
                `Melaksanakan proyek praktikum ${projectInput.title} sesuai standar operasional.`,
                'Menggunakan peralatan kerja dengan presisi dan menerapkan prinsip keselamatan kerja.',
              ],
        },
      ],
      organizations: [
        {
          id: `org-${Date.now()}`,
          organization: orgInput.organization,
          role: orgInput.role,
          period: orgInput.period,
          highlights: [
            'Aktif berkontribusi dalam perencanaan dan kelancaran kegiatan kepanitiaan sekolah.',
            'Membangun komunikasi harmonis dan kolaborasi antar anggota tim.',
          ],
        },
      ],
      skills: [
        {
          category: `Kompetensi Kejuruan (${studentInfo.major})`,
          skills: skillsSelected.filter((s) => !['Kerja Sama Tim', 'Komunikasi', 'Penyelesaian Masalah'].includes(s)),
        },
        {
          category: 'Keahlian Personal (Soft Skills)',
          skills: ['Kerja Sama Tim', 'Disiplin & Etos Kerja', 'Komunikasi Terbuka', 'Cepat Beradaptasi'],
        },
      ],
    };

    saveActiveCV(updatedCV);
    router.push('/builder');
  };

  return (
    <div className="max-w-3xl mx-auto rounded-3xl glass-card border border-white/90 shadow-2xl p-6 sm:p-10 bg-white/95 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Progress Bar & Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#172B49] text-white flex items-center justify-center font-bold text-xs">
              <GraduationCap className="w-4 h-4 text-blue-300" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#172B49]">
              Student Mode (Semua Jurusan SMK / SMA)
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400">
            Langkah {currentStep} dari {totalSteps}
          </span>
        </div>

        {/* Multi-step track */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#172B49] h-full rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Academic Background & Major Selector */}
      {currentStep === 1 && (
        <div className="space-y-5 animate-in fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172B49] mb-1">
              Pilih Jurusan atau Peminatan Sekolahmu
            </h2>
            <p className="text-xs sm:text-sm text-[#718096]">
              Belum punya pengalaman kerja? Tenang, praktikum sekolah dan tugas kejuruanmu punya nilai jual tinggi!
            </p>
          </div>

          {/* Major Chips Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#172B49] mb-2">
              Pilih Bidang Keahlian:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.keys(MAJOR_PRESETS).map((key) => {
                const isSelected = selectedMajorKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectMajor(key)}
                    className={`p-3 rounded-2xl text-left text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-[#172B49] text-white border-[#172B49] shadow-md scale-[1.02]'
                        : 'glass-inset text-[#172B49] border-white/80 hover:bg-white'
                    }`}
                  >
                    {MAJOR_PRESETS[key].label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#172B49] mb-1">Nama Sekolah</label>
              <input
                type="text"
                value={studentInfo.schoolName}
                onChange={(e) => setStudentInfo({ ...studentInfo, schoolName: e.target.value })}
                placeholder="Contoh: SMK Negeri 1 / SMA 3"
                className="w-full text-xs p-3 rounded-xl glass-inset bg-white border border-slate-200 text-[#172B49] focus:outline-none focus:ring-2 focus:ring-[#172B49]/20 placeholder:text-[#718096]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B49] mb-1">Jurusan / Bidang Keahlian</label>
              <input
                type="text"
                value={studentInfo.major}
                onChange={(e) => setStudentInfo({ ...studentInfo, major: e.target.value })}
                placeholder="Ketik jurusanmu bebas (e.g. Tata Boga, Mesin...)"
                className="w-full text-xs p-3 rounded-xl glass-inset bg-white border border-slate-200 text-[#172B49] focus:outline-none focus:ring-2 focus:ring-[#172B49]/20 placeholder:text-[#718096]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B49] mb-1">Target Posisi Magang / Kerja</label>
              <input
                type="text"
                value={studentInfo.targetRole}
                onChange={(e) => setStudentInfo({ ...studentInfo, targetRole: e.target.value })}
                placeholder="Contoh: Teknisi Magang / Cook Helper"
                className="w-full text-xs p-3 rounded-xl glass-inset bg-white border border-slate-200 text-[#172B49] focus:outline-none focus:ring-2 focus:ring-[#172B49]/20 placeholder:text-[#718096]"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Project / Practical Assignment */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172B49] mb-1">
              Proyek Praktikum & Tugas Sekolah
            </h2>
            <p className="text-xs sm:text-sm text-[#718096]">
              Tugas akhir, praktek bengkel/lab, atau portofolio tugas yang pernah kamu kerjakan di sekolah.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B49] mb-1">Judul Proyek Praktikum</label>
            <input
              type="text"
              value={projectInput.title}
              onChange={(e) => setProjectInput({ ...projectInput, title: e.target.value })}
              className="w-full text-xs p-3 rounded-xl glass-inset bg-white border border-slate-200 text-[#172B49] focus:outline-none focus:ring-2 focus:ring-[#172B49]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B49] mb-1">Alat / Software / Peralatan yang Digunakan</label>
            <input
              type="text"
              value={projectInput.tools}
              onChange={(e) => setProjectInput({ ...projectInput, tools: e.target.value })}
              className="w-full text-xs p-3 rounded-xl glass-inset bg-white border border-slate-200 text-[#172B49] focus:outline-none focus:ring-2 focus:ring-[#172B49]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B49] mb-1">Ceritakan yang Kamu Kerjakan:</label>
            <textarea
              rows={3}
              value={projectInput.rawDescription}
              onChange={(e) => setProjectInput({ ...projectInput, rawDescription: e.target.value })}
              className="w-full text-xs p-3 rounded-xl glass-inset bg-white border border-slate-200 text-[#172B49] focus:outline-none focus:ring-2 focus:ring-[#172B49]/20 resize-none"
            />
          </div>

          {/* AI Transformation Button */}
          <button
            type="button"
            onClick={handleAIExperienceTransform}
            disabled={isTransforming || !projectInput.rawDescription.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isTransforming ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI Sedang Mengolah Menjadi Poin ATS...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Ubah ke Bahasa Resume Profesional dengan AI</span>
              </>
            )}
          </button>

          {transformedProject && (
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2 text-left animate-in fade-in">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span>Poin Resume ATS Berhasil Diformulasikan:</span>
              </span>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                {transformedProject.highlights.map((h, i) => (
                  <li key={i} className="leading-snug">{h}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Organization & Leadership */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172B49] mb-1">
              Organisasi & Kepemimpinan Siswa
            </h2>
            <p className="text-xs sm:text-sm text-[#718096]">
              OSIS, MPK, Pramuka, PMR, Rohis, atau kepanitiaan acara sekolah membuktikan kamu bisa bekerja sama dalam tim.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B49] mb-1">Nama Organisasi / Ekskul / Panitia</label>
            <input
              type="text"
              value={orgInput.organization}
              onChange={(e) => setOrgInput({ ...orgInput, organization: e.target.value })}
              className="w-full text-xs p-3 rounded-xl glass-inset bg-white border border-slate-200 text-[#172B49]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#172B49] mb-1">Peran / Jabatan</label>
              <input
                type="text"
                value={orgInput.role}
                onChange={(e) => setOrgInput({ ...orgInput, role: e.target.value })}
                className="w-full text-xs p-3 rounded-xl glass-inset bg-white border border-slate-200 text-[#172B49]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#172B49] mb-1">Periode</label>
              <input
                type="text"
                value={orgInput.period}
                onChange={(e) => setOrgInput({ ...orgInput, period: e.target.value })}
                className="w-full text-xs p-3 rounded-xl glass-inset bg-white border border-slate-200 text-[#172B49]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B49] mb-1">Kontribusi Nyata Anda:</label>
            <textarea
              rows={3}
              value={orgInput.rawDescription}
              onChange={(e) => setOrgInput({ ...orgInput, rawDescription: e.target.value })}
              className="w-full text-xs p-3 rounded-xl glass-inset bg-white border border-slate-200 text-[#172B49] resize-none"
            />
          </div>
        </div>
      )}

      {/* STEP 4: Skills Checklist */}
      {currentStep === 4 && (
        <div className="space-y-4 animate-in fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172B49] mb-1">
              Keahlian & Kompetensi ({studentInfo.major})
            </h2>
            <p className="text-xs sm:text-sm text-[#718096]">
              Pilih keahlian yang sudah kamu kuasai dari praktikum sekolah:
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {skillsSelected.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span>{skill}</span>
              </span>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              placeholder="Tambah keahlian lain..."
              className="flex-1 text-xs p-2.5 rounded-xl glass-inset bg-white border border-slate-200 text-[#172B49]"
            />
            <button
              type="button"
              onClick={() => {
                if (customSkill.trim()) {
                  setSkillsSelected([...skillsSelected, customSkill.trim()]);
                  setCustomSkill('');
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-[#172B49] text-white text-xs font-bold hover:bg-[#243B80] transition-colors"
            >
              Tambah
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Final Review */}
      {currentStep === 5 && (
        <div className="space-y-4 animate-in fade-in text-left">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172B49] mb-1">
              CV Siap Diterbitkan! 🎉
            </h2>
            <p className="text-xs sm:text-sm text-[#718096]">
              AI telah mengompilasi semua praktikum kejuruan dan prestasimu menjadi CV standar ATS.
            </p>
          </div>

          <div className="p-4 rounded-2xl glass-inset bg-white/70 space-y-2 border border-slate-200">
            <div className="text-xs font-bold text-[#172B49]">{studentInfo.schoolName || 'SMK / SMA Negeri'}</div>
            <div className="text-[11px] text-[#496A96]">{studentInfo.major} • Target: {studentInfo.targetRole}</div>
            <div className="text-xs text-slate-700 italic border-t border-slate-100 pt-2 mt-2">
              &ldquo;{generateProfessionalSummary(studentInfo.targetRole, studentInfo.schoolType, skillsSelected)}&rdquo;
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200/80 mt-6">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#496A96] hover:text-[#172B49] flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep + 1)}
            className="px-5 py-2.5 rounded-xl bg-[#172B49] hover:bg-[#243B80] text-white text-xs font-bold shadow-md shadow-[#172B49]/20 flex items-center gap-1.5 transition-all"
          >
            <span>Lanjut</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCompleteWizard}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25 flex items-center gap-2 transition-all"
          >
            <span>Buka CV di Studio Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
