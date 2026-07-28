import type { ResumeContent } from "@/lib/gemini/client";

/**
 * ModernCleanTemplate
 *
 * A printable, ATS-friendly resume layout.
 * Uses `print:` Tailwind variants so only the resume renders when printed —
 * everything else on the page is hidden via `print:hidden`.
 *
 * Optimised for A4 / Letter paper via `window.print()`.
 */
export default function ModernCleanTemplate({ data }: { data: ResumeContent }) {
  const { personalInfo: p, professionalSummary, workExperience, education, skillCategories, certifications } = data;

  return (
    <div
      id="resume-print-area"
      className="bg-white text-neutral-900 max-w-[780px] mx-auto print:max-w-none print:mx-0 print:shadow-none"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {/* ── Header ── */}
      <header className="px-10 pt-10 pb-6 border-b-2 border-neutral-800 print:px-8 print:pt-8">
        <h1
          className="text-[28px] font-bold tracking-tight text-neutral-900 leading-tight"
          style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          {p.fullName}
        </h1>
        <p
          className="text-base font-semibold text-primary-700 mt-0.5"
          style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          {p.headline}
        </p>

        {/* Contact row */}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-neutral-600">
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>📞 {p.phone}</span>}
          {p.location && <span>📍 {p.location}</span>}
          {p.linkedinUrl && (
            <a
              href={p.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 underline"
            >
              LinkedIn
            </a>
          )}
          {p.portfolioUrl && (
            <a
              href={p.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 underline"
            >
              Portfolio
            </a>
          )}
        </div>
      </header>

      <div className="px-10 py-6 space-y-6 print:px-8 print:py-5 print:space-y-5">
        {/* ── Professional Summary ── */}
        {professionalSummary && (
          <Section title="Professional Summary">
            <p className="text-[13px] leading-relaxed text-neutral-700">
              {professionalSummary}
            </p>
          </Section>
        )}

        {/* ── Work Experience ── */}
        {workExperience.length > 0 && (
          <Section title="Experience">
            <div className="space-y-5">
              {workExperience.map((exp, i) => (
                <div key={i} className="break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <div>
                      <span className="text-[13.5px] font-bold text-neutral-900">
                        {exp.jobTitle}
                      </span>
                      <span className="text-[13px] text-neutral-600">
                        {" "}— {exp.company}
                        {exp.location ? `, ${exp.location}` : ""}
                      </span>
                    </div>
                    <span className="text-[11.5px] text-neutral-500 shrink-0">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  {exp.highlights.length > 0 && (
                    <ul className="mt-1.5 space-y-1 pl-4">
                      {exp.highlights.map((bullet, bi) => (
                        <li
                          key={bi}
                          className="text-[12.5px] text-neutral-700 leading-relaxed list-disc"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Skills ── */}
        {skillCategories.length > 0 && (
          <Section title="Skills">
            <div className="space-y-1.5 break-inside-avoid">
              {skillCategories.map((cat, i) => (
                <div key={i} className="text-[12.5px]">
                  <span className="font-semibold text-neutral-800">
                    {cat.categoryName}:{" "}
                  </span>
                  <span className="text-neutral-600">{cat.skills.join(" · ")}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Education ── */}
        {education.length > 0 && (
          <Section title="Education">
            <div className="space-y-2">
              {education.map((edu, i) => (
                <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-4 break-inside-avoid">
                  <div className="text-[12.5px]">
                    <span className="font-semibold text-neutral-900">{edu.degree}</span>
                    {edu.institution && (
                      <span className="text-neutral-600"> — {edu.institution}</span>
                    )}
                  </div>
                  {edu.completionDate && (
                    <span className="text-[11.5px] text-neutral-500 shrink-0">
                      {edu.completionDate}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Certifications ── */}
        {certifications.length > 0 && (
          <Section title="Certifications">
            <div className="space-y-1.5">
              {certifications.map((cert, i) => (
                <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-4 break-inside-avoid">
                  <div className="text-[12.5px]">
                    <span className="font-semibold text-neutral-900">{cert.name}</span>
                    {cert.issuer && (
                      <span className="text-neutral-600"> — {cert.issuer}</span>
                    )}
                  </div>
                  {cert.year && (
                    <span className="text-[11.5px] text-neutral-500 shrink-0">
                      {cert.year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

// ── Section helper ─────────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2
        className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500 mb-2 border-b border-neutral-200 pb-1"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
