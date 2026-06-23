"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function CoverLetterGeneratorPage() {
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!role.trim() || !skills.trim()) {
      setError("Please fill in the role and your key skills.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tools/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, company, skills }),
      });
      const data = await response.json();
      if (!response.ok) { setError(data.error || "Failed."); }
      else { setCoverLetter(data.coverLetter); }
    } catch { setError("Network error."); }
    finally { setIsLoading(false); }
  }

  function handleDownload() {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Cover Letter</title><style>body{font-family:Arial;max-width:700px;margin:40px auto;padding:20px;line-height:1.8;white-space:pre-wrap;}</style></head><body>${coverLetter.replace(/\n/g, "<br>")}</body></html>`);
    w.document.close();
    w.print();
  }

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">AI Cover Letter Generator</h1>
          <p className="mt-3 text-neutral-600">Generate a professional cover letter in seconds. Free, no login.</p>
        </div>

        {!coverLetter ? (
          <Card padding="lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Job Role *</label>
                <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Senior Data Analyst" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Company Name (optional)</label>
                <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Google, TCS, Infosys" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Your Key Skills *</label>
                <textarea value={skills} onChange={(e) => setSkills(e.target.value)} rows={3} placeholder="e.g. Python, SQL, Power BI, 3 years experience in data analytics, MBA from XYZ university" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y" />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button onClick={handleGenerate} isLoading={isLoading} size="lg" className="w-full">
                {isLoading ? "Generating..." : "Generate Cover Letter — Free"}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card padding="lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Your Cover Letter</h2>
                <Button size="sm" variant="secondary" onClick={handleDownload}>Download PDF</Button>
              </div>
              <pre className="text-sm text-neutral-800 whitespace-pre-wrap font-sans leading-relaxed border border-neutral-200 rounded-lg p-4">
                {coverLetter}
              </pre>
            </Card>

            <Card padding="lg" className="text-center bg-primary-50 border-primary-200">
              <p className="font-semibold">Love this? Get 10 AI-matched jobs + unlimited cover letters.</p>
              <Link href="/login" className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 min-h-[44px]">
                Sign Up Free →
              </Link>
            </Card>

            <button onClick={() => setCoverLetter("")} className="w-full text-center text-sm text-primary-600 hover:underline">
              Generate another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
