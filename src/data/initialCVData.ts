import { CVData } from '@/types/cv';

export const blankCVData: CVData = {
  id: '',
  title: 'Untitled CV',
  updatedAt: 'Just now',
  templateId: 'minimalist',
  accentColor: '#6685FF',
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    photoUrl: '',
  },
  summary: '',
  education: [],
  experience: [],
  organizations: [],
  projects: [],
  skills: [],
  certifications: [],
  achievements: [],
  languages: [],
};

export const defaultCVData: CVData = blankCVData;
