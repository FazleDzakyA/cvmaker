'use client';

import React from 'react';
import { CVData } from '@/types/cv';

interface TemplateProps {
  data: CVData;
  accentColor?: string;
}

export const ATSFriendlyTemplate: React.FC<TemplateProps> = ({ data, accentColor = '#10B981' }) => {
  const { personalInfo, summary, education, experience, organizations, projects, skills, certifications, achievements, languages } = data;

  return (
    <div className="w-full bg-white text-black p-8 sm:p-10 font-serif leading-normal text-xs sm:text-sm">
      {/* Header - Centered ATS Standard */}
      <div className="text-center pb-4 mb-4 border-b-2 border-black">
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide mb-1 text-black">
          {personalInfo.fullName}
        </h1>
        <p className="text-sm font-semibold mb-2 text-slate-800">{personalInfo.jobTitle}</p>
        <div className="text-xs text-slate-700 flex flex-wrap justify-center gap-x-2">
          {personalInfo.location && <span>{personalInfo.location} |</span>}
          {personalInfo.phone && <span>{personalInfo.phone} |</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.linkedin && <span>| {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>| {personalInfo.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed text-justify">{summary}</p>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 text-black">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex justify-between font-bold text-black">
                  <span>{edu.institution}</span>
                  <span>{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="flex justify-between italic text-slate-800">
                  <span>{edu.degree} in {edu.fieldOfStudy}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
                {edu.relevantCourses && (
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    <span className="font-semibold">Relevant Coursework:</span> {edu.relevantCourses}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 text-black">
            Experience & Internships
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between font-bold text-black">
                  <span>{exp.position}</span>
                  <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="italic text-slate-800 mb-1">{exp.company}, {exp.location}</div>
                <ul className="list-disc list-outside ml-5 space-y-0.5 text-slate-700">
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
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 text-black">
            Academic & Practical Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between font-bold text-black">
                  <span>{proj.title} {proj.role ? `| ${proj.role}` : ''}</span>
                  {proj.link && <span className="font-normal text-[11px] text-slate-600">{proj.link}</span>}
                </div>
                {proj.technologies && (
                  <div className="text-[11px] text-slate-700 italic">
                    Technologies: {proj.technologies.join(', ')}
                  </div>
                )}
                <ul className="list-disc list-outside ml-5 space-y-0.5 text-slate-700 mt-0.5">
                  {proj.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Leadership & Organizations */}
      {organizations && organizations.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 text-black">
            Leadership & Organizational Activities
          </h2>
          <div className="space-y-2">
            {organizations.map((org) => (
              <div key={org.id} className="text-xs">
                <div className="flex justify-between font-bold text-black">
                  <span>{org.role} – {org.organization}</span>
                  <span>{org.period}</span>
                </div>
                <ul className="list-disc list-outside ml-5 space-y-0.5 text-slate-700">
                  {org.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
            Skills & Competencies
          </h2>
          <div className="space-y-1 text-xs">
            {skills.map((cat, i) => (
              <div key={i}>
                <span className="font-bold text-black">{cat.category}: </span>
                <span className="text-slate-800">{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Honors & Certifications */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <section className="text-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
            Certifications & Honors
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-0.5 text-slate-700">
            {certifications.map((c) => (
              <li key={c.id}>
                <span className="font-semibold text-black">{c.name}</span> – {c.issuer} ({c.issueDate})
              </li>
            ))}
            {achievements.map((a) => (
              <li key={a.id}>
                <span className="font-semibold text-black">{a.title}</span> – {a.event} ({a.year})
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
