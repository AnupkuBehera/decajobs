import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/subscription/check", () => ({
  checkSubscription: vi.fn(),
}));

vi.mock("@/lib/gemini/client", () => ({
  callGemini: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import { checkSubscription } from "@/lib/subscription/check";
import { callGemini } from "@/lib/gemini/client";

describe("AI Mock Interview API (POST /api/mock-interview)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("allows unauthenticated guest to start Question 1 in demo mode", async () => {
    (createClient as any).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    });

    (callGemini as any).mockResolvedValue(
      JSON.stringify({
        greeting: "Hi, I'm Sarah Mitchell.",
        question: "Tell me about a complex distributed system you designed.",
        questionType: "technical",
        difficulty: "hard",
        tip: "Highlight trade-offs and latency considerations.",
        questionNumber: 1,
        totalQuestions: 5,
      })
    );

    const req = new Request("https://decajob.com/api/mock-interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "start",
        jobTitle: "Senior Systems Engineer",
        personaId: "tech-lead",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.isDemo).toBe(true);
    expect(data.questionNumber).toBe(1);
    expect(data.question).toContain("distributed system");
  });

  it("allows unauthenticated guest to evaluate Question 1 in demo mode", async () => {
    (createClient as any).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    });

    (callGemini as any).mockResolvedValue(
      JSON.stringify({
        score: 9,
        maxScore: 10,
        strengths: ["Clear breakdown of consensus algorithms"],
        improvements: ["State throughput metrics earlier"],
        starBreakdown: {
          situation: "High latency in cluster",
          task: "Re-architect raft replication",
          action: "Implemented batched pipelining",
          result: "Latency reduced by 42%",
        },
        followupProbe: "How did you monitor network partition splits?",
        sampleAnswer: "We isolated nodes and monitored leader election heartbeat.",
        overallFeedback: "Excellent architectural grasp.",
      })
    );

    const req = new Request("https://decajob.com/api/mock-interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "evaluate",
        jobTitle: "Senior Systems Engineer",
        question: "Tell me about a complex distributed system you designed.",
        answer: "Basically we had high latency and basically we rearchitected raft replication.",
        questionNumber: 1,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.isDemo).toBe(true);
    expect(data.score).toBe(9);
    expect(data.fillerCount).toBeGreaterThanOrEqual(2); // "basically" x2
    expect(data.starBreakdown.situation).toBeDefined();
  });

  it("blocks unauthenticated guest from advancing to Question 2 with auth_required", async () => {
    (createClient as any).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    });

    const req = new Request("https://decajob.com/api/mock-interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "next",
        jobTitle: "Senior Systems Engineer",
        questionNumber: 2,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data.error).toBe("auth_required");
    expect(data.isDemo).toBe(true);
  });

  it("allows authenticated Pro candidate to fetch Question 2", async () => {
    (createClient as any).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "candidate-123" } } }),
      },
    });

    (checkSubscription as any).mockResolvedValue({
      hasAccess: true,
      tier: "pro",
    });

    (callGemini as any).mockResolvedValue(
      JSON.stringify({
        question: "How do you handle zero-downtime database schema migrations?",
        questionType: "technical",
        difficulty: "hard",
        tip: "Describe expand and contract patterns.",
        questionNumber: 2,
        totalQuestions: 5,
      })
    );

    const req = new Request("https://decajob.com/api/mock-interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "next",
        jobTitle: "Senior Systems Engineer",
        questionNumber: 2,
        previousQuestions: ["Tell me about a complex distributed system you designed."],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.questionNumber).toBe(2);
    expect(data.question).toContain("schema migrations");
  });
});
