import { CVData, ATSAnalysisReport, ATSSuggestion } from '@/types/cv';

const STRONG_ACTION_VERBS = [
  'developed', 'engineered', 'implemented', 'designed', 'built', 'spearheaded',
  'led', 'collaborated', 'created', 'optimized', 'reduced', 'increased', 'managed',
  'supervised', 'coordinated', 'authored', 'analyzed', 'automated', 'streamlined',
  'mentored', 'facilitated', 'executed', 'formulated', 'delivered'
];

const TECH_KEYWORDS = [
  'react', 'next.js', 'typescript', 'javascript', 'html', 'css', 'tailwind',
  'laravel', 'php', 'node.js', 'python', 'mysql', 'postgresql', 'git', 'github',
  'rest api', 'responsive', 'ui/ux', 'figma', 'agile', 'scrum', 'database'
];

export function analyzeCVWithATS(cv: CVData): ATSAnalysisReport {
  const suggestions: ATSSuggestion[] = [];
  const detectedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  let structureScore = 0;
  let keywordScore = 0;
  let readabilityScore = 0;
  let formattingScore = 0;
  let skillsScore = 0;

  // 1. Structure Check (20 pts max)
  let structPoints = 0;
  if (cv.personalInfo.fullName && cv.personalInfo.email && cv.personalInfo.phone) {
    structPoints += 5;
  } else {
    suggestions.push({
      id: 's-contact',
      title: 'Incomplete Contact Details',
      category: 'Structure',
      description: 'Ensure your Full Name, Email, Phone number, and Location are fully provided for recruiter contact.',
      severity: 'high',
      fixable: true,
    });
  }

  if (cv.personalInfo.linkedin || cv.personalInfo.github) {
    structPoints += 3;
  } else {
    suggestions.push({
      id: 's-social',
      title: 'Add Professional Links',
      category: 'Structure',
      description: 'Adding a GitHub or LinkedIn profile elevates your credentials by providing proof of work.',
      severity: 'medium',
      fixable: true,
    });
  }

  if (cv.summary && cv.summary.trim().length > 50) {
    structPoints += 4;
  } else {
    suggestions.push({
      id: 's-summary',
      title: 'Missing or Brief Professional Summary',
      category: 'Structure',
      description: 'Add a 2-4 sentence summary highlighting your core skills, passion, and target objective.',
      severity: 'high',
      fixable: true,
    });
  }

  if (cv.education && cv.education.length > 0) {
    structPoints += 4;
  } else {
    suggestions.push({
      id: 's-edu',
      title: 'Add Education Information',
      category: 'Structure',
      description: 'Education is essential, especially for students and fresh graduates.',
      severity: 'high',
      fixable: true,
    });
  }

  if ((cv.projects && cv.projects.length > 0) || (cv.experience && cv.experience.length > 0)) {
    structPoints += 4;
  } else {
    suggestions.push({
      id: 's-exp',
      title: 'Add Projects or Practical Experience',
      category: 'Structure',
      description: 'Showcase at least 1 or 2 practical assignments, school projects, or internships.',
      severity: 'high',
      fixable: true,
    });
  }
  structureScore = Math.min(20, structPoints);

  // 2. Keyword Relevance (20 pts max)
  const fullText = JSON.stringify(cv).toLowerCase();
  TECH_KEYWORDS.forEach((kw) => {
    if (fullText.includes(kw)) {
      detectedKeywords.push(kw);
    } else {
      if (missingKeywords.length < 5) {
        missingKeywords.push(kw);
      }
    }
  });

  const kwRatio = detectedKeywords.length / 10;
  keywordScore = Math.min(20, Math.round(kwRatio * 20));
  if (keywordScore < 14) {
    suggestions.push({
      id: 's-keywords',
      title: 'Increase Industry Keywords',
      category: 'Keywords',
      description: `Target keywords like ${missingKeywords.slice(0, 3).join(', ')} were not detected. Include relevant skills you know.`,
      severity: 'medium',
      fixable: true,
    });
  }

  // 3. Readability & Action Verbs (20 pts max)
  const allHighlights: string[] = [
    ...cv.experience.flatMap((e) => e.highlights),
    ...cv.organizations.flatMap((o) => o.highlights),
    ...cv.projects.flatMap((p) => p.highlights),
  ];

  let strongVerbMatches = 0;
  let quantifiableMatches = 0;

  allHighlights.forEach((hl) => {
    const lower = hl.toLowerCase();
    const hasVerb = STRONG_ACTION_VERBS.some((verb) => lower.includes(verb));
    if (hasVerb) strongVerbMatches++;

    const hasNumbers = /\d+%|\d+\+|\b\d+\b/.test(hl);
    if (hasNumbers) quantifiableMatches++;
  });

  let readPoints = 10;
  if (allHighlights.length > 0) {
    const verbRatio = strongVerbMatches / allHighlights.length;
    if (verbRatio > 0.4) readPoints += 5;
    const quantRatio = quantifiableMatches / allHighlights.length;
    if (quantRatio > 0.25) readPoints += 5;
  }
  readabilityScore = Math.min(20, readPoints);

  if (quantifiableMatches === 0 && allHighlights.length > 0) {
    suggestions.push({
      id: 's-metrics',
      title: 'Quantify Your Achievements',
      category: 'Impact',
      description: 'Add specific numbers (e.g. "reduced load time by 25%", "built for 3,000+ users") to give concrete proof of impact.',
      severity: 'medium',
      fixable: true,
    });
  }

  // 4. Skills Density (20 pts max)
  const totalSkillsCount = cv.skills.reduce((acc, cat) => acc + cat.skills.length, 0);
  if (totalSkillsCount >= 10) {
    skillsScore = 20;
  } else if (totalSkillsCount >= 5) {
    skillsScore = 15;
  } else {
    skillsScore = 8;
    suggestions.push({
      id: 's-skills-count',
      title: 'Add More Categorized Skills',
      category: 'Keywords',
      description: 'Recruiters and ATS search specifically for both technical tools and soft competencies. Aim for at least 8-12 skills.',
      severity: 'high',
      fixable: true,
    });
  }

  // 5. Formatting & Completeness (20 pts max)
  let fmtPoints = 15;
  if (cv.languages && cv.languages.length > 0) fmtPoints += 3;
  if (cv.certifications && cv.certifications.length > 0) fmtPoints += 2;
  formattingScore = Math.min(20, fmtPoints);

  const overallScore = Math.min(99, structureScore + keywordScore + readabilityScore + skillsScore + formattingScore);

  let statusLabel = 'Excellent! Highly Optimized';
  let statusColor = 'text-emerald-500';

  if (overallScore < 70) {
    statusLabel = 'Needs Improvement';
    statusColor = 'text-amber-500';
  } else if (overallScore < 85) {
    statusLabel = 'Good Foundation';
    statusColor = 'text-blue-500';
  }

  // Count words
  const wordCount = fullText.split(/\s+/).length;

  return {
    overallScore,
    structureScore,
    keywordScore,
    readabilityScore,
    formattingScore,
    skillsScore,
    statusLabel,
    statusColor,
    suggestions,
    detectedKeywords: Array.from(new Set(detectedKeywords)),
    missingKeywords,
    wordCount,
    bulletPointsCount: allHighlights.length,
  };
}
