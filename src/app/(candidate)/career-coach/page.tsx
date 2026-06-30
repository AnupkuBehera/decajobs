"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface Message {
  role: "user" | "coach";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "How do I transition from my current role to a senior position?",
  "What skills should I learn to increase my salary?",
  "How do I prepare for a career change?",
  "What's the best way to negotiate a job offer?",
  "How do I stand out in a competitive job market?",
  "Should I focus on specializing or being a generalist?",
];

export default function CareerCoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | undefined>(undefined);
  const [isPro, setIsPro] = useState(false);
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const messageText = text || input.trim();
    if (!messageText) return;

    setInput("");
    setError("");
    setNeedsUpgrade(false);

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/career-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: [...messages, userMessage].slice(-6),
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setNeedsUpgrade(true);
        setError(data.message);
        return;
      }

      if (res.status === 403) {
        setNeedsUpgrade(true);
        setError(data.message);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setMessages((prev) => [...prev, { role: "coach", content: data.reply }]);
      setRemaining(data.remaining);
      setIsPro(data.isPro);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] py-4">
      <div className="mx-auto w-full max-w-3xl flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="mb-4 shrink-0">
          <h1 className="text-2xl font-bold text-neutral-900">AI Career Coach</h1>
          <p className="text-sm text-neutral-500">
            Ask anything about your career — transitions, skills, salary, interviews, strategy.
            {remaining !== undefined && !isPro && (
              <span className="ml-2 text-amber-600 font-medium">
                {remaining} free question{remaining !== 1 ? "s" : ""} left today
              </span>
            )}
            {isPro && (
              <span className="ml-2 text-green-600 font-medium">Pro · Unlimited</span>
            )}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-4 space-y-4 min-h-0">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <div className="text-4xl mb-4">🎯</div>
              <p className="text-lg font-semibold text-neutral-900 mb-2">
                Your personal career mentor
              </p>
              <p className="text-sm text-neutral-500 max-w-md mb-6">
                I know your profile, skills, and goals. Ask me anything about
                your career — I'll give you specific, actionable advice.
              </p>
              <div className="grid gap-2 w-full max-w-md">
                {SUGGESTED_QUESTIONS.slice(0, 4).map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-left text-sm text-neutral-700 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary-600 text-white rounded-br-md"
                    : "bg-neutral-100 text-neutral-800 rounded-bl-md"
                }`}
              >
                {msg.role === "coach" && (
                  <span className="text-xs font-semibold text-primary-600 block mb-1">Career Coach</span>
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-neutral-100 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 shrink-0">
            <p className="text-sm text-red-700">{error}</p>
            {needsUpgrade && (
              <Link href="/subscribe" className="text-sm font-medium text-primary-600 hover:underline">
                Upgrade to Pro for unlimited coaching →
              </Link>
            )}
          </div>
        )}

        {/* Input */}
        <div className="mt-3 shrink-0">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your career coach anything..."
              rows={2}
              className="flex-1 rounded-xl border border-neutral-200 px-4 py-3 text-sm leading-relaxed resize-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
              disabled={isLoading || needsUpgrade}
            />
            <Button
              onClick={() => sendMessage()}
              isLoading={isLoading}
              disabled={!input.trim() || isLoading || needsUpgrade}
              className="self-end min-h-[52px] px-6"
            >
              Send
            </Button>
          </div>
          <p className="mt-2 text-xs text-neutral-400 text-center">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
