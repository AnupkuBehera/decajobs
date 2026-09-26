import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini/client";

export async function POST(request: Request) {
  try {
    const { role } = await request.json();
    if (!role) return NextResponse.json({ error: "Role is required" }, { status: 400 });

    const prompt = `Generate 3 common interview questions for a "${role}" position. For each question, provide a brief answering tip (1-2 sentences).

Respond in this exact JSON format (no markdown):
{"questions":[{"question":"...","tip":"..."},{"question":"...","tip":"..."},{"question":"...","tip":"..."}],"isLimited":true,"upgradeMessage":"Sign up to get 8+ questions with detailed answers."}`;

    try {
      const result = await callGemini(prompt);
      const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    } catch {
      // High-quality deterministic fallback when Gemini is rate-limited or busy
      return NextResponse.json(getFallbackQuestions(role));
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

function getFallbackQuestions(role: string) {
  const r = role.toLowerCase();

  if (r.includes("data") || r.includes("analyst") || r.includes("scientist") || r.includes("ml")) {
    return {
      questions: [
        {
          question: `Walk me through how you approach a data cleaning pipeline when encountering missing or corrupted values in a ${role} workflow.`,
          tip: "Structure using STAR: explain your detection method, statistical imputation rationale, and the final impact on business KPI accuracy.",
        },
        {
          question: "How do you explain complex analytical findings or statistical models to non-technical executive stakeholders?",
          tip: "Focus on business narrative, visual executive dashboards, and actionable takeaways rather than raw statistical jargon.",
        },
        {
          question: "Describe a project where you optimized an expensive SQL query or heavy database operation.",
          tip: "Discuss indexing, execution plans, partition pruning, and concrete percentage reductions in runtime or cloud computing cost.",
        },
      ],
      isLimited: true,
      upgradeMessage: "Sign up to get 8+ questions with detailed answers.",
    };
  }

  if (r.includes("devops") || r.includes("cloud") || r.includes("sre") || r.includes("infra")) {
    return {
      questions: [
        {
          question: `How do you design a zero-downtime deployment strategy for a high-traffic microservices cluster as a ${role}?`,
          tip: "Mention blue/green or canary rollouts, automated health checks, and fast rollback mechanics using Kubernetes or CI/CD pipelines.",
        },
        {
          question: "Describe a time when production experienced an unexpected outage. How did you triage, resolve, and document it?",
          tip: "Demonstrate calm root-cause analysis (RCA), observability metrics (logs/traces), incident communication, and preventative post-mortem measures.",
        },
        {
          question: "How do you manage Infrastructure as Code (IaC) drift across staging and production environments?",
          tip: "Explain state locking, automated Terraform plans via CI/CD, and policy enforcement tools.",
        },
      ],
      isLimited: true,
      upgradeMessage: "Sign up to get 8+ questions with detailed answers.",
    };
  }

  if (r.includes("product") || r.includes("owner") || r.includes("pm")) {
    return {
      questions: [
        {
          question: `How do you prioritize competing feature requests from sales, leadership, and engineering in your ${role} roadmap?`,
          tip: "Reference a framework like RICE (Reach, Impact, Confidence, Effort) and explain how data metrics and customer validation guide trade-offs.",
        },
        {
          question: "Tell me about a time a product launch didn't meet expected adoption metrics. What did you learn and pivot?",
          tip: "Show intellectual honesty: analyze conversion funnel bottlenecks, cohort feedback, and rapid iterative pivoting.",
        },
        {
          question: "How do you foster alignment between engineering velocity and user research needs?",
          tip: "Discuss sprint planning rituals, customer journey mapping, and lightweight technical discovery spikes.",
        },
      ],
      isLimited: true,
      upgradeMessage: "Sign up to get 8+ questions with detailed answers.",
    };
  }

  if (r.includes("design") || r.includes("ux") || r.includes("ui")) {
    return {
      questions: [
        {
          question: `Walk through your end-to-end design process from problem discovery to final developer handoff for this ${role} role.`,
          tip: "Emphasize user research, wireframing, usability testing, and atomic design system component consistency.",
        },
        {
          question: "How do you handle disagreement when an engineer or executive pushes back on a UX interaction?",
          tip: "Anchor your arguments in user testing data, accessibility standards (WCAG), and collaborative compromises.",
        },
        {
          question: "Describe how you measure the qualitative and quantitative success of a newly redesigned workflow.",
          tip: "Cite specific UX metrics like Task Completion Rate, Time on Task, SUS score, and business funnel conversion lift.",
        },
      ],
      isLimited: true,
      upgradeMessage: "Sign up to get 8+ questions with detailed answers.",
    };
  }

  if (r.includes("marketing") || r.includes("sales") || r.includes("growth") || r.includes("seo")) {
    return {
      questions: [
        {
          question: `What strategies have you used as a ${role} to scale qualified pipeline while maintaining sustainable CAC?`,
          tip: "Highlight multi-touch attribution, SEO content clusters, paid campaign optimization, and CRO experiments.",
        },
        {
          question: "Tell me about a challenging customer objection or stalled deal you successfully navigated to close an agreement.",
          tip: "Use STAR to explain how you uncovered the buyer's underlying fear, demonstrated clear ROI, and negotiated win-win terms.",
        },
        {
          question: "How do you align top-of-funnel marketing campaigns with product retention and customer lifetime value (LTV)?",
          tip: "Discuss lifecycle nurture sequences, product-qualified leads (PQLs), and tight feedback loops with customer success.",
        },
      ],
      isLimited: true,
      upgradeMessage: "Sign up to get 8+ questions with detailed answers.",
    };
  }

  // Engineering & General default
  return {
    questions: [
      {
        question: `Tell me about a technically challenging bug or blocker you encountered in a ${role} project and how you diagnosed it.`,
        tip: "Walk through your diagnostic process systematically: reproducing the issue, inspecting telemetry logs, identifying the root cause, and deploying a unit-tested fix.",
      },
      {
        question: "How do you balance shipping fast product features with managing technical debt and code quality?",
        tip: "Explain how you advocate for pragmatic refactoring, automated CI/CD testing, and modular architecture without stalling business momentum.",
      },
      {
        question: "Describe an architectural decision you made that significantly improved application performance or team velocity.",
        tip: "Quantify the outcome: mention caching strategies, query optimizations, latency reductions, or developer workflow improvements.",
      },
    ],
    isLimited: true,
    upgradeMessage: "Sign up to get 8+ questions with detailed answers.",
  };
}
