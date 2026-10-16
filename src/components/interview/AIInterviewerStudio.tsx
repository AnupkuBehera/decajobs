"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  INTERVIEWER_PERSONAS,
  getPersonaById,
  type InterviewerPersona,
} from "@/lib/interview/personas";
import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  BrowserSpeechRecognizer,
  speakText,
  stopSpeaking,
} from "@/lib/interview/speech";
import {
  PerformanceScorecard,
  type ScorecardData,
} from "@/components/interview/PerformanceScorecard";
import * as gtag from "@/lib/gtag";

interface QuestionData {
  greeting?: string;
  question: string;
  questionType: string;
  difficulty: string;
  tip: string;
  questionNumber: number;
  totalQuestions: number;
}

interface EvaluationData {
  score: number;
  maxScore: number;
  strengths: string[];
  improvements: string[];
  starBreakdown?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  followupProbe?: string;
  sampleAnswer: string;
  overallFeedback: string;
  questionNumber: number;
  fillerCount?: number;
}

interface CompletedItem {
  question: QuestionData;
  answer: string;
  evaluation: EvaluationData;
}

export function AIInterviewerStudio() {
  const searchParams = useSearchParams();
  const initialTitle = searchParams.get("title") || "Software Engineer";
  const initialCompany = searchParams.get("company") || "";
  const initialDesc = searchParams.get("desc") || "";

  // Configuration state
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("tech-lead");
  const [jobTitle, setJobTitle] = useState(initialTitle);
  const [interviewType, setInterviewType] = useState<"technical" | "behavioral" | "mixed">("mixed");

  // Flow state
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [answer, setAnswer] = useState("");
  const [currentEvaluation, setCurrentEvaluation] = useState<EvaluationData | null>(null);
  const [completedItems, setCompletedItems] = useState<CompletedItem[]>([]);
  const [scorecard, setScorecard] = useState<ScorecardData | null>(null);

  // Audio / Speech state
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioSupported, setAudioSupported] = useState(false);
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [timerSeconds, setTimerSeconds] = useState(120);

  // Status state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsUpgrade, setNeedsUpgrade] = useState(false);

  const recognizerRef = useRef<BrowserSpeechRecognizer | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const persona = getPersonaById(selectedPersonaId);

  // Check speech recognition support on mount
  useEffect(() => {
    setAudioSupported(isSpeechRecognitionSupported());
  }, []);

  // Timer countdown while recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            handleStopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      recognizerRef.current?.stop();
    };
  }, []);

  // Start speech recognition handler
  const handleStartRecording = () => {
    stopSpeaking();
    setError("");
    setTimerSeconds(120);

    if (!recognizerRef.current) {
      recognizerRef.current = new BrowserSpeechRecognizer({
        onTranscript: (transcript) => {
          setAnswer(transcript);
        },
        onError: (err) => {
          setError(`Microphone error: ${err}. You can type your answer instead.`);
          setIsRecording(false);
        },
        onStateChange: (listening) => {
          setIsRecording(listening);
        },
      });
    }

    recognizerRef.current.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
    }
    setIsRecording(false);
  };

  // Play question with speech synthesis
  const handlePlayQuestionAudio = (text: string) => {
    if (!isSpeechSynthesisSupported()) return;
    setIsSpeakingQuestion(true);
    speakText(text, {
      onEnd: () => setIsSpeakingQuestion(false),
    });
  };

  // 1. Start Interview
  const handleStartInterview = async () => {
    if (!jobTitle.trim()) {
      setError("Please enter target role or job title");
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
          personaId: selectedPersonaId,
          jobTitle: jobTitle.trim(),
          jobDescription: initialDesc,
          interviewType,
        }),
      });

      const data = await res.json();
      if (res.status === 403) {
        setNeedsUpgrade(true);
        setError(data.message || "Upgrade to Pro to practice unlimited AI mock interviews.");
        return;
      }
      if (!res.ok) {
        setError(data.error || "Failed to start interview.");
        return;
      }

      setCurrentQuestion(data);
      setIsStarted(true);
      gtag.trackFunnelEvent("ai_interview_started", { role: jobTitle, persona: selectedPersonaId });

      // Automatically speak the question aloud
      const speakIntro = `${data.greeting || ""} ${data.question}`;
      handlePlayQuestionAudio(speakIntro);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Submit Answer for Evaluation
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      setError("Please provide an answer (speak into the mic or type).");
      return;
    }

    handleStopRecording();
    stopSpeaking();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate",
          personaId: selectedPersonaId,
          jobTitle,
          question: currentQuestion!.question,
          answer: answer.trim(),
          questionType: currentQuestion!.questionType,
          questionNumber: currentQuestion!.questionNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to evaluate answer.");
        return;
      }

      setCurrentEvaluation(data);

      // Play feedback audio snippet
      if (data.overallFeedback) {
        handlePlayQuestionAudio(data.overallFeedback);
      }
    } catch {
      setError("Network error while evaluating answer.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Move to Next Question or Finalize
  const handleNextQuestion = async () => {
    stopSpeaking();

    // Save completed item
    const updatedCompleted: CompletedItem[] = [
      ...completedItems,
      {
        question: currentQuestion!,
        answer,
        evaluation: currentEvaluation!,
      },
    ];
    setCompletedItems(updatedCompleted);
    setAnswer("");
    setCurrentEvaluation(null);

    const nextQNum = (currentQuestion?.questionNumber || 1) + 1;
    const totalQ = currentQuestion?.totalQuestions || 5;

    if (nextQNum > totalQ) {
      // Finalize Interview
      setIsLoading(true);
      try {
        const res = await fetch("/api/mock-interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "finish",
            personaId: selectedPersonaId,
            jobTitle,
            completedQuestions: updatedCompleted,
          }),
        });
        const data = await res.json();
        setScorecard(data);
        setIsFinished(true);
        gtag.trackFunnelEvent("ai_interview_completed", { role: jobTitle, score: data.readinessScore });
      } catch {
        setError("Error generating final scorecard.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Fetch Next Question
    setIsLoading(true);
    try {
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "next",
          personaId: selectedPersonaId,
          jobTitle,
          jobDescription: initialDesc,
          interviewType,
          previousQuestions: updatedCompleted.map((c) => c.question.question),
          questionNumber: nextQNum,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load next question.");
        return;
      }

      setCurrentQuestion(data);
      handlePlayQuestionAudio(data.question);
    } catch {
      setError("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    stopSpeaking();
    setIsStarted(false);
    setIsFinished(false);
    setCurrentQuestion(null);
    setAnswer("");
    setCurrentEvaluation(null);
    setCompletedItems([]);
    setScorecard(null);
  };

  // Render Finished Scorecard
  if (isFinished && scorecard) {
    return (
      <PerformanceScorecard
        scorecard={scorecard}
        persona={persona}
        jobTitle={jobTitle}
        completedQuestions={completedItems}
        onRestart={handleRestart}
      />
    );
  }

  // Pre-Interview Setup Screen
  if (!isStarted) {
    return (
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1 text-xs font-semibold text-primary-800 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-primary-600 animate-pulse" />
            AI Voice Interview Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Interactive AI Mock Interviewer
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto">
            Practice realistic phone &amp; video screens with spoken audio, live voice dictation, adaptive follow-up probing, and STAR method scoring.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-700">
            {error}
            {needsUpgrade && (
              <div className="mt-2">
                <Link
                  href="/subscribe"
                  className="font-bold text-red-900 underline hover:no-underline"
                >
                  Upgrade to DecaJobs Pro for unlimited mock interviews →
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
          {/* Persona Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
              1. Select Your Interviewer Persona:
            </label>
            <div className="grid gap-3 sm:grid-cols-3">
              {INTERVIEWER_PERSONAS.map((p) => {
                const isSelected = selectedPersonaId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPersonaId(p.id)}
                    className={`rounded-2xl border p-4 text-left transition-all relative ${
                      isSelected
                        ? "border-primary-600 bg-primary-50/40 ring-2 ring-primary-500/20 shadow-md"
                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{p.avatarEmoji}</span>
                      <div>
                        <div className="text-sm font-bold text-neutral-900">{p.name}</div>
                        <div className="text-[11px] font-medium text-neutral-500 line-clamp-1">
                          {p.role}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2.5 text-xs text-neutral-600 leading-relaxed">
                      {p.description}
                    </p>
                    <div className="mt-2 text-[10px] font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md inline-block">
                      {p.specialty.split(",")[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role & Interview Type */}
          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                2. Target Role / Job Title:
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer, Product Manager"
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              {initialCompany && (
                <p className="text-[11px] text-neutral-400 mt-1">
                  Practicing for role at <strong className="text-neutral-700">{initialCompany}</strong>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                3. Interview Format:
              </label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value as any)}
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="mixed">Mixed (Technical Depth + STAR Behavioral)</option>
                <option value="technical">Technical Architecture &amp; System Design</option>
                <option value="behavioral">Behavioral &amp; Leadership Principles (STAR)</option>
              </select>
            </div>
          </div>

          {/* Start CTA */}
          <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="text-base">🎙️</span>
              <span>Microphone &amp; audio supported in your browser</span>
            </div>

            <Button
              onClick={handleStartInterview}
              disabled={isLoading}
              className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-primary-700"
            >
              {isLoading ? "Connecting to Interviewer..." : `Start Interview with ${persona.name} →`}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Active Interview Room
  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      {/* Top Header Room Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white text-lg">
            {persona.avatarEmoji}
          </div>
          <div>
            <div className="text-sm font-bold text-neutral-900">
              {persona.name} <span className="text-xs text-neutral-400 font-normal">({persona.role})</span>
            </div>
            <div className="text-xs text-neutral-500 font-medium">
              Practicing for <strong className="text-neutral-800">{jobTitle}</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700 border border-primary-200">
            Question {currentQuestion?.questionNumber} of {currentQuestion?.totalQuestions}
          </span>
          <Button onClick={handleRestart} variant="ghost" size="sm" className="text-xs text-neutral-500">
            Leave ✕
          </Button>
        </div>
      </div>

      {/* Interviewer Question Stage */}
      <div className="relative overflow-hidden rounded-3xl border border-primary-500/20 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-850 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-primary-200">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              {currentQuestion?.questionType?.toUpperCase() || "INTERVIEW QUESTION"}
            </div>
            <h2 className="text-lg sm:text-xl font-bold leading-relaxed text-white">
              &ldquo;{currentQuestion?.question}&rdquo;
            </h2>
            {currentQuestion?.tip && (
              <p className="text-xs text-neutral-400 italic">
                💡 Hint: {currentQuestion.tip}
              </p>
            )}
          </div>

          {/* Listen Again / Audio Waveform */}
          <button
            type="button"
            onClick={() => handlePlayQuestionAudio(currentQuestion?.question || "")}
            className={`shrink-0 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
              isSpeakingQuestion
                ? "bg-cyan-500 text-neutral-950 shadow-md ring-2 ring-cyan-400"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <span>{isSpeakingQuestion ? "🔊 Speaking..." : "🔊 Listen"}</span>
          </button>
        </div>
      </div>

      {/* Answer Area: Voice or Text */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-lg space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Your Answer:
            </span>
            {isRecording && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700 animate-pulse">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                Listening... {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, "0")}
              </span>
            )}
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center rounded-lg bg-neutral-100 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setInputMode("voice")}
              className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                inputMode === "voice" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              🎙️ Voice
            </button>
            <button
              type="button"
              onClick={() => {
                handleStopRecording();
                setInputMode("text");
              }}
              className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                inputMode === "text" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              ⌨️ Text
            </button>
          </div>
        </div>

        {/* Voice Input Experience */}
        {inputMode === "voice" ? (
          <div className="space-y-4 text-center">
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50">
              <button
                type="button"
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`flex h-20 w-20 items-center justify-center rounded-full text-3xl shadow-xl transition-all ${
                  isRecording
                    ? "bg-red-600 text-white animate-pulse ring-4 ring-red-400/40 hover:bg-red-700"
                    : "bg-primary-600 text-white hover:bg-primary-700 hover:scale-105"
                }`}
                title={isRecording ? "Click to stop recording" : "Click to speak answer"}
              >
                {isRecording ? "⏹" : "🎙️"}
              </button>
              <p className="mt-3 text-xs font-semibold text-neutral-700">
                {isRecording ? "Listening to your answer... Click to Stop" : "Click microphone to speak your answer"}
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Speak clearly into your microphone as you would in a real interview screen.
              </p>
            </div>

            {/* Live Transcription Box */}
            <div className="text-left">
              <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                Live Speech Transcription:
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your spoken words will appear here in real-time... (or type directly to edit)"
                rows={4}
                className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>
        ) : (
          <div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your comprehensive answer here..."
              rows={6}
              className="w-full rounded-xl border border-neutral-300 p-3.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        )}

        {/* Submit Answer Action */}
        {!currentEvaluation && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              onClick={handleSubmitAnswer}
              disabled={isLoading || !answer.trim()}
              className="rounded-xl bg-primary-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-primary-700 disabled:opacity-50"
            >
              {isLoading ? "Interviewer Evaluating..." : "Submit Answer for Review →"}
            </Button>
          </div>
        )}

        {/* Interim Feedback Card */}
        {currentEvaluation && (
          <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50/40 p-5 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-primary-200/60">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <span className="font-bold text-neutral-900 text-sm">
                  Answer Score: {currentEvaluation.score}/10
                </span>
              </div>
              {currentEvaluation.fillerCount !== undefined && currentEvaluation.fillerCount > 0 && (
                <span className="text-[11px] rounded-md bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">
                  {currentEvaluation.fillerCount} filler words detected
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
              &ldquo;{currentEvaluation.overallFeedback}&rdquo;
            </p>

            {/* Adaptive Follow-up Probe */}
            {currentEvaluation.followupProbe && (
              <div className="rounded-xl border border-cyan-200 bg-cyan-50/70 p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-900 mb-1">
                  <span>💬</span> Adaptive Follow-up Probe from {persona.name}:
                </div>
                <p className="text-xs text-cyan-950 font-medium">
                  &ldquo;{currentEvaluation.followupProbe}&rdquo;
                </p>
              </div>
            )}

            {/* Strengths & Improvements */}
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-white p-3 border border-emerald-150">
                <span className="font-bold text-emerald-800 block mb-1">Strengths:</span>
                <ul className="space-y-1 text-emerald-950">
                  {currentEvaluation.strengths.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-white p-3 border border-amber-150">
                <span className="font-bold text-amber-800 block mb-1">Coaching Points:</span>
                <ul className="space-y-1 text-amber-950">
                  {currentEvaluation.improvements.map((imp, i) => (
                    <li key={i}>• {imp}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Ideal Answer */}
            <div className="rounded-lg bg-white p-3 border border-neutral-200 text-xs text-neutral-600">
              <span className="font-bold text-neutral-800 block mb-1">Ideal Model Answer:</span>
              <p className="italic">&ldquo;{currentEvaluation.sampleAnswer}&rdquo;</p>
            </div>

            {/* Next Question CTA */}
            <div className="pt-2 flex justify-end">
              <Button
                onClick={handleNextQuestion}
                disabled={isLoading}
                className="rounded-xl bg-neutral-900 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-neutral-800"
              >
                {isLoading
                  ? "Loading..."
                  : currentQuestion?.questionNumber === currentQuestion?.totalQuestions
                    ? "Generate Final Scorecard 🏆"
                    : "Next Interview Question →"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
