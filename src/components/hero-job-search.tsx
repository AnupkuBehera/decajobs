"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as gtag from "@/lib/gtag";

const QUICK_FILTERS = [
  { label: "🌍 Remote Jobs", href: "/jobs/remote" },
  { label: "🎓 Fresher Jobs", href: "/jobs/fresher" },
  { label: "💻 Software & React", href: "/jobs/category/software-engineering" },
  { label: "🤖 Data & AI", href: "/jobs/category/data-analytics" },
  { label: "☁️ DevOps & Cloud", href: "/jobs/category/devops-cloud" },
  { label: "🏙️ Bangalore Hub", href: "/jobs/location/bangalore" },
];

export function HeroJobSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push("/jobs");
      return;
    }
    gtag.trackJobSearch(trimmed);
    router.push(`/jobs?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="mx-auto mt-6 max-w-2xl">
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 rounded-2xl border border-primary-400/30 bg-primary-950/70 p-1.5 shadow-2xl backdrop-blur-md transition-all focus-within:border-cyan-400/80 focus-within:ring-2 focus-within:ring-cyan-400/20"
      >
        <span className="pl-3 text-lg text-primary-300" aria-hidden="true">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by role, skill, or location for your 10 best jobs..."
          className="w-full bg-transparent px-2 py-2.5 text-xs sm:text-sm text-white placeholder-primary-300/60 outline-none"
        />
        <button
          type="submit"
          className="rounded-xl bg-white px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-primary-950 hover:bg-neutral-100 transition-colors shadow-md shrink-0"
        >
          10 Best Jobs 🎯
        </button>
      </form>

      {/* 1-Click Trending Filter Chips */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
        <span className="text-[11px] font-semibold text-primary-300/80">
          Popular:
        </span>
        {QUICK_FILTERS.map((chip) => (
          <Link
            key={chip.label}
            href={chip.href}
            onClick={() => gtag.trackJobSearch(chip.label)}
            className="inline-flex items-center rounded-full border border-primary-500/30 bg-primary-900/60 px-3 py-1 text-[11px] font-medium text-primary-200 transition-all hover:bg-primary-800 hover:text-white hover:border-cyan-400/40"
          >
            {chip.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
