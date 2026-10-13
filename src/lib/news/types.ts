export type NewsCategory =
  | "All News"
  | "AI & Tech"
  | "Hiring & Layoffs"
  | "Remote Work"
  | "Global Visas & Expat"
  | "Salaries & Economy";

export interface NewsAuthor {
  name: string;
  role: string;
  avatarEmoji: string;
}

export interface NewsArticle {
  slug: string;
  title: string;
  summary: string;
  category: Exclude<NewsCategory, "All News">;
  publishedAt: string; // e.g. "October 14, 2026"
  dateISO: string; // e.g. "2026-10-14T07:00:00Z"
  readTime: string; // e.g. "4 min read"
  author: NewsAuthor;
  source: string; // e.g. "DecaJobs Newsroom", "Tech Hiring Telemetry"
  isBreaking?: boolean;
  isDailyBrief?: boolean;
  keyTakeaways: string[];
  content: string;
  tags: string[];
  relatedJobQuery?: string; // Query string to search matching jobs on DecaJobs
}

export const DEFAULT_NEWS_AUTHOR: NewsAuthor = {
  name: "DecaJobs Editorial Desk",
  role: "Labor Market & Technology Analytics Team",
  avatarEmoji: "📰",
};
