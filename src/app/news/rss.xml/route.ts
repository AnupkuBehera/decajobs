import { NextResponse } from "next/server";
import { getAllNews } from "@/lib/news/daily-news";

export async function GET() {
  const news = getAllNews();
  const baseUrl = "https://decajob.com";

  const xmlItems = news
    .map((item) => {
      const pubDate = new Date(item.dateISO).toUTCString();
      const escapedTitle = item.title
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const escapedSummary = item.summary
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      return `    <item>
      <title>${escapedTitle}</title>
      <link>${baseUrl}/news/${item.slug}</link>
      <guid isPermaLink="true">${baseUrl}/news/${item.slug}</guid>
      <description>${escapedSummary}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${item.category}</category>
      <author>newsroom@decajob.com (${item.author.name})</author>
    </item>`;
    })
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DecaJobs Tech &amp; Hiring News</title>
    <link>${baseUrl}/news</link>
    <description>Daily tech hiring news, compensation telemetry, remote work policies, and visa updates.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/news/rss.xml" rel="self" type="application/rss+xml"/>
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
