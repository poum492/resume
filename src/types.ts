export interface ContactInfo {
  name: string;
  title: string;
  targetPositions: string;
  email: string;
  phone: string;
  location: string;
  github: string;
}

export interface EducationItem {
  id: string;
  school: string;
  location: string;
  degree: string;
  major: string;
  gpa: string;
  gradDate: string;
  coursework: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  techStack: string; // Comma separated or string
  role: string; // e.g., "Lead Developer" or "Academic Project"
  githubLink?: string;
  liveLink?: string;
  bullets: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  location: string;
  role: string;
  dateRange: string;
  bullets: string[];
}

export interface TechnicalSkills {
  languages: string;
  frameworks: string;
  databasesAndTools: string;
  concepts: string;
}

export interface ResumeData {
  contact: ContactInfo;
  education: EducationItem[];
  skills: TechnicalSkills;
  projects: ProjectItem[];
  experience: ExperienceItem[];
  summary: string;
}

export type ResumeTheme = "serif" | "tech" | "modern";
