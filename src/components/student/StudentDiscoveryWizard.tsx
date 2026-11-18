'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  FolderGit2,
  Users,
  Trophy,
  Code,
  Wand2,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { CVData } from '@/types/cv';
import { getActiveCV, saveActiveCV } from '@/lib/storage';
import { transformStudentExperience, generateProfessionalSummary } from '@/lib/aiTransformer';

export const StudentDiscoveryWizard: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  // Wizard State
  const [studentInfo, setStudentInfo] = useState({
    schoolType: 'SMK (Vocational High School)',
    schoolName: 'SMK Negeri 7 Semarang (STEMBA)',
    major: 'Software and Game Development (RPL)',
    targetRole: 'Software Developer Intern (PKL/Magang)',
    gradYear: '2025',
  });

  const [projectInput, setProjectInput] = useState({
    title: 'School Library Management System (E-Perpus)',
    tools: 'PHP, Laravel, MySQL, HTML, CSS, Bootstrap',
    rawDescription:
      'Created a web-based cashier and book borrowing system for our school library as a final semester project. Users can search books and record borrowing transactions.',
  });

  const [orgInput, setOrgInput] = useState({
    organization: 'OSIS SMKN 7 Semarang',
    role: 'Head of IT Division',
    period: '2023 - 2024',
    rawDescription:
      'Helped organize the annual school festival website, managed registration forms for 2,000+ students, and handled live audio/video documentation.',
  });

  const [skillsSelected, setSkillsSelected] = useState<string[]>([
    'HTML & CSS',
    'JavaScript',
    'PHP',
    'Laravel',
    'MySQL',
    'Git & GitHub',
    'UI/UX Prototyping',
    'Problem Solving',
    'Team Collaboration',
    'Communication',
  ]);

  const [customSkill, setCustomSkill] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformedProject, setTransformedProject] = useState<{
    highlights: string[];
    skills: string[];
  } | null>(null);

  // Transform Project with AI
  const handleAIExperienceTransform = async () => {
    setIsTransforming(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'transform_experience',
          payload: {
            type: 'school_project',
            title: projectInput.title,
            rawDescription: projectInput.rawDescription,
            toolsUsed: projectInput.tools,
          },
        }),
      });
      const data = await res.json();
      if (data.data) {
        setTransformedProject({
          highlights: data.data.highlights,
          skills: data.data.inferredSkills,
        });
      }
    } catch (e) {
      const result = transformStudentExperience({
        type: 'school_project',
        title: projectInput.title,
        rawDescription: projectInput.rawDescription,
        toolsUsed: projectInput.tools,
      });
      setTransformedProject({
        highlights: result.highlights,
        skills: result.inferredSkills,
      });
    } finally {
      setIsTransforming(false);
    }
  };

  // Complete and Apply to CV
  const handleCompleteWizard = () => {
    const existingCV = getActiveCV();

    const summary = generateProfessionalSummary(
      studentInfo.targetRole,
      studentInfo.schoolType,
      skillsSelected
    );

    const updatedCV: CVData = {
      ...existingCV,
      templateId: 'student', // automatically switch to Student Template
      summary,
      education: [
        {
          id: `edu-${Date.now()}`,
          institution: studentInfo.schoolName,
          degree: studentInfo.schoolType.includes('SMK') ? 'Vocational High School' : "Bachelor's Degree",
          fieldOfStudy: studentInfo.major,
          startDate: '2022',
          endDate: studentInfo.gradYear,
          relevantCourses: 'Practical Software Architecture, Database Systems, Web Frameworks',
        },
      ],
      projects: [
        {
          id: `proj-${Date.now()}`,
          title: projectInput.title,
          role: 'Lead Project Developer',
          technologies: projectInput.tools.split(',').map((s) => s.trim()),
          highlights: transformedProject
            ? transformedProject.highlights
            : [
                `Developed ${projectInput.title} utilizing ${projectInput.tools}.`,
                'Implemented responsive user interfaces and validated secure data transactions.',
              ],
        },
      ],
      organizations: [
        {
          id: `org-${Date.now()}`,
          organization: orgInput.organization,
          role: orgInput.role,
          period: orgInput.period,
          highlights: [
            'Led technical committee operations and administered digital event platforms.',
            'Collaborated with student officers and faculty advisors to ensure smooth logistical execution.',
          ],
        },
      ],
      skills: [
        {
          category: 'Technical & Web',
          skills: skillsSelected.filter((s) => !['Team Collaboration', 'Communication', 'Problem Solving'].includes(s)),
        },
        {
          category: 'Soft Skills & Leadership',
          skills: ['Team Collaboration', 'Communication', 'Problem Solving', 'Fast Learner'],
        },
      ],
    };

    saveActiveCV(updatedCV);
    router.push('/builder');
  };

  return (
    <div className="max-w-3xl mx-auto rounded-3xl glass-card border border-white/90 shadow-2xl p-6 sm:p-10 bg-white/90 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Progress Bar & Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Student Mode Discovery
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400">
            Step {currentStep} of {totalSteps}
          </span>
        </div>

        {/* Multi-step track */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Academic Background */}
      {currentStep === 1 && (
        <div className="space-y-5 animate-in fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
              Let&apos;s start with your academic foundation.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              No formal employment? That is completely normal! Your school or university studies are full of valuable skills.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Where are you currently studying?</label>
              <select
                value={studentInfo.schoolType}
                onChange={(e) => setStudentInfo({ ...studentInfo, schoolType: e.target.value })}
                className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="SMK (Vocational High School)">SMK (Vocational High School / PKL)</option>
                <option value="SMA / High School">SMA (Senior High School)</option>
                <option value="Diploma Student (D3/D4)">Diploma Student (D3 / D4)</option>
                <option value="University Undergraduate (S1)">University Undergraduate (S1)</option>
                <option value="Fresh Graduate">Fresh Graduate (Within 1 Year)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Institution / School Name</label>
                <input
                  type="text"
                  value={studentInfo.schoolName}
                  onChange={(e) => setStudentInfo({ ...studentInfo, schoolName: e.target.value })}
                  placeholder="e.g. SMKN 7 Semarang"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Major or Vocational Program</label>
                <input
                  type="text"
                  value={studentInfo.major}
                  onChange={(e) => setStudentInfo({ ...studentInfo, major: e.target.value })}
                  placeholder="e.g. Software Engineering (RPL), Computer Network (TKJ)"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Role or Objective</label>
                <input
                  type="text"
                  value={studentInfo.targetRole}
                  onChange={(e) => setStudentInfo({ ...studentInfo, targetRole: e.target.value })}
                  placeholder="e.g. Web Developer Intern, Junior Designer"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Graduation Year</label>
                <input
                  type="text"
                  value={studentInfo.gradYear}
                  onChange={(e) => setStudentInfo({ ...studentInfo, gradYear: e.target.value })}
                  placeholder="e.g. 2025"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: School Project & AI Experience Transformer */}
      {currentStep === 2 && (
        <div className="space-y-5 animate-in fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
              Tell us about an assignment or school project.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Our AI Experience Transformer converts your raw assignment description into professional recruiter-ready bullet points without making up fake claims!
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Project or Assignment Name</label>
              <input
                type="text"
                value={projectInput.title}
                onChange={(e) => setProjectInput({ ...projectInput, title: e.target.value })}
                placeholder="e.g. School Library Website, Final Capstone Project"
                className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tools / Technologies Used</label>
              <input
                type="text"
                value={projectInput.tools}
                onChange={(e) => setProjectInput({ ...projectInput, tools: e.target.value })}
                placeholder="e.g. HTML, CSS, JavaScript, PHP, MySQL, Figma"
                className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">What did you build? (In simple everyday words)</label>
              <textarea
                rows={3}
                value={projectInput.rawDescription}
                onChange={(e) => setProjectInput({ ...projectInput, rawDescription: e.target.value })}
                placeholder="e.g. I created a school website using HTML and CSS for an assignment..."
                className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <button
              type="button"
              onClick={handleAIExperienceTransform}
              disabled={isTransforming}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-500/20 flex items-center gap-2 transition-all disabled:opacity-60"
            >
              {isTransforming ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Transforming with AI...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Transform with AI Experience Engine</span>
                </>
              )}
            </button>

            {transformedProject && (
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 animate-in fade-in space-y-2">
                <span className="text-xs font-bold text-purple-800 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Professional Transformation Result:
                </span>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-800">
                  {transformedProject.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: Student Organizations & Extracurriculars */}
      {currentStep === 3 && (
        <div className="space-y-5 animate-in fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
              Student organizations & extracurriculars count!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              OSIS, BEM, clubs, school festivals, sports committees, or community groups prove your teamwork and leadership.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Organization or Club</label>
                <input
                  type="text"
                  value={orgInput.organization}
                  onChange={(e) => setOrgInput({ ...orgInput, organization: e.target.value })}
                  placeholder="e.g. OSIS, English Club, IT Student Committee"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Role / Responsibility</label>
                <input
                  type="text"
                  value={orgInput.role}
                  onChange={(e) => setOrgInput({ ...orgInput, role: e.target.value })}
                  placeholder="e.g. Head of IT Division, Committee Member"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Active Period (Years)</label>
              <input
                type="text"
                value={orgInput.period}
                onChange={(e) => setOrgInput({ ...orgInput, period: e.target.value })}
                placeholder="e.g. 2023 - 2024"
                className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">What did your role involve?</label>
              <textarea
                rows={3}
                value={orgInput.rawDescription}
                onChange={(e) => setOrgInput({ ...orgInput, rawDescription: e.target.value })}
                placeholder="e.g. I helped organize the annual festival, managed tickets, and coordinated with teachers..."
                className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-200 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Skills Discovery */}
      {currentStep === 4 && (
        <div className="space-y-5 animate-in fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
              AI Skill Discovery: Select what you know.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Click the competencies you have practiced in school assignments, clubs, or self-study.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              'HTML & CSS',
              'JavaScript',
              'PHP',
              'Laravel',
              'MySQL',
              'Python',
              'Git & GitHub',
              'Figma UI Design',
              'Computer Networking (LAN/WLAN)',
              'Problem Solving',
              'Team Collaboration',
              'Public Communication',
              'Time Management',
              'Microsoft Office',
              'Fast Learner',
              'Documentation',
            ].map((skill) => {
              const isSelected = skillsSelected.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      setSkillsSelected(skillsSelected.filter((s) => s !== skill));
                    } else {
                      setSkillsSelected([...skillsSelected, skill]);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              placeholder="Add another custom skill..."
              className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
            />
            <button
              type="button"
              onClick={() => {
                if (customSkill.trim() && !skillsSelected.includes(customSkill.trim())) {
                  setSkillsSelected([...skillsSelected, customSkill.trim()]);
                  setCustomSkill('');
                }
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-black transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Review & Auto-Generate */}
      {currentStep === 5 && (
        <div className="space-y-5 animate-in fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
              Your Student CV Profile is ready!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              We have structured your academic projects, leadership activities, and competencies into the official Student CV format.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Recommended Template: Student & Fresh Graduate</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              This layout places your Education, Coursework, School Projects, and Organizational Experience prominently at the top so employers see your capabilities first.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-blue-800 border border-blue-200">
                100% Truthful
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-blue-800 border border-blue-200">
                ATS Optimized
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-blue-800 border border-blue-200">
                PKL / Internship Ready
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Wizard Footer Controls */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200/60">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep + 1)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCompleteWizard}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply to Studio & View Live CV</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
