import type { ResumeContent } from "@/lib/gemini/client";

/**
 * ExecutiveTemplate
 *
 * Classic, authoritative executive serif layout.
 * Centered header, refined dividers, ideal for leadership,
 * management, finance, consulting, and corporate roles.
 */
export default function ExecutiveTemplate({ data }: { data: ResumeContent }) {
  const { personalInfo: p, professionalSummary, workExperience, education, skillCategories, certifications } = data;

  return (
    <div
      id="resume-print-area"
      className="bg-white text-neutral-900 max-w-[780px] mx-auto leading-relaxed print:max-w-none print:mx-0 print:shadow-none"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {/* ── Centered Header ── */}
      <header className="px-10 pt-10 pb-6 text-center border-b-2 border-neutral-900">
        <h1 className="text-2xl font-bold tracking-normal uppercase text-neutral-950">
          {p.fullName}
        </h1>
        <p className="text-sm font-semibold italic text-neutral-700 mt-1">
          {p.headline}
        </p>

        {/* Contact info row */}
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-2 text-xs text-neutral-600">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>• {p.phone}</span>}
          {p.location && <span>• {p.location}</span>}
          {p.linkedinUrl && (
            <span>
              •{" "}
              <a href={p.linkedinUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-950">
                LinkedIn
              </a>
            </span>
          )}
          {p.portfolioUrl && (
            <span>
              •{" "}
              <a href={p.portfolioUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-950">
                Portfolio
              </a>
            </span>
          )}
        </div>
      </header>

      <div className="px-10 py-6 space-y-6">
        {/* ── Executive Summary ── */}
        {professionalSummary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-center text-neutral-900 border-b border-neutral-300 pb-1 mb-2.5">
              Executive Summary
            </h2>
            <p className="text-[13px] leading-relaxed text-neutral-800 text-justify">
              {professionalSummary}
            </p>
          </section>
        )}

        {/* ── Professional Experience ── */}
        {workExperience && workExperience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-center text-neutral-900 border-b border-neutral-300 pb-1 mb-3.5">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {workExperience.map((exp, i) => (
                <div key={i} className="break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between">
                    <div>
                      <span className="text-[13.5px] font-bold text-neutral-950">
                        {exp.company}
                      </span>
                      {exp.location && (
                        <span className="text-xs italic text-neutral-600"> — {exp.location}</span>
                      )}
                    </div>
                    <span className="text-xs italic text-neutral-600">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-neutral-800 mt-0.5">
                    {exp.jobTitle}
                  </p>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-1.5 space-y-1 pl-4">
                      {exp.highlights.map((bullet, bi) => (
                        <li key={bi} className="text-[12.5px] text-neutral-800 list-disc leading-relaxed">
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

        {/* ── Core Competencies ── */}
        {skillCategories && skillCategories.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-widest text-center text-neutral-900 border-b border-neutral-300 pb-1 mb-2.5">
              Core Competencies & Expertise
            </h2>
            <div className="space-y-1 text-xs text-neutral-800">
              {skillCategories.map((cat, i) => (
                <div key={i}>
                  <strong className="text-neutral-950">{cat.categoryName}: </strong>
                  <span>{cat.skills.join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Education & Credentials ── */}
        {(education?.length > 0 || certifications?.length > 0) && (
          <section className="break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-widest text-center text-neutral-900 border-b border-neutral-300 pb-1 mb-2.5">
              Education & Certifications
            </h2>
            <div className="space-y-2 text-xs text-neutral-800">
              {education?.map((edu, i) => (
                <div key={i} className="flex justify-between">
                  <div>
                    <span className="font-bold text-neutral-950">{edu.degree}</span>
                    <span className="italic text-neutral-600">, {edu.institution}</span>
                  </div>
                  {edu.completionDate && <span className="italic text-neutral-600">{edu.completionDate}</span>}
                </div>
              ))}
              {certifications?.map((cert, i) => (
                <div key={i} className="flex justify-between">
                  <span><strong>{cert.name}</strong> — {cert.issuer}</span>
                  {cert.year && <span className="italic text-neutral-600">{cert.year}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
