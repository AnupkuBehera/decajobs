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
      </div>
    </div>
  );
}
