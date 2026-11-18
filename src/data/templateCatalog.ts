export interface TemplateMeta {
  id: 'minimalist' | 'corporate' | 'creative' | 'ats' | 'student' | 'tech';
  name: string;
  category: string;
  description: string;
  badge?: string;
  thumbnailColor: string;
  recommendedFor: string[];
}

export const TEMPLATES_CATALOG: TemplateMeta[] = [
  {
    id: 'minimalist',
    name: 'Modern Minimalist',
    category: 'Modern',
    description: 'Clean typography, refined spacing, and subtle dividers. Perfect for modern roles and clear readability.',
    badge: 'Popular',
    thumbnailColor: 'from-blue-500/20 to-indigo-500/20',
    recommendedFor: ['Web Developers', 'Designers', 'Fresh Graduates', 'General Entry Level'],
  },
  {
    id: 'corporate',
    name: 'Corporate Professional',
    category: 'Professional',
    description: 'Executive structure with crisp navy accents, formal header, and balanced chronological timeline.',
    badge: 'Classic',
    thumbnailColor: 'from-slate-700/20 to-blue-900/20',
    recommendedFor: ['Accounting', 'Administration', 'Banking', 'Management Trainees'],
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    category: 'Creative',
    description: 'Dynamic dual-column format featuring a stylish sidebar profile, visual skill pills, and project focus.',
    badge: 'Design Choice',
    thumbnailColor: 'from-purple-500/20 to-pink-500/20',
    recommendedFor: ['UI/UX Designers', 'Multimedia Students', 'Content Creators', 'Game Developers'],
  },
  {
    id: 'ats',
    name: 'ATS-Friendly Classic',
    category: 'ATS Optimized',
    description: 'Single-column text architecture designed specifically to pass automated applicant tracking systems with 100% scannability.',
    badge: '99% ATS Pass',
    thumbnailColor: 'from-emerald-500/20 to-teal-500/20',
    recommendedFor: ['Enterprise Jobs', 'Multinational Corporations', 'Government Applications', 'Scholarships'],
  },
  {
    id: 'student',
    name: 'Student & Fresh Graduate',
    category: 'Student Focused',
    description: 'Highlights academic projects, vocational assignments, student organizations, and competencies above formal work history.',
    badge: 'Student Mode',
    thumbnailColor: 'from-violet-500/20 to-electric-blue/20',
    recommendedFor: ['SMK / SMA Students', 'Internships (PKL/Magang)', 'University Students', 'First Job Seekers'],
  },
  {
    id: 'tech',
    name: 'Modern Tech Resume',
    category: 'Engineering',
    description: 'Engineered for software developers and IT graduates with tech stack categories, repository links, and impact metrics.',
    badge: 'Developer Fav',
    thumbnailColor: 'from-cyan-500/20 to-blue-600/20',
    recommendedFor: ['Junior Software Engineers', 'DevOps / SysAdmin', 'Data Analysts', 'Network Engineers'],
  },
];
