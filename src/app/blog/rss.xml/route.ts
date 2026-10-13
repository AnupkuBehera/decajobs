import { NextResponse } from "next/server";
import { getAllBlogPosts } from "@/lib/blog-data";

export async function GET() {
  const posts = getAllBlogPosts();
  const baseUrl = "https://decajob.com";

  const xmlItems = posts
    .map((item) => {
      const pubDate = new Date(item.dateISO).toUTCString();
      const escapedTitle = item.title
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const escapedExcerpt = item.excerpt
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      return `    <item>
      <title>${escapedTitle}</title>
      <link>${baseUrl}/blog/${item.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${item.slug}</guid>
      <description>${escapedExcerpt}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${item.category}</category>
      <author>editorial@decajob.com (${item.author.name})</author>
    </item>`;
    })
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DecaJobs Career Blog &amp; Daily Updates</title>
    <link>${baseUrl}/blog</link>
    <description>In-depth career blueprints, ATS resume optimization strategies, interview guides, and daily job market updates.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
${xmlItems}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
