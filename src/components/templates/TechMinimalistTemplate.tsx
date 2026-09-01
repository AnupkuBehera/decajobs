import type { ResumeContent } from "@/lib/gemini/client";

/**
 * TechMinimalistTemplate
 *
 * Designed for engineers, developers, and tech specialists.
 * Clean, modern sans-serif typography with accent heading bars
 * and monospace/pill skill tags. 100% ATS parseable.
 */
export default function TechMinimalistTemplate({ data }: { data: ResumeContent }) {
  const { personalInfo: p, professionalSummary, workExperience, education, skillCategories, certifications } = data;

  return (
    <div
      id="resume-print-area"
      className="bg-white text-neutral-900 max-w-[780px] mx-auto font-sans leading-normal print:max-w-none print:mx-0 print:shadow-none"
    >
      {/* ── Header ── */}
      <header className="px-8 pt-8 pb-5 border-b border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
              {p.fullName}
            </h1>
            <p className="text-sm font-medium text-primary-600 mt-0.5">
              {p.headline}
            </p>
          </div>
          <div className="text-xs text-neutral-500 flex flex-wrap gap-x-3 gap-y-1 sm:text-right sm:flex-col">
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>{p.phone}</span>}
            {p.location && <span>{p.location}</span>}
          </div>
        </div>

        {/* Links bar */}
        {(p.linkedinUrl || p.portfolioUrl) && (
          <div className="mt-2.5 flex items-center gap-4 text-xs font-medium text-neutral-600">
            {p.linkedinUrl && (
              <a href={p.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">
                🔗 {p.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            )}
            {p.portfolioUrl && (
              <a href={p.portfolioUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">
                🌐 {p.portfolioUrl.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            )}
          </div>
        )}
      </header>

      <div className="px-8 py-6 space-y-5">
        {/* ── Professional Summary ── */}
        {professionalSummary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-l-2 border-primary-600 pl-2 mb-2">
              Summary
            </h2>
            <p className="text-[12.5px] leading-relaxed text-neutral-700">
              {professionalSummary}
            </p>
          </section>
        )}

        {/* ── Work Experience ── */}
        {workExperience && workExperience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-l-2 border-primary-600 pl-2 mb-3">
              Work Experience
            </h2>
            <div className="space-y-4">
              {workExperience.map((exp, i) => (
                <div key={i} className="break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <span className="text-sm font-bold text-neutral-900">
                      {exp.jobTitle}{" "}
                      <span className="font-normal text-neutral-600">
                        @ {exp.company}
                      </span>
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  {exp.location && (
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      📍 {exp.location}
                    </p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-1.5 space-y-1 pl-4">
                      {exp.highlights.map((bullet, bi) => (
                        <li
                          key={bi}
                          className="text-[12px] text-neutral-700 leading-relaxed list-disc"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Skills ── */}
        {skillCategories && skillCategories.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-l-2 border-primary-600 pl-2 mb-2.5">
              Technical Competencies
            </h2>
            <div className="space-y-2 break-inside-avoid">
              {skillCategories.map((cat, i) => (
                <div key={i} className="text-xs">
                  <span className="font-semibold text-neutral-900 mr-2">
                    {cat.categoryName}:
                  </span>
                  <span className="text-neutral-700">
                    {cat.skills.join(" · ")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Education ── */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-l-2 border-primary-600 pl-2 mb-2.5">
              Education
            </h2>
            <div className="space-y-2 break-inside-avoid">
              {education.map((edu, i) => (
                <div key={i} className="flex flex-wrap items-baseline justify-between text-xs">
                  <div>
                    <span className="font-bold text-neutral-900">{edu.degree}</span>
                    <span className="text-neutral-600"> — {edu.institution}</span>
                  </div>
                  {edu.completionDate && (
                    <span className="text-neutral-500 font-mono">{edu.completionDate}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Certifications ── */}
        {certifications && certifications.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-l-2 border-primary-600 pl-2 mb-2">
              Certifications & Credentials
            </h2>
            <ul className="space-y-1 pl-4 text-xs text-neutral-700">
              {certifications.map((cert, i) => (
                <li key={i} className="list-disc">
                  <span className="font-semibold">{cert.name}</span>
                  {cert.issuer && <span> — {cert.issuer}</span>}
                  {cert.year && <span className="text-neutral-500"> ({cert.year})</span>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
