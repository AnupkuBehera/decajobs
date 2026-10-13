import { BlogPost, DEFAULT_AUTHOR } from "./types";

const DAILY_UPDATE_THEMES = [
  {
    topic: "The 10-Minute Warm Outreach Script That Converts to Referrals",
    summary: "Stop sending cold connection requests with generic notes. Here is the exact 3-sentence outreach framework that achieves a 48% response rate from engineering managers.",
    hotSkill: "System Architecture & API Reliability",
    actionItem: "Identify 3 alumni or 2nd-degree connections currently working at companies on your target list and send today's Warm Referral Template.",
    interviewPrompt: {
      question: "How do you handle a disagreement with a product manager regarding technical debt versus new feature shipping?",
      answerStrategy: "Frame your answer around business impact and customer risk. Explain how you quantify technical debt using metrics (outage frequency, latency regressions, deployment duration) rather than emotional preferences.",
    },
    marketPulse: {
      remoteRatio: "28% of active listings",
      topHiringRoles: ["Staff Backend Engineer", "AI Solutions Architect", "DevOps/Cloud"],
      hotLocation: "Bangalore, Hyderabad & Remote",
    },
    leadTip: `The single biggest lever in modern job searching is bypassing the public application queue via internal employee referrals.

When an employee submits your resume internally:
1. Your profile is routed directly to the recruiter's primary ATS dashboard with a 'Referred' tag.
2. The screening pass rate increases from ~3% to over 35%.
3. Most tech enterprises offer financial referral bonuses ($1,000–₹1,00,000), meaning employees are incentivized to refer qualified candidates.

### Today's 3-Sentence Warm Outreach Template
Send this message on LinkedIn to an engineering lead or senior peer at your target firm:

> *"Hi [First Name], loved your team's recent post about [specific engineering topic/product milestone]. I’m a [Your Title] specializing in [Key Skill 1 & 2] and noticed [Target Company] is scaling the [Target Team] team. If you're open to a 2-minute look at my background, I’d love to connect—no pressure either way!"*

### Execution Checklist for Today
- [ ] Keep messages under 80 words. Long paragraphs trigger visual fatigue.
- [ ] Include one hyper-specific detail about their tech stack or public engineering blog post.
- [ ] Link your clean portfolio or GitHub rather than attaching an unsolicited PDF.`,
  },
  {
    topic: "The 3 Salary Negotiation Rules Candidates Forget on Initial Recruiter Screens",
    summary: "Salary negotiation does not begin when you receive an offer letter—it begins during the first 15-minute phone screen. Here is how to protect your compensation upside without pricing yourself out.",
    hotSkill: "PostgreSQL Query Optimization & Indexing",
    actionItem: "Research the 25th, 50th, and 90th percentile salary benchmarks for your target title in your region using DecaJobs Salary Calculator before your next recruiter call.",
    interviewPrompt: {
      question: "What are your salary expectations for this role?",
      answerStrategy: "Never anchor with a single low figure early on. Deflect politely: 'I'm primarily focused on finding the right role fit and understanding team scope. Once we determine mutual fit, I'm confident we can agree on a package in line with market benchmarks for this level.'",
    },
    marketPulse: {
      remoteRatio: "25% of active listings",
      topHiringRoles: ["Senior Full-Stack Engineer", "Data Platform Engineer", "Security Analyst"],
      hotLocation: "Dubai, London & Delhi NCR",
    },
    leadTip: `During initial recruiter screens, recruiters frequently ask for your 'current CTC' or 'expected salary' to establish budget qualification. Answering impulsively anchors your entire compensation trajectory.

### The 3 Core Rules
1. **Rule #1: Defer Specific Numbers Until After Technical Rounds:**
   You have maximum leverage after the team falls in love with your technical capability. In early stages, your value proposition is hypothetical.
2. **Rule #2: Give a Wide Range If Pressed:**
   If the recruiter insists on a number before proceeding, provide a well-researched range where the *bottom* is your target acceptable salary:
   *Example:* "Based on current market data for senior distributed systems roles in Bangalore, I'm looking at ₹38L to ₹48L depending on equity and benefits structure."
3. **Rule #3: Always Ask for the Approved Budget First:**
   Turn the question back politely: *"Could you share the approved compensation band for this specific headcount?"* Recruiters in many jurisdictions are required to disclose this, or will readily share the upper boundary.`,
  },
  {
    topic: "Optimizing Your Resume for 2026 Semantic ATS Parsers",
    summary: "Modern Applicant Tracking Systems don't just match exact keywords—they evaluate semantic context, project impact, and tool synergy. Here is how to pass modern algorithmic filters.",
    hotSkill: "Next.js App Router & Server Components",
    actionItem: "Run your resume through the DecaJobs ATS Keyword Scanner against 2 active job descriptions to check your semantic relevance score.",
    interviewPrompt: {
      question: "Tell me about a complex technical project you led from inception to production.",
      answerStrategy: "Structure with: (1) Business Context (2) Architectural Tradeoffs evaluated (3) Execution & Hurdles overcome (4) Measurable Production Results (latency, throughput, revenue).",
    },
    marketPulse: {
      remoteRatio: "30% of active listings",
      topHiringRoles: ["Machine Learning Engineer", "Frontend Tech Lead", "Site Reliability Engineer"],
      hotLocation: "Pune, Bangalore & Global Remote",
    },
    leadTip: `Applicant Tracking Systems (Greenhouse, Lever, Workday) now incorporate vector similarity search to rank candidates. Simply stuffing keywords into a white-font footer will get your profile penalized.

### 3 Semantic Optimization Tactics
- **Pair Skills with Measurable Outcomes:** Don't write *"Experienced in Redis"*. Write *"Engineered Redis caching layer with LRU eviction policy, reducing database load by 54% during peak traffic spikes."*
- **Use Standard Section Headers:** Stick to 'Work Experience', 'Technical Skills', 'Education', and 'Projects'. Creative headers like 'Where I Have Made Waves' confuse parsers.
- **Maintain Linear Single-Column Structure:** Multi-column tables, text boxes, and sidebars often concatenate text out of order when ingested into recruiter databases.`,
  },
  {
    topic: "System Design Blueprint: Caching Strategies That Impress Tech Interviewers",
    summary: "Senior and staff engineering interview loops evaluate your depth in caching topologies, consistency guarantees, and stampede prevention. Here are the core concepts to master.",
    hotSkill: "Distributed Caching (Redis, Memcached) & CDC Pipelines",
    actionItem: "Sketch out a cache-aside versus write-through architecture diagram and identify failure modes for each.",
    interviewPrompt: {
      question: "How would you prevent a cache stampede (thundering herd) when a high-traffic cache key expires?",
      answerStrategy: "Discuss mutex locking (single flight pattern), probabilistic early expiration (XFetch algorithm), pre-warming background crons, and tiered local in-memory caching.",
    },
    marketPulse: {
      remoteRatio: "27% of active listings",
      topHiringRoles: ["Principal Architect", "Platform Engineer", "Distributed Systems Specialist"],
      hotLocation: "Bengaluru, London & San Francisco",
    },
    leadTip: `When interviewers ask you to design a scalable system, the difference between a mid-level and senior answer lies in how you handle edge cases in caching.

### Essential Caching Patterns to Articulate
1. **Cache-Aside (Lazy Loading):** Application reads from cache; if miss, reads from DB and writes to cache. Great for read-heavy workloads.
2. **Write-Through:** Application writes to cache, which synchronously writes to DB. Ensures high consistency at the cost of higher write latency.
3. **Write-Behind (Write-Back):** Application writes to cache, which asynchronously batches writes to DB. Blazing fast, but risks data loss on cache node failure.

Always proactively discuss cache eviction policies (LRU vs. LFU) and cache invalidation strategies (TTL expiration vs. event-driven CDC invalidation).`,
  },
];

export function generateDailyUpdates(): Record<string, BlogPost> {
  const updates: Record<string, BlogPost> = {};
  const today = new Date();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate 7 days of daily updates
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    const year = d.getFullYear();
    const monthIndex = d.getMonth();
    const day = d.getDate();
    const dateISO = d.toISOString();

    const monthName = monthNames[monthIndex];
    const formattedDate = `${monthName} ${day}, ${year}`;
    const dateSlug = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const themeIndex = (day + monthIndex) % DAILY_UPDATE_THEMES.length;
    const theme = DAILY_UPDATE_THEMES[themeIndex];

    const slug = `daily-update-${dateSlug}`;
    updates[slug] = {
      slug,
      title: `${formattedDate}: ${theme.topic}`,
      category: "Daily Updates",
      excerpt: theme.summary,
      date: formattedDate,
      dateISO,
      readingTime: "4 min read",
      author: DEFAULT_AUTHOR,
      isDailyUpdate: true,
      hotSkill: theme.hotSkill,
      actionItem: theme.actionItem,
      interviewPrompt: theme.interviewPrompt,
      marketPulse: theme.marketPulse,
      faqs: [
        {
          q: "How frequently is DecaJobs Daily Career Update published?",
          a: "The Daily Career Update is published every single morning alongside our daily curated job matches to give active candidates actionable tactical guidance for their day."
        },
        {
          q: "Can I receive this in my morning email?",
          a: "Yes! Every subscriber to DecaJobs Daily 10 receives actionable career tips and hot job matches directly in their inbox every morning at 7:00 AM."
        }
      ],
      content: `${theme.leadTip}

### Today's Market Pulse & Hiring Telemetry
- **Remote Availability:** ${theme.marketPulse.remoteRatio}
- **High-Demand Roles:** ${theme.marketPulse.topHiringRoles.join(", ")}
- **Top Geographic Hiring Hubs:** ${theme.marketPulse.hotLocation}
- **Hot Skill of the Day:** **${theme.hotSkill}**

### Action Item for Today (10 Minutes)
👉 **${theme.actionItem}**

### Practice Interview Prompt
💡 **Question:** *"${theme.interviewPrompt.question}"*

🎯 **Recommended Strategy:**
${theme.interviewPrompt.answerStrategy}

---
*Stay disciplined in your job search. Check your personalized Top 10 job matches on your [DecaJobs Dashboard](/jobs) today.*`,
    };
  }

  return updates;
}

export const DAILY_UPDATES_ARTICLES = generateDailyUpdates();
