"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Tool = "skill-gap" | "ats-scan" | "follow-up" | "career-coach" | "ghost-detect" | "culture-fit" | "market-trends";

export default function AIToolsPage() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  // Form states
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [question, setQuestion] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [emailType, setEmailType] = useState("thank-you");
  const [jobTitle, setJobTitle] = useState("");
  const [postedDate, setPostedDate] = useState("");
  const [cultureAnswers, setCultureAnswers] = useState<Record<string, string>>({});
  const [showUpgrade, setShowUpgrade] = useState(false);

  async function callAI(action: string, params: Record<string, any>) {
    setIsLoading(true);
    setError("");
    setResult(null);
    setShowUpgrade(false);
    try {
      const res = await fetch("/api/ai-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...params }),
      });
      const data = await res.json();
      if (res.status === 403 && data.error === "trial_expired") {
        setShowUpgrade(true);
        setError(data.message);
        return;
      }
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      setResult(data);
    } catch { setError("Network error. Try again."); }
    finally { setIsLoading(false); }
  }

  const tools = [
    { id: "skill-gap" as Tool, emoji: "🎯", title: "Skill Gap Analyzer", desc: "Find missing skills & get course recommendations" },
    { id: "ats-scan" as Tool, emoji: "🤖", title: "ATS Resume Scanner", desc: "Check if your resume passes ATS filters" },
    { id: "follow-up" as Tool, emoji: "✉️", title: "Follow-up Email Generator", desc: "Generate thank-you & follow-up emails" },
    { id: "career-coach" as Tool, emoji: "💬", title: "AI Career Coach", desc: "Ask any career question, get expert advice" },
    { id: "ghost-detect" as Tool, emoji: "👻", title: "Ghost Job Detector", desc: "Check if a job listing is real or fake" },
    { id: "culture-fit" as Tool, emoji: "🏢", title: "Company Culture Quiz", desc: "Find your ideal work environment" },
    { id: "market-trends" as Tool, emoji: "📊", title: "Job Market Trends", desc: "See what's hot in hiring right now" },
  ];

  const cultureQuestions = [
    { key: "pace", q: "What work pace do you prefer?", options: ["Fast & dynamic", "Steady & predictable", "Flexible"] },
    { key: "structure", q: "How much structure do you want?", options: ["Lots of process", "Some guidelines", "Total freedom"] },
    { key: "teamSize", q: "Ideal team size?", options: ["Small (2-10)", "Medium (10-50)", "Large (100+)"] },
    { key: "remote", q: "Remote preference?", options: ["Fully remote", "Hybrid", "Office only"] },
    { key: "growth", q: "What matters most?", options: ["Learning fast", "Work-life balance", "High salary", "Impact"] },
  ];

  return (
    <div className="py-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl mb-2">AI Career Tools</h1>
        <p className="text-neutral-600 mb-6">Powered by AI to solve your daily job search problems.</p>

        {!activeTool ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <button key={tool.id} onClick={() => { setActiveTool(tool.id); setResult(null); setError(""); }}
                className="text-left rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:shadow-lg hover:border-primary-200">
                <span className="text-2xl">{tool.emoji}</span>
                <h3 className="mt-2 font-semibold text-neutral-900">{tool.title}</h3>
                <p className="mt-1 text-sm text-neutral-600">{tool.desc}</p>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button onClick={() => { setActiveTool(null); setResult(null); }} className="text-sm text-primary-600 hover:underline mb-4">
              ← Back to all tools
            </button>

            <Card padding="lg">
              {/* SKILL GAP */}
              {activeTool === "skill-gap" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">🎯 Skill Gap Analyzer</h2>
                  <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} rows={5} placeholder="Paste your resume..." className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none resize-y" />
                  <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={5} placeholder="Paste the job description..." className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none resize-y" />
                  <Button onClick={() => callAI("skill-gap", { resumeText, jobDescription })} isLoading={isLoading}>Analyze Skill Gap</Button>
                </div>
              )}

              {/* ATS SCAN */}
              {activeTool === "ats-scan" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">🤖 ATS Resume Scanner</h2>
                  <p className="text-sm text-neutral-600">Check if your resume would pass through an Applicant Tracking System for a specific job.</p>
                  <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} rows={5} placeholder="Paste your resume..." className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none resize-y" />
                  <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={5} placeholder="Paste the job description..." className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none resize-y" />
                  <Button onClick={() => callAI("ats-scan", { resumeText, jobDescription })} isLoading={isLoading}>Scan Resume</Button>
                </div>
              )}

              {/* FOLLOW-UP EMAIL */}
              {activeTool === "follow-up" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">✉️ Follow-up Email Generator</h2>
                  <div className="flex gap-3">
                    <button onClick={() => setEmailType("thank-you")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${emailType === "thank-you" ? "bg-primary-100 text-primary-700" : "bg-neutral-100 text-neutral-600"}`}>Thank You Email</button>
                    <button onClick={() => setEmailType("follow-up")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${emailType === "follow-up" ? "bg-primary-100 text-primary-700" : "bg-neutral-100 text-neutral-600"}`}>Follow-up (No Response)</button>
                  </div>
                  <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Job Role (e.g. Data Analyst)" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
                  <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={3} placeholder="Any additional context (what was discussed, when you applied...)" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none resize-y" />
                  <Button onClick={() => callAI("follow-up-email", { type: emailType, role, companyName, context: question })} isLoading={isLoading}>Generate Email</Button>
                </div>
              )}

              {/* CAREER COACH */}
              {activeTool === "career-coach" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">💬 AI Career Coach</h2>
                  <p className="text-sm text-neutral-600">Ask any career-related question and get expert advice.</p>
                  <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={4} placeholder="e.g. Should I switch from development to product management? How do I explain a 2-year career gap? Is this salary offer fair for 3 years experience in Bangalore?" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none resize-y" />
                  <Button onClick={() => callAI("career-coach", { question })} isLoading={isLoading}>Get Advice</Button>
                </div>
              )}

              {/* GHOST JOB DETECTOR */}
              {activeTool === "ghost-detect" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">👻 Ghost Job Detector</h2>
                  <p className="text-sm text-neutral-600">Check if a job listing is real or a &quot;ghost job&quot; (posted but not actively hiring).</p>
                  <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Job Title" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
                  <input type="text" value={postedDate} onChange={(e) => setPostedDate(e.target.value)} placeholder="When was it posted? (e.g. 2 weeks ago, March 2026)" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
                  <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={4} placeholder="Paste the job description (optional but helps accuracy)" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none resize-y" />
                  <Button onClick={() => callAI("ghost-job-detect", { jobTitle, company: companyName, postedDate, description: jobDescription })} isLoading={isLoading}>Analyze Listing</Button>
                </div>
              )}

              {/* CULTURE FIT */}
              {activeTool === "culture-fit" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">🏢 Company Culture Fit Quiz</h2>
                  <p className="text-sm text-neutral-600">Answer 5 quick questions to find your ideal work environment.</p>
                  {cultureQuestions.map((cq) => (
                    <div key={cq.key}>
                      <p className="text-sm font-medium text-neutral-700 mb-2">{cq.q}</p>
                      <div className="flex flex-wrap gap-2">
                        {cq.options.map((opt) => (
                          <button key={opt} onClick={() => setCultureAnswers({ ...cultureAnswers, [cq.key]: opt })}
                            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${cultureAnswers[cq.key] === opt ? "bg-primary-100 border-primary-300 text-primary-700" : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"}`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button onClick={() => callAI("culture-fit", { answers: cultureAnswers })} isLoading={isLoading}
                    disabled={Object.keys(cultureAnswers).length < 5}>Get My Culture Match</Button>
                </div>
              )}

              {/* MARKET TRENDS */}
              {activeTool === "market-trends" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">📊 Job Market Trends</h2>
                  <p className="text-sm text-neutral-600">See what roles and skills are in demand right now.</p>
                  <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role (optional, e.g. Data Analyst)" className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
                  <Button onClick={() => callAI("market-trends", { role, location: "India" })} isLoading={isLoading}>Show Trends</Button>
                </div>
              )}

              {/* ERROR */}
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
              {showUpgrade && (
                <div className="mt-4 rounded-lg bg-primary-50 border border-primary-200 p-4 text-center">
                  <p className="font-semibold text-neutral-900">Upgrade to DecaJobs Pro</p>
                  <p className="text-sm text-neutral-600 mt-1">Unlimited AI tools + 10 daily job matches for ₹299/month</p>
                  <a href="/subscribe" className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 min-h-[44px]">
                    Subscribe Now — ₹299/month
                  </a>
                </div>
              )}

              {/* RESULTS */}
              {result && (
                <div className="mt-6 rounded-lg bg-neutral-50 p-4">
                  <h3 className="font-semibold text-neutral-900 mb-3">Results</h3>

                  {/* Skill Gap Results */}
                  {activeTool === "skill-gap" && result.matchPercentage !== undefined && (
                    <div className="space-y-3">
                      <p className="text-2xl font-bold text-center">{result.matchPercentage}% Match</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs font-medium text-green-700 mb-1">✓ Skills You Have</p>
                          <div className="flex flex-wrap gap-1">{result.matchingSkills?.map((s: string) => <span key={s} className="text-xs bg-green-100 px-2 py-0.5 rounded">{s}</span>)}</div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3">
                          <p className="text-xs font-medium text-red-700 mb-1">✗ Skills to Learn</p>
                          <div className="flex flex-wrap gap-1">{result.missingSkills?.map((s: string) => <span key={s} className="text-xs bg-red-100 px-2 py-0.5 rounded">{s}</span>)}</div>
                        </div>
                      </div>
                      {result.recommendations && (
                        <div>
                          <p className="text-sm font-medium mt-3 mb-2">📚 Recommended Courses:</p>
                          {result.recommendations.map((r: any, i: number) => (
                            <div key={i} className="text-sm text-neutral-700 mb-1">• <strong>{r.skill}</strong>: {r.course} ({r.platform})</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ATS Results */}
                  {activeTool === "ats-scan" && result.atsScore !== undefined && (
                    <div className="space-y-3">
                      <div className="text-center">
                        <p className={`text-4xl font-bold ${result.atsScore >= 70 ? "text-green-600" : result.atsScore >= 50 ? "text-yellow-600" : "text-red-600"}`}>{result.atsScore}%</p>
                        <p className="text-sm text-neutral-600">{result.willPass ? "✅ Likely to pass ATS" : "❌ May get filtered out"}</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div><p className="text-xs font-medium text-green-700 mb-1">Keywords Found</p><div className="flex flex-wrap gap-1">{result.keywordsFound?.map((k: string) => <span key={k} className="text-xs bg-green-100 px-2 py-0.5 rounded">{k}</span>)}</div></div>
                        <div><p className="text-xs font-medium text-red-700 mb-1">Keywords Missing</p><div className="flex flex-wrap gap-1">{result.keywordsMissing?.map((k: string) => <span key={k} className="text-xs bg-red-100 px-2 py-0.5 rounded">{k}</span>)}</div></div>
                      </div>
                      {result.suggestions && <div><p className="text-sm font-medium mt-3 mb-1">Suggestions:</p>{result.suggestions.map((s: string, i: number) => <p key={i} className="text-sm text-neutral-700">• {s}</p>)}</div>}
                    </div>
                  )}

                  {/* Follow-up Email */}
                  {activeTool === "follow-up" && result.email && (
                    <div>
                      <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">{result.email}</pre>
                      <Button size="sm" variant="secondary" className="mt-3" onClick={() => navigator.clipboard.writeText(result.email)}>Copy Email</Button>
                    </div>
                  )}

                  {/* Career Coach */}
                  {activeTool === "career-coach" && result.answer && (
                    <div className="text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap">{result.answer}</div>
                  )}

                  {/* Ghost Job */}
                  {activeTool === "ghost-detect" && result.riskLevel && (
                    <div className="space-y-3">
                      <div className="text-center">
                        <p className={`text-lg font-bold ${result.riskLevel === "low" ? "text-green-600" : result.riskLevel === "medium" ? "text-yellow-600" : "text-red-600"}`}>
                          {result.riskLevel === "low" ? "✅ Likely Real" : result.riskLevel === "medium" ? "⚠️ Some Concerns" : "🚨 High Ghost Risk"}
                        </p>
                        <p className="text-sm text-neutral-600 mt-1">{result.recommendation}</p>
                      </div>
                      {result.redFlags?.length > 0 && <div><p className="text-xs font-medium text-red-700">Red Flags:</p>{result.redFlags.map((f: string, i: number) => <p key={i} className="text-sm text-red-600">• {f}</p>)}</div>}
                      {result.greenFlags?.length > 0 && <div><p className="text-xs font-medium text-green-700">Green Flags:</p>{result.greenFlags.map((f: string, i: number) => <p key={i} className="text-sm text-green-600">• {f}</p>)}</div>}
                    </div>
                  )}

                  {/* Culture Fit */}
                  {activeTool === "culture-fit" && result.cultureType && (
                    <div className="space-y-3">
                      <p className="text-xl font-bold text-center text-primary-700">{result.cultureType}</p>
                      <p className="text-sm text-neutral-700 text-center">{result.workStyle}</p>
                      <div><p className="text-sm font-medium mb-1">Your traits:</p><div className="flex flex-wrap gap-2">{result.traits?.map((t: string) => <span key={t} className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">{t}</span>)}</div></div>
                      <div><p className="text-sm font-medium mb-1">Companies for you:</p>{result.idealCompanies?.map((c: string) => <span key={c} className="inline-block text-xs bg-neutral-100 px-2 py-1 rounded mr-2 mb-1">{c}</span>)}</div>
                      <p className="text-sm text-neutral-600 mt-2 italic">{result.advice}</p>
                    </div>
                  )}

                  {/* Market Trends */}
                  {activeTool === "market-trends" && result.hotSkills && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium">🔥 Hot Skills in Demand:</p>
                      <div className="flex flex-wrap gap-2">{result.hotSkills.map((s: string) => <span key={s} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">{s}</span>)}</div>
                      {result.topRoles && <div><p className="text-sm font-medium mt-3 mb-1">📈 Top Roles:</p>{result.topRoles.map((r: any, i: number) => <p key={i} className="text-sm">• {r.title} — {r.demand} demand, ~{r.avgSalary}</p>)}</div>}
                      {result.industryTrends && <div><p className="text-sm font-medium mt-3 mb-1">Trends:</p>{result.industryTrends.map((t: string, i: number) => <p key={i} className="text-sm text-neutral-700">• {t}</p>)}</div>}
                      <p className="text-sm mt-3 font-medium">Outlook: <span className={result.outlook === "positive" ? "text-green-600" : "text-yellow-600"}>{result.outlook}</span></p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
