import { NextRequest, NextResponse } from 'next/server';
import { transformStudentExperience, generateProfessionalSummary, rewriteBulletPoint } from '@/lib/aiTransformer';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

async function callGemini(prompt: string): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;

  const candidateModels = [
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.1-pro-preview',
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
    } catch (e) {
      // Try next model or fallback
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
        const { type, title, role, rawDescription, toolsUsed } = payload;

        // Try Gemini live generation first
        if (GEMINI_API_KEY && rawDescription) {
          const prompt = `Act as an expert ATS Resume Coach for students and vocational graduates (SMK).
Transform the following student project or non-formal experience into 2-3 professional, punchy resume bullet points.
Rules:
1. Preserve the original facts. Never fabricate false achievements, metrics, or technologies.
2. Start each bullet point with strong action verbs (e.g., Developed, Engineered, Spearheaded, Coordinated, Implemented).
3. Ensure ATS scannability.
4. Output only the bullet points, one per line starting with a hyphen.

Project Title: ${title || 'Academic Project'}
Tools/Technologies: ${toolsUsed || 'General'}
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
                  title: title || 'Academic Project',
                  role: role || 'Lead Developer',
                  highlights: lines,
                  inferredSkills: tools,
                },
              });
            }
          }
        }

        // Fallback to internal transformer
        const result = transformStudentExperience({
          type: type || 'school_project',
          title: title || 'Project',
          role: role || 'Contributor',
          rawDescription: rawDescription || '',
          toolsUsed: toolsUsed || '',
        });
        return NextResponse.json({ success: true, source: 'nlp_engine', data: result });
      }

      case 'generate_summary': {
        const { role, studentLevel, skills } = payload;

        if (GEMINI_API_KEY && role) {
          const prompt = `Write a professional 2-3 sentence resume summary for a ${studentLevel || 'Student / Fresh Graduate'} targeting the position of "${role}".
Key competencies: ${(skills || []).join(', ')}.
Tone: Confident, ambitious, articulate, and recruiter-ready.
Do not include quotation marks or placeholder brackets.`;

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
          role || 'Software Developer',
          studentLevel || 'SMK Graduate',
          skills || ['HTML', 'CSS', 'JavaScript']
        );
        return NextResponse.json({ success: true, source: 'nlp_engine', data: { summary } });
      }

      case 'improve_text': {
        const { text, mode } = payload;

        if (GEMINI_API_KEY && text) {
          const prompt = `Improve the following resume bullet point for maximum impact, ATS readability, and professional tone.
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
        if (lowerPrompt.includes('tech') || lowerPrompt.includes('developer') || lowerPrompt.includes('coding') || lowerPrompt.includes('software')) {
          templateId = 'tech';
        } else if (lowerPrompt.includes('kreatif') || lowerPrompt.includes('creative') || lowerPrompt.includes('desain') || lowerPrompt.includes('design') || lowerPrompt.includes('ui/ux') || lowerPrompt.includes('dkv')) {
          templateId = 'creative';
        } else if (lowerPrompt.includes('ats') || lowerPrompt.includes('formal') || lowerPrompt.includes('beasiswa') || lowerPrompt.includes('classic')) {
          templateId = 'ats';
        } else if (lowerPrompt.includes('corporate') || lowerPrompt.includes('kantor') || lowerPrompt.includes('finance') || lowerPrompt.includes('akuntansi') || lowerPrompt.includes('admin')) {
          templateId = 'corporate';
        } else if (lowerPrompt.includes('minimal')) {
          templateId = 'minimalist';
        }

        // 2. Detect accent color
        let accentColor = '#6685FF';
        if (lowerPrompt.includes('hijau') || lowerPrompt.includes('green') || lowerPrompt.includes('emerald') || lowerPrompt.includes('mint')) {
          accentColor = '#10B981';
        } else if (lowerPrompt.includes('ungu') || lowerPrompt.includes('purple') || lowerPrompt.includes('violet')) {
          accentColor = '#8B5CF6';
        } else if (lowerPrompt.includes('navy') || lowerPrompt.includes('dark blue')) {
          accentColor = '#243B80';
        } else if (lowerPrompt.includes('pink') || lowerPrompt.includes('rose')) {
          accentColor = '#EC4899';
        } else if (lowerPrompt.includes('amber') || lowerPrompt.includes('gold') || lowerPrompt.includes('kuning')) {
          accentColor = '#F59E0B';
        }

        // 3. Detect job title / focus
        let jobTitle = currentCV?.personalInfo?.jobTitle || 'Software Developer';
        if (lowerPrompt.includes('ui/ux') || lowerPrompt.includes('desain')) jobTitle = 'UI/UX Designer';
        if (lowerPrompt.includes('akuntansi') || lowerPrompt.includes('keuangan')) jobTitle = 'Finance & Accounting Specialist';
        if (lowerPrompt.includes('admin') || lowerPrompt.includes('administrasi')) jobTitle = 'Administrative Assistant';
        if (lowerPrompt.includes('frontend')) jobTitle = 'Frontend Engineer';
        if (lowerPrompt.includes('fullstack') || lowerPrompt.includes('full stack')) jobTitle = 'Full-Stack Developer';
        if (lowerPrompt.includes('network') || lowerPrompt.includes('tkj')) jobTitle = 'Network & Infrastructure Technician';

        // 4. Generate AI summary
        let summary = `Driven and ambitious ${jobTitle} prepared with hands-on vocational capabilities, practical project delivery, and rapid adaptation to modern workflow standards. Eager to contribute foundational skills and problem-solving enthusiasm to professional internship and entry-level positions.`;

        if (GEMINI_API_KEY && userPrompt) {
          const aiSummary = await callGemini(
            `Write a 2-3 sentence impactful resume summary for a student/fresh graduate based on this request: "${userPrompt}". Keep it professional, confident, and ATS-optimized.`
          );
          if (aiSummary) summary = aiSummary.replace(/^["']|["']$/g, '').trim();
        }

        // 5. Build customized CV object
        const customCV = {
          ...currentCV,
          title: `AI Generated CV - ${jobTitle}`,
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

      case 'generate_from_prompt': {
        const { prompt } = payload;
        const lowerPrompt = (prompt || '').toLowerCase();

        let detectedRole = 'Software Developer';
        if (lowerPrompt.includes('design') || lowerPrompt.includes('ui/ux')) detectedRole = 'UI/UX Designer';
        if (lowerPrompt.includes('account') || lowerPrompt.includes('keuangan')) detectedRole = 'Accounting Staff';
        if (lowerPrompt.includes('admin') || lowerPrompt.includes('office')) detectedRole = 'Administrative Assistant';
        if (lowerPrompt.includes('network') || lowerPrompt.includes('tkj')) detectedRole = 'Network Technician';

        const summary = `Dedicated and energetic candidate preparing for roles as ${detectedRole}. Possesses strong technical foundations and practical capabilities demonstrated through academic assignments and extracurricular leadership. Ready to bring high enthusiasm and fast learning ability to internship and entry-level positions.`;

        return NextResponse.json({
          success: true,
          data: {
            detectedRole,
            summary,
            skills: ['Problem Solving', 'Team Collaboration', 'Communication', 'Attention to Detail'],
            projectSample: {
              title: `${detectedRole} Capstone Project`,
              highlights: [
                'Executed end-to-end practical project deliverables according to academic rubrics.',
                'Organized workflow schedules and presented findings clearly to peers and instructors.',
              ],
            },
          },
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
