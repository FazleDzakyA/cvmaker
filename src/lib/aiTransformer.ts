export interface StudentExperienceInput {
  type: 'school_project' | 'organization' | 'extracurricular' | 'competition' | 'volunteer' | 'internship';
  title: string;
  role?: string;
  rawDescription: string;
  toolsUsed?: string;
  fieldCategory?: string; // e.g. 'otomotif', 'akuntansi', 'dkv', 'tkj', 'perkantoran', 'kuliner', 'kesehatan', 'pplg', 'sma', 'general'
}

export interface TransformedResult {
  title: string;
  role: string;
  highlights: string[];
  inferredSkills: string[];
}

export function transformStudentExperience(input: StudentExperienceInput): TransformedResult {
  const text = input.rawDescription.trim();
  const tools = input.toolsUsed ? input.toolsUsed.split(',').map((s) => s.trim()) : [];
  const lowerText = text.toLowerCase() + ' ' + (input.title || '').toLowerCase() + ' ' + (input.toolsUsed || '').toLowerCase();

  const highlights: string[] = [];
  const inferredSkills: string[] = [...tools];

  if (input.type === 'school_project') {
    // 1. Akuntansi & Keuangan (AKL)
    if (lowerText.includes('akuntansi') || lowerText.includes('keuangan') || lowerText.includes('jurnal') || lowerText.includes('laporan keuangan') || lowerText.includes('neraca') || lowerText.includes('accurate') || lowerText.includes('myob') || lowerText.includes('pajak')) {
      const toolStr = tools.length > 0 ? tools.join(', ') : 'software akuntansi (Accurate / MYOB) & Microsoft Excel';
      highlights.push(`Menyusun dan merekonsiliasi laporan keuangan berkala dengan tingkat akurasi tinggi menggunakan ${toolStr}.`);
      highlights.push('Mencatat transaksi jurnal umum, buku besar, hingga neraca saldo sesuai Standar Akuntansi Keuangan (SAK).');
      highlights.push('Menganalisis arus kas serta menyajikan ringkasan keuangan yang rapi untuk evaluasi pembimbing/manajemen.');
      inferredSkills.push('Penyusunan Laporan Keuangan', 'Rekonsiliasi Bank', 'Analisis Arus Kas', 'Ketelitian Data Numerik');
    }
    // 2. Administrasi Perkantoran & Manajemen (MPLB)
    else if (lowerText.includes('perkantoran') || lowerText.includes('arsip') || lowerText.includes('surat') || lowerText.includes('korespondensi') || lowerText.includes('administrasi') || lowerText.includes('notulen') || lowerText.includes('tata kelola')) {
      highlights.push(`Mengelola tata kelola administrasi dokumen dan sistem kearsipan digital untuk kemudahan temu balik data.`);
      highlights.push('Menyusun korespondensi surat niaga/dinas resmi serta menyiapkan agenda pertemuan dan notulensi rapat presisi.');
      highlights.push('Memberikan pelayanan komunikasi prima (service excellence) kepada tamu dan pihak eksternal.');
      inferredSkills.push('Kearsipan Digital', 'Korespondensi Bisnis', 'Manajemen Agenda & Notulensi', 'Komunikasi Pelayanan');
    }
    // 3. Teknik Otomotif & Sepeda Motor (TKR / TBSM)
    else if (lowerText.includes('otomotif') || lowerText.includes('motor') || lowerText.includes('mobil') || lowerText.includes('tune up') || lowerText.includes('injeksi') || lowerText.includes('overhaul') || lowerText.includes('mesin') || lowerText.includes('servis')) {
      highlights.push(`Melaksanakan perawatan berkala (tune-up) dan pemeliharaan sistem mesin kendaraan sesuai standar operasional K3.`);
      highlights.push('Menggunakan peralatan diagnostik (scanner tool) dan alat ukur presisi untuk mendeteksi gangguan sistem kelistrikan & bahan bakar.');
      highlights.push('Membongkar, memeriksa komponen, dan merakit kembali sistem transmisi serta pengereman dengan standar keamanan pabrikan.');
      inferredSkills.push('Diagnosa Sistem Kendaraan', 'Pemeliharaan Mesin & Tune-Up', 'Standar Keselamatan K3', 'Penggunaan Tool Presisi');
    }
    // 4. Desain Komunikasi Visual & Media Kreatif (DKV / Multimedia / Animasi)
    else if (lowerText.includes('dkv') || lowerText.includes('desain') || lowerText.includes('design') || lowerText.includes('poster') || lowerText.includes('branding') || lowerText.includes('video') || lowerText.includes('photoshop') || lowerText.includes('figma') || lowerText.includes('illustrator')) {
      const designTools = tools.length > 0 ? tools.join(', ') : 'Adobe Creative Suite & Figma';
      highlights.push(`Merancang aset visual dan identitas merek (branding) kreatif menggunakan ${designTools}.`);
      highlights.push('Menerapkan prinsip komposisi visual, hierarki tipografi, dan keharmonisan warna untuk media digital maupun cetak.');
      highlights.push('Bekerja sama dalam tim kreatif memproduksi konten visual yang meningkatkan daya tarik promosi produk.');
      inferredSkills.push('Desain Grafis Komersial', 'Tipografi & Layout', 'Branding & Identitas Visual', 'Produksi Konten Media');
    }
    // 5. Teknik Komputer & Jaringan (TKJ / Sistem Jaringan)
    else if (lowerText.includes('tkj') || lowerText.includes('jaringan') || lowerText.includes('mikrotik') || lowerText.includes('cisco') || lowerText.includes('router') || lowerText.includes('lan') || lowerText.includes('ip address') || lowerText.includes('server')) {
      highlights.push(`Mengonfigurasi perangkat jaringan (Router Mikrotik / Switch) dan manajemen bandwidth untuk kestabilan koneksi.`);
      highlights.push('Melakukan instalasi pengkabelan terstruktur (crimping UTP) serta setup topologi jaringan LAN/WLAN.');
      highlights.push('Melakukan troubleshooting kendala konektivitas dan pemeliharaan sistem keamanan jaringan.');
      inferredSkills.push('Konfigurasi Jaringan (Mikrotik/Cisco)', 'Instalasi LAN & WLAN', 'Troubleshooting Jaringan', 'Manajemen IP & Server');
    }
    // 6. Pariwisata, Perhotelan & Kuliner (Tata Boga / Perhotelan)
    else if (lowerText.includes('hotel') || lowerText.includes('boga') || lowerText.includes('kuliner') || lowerText.includes('masak') || lowerText.includes('tamu') || lowerText.includes('resep') || lowerText.includes('pastry') || lowerText.includes('front office')) {
      highlights.push(`Menerapkan standar sanitasi dan keamanan pangan ketat (HACCP) dalam persiapan serta pengolahan bahan makanan.`);
      highlights.push('Menyajikan hidangan berkualitas dengan teknik pemotongan dan plating estetis berstandar profesional.');
      highlights.push('Memberikan pelayanan ramah tamah (hospitality) prima untuk menjamin kepuasan pelanggan/tamu.');
      inferredSkills.push('Food Safety & Sanitasi', 'Pengolahan Makanan Standar', 'Hospitality Service', 'Manajemen Bahan Baku');
    }
    // 7. Kesehatan & Farmasi
    else if (lowerText.includes('farmasi') || lowerText.includes('obat') || lowerText.includes('resep') || lowerText.includes('perawat') || lowerText.includes('medis') || lowerText.includes('klinik') || lowerText.includes('pasien')) {
      highlights.push(`Melayani peracikan sediaan obat (serbuk, salep, kapsul) sesuai kaidah resep dokter dan standar farmakope.`);
      highlights.push('Melakukan pencatatan administrasi stok obat dan masa kedaluwarsa dengan sistem FIFO/FEFO.');
      highlights.push('Menyampaikan informasi penggunaan obat (aturan pakai, dosis, penyimpanan) secara komunikatif dan jelas.');
      inferredSkills.push('Peracikan Sediaan Obat', 'Manajemen Stok FIFO/FEFO', 'Pelayanan Informasi Obat (PIO)', 'Standar Higienitas Medis');
    }
    // 8. Bisnis Digital & Pemasaran
    else if (lowerText.includes('pemasaran') || lowerText.includes('marketing') || lowerText.includes('jual') || lowerText.includes('promosi') || lowerText.includes('marketplace') || lowerText.includes('iklan')) {
      highlights.push(`Merancang strategi pemasaran digital dan kampanye promosi di berbagai channel media sosial dan marketplace.`);
      highlights.push('Menganalisis tren pasar serta menyusun penawaran produk yang relevan untuk target pelanggan.');
      highlights.push('Mengelola negosiasi penjualan dan hubungan pelanggan (CRM) untuk meningkatkan loyalitas konsumen.');
      inferredSkills.push('Digital Marketing', 'Pengelolaan E-Commerce', 'Komunikasi Negosiasi', 'Analisis Perilaku Konsumen');
    }
    // 9. Rekayasa Perangkat Lunak / Web / Mobile (PPLG / RPL)
    else if (lowerText.includes('web') || lowerText.includes('aplikasi') || lowerText.includes('coding') || lowerText.includes('program') || lowerText.includes('html') || lowerText.includes('react') || lowerText.includes('laravel')) {
      const techList = tools.length > 0 ? tools.join(', ') : 'bahasa pemrograman dan framework modern';
      highlights.push(`Mengembangkan aplikasi fungsional yang responsif dan user-friendly menggunakan ${techList}.`);
      highlights.push('Mengimplementasikan arsitektur kode terstruktur, integrasi database, dan validasi form data.');
      highlights.push('Melakukan pengujian fitur (testing) serta pengelolaan repositori versi kerja secara terorganisir.');
      inferredSkills.push('Pengembangan Perangkat Lunak', 'Arsitektur Data', 'Pengujian Fitur & Debugging');
    }
    // 10. Siswa SMA / Umum (KIR, Sains, Humaniora, Proyek Sekolah)
    else {
      highlights.push(`Merencanakan dan mengeksekusi proyek ${input.title || 'akademik praktikum'} sesuai target dan tenggat waktu yang ditetapkan.`);
      highlights.push(`Mengaplikasikan metodologi analitis dan penggunaan ${tools.length > 0 ? tools.join(', ') : 'peralatan pendukung'} untuk menghasilkan solusi terukur.`);
      highlights.push('Menyusun dokumentasi laporan komprehensif serta mempresentasikan temuan di hadapan pembimbing dan audiens.');
      inferredSkills.push('Manajemen Proyek', 'Penulisan Laporan Teknis', 'Presentasi & Komunikasi', 'Problem Solving');
    }
  } else if (input.type === 'organization' || input.type === 'extracurricular') {
    if (lowerText.includes('osis') || lowerText.includes('bem') || lowerText.includes('mpk') || lowerText.includes('ketua') || lowerText.includes('koordinator')) {
      highlights.push(`Mengoordinasikan divisi kepanitiaan dan menyelaraskan jadwal kerja seluruh anggota demi kelancaran program kerja.`);
      highlights.push('Memimpin rapat koordinasi rutin serta memfasilitasi komunikasi efektif antara siswa, dewan guru, dan pihak luar.');
      highlights.push('Mengelola manajemen risiko dan pemecahan masalah secara adaptif saat pelaksanaan kegiatan berskala besar.');
      inferredSkills.push('Kepemimpinan (Leadership)', 'Manajemen Acara & Tim', 'Komunikasi Publik', 'Penyelesaian Masalah');
    } else {
      highlights.push(`Aktif berkontribusi dalam perencanaan dan pelaksanaan program kerja ${input.title || 'organisasi / ekstrakurikuler'}.`);
      highlights.push('Membantu operasional logistik, dokumentasi kegiatan, dan penyusunan laporan pertanggungjawaban.');
      highlights.push('Menunjukkan komitmen tinggi, kerja sama tim, dan inisiatif solutif di setiap agenda kegiatan.');
      inferredSkills.push('Kerja Sama Tim', 'Manajemen Waktu', 'Operasional & Logistik');
    }
  } else if (input.type === 'competition') {
    highlights.push(`Mewakili institusi dalam kompetisi ${input.title || 'bidang kejuruan/akademik'} dengan persiapan teknis intensif.`);
    highlights.push('Mendemonstrasikan pemikiran kritis, ketahanan mental, dan presisi kerja di bawah batas waktu ketat.');
    highlights.push('Mendapatkan apresiasi atas kreativitas pemecahan masalah dari tim dewan juri ahli.');
    inferredSkills.push('Ketahanan Kerja di Bawah Tekanan', 'Pemikiran Kritis & Analitis', 'Presisi & Daya Saing');
  } else {
    // Internship / Prakerin / Magang / Volunteer
    highlights.push(`Menjalankan tugas harian dengan disiplin tinggi sesuai Standard Operating Procedure (SOP) tempat magang.`);
    highlights.push('Beradaptasi cepat dengan budaya kerja tim profesional dan aktif mempelajari instrumen operasional baru.');
    highlights.push('Memberikan kontribusi nyata dalam penyelesaian beban kerja harian secara teliti dan tepat waktu.');
    inferredSkills.push('Disiplin & Etos Kerja', 'Adaptasi Cepat', 'Ketelitian Operasional', 'Komunikasi Profesional');
  }

  // Deduplicate skills
  const cleanSkills = Array.from(new Set(inferredSkills.filter(Boolean)));

  return {
    title: input.title || 'Proyek Praktikum / Kegiatan',
    role: input.role || (input.type === 'school_project' ? 'Penanggung Jawab Proyek' : 'Anggota Aktif'),
    highlights,
    inferredSkills: cleanSkills,
  };
}

export function generateProfessionalSummary(role: string, studentLevel: string, skills: string[]): string {
  const skillsStr = skills.slice(0, 4).join(', ');
  if (studentLevel.toLowerCase().includes('smk') || studentLevel.toLowerCase().includes('kejuruan')) {
    return `Lulusan SMK yang berdedikasi dan memiliki keterampilan praktis teruji di bidang ${role}. Terbiasa menerapkan prosedur standar operasional (SOP), ketelitian kerja, dan pemecahan masalah melalui proyek praktikum sekolah. Menguasai ${skillsStr || 'kompetensi kejuruan inti'} dan siap memberikan kontribusi produktif bagi perusahaan.`;
  }
  if (studentLevel.toLowerCase().includes('sma')) {
    return `Siswa SMA yang berprestasi, analitis, dan memiliki motivasi belajar tinggi dengan minat kuat di bidang ${role}. Berpengalaman dalam organisasi kesiswaan dan proyek penelitian akademik. Didukung kompetensi dalam ${skillsStr || 'komunikasi dan analisis'}, siap mengembangkan karir profesional dan magang.`;
  }
  return `Individu yang proaktif dan berorientasi pada hasil dengan fokus kompetensi di bidang ${role}. Memiliki fondasi kuat dalam ${skillsStr || 'keahlian bidang'}, kemampuan adaptasi cepat, serta kolaborasi tim yang solid. Bertekad memberikan kontribusi terbaik pada posisi entry-level maupun program magang.`;
}

export function rewriteBulletPoint(bullet: string, style: 'professional' | 'grammar' | 'ats' | 'concise'): string {
  const trimmed = bullet.trim();
  if (!trimmed) return bullet;

  let result = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  if (!result.endsWith('.')) result += '.';

  return result;
}
