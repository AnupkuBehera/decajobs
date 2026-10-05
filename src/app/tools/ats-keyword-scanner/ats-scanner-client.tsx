"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

interface KeywordMatch {
  term: string;
  found: boolean;
  frequencyInJd: number;
  category: "hard-skill" | "soft-skill" | "tool-platform";
}

const COMMON_SKILLS_DICTIONARY: { [key: string]: { category: "hard-skill" | "soft-skill" | "tool-platform"; aliases?: string[] } } = {
  // Programming & Frameworks
  react: { category: "hard-skill", aliases: ["react.js", "reactjs"] },
  typescript: { category: "hard-skill", aliases: ["ts"] },
  javascript: { category: "hard-skill", aliases: ["js", "es6"] },
  python: { category: "hard-skill" },
  java: { category: "hard-skill" },
  golang: { category: "hard-skill", aliases: ["go"] },
  "node.js": { category: "hard-skill", aliases: ["node", "nodejs"] },
  "next.js": { category: "hard-skill", aliases: ["nextjs"] },
  vue: { category: "hard-skill", aliases: ["vue.js", "vuejs"] },
  angular: { category: "hard-skill" },
  django: { category: "hard-skill" },
  fastapi: { category: "hard-skill" },
  spring: { category: "hard-skill", aliases: ["spring boot"] },
  
  // Data & Cloud & DevOps
  sql: { category: "hard-skill" },
  postgresql: { category: "hard-skill", aliases: ["postgres"] },
  mysql: { category: "hard-skill" },
  mongodb: { category: "hard-skill" },
  redis: { category: "hard-skill" },
  aws: { category: "tool-platform", aliases: ["amazon web services"] },
  azure: { category: "tool-platform" },
  gcp: { category: "tool-platform", aliases: ["google cloud"] },
  docker: { category: "tool-platform" },
  kubernetes: { category: "tool-platform", aliases: ["k8s"] },
  terraform: { category: "tool-platform" },
  "ci/cd": { category: "tool-platform", aliases: ["cicd", "github actions", "gitlab ci", "jenkins"] },
  git: { category: "tool-platform", aliases: ["github", "gitlab"] },
  linux: { category: "tool-platform" },

  // Concepts & Soft Skills
  "microservices": { category: "hard-skill" },
  "system design": { category: "hard-skill", aliases: ["architecture"] },
  "rest api": { category: "hard-skill", aliases: ["rest", "restful"] },
  "graphql": { category: "hard-skill" },
  "unit testing": { category: "hard-skill", aliases: ["jest", "pytest", "mocha", "junit"] },
  "agile": { category: "soft-skill", aliases: ["scrum", "sprints"] },
  "cross-functional": { category: "soft-skill", aliases: ["cross functional"] },
  "leadership": { category: "soft-skill", aliases: ["mentoring", "team lead"] },
  "problem solving": { category: "soft-skill" },
  "communication": { category: "soft-skill" },
};

const SAMPLE_DATA = {
  jd: `We are looking for a Senior Full Stack Engineer to join our high-growth team.
Key Responsibilities:
- Build and scale user interfaces with React, Next.js, and TypeScript.
- Architect high-performance backend microservices using Node.js and PostgreSQL.
- Containerize applications using Docker and deploy to AWS Kubernetes (k8s) clusters.
- Collaborate with cross-functional product teams using Agile / Scrum methodologies.
- Implement comprehensive unit testing and CI/CD pipelines.

Requirements:
- 4+ years of software development experience with React, TypeScript, and Node.js.
- Strong knowledge of PostgreSQL, Redis caching, and REST API system design.
- Hands-on experience with Docker, AWS, and Git workflow.
- Excellent communication and problem solving skills.`,
  resume: `SENIOR SOFTWARE DEVELOPER
Summary: Full-stack engineer with 4+ years of building web applications. Proficient in React, JavaScript, and Node.js with strong database design experience.

Experience:
- Developed and maintained web features using React and JavaScript, increasing user engagement by 28%.
- Built RESTful APIs using Node.js and Express connected to PostgreSQL databases.
- Used Git and GitHub for version control and participated in sprint planning and Agile ceremonies.
- Wrote unit tests with Jest to improve test coverage to 85%.

Skills:
React, Node.js, JavaScript, Express, PostgreSQL, REST APIs, Git, Agile, Problem Solving.`,
};

export function AtsScannerClient() {
  const [jdText, setJdText] = useState<string>(SAMPLE_DATA.jd);
  const [resumeText, setResumeText] = useState<string>(SAMPLE_DATA.resume);
  const [hasScanned, setHasScanned] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "missing" | "matched">("all");

  const loadSample = () => {
    setJdText(SAMPLE_DATA.jd);
    setResumeText(SAMPLE_DATA.resume);
    setHasScanned(true);
  };

  const clearAll = () => {
    setJdText("");
    setResumeText("");
    setHasScanned(false);
  };

  const analysis = useMemo(() => {
    if (!jdText.trim()) return null;

    const lowerJd = jdText.toLowerCase();
    const lowerResume = resumeText.toLowerCase();

    const detectedKeywords: KeywordMatch[] = [];

    // Search for dictionary terms in JD
    Object.entries(COMMON_SKILLS_DICTIONARY).forEach(([term, meta]) => {
      // Check if term or aliases match in JD
      const regexTerms = [term, ...(meta.aliases || [])].map((t) =>
        t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      );
      const jdRegex = new RegExp(`\\b(${regexTerms.join("|")})\\b`, "gi");
      const jdMatches = lowerJd.match(jdRegex);

      if (jdMatches && jdMatches.length > 0) {
        // Check if found in resume
        const resumeRegex = new RegExp(`\\b(${regexTerms.join("|")})\\b`, "i");
        const foundInResume = resumeRegex.test(lowerResume);

        detectedKeywords.push({
          term,
          found: foundInResume,
          frequencyInJd: jdMatches.length,
          category: meta.category,
        });
      }
    });

    // Also extract capitalized technical words or common patterns from JD
    const jdWords = jdText.match(/\b[A-Z][a-zA-Z0-9+#.]{2,}\b/g) || [];
    const ignoredWords = new Set(["We", "The", "Key", "Our", "And", "With", "For", "Requirements", "Responsibilities", "Strong", "Excellent", "Years", "Senior", "Junior", "Lead", "Developer", "Engineer"]);
    
    jdWords.forEach((word) => {
      const lowerWord = word.toLowerCase();
      if (!ignoredWords.has(word) && !detectedKeywords.some((k) => k.term.toLowerCase() === lowerWord)) {
        if (word.length >= 3 && /^[A-Za-z0-9+#.]+$/.test(word)) {
          const count = (lowerJd.match(new RegExp(`\\b${lowerWord}\\b`, "g")) || []).length;
          if (count >= 1) {
            const foundInResume = new RegExp(`\\b${lowerWord}\\b`, "i").test(lowerResume);
            detectedKeywords.push({
              term: word,
              found: foundInResume,
              frequencyInJd: count,
              category: "hard-skill",
            });
          }
        }
      }
    });

    const totalKeywords = detectedKeywords.length;
    const matchedKeywords = detectedKeywords.filter((k) => k.found);
    const missingKeywords = detectedKeywords.filter((k) => !k.found);

    const score = totalKeywords > 0 ? Math.round((matchedKeywords.length / totalKeywords) * 100) : 0;

    let scoreRating = {
      label: "ATS Match Needs Optimization",
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
      advice: "Your resume is missing critical technical keywords found repeatedly in this job description. ATS parsers may score this resume below the recruiter interview cutoff.",
    };

    if (score >= 80) {
      scoreRating = {
        label: "Strong ATS Candidate Match",
        color: "text-green-600",
        bg: "bg-green-50 border-green-200",
        advice: "Outstanding keyword density! Your resume contains the majority of hard skills and tools requested by the employer.",
      };
    } else if (score < 50) {
      scoreRating = {
        label: "High Risk of ATS Auto-Rejection",
        color: "text-red-600",
        bg: "bg-red-50 border-red-200",
        advice: "Less than half of the required keywords are present in your resume. Tailor your bullet points immediately before submitting.",
      };
    }

    return {
      totalKeywords,
      matchedCount: matchedKeywords.length,
      missingCount: missingKeywords.length,
      score,
      scoreRating,
      detectedKeywords,
      missingKeywords,
      matchedKeywords,
    };
  }, [jdText, resumeText]);

  const filteredKeywords = useMemo(() => {
    if (!analysis) return [];
    if (selectedCategory === "missing") return analysis.missingKeywords;
    if (selectedCategory === "matched") return analysis.matchedKeywords;
    return analysis.detectedKeywords;
  }, [analysis, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
        <div className="text-xs text-neutral-600 font-medium">
          💡 Paste a target Job Description and your Resume to scan ATS keyword compatibility.
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadSample}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors shadow-sm"
          >
            ⚡ Load Sample Job &amp; Resume
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Description Input */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="jd-input" className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <span>📋</span> Target Job Description (JD)
            </label>
            <span className="text-[11px] text-neutral-400 font-mono">
              {jdText.length} chars
            </span>
          </div>
          <textarea
            id="jd-input"
            rows={10}
            value={jdText}
            onChange={(e) => {
              setJdText(e.target.value);
              setHasScanned(true);
            }}
            placeholder="Paste full job description from LinkedIn, Naukri, Indeed, or company portal..."
            className="w-full rounded-xl border border-neutral-200 p-3.5 text-xs text-neutral-800 leading-relaxed font-sans focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 resize-y"
          />
        </div>

        {/* Resume Input */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="resume-input" className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <span>📄</span> Your Resume Text
            </label>
            <span className="text-[11px] text-neutral-400 font-mono">
              {resumeText.length} chars
            </span>
          </div>
          <textarea
            id="resume-input"
            rows={10}
            value={resumeText}
            onChange={(e) => {
              setResumeText(e.target.value);
              setHasScanned(true);
            }}
            placeholder="Paste your resume work experience bullets and skills section here..."
            className="w-full rounded-xl border border-neutral-200 p-3.5 text-xs text-neutral-800 leading-relaxed font-sans focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 resize-y"
          />
        </div>
      </div>

      {/* Analysis Results Display */}
      {hasScanned && analysis && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8 space-y-8">
          {/* Top Score Banner */}
          <div className={`p-6 rounded-2xl border ${analysis.scoreRating.bg} flex flex-col sm:flex-row sm:items-center justify-between gap-6`}>
            <div className="space-y-1.5">
              <span className="text-xs uppercase tracking-wider font-bold text-neutral-500">
                ATS Compatibility Assessment
              </span>
              <h3 className={`text-2xl font-extrabold ${analysis.scoreRating.color}`}>
                {analysis.scoreRating.label}
              </h3>
              <p className="text-xs text-neutral-600 max-w-xl leading-relaxed">
                {analysis.scoreRating.advice}
              </p>
            </div>

            {/* Score Ring */}
            <div className="shrink-0 flex items-center gap-4 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl border border-neutral-200 shadow-sm">
              <div className="text-center">
                <div className={`text-4xl font-black ${analysis.scoreRating.color}`}>
                  {analysis.score}
                  <span className="text-lg text-neutral-400 font-normal">/100</span>
                </div>
                <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">
                  ATS Match Score
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/80 text-center">
              <div className="text-xs text-neutral-500 font-semibold">Total JD Keywords</div>
              <div className="text-2xl font-extrabold text-neutral-900 mt-1">{analysis.totalKeywords}</div>
            </div>
            <div className="bg-green-50/60 rounded-xl p-4 border border-green-200/80 text-center">
              <div className="text-xs text-green-700 font-semibold">Matched in Resume</div>
              <div className="text-2xl font-extrabold text-green-600 mt-1">{analysis.matchedCount}</div>
            </div>
            <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/80 text-center">
              <div className="text-xs text-amber-700 font-semibold">Missing Keywords</div>
              <div className="text-2xl font-extrabold text-amber-600 mt-1">{analysis.missingCount}</div>
            </div>
          </div>

          {/* Missing Keywords Action Box */}
          {analysis.missingKeywords.length > 0 && (
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent p-5 rounded-2xl border border-amber-200">
              <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <span>⚠️</span> Recommended Additions to Pass Screening
              </h4>
              <p className="text-xs text-neutral-600 mt-1">
                Recruiters and ATS scanners search for these exact terms. Incorporate these into your work bullets or skills section:
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {analysis.missingKeywords.map((k) => (
                  <span
                    key={k.term}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-amber-300 text-amber-900 shadow-sm"
                  >
                    <span>+</span> {k.term}
                    {k.frequencyInJd > 1 && (
                      <span className="text-[10px] text-amber-600 font-mono">({k.frequencyInJd}x in JD)</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Keyword Filter & Chips */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h4 className="text-sm font-bold text-neutral-900">
                Detailed Keyword Analysis ({filteredKeywords.length})
              </h4>
              <div className="flex gap-1.5">
                {(["all", "missing", "matched"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setSelectedCategory(filter)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                      selectedCategory === filter
                        ? "bg-neutral-900 text-white shadow-sm"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {filteredKeywords.map((k) => (
                <div
                  key={k.term}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    k.found
                      ? "bg-green-50/40 border-green-200 text-green-900"
                      : "bg-neutral-50 border-neutral-200 text-neutral-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{k.found ? "✅" : "❌"}</span>
                    <span className="font-semibold">{k.term}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-neutral-400 capitalize">{k.category}</span>
                    <span className="text-[10px] bg-white border border-neutral-200 px-1.5 py-0.5 rounded text-neutral-500 font-mono">
                      {k.frequencyInJd}x
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tailored Bullet Suggestions */}
          {analysis.missingKeywords.length > 0 && (
            <div className="bg-neutral-900 rounded-2xl p-6 text-white space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-primary-400 font-bold">
                  ✨ AI ATS Bullet Suggestion
                </span>
                <span className="text-xs text-neutral-400">Copy &amp; Adapt to Your Experience</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-mono bg-neutral-800/80 p-4 rounded-xl border border-neutral-700">
                &quot;Architected and scaled production services utilizing {analysis.missingKeywords.slice(0, 3).map((k) => k.term).join(", ")}, improving system throughput by 32% and reducing automated deployment cycle times.&quot;
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-neutral-400">
                  Tip: Always quantify achievements with metrics (%, $, latency) for highest recruiter callback rates.
                </span>
                <Link
                  href="/tools/resume-matcher"
                  className="bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors"
                >
                  Open Full AI Resume Matcher →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
