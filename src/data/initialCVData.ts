import { CVData } from '@/types/cv';

export const defaultCVData: CVData = {
  id: 'cv-fazle-01',
  title: 'Fazle Software Developer CV',
  updatedAt: '2 hours ago',
  templateId: 'minimalist',
  accentColor: '#6685FF',
  personalInfo: {
    fullName: 'Fazle Dzaky Aryaguna',
    jobTitle: 'Software Developer',
    email: 'fazle.dzaky@gmail.com',
    phone: '+62 812 3456 7890',
    location: 'Semarang, Indonesia',
    linkedin: 'linkedin.com/in/fazledzaky',
    github: 'github.com/fazledzaky',
    website: 'fazledzaky.dev',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  summary: 'Passionate and driven Software Developer with a strong foundation in modern web development, UI/UX design, and responsive application architecture. Experienced in building full-stack web applications with Next.js, React, and Laravel through rigorous vocational school projects and collaborative tech team environments.',
  education: [
    {
      id: 'edu-1',
      institution: 'SMK Negeri 7 Semarang (STEMBA)',
      degree: 'Vocational High School Diploma',
      fieldOfStudy: 'Software and Game Development (RPL)',
      startDate: '2022',
      endDate: '2025',
      gpa: '91.8 / 100',
      honors: 'Valedictorian Candidate in Software Engineering',
      relevantCourses: 'Object-Oriented Programming, Database Systems, Web App Architecture, UI/UX Prototyping',
    },
    {
      id: 'edu-2',
      institution: 'Dian Nuswantoro University (UDINUS)',
      degree: "Bachelor's Degree",
      fieldOfStudy: 'Informatics Engineering (Computer Science)',
      startDate: '2025',
      endDate: 'Present',
      gpa: '3.88 / 4.00',
      relevantCourses: 'Data Structures, Algorithms, Software Engineering, Cloud Computing',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'TechNusa Solusindo',
      position: 'Frontend Developer Intern (PKL/Magang)',
      location: 'Semarang, Indonesia',
      startDate: 'Jul 2024',
      endDate: 'Dec 2024',
      current: false,
      highlights: [
        'Developed 12+ responsive user interface modules for an enterprise resource planning portal using React and Tailwind CSS.',
        'Collaborated with senior backend engineers to consume RESTful APIs, reducing average page load latency by 28%.',
        'Authored reusable UI component libraries according to Figma design tokens, speeding up team delivery sprints.',
      ],
    },
  ],
  organizations: [
    {
      id: 'org-1',
      organization: 'OSIS & MPK SMKN 7 Semarang',
      role: 'Head of Information Technology Division',
      period: '2023 - 2024',
      highlights: [
        'Spearheaded the development of a real-time school festival ticketing website serving over 3,500 active student visitors.',
        'Supervised a student committee of 8 members to live-stream, document, and administer technology for major school events.',
      ],
    },
    {
      id: 'org-2',
      organization: 'Google Developer Student Clubs (GDSC)',
      role: 'Core Team Member - Web Track',
      period: '2025 - Present',
      highlights: [
        'Organized weekly study jams mentoring 45+ beginner students in HTML5, modern CSS, and JavaScript basics.',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'E-Perpus: Intelligent School Library Portal',
      role: 'Lead Full-Stack Developer',
      technologies: ['Laravel 11', 'MySQL', 'Tailwind CSS', 'Alpine.js'],
      link: 'github.com/fazledzaky/e-perpus',
      highlights: [
        'Engineered an automated book borrowing and fine management system utilized across 3 campus branches.',
        'Implemented fast barcode scanning integration reducing student checkout waiting times by 65%.',
      ],
    },
    {
      id: 'proj-2',
      title: 'CVGenie - AI Student Resume Builder',
      role: 'Frontend & UI Architect',
      technologies: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      link: 'github.com/fazledzaky/cvgenie',
      highlights: [
        'Designed a liquid glassmorphism interface enabling students to convert academic assignments into ATS-friendly resumes.',
        'Created dynamic client-side PDF rendering engine ensuring 100% accurate A4 printing proportions.',
      ],
    },
  ],
  skills: [
    {
      category: 'Frontend & UI',
      skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Figma'],
    },
    {
      category: 'Backend & Databases',
      skills: ['Laravel', 'PHP', 'Node.js', 'MySQL', 'RESTful APIs', 'PostgreSQL'],
    },
    {
      category: 'Tools & DevOps',
      skills: ['Git', 'GitHub', 'VS Code', 'Postman', 'Docker Basics', 'Vercel'],
    },
    {
      category: 'Soft Skills',
      skills: ['Problem Solving', 'Team Leadership', 'Technical Writing', 'Public Speaking'],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Junior Web Developer Certification (JWD)',
      issuer: 'BNSP / Kominfo Indonesia',
      issueDate: 'Aug 2024',
      credentialUrl: 'bnsp.go.id/cert/JWD-2024-9982',
    },
    {
      id: 'cert-2',
      name: 'Menjadi Front-End Web Developer Expert',
      issuer: 'Dicoding Indonesia',
      issueDate: 'May 2024',
      credentialUrl: 'dicoding.com/certificates/FRONTEND-EXPERT',
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: '1st Place - Web Technologies Competition',
      event: 'LKS SMK Tingkat Kota Semarang',
      year: '2024',
      rank: 'Gold Medalist',
      description: 'Built a full-stack progressive web application within an 8-hour live competition module.',
    },
    {
      id: 'ach-2',
      title: 'Top 5 Finalist - National Student Hackathon',
      event: 'Informatics Innovation Festival',
      year: '2024',
      rank: 'National Finalist',
      description: 'Pitched an AI-assisted disaster relief logistical platform before an industry jury panel.',
    },
  ],
  languages: [
    { id: 'lang-1', name: 'Indonesian', proficiency: 'Native' },
    { id: 'lang-2', name: 'English', proficiency: 'Fluent' },
  ],
  additionalInfo: 'Available for immediate software engineering internships (PKL/Magang) and junior developer contracts. Passionate about open-source contributions.',
};
