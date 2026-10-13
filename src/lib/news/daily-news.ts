import { NewsArticle, NewsCategory, DEFAULT_NEWS_AUTHOR } from "./types";
import { CURATED_NEWS_ARTICLES } from "./news-data";

/**
 * Deterministic daily news briefs generator
 * Generates structured, timely daily hiring & tech market morning briefs
 * for the current calendar date and preceding days.
 */
function generateDailyBriefs(): Record<string, NewsArticle> {
  const briefs: Record<string, NewsArticle> = {};
  const today = new Date();

  // Curated rotating daily themes with realistic tech labor market updates
  const DAILY_THEMES = [
    {
      title: "Global Tech Hiring Pulse: AI Infrastructure & Remote Engineering Lead Demand",
      summary: "Daily breakdown of active hiring requisitions across India, UAE, UK, and global remote channels. Cloud computing and AI systems show strongest week-over-week gains.",
      category: "AI & Tech" as const,
      takeaways: [
        "Backend engineering requisitions (Go, Rust, Python) up 14% across product startups.",
        "Average interview turnaround times shortened to 11 days for senior specialists.",
        "Remote job openings remain anchored at 24% of total tech requisitions globally.",
      ],
      tags: ["Daily Brief", "Hiring Telemetry", "AI", "Cloud"],
      leadContent: "Across primary hiring corridors in Bangalore, Dubai, and London, recruiters report accelerating pipeline velocity for mid-to-senior backend and distributed systems talent.",
    },
    {
      title: "Compensation & Perks Telemetry: Equity Grants & Joining Bonuses in Focus",
      summary: "Analysis of salary disclosures and signing bonus patterns shows renewed employer willingness to offer accelerated vesting and relocation support.",
      category: "Salaries & Economy" as const,
      takeaways: [
        "Notice period buyout assistance reported in 42% of lateral offers in India.",
        "Sign-on bonuses for hard-to-fill security and DevOps roles average 15-20% of annual base.",
        "Flexible working stipend provisions standard across 80% of remote job offers.",
      ],
      tags: ["Daily Brief", "Compensation", "Perks", "Salary Trends"],
      leadContent: "Employer bidding for proven engineering talent continues to center on total compensation package flexibility, with faster vesting schedules taking precedence over cash-only increments.",
    },
    {
      title: "Remote Work & Global Expat Watch: Cross-Border Hiring Compliance Guidelines",
      summary: "How multinational startups are leveraging Employer of Record (EOR) structures and digital nomad visas to hire talent across borders without local entity overhead.",
      category: "Remote Work" as const,
      takeaways: [
        "EOR hiring grew 31% year-to-date, driven by US companies contracting European and Indian engineers.",
        "Currency hedging mechanisms increasingly adopted in contractor compensation agreements.",
        "Time zone overlap expectations coalesce around 4 core collaborative hours per workday.",
      ],
      tags: ["Daily Brief", "Remote Work", "Global Hiring", "Compliance"],
      leadContent: "Global employment flexibility has unlocked international talent pools. Companies are establishing standardized asynchronous communication playbooks to manage cross-border collaboration seamlessly.",
    },
    {
      title: "Interview & Hiring Bar Insights: What Systems Architecture Rounds Test Today",
      summary: "Engineering leadership shares insights into current technical screen evaluations, focusing on API design, caching layers, and fault tolerance rather than LeetCode riddles.",
      category: "Hiring & Layoffs" as const,
      takeaways: [
        "68% of interview panels replaced obscure dynamic programming problems with real-world architectural design.",
        "Candidates evaluated on system observability, cost consciousness, and API resilience.",
        "Take-home assignments capped at 3 hours with paid evaluation becoming more common.",
      ],
      tags: ["Daily Brief", "Interview Bar", "System Design", "Engineering"],
      leadContent: "The engineering interview paradigm is continuing its shift toward practical software delivery. Recruiters and hiring managers prioritize verifiable production contributions over algorithmic trivia.",
    },
  ];

  // Generate for the last 5 days including today
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    const year = d.getFullYear();
    const monthIndex = d.getMonth();
    const day = d.getDate();
    const dateISO = d.toISOString();

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[monthIndex];
    const formattedDate = `${monthName} ${day}, ${year}`;
    const dateSlug = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const themeIndex = (day + monthIndex) % DAILY_THEMES.length;
    const theme = DAILY_THEMES[themeIndex];

    const slug = `daily-tech-news-${dateSlug}`;
    briefs[slug] = {
      slug,
      title: `${formattedDate}: ${theme.title}`,
      summary: theme.summary,
      category: theme.category,
      publishedAt: formattedDate,
      dateISO,
      readTime: "3 min read",
      author: DEFAULT_NEWS_AUTHOR,
      source: "DecaJobs Daily Intelligence",
      isBreaking: i === 0,
      isDailyBrief: true,
      tags: theme.tags,
      keyTakeaways: theme.takeaways,
      content: `${theme.leadContent}

### Key Market Indicators for ${formattedDate}
- **Active Job Postings Monitored:** 45,000+ verified listings across 20+ partner boards.
- **Top In-Demand Role of the Day:** Distributed Systems Engineers & Full-Stack TypeScript Specialists.
- **Fastest Hiring Sectors:** AI Tooling, B2B SaaS, HealthTech & Cloud Logistics.

### Executive Summary & Recommendations
For candidates actively interviewing this week, maintain tailored portfolio links and concise project summaries. Recruiters are prioritizing candidates with demonstrated ability to deliver clean, maintainable software systems on modern cloud infrastructure.

Check today's freshly curated Top 10 job matches on your [DecaJobs Dashboard](/jobs) or browse open positions by city and category.`,
    };
  }

  return briefs;
}

export const DAILY_NEWS_BRIEFS = generateDailyBriefs();

export const ALL_NEWS_ARTICLES: Record<string, NewsArticle> = {
  ...DAILY_NEWS_BRIEFS,
  ...CURATED_NEWS_ARTICLES,
};

export function getAllNews(): NewsArticle[] {
  return Object.values(ALL_NEWS_ARTICLES).sort(
    (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
  );
}

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return ALL_NEWS_ARTICLES[slug];
}

export function getNewsByCategory(category: NewsCategory): NewsArticle[] {
  if (category === "All News") return getAllNews();
  return getAllNews().filter((article) => article.category === category);
}

export function getLatestNews(limit: number = 6): NewsArticle[] {
  return getAllNews().slice(0, limit);
}

export function getBreakingNews(): NewsArticle | undefined {
  return getAllNews().find((article) => article.isBreaking) || getAllNews()[0];
}
