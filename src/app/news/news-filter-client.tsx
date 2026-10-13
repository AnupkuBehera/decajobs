"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { NewsArticle, NewsCategory } from "@/lib/news/types";

const CATEGORIES: NewsCategory[] = [
  "All News",
  "AI & Tech",
  "Hiring & Layoffs",
  "Remote Work",
  "Global Visas & Expat",
  "Salaries & Economy",
];

export function NewsFilterClient({
  articles,
}: {
  articles: NewsArticle[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>("All News");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "All News" || article.category === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.tags.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search and Category Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all min-h-[38px] ${
                  isActive
                    ? "bg-primary-600 text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tech & hiring news..."
            aria-label="Search tech and hiring news"
            className="w-full rounded-xl border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 shadow-sm"
          />
          <span className="pointer-events-none absolute left-3 top-2.5 text-neutral-400 text-sm">
            🔍
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-xs text-neutral-400 hover:text-neutral-600"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Current Filter */}
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <span>
          Showing <strong className="text-neutral-900">{filteredArticles.length}</strong> {filteredArticles.length === 1 ? "story" : "stories"}
          {selectedCategory !== "All News" && ` in ${selectedCategory}`}
          {searchQuery && ` for "${searchQuery}"`}
        </span>
        {(selectedCategory !== "All News" || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All News");
              setSearchQuery("");
            }}
            className="text-primary-600 font-medium hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* News Grid */}
      {filteredArticles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-12 text-center">
          <span className="text-4xl">📰</span>
          <h3 className="mt-3 text-base font-bold text-neutral-900">
            No news articles match your search
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All News");
              setSearchQuery("");
            }}
            className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            View All News
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <article
              key={article.slug}
              className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-primary-300 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                    {article.category}
                  </span>
                  <span className="text-xs text-neutral-400">{article.readTime}</span>
                </div>

                <Link href={`/news/${article.slug}`}>
                  <h2 className="text-base font-bold text-neutral-900 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h2>
                </Link>

                <p className="mt-2.5 text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>

                {/* Key Takeaway snippet */}
                {article.keyTakeaways && article.keyTakeaways.length > 0 && (
                  <div className="mt-4 rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                    <p className="text-[11px] font-semibold text-neutral-700 mb-1">
                      💡 Key Highlight:
                    </p>
                    <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                      {article.keyTakeaways[0]}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-5 border-t border-neutral-100 pt-3 flex items-center justify-between text-xs text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <span>{article.author.avatarEmoji}</span>
                  <span className="font-medium text-neutral-700 truncate max-w-[120px]">
                    {article.author.name}
                  </span>
                </div>
                <time dateTime={article.dateISO}>{article.publishedAt}</time>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
