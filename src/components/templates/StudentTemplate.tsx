'use client';

import React from 'react';
import { CVData } from '@/types/cv';
import { GraduationCap, FolderGit2, Users, Trophy, Award, Mail, Phone, MapPin } from 'lucide-react';
import { GithubIcon } from '@/components/icons/SocialIcons';

interface TemplateProps {
  data: CVData;
  accentColor?: string;
}

export const StudentTemplate: React.FC<TemplateProps> = ({ data, accentColor = '#6685FF' }) => {
  const { personalInfo, summary, education, experience, organizations, projects, skills, certifications, achievements, languages } = data;

  return (
    <div className="w-full bg-white text-slate-800 p-8 sm:p-10 font-sans leading-normal text-xs sm:text-sm">
      {/* Student Banner Header */}
      <div className="border-b-2 pb-5 mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4" style={{ borderColor: accentColor }}>
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-1" style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student & Graduate Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {personalInfo.fullName}
          </h1>
          <p className="text-sm font-semibold mt-0.5" style={{ color: accentColor }}>
            {personalInfo.jobTitle || 'Aspiring Professional'}
          </p>
        </div>

        <div className="flex flex-col text-right text-xs text-slate-600 space-y-1">
          {personalInfo.email && (
            <div className="flex items-center justify-end gap-1.5">
              <span>{personalInfo.email}</span>
              <Mail className="w-3 h-3 text-slate-400" />
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center justify-end gap-1.5">
              <span>{personalInfo.phone}</span>
              <Phone className="w-3 h-3 text-slate-400" />
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center justify-end gap-1.5">
              <span>{personalInfo.location}</span>
              <MapPin className="w-3 h-3 text-slate-400" />
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center justify-end gap-1.5">
              <span>{personalInfo.github}</span>
              <GithubIcon className="w-3 h-3 text-slate-400" />
            </div>
          )}
        </div>
      </div>

      {/* Objective / Summary */}
      {summary && (
        <section className="mb-5 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
          <h2 className="text-xs uppercase font-bold tracking-wider mb-1 text-slate-500">
            Career Objective & Profile
          </h2>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Education (Placed First for Students!) */}
      {education && education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs uppercase font-bold tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: accentColor }}>
            <GraduationCap className="w-4 h-4" />
            <span>Academic Background</span>
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="relative pl-3 border-l-2" style={{ borderColor: accentColor }}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{edu.institution}</h3>
                  <span className="text-[11px] text-slate-500 font-medium">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="text-xs font-semibold text-slate-700">{edu.degree} — {edu.fieldOfStudy}</div>
                {edu.gpa && <div className="text-[11px] text-slate-600 font-medium">Cumulative Score / GPA: {edu.gpa}</div>}
                {edu.honors && <div className="text-[11px] text-emerald-600 font-medium">Distinction: {edu.honors}</div>}
                {edu.relevantCourses && (
                  <div className="text-[11px] text-slate-500 mt-1">
                    <span className="font-semibold text-slate-700">Relevant Coursework:</span> {edu.relevantCourses}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Academic & Practical Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs uppercase font-bold tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: accentColor }}>
            <FolderGit2 className="w-4 h-4" />
            <span>School Projects & Practical Assignments</span>
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="p-3 rounded-lg border border-slate-100 bg-white">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{proj.title}</span>
                  {proj.role && <span className="text-[11px] font-medium text-slate-500">{proj.role}</span>}
                </div>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {proj.technologies.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-600">
                  {proj.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Organizational Experience & Extracurriculars */}
      {organizations && organizations.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs uppercase font-bold tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: accentColor }}>
            <Users className="w-4 h-4" />
            <span>Student Organization & Extracurricular Leadership</span>
          </h2>
          <div className="space-y-2.5">
            {organizations.map((org) => (
              <div key={org.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs">{org.role}</span>
                  <span className="text-[11px] text-slate-400">{org.period}</span>
                </div>
                <div className="text-xs text-slate-600 font-medium mb-1">{org.organization}</div>
                <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-600">
                  {org.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Internship if available */}
      {experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs uppercase font-bold tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: accentColor }}>
            <Award className="w-4 h-4" />
            <span>Internship (PKL/Magang) & Practical Experience</span>
          </h2>
          <div className="space-y-2.5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs">{exp.position}</span>
                  <span className="text-[11px] text-slate-400">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-xs text-slate-600 mb-1">{exp.company} • {exp.location}</div>
                <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-600">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Competencies */}
      {skills && skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs uppercase font-bold tracking-wider mb-2" style={{ color: accentColor }}>
            Competencies & Skills
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {skills.map((cat, i) => (
              <div key={i} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="font-bold text-slate-800 text-[11px] mb-1">{cat.category}</div>
                <div className="flex flex-wrap gap-1">
                  {cat.skills.map((s, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-white rounded border border-slate-200 text-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements & Competitions */}
      {achievements && achievements.length > 0 && (
        <section className="text-xs">
          <h2 className="text-xs uppercase font-bold tracking-wider mb-2 flex items-center gap-1" style={{ color: accentColor }}>
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Competitions & Accolades</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {achievements.map((ach) => (
              <div key={ach.id} className="text-slate-700">
                <span className="font-bold text-slate-900">{ach.title}</span>
                <span className="text-slate-500 text-[11px]"> ({ach.event}, {ach.year})</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
