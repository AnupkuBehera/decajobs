"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ColdEmailPage() {
  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterRole, setRecruiterRole] = useState("");
  const [company, setCompany] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [background, setBackground] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  async function handleGenerate() {
    if (!company || !jobRole) { setError("Company and role are required."); return; }
    setIsLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/ai-tools/extra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cold-email", recruiterName, recruiterRole, company, jobRole, yourBackground: background }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || data.message); return; }
      setResult(data);
    } catch { setError("Network error."); }
    finally { setIsLoading(false); }
  }

  function copyText(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  }

  return (
    <div className="py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl mb-2">AI Cold Email to Recruiter</h1>
        <p className="text-neutral-600 mb-6">Generate personalized outreach messages that actually get replies.</p>

        <Card padding="lg" className="mb-6">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" value={recruiterName} onChange={(e) => setRecruiterName(e.target.value)} placeholder="Recruiter Name (optional)" className="rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
              <input type="text" value={recruiterRole} onChange={(e) => setRecruiterRole(e.target.value)} placeholder="Their Title (e.g. TA Manager)" className="rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
            </div>
            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company Name *" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
            <input type="text" value={jobRole} onChange={(e) => setJobRole(e.target.value)} placeholder="Role you're interested in *" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
            <textarea value={background} onChange={(e) => setBackground(e.target.value)} rows={3} placeholder="Brief background (e.g. 3 years in data analytics, Python/SQL expert, MBA)" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none resize-y" />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button onClick={handleGenerate} isLoading={isLoading} size="lg" className="w-full">Generate Outreach Messages</Button>
          </div>
        </Card>

        {result && (
          <div className="space-y-6">
            {/* LinkedIn Message */}
            <Card padding="lg">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-neutral-900">💼 LinkedIn Connection Message</h2>
                <Button size="sm" variant="secondary" onClick={() => copyText(result.linkedinMessage, "linkedin")}>
                  {copied === "linkedin" ? "Copied ✓" : "Copy"}
                </Button>
              </div>
              <div className="rounded-lg bg-neutral-50 p-4 text-sm whitespace-pre-wrap">{result.linkedinMessage}</div>
            </Card>

            {/* Email */}
            <Card padding="lg">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-neutral-900">✉️ Cold Email</h2>
                <Button size="sm" variant="secondary" onClick={() => copyText(`Subject: ${result.email?.subject}\n\n${result.email?.body}`, "email")}>
                  {copied === "email" ? "Copied ✓" : "Copy"}
                </Button>
              </div>
              <div className="rounded-lg bg-neutral-50 p-4">
                <p className="text-xs text-neutral-500 mb-2">Subject: <strong>{result.email?.subject}</strong></p>
                <p className="text-sm whitespace-pre-wrap">{result.email?.body}</p>
              </div>
            </Card>

            {/* Tips */}
            {result.tips && (
              <Card padding="md">
                <h3 className="text-sm font-semibold mb-2">💡 Outreach Tips:</h3>
                {result.tips.map((t: string, i: number) => <p key={i} className="text-xs text-neutral-600">• {t}</p>)}
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
