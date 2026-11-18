export interface StudentExperienceInput {
  type: 'school_project' | 'organization' | 'extracurricular' | 'competition' | 'volunteer' | 'internship';
  title: string;
  role?: string;
  rawDescription: string;
  toolsUsed?: string;
}

export interface TransformedResult {
  title: string;
  role: string;
  highlights: string[];
  inferredSkills: string[];
}

export function transformStudentExperience(input: StudentExperienceInput): TransformedResult {
  const text = input.rawDescription.trim();
  const tools = input.toolsUsed ? input.toolsUsed.split(',').map((s) => s.trim()) : [];
  const lowerText = text.toLowerCase();

  const highlights: string[] = [];
  const inferredSkills: string[] = [...tools];

  if (input.type === 'school_project') {
    // Web / App
    if (lowerText.includes('web') || lowerText.includes('website') || lowerText.includes('html') || lowerText.includes('react') || lowerText.includes('php')) {
      const techList = tools.length > 0 ? tools.join(', ') : 'modern web technologies (HTML, CSS, JavaScript)';
      highlights.push(`Engineered a responsive web application utilizing ${techList}.`);
      highlights.push('Implemented modular component layouts and validated input forms for enhanced user accessibility.');
      highlights.push('Applied clean code principles and version control throughout the project lifecycle.');
      inferredSkills.push('Web Development', 'Responsive Design', 'Frontend Architecture');
    } else if (lowerText.includes('game') || lowerText.includes('unity') || lowerText.includes('godot')) {
      highlights.push(`Developed 2D/3D gameplay mechanics and user interaction flows using ${tools.length > 0 ? tools.join(', ') : 'game engine tools'}.`);
      highlights.push('Implemented player physics, asset animations, and collision detection systems.');
      highlights.push('Conducted iterative playtesting and bug resolution to ensure smooth 60 FPS performance.');
      inferredSkills.push('Game Design', 'Logic Scripting', 'Asset Optimization');
    } else if (lowerText.includes('database') || lowerText.includes('sql') || lowerText.includes('crud')) {
      highlights.push(`Designed relational database schemas with normalized tables in ${tools.length > 0 ? tools.join(', ') : 'SQL'}.`);
      highlights.push('Constructed reliable CRUD backend endpoints facilitating secure data storage and querying.');
      highlights.push('Executed performance indexing reducing repetitive database query bottlenecks.');
      inferredSkills.push('Database Management', 'SQL Schema Design', 'Data Normalization');
    } else {
      highlights.push(`Developed ${input.title || 'practical academic project'} adhering to designated course specifications.`);
      highlights.push(`Utilized ${tools.length > 0 ? tools.join(', ') : 'core discipline frameworks'} to construct functional project deliverables.`);
      highlights.push('Collaborated with teammates and presented functional project demonstrations to academic instructors.');
      inferredSkills.push('Project Planning', 'Technical Execution', 'Documentation');
    }
  } else if (input.type === 'organization' || input.type === 'extracurricular') {
    if (lowerText.includes('osis') || lowerText.includes('bem') || lowerText.includes('mpk') || lowerText.includes('ketua') || lowerText.includes('head')) {
      highlights.push(`Coordinated committee initiatives and represented student interests across cross-functional programs.`);
      highlights.push('Facilitated structured weekly agendas and aligned member tasks to deliver successful school events.');
      highlights.push('Managed communication channels between student bodies, faculty advisors, and external sponsors.');
      inferredSkills.push('Leadership', 'Event Planning', 'Public Communication', 'Conflict Resolution');
    } else {
      highlights.push(`Active contributor to ${input.title || 'student organization'} activities and scheduled community events.`);
      highlights.push('Assisted in organizing operational logistics and documentation for extracurricular programs.');
      highlights.push('Fostered collaborative team spirit and contributed ideas during strategy planning sessions.');
      inferredSkills.push('Teamwork', 'Operational Logistics', 'Time Management');
    }
  } else if (input.type === 'competition') {
    highlights.push(`Represented institution in ${input.title || 'technical competition'} under rigorous time constraints.`);
    highlights.push('Synthesized creative problem-solving techniques to produce deliverable competition solutions.');
    highlights.push('Demonstrated technical agility and resilience under evaluation by industry adjudicators.');
    inferredSkills.push('Competitive Drive', 'Problem Solving Under Pressure', 'Rapid Prototyping');
  } else {
    // Default internship or volunteer
    highlights.push(`Executed daily tasks with precision and adhered strictly to professional operational guidelines.`);
    highlights.push('Collaborated with cross-functional team members to support ongoing organizational goals.');
    highlights.push('Proactively identified opportunities to streamline documentation and routine workflows.');
    inferredSkills.push('Professional Communication', 'Workplace Adaptability', 'Detail Oriented');
  }

  // Deduplicate skills
  const cleanSkills = Array.from(new Set(inferredSkills.filter(Boolean)));

  return {
    title: input.title || 'Academic Project',
    role: input.role || (input.type === 'school_project' ? 'Project Creator' : 'Active Member'),
    highlights,
    inferredSkills: cleanSkills,
  };
}

export function generateProfessionalSummary(role: string, studentLevel: string, skills: string[]): string {
  const skillsStr = skills.slice(0, 4).join(', ');
  if (studentLevel.toLowerCase().includes('smk') || studentLevel.toLowerCase().includes('vocational')) {
    return `Motivated and detail-oriented Vocational High School (SMK) graduate specializing in ${role}. Possesses practical hands-on experience in ${skillsStr || 'technical development'}, built through structured school projects and collaborative student initiatives. Eager to contribute foundational skills and continuous curiosity to an internship or entry-level team.`;
  }
  return `Energetic and driven ${studentLevel || 'University Student'} pursuing opportunities in ${role}. Equipped with proven competencies in ${skillsStr || 'modern technologies'} demonstrated through practical coursework, student organization leadership, and project execution. Committed to delivering high-quality contributions while rapidly acquiring industry best practices.`;
}

export function rewriteBulletPoint(bullet: string, style: 'professional' | 'grammar' | 'ats' | 'concise'): string {
  const trimmed = bullet.trim();
  if (!trimmed) return bullet;

  // Capitalize and ensure it ends with period
  let result = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  if (!result.endsWith('.')) result += '.';

  // Ensure starts with active verb
  const firstWord = result.split(' ')[0].toLowerCase();
  const verbMap: Record<string, string> = {
    'i': 'Successfully spearheaded',
    'made': 'Engineered and developed',
    'helped': 'Collaborated with team members to execute',
    'did': 'Executed and delivered',
    'worked': 'Contributed to cross-functional initiatives involving',
    'built': 'Architected and implemented',
    'learned': 'Mastered and applied core principles of',
  };

  if (verbMap[firstWord]) {
    const rest = result.substring(firstWord.length).trim();
    result = `${verbMap[firstWord]} ${rest}`;
  }

  return result;
}
