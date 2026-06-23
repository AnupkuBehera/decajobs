"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CareerPathPage() {
  const [currentRole, setCurrentRole] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleVisualize() {
    if (!currentRole) { setError("Current role is required."); return; }
    setIsLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/ai-tools/extra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "career-path", currentRole, experience, skills, interests }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || data.message); return; }
      setResult(data);
    } catch { setError("Network error."); }
    finally { setIsLoading(false); }
  }

  const pathColors = ["border-blue-300 bg-blue-50", "border-green-300 bg-green-50", "border-purple-300 bg-purple-50"];

  return (
    <div className="py-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl mb-2">Career Path Visualizer</h1>
        <p className="text-neutral-600 mb-6">See where your career can go in the next 2-5 years. AI-powered roadmap.</p>

        <Card padding="lg" className="mb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <input type="text" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} placeholder="Current Role (e.g. Data Analyst) *" className="rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
            <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Years of Experience (e.g. 3 years)" className="rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
            <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Current Skills (e.g. SQL, Python, Power BI)" className="rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
            <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="Interests (e.g. leadership, machine learning)" className="rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <Button onClick={handleVisualize} isLoading={isLoading} className="mt-4">Visualize My Career Path</Button>
        </Card>

        {result && result.paths && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <span className="inline-block rounded-full bg-neutral-200 px-4 py-2 text-sm font-semibold">
                📍 You are here: {result.currentRole}
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {result.paths.map((path: any, i: number) => (
                <div key={i} className={`rounded-xl border-2 p-5 ${pathColors[i] || pathColors[0]}`}>
                  <h3 className="font-bold text-neutral-900 mb-1">{path.name}</h3>
                  <p className="text-xs text-neutral-600 mb-4">{path.description}</p>

                  {path.steps?.map((step: any, j: number) => (
                    <div key={j} className="mb-4 last:mb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-white rounded-full px-2 py-0.5 font-medium">{step.timeline}</span>
                      </div>
                      <p className="font-semibold text-sm">{step.role}</p>
                      <p className="text-xs text-neutral-600">{step.salary}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {step.skillsNeeded?.map((s: string) => (
                          <span key={s} className="text-xs bg-white/70 px-1.5 py-0.5 rounded">{s}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {result.advice && (
              <Card padding="md">
                <p className="text-sm text-neutral-700"><strong>💡 Career Advice:</strong> {result.advice}</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
