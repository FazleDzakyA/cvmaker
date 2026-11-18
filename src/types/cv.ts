export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  photoUrl?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
  relevantCourses?: string;
}

export interface WorkExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface OrganizationItem {
  id: string;
  organization: string;
  role: string;
  period: string;
  highlights: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  role?: string;
  technologies: string[];
  link?: string;
  highlights: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  event: string;
  year: string;
  rank?: string;
  description?: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Intermediate' | 'Basic';
}

export interface CVData {
  id: string;
  title: string;
  updatedAt: string;
  templateId: 'minimalist' | 'corporate' | 'creative' | 'ats' | 'student' | 'tech';
  accentColor: string; // e.g. '#6685FF', '#243B80', '#10B981', '#EC4899', '#8B5CF6'
  fontFamily?: string;
  personalInfo: PersonalInfo;
  summary: string;
  education: EducationItem[];
  experience: WorkExperienceItem[];
  organizations: OrganizationItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  languages: LanguageItem[];
  additionalInfo?: string;
}

export interface ATSSuggestion {
  id: string;
  title: string;
  category: 'Structure' | 'Keywords' | 'Readability' | 'Formatting' | 'Impact';
  description: string;
  severity: 'high' | 'medium' | 'low';
  fixable: boolean;
}

export interface ATSAnalysisReport {
  overallScore: number;
  structureScore: number;
  keywordScore: number;
  readabilityScore: number;
  formattingScore: number;
  skillsScore: number;
  statusLabel: string;
  statusColor: string;
  suggestions: ATSSuggestion[];
  detectedKeywords: string[];
  missingKeywords: string[];
  wordCount: number;
  bulletPointsCount: number;
}
