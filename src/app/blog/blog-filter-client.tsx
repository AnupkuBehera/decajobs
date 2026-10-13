"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BlogPost } from "@/lib/blog-data";

const CATEGORIES = [
  "All",
  "Daily Updates",
  "Resume Tips",
  "Interview Prep",
  "Salary & Negotiation",
  "Career Growth",
  "Networking",
];

export function BlogFilterClient({
  articles,
}: {
  articles: BlogPost[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "All" ||
        article.category.toLowerCase().includes(selectedCategory.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.author.name.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Category Pills & Live Search */}
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
                {cat === "Daily Updates" ? "📅 Daily Updates" : cat}
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
            placeholder="Search guides & advice..."
            aria-label="Search career articles"
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

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <span>
          Showing <strong className="text-neutral-900">{filteredArticles.length}</strong> {filteredArticles.length === 1 ? "article" : "articles"}
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
        {(selectedCategory !== "All" || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="text-primary-600 font-medium hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid */}
      {filteredArticles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-12 text-center">
          <span className="text-4xl">📚</span>
          <h3 className="mt-3 text-base font-bold text-neutral-900">
            No articles match your query
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Try a different search keyword or switch back to All categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            View All Guides
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {filteredArticles.map((article) => {
            const isDaily = article.category === "Daily Updates";
            return (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className={`group flex flex-col justify-between rounded-2xl border p-6 transition-all hover:shadow-lg ${
                  isDaily
                    ? "border-amber-200 bg-amber-50/20 hover:border-amber-400"
                    : "border-neutral-200 bg-white hover:border-primary-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isDaily
                          ? "bg-amber-100 text-amber-800"
                          : "bg-primary-50 text-primary-700"
                      }`}
                    >
                      {isDaily ? "📅 Daily Update" : article.category}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {article.readingTime}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors leading-snug">
                    {article.title}
                  </h2>

                  <p className="mt-2.5 text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>

                  {/* Hot Skill or Action Item highlight for daily update */}
                  {isDaily && article.actionItem && (
                    <div className="mt-4 rounded-xl bg-amber-50 p-3 border border-amber-200/60">
                      <p className="text-[11px] font-semibold text-amber-900 mb-0.5">
                        🎯 Daily Action Item:
                      </p>
                      <p className="text-[11px] text-amber-800 line-clamp-2 leading-relaxed">
                        {article.actionItem}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 border-t border-neutral-100 pt-3 flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{article.author.avatarEmoji}</span>
                    <span className="font-medium text-neutral-700">{article.author.name}</span>
                  </div>
                  <time dateTime={article.dateISO}>{article.date}</time>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
