"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Question {
  question: string;
  questionType: string;
  difficulty: string;
  tip: string;
  questionNumber: number;
  totalQuestions: number;
}

interface Evaluation {
  score: number;
  maxScore: number;
  strengths: string[];
  improvements: string[];
  sampleAnswer: string;
  overallFeedback: string;
  questionNumber: number;
}

interface CompletedQuestion {
  question: Question;
  answer: string;
  evaluation: Evaluation;
}

export default function MockInterviewPage() {
  const searchParams = useSearchParams();
  const jobTitle = searchParams.get("title") || "";
  const jobDescription = searchParams.get("desc") || "";

  const [interviewType, setInterviewType] = useState<"technical" | "behavioral" | "mixed">("mixed");
  const [customTitle, setCustomTitle] = useState(jobTitle);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [currentEvaluation, setCurrentEvaluation] = useState<Evaluation | null>(null);
  const [completedQuestions, setCompletedQuestions] = useState<CompletedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsUpgrade, setNeedsUpgrade] = useState(false);

  const previousQuestions = completedQuestions.map((cq) => cq.question.question);

  async function startInterview() {
    if (!customTitle.trim()) {
      setError("Please enter a job title");
      return;
    }

    setIsLoading(true);
    setError("");
    setNeedsUpgrade(false);

    try {
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          jobTitle: customTitle,
          jobDescription,
          interviewType,
        }),
      });

      const data = await res.json();
      if (res.status === 403) { setNeedsUpgrade(true); setError(data.message); return; }
      if (!res.ok) { setError(data.error); return; }

      setCurrentQuestion(data);
      setIsStarted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function submitAnswer() {
    if (!answer.trim()) {
      setError("Please type your answer");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate",
          question: currentQuestion!.question,
          answer,
          jobTitle: customTitle,
          questionType: currentQuestion!.questionType,
          questionNumber: currentQuestion!.questionNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }

      setCurrentEvaluation(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function nextQuestion() {
    // Save completed Q&A
    if (currentQuestion && currentEvaluation) {
      setCompletedQuestions((prev) => [
        ...prev,
        { question: currentQuestion, answer, evaluation: currentEvaluation },
      ]);
    }

    const nextNum = (currentQuestion?.questionNumber || 1) + 1;

    // Check if interview is complete
    if (nextNum > (currentQuestion?.totalQuestions || 6)) {
      setIsFinished(true);
      setCurrentQuestion(null);
      setCurrentEvaluation(null);
      setAnswer("");
      return;
    }

    setIsLoading(true);
    setError("");
    setCurrentEvaluation(null);
    setAnswer("");

    try {
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "next",
          jobTitle: customTitle,
          jobDescription,
          interviewType,
          previousQuestions: [...previousQuestions, currentQuestion!.question],
          questionNumber: nextNum,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }

      setCurrentQuestion(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Calculate overall score
  const totalScore = completedQuestions.reduce((sum, cq) => sum + cq.evaluation.score, 0);
  const maxPossible = completedQuestions.length * 10;
  const overallPercentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;

  // --- SETUP SCREEN ---
  if (!isStarted) {
    return (
      <div className="py-6 sm:py-10">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <Link href="/my-daily-10" className="text-sm text-neutral-500 hover:text-primary-600">
              ← Back to My Daily 10
            </Link>
            <h1 className="mt-3 text-2xl font-bold text-neutral-900 sm:text-3xl">
              AI Mock Interview
            </h1>
            <p className="mt-2 text-neutral-600">
              Practice with an AI interviewer. Get scored and feedback in real-time.
            </p>
          </div>

          <Card>
            <div className="space-y-5">
              {/* Job Title */}
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-neutral-900 mb-1">
                  Job Title
                </label>
                <input
                  id="jobTitle"
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Senior React Developer"
                  className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                />
              </div>

              {/* Interview Type */}
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Interview Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["mixed", "technical", "behavioral"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setInterviewType(type)}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-medium capitalize transition-all min-h-[44px] ${
                        interviewType === type
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                      }`}
                    >
                      {type === "mixed" ? "🎯 Mixed" : type === "technical" ? "💻 Technical" : "🗣️ Behavioral"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="rounded-lg bg-neutral-50 border border-neutral-100 p-4">
                <p className="text-sm text-neutral-600">
                  <strong>How it works:</strong> The AI will ask you 6 questions, getting progressively harder.
                  Type your answers as if you&apos;re in a real interview. You&apos;ll get a score and detailed feedback after each one.
                </p>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-700">{error}</p>
                  {needsUpgrade && (
                    <Link href="/subscribe" className="text-sm font-medium text-primary-600 hover:underline">
                      Upgrade to Pro →
                    </Link>
                  )}
                </div>
              )}

              <Button onClick={startInterview} isLoading={isLoading} size="lg" className="w-full">
                {isLoading ? "Preparing interview..." : "Start Mock Interview 🎤"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // --- FINISHED SCREEN ---
  if (isFinished) {
    return (
      <div className="py-6 sm:py-10">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl text-center">
            Interview Complete! 🎉
          </h1>

          {/* Overall Score */}
          <Card className="mt-6 text-center border-primary-200 bg-primary-50">
            <p className="text-sm text-neutral-600">Overall Score</p>
            <p className="mt-1 text-5xl font-bold text-primary-600">{overallPercentage}%</p>
            <p className="mt-2 text-sm text-neutral-600">
              {totalScore}/{maxPossible} points across {completedQuestions.length} questions
            </p>
            <p className="mt-2 text-sm font-medium text-neutral-700">
              {overallPercentage >= 80
                ? "Excellent! You're well-prepared for this role."
                : overallPercentage >= 60
                ? "Good performance. Review the feedback to sharpen your answers."
                : "Keep practicing! Focus on the improvement areas below."}
            </p>
          </Card>

          {/* Question-by-question breakdown */}
          <div className="mt-6 space-y-4">
            {completedQuestions.map((cq, i) => (
              <Card key={i}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm font-medium text-neutral-900">Q{i + 1}: {cq.question.question}</p>
                  <Badge variant={cq.evaluation.score >= 7 ? "success" : cq.evaluation.score >= 5 ? "warning" : "default"}>
                    {cq.evaluation.score}/10
                  </Badge>
                </div>
                <p className="text-xs text-neutral-500 mb-2">{cq.evaluation.overallFeedback}</p>
                <details className="text-xs">
                  <summary className="cursor-pointer text-primary-600 hover:underline">View details</summary>
                  <div className="mt-2 space-y-2 text-neutral-600">
                    <p><strong>Your answer:</strong> {cq.answer.slice(0, 200)}{cq.answer.length > 200 ? "..." : ""}</p>
                    <p><strong>Strengths:</strong> {cq.evaluation.strengths.join(", ")}</p>
                    <p><strong>Improvements:</strong> {cq.evaluation.improvements.join(", ")}</p>
                  </div>
                </details>
              </Card>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => { setIsStarted(false); setIsFinished(false); setCompletedQuestions([]); }}>
              Practice Again
            </Button>
            <Link href="/my-daily-10" className="text-sm text-neutral-500 hover:text-primary-600 underline">
              Back to My Daily 10
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- INTERVIEW IN PROGRESS ---
  return (
    <div className="py-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        {/* Progress */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Question {currentQuestion?.questionNumber} of {currentQuestion?.totalQuestions}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="default">{currentQuestion?.questionType}</Badge>
            <Badge variant={currentQuestion?.difficulty === "hard" ? "warning" : "default"}>
              {currentQuestion?.difficulty}
            </Badge>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-2 rounded-full bg-neutral-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary-500 transition-all duration-500"
            style={{ width: `${((currentQuestion?.questionNumber || 1) / (currentQuestion?.totalQuestions || 6)) * 100}%` }}
          />
        </div>

        {/* Question */}
        <Card className="mb-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold">
              AI
            </div>
            <div>
              <p className="text-base font-medium text-neutral-900 leading-relaxed">
                {currentQuestion?.question}
              </p>
              <p className="mt-2 text-xs text-neutral-400">
                💡 Tip: {currentQuestion?.tip}
              </p>
            </div>
          </div>
        </Card>

        {/* Answer or Evaluation */}
        {!currentEvaluation ? (
          <>
            <div className="mb-4">
              <label htmlFor="answer" className="block text-sm font-medium text-neutral-700 mb-1">
                Your Answer
              </label>
              <textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
                placeholder="Type your answer as if you're in a real interview..."
                className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm leading-relaxed focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none resize-none"
              />
              <p className="mt-1 text-xs text-neutral-400">
                {answer.length} characters · Aim for 100-300 words for a good answer
              </p>
            </div>

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            <Button onClick={submitAnswer} isLoading={isLoading} size="lg" className="w-full">
              {isLoading ? "Evaluating..." : "Submit Answer →"}
            </Button>
          </>
        ) : (
          <>
            {/* Evaluation */}
            <Card className="mb-4 border-green-200 bg-green-50">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-neutral-900">Score</p>
                <span className="text-2xl font-bold text-primary-600">
                  {currentEvaluation.score}/{currentEvaluation.maxScore}
                </span>
              </div>
              <p className="text-sm text-neutral-700">{currentEvaluation.overallFeedback}</p>
            </Card>

            {/* Strengths */}
            <Card className="mb-4">
              <CardTitle className="mb-2 text-sm">✅ Strengths</CardTitle>
              <ul className="space-y-1">
                {currentEvaluation.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-neutral-700 flex items-start gap-2">
                    <span className="text-green-500 shrink-0">•</span>{s}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Improvements */}
            <Card className="mb-4">
              <CardTitle className="mb-2 text-sm">💡 Improvements</CardTitle>
              <ul className="space-y-1">
                {currentEvaluation.improvements.map((s, i) => (
                  <li key={i} className="text-sm text-neutral-700 flex items-start gap-2">
                    <span className="text-amber-500 shrink-0">•</span>{s}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Sample answer */}
            <Card className="mb-6">
              <CardTitle className="mb-2 text-sm">🎯 Ideal Answer Example</CardTitle>
              <p className="text-sm text-neutral-600 italic leading-relaxed">
                &ldquo;{currentEvaluation.sampleAnswer}&rdquo;
              </p>
            </Card>

            <Button onClick={nextQuestion} isLoading={isLoading} size="lg" className="w-full">
              {isLoading
                ? "Loading..."
                : (currentQuestion?.questionNumber || 1) >= (currentQuestion?.totalQuestions || 6)
                ? "Finish Interview 🎉"
                : "Next Question →"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
