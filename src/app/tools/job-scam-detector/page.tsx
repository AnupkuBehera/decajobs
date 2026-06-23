"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function JobScamDetectorPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    if (!jobTitle && !company && !description) { setError("Please fill in at least the job title or description."); return; }
    setIsLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/tools/scam-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, company, description, salary, contactInfo }),
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
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">Job Scam Detector</h1>
          <p className="mt-3 text-neutral-600">Paste a job listing and our AI will check if it&apos;s legitimate or a potential scam. Free, no login.</p>
        </div>

        {!result ? (
          <Card padding="lg">
            <div className="space-y-4">
              <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Job Title (e.g. Marketing Manager)" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company Name" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} placeholder="Paste the job description..." className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none resize-y" />
              <input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Salary mentioned (if any)" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
              <input type="text" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="Contact info provided (email, phone, WhatsApp)" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button onClick={handleAnalyze} isLoading={isLoading} size="lg" className="w-full">Check If This Job Is Real</Button>
              <p className="text-center text-xs text-neutral-500">Free. No login. Your data is not stored.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card padding="lg" className="text-center">
              <p className={`text-4xl font-bold ${result.safetyScore >= 70 ? "text-green-600" : result.safetyScore >= 40 ? "text-yellow-600" : "text-red-600"}`}>
                {result.safetyScore}/100
              </p>
              <p className={`text-lg font-semibold mt-2 ${result.verdict === "Safe" ? "text-green-700" : result.verdict === "Suspicious" ? "text-yellow-700" : "text-red-700"}`}>
                {result.verdict === "Safe" ? "✅ Looks Legitimate" : result.verdict === "Suspicious" ? "⚠️ Suspicious — Proceed with Caution" : "🚨 Likely a Scam"}
              </p>
              <p className="text-sm text-neutral-600 mt-2">{result.explanation}</p>
            </Card>
            {result.redFlags?.length > 0 && (
              <Card padding="md"><h3 className="font-semibold text-red-700 mb-2">🚩 Red Flags</h3>
                {result.redFlags.map((f: string, i: number) => <p key={i} className="text-sm text-red-600">• {f}</p>)}
              </Card>
            )}
            {result.greenFlags?.length > 0 && (
              <Card padding="md"><h3 className="font-semibold text-green-700 mb-2">✅ Green Flags</h3>
                {result.greenFlags.map((f: string, i: number) => <p key={i} className="text-sm text-green-600">• {f}</p>)}
              </Card>
            )}
            <Card padding="md"><p className="text-sm font-medium">💡 Advice: {result.advice}</p></Card>
            <Card padding="lg" className="text-center bg-primary-50 border-primary-200">
              <p className="font-semibold">Want only verified, AI-matched jobs? No scams.</p>
              <Link href="/login" className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 min-h-[44px]">Get 10 Safe Jobs Daily →</Link>
            </Card>
            <button onClick={() => setResult(null)} className="w-full text-center text-sm text-primary-600 hover:underline">Check another listing</button>
          </div>
        )}
      </div>
    </div>
  );
}
