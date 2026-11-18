'use client';

import React, { useState } from 'react';
import { CVData } from '@/types/cv';
import {
  User,
  FileText,
  GraduationCap,
  Briefcase,
  Users,
  FolderGit2,
  Code,
  Award,
  Trophy,
  Globe2,
  Sparkles,
  Plus,
  Trash2,
  Wand2,
} from 'lucide-react';
import { AIAssistantModal } from './AIAssistantModal';

interface SectionFormProps {
  cvData: CVData;
  onChange: (updated: CVData) => void;
}

type TabType =
  | 'personal'
  | 'summary'
  | 'education'
  | 'experience'
  | 'organizations'
  | 'projects'
  | 'skills'
  | 'certifications'
  | 'achievements'
  | 'languages';

export const SectionForm: React.FC<SectionFormProps> = ({ cvData, onChange }) => {
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTargetField, setAiTargetField] = useState<{
    section: string;
    itemId?: string;
    bulletIndex?: number;
    initialText?: string;
  }>({ section: 'summary' });

  const tabs = [
    { id: 'personal' as TabType, label: 'Personal Info', icon: User },
    { id: 'summary' as TabType, label: 'Summary', icon: FileText },
    { id: 'education' as TabType, label: 'Education', icon: GraduationCap },
    { id: 'experience' as TabType, label: 'Experience', icon: Briefcase },
    { id: 'projects' as TabType, label: 'Projects', icon: FolderGit2 },
    { id: 'organizations' as TabType, label: 'Organizations', icon: Users },
    { id: 'skills' as TabType, label: 'Skills', icon: Code },
    { id: 'certifications' as TabType, label: 'Certifications', icon: Award },
    { id: 'achievements' as TabType, label: 'Achievements', icon: Trophy },
    { id: 'languages' as TabType, label: 'Languages', icon: Globe2 },
  ];

  const triggerAI = (section: string, initialText: string = '', itemId?: string, bulletIndex?: number) => {
    setAiTargetField({ section, initialText, itemId, bulletIndex });
    setAiModalOpen(true);
  };

  const handleApplyAI = (text: string) => {
    if (aiTargetField.section === 'summary') {
      onChange({ ...cvData, summary: text });
    } else if (aiTargetField.section === 'project_highlight' && aiTargetField.itemId !== undefined && aiTargetField.bulletIndex !== undefined) {
      const updatedProjects = cvData.projects.map((p) => {
        if (p.id === aiTargetField.itemId) {
          const newHighlights = [...p.highlights];
          newHighlights[aiTargetField.bulletIndex!] = text;
          return { ...p, highlights: newHighlights };
        }
        return p;
      });
      onChange({ ...cvData, projects: updatedProjects });
    } else if (aiTargetField.section === 'experience_highlight' && aiTargetField.itemId !== undefined && aiTargetField.bulletIndex !== undefined) {
      const updatedExp = cvData.experience.map((e) => {
        if (e.id === aiTargetField.itemId) {
          const newHighlights = [...e.highlights];
          newHighlights[aiTargetField.bulletIndex!] = text;
          return { ...e, highlights: newHighlights };
        }
        return e;
      });
      onChange({ ...cvData, experience: updatedExp });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/70 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xl overflow-hidden">
      {/* Horizontal Tab Navigation */}
      <div className="flex overflow-x-auto p-3 gap-1.5 border-b border-slate-100/80 bg-white/40 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-white/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content Area */}
      <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5">
        {/* PERSONAL INFO */}
        {activeTab === 'personal' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center mb-1">
              <div>
                <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-500">Provide your contact details so recruiters can reach you easily.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={cvData.personalInfo.fullName}
                  onChange={(e) =>
                    onChange({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, fullName: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
                  placeholder="e.g. Fazle Dzaky Aryaguna"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Title *</label>
                <input
                  type="text"
                  value={cvData.personalInfo.jobTitle}
                  onChange={(e) =>
                    onChange({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, jobTitle: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
                  placeholder="e.g. Software Developer / UI Designer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={cvData.personalInfo.email}
                  onChange={(e) =>
                    onChange({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, email: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
                  placeholder="fazle.dzaky@gmail.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  value={cvData.personalInfo.phone}
                  onChange={(e) =>
                    onChange({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, phone: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
                  placeholder="+62 812 3456 7890"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location / City *</label>
                <input
                  type="text"
                  value={cvData.personalInfo.location}
                  onChange={(e) =>
                    onChange({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, location: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
                  placeholder="Semarang, Indonesia"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub / Portfolio Link</label>
                <input
                  type="text"
                  value={cvData.personalInfo.github || ''}
                  onChange={(e) =>
                    onChange({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, github: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
                  placeholder="github.com/fazledzaky"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  value={cvData.personalInfo.linkedin || ''}
                  onChange={(e) =>
                    onChange({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, linkedin: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
                  placeholder="linkedin.com/in/fazledzaky"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Profile Photo URL (Optional)</label>
                <input
                  type="text"
                  value={cvData.personalInfo.photoUrl || ''}
                  onChange={(e) =>
                    onChange({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, photoUrl: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        )}

        {/* SUMMARY */}
        {activeTab === 'summary' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center mb-1">
              <div>
                <h3 className="text-base font-bold text-slate-900">Professional Summary</h3>
                <p className="text-xs text-slate-500">A punchy 2-4 sentence pitch introducing your potential and passion.</p>
              </div>
              <button
                type="button"
                onClick={() => triggerAI('summary', cvData.summary)}
                className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-purple-100 transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>AI Write / Polish</span>
              </button>
            </div>

            <textarea
              rows={5}
              value={cvData.summary}
              onChange={(e) => onChange({ ...cvData, summary: e.target.value })}
              className="w-full text-xs sm:text-sm p-4 rounded-2xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/30 focus:outline-none leading-relaxed"
              placeholder="Passionate and driven student with practical hands-on experience in..."
            />
          </div>
        )}

        {/* EDUCATION */}
        {activeTab === 'education' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center mb-1">
              <div>
                <h3 className="text-base font-bold text-slate-900">Education & Coursework</h3>
                <p className="text-xs text-slate-500">Your school, vocational program, or university degrees.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newEdu = {
                    id: `edu-${Date.now()}`,
                    institution: 'SMK / University',
                    degree: 'Diploma / Degree',
                    fieldOfStudy: 'Major Program',
                    startDate: '2023',
                    endDate: 'Present',
                    gpa: '',
                  };
                  onChange({ ...cvData, education: [...cvData.education, newEdu] });
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Education</span>
              </button>
            </div>

            <div className="space-y-4">
              {cvData.education.map((edu, index) => (
                <div key={edu.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Education #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = cvData.education.filter((e) => e.id !== edu.id);
                        onChange({ ...cvData, education: updated });
                      }}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 mb-1 block">School / University</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = cvData.education.map((item) =>
                            item.id === edu.id ? { ...item, institution: e.target.value } : item
                          );
                          onChange({ ...cvData, education: updated });
                        }}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Major / Field of Study</label>
                      <input
                        type="text"
                        value={edu.fieldOfStudy}
                        onChange={(e) => {
                          const updated = cvData.education.map((item) =>
                            item.id === edu.id ? { ...item, fieldOfStudy: e.target.value } : item
                          );
                          onChange({ ...cvData, education: updated });
                        }}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Degree / Certificate</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = cvData.education.map((item) =>
                            item.id === edu.id ? { ...item, degree: e.target.value } : item
                          );
                          onChange({ ...cvData, education: updated });
                        }}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Timeline (Years)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={(e) => {
                            const updated = cvData.education.map((item) =>
                              item.id === edu.id ? { ...item, startDate: e.target.value } : item
                            );
                            onChange({ ...cvData, education: updated });
                          }}
                          placeholder="Start"
                          className="w-1/2 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                        />
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={(e) => {
                            const updated = cvData.education.map((item) =>
                              item.id === edu.id ? { ...item, endDate: e.target.value } : item
                            );
                            onChange({ ...cvData, education: updated });
                          }}
                          placeholder="End"
                          className="w-1/2 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Relevant Coursework</label>
                    <input
                      type="text"
                      value={edu.relevantCourses || ''}
                      onChange={(e) => {
                        const updated = cvData.education.map((item) =>
                          item.id === edu.id ? { ...item, relevantCourses: e.target.value } : item
                        );
                        onChange({ ...cvData, education: updated });
                      }}
                      placeholder="e.g. Web Development, Database Management, Data Structures"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center mb-1">
              <div>
                <h3 className="text-base font-bold text-slate-900">Projects & Assignments</h3>
                <p className="text-xs text-slate-500">School assignments, capstones, and personal projects.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newProj = {
                    id: `proj-${Date.now()}`,
                    title: 'New Academic Project',
                    role: 'Creator / Developer',
                    technologies: ['HTML', 'CSS', 'JavaScript'],
                    link: '',
                    highlights: ['Engineered practical project deliverable according to curriculum guidelines.'],
                  };
                  onChange({ ...cvData, projects: [...cvData.projects, newProj] });
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-4">
              {cvData.projects.map((proj, pIdx) => (
                <div key={proj.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project #{pIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = cvData.projects.filter((p) => p.id !== proj.id);
                        onChange({ ...cvData, projects: updated });
                      }}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Project Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = cvData.projects.map((p) =>
                            p.id === proj.id ? { ...p, title: e.target.value } : p
                          );
                          onChange({ ...cvData, projects: updated });
                        }}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Your Role</label>
                      <input
                        type="text"
                        value={proj.role || ''}
                        onChange={(e) => {
                          const updated = cvData.projects.map((p) =>
                            p.id === proj.id ? { ...p, role: e.target.value } : p
                          );
                          onChange({ ...cvData, projects: updated });
                        }}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                      Technologies Used (comma separated)
                    </label>
                    <input
                      type="text"
                      value={proj.technologies.join(', ')}
                      onChange={(e) => {
                        const techArr = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                        const updated = cvData.projects.map((p) =>
                          p.id === proj.id ? { ...p, technologies: techArr } : p
                        );
                        onChange({ ...cvData, projects: updated });
                      }}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  {/* Bullet Highlights */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[11px] font-semibold text-slate-600">Key Highlights / Accomplishments</label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = cvData.projects.map((p) =>
                            p.id === proj.id
                              ? { ...p, highlights: [...p.highlights, 'Implemented responsive user interface features.'] }
                              : p
                          );
                          onChange({ ...cvData, projects: updated });
                        }}
                        className="text-[11px] text-blue-600 font-semibold hover:underline"
                      >
                        + Add Bullet
                      </button>
                    </div>

                    <div className="space-y-2">
                      {proj.highlights.map((hl, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={hl}
                            onChange={(e) => {
                              const newHighlights = [...proj.highlights];
                              newHighlights[hIdx] = e.target.value;
                              const updated = cvData.projects.map((p) =>
                                p.id === proj.id ? { ...p, highlights: newHighlights } : p
                              );
                              onChange({ ...cvData, projects: updated });
                            }}
                            className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => triggerAI('project_highlight', hl, proj.id, hIdx)}
                            title="Improve with AI"
                            className="p-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newHighlights = proj.highlights.filter((_, i) => i !== hIdx);
                              const updated = cvData.projects.map((p) =>
                                p.id === proj.id ? { ...p, highlights: newHighlights } : p
                              );
                              onChange({ ...cvData, projects: updated });
                            }}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WORK / INTERNSHIP EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center mb-1">
              <div>
                <h3 className="text-base font-bold text-slate-900">Internship & Work Experience</h3>
                <p className="text-xs text-slate-500">PKL, industrial apprenticeships, or formal employment.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newExp = {
                    id: `exp-${Date.now()}`,
                    company: 'Company Name',
                    position: 'Intern / Junior Role',
                    location: 'City, Country',
                    startDate: 'Jan 2024',
                    endDate: 'Jun 2024',
                    current: false,
                    highlights: ['Assisted cross-functional team in daily technical operational tasks.'],
                  };
                  onChange({ ...cvData, experience: [...cvData.experience, newExp] });
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Experience</span>
              </button>
            </div>

            <div className="space-y-4">
              {cvData.experience.map((exp, eIdx) => (
                <div key={exp.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Experience #{eIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = cvData.experience.filter((e) => e.id !== exp.id);
                        onChange({ ...cvData, experience: updated });
                      }}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Position / Role</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => {
                          const updated = cvData.experience.map((item) =>
                            item.id === exp.id ? { ...item, position: e.target.value } : item
                          );
                          onChange({ ...cvData, experience: updated });
                        }}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Company / Organization</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = cvData.experience.map((item) =>
                            item.id === exp.id ? { ...item, company: e.target.value } : item
                          );
                          onChange({ ...cvData, experience: updated });
                        }}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                  </div>

                  {/* Highlights */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[11px] font-semibold text-slate-600">Bullet Highlights</label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = cvData.experience.map((item) =>
                            item.id === exp.id
                              ? { ...item, highlights: [...item.highlights, 'Collaborated with team to deliver sprint goals.'] }
                              : item
                          );
                          onChange({ ...cvData, experience: updated });
                        }}
                        className="text-[11px] text-blue-600 font-semibold hover:underline"
                      >
                        + Add Bullet
                      </button>
                    </div>

                    <div className="space-y-2">
                      {exp.highlights.map((hl, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={hl}
                            onChange={(e) => {
                              const newHighlights = [...exp.highlights];
                              newHighlights[hIdx] = e.target.value;
                              const updated = cvData.experience.map((item) =>
                                item.id === exp.id ? { ...item, highlights: newHighlights } : item
                              );
                              onChange({ ...cvData, experience: updated });
                            }}
                            className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => triggerAI('experience_highlight', hl, exp.id, hIdx)}
                            title="Improve with AI"
                            className="p-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORGANIZATIONS */}
        {activeTab === 'organizations' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center mb-1">
              <div>
                <h3 className="text-base font-bold text-slate-900">Student Organizations & Leadership</h3>
                <p className="text-xs text-slate-500">OSIS, BEM, clubs, extracurriculars, and community leadership.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newOrg = {
                    id: `org-${Date.now()}`,
                    organization: 'Student Organization / Club',
                    role: 'Active Member / Committee',
                    period: '2024 - Present',
                    highlights: ['Organized school events and coordinated activities.'],
                  };
                  onChange({ ...cvData, organizations: [...cvData.organizations, newOrg] });
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Organization</span>
              </button>
            </div>

            <div className="space-y-3">
              {cvData.organizations.map((org) => (
                <div key={org.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600">{org.organization}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = cvData.organizations.filter((o) => o.id !== org.id);
                        onChange({ ...cvData, organizations: updated });
                      }}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={org.role}
                      placeholder="Role (e.g. Head of Division)"
                      onChange={(e) => {
                        const updated = cvData.organizations.map((o) =>
                          o.id === org.id ? { ...o, role: e.target.value } : o
                        );
                        onChange({ ...cvData, organizations: updated });
                      }}
                      className="text-xs px-3 py-2 rounded-xl border border-slate-200"
                    />
                    <input
                      type="text"
                      value={org.period}
                      placeholder="Period (e.g. 2023 - 2024)"
                      onChange={(e) => {
                        const updated = cvData.organizations.map((o) =>
                          o.id === org.id ? { ...o, period: e.target.value } : o
                        );
                        onChange({ ...cvData, organizations: updated });
                      }}
                      className="text-xs px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS */}
        {activeTab === 'skills' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center mb-1">
              <div>
                <h3 className="text-base font-bold text-slate-900">Skills & Competencies</h3>
                <p className="text-xs text-slate-500">Group your abilities into technical, tools, and soft skills.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newCat = {
                    category: 'New Category',
                    skills: ['Skill 1', 'Skill 2'],
                  };
                  onChange({ ...cvData, skills: [...cvData.skills, newCat] });
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="space-y-3">
              {cvData.skills.map((cat, cIdx) => (
                <div key={cIdx} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={cat.category}
                      onChange={(e) => {
                        const updated = [...cvData.skills];
                        updated[cIdx].category = e.target.value;
                        onChange({ ...cvData, skills: updated });
                      }}
                      className="text-xs font-bold text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = cvData.skills.filter((_, i) => i !== cIdx);
                        onChange({ ...cvData, skills: updated });
                      }}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={cat.skills.join(', ')}
                    onChange={(e) => {
                      const updated = [...cvData.skills];
                      updated[cIdx].skills = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      onChange({ ...cvData, skills: updated });
                    }}
                    placeholder="e.g. Next.js, React, Tailwind CSS"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATIONS */}
        {activeTab === 'certifications' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center mb-1">
              <div>
                <h3 className="text-base font-bold text-slate-900">Certificates & Courses</h3>
                <p className="text-xs text-slate-500">Dicoding, BNSP, Coursera, FreeCodeCamp, or school certificates.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newCert = {
                    id: `cert-${Date.now()}`,
                    name: 'Course Certificate Name',
                    issuer: 'Academy / Issuer',
                    issueDate: '2024',
                  };
                  onChange({ ...cvData, certifications: [...cvData.certifications, newCert] });
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Certificate</span>
              </button>
            </div>

            <div className="space-y-3">
              {cvData.certifications.map((cert) => (
                <div key={cert.id} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-3">
                  <input
                    type="text"
                    value={cert.name}
                    placeholder="Certificate Name"
                    onChange={(e) => {
                      const updated = cvData.certifications.map((c) =>
                        c.id === cert.id ? { ...c, name: e.target.value } : c
                      );
                      onChange({ ...cvData, certifications: updated });
                    }}
                    className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                  <input
                    type="text"
                    value={cert.issuer}
                    placeholder="Issuer"
                    onChange={(e) => {
                      const updated = cvData.certifications.map((c) =>
                        c.id === cert.id ? { ...c, issuer: e.target.value } : c
                      );
                      onChange({ ...cvData, certifications: updated });
                    }}
                    className="w-1/3 text-xs px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = cvData.certifications.filter((c) => c.id !== cert.id);
                      onChange({ ...cvData, certifications: updated });
                    }}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center mb-1">
              <div>
                <h3 className="text-base font-bold text-slate-900">Competitions & Achievements</h3>
                <p className="text-xs text-slate-500">LKS, Hackathons, Olympiads, and recognitions.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newAch = {
                    id: `ach-${Date.now()}`,
                    title: '1st Place / Finalist Award',
                    event: 'Competition Event',
                    year: '2024',
                  };
                  onChange({ ...cvData, achievements: [...cvData.achievements, newAch] });
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Achievement</span>
              </button>
            </div>

            <div className="space-y-3">
              {cvData.achievements.map((ach) => (
                <div key={ach.id} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-3">
                  <input
                    type="text"
                    value={ach.title}
                    placeholder="Award Title"
                    onChange={(e) => {
                      const updated = cvData.achievements.map((a) =>
                        a.id === ach.id ? { ...a, title: e.target.value } : a
                      );
                      onChange({ ...cvData, achievements: updated });
                    }}
                    className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                  <input
                    type="text"
                    value={ach.event}
                    placeholder="Event"
                    onChange={(e) => {
                      const updated = cvData.achievements.map((a) =>
                        a.id === ach.id ? { ...a, event: e.target.value } : a
                      );
                      onChange({ ...cvData, achievements: updated });
                    }}
                    className="w-1/3 text-xs px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = cvData.achievements.filter((a) => a.id !== ach.id);
                      onChange({ ...cvData, achievements: updated });
                    }}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LANGUAGES */}
        {activeTab === 'languages' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center mb-1">
              <div>
                <h3 className="text-base font-bold text-slate-900">Languages</h3>
                <p className="text-xs text-slate-500">Spoken and written language proficiency.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newLang = {
                    id: `lang-${Date.now()}`,
                    name: 'English',
                    proficiency: 'Intermediate' as const,
                  };
                  onChange({ ...cvData, languages: [...cvData.languages, newLang] });
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Language</span>
              </button>
            </div>

            <div className="space-y-3">
              {cvData.languages.map((l) => (
                <div key={l.id} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-3">
                  <input
                    type="text"
                    value={l.name}
                    placeholder="Language"
                    onChange={(e) => {
                      const updated = cvData.languages.map((item) =>
                        item.id === l.id ? { ...item, name: e.target.value } : item
                      );
                      onChange({ ...cvData, languages: updated });
                    }}
                    className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                  <select
                    value={l.proficiency}
                    onChange={(e) => {
                      const updated = cvData.languages.map((item) =>
                        item.id === l.id ? { ...item, proficiency: e.target.value as any } : item
                      );
                      onChange({ ...cvData, languages: updated });
                    }}
                    className="w-1/3 text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = cvData.languages.filter((item) => item.id !== l.id);
                      onChange({ ...cvData, languages: updated });
                    }}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onApply={handleApplyAI}
        initialText={aiTargetField.initialText}
        defaultAction={aiTargetField.section === 'summary' ? 'summary' : 'improve'}
      />
    </div>
  );
};
