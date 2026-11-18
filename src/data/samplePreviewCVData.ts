import { CVData } from '@/types/cv';

export const samplePreviewCVData: CVData = {
  id: 'sample-preview-cv',
  title: 'Sample Professional Resume',
  updatedAt: 'Baru saja',
  templateId: 'minimalist',
  accentColor: '#172B49',
  personalInfo: {
    fullName: 'Alex Pratama Putra',
    jobTitle: 'Technical & Operations Specialist',
    email: 'alex.pratama@email.com',
    phone: '+62 812 3456 7890',
    location: 'Jakarta, Indonesia',
    linkedin: 'linkedin.com/in/alexpratama',
    github: 'github.com/alexpratama',
    website: 'alexpratama.dev',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  summary:
    'Individu berprestasi dan berdedikasi tinggi dengan fondasi kuat melalui praktikum kejuruan, kepemimpinan organisasi, serta penerapan Standard Operating Procedure (SOP). Memiliki kemampuan komunikasi profesional, manajemen waktu terstruktur, dan analisis teliti yang siap berkontribusi nyata pada program magang maupun posisi entry-level.',
  education: [
    {
      id: 'edu-sample-1',
      institution: 'SMK Negeri 1 Jakarta / Institusi Unggulan',
      degree: 'Sekolah Menengah Kejuruan (SMK)',
      fieldOfStudy: 'Bidang Keahlian Kejuruan Terakreditasi A',
      startDate: '2022',
      endDate: '2025',
      gpa: '91.8 / 100',
      honors: 'Lulusan Terbaik & Juara Lomba Kompetensi Kesiswaan',
      relevantCourses: 'Praktikum Kejuruan, Keselamatan Kerja K3, Tata Kelola Proyek, Pengendalian Mutu',
    },
  ],
  experience: [
    {
      id: 'exp-sample-1',
      company: 'PT Industri Mitra Nusantara',
      position: 'Staf Praktik Kerja Lapangan (PKL / Magang)',
      location: 'Jakarta, Indonesia',
      startDate: 'Jul 2024',
      endDate: 'Des 2024',
      current: false,
      highlights: [
        'Melaksanakan tugas operasional harian dengan tingkat kepatuhan SOP mencapai 99% tanpa insiden kerja.',
        'Membantu penyusunan laporan pemeliharaan berkala dan dokumentasi data inventaris peralatan secara teratur.',
        'Berkolaborasi erat bersama tim teknis senior dalam menangani kendala teknis dan pencapaian target kerja mingguan.',
      ],
    },
  ],
  organizations: [
    {
      id: 'org-sample-1',
      organization: 'OSIS & MPK Sekolah',
      role: 'Koordinator Divisi Kesiswaan & IT',
      period: '2023 - 2024',
      highlights: [
        'Memimpin kepanitiaan festival tahunan sekolah dengan partisipasi lebih dari 1.500 peserta secara sukses.',
        'Menyusun agenda rapat rutin, pembagian tugas 12 anggota divisi, dan pertanggungjawaban anggaran.',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-sample-1',
      title: 'Proyek Rancang Bangun & Implementasi Praktikum Mandiri',
      role: 'Koordinator Proyek',
      technologies: ['Standar Operasional Prosedur', 'Quality Control', 'Data Reporting', 'Tools Industri'],
      link: 'portfolio.alexpratama.dev',
      highlights: [
        'Merencanakan tahapan kerja, alokasi sumber daya, dan pengujian mutu hasil proyek praktikum akhir.',
        'Mempresentasikan hasil uji fungsional di hadapan instruktur penguji dengan perolehan nilai A+.',
      ],
    },
  ],
  skills: [
    {
      category: 'Kompetensi Inti & Teknis',
      skills: ['Pengoperasian Instrumen Industri', 'Analisis Data & Reporting', 'Manajemen K3', 'Microsoft Office & Workspace'],
    },
    {
      category: 'Keahlian Personal (Soft Skills)',
      skills: ['Kepemimpinan (Leadership)', 'Komunikasi Terbuka', 'Kerja Sama Tim', 'Problem Solving', 'Ketelitian'],
    },
  ],
  certifications: [
    {
      id: 'cert-sample-1',
      name: 'Sertifikasi Uji Kompetensi Kejuruan (UKK) - Grade A',
      issuer: 'Badan Nasional Sertifikasi Profesi (BNSP)',
      issueDate: '2024',
    },
  ],
  achievements: [
    {
      id: 'ach-sample-1',
      title: 'Juara 1 Lomba Kompetensi Siswa (LKS)',
      event: 'Tingkat Kota / Wilayah',
      year: '2024',
      rank: 'Juara 1',
      description: 'Mewakili sekolah dalam kompetisi kejuruan terapan.',
    },
  ],
  languages: [
    {
      id: 'lang-sample-1',
      name: 'Bahasa Indonesia',
      proficiency: 'Native',
    },
    {
      id: 'lang-sample-2',
      name: 'Bahasa Inggris',
      proficiency: 'Fluent',
    },
  ],
};
