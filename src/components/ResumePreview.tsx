import React from "react";
import { ResumeData, ResumeTheme } from "../types";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  ExternalLink,
} from "lucide-react";

interface ResumePreviewProps {
  data: ResumeData;
  theme: ResumeTheme;
  id?: string;
}

export default function ResumePreview({
  data,
  theme,
  id = "resume-preview-sheet",
}: ResumePreviewProps) {
  const { contact, education, skills, projects, experience, summary } = data;

  // Render social links cleanly
  const renderLinks = () => {
    const links = [];
    if (contact.email) {
      links.push(
        <a
          key="email"
          href={`mailto:${contact.email}`}
          className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors"
        >
          <Mail className="w-3.5 h-3.5 print:w-3 print:h-3" />
          <span>{contact.email}</span>
        </a>,
      );
    }
    if (contact.phone) {
      links.push(
        <span key="phone" className="inline-flex items-center gap-1">
          <Phone className="w-3.5 h-3.5 print:w-3 print:h-3" />
          <span>{contact.phone}</span>
        </span>,
      );
    }
    if (contact.location) {
      links.push(
        <span key="loc" className="inline-flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 print:w-3 print:h-3" />
          <span>{contact.location}</span>
        </span>,
      );
    }
    if (contact.github) {
      const cleanGit = contact.github.replace(/https?:\/\//, "");
      links.push(
        <a
          key="github"
          href={`https://${cleanGit}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors"
        >
          <Github className="w-3.5 h-3.5 print:w-3 print:h-3" />
          <span>{cleanGit}</span>
        </a>,
      );
    }

    return (
      <div
        className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-gray-600 print:text-[10px] print:gap-x-3 print:gap-y-0.5 print:text-gray-700
        ${theme === "serif" ? "font-serif" : theme === "tech" ? "font-mono" : "font-sans"}
      `}
      >
        {links.reduce((acc: React.ReactNode[], curr, i) => {
          if (i === 0) return [curr];
          return [
            ...acc,
            <span
              key={`sep-${i}`}
              className="text-gray-300 print:text-gray-400"
            >
              |
            </span>,
            curr,
          ];
        }, [])}
      </div>
    );
  };

  // Theme-specific styles
  const styles = {
    container: {
      serif:
        "font-serif bg-white text-gray-900 leading-relaxed print:p-0 p-8 shadow-sm print:shadow-none border border-gray-100 print:border-none rounded-lg print:rounded-none max-w-[800px] mx-auto min-h-[1050px] print:min-h-0",
      tech: "font-sans bg-white text-slate-950 leading-normal print:p-0 p-8 shadow-sm print:shadow-none border border-slate-100 print:border-none rounded-lg print:rounded-none max-w-[800px] mx-auto min-h-[1050px] print:min-h-0",
      modern:
        "font-sans bg-white text-neutral-900 leading-normal print:p-0 p-8 shadow-sm print:shadow-none border border-neutral-100 print:border-none rounded-lg print:rounded-none max-w-[800px] mx-auto min-h-[1050px] print:min-h-0",
    }[theme],

    name: {
      serif:
        "font-serif text-3xl font-bold tracking-tight text-center text-gray-900 print:text-2xl",
      tech: "font-mono text-3xl font-bold tracking-tight uppercase text-slate-950 print:text-2xl text-center",
      modern:
        "font-display text-4xl font-extrabold tracking-tight text-neutral-900 print:text-2xl text-center",
    }[theme],

    title: {
      serif: "text-sm italic text-center text-gray-500 mt-1 print:text-xs",
      tech: "font-mono text-xs uppercase tracking-wider text-center text-blue-600 font-semibold mt-1 print:text-[10px]",
      modern:
        "text-sm text-center text-emerald-600 font-medium tracking-wide uppercase mt-1 print:text-[10px]",
    }[theme],

    targetPositions: {
      serif:
        "text-xs font-semibold tracking-wider text-center text-gray-700 mt-0.5 print:text-[10px]",
      tech: "font-mono text-[10px] uppercase tracking-widest text-center text-slate-800 font-semibold mt-0.5 print:text-[9px]",
      modern:
        "text-xs text-center text-neutral-600 font-semibold tracking-wider uppercase mt-0.5 print:text-[9.5px]",
    }[theme],

    sectionHeader: {
      serif:
        "font-serif text-base font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1 mb-3 mt-4 print:text-sm print:mb-2 print:mt-3",
      tech: "font-mono text-xs font-bold uppercase tracking-widest text-slate-950 border-b-2 border-slate-950 pb-0.5 mb-2.5 mt-4.5 print:text-[10px] print:mb-2 print:mt-3.5",
      modern:
        "font-display text-sm font-bold uppercase tracking-widest text-neutral-900 bg-neutral-50 px-2.5 py-1 rounded border-l-3 border-emerald-500 mb-3 mt-4.5 print:bg-white print:border-l print:px-0 print:py-0 print:mb-2 print:mt-3.5 print:text-xs",
    }[theme],

    itemTitle: {
      serif: "font-serif text-sm font-bold text-gray-900 print:text-xs",
      tech: "font-mono text-xs font-bold text-slate-950 print:text-[11px]",
      modern: "font-sans text-sm font-semibold text-neutral-900 print:text-xs",
    }[theme],

    itemSubtitle: {
      serif: "font-serif text-xs italic text-gray-600 print:text-[10px]",
      tech: "font-mono text-[11px] text-slate-600 print:text-[9.5px]",
      modern: "font-sans text-xs text-neutral-600 print:text-[10px]",
    }[theme],

    bulletText: {
      serif:
        "font-serif text-xs text-gray-800 leading-relaxed print:text-[10px]",
      tech: "font-sans text-xs text-slate-800 leading-normal print:text-[10px]",
      modern:
        "font-sans text-xs text-neutral-800 leading-normal print:text-[10px]",
    }[theme],

    tag: {
      serif:
        "text-[10px] font-mono text-gray-500 px-1 border border-gray-200 rounded",
      tech: "text-[10px] font-mono bg-slate-50 text-slate-700 px-1.5 py-0.5 border border-slate-200 rounded print:bg-white print:px-0 print:border-none",
      modern:
        "text-[10px] font-sans bg-emerald-50/50 text-emerald-700 font-medium px-2 py-0.5 rounded border border-emerald-100 print:bg-white print:px-0 print:border-none",
    }[theme],
  };

  return (
    <div id={id} className={styles.container}>
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-1.5 border-b border-gray-100 pb-4 print:pb-3">
        <h1 className={styles.name}>{contact.name || "Your Name"}</h1>
        {contact.title && <p className={styles.title}>{contact.title}</p>}
        {contact.targetPositions && (
          <p className={styles.targetPositions}>{contact.targetPositions}</p>
        )}
        <div className="mt-2 w-full">{renderLinks()}</div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mt-4 print:mt-3">
          <p
            className={`${styles.bulletText} leading-relaxed text-center italic text-gray-700 print:text-justify max-w-2xl mx-auto`}
          >
            {summary}
          </p>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mt-4 print:mt-3">
          <h2 className={styles.sectionHeader}>Education</h2>
          <div className="flex flex-col gap-3 print:gap-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex flex-col gap-1">
                <div className="flex justify-between items-baseline gap-4">
                  <div>
                    <span className={styles.itemTitle}>{edu.school}</span>
                    <span className="mx-1.5 text-gray-400 print:text-gray-400 text-xs">
                      |
                    </span>
                    <span className={`${styles.itemSubtitle} font-medium`}>
                      {edu.location}
                    </span>
                  </div>
                  <span
                    className={`${styles.itemSubtitle} font-semibold text-gray-800`}
                  >
                    {edu.gradDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline gap-4">
                  <div className="text-xs print:text-[10px] text-gray-800">
                    <span className="font-medium">
                      {edu.degree} in {edu.major}
                    </span>
                  </div>
                </div>
                {edu.gpa && (
                  <div className="text-xs print:text-[10px] text-gray-800">
                    <span>
                      GPA: <strong className="font-semibold">{edu.gpa}</strong>
                    </span>
                  </div>
                )}
                {edu.coursework && (
                  <div className="text-xs print:text-[9.5px] text-gray-600 mt-0.5">
                    <strong className="font-medium text-gray-800">
                      Relevant Coursework:
                    </strong>{" "}
                    {edu.coursework}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="mt-4 print:mt-3">
        <h2 className={styles.sectionHeader}>Technical Skills</h2>
        <div className="grid grid-cols-1 gap-1.5 print:gap-0.5 text-xs print:text-[10px]">
          {skills.languages && (
            <div className="flex gap-1.5">
              <span className="font-semibold text-gray-900 w-36 shrink-0 print:w-28">
                Languages:
              </span>
              <span className="text-gray-800">{skills.languages}</span>
            </div>
          )}
          {skills.frameworks && (
            <div className="flex gap-1.5">
              <span className="font-semibold text-gray-900 w-36 shrink-0 print:w-28">
                Frameworks:
              </span>
              <span className="text-gray-800">{skills.frameworks}</span>
            </div>
          )}
          {skills.databasesAndTools && (
            <div className="flex gap-1.5">
              <span className="font-semibold text-gray-900 w-36 shrink-0 print:w-28">
                Databases & Tools:
              </span>
              <span className="text-gray-800">{skills.databasesAndTools}</span>
            </div>
          )}
          {skills.concepts && (
            <div className="flex gap-1.5">
              <span className="font-semibold text-gray-900 w-36 shrink-0 print:w-28">
                Concepts / Methodologies:
              </span>
              <span className="text-gray-800">{skills.concepts}</span>
            </div>
          )}
        </div>
      </div>

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mt-4 print:mt-3">
          <h2 className={styles.sectionHeader}>Experience</h2>
          <div className="flex flex-col gap-4 print:gap-2.5">
            {experience.map((exp) => (
              <div key={exp.id} className="flex flex-col">
                <div className="flex justify-between items-baseline gap-4">
                  <div>
                    <span className={styles.itemTitle}>{exp.role}</span>
                    <span className="mx-1.5 text-gray-400 print:text-gray-400 text-xs">
                      |
                    </span>
                    <span className="text-xs print:text-[10px] font-semibold text-gray-800">
                      {exp.company}
                    </span>
                    <span className="mx-1.5 text-gray-300 print:text-gray-400 text-xs">
                      |
                    </span>
                    <span className={styles.itemSubtitle}>{exp.location}</span>
                  </div>
                  <span
                    className={`${styles.itemSubtitle} font-semibold text-gray-800`}
                  >
                    {exp.dateRange}
                  </span>
                </div>

                <ul className="list-disc pl-4 mt-1.5 print:mt-1 flex flex-col gap-1 print:gap-0.5">
                  {exp.bullets
                    .filter((b) => b.trim())
                    .map((bullet, idx) => (
                      <li key={idx} className={styles.bulletText}>
                        {bullet}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mt-4 print:mt-3">
          <h2 className={styles.sectionHeader}>Projects</h2>
          <div className="flex flex-col gap-4 print:gap-2.5">
            {projects.map((proj) => (
              <div key={proj.id} className="flex flex-col">
                <div className="flex justify-between items-baseline gap-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={styles.itemTitle}>{proj.title}</span>
                    {proj.role && (
                      <span className="text-[10px] text-gray-500 italic">
                        ({proj.role})
                      </span>
                    )}

                    {/* Project Links (Hidden in print if needed or rendered compact) */}
                    {(proj.githubLink || proj.liveLink) && (
                      <span className="inline-flex gap-2 text-[10px] text-blue-600 print:text-gray-600 ml-1">
                        {proj.githubLink && (
                          <span className="font-mono">
                            {proj.githubLink.replace(/https?:\/\//, "")}
                          </span>
                        )}
                        {proj.githubLink && proj.liveLink && <span>|</span>}
                        {proj.liveLink && (
                          <span className="font-mono">
                            {proj.liveLink.replace(/https?:\/\//, "")}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tech Tags */}
                {proj.techStack && (
                  <div className="flex flex-wrap gap-1 mt-1 print:mt-0.5">
                    <span className="text-[10px] font-semibold text-gray-800 mr-1 print:text-[9px]">
                      Tech Stack:
                    </span>
                    {proj.techStack.split(",").map((tech, idx) => (
                      <span key={idx} className={styles.tag}>
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <ul className="list-disc pl-4 mt-1.5 print:mt-1 flex flex-col gap-1 print:gap-0.5">
                  {proj.bullets
                    .filter((b) => b.trim())
                    .map((bullet, idx) => (
                      <li key={idx} className={styles.bulletText}>
                        {bullet}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leadership / Extracurriculars */}

    </div>
  );
}
