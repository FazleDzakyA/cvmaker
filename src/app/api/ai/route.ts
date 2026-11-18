import { NextRequest, NextResponse } from 'next/server';
import { transformStudentExperience, generateProfessionalSummary, rewriteBulletPoint } from '@/lib/aiTransformer';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

async function callGemini(prompt: string): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;

  const candidateModels = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
  ];

  for (const model of candidateModels) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
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
      case 'transform_experience': {
        const { type, title, role, rawDescription, toolsUsed, fieldCategory } = payload;

        // Try Gemini live generation first with Universal Major context
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

        // Fallback to internal universal transformer
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
        const { role, studentLevel, skills } = payload;

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
        const { text, mode } = payload;

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
        const { userPrompt, currentCV } = payload;
        const lowerPrompt = (userPrompt || '').toLowerCase();

        // 1. Detect optimal template
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

        // 2. Detect accent color
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

        // 3. Detect job title / profession across ALL fields
        let jobTitle = currentCV?.personalInfo?.jobTitle || 'Kandidat Profesional';

        // Otomotif & Mesin
        if (lowerPrompt.includes('otomotif') || lowerPrompt.includes('tkr') || lowerPrompt.includes('mobil') || lowerPrompt.includes('motor') || lowerPrompt.includes('tbsm') || lowerPrompt.includes('bengkel')) {
          jobTitle = 'Teknisi Otomotif & Mekanik';
          templateId = 'corporate';
        } else if (lowerPrompt.includes('mesin') || lowerPrompt.includes('bubut') || lowerPrompt.includes('frais') || lowerPrompt.includes('las') || lowerPrompt.includes('welder')) {
          jobTitle = 'Teknisi Permesinan & Pengelasan';
          templateId = 'corporate';
        } else if (lowerPrompt.includes('listrik') || lowerPrompt.includes('titl') || lowerPrompt.includes('plc') || lowerPrompt.includes('mekatronika')) {
          jobTitle = 'Teknisi Ketenagalistrikan & Otomasi';
          templateId = 'tech';
        }
        // Akuntansi & Keuangan
        else if (lowerPrompt.includes('akuntansi') || lowerPrompt.includes('keuangan') || lowerPrompt.includes('finance') || lowerPrompt.includes('pajak') || lowerPrompt.includes('akl') || lowerPrompt.includes('kasir')) {
          jobTitle = 'Staf Akuntansi & Keuangan (Finance)';
          templateId = 'corporate';
        }
        // Perkantoran & Administrasi
        else if (lowerPrompt.includes('admin') || lowerPrompt.includes('perkantoran') || lowerPrompt.includes('mplb') || lowerPrompt.includes('sekretaris') || lowerPrompt.includes('arsip')) {
          jobTitle = 'Staf Administrasi Perkantoran';
          templateId = 'corporate';
        }
        // Pemasaran & Bisnis Digital
        else if (lowerPrompt.includes('pemasaran') || lowerPrompt.includes('marketing') || lowerPrompt.includes('penjualan') || lowerPrompt.includes('sales') || lowerPrompt.includes('bdp') || lowerPrompt.includes('bisnis digital')) {
          jobTitle = 'Spesialis Pemasaran & Bisnis Digital';
          templateId = 'creative';
        }
        // DKV & Seni Kreatif
        else if (lowerPrompt.includes('dkv') || lowerPrompt.includes('desain') || lowerPrompt.includes('design') || lowerPrompt.includes('grafis') || lowerPrompt.includes('video') || lowerPrompt.includes('multimedia')) {
          jobTitle = 'Desainer Grafis & Media Kreatif (DKV)';
          templateId = 'creative';
        }
        // TKJ & Infrastruktur Jaringan
        else if (lowerPrompt.includes('tkj') || lowerPrompt.includes('jaringan') || lowerPrompt.includes('network') || lowerPrompt.includes('mikrotik') || lowerPrompt.includes('cisco')) {
          jobTitle = 'Teknisi Komputer & Jaringan (TKJ)';
          templateId = 'tech';
        }
        // Kuliner & Tata Boga
        else if (lowerPrompt.includes('boga') || lowerPrompt.includes('kuliner') || lowerPrompt.includes('chef') || lowerPrompt.includes('cook') || lowerPrompt.includes('masak') || lowerPrompt.includes('pastry')) {
          jobTitle = 'Cook Helper & Spesialis Kuliner (Tata Boga)';
          templateId = 'creative';
        }
        // Perhotelan & Hospitality
        else if (lowerPrompt.includes('hotel') || lowerPrompt.includes('hospitality') || lowerPrompt.includes('front office') || lowerPrompt.includes('pariwisata')) {
          jobTitle = 'Staf Perhotelan & Front Office';
          templateId = 'corporate';
        }
        // Farmasi & Kesehatan
        else if (lowerPrompt.includes('farmasi') || lowerPrompt.includes('obat') || lowerPrompt.includes('apotek')) {
          jobTitle = 'Asisten Tenaga Kefarmasian';
          templateId = 'ats';
        } else if (lowerPrompt.includes('perawat') || lowerPrompt.includes('kesehatan') || lowerPrompt.includes('medis')) {
          jobTitle = 'Asisten Perawat & Layanan Kesehatan';
          templateId = 'ats';
        }
        // PPLG / Software Developer
        else if (lowerPrompt.includes('web') || lowerPrompt.includes('frontend') || lowerPrompt.includes('backend') || lowerPrompt.includes('fullstack') || lowerPrompt.includes('developer') || lowerPrompt.includes('software') || lowerPrompt.includes('rpl') || lowerPrompt.includes('pplg')) {
          jobTitle = 'Junior Software & Web Developer';
          templateId = 'tech';
        }
        // SMA / Beasiswa
        else if (lowerPrompt.includes('sma') || lowerPrompt.includes('beasiswa') || lowerPrompt.includes('universitas') || lowerPrompt.includes('akademik') || lowerPrompt.includes('kampus')) {
          jobTitle = 'Kandidat Akademik & Beasiswa';
          templateId = 'ats';
        }

        // 4. Generate AI summary
        let summary = `Kandidat berdedikasi tinggi dengan keahlian praktis teruji di bidang ${jobTitle}. Memiliki fondasi pengetahuan mendalam melalui pembelajaran terstruktur, praktikum kejuruan, dan penerapan Standard Operating Procedure (SOP). Siap memberikan kontribusi produktif dan antusiasme belajar tinggi pada program magang maupun posisi entry-level.`;

        if (GEMINI_API_KEY && userPrompt) {
          const aiSummary = await callGemini(
            `Tulis ringkasan profil resume profesional (2-3 kalimat) dalam Bahasa Indonesia untuk kandidat/pelajar di bidang "${jobTitle}" berdasarkan permintaan: "${userPrompt}". Pastikan nada percaya diri, ringkas, dan ATS-friendly. Jangan menyertakan tanda petik.`
          );
          if (aiSummary) summary = aiSummary.replace(/^["']|["']$/g, '').trim();
        }

        // 5. Build customized CV object
        const customCV = {
          ...currentCV,
          title: `CV ${jobTitle}`,
          templateId,
          accentColor,
          personalInfo: {
            ...currentCV.personalInfo,
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
