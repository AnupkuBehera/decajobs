import { BlogPost } from "./blog/types";
import { RESUME_ARTICLES } from "./blog/resume-articles";
import { INTERVIEW_ARTICLES } from "./blog/interview-articles";
import { SALARY_ARTICLES } from "./blog/salary-articles";
import { CAREER_GROWTH_ARTICLES } from "./blog/career-growth-articles";
import { NETWORKING_ARTICLES } from "./blog/networking-articles";
import { DAILY_UPDATES_ARTICLES } from "./blog/daily-updates";

export type { BlogPost } from "./blog/types";
export { DAILY_UPDATES_ARTICLES } from "./blog/daily-updates";

export const BLOG_ARTICLES: Record<string, BlogPost> = {
  ...DAILY_UPDATES_ARTICLES,
  ...RESUME_ARTICLES,
  ...INTERVIEW_ARTICLES,
  ...SALARY_ARTICLES,
  ...CAREER_GROWTH_ARTICLES,
  ...NETWORKING_ARTICLES,
};

export function getAllBlogPosts(): BlogPost[] {
  return Object.values(BLOG_ARTICLES).sort(
    (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
  );
}

export function getDailyUpdates(): BlogPost[] {
  return getAllBlogPosts().filter((p) => p.category === "Daily Updates");
}

export function getLatestDailyUpdate(): BlogPost | undefined {
  return getDailyUpdates()[0];
}

export function getDeepDiveGuides(): BlogPost[] {
  return getAllBlogPosts().filter((p) => p.category !== "Daily Updates");
}
