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

        <div className="mt-16 border-t border-neutral-200 pt-12 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">How to Identify and Avoid Online Job Scams</h2>
          <p className="text-neutral-600 leading-relaxed">
            As the number of remote job opportunities has grown, so has the incidence of fraudulent job listings. Scammers use sophisticated tactics to trick job seekers into revealing personal information, transferring money, or performing unpaid work under the guise of a real job opening.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">5 Major Red Flags of a Fake Job Posting</h3>
          <div className="space-y-4 my-6">
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">1. Asking for money or fees up front</h4>
              <p className="text-sm text-neutral-600 mt-1">Legitimate employers will never charge you for applying, training, training materials, laptop fees, or system setup. If they ask you to send money via UPI, wire transfer, or crypto, it is 100% a scam.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">2. Communications via messaging apps only</h4>
              <p className="text-sm text-neutral-600 mt-1">Be highly suspicious if the entire recruitment process (including interviews and offers) happens strictly over Telegram, WhatsApp, or Signal. Real companies schedule video interviews via Zoom, Teams, or Google Meet.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">3. Unprofessional email domains</h4>
              <p className="text-sm text-neutral-600 mt-1">Real recruiters email from corporate domains (e.g., name@google.com). If you receive an offer from a public domain like Gmail (e.g., googlecareers99@gmail.com) or a misspelled lookalike domain, proceed with extreme caution.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">4. Too good to be true packages</h4>
              <p className="text-sm text-neutral-600 mt-1">If a listing promises ₹50,000 per week for 2 hours of simple work (like data entry or liking YouTube videos) with zero experience required, it is a task-scam designed to steal your money after a few &quot;tasks.&quot;</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">5. Rushed hiring process</h4>
              <p className="text-sm text-neutral-600 mt-1">If you receive a job offer within minutes of submitting your resume, without a proper live interview or tech assessment, it is likely a scam. Fraudsters rush the process to prevent you from researching the company.</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">Steps to Verify a Job and Company</h3>
          <p className="text-neutral-600 leading-relaxed">
            Before applying or sharing sensitive documents like your Aadhaar card, PAN, or bank details, do this basic checklist:
          </p>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2">
            <li><strong>Check the official careers page:</strong> Go directly to the company website and search for the job ID or title. If it is not listed there, verify it with their HR team.</li>
            <li><strong>Lookup the recruiter on LinkedIn:</strong> Search for the person emailing you. Verify they actually work at the company and have a real profile with connections.</li>
            <li><strong>Google search search terms:</strong> Search for &quot;[Company Name] + job scam&quot; or &quot;[Company Name] + reviews&quot; to see if other job seekers have reported fraud.</li>
          </ul>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">Frequently Asked Questions (FAQs)</h3>
          <div className="space-y-4">
            <details className="group border-b border-neutral-200 pb-4">
              <summary className="flex cursor-pointer justify-between items-center font-medium text-neutral-900">
                What should I do if I shared my Aadhaar or PAN card with a scammer?
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-neutral-600 mt-2">
                Monitor your bank accounts closely, check your credit report for unauthorized loans, and consider filing a report on the official Cyber Crime portal in India (cybercrime.gov.in) to document the identity theft.
              </p>
            </details>
            <details className="group border-b border-neutral-200 pb-4">
              <summary className="flex cursor-pointer justify-between items-center font-medium text-neutral-900">
                Are WhatsApp &quot;Like YouTube Videos&quot; jobs real?
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-neutral-600 mt-2">
                No. This is a very common task-based financial fraud. They will pay you small sums (e.g., ₹150) at first to build trust, then ask you to deposit larger amounts (pre-paid VIP tasks) to unlock higher earnings, after which they block your number and steal your money.
              </p>
            </details>
            <details className="group border-b border-neutral-200 pb-4">
              <summary className="flex cursor-pointer justify-between items-center font-medium text-neutral-900">
                How does DecaJobs verify its job listings?
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-neutral-600 mt-2">
                We aggregate jobs from reputable platforms and utilize AI filters to strip out listings with scam indicators (e.g., fee requirements, public emails, suspicious company names). Our premium matches only include verified employer listings.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
