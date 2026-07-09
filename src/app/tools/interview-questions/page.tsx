"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function InterviewQuestionsPage() {
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<{ question: string; tip: string }[]>([]);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!role.trim()) { setError("Please enter a job role."); return; }
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tools/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await response.json();
      if (!response.ok) { setError(data.error || "Failed. Try again."); }
      else { setQuestions(data.questions); }
    } catch { setError("Network error."); }
    finally { setIsLoading(false); }
  }

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">AI Interview Prep</h1>
          <p className="mt-3 text-neutral-600">Get role-specific interview questions with expert tips. Free, no login.</p>
        </div>

        <Card padding="lg">
          <label className="block text-sm font-medium text-neutral-700 mb-1">What role are you interviewing for?</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Data Analyst, React Developer, Product Manager"
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
            <Button onClick={handleGenerate} isLoading={isLoading}>Generate</Button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </Card>

        {questions.length > 0 && (
          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold">Top Interview Questions for {role}</h2>
            {questions.map((q, i) => (
              <Card key={i} padding="md">
                <p className="font-medium text-neutral-900">Q{i + 1}: {q.question}</p>
                <p className="mt-2 text-sm text-neutral-600 bg-green-50 rounded-lg p-3">
                  <strong>💡 Tip:</strong> {q.tip}
                </p>
              </Card>
            ))}

            <Card padding="lg" className="text-center bg-primary-50 border-primary-200">
              <p className="font-semibold">Want more? Get daily job matches + full interview prep.</p>
              <Link href="/login" className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 min-h-[44px]">
                Sign Up Free →
              </Link>
            </Card>
          </div>
        )}

        <div className="mt-16 border-t border-neutral-200 pt-12 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">How to Crack Your Next Job Interview</h2>
          <p className="text-neutral-600 leading-relaxed">
            Interviews can be stressful, but preparation is the ultimate antidote to anxiety. By understanding the common interview frameworks and practicing your responses, you can demonstrate your fit for the role with clarity and confidence.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">Mastering the STAR Method for Behavioral Questions</h3>
          <p className="text-neutral-600 leading-relaxed">
            Behavioral questions (e.g., &quot;Tell me about a time you failed&quot;) are designed to evaluate how you handle real-world challenges. The STAR framework keeps your answers structured and goal-oriented:
          </p>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2">
            <li><strong>Situation:</strong> Describe the context of the story, outlining the project, client, or team setting. Keep it brief.</li>
            <li><strong>Task:</strong> Explain the specific challenge or problem you needed to address. What was your personal responsibility?</li>
            <li><strong>Action:</strong> Detail the actions you took to solve the problem. Use &quot;I&quot; statements rather than &quot;we&quot; to highlight your direct contribution.</li>
            <li><strong>Result:</strong> Share the concrete, measurable outcome. Did you save time, increase sales, or solve a bug? Use numbers wherever possible.</li>
          </ul>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">5 Steps to Prepare for Any Technical or Management Role</h3>
          <div className="space-y-4 my-6">
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">1. Research the company & culture</h4>
              <p className="text-sm text-neutral-600 mt-1">Look up the company&apos;s recent news, product offerings, and values. Read their blog or reviews on Glassdoor to understand what they look for in successful candidates.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">2. Review the job description line-by-line</h4>
              <p className="text-sm text-neutral-600 mt-1">Every skill or responsibility listed is a potential interview question. Prepare a specific project or story from your past that proves you have experience with that skill.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">3. Practice mock interviews out loud</h4>
              <p className="text-sm text-neutral-600 mt-1">Do not just think about your answers. Practice speaking them out loud, or conduct a mock interview with a friend or our AI tools to improve your pacing and delivery.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">4. Prepare questions for the interviewers</h4>
              <p className="text-sm text-neutral-600 mt-1">At the end of the interview, always ask questions. It shows interest and helps you assess if the company is a good fit. Example: &quot;What does success look like in this role in the first 90 days?&quot;</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">5. Follow up with a thank-you note</h4>
              <p className="text-sm text-neutral-600 mt-1">Send a brief, personalized thank-you email to each interviewer within 24 hours. Reiterate your interest and reference a specific topic you discussed.</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">Frequently Asked Questions (FAQs)</h3>
          <div className="space-y-4">
            <details className="group border-b border-neutral-200 pb-4">
              <summary className="flex cursor-pointer justify-between items-center font-medium text-neutral-900">
                How should I answer &quot;What are your weaknesses?&quot;
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-neutral-600 mt-2">
                Choose a genuine, minor professional weakness (not a cliché like &quot;I work too hard&quot; or a red flag like &quot;I don&apos;t work well in teams&quot;). Immediately pivot to explaining the steps you have taken to improve. Example: &quot;I used to struggle with public speaking, so I joined a local Toastmasters club and volunteered to lead team demos to build my confidence.&quot;
              </p>
            </details>
            <details className="group border-b border-neutral-200 pb-4">
              <summary className="flex cursor-pointer justify-between items-center font-medium text-neutral-900">
                What should I do if I don&apos;t know the answer to a technical question?
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-neutral-600 mt-2">
                Do not try to guess or lie. Be honest and walk the interviewer through your thought process: &quot;I haven&apos;t worked with that specific tool, but based on my experience with similar technology, I would approach it by...&quot; Interviewers value problem-solving skills and honesty over memorization.
              </p>
            </details>
            <details className="group border-b border-neutral-200 pb-4">
              <summary className="flex cursor-pointer justify-between items-center font-medium text-neutral-900">
                How long should my interview answers be?
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-neutral-600 mt-2">
                For behavioral questions, aim for answers between 90 seconds and 3 minutes. If your answer is too short, you might leave out critical context; if it is too long, the interviewer might lose focus. Use the STAR method to keep your answers concise.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
