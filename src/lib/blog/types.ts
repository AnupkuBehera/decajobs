export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  dateISO: string;
  readingTime: string;
  author: {
    name: string;
    slug: string;
    role: string;
    avatarEmoji: string;
  };
  content: string;
  faqs?: { q: string; a: string }[];
}

export const DEFAULT_AUTHOR = {
  name: "Anup Behera",
  slug: "anup-behera",
  role: "Founder & Technology Specialist",
  avatarEmoji: "👨‍💻",
};
