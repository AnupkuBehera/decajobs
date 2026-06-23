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
      </div>
    </div>
  );
}
