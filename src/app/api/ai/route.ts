import { NextRequest, NextResponse } from 'next/server';
import { transformStudentExperience, generateProfessionalSummary, rewriteBulletPoint } from '@/lib/aiTransformer';
import { CVData } from '@/types/cv';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

async function callGemini(prompt: string, jsonMode: boolean = false): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;

  const candidateModels = [
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-flash-lite-latest',
    'gemini-flash-latest',
  ];

  for (const model of candidateModels) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const payloadBody: any = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      };

      if (jsonMode) {
        payloadBody.generationConfig = {
          responseMimeType: 'application/json',
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      }
    } catch {
      continue;
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    switch (action) {
      // =========================================================================
      // 1. GENERATE COMPLETE 14-POINT STRUCTURED PROMPT (AI PROMPT BUILDER)
      // =========================================================================
      case 'generate_complete_prompt': {
        const {
          rawInput = '',
          targetRole = 'Junior Specialist',
          majorCategory = 'Umum',
          experienceLevel = 'student',
          skills = '',
          projects = '',
          jobDescription = '',
          writingStyle = 'Professional, ATS-Optimized, and Confident',
          language = 'id',
        } = payload || {};

        const langName = language === 'en' ? 'English' : 'Bahasa Indonesia';

        let promptOutput = `Bertindaklah sebagai Expert Executive Resume Writer dan ATS (Applicant Tracking System) Optimization Specialist bersertifikasi internasional.

Tolong buatkan materi CV (Curriculum Vitae) profesional tingkat tinggi yang ramah bot ATS dan memukau HRD, dengan spesifikasi 14-poin kandidat sebagai berikut:

1. ROLE / PERSONA:
- Peran AI: Professional Career Coach & ATS Resume Auditor
- Pendekatan: Mengedepankan kompetensi riil, integritas fakta, dan formula Google XYZ / STAR

2. CONTEXT & GOAL:
- Target Profesi: ${targetRole || 'Profesional / Entry Level'}
- Rumpun Kejuruan / Bidang: ${majorCategory}
- Bahasa Dokumen: ${langName}

3. USER PROFILE:
- Tingkat Pengalaman: ${
          experienceLevel === 'student'
            ? 'Pelajar SMK / SMA (Belum Pengalaman Formal, Tonjolkan Praktikum & Proyek Sekolah)'
            : experienceLevel === 'fresh_grad'
            ? 'Fresh Graduate (Lulusan Baru / Pengalaman Magang PKL Industri)'
            : 'Profesional Muda (1-2 Tahun Pengalaman Kerja Terkait)'
        }
- Catatan Awal Pengguna: "${rawInput || 'Buatkan CV profesional yang menonjolkan potensi terbaik saya.'}"

4. CAREER OBJECTIVE:
- Tujuan Karir: Berkontribusi aktif pada posisi ${targetRole}, menerapkan disiplin kerja tinggi, dan cepat beradaptasi dengan standar operasional industri.

5. EDUCATION:
- Jenjang: Pendidikan formal kejuruan/universitas sesuai bidang ${majorCategory}.
- Penekanan: Nilai akademik memuaskan, mata pelajaran kejuruan relevan, dan kepatuhan SOP kerja.

6. WORK / INTERNSHIP EXPERIENCE:
- Status: ${experienceLevel === 'student' ? 'Praktik Kerja Lapangan (PKL) / Magang Industri Terapan' : 'Pengalaman Kerja / Magang'}
- Format: Posisi, Nama Perusahaan/Instansi Mitra, Rentang Waktu, dan 2-3 poin pencapaian nyata.

7. PROJECTS & PRACTICUM:
- Pengalaman Proyek: ${projects || 'Praktikum kejuruan mandiri dan tugas akhir sekolah'}
- Formula Penulisan: Tindakan nyata (Action Verb) + Alat/Metode yang digunakan + Hasil terukur yang dicapai.

8. TECHNICAL / HARD SKILLS:
- Keahlian Utama: ${skills || 'Kompetensi teknis standar industri sesuai bidang ' + majorCategory}
- Penguasaan Alat: Software, peralatan kerja presisi, dan instrumen operasional terkait.

9. SOFT SKILLS:
- Keterampilan Interpersonal: Kerja Sama Tim, Komunikasi Terbuka, Disiplin Waktu, Ketelitian, dan Pemecahan Masalah (Problem Solving).

10. ACHIEVEMENTS & CERTIFICATIONS:
- Sertifikasi: Uji Kompetensi Kejuruan (UKK / BNSP), sertifikat pelatihan kredibel, atau kejuaraan kompetensi siswa (LKS/Lomba Terkait).

11. WRITING STYLE & TONE:
- Gaya Bahasa: ${writingStyle}
- Karakter: Percaya diri, ringkas, berdampak tinggi, bebas klise kosong atau bahasa pasif.

12. CV STRUCTURE (ATS COMPLIANT):
- Header Kontak Jelas (Nama, Email, No. HP, Lokasi, LinkedIn/Portfolio)
- Professional Summary (3-4 kalimat padat)
- Riwayat Pendidikan
- Proyek & Pengalaman Kerja
- Keahlian Teknis & Interpersonal
- Sertifikasi & Prestasi

13. CONSTRAINTS & ACCURACY:
- DILARANG memalsukan data riil atau mengarang sertifikat fiktif.
- Gunakan tata letak teks bersih tanpa tabel bersarang yang membingungkan bot parser.

14. EXPECTED OUTPUT FORMAT:
- Berikan output struktur CV yang lengkap dan teratur, siap dipindahkan ke template CV.`;

        // If Gemini is available, we can also ask Gemini to enrich the prompt suggestions
        let suggestions: string[] = [
          `Fokuskan pada sertifikasi kejuruan dan standar K3 di bidang ${targetRole}.`,
          `Sertakan metrik persentase keberhasilan pada proyek praktikum terbesar Anda.`,
          `Gunakan kata kerja aktif spesifik industri (misal: merancang, mengaudit, menyervis, mengkonfigurasi).`,
          `Pastikan mencantumkan portofolio atau tautan demonstrasi proyek nyata.`,
        ];

        if (GEMINI_API_KEY && targetRole) {
          const aiTips = await callGemini(
            `Berikan 3 tips singkat (1 kalimat per tips) dalam Bahasa Indonesia untuk memperkuat resume di bidang "${targetRole}" (${majorCategory}). Format: pisahkan dengan baris baru.`
          );
          if (aiTips) {
            const parsed = aiTips
              .split('\n')
              .map((s) => s.replace(/^[-*•\d.]+\s*/, '').trim())
              .filter((s) => s.length > 10);
            if (parsed.length > 0) suggestions = parsed;
          }
        }

        return NextResponse.json({
          success: true,
          data: {
            formulatedPrompt: promptOutput,
            suggestions,
          },
        });
      }

      // =========================================================================
      // 2. QUICK CV BUILDER AI ENGINE (10-STEP INGESTION & POLISH)
      // =========================================================================
      case 'quick_builder_generate': {
        const {
          purpose,
          experienceLevel,
          personalInfo = {},
          education = [],
          experience = [],
          projects = [],
          skills = [],
          certifications = [],
          achievements = [],
          designPreferences = {},
        } = payload || {};

        const targetRole = personalInfo.jobTitle || 'Kandidat Profesional';

        // 1. Generate or polish professional summary
        let summaryText = personalInfo.summary || '';
        if (GEMINI_API_KEY && !summaryText) {
          const summaryPrompt = `Tulis ringkasan profil profesional (Professional Summary) resume 3 kalimat dalam Bahasa Indonesia untuk kandidat "${targetRole}" dengan tingkat pengalaman "${experienceLevel || 'student'}" untuk keperluan "${purpose || 'Magang'}".
Keahlian: ${(skills || []).map((s: any) => s.skills?.join(', ') || '').join(', ')}.
Tone: Percaya diri, terstruktur, ramah ATS. Jangan gunakan tanda petik.`;
          const generatedSummary = await callGemini(summaryPrompt);
          if (generatedSummary) summaryText = generatedSummary.replace(/^["']|["']$/g, '').trim();
        }

        if (!summaryText) {
          summaryText = `Kandidat berdedikasi tinggi dengan fokus kompetensi di bidang ${targetRole}. Memiliki pemahaman kuat melalui pembelajaran terstruktur, tugas praktikum terapan, dan pengalaman kolaboratif. Siap berkontribusi secara produktif dan disiplin pada posisi yang dituju.`;
        }

        // 2. Build polished CVData
        const compiledCV: CVData = {
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cv-${Date.now()}`,
          title: `CV ${personalInfo.fullName || targetRole}`,
          updatedAt: 'Baru saja',
          templateId: designPreferences.templateId || 'minimalist',
          accentColor: designPreferences.accentColor || '#6685FF',
          personalInfo: {
            fullName: personalInfo.fullName || '',
            jobTitle: targetRole,
            email: personalInfo.email || '',
            phone: personalInfo.phone || '',
            location: personalInfo.location || '',
            linkedin: personalInfo.linkedin || '',
            github: personalInfo.github || '',
            website: personalInfo.website || '',
            photoUrl: personalInfo.photoUrl || '',
          },
          summary: summaryText,
          education: education.map((edu: any, i: number) => ({
            id: edu.id || `edu-${Date.now()}-${i}`,
            institution: edu.institution || '',
            degree: edu.degree || '',
            fieldOfStudy: edu.fieldOfStudy || '',
            startDate: edu.startDate || '2021',
            endDate: edu.endDate || '2024',
            gpa: edu.gpa || '',
            relevantCourses: edu.relevantCourses || '',
          })),
          experience: experience.map((exp: any, i: number) => ({
            id: exp.id || `exp-${Date.now()}-${i}`,
            company: exp.company || '',
            position: exp.position || '',
            location: exp.location || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            current: exp.current || false,
            highlights: Array.isArray(exp.highlights) ? exp.highlights : exp.responsibilities ? [exp.responsibilities] : [],
          })),
          projects: projects.map((proj: any, i: number) => ({
            id: proj.id || `proj-${Date.now()}-${i}`,
            title: proj.title || '',
            role: proj.role || 'Pelaksana Proyek',
            technologies: Array.isArray(proj.technologies) ? proj.technologies : (proj.technologies || '').split(',').map((t: string) => t.trim()).filter(Boolean),
            link: proj.link || '',
            highlights: Array.isArray(proj.highlights) ? proj.highlights : [proj.description || 'Melaksanakan proyek dengan menerapkan standar kualitas dan ketelitian.'],
          })),
          organizations: [],
          skills: Array.isArray(skills) && skills.length > 0 ? skills : [
            { category: 'Keahlian Teknis', skills: ['Pengoperasian Tools Terkait', 'Standar Operasional (SOP)'] },
            { category: 'Soft Skills', skills: ['Kerja Sama Tim', 'Komunikasi Terbuka', 'Disiplin Waktu'] },
          ],
          certifications: certifications.map((c: any, i: number) => ({
            id: c.id || `cert-${Date.now()}-${i}`,
            name: c.name || '',
            issuer: c.issuer || '',
            issueDate: c.issueDate || '2024',
            credentialUrl: c.credentialUrl || '',
          })),
          achievements: achievements.map((a: any, i: number) => ({
            id: a.id || `ach-${Date.now()}-${i}`,
            title: a.title || '',
            event: a.event || '',
            year: a.year || '2024',
            rank: a.rank || '',
            description: a.description || '',
          })),
          languages: [
            { id: 'lang-1', name: 'Bahasa Indonesia', proficiency: 'Native' },
            { id: 'lang-2', name: 'Bahasa Inggris', proficiency: 'Intermediate' },
          ],
        };

        return NextResponse.json({
          success: true,
          data: compiledCV,
        });
      }

      // =========================================================================
      // 3. GUIDED CV CONSULTANT (CONVERSATIONAL INTERACTIVE AI CHAT)
      // =========================================================================
      case 'conversational_consultant': {
        const { currentStep = 1, userMessage = '', history = [], accumulatedCV = {} } = payload || {};

        const STEPS_MAP: Record<number, { topic: string; nextQuestion: string; chips: string[] }> = {
          1: {
            topic: 'Latar Belakang & Pendidikan',
            nextQuestion: 'Senang bertemu dengan Anda! Di mana Anda bersekolah atau berkuliah saat ini, dan apa jurusan yang sedang atau telah Anda tempuh?',
            chips: ['SMK Teknik Otomotif', 'SMK Akuntansi & Keuangan', 'SMK DKV / Multimedia', 'SMK TKJ / Jaringan', 'SMK PPLG / Rekayasa Perangkat Lunak', 'SMA MIPA / IPS', 'Mahasiswa Universitas'],
          },
          2: {
            topic: 'Target Karir & Posisi',
            nextQuestion: 'Hebat! Sekarang, posisi magang atau pekerjaan apa yang ingin Anda tuju dengan CV ini?',
            chips: ['Teknisi Otomotif / Mekanik', 'Staf Akuntansi & Pembukuan', 'Staf Administrasi Kantor', 'Desainer Grafis & Media', 'IT Support & Jaringan', 'Junior Web Developer', 'Cook Helper F&B'],
          },
          3: {
            topic: 'Keahlian & Alat yang Dikuasai',
            nextQuestion: 'Keahlian teknis, software, atau alat kerja apa saja yang paling Anda kuasai dalam kegiatan sehari-hari atau praktikum?',
            chips: ['Tune-up Mesin & Scanner OBD', 'Microsoft Excel & Accurate', 'Photoshop & Illustrator', 'Mikrotik Router & LAN', 'HTML, CSS & JavaScript', 'Kearsipan & Pelayanan Tamu'],
          },
          4: {
            topic: 'Proyek atau Tugas Praktikum',
            nextQuestion: 'Ceritakan satu tugas praktikum sekolah atau proyek pribadi yang pernah Anda kerjakan dan paling Anda banggakan?',
            chips: ['Servis berkala kendaraan roda 4', 'Membuat laporan keuangan koperasi', 'Mendesain logo dan kemasan produk', 'Instalasi jaringan lab komputer', 'Membuat website katalog toko'],
          },
          5: {
            topic: 'Kegiatan Organisasi / Non-Akademik',
            nextQuestion: 'Apakah Anda pernah aktif dalam organisasi sekolah (OSIS/Pramuka/Ekskul), kepanitiaan acara, atau kegiatan relawan?',
            chips: ['Pengurus OSIS', 'Anggota Ekstrakurikuler', 'Panitia Acara Sekolah', 'Belum pernah (Lewati)'],
          },
          6: {
            topic: 'Sertifikasi & Prestasi',
            nextQuestion: 'Apakah Anda memiliki sertifikat kompetensi (seperti UKK / BNSP), piagam perlombaan, atau kursus yang relevan?',
            chips: ['Sertifikasi UKK Grade A (BNSP)', 'Juara Lomba Kompetensi Siswa (LKS)', 'Sertifikat Pelatihan Online', 'Belum ada (Lewati)'],
          },
          7: {
            topic: 'Konfirmasi Akhir & Generate',
            nextQuestion: 'Luar biasa! Seluruh informasi penting Anda telah kami kumpulkan. Apakah Anda siap merancang dan meninjau CV profesional Anda di Studio?',
            chips: ['Ya, Buatkan CV Saya Sekarang!', 'Saya ingin mengubah jawaban'],
          },
        };

        const currentStepInfo = STEPS_MAP[currentStep] || STEPS_MAP[7];

        let aiFeedback = '';
        if (GEMINI_API_KEY && userMessage) {
          const feedbackPrompt = `Anda adalah konsultan CV profesional yang ramah dan suportif untuk pelajar/kandidat.
Pengguna baru saja menjawab: "${userMessage}" untuk topik "${currentStepInfo.topic}".
Berikan apresiasi singkat (1 kalimat saja yang hangat) terhadap jawaban tersebut, lalu perkenalkan pertanyaan berikutnya: "${currentStepInfo.nextQuestion}". Jangan gunakan tanda petik.`;
          const feedback = await callGemini(feedbackPrompt);
          if (feedback) aiFeedback = feedback.replace(/^["']|["']$/g, '').trim();
        }

        if (!aiFeedback) {
          aiFeedback = `Terima kasih! Informasi Anda sangat baik. ${currentStepInfo.nextQuestion}`;
        }

        return NextResponse.json({
          success: true,
          data: {
            aiResponse: aiFeedback,
            nextStep: currentStep + 1,
            isFinal: currentStep >= 7,
            chips: currentStepInfo.chips,
          },
        });
      }

      // =========================================================================
      // 4. SECTION-TARGETED AI EDITING (UPDATE ONLY THE SPECIFIED SECTION)
      // =========================================================================
      case 'section_targeted_edit': {
        const { section, currentText, command, targetRole } = payload || {};

        if (!section || !currentText) {
          return NextResponse.json({ error: 'Section and text are required' }, { status: 400 });
        }

        let improvedContent = currentText;

        if (GEMINI_API_KEY) {
          const editPrompt = `Anda adalah Executive Resume Editor.
Tugas Anda adalah memperbarui HANYA bagian "${section}" dari sebuah CV berikut sesuai instruksi pengguna:
Instruksi Pengguna: "${command || 'Buat lebih profesional dan berdampak tinggi dengan action verbs'}"
Target Profesi Kandidat: "${targetRole || 'Profesional'}"
Teks Asli Bagian:
"${currentText}"

Aturan:
1. Pertahankan seluruh fakta riil tanpa melebih-lebihkan atau memalsukan.
2. Gunakan kata kerja aktif formula Google XYZ / STAR.
3. Berikan HANYA teks hasil revisi tanpa pengantar, penjelasan, atau tanda kutip.`;

          const aiResult = await callGemini(editPrompt);
          if (aiResult) improvedContent = aiResult.replace(/^["']|["']$/g, '').trim();
        } else {
          improvedContent = rewriteBulletPoint(currentText, 'professional');
        }

        return NextResponse.json({
          success: true,
          data: {
            section,
            improvedContent,
          },
        });
      }

      // =========================================================================
      // 5. ATS JOB DESCRIPTION MATCHING & KEYWORD AUDITOR
      // =========================================================================
      case 'ats_job_match': {
        const { cvData, jobDescription } = payload || {};

        if (!jobDescription || !jobDescription.trim()) {
          return NextResponse.json({ error: 'Job description text is required' }, { status: 400 });
        }

        let matchScore = 82;
        let matchedKeywords: string[] = [];
        let missingKeywords: string[] = [];
        let recommendations: string[] = [];

        if (GEMINI_API_KEY && cvData) {
          const cvSummaryContext = `
Nama: ${cvData.personalInfo?.fullName || ''}
Posisi: ${cvData.personalInfo?.jobTitle || ''}
Keahlian: ${(cvData.skills || []).map((s: any) => s.skills?.join(', ')).join(', ')}
Summary: ${cvData.summary || ''}
Proyek: ${(cvData.projects || []).map((p: any) => p.title + ': ' + (p.highlights || []).join(' ')).join('\n')}
`;

          const matchPrompt = `Sebagai ATS Audit Engine, bandingkan data CV ini dengan Deskripsi Lowongan Pekerjaan (Job Description).
CV KANDIDAT:
${cvSummaryContext}

JOB DESCRIPTION:
${jobDescription}

Berikan evaluasi dalam format JSON murni dengan schema:
{
  "matchScore": number (0-100),
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "recommendations": string[]
}`;

          const aiMatch = await callGemini(matchPrompt, true);
          if (aiMatch) {
            try {
              const parsed = JSON.parse(aiMatch);
              return NextResponse.json({
                success: true,
                data: parsed,
              });
            } catch {
              // fallback
            }
          }
        }

        // Fallback heuristic keyword extraction
        const jdWords: string[] = jobDescription.toLowerCase().match(/\b[a-zA-Z0-9-]{3,}\b/g) || [];
        const uniqueJD: string[] = Array.from(new Set<string>(jdWords)).slice(0, 15);
        matchedKeywords = uniqueJD.slice(0, 5);
        missingKeywords = uniqueJD.slice(5, 10);
        recommendations = [
          'Sertakan kata kunci teknis yang tercantum dalam deskripsi lowongan pada bagian keahlian.',
          'Sesuaikan judul resume agar selaras dengan posisi yang diiklankan.',
          'Jelaskan pencapaian proyek menggunakan kata kerja tindakan yang dicari perusahaan.',
        ];

        return NextResponse.json({
          success: true,
          data: {
            matchScore,
            matchedKeywords,
            missingKeywords,
            recommendations,
          },
        });
      }

      // =========================================================================
      // 6. LEGACY & BACKWARD COMPATIBLE ACTIONS
      // =========================================================================
      case 'transform_experience': {
        const { type, title, role, rawDescription, toolsUsed, fieldCategory } = payload || {};

        if (GEMINI_API_KEY && rawDescription) {
          const prompt = `You are an expert, multi-disciplinary ATS Resume Coach for students and graduates across ALL vocational majors (SMK: Otomotif TKR/TBSM, Akuntansi AKL, Perkantoran MPLB, DKV Kreatif, TKJ Jaringan, Perhotelan, Tata Boga Kuliner, Farmasi, Keperawatan, Mesin, Listrik, PPLG), High School (SMA IPA/IPS), and College Undergraduates.
Never assume software engineering or IT unless the user's project is explicitly about software.

Task: Transform this student project or practical non-formal experience into 2-3 professional, punchy resume bullet points tailored specifically to its actual field of study (${fieldCategory || 'general'}).
Rules:
1. Preserve original facts. Never fabricate false achievements or false tools.
2. Start each bullet point with strong active verbs in Indonesian or English (matching user language).
3. Ensure ATS scannability.
4. Output only the bullet points, one per line starting with a hyphen.

Project Title: ${title || 'Practical Project'}
Field / Tools: ${toolsUsed || fieldCategory || 'General'}
User's Description: "${rawDescription}"`;

          const geminiResult = await callGemini(prompt);
          if (geminiResult) {
            const lines = geminiResult
              .split('\n')
              .map((l) => l.replace(/^[-*•\d.]+\s*/, '').trim())
              .filter((l) => l.length > 5);

            if (lines.length > 0) {
              const tools = toolsUsed ? toolsUsed.split(',').map((s: string) => s.trim()) : [];
              return NextResponse.json({
                success: true,
                source: 'gemini',
                data: {
                  title: title || 'Praktikum & Proyek Sekolah',
                  role: role || 'Penanggung Jawab Proyek',
                  highlights: lines,
                  inferredSkills: tools,
                },
              });
            }
          }
        }

        const result = transformStudentExperience({
          type: type || 'school_project',
          title: title || 'Proyek Praktikum',
          role: role || 'Penanggung Jawab',
          rawDescription: rawDescription || '',
          toolsUsed: toolsUsed || '',
          fieldCategory: fieldCategory || '',
        });
        return NextResponse.json({ success: true, source: 'nlp_engine', data: result });
      }

      case 'generate_summary': {
        const { role, studentLevel, skills } = payload || {};

        if (GEMINI_API_KEY && role) {
          const prompt = `Write a professional 2-3 sentence resume summary for a ${studentLevel || 'Student / Fresh Graduate'} targeting the field/position of "${role}".
Relevant competencies: ${(skills || []).join(', ')}.
Language: Indonesian (Bahasa Indonesia).
Tone: Confident, ambitious, articulate, and recruiter-ready. Tailor strictly to "${role}" and do not bias toward IT/PPLG unless the role is IT.
Do not include quotation marks.`;

          const geminiResult = await callGemini(prompt);
          if (geminiResult) {
            return NextResponse.json({
              success: true,
              source: 'gemini',
              data: { summary: geminiResult.replace(/^["']|["']$/g, '').trim() },
            });
          }
        }

        const summary = generateProfessionalSummary(
          role || 'Kandidat Profesional',
          studentLevel || 'Lulusan SMK',
          skills || ['Komunikasi', 'Kerja Sama Tim', 'Ketelitian']
        );
        return NextResponse.json({ success: true, source: 'nlp_engine', data: { summary } });
      }

      case 'improve_text': {
        const { text, mode } = payload || {};

        if (GEMINI_API_KEY && text) {
          const prompt = `Improve the following resume bullet point for maximum impact, ATS readability, and professional tone in the candidate's industry.
Style mode: ${mode || 'professional'}.
Original text: "${text}"
Output only the improved sentence starting with a strong active verb, with no quotes or explanations.`;

          const geminiResult = await callGemini(prompt);
          if (geminiResult) {
            return NextResponse.json({
              success: true,
              source: 'gemini',
              data: { result: geminiResult.replace(/^["']|["']$/g, '').trim() },
            });
          }
        }

        const improved = rewriteBulletPoint(text, mode || 'professional');
        return NextResponse.json({ success: true, source: 'nlp_engine', data: { result: improved } });
      }

      case 'generate_custom_cv': {
        const { userPrompt, currentCV } = payload || {};
        const lowerPrompt = (userPrompt || '').toLowerCase();

        let templateId: 'minimalist' | 'corporate' | 'creative' | 'ats' | 'student' | 'tech' = 'student';
        if (lowerPrompt.includes('tech') || lowerPrompt.includes('coding') || lowerPrompt.includes('software') || lowerPrompt.includes('developer') || lowerPrompt.includes('rpl') || lowerPrompt.includes('pplg')) {
          templateId = 'tech';
        } else if (lowerPrompt.includes('kreatif') || lowerPrompt.includes('creative') || lowerPrompt.includes('desain') || lowerPrompt.includes('design') || lowerPrompt.includes('dkv') || lowerPrompt.includes('kuliner') || lowerPrompt.includes('boga')) {
          templateId = 'creative';
        } else if (lowerPrompt.includes('ats') || lowerPrompt.includes('formal') || lowerPrompt.includes('beasiswa') || lowerPrompt.includes('farmasi') || lowerPrompt.includes('medis')) {
          templateId = 'ats';
        } else if (lowerPrompt.includes('corporate') || lowerPrompt.includes('kantor') || lowerPrompt.includes('finance') || lowerPrompt.includes('akuntansi') || lowerPrompt.includes('admin') || lowerPrompt.includes('otomotif')) {
          templateId = 'corporate';
        } else if (lowerPrompt.includes('minimal')) {
          templateId = 'minimalist';
        }

        let accentColor = '#243B80';
        if (lowerPrompt.includes('hijau') || lowerPrompt.includes('green') || lowerPrompt.includes('emerald') || lowerPrompt.includes('mint')) {
          accentColor = '#10B981';
        } else if (lowerPrompt.includes('ungu') || lowerPrompt.includes('purple') || lowerPrompt.includes('violet')) {
          accentColor = '#8B5CF6';
        } else if (lowerPrompt.includes('electric') || lowerPrompt.includes('biru muda') || lowerPrompt.includes('light blue')) {
          accentColor = '#6685FF';
        } else if (lowerPrompt.includes('pink') || lowerPrompt.includes('rose')) {
          accentColor = '#EC4899';
        } else if (lowerPrompt.includes('amber') || lowerPrompt.includes('gold') || lowerPrompt.includes('kuning') || lowerPrompt.includes('orange')) {
          accentColor = '#F59E0B';
        }

        let jobTitle = currentCV?.personalInfo?.jobTitle || 'Kandidat Profesional';

        if (lowerPrompt.includes('otomotif') || lowerPrompt.includes('tkr') || lowerPrompt.includes('mobil') || lowerPrompt.includes('motor') || lowerPrompt.includes('tbsm') || lowerPrompt.includes('bengkel')) {
          jobTitle = 'Teknisi Otomotif & Mekanik';
          templateId = 'corporate';
        } else if (lowerPrompt.includes('mesin') || lowerPrompt.includes('bubut') || lowerPrompt.includes('frais') || lowerPrompt.includes('las') || lowerPrompt.includes('welder')) {
          jobTitle = 'Teknisi Permesinan & Pengelasan';
          templateId = 'corporate';
        } else if (lowerPrompt.includes('listrik') || lowerPrompt.includes('titl') || lowerPrompt.includes('plc') || lowerPrompt.includes('mekatronika')) {
          jobTitle = 'Teknisi Ketenagalistrikan & Otomasi';
          templateId = 'tech';
        } else if (lowerPrompt.includes('akuntansi') || lowerPrompt.includes('keuangan') || lowerPrompt.includes('finance') || lowerPrompt.includes('pajak') || lowerPrompt.includes('akl') || lowerPrompt.includes('kasir')) {
          jobTitle = 'Staf Akuntansi & Keuangan (Finance)';
          templateId = 'corporate';
        } else if (lowerPrompt.includes('admin') || lowerPrompt.includes('perkantoran') || lowerPrompt.includes('mplb') || lowerPrompt.includes('sekretaris') || lowerPrompt.includes('arsip')) {
          jobTitle = 'Staf Administrasi Perkantoran';
          templateId = 'corporate';
        } else if (lowerPrompt.includes('dkv') || lowerPrompt.includes('desain') || lowerPrompt.includes('design') || lowerPrompt.includes('grafis') || lowerPrompt.includes('video') || lowerPrompt.includes('multimedia')) {
          jobTitle = 'Desainer Grafis & Media Kreatif (DKV)';
          templateId = 'creative';
        } else if (lowerPrompt.includes('tkj') || lowerPrompt.includes('jaringan') || lowerPrompt.includes('network') || lowerPrompt.includes('mikrotik') || lowerPrompt.includes('cisco')) {
          jobTitle = 'Teknisi Komputer & Jaringan (TKJ)';
          templateId = 'tech';
        } else if (lowerPrompt.includes('boga') || lowerPrompt.includes('kuliner') || lowerPrompt.includes('chef') || lowerPrompt.includes('cook') || lowerPrompt.includes('masak') || lowerPrompt.includes('pastry')) {
          jobTitle = 'Cook Helper & Spesialis Kuliner (Tata Boga)';
          templateId = 'creative';
        } else if (lowerPrompt.includes('farmasi') || lowerPrompt.includes('obat') || lowerPrompt.includes('apotek')) {
          jobTitle = 'Asisten Tenaga Kefarmasian';
          templateId = 'ats';
        } else if (lowerPrompt.includes('web') || lowerPrompt.includes('frontend') || lowerPrompt.includes('backend') || lowerPrompt.includes('developer') || lowerPrompt.includes('software')) {
          jobTitle = 'Junior Software & Web Developer';
          templateId = 'tech';
        }

        let summary = `Kandidat berdedikasi tinggi dengan keahlian praktis teruji di bidang ${jobTitle}. Memiliki fondasi pengetahuan mendalam melalui pembelajaran terstruktur, praktikum kejuruan, dan penerapan Standard Operating Procedure (SOP). Siap memberikan kontribusi produktif dan antusiasme belajar tinggi pada program magang maupun posisi entry-level.`;

        if (GEMINI_API_KEY && userPrompt) {
          const aiSummary = await callGemini(
            `Tulis ringkasan profil resume profesional (2-3 kalimat) dalam Bahasa Indonesia untuk kandidat/pelajar di bidang "${jobTitle}" berdasarkan permintaan: "${userPrompt}". Pastikan nada percaya diri, ringkas, dan ATS-friendly. Jangan menyertakan tanda petik.`
          );
          if (aiSummary) summary = aiSummary.replace(/^["']|["']$/g, '').trim();
        }

        const customCV = {
          ...currentCV,
          title: `CV ${jobTitle}`,
          templateId,
          accentColor,
          personalInfo: {
            ...currentCV?.personalInfo,
            jobTitle,
          },
          summary,
        };

        return NextResponse.json({
          success: true,
          data: customCV,
        });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    console.error('AI route error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
