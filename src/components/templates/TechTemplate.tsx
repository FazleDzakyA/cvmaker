'use client';

import React from 'react';
import { CVData } from '@/types/cv';
import { Code2, GitFork, Terminal, ExternalLink, Mail, Phone, MapPin, Globe } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  accentColor?: string;
}

export const TechTemplate: React.FC<TemplateProps> = ({ data, accentColor = '#2563EB' }) => {
  const { personalInfo, summary, education, experience, organizations, projects, skills, certifications, achievements, languages } = data;

  return (
    <div className="w-full bg-white text-slate-900 p-8 sm:p-10 font-sans text-xs sm:text-sm">
      {/* Tech Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-5" style={{ borderColor: `${accentColor}30` }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs px-2 py-0.5 rounded font-semibold" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
              $ dev --profile
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {personalInfo.fullName}
          </h1>
          <p className="text-sm font-semibold mt-0.5" style={{ color: accentColor }}>
            {personalInfo.jobTitle}
          </p>
        </div>

        <div className="text-right text-xs font-mono text-slate-600 space-y-1 mt-3 md:mt-0">
          {personalInfo.email && <div className="hover:text-blue-600">{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
          <div className="flex items-center justify-end gap-2 text-[11px] text-slate-500">
            {personalInfo.github && <span>gh/{personalInfo.github.replace('github.com/', '')}</span>}
            {personalInfo.website && <span>• {personalInfo.website}</span>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <section className="mb-5">
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed border-l-2 pl-3" style={{ borderColor: accentColor }}>
            {summary}
          </p>
        </section>
      )}

      {/* Tech Stack Matrix */}
      {skills && skills.length > 0 && (
        <section className="mb-5 bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-xs">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span>Technical Capabilities</span>
          </div>
          <div className="space-y-1.5">
            {skills.map((cat, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <span className="text-[11px] font-bold text-slate-700 sm:w-36 shrink-0">{cat.category}:</span>
                <div className="flex flex-wrap gap-1">
                  {cat.skills.map((s, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center gap-1.5 border-b pb-1 mb-3" style={{ borderColor: `${accentColor}30` }}>
            <Code2 className="w-4 h-4" style={{ color: accentColor }} />
            <h2 className="text-xs uppercase font-bold tracking-wider text-slate-900">Featured Technical Projects</h2>
          </div>
          <div className="space-y-3.5">
            {projects.map((proj) => (
              <div key={proj.id} className="relative pl-3 border-l-2" style={{ borderColor: `${accentColor}40` }}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{proj.title}</span>
                    {proj.role && <span className="text-[11px] text-slate-500 font-mono">({proj.role})</span>}
                  </div>
                  {proj.link && (
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      {proj.link}
                    </span>
                  )}
                </div>
                {proj.technologies && (
                  <div className="flex flex-wrap gap-1 my-1">
                    {proj.technologies.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-1.5 py-0.2 rounded" style={{ backgroundColor: `${accentColor}12`, color: accentColor }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-600">
                  {proj.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience / Internships */}
      {experience && experience.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center gap-1.5 border-b pb-1 mb-3" style={{ borderColor: `${accentColor}30` }}>
            <GitFork className="w-4 h-4" style={{ color: accentColor }} />
            <h2 className="text-xs uppercase font-bold tracking-wider text-slate-900">Engineering & Internship Experience</h2>
          </div>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{exp.position}</span>
                  <span className="font-mono text-[11px] text-slate-500">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-xs text-slate-600 font-medium mb-1">{exp.company} • {exp.location}</div>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-600">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-4">
          <div className="border-b pb-1 mb-2" style={{ borderColor: `${accentColor}30` }}>
            <h2 className="text-xs uppercase font-bold tracking-wider text-slate-900">Education</h2>
          </div>
          <div className="space-y-2 text-xs">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-slate-900">{edu.institution}</div>
                  <div className="text-slate-700">{edu.degree} — {edu.fieldOfStudy}</div>
                  {edu.gpa && <div className="text-[11px] text-slate-500">GPA: {edu.gpa}</div>}
                </div>
                <div className="font-mono text-[11px] text-slate-500">{edu.startDate} – {edu.endDate}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
