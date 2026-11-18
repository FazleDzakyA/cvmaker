'use client';

import React from 'react';
import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Globe, Award, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/icons/SocialIcons';

interface TemplateProps {
  data: CVData;
  accentColor?: string;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ data, accentColor = '#8B5CF6' }) => {
  const { personalInfo, summary, education, experience, organizations, projects, skills, certifications, achievements, languages } = data;

  return (
    <div className="w-full bg-white text-slate-800 font-sans grid grid-cols-12 min-h-full">
      {/* Left Colored Sidebar (4 cols) */}
      <aside
        className="col-span-4 p-6 sm:p-7 text-white flex flex-col justify-between"
        style={{ backgroundColor: accentColor }}
      >
        <div>
          {/* Avatar or Initial Badge */}
          <div className="mb-5 flex flex-col items-center text-center">
            {personalInfo.photoUrl ? (
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-white/60 shadow-lg mb-3"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-2xl font-bold mb-3">
                {personalInfo.fullName.charAt(0) || 'C'}
              </div>
            )}
            <h1 className="text-xl font-bold tracking-tight text-white">{personalInfo.fullName}</h1>
            <p className="text-xs text-white/80 font-medium mt-0.5">{personalInfo.jobTitle}</p>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 text-xs text-white/90 border-t border-white/20 pt-4 mb-6">
            {personalInfo.email && (
              <div className="flex items-center gap-2 break-all">
                <Mail className="w-3.5 h-3.5 text-white/70 shrink-0" />
                <span className="text-[11px]">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-white/70 shrink-0" />
                <span className="text-[11px]">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-white/70 shrink-0" />
                <span className="text-[11px]">{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-2 break-all">
                <GithubIcon className="w-3.5 h-3.5 text-white/70 shrink-0" />
                <span className="text-[11px]">{personalInfo.github}</span>
              </div>
            )}
          </div>

          {/* Education in Sidebar */}
          {education && education.length > 0 && (
            <div className="mb-6 border-t border-white/20 pt-4">
              <h2 className="text-xs uppercase tracking-wider font-bold text-white mb-2.5">Education</h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                    <div className="font-semibold text-white">{edu.institution}</div>
                    <div className="text-white/80 text-[11px]">{edu.degree}</div>
                    <div className="text-[10px] text-white/60">{edu.fieldOfStudy}</div>
                    <div className="text-[10px] text-white/50 mt-1">{edu.startDate} – {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills in Sidebar */}
          {skills && skills.length > 0 && (
            <div className="border-t border-white/20 pt-4 mb-6">
              <h2 className="text-xs uppercase tracking-wider font-bold text-white mb-2">Core Skills</h2>
              <div className="space-y-2">
                {skills.map((cat, i) => (
                  <div key={i}>
                    <div className="text-[10px] text-white/70 font-semibold mb-1">{cat.category}</div>
                    <div className="flex flex-wrap gap-1">
                      {cat.skills.map((s, idx) => (
                        <span key={idx} className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Languages in Sidebar */}
        {languages && languages.length > 0 && (
          <div className="border-t border-white/20 pt-3 text-xs text-white/80">
            <div className="font-semibold text-[11px] text-white mb-1">Languages:</div>
            <div className="flex flex-wrap gap-2 text-[10px]">
              {languages.map((l) => (
                <span key={l.id}>{l.name} ({l.proficiency})</span>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area (8 cols) */}
      <main className="col-span-8 p-6 sm:p-8 space-y-6">
        {/* Profile Intro */}
        {summary && (
          <section className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
            <h2 className="text-xs uppercase font-bold tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: accentColor }}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Creative Profile</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Featured Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-xs uppercase font-bold tracking-wider mb-3 pb-1 border-b text-slate-900">
              Featured Projects & Portfolio
            </h2>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{proj.title}</h3>
                    {proj.role && <span className="text-[11px] text-slate-500">{proj.role}</span>}
                  </div>
                  {proj.technologies && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {proj.technologies.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                    {proj.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Practical Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs uppercase font-bold tracking-wider mb-3 pb-1 border-b text-slate-900">
              Work & Practical Experience
            </h2>
            <div className="space-y-3.5">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">{exp.position}</h3>
                    <span className="text-[11px] text-slate-400">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-xs text-slate-500 mb-1">{exp.company} • {exp.location}</div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements & Organizations */}
        {(achievements.length > 0 || organizations.length > 0) && (
          <section>
            <h2 className="text-xs uppercase font-bold tracking-wider mb-2.5 pb-1 border-b text-slate-900">
              Recognitions & Leadership
            </h2>
            <div className="space-y-2 text-xs">
              {achievements.map((ach) => (
                <div key={ach.id} className="flex items-start gap-2 text-slate-700">
                  <Award className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">{ach.title}</span> — {ach.event} ({ach.year})
                    {ach.description && <p className="text-[11px] text-slate-500 mt-0.5">{ach.description}</p>}
                  </div>
                </div>
              ))}
              {organizations.map((org) => (
                <div key={org.id} className="text-slate-700 pl-5">
                  <span className="font-semibold text-slate-900">{org.role}</span> at {org.organization} ({org.period})
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
