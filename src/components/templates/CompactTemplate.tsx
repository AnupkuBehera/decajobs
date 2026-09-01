import type { ResumeContent } from "@/lib/gemini/client";

/**
 * CompactTemplate
 *
 * High-density layout specifically engineered to fit maximum experience
 * and achievements onto a single clean page without visual clutter.
 */
export default function CompactTemplate({ data }: { data: ResumeContent }) {
  const { personalInfo: p, professionalSummary, workExperience, education, skillCategories, certifications } = data;

  return (
    <div
      id="resume-print-area"
      className="bg-white text-neutral-900 max-w-[780px] mx-auto font-sans leading-snug print:max-w-none print:mx-0 print:shadow-none"
    >
      {/* ── Compact Header ── */}
      <header className="px-6 pt-6 pb-3 border-b-2 border-primary-800">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
          <div>
            <h1 className="text-xl font-black tracking-tight text-neutral-950">
              {p.fullName}
            </h1>
            <p className="text-xs font-semibold text-primary-800">
              {p.headline}
            </p>
          </div>
          <div className="text-[11px] text-neutral-600 flex flex-wrap gap-x-2.5 sm:text-right sm:justify-end">
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>· {p.phone}</span>}
            {p.location && <span>· {p.location}</span>}
          </div>
        </div>

        {/* Compact links row */}
        {(p.linkedinUrl || p.portfolioUrl) && (
          <div className="mt-1 flex gap-3 text-[11px] text-primary-700">
            {p.linkedinUrl && (
              <a href={p.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                LinkedIn: {p.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            )}
            {p.portfolioUrl && (
              <a href={p.portfolioUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Portfolio: {p.portfolioUrl.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            )}
          </div>
        )}
      </header>

      <div className="px-6 py-4 space-y-3.5 text-xs">
        {/* ── Professional Summary ── */}
        {professionalSummary && (
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-300 pb-0.5 mb-1.5">
              Professional Summary
            </h2>
            <p className="text-[11.5px] leading-relaxed text-neutral-700">
              {professionalSummary}
            </p>
          </section>
        )}

        {/* ── Work Experience ── */}
        {workExperience && workExperience.length > 0 && (
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-300 pb-0.5 mb-2">
              Work Experience
            </h2>
            <div className="space-y-3">
              {workExperience.map((exp, i) => (
                <div key={i} className="break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between">
                    <div>
                      <span className="font-bold text-neutral-950 text-[12px]">{exp.jobTitle}</span>
                      <span className="text-neutral-600 font-medium"> — {exp.company}</span>
                      {exp.location && <span className="text-[11px] text-neutral-500"> ({exp.location})</span>}
                    </div>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-1 space-y-0.5 pl-3.5">
                      {exp.highlights.map((bullet, bi) => (
                        <li key={bi} className="text-[11.5px] text-neutral-700 leading-normal list-disc">
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

        {/* ── Technical Skills ── */}
        {skillCategories && skillCategories.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-300 pb-0.5 mb-1.5">
              Skills & Core Competencies
            </h2>
            <div className="space-y-1 text-[11.5px]">
              {skillCategories.map((cat, i) => (
                <div key={i}>
                  <strong className="text-neutral-900">{cat.categoryName}: </strong>
                  <span className="text-neutral-700">{cat.skills.join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Education & Credentials ── */}
        {(education?.length > 0 || certifications?.length > 0) && (
          <section className="break-inside-avoid">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-300 pb-0.5 mb-1.5">
              Education & Certifications
            </h2>
            <div className="space-y-1 text-[11.5px] text-neutral-800">
              {education?.map((edu, i) => (
                <div key={i} className="flex justify-between">
                  <span><strong>{edu.degree}</strong>, {edu.institution}</span>
                  {edu.completionDate && <span className="text-neutral-500 font-mono text-[11px]">{edu.completionDate}</span>}
                </div>
              ))}
              {certifications?.map((cert, i) => (
                <div key={i} className="flex justify-between">
                  <span>{cert.name} — {cert.issuer}</span>
                  {cert.year && <span className="text-neutral-500 font-mono text-[11px]">{cert.year}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
