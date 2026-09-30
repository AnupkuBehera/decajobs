import { BlogPost } from "./blog/types";
import { RESUME_ARTICLES } from "./blog/resume-articles";
import { INTERVIEW_ARTICLES } from "./blog/interview-articles";
import { SALARY_ARTICLES } from "./blog/salary-articles";
import { CAREER_GROWTH_ARTICLES } from "./blog/career-growth-articles";
import { NETWORKING_ARTICLES } from "./blog/networking-articles";

export type { BlogPost } from "./blog/types";

export const BLOG_ARTICLES: Record<string, BlogPost> = {
  ...RESUME_ARTICLES,
  ...INTERVIEW_ARTICLES,
  ...SALARY_ARTICLES,
  ...CAREER_GROWTH_ARTICLES,
  ...NETWORKING_ARTICLES,
};
