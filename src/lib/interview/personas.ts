export interface InterviewerPersona {
  id: string;
  name: string;
  role: string;
  companyArchetype: string;
  avatarEmoji: string;
  avatarBg: string;
  specialty: string;
  description: string;
  tone: string;
  probeStyle: string;
}

export const INTERVIEWER_PERSONAS: InterviewerPersona[] = [
  {
    id: "tech-lead",
    name: "Sarah Mitchell",
    role: "Senior Staff Engineer & Tech Lead",
    companyArchetype: "FAANG / High-Scale Unicorns",
    avatarEmoji: "👩‍💻",
    avatarBg: "bg-indigo-600",
    specialty: "System Design, Algorithms & Coding Architecture",
    description:
      "Deeply evaluates technical depth, concurrency, latency trade-offs, and microservices architecture.",
    tone: "Analytical, sharp, and focused on engineering excellence",
    probeStyle:
      "Probes for scale limitations, failure modes, error handling, and database indexing choices.",
  },
  {
    id: "hr-director",
    name: "David Chen",
    role: "Executive Talent Acquisition Director",
    companyArchetype: "Global Tech Enterprise (Amazon/Microsoft style)",
    avatarEmoji: "👨‍💼",
    avatarBg: "bg-emerald-600",
    specialty: "STAR Method Behavioral & Leadership Principles",
    description:
      "Measures high-stakes communication, ownership under pressure, conflict resolution, and teamwork.",
    tone: "Engaging, professional, and looking for concrete demonstrated impact",
    probeStyle:
      "Probes for the specific 'Action' you took and measurable 'Result' (metrics, revenue, timeline).",
  },
  {
    id: "product-vp",
    name: "Priya Sharma",
    role: "VP of Product & Growth",
    companyArchetype: "Product-Led Unicorns (Stripe/Uber/Swiggy)",
    avatarEmoji: "👩‍💼",
    avatarBg: "bg-purple-600",
    specialty: "Product Sense, User Empathy & Strategic Roadmapping",
    description:
      "Tests cross-functional product intuition, user discovery, conversion funnels, and prioritization.",
    tone: "Strategic, metric-driven, and user-centric",
    probeStyle:
      "Probes for how you validated hypotheses, prioritized trade-offs, and measured business ROI.",
  },
];

export function getPersonaById(id: string): InterviewerPersona {
  return (
    INTERVIEWER_PERSONAS.find((p) => p.id === id) || INTERVIEWER_PERSONAS[0]
  );
}
