'use client';

import React from 'react';
import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/SocialIcons';

interface TemplateProps {
  data: CVData;
  accentColor?: string;
}

export const MinimalistTemplate: React.FC<TemplateProps> = ({ data, accentColor = '#6685FF' }) => {
  const { personalInfo, summary, education, experience, organizations, projects, skills, certifications, achievements, languages } = data;

  return (
    <div className="w-full bg-white text-slate-800 p-8 sm:p-10 font-sans leading-relaxed text-sm">
      {/* Header */}
      <header className="border-b pb-6 mb-6" style={{ borderColor: `${accentColor}33` }}>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">{personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-lg font-medium mb-3" style={{ color: accentColor }}>
          {personalInfo.jobTitle || 'Target Profession'}
        </p>

        {/* Contact Links */}
        <div className="flex flex-wrap gap-y-1.5 gap-x-4 text-xs text-slate-600">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-1">
              <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>{personalInfo.github}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <LinkedinIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-xs uppercase font-bold tracking-wider mb-2 text-slate-400">About Me</h2>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Main Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Experience, Projects, Organizations */}
        <div className="md:col-span-2 space-y-6">
          {/* Work / Internship Experience */}
          {experience && experience.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-bold tracking-wider mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                <span>Work & Internship Experience</span>
              </h2>
              <div className="space-y-4">
                {experience.map((item) => (
                  <div key={item.id} className="relative pl-3 border-l-2" style={{ borderColor: `${accentColor}40` }}>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">{item.position}</h3>
                      <span className="text-[11px] text-slate-400">
                        {item.startDate} – {item.current ? 'Present' : item.endDate}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-600 mb-1.5">{item.company} • {item.location}</div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                      {item.highlights.map((h, i) => (
                        <li key={i} className="leading-snug">{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Academic & Practical Projects */}
          {projects && projects.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-bold tracking-wider mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                <span>Projects & Portfolio</span>
              </h2>
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="relative pl-3 border-l-2" style={{ borderColor: `${accentColor}40` }}>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">{proj.title}</h3>
                      {proj.role && <span className="text-[11px] text-slate-500">{proj.role}</span>}
                    </div>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {proj.technologies.map((t, idx) => (
                          <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                      {proj.highlights.map((h, i) => (
                        <li key={i} className="leading-snug">{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Organization Experience */}
          {organizations && organizations.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-bold tracking-wider mb-3" style={{ color: accentColor }}>
                Leadership & Organizations
              </h2>
              <div className="space-y-3">
                {organizations.map((org) => (
                  <div key={org.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">{org.role}</h3>
                      <span className="text-[11px] text-slate-400">{org.period}</span>
                    </div>
                    <div className="text-xs text-slate-600 mb-1">{org.organization}</div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                      {org.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar Column (1 span): Education, Skills, Certs, Languages */}
        <div className="space-y-6">
          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-bold tracking-wider mb-3" style={{ color: accentColor }}>
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                    <h3 className="font-semibold text-slate-900 text-xs">{edu.institution}</h3>
                    <div className="text-xs text-slate-700">{edu.degree}</div>
                    <div className="text-[11px] text-slate-500">{edu.fieldOfStudy}</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {edu.startDate} – {edu.endDate} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                    </div>
                    {edu.honors && <div className="text-[10px] text-emerald-600 mt-0.5 font-medium">{edu.honors}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-bold tracking-wider mb-3" style={{ color: accentColor }}>
                Skills & Tools
              </h2>
              <div className="space-y-2.5">
                {skills.map((cat, idx) => (
                  <div key={idx}>
                    <div className="text-[11px] font-semibold text-slate-700 mb-1">{cat.category}</div>
                    <div className="flex flex-wrap gap-1">
                      {cat.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[11px] px-2 py-0.5 rounded-md font-medium text-slate-700"
                          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-bold tracking-wider mb-3" style={{ color: accentColor }}>
                Certifications
              </h2>
              <div className="space-y-2">
                {certifications.map((c) => (
                  <div key={c.id} className="text-xs">
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    <div className="text-[11px] text-slate-500">{c.issuer} • {c.issueDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-bold tracking-wider mb-3" style={{ color: accentColor }}>
                Achievements
              </h2>
              <div className="space-y-2">
                {achievements.map((ach) => (
                  <div key={ach.id} className="text-xs">
                    <div className="font-semibold text-slate-900">{ach.title}</div>
                    <div className="text-[11px] text-slate-500">{ach.event} ({ach.year})</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-bold tracking-wider mb-2" style={{ color: accentColor }}>
                Languages
              </h2>
              <div className="space-y-1 text-xs">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span className="font-medium text-slate-800">{l.name}</span>
                    <span className="text-slate-500 text-[11px]">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
