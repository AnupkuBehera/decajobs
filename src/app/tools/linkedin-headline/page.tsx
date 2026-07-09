"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function LinkedInHeadlinePage() {
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!currentRole && !targetRole) { setError("Please enter at least one role."); return; }
    setIsLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/tools/linkedin-headline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentRole, targetRole, skills, experience }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setResult(data);
    } catch { setError("Network error."); }
    finally { setIsLoading(false); }
  }

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">LinkedIn Headline Generator</h1>
          <p className="mt-3 text-neutral-600">Get 5 optimized headlines that make recruiters click. Free, instant.</p>
        </div>

        <Card padding="lg">
          <div className="space-y-4">
            <input type="text" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} placeholder="Current Role (e.g. Data Analyst)" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
            <input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="Target Role (e.g. Senior Data Analyst)" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
            <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Top Skills (e.g. SQL, Power BI, Python)" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
            <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Years of Experience (e.g. 3 years)" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button onClick={handleGenerate} isLoading={isLoading} size="lg" className="w-full">Generate 5 Headlines — Free</Button>
          </div>
        </Card>

        {result && (
          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold">Your Optimized Headlines</h2>
            {result.headlines?.map((h: string, i: number) => (
              <Card key={i} padding="md" className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-neutral-900 flex-1">{h}</p>
                <button onClick={() => navigator.clipboard.writeText(h)} className="text-xs text-primary-600 hover:underline shrink-0">Copy</button>
              </Card>
            ))}
            {result.tips && (
              <Card padding="md">
                <h3 className="text-sm font-semibold mb-2">💡 Why these work:</h3>
                {result.tips.map((t: string, i: number) => <p key={i} className="text-xs text-neutral-600">• {t}</p>)}
              </Card>
            )}
            <Card padding="lg" className="text-center bg-primary-50 border-primary-200">
              <p className="font-semibold">Optimized headline → more recruiter views → more job matches.</p>
              <Link href="/login" className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 min-h-[44px]">Get Daily Job Matches →</Link>
            </Card>
          </div>
        )}

        <div className="mt-16 border-t border-neutral-200 pt-12 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">LinkedIn Profile Optimization & Headline Guide</h2>
          <p className="text-neutral-600 leading-relaxed">
            Your LinkedIn headline is one of the most critical sections of your profile. It is the first thing recruiters see next to your name and profile picture, and it is heavily weighted by the LinkedIn search algorithm (LinkedIn SEO). A generic headline means missing out on organic recruiter visits.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">Why LinkedIn SEO and Keywords Matter</h3>
          <p className="text-neutral-600 leading-relaxed">
            Recruiters search LinkedIn using Boolean strings and specific keywords (e.g., &quot;React Developer Bangalore&quot;). If your headline, summary, and experience sections do not contain these target keywords, your profile will not show up in their search results.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">3 Proven LinkedIn Headline Formulas</h3>
          <div className="space-y-4 my-6">
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">Formula 1: The Keyword-Centric Split (Best for Technical Roles)</h4>
              <p className="text-sm text-neutral-600 mt-1">Format: <strong>Job Title | Core Skills & Tech Stack | Value Statement</strong></p>
              <p className="text-xs text-neutral-500 mt-1">Example: <em>Data Analyst | SQL • Python • Tableau | Helping SaaS businesses turn customer data into revenue growth</em></p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">Formula 2: The Value-Driven Statement (Best for Sales/Growth Roles)</h4>
              <p className="text-sm text-neutral-600 mt-1">Format: <strong>Job Title | Helping [Target Audience] achieve [Desired Outcome]</strong></p>
              <p className="text-xs text-neutral-500 mt-1">Example: <em>Frontend Developer | Crafting beautiful, responsive user interfaces that double website conversion rates</em></p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">Formula 3: The Fresher / Career Starter Split (Best for Grads)</h4>
              <p className="text-sm text-neutral-600 mt-1">Format: <strong>Aspiring [Target Role] | Top Skills | Project Highlight</strong></p>
              <p className="text-xs text-neutral-500 mt-1">Example: <em>Computer Science Graduate & Aspiring DevOps Engineer | AWS, Docker, Kubernetes | Built automated CI/CD pipeline for 5+ projects</em></p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">Frequently Asked Questions (FAQs)</h3>
          <div className="space-y-4">
            <details className="group border-b border-neutral-200 pb-4">
              <summary className="flex cursor-pointer justify-between items-center font-medium text-neutral-900">
                How long can my LinkedIn headline be?
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-neutral-600 mt-2">
                As of 2026, LinkedIn allows headlines up to 220 characters on both desktop and mobile platforms. We recommend using at least 150 characters to fully optimize it with relevant keywords and your value proposition.
              </p>
            </details>
            <details className="group border-b border-neutral-200 pb-4">
              <summary className="flex cursor-pointer justify-between items-center font-medium text-neutral-900">
                Should I put &quot;Actively Looking for Opportunities&quot; in my headline?
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-neutral-600 mt-2">
                We advise against using valuable headline space for &quot;Looking for a job&quot; or &quot;Open to work.&quot; Recruiters do not search for the term &quot;unemployed&quot; or &quot;looking.&quot; They search for skills like &quot;React Developer&quot; or &quot;Project Manager.&quot; Instead, use the &quot;Open to Work&quot; badge settings which are visible to recruiters only.
              </p>
            </details>
            <details className="group border-b border-neutral-200 pb-4">
              <summary className="flex cursor-pointer justify-between items-center font-medium text-neutral-900">
                How often should I change my headline?
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-neutral-600 mt-2">
                You should update your headline whenever you learn a major new skill, transition roles, or notice that your current headline isn&apos;t driving profile views. Aim to review and refresh your profile keywords every 3 to 6 months.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
