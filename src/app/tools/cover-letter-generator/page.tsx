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

        <div className="mt-16 border-t border-neutral-200 pt-12 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">How to Write a Professional Cover Letter</h2>
          <p className="text-neutral-600 leading-relaxed">
            While some believe cover letters are outdated, they remain one of the best ways to stand out in a competitive job market. A custom cover letter allows you to tell the story behind your resume, explain career transitions, and explicitly connect your skills to the employer&apos;s needs.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">The Anatomy of a High-Converting Cover Letter</h3>
          <p className="text-neutral-600 leading-relaxed">
            Every successful cover letter should follow a structured, easy-to-read format:
          </p>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2">
            <li><strong>Header & Salutation:</strong> Include professional contact information and address the hiring manager by name if possible (avoid &quot;To Whom It May Concern&quot;).</li>
            <li><strong>The Hook (Opening Paragraph):</strong> State the position you are applying for and mention a notable achievement or a compelling reason why you love the company to grab attention immediately.</li>
            <li><strong>Core Alignment (Body Paragraphs):</strong> Map 2 or 3 of your key achievements directly to the job requirements. Use numbers and metrics to back up your claims.</li>
            <li><strong>Call to Action (Closing Paragraph):</strong> Reiterate your enthusiasm for the role and politely request an interview to discuss how you can help the company succeed.</li>
          </ul>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">5 Tips to Make Your Cover Letter Stand Out</h3>
          <div className="space-y-4 my-6">
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">1. Tailor it for every single job</h4>
              <p className="text-sm text-neutral-600 mt-1">Generic templates are easy to spot and often ignored. Use our generator to create a unique draft tailored to the exact role and company, then personalize it further.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">2. Keep it concise (under 400 words)</h4>
              <p className="text-sm text-neutral-600 mt-1">Recruiters are busy. Your cover letter should be a single page, containing 3 to 4 paragraphs maximum. Get straight to the point.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">3. Focus on what you can do for the company</h4>
              <p className="text-sm text-neutral-600 mt-1">Avoid talking too much about what the job would do for your career. Focus instead on how your skills will solve the employer&apos;s specific pain points.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">4. Match the company&apos;s brand tone</h4>
              <p className="text-sm text-neutral-600 mt-1">If you are applying to a creative startup, use a friendly and enthusiastic tone. For a traditional corporate firm (like banking or law), use a more formal and professional tone.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">5. Proofread meticulously</h4>
              <p className="text-sm text-neutral-600 mt-1">Spelling and grammatical mistakes in a cover letter are instant dealbreakers. Read it aloud or ask a colleague to review it before submitting.</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">Frequently Asked Questions (FAQs)</h3>
          <div className="space-y-4">
            <details className="group border-b border-neutral-200 pb-4">
              <summary className="flex cursor-pointer justify-between items-center font-medium text-neutral-900">
                Do recruiters actually read cover letters?
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-neutral-600 mt-2">
                While some recruiters skip straight to the resume, over 50% of hiring managers consider cover letters an important factor in their decision. Furthermore, a well-written cover letter can be the deciding factor when choosing between two candidates with identical resumes.
              </p>
            </details>
            <details className="group border-b border-neutral-200 pb-4">
              <summary className="flex cursor-pointer justify-between items-center font-medium text-neutral-900">
                What if the application portal says &quot;Cover Letter (Optional)&quot;?
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-neutral-600 mt-2">
                In the job search, &quot;optional&quot; means &quot;required if you want to stand out.&quot; Writing a cover letter shows extra effort and genuine interest in the company, giving you an automatic advantage over candidates who skipped it.
              </p>
            </details>
            <details className="group border-b border-neutral-200 pb-4">
              <summary className="flex cursor-pointer justify-between items-center font-medium text-neutral-900">
                Can I submit the same cover letter to multiple companies?
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-neutral-600 mt-2">
                We strongly advise against this. A generic cover letter that just swaps out the company name is easily detected. Use our AI tool to quickly customize the letter based on the specific job requirements for each company.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
