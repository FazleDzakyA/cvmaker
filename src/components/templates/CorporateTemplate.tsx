'use client';

import React from 'react';
import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  accentColor?: string;
}

export const CorporateTemplate: React.FC<TemplateProps> = ({ data, accentColor = '#243B80' }) => {
  const { personalInfo, summary, education, experience, organizations, projects, skills, certifications, achievements, languages } = data;

  return (
    <div className="w-full bg-white text-slate-900 p-8 sm:p-10 font-sans text-xs sm:text-sm">
      {/* Top Banner Accent Line */}
      <div className="h-2 w-full mb-6 rounded-t" style={{ backgroundColor: accentColor }} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 pb-5 mb-5" style={{ borderColor: accentColor }}>
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-normal uppercase" style={{ color: accentColor }}>
            {personalInfo.fullName}
          </h1>
          <p className="text-sm font-semibold tracking-wide text-slate-600 uppercase mt-0.5">
            {personalInfo.jobTitle}
          </p>
        </div>
        <div className="text-right text-[11px] text-slate-600 space-y-0.5 mt-3 md:mt-0">
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
          {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
        </div>
      </div>

      {/* Executive Summary */}
      {summary && (
        <section className="mb-5">
          <h2 className="text-xs uppercase font-serif font-bold tracking-wider pb-1 mb-2 border-b text-slate-800" style={{ borderColor: '#CBD5E1' }}>
            Executive Summary
          </h2>
          <p className="text-slate-700 text-xs leading-relaxed text-justify">{summary}</p>
        </section>
      )}

      {/* Experience & Practical Training */}
      {experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs uppercase font-serif font-bold tracking-wider pb-1 mb-3 border-b text-slate-800" style={{ borderColor: '#CBD5E1' }}>
            Professional & Internship Experience
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{exp.position}</span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-700 mb-1">
                  {exp.company} | <span className="font-normal text-slate-500">{exp.location}</span>
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-600">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs uppercase font-serif font-bold tracking-wider pb-1 mb-3 border-b text-slate-800" style={{ borderColor: '#CBD5E1' }}>
            Key Projects & Implementations
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs">{proj.title}</span>
                  {proj.technologies && (
                    <span className="text-[11px] text-slate-500 font-mono">[{proj.technologies.join(', ')}]</span>
                  )}
                </div>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-600 mt-1">
                  {proj.highlights.map((h, i) => (
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
        <section className="mb-5">
          <h2 className="text-xs uppercase font-serif font-bold tracking-wider pb-1 mb-2 border-b text-slate-800" style={{ borderColor: '#CBD5E1' }}>
            Education & Academic Credentials
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start text-xs">
                <div>
                  <div className="font-bold text-slate-900">{edu.institution}</div>
                  <div className="text-slate-700">{edu.degree} — {edu.fieldOfStudy}</div>
                  {edu.gpa && <div className="text-[11px] text-slate-500">Cumulative GPA: {edu.gpa}</div>}
                </div>
                <div className="text-right text-[11px] font-semibold text-slate-500">
                  {edu.startDate} – {edu.endDate}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Competencies */}
      {skills && skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs uppercase font-serif font-bold tracking-wider pb-1 mb-2 border-b text-slate-800" style={{ borderColor: '#CBD5E1' }}>
            Competencies & Technical Proficiencies
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {skills.map((cat, idx) => (
              <div key={idx}>
                <span className="font-bold text-slate-800">{cat.category}: </span>
                <span className="text-slate-600">{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Honors */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <section className="text-xs">
          <h2 className="text-xs uppercase font-serif font-bold tracking-wider pb-1 mb-2 border-b text-slate-800" style={{ borderColor: '#CBD5E1' }}>
            Certifications & Honors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {certifications.map((c) => (
              <div key={c.id}>
                <span className="font-semibold text-slate-900">• {c.name}</span>
                <span className="text-slate-500"> — {c.issuer} ({c.issueDate})</span>
              </div>
            ))}
            {achievements.map((a) => (
              <div key={a.id}>
                <span className="font-semibold text-slate-900">• {a.title}</span>
                <span className="text-slate-500"> — {a.event} ({a.year})</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
