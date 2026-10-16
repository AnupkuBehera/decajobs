"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { JobCard } from "@/components/jobs/JobCard";
import { Top10JobShowcase } from "@/components/jobs/Top10JobShowcase";
import type { ExternalJob } from "@/lib/public-jobs";
import {
    searchAndRankJobs,
    type ExperienceLevel,
    type WorkMode,
    type SortOption,
} from "@/lib/search/decarank";
import * as gtag from "@/lib/gtag";

interface JobSearchFilterProps {
    allJobs: ExternalJob[];
    curatedTop10: ExternalJob[];
}

const TRENDING_SEARCHES = [
    { label: "💻 React & Next.js", query: "React" },
    { label: "🌍 Remote Worldwide", mode: "remote" as WorkMode },
    { label: "🎓 Fresher / SDE-1", exp: "fresher" as ExperienceLevel },
    { label: "📊 Data & AI", cat: "data" },
    { label: "☁️ DevOps & Cloud", cat: "devops" },
    { label: "🏙️ Bangalore Hub", loc: "Bangalore" },
];

function JobSearchFilterContent({ allJobs }: JobSearchFilterProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialQuery = searchParams.get("q") ?? "";
    const initialMode = searchParams.get("remote") === "true" ? "remote" : "all";
    const initialExp = searchParams.get("exp") as ExperienceLevel ?? "all";
    const initialCat = searchParams.get("cat") ?? "all";

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [viewMode, setViewMode] = useState<"top10" | "all">("top10");
    const [workMode, setWorkMode] = useState<WorkMode>(initialMode);
    const [experience, setExperience] = useState<ExperienceLevel>(initialExp);
    const [category, setCategory] = useState<string>(initialCat);
    const [selectedLocation, setSelectedLocation] = useState<string>("all");
    const [sortOption, setSortOption] = useState<SortOption>("decarank");

    // Sync with URL when initial query changes
    useEffect(() => {
        if (initialQuery) {
            setSearchQuery(initialQuery);
        }
    }, [initialQuery]);

    // Extract unique locations from job pool
    const locations = useMemo(() => {
        const set = new Set<string>();
        for (const j of allJobs) {
            if (j.location) {
                const loc = (j.location.split(",")[0] ?? "").trim();
                if (loc.length > 2 && !loc.toLowerCase().includes("remote")) {
                    set.add(loc);
                }
            }
        }
        return Array.from(set).slice(0, 10);
    }, [allJobs]);

    // Run DecaRank search engine
    const searchResult = useMemo(() => {
        return searchAndRankJobs(allJobs, {
            query: searchQuery,
            experience,
            workMode,
            category,
            location: selectedLocation,
            sort: sortOption,
        });
    }, [allJobs, searchQuery, experience, workMode, category, selectedLocation, sortOption]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (trimmed) {
            gtag.trackJobSearch(trimmed);
            const params = new URLSearchParams();
            params.set("q", trimmed);
            if (workMode !== "all") params.set("workMode", workMode);
            if (experience !== "all") params.set("exp", experience);
            router.replace(`/jobs?${params.toString()}`, { scroll: false });
        }
    };

    const handleClearAll = () => {
        setSearchQuery("");
        setWorkMode("all");
        setExperience("all");
        setCategory("all");
        setSelectedLocation("all");
        setSortOption("decarank");
        router.replace("/jobs", { scroll: false });
    };

    const hasActiveFilters =
        searchQuery.trim().length > 0 ||
        workMode !== "all" ||
        experience !== "all" ||
        category !== "all" ||
        selectedLocation !== "all" ||
        sortOption !== "decarank";

    return (
        <div className="space-y-6">
            {/* Primary Search Bar */}
            <div className="relative">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                    <span className="absolute left-4 text-neutral-400 text-lg pointer-events-none" aria-hidden="true">
                        🔍
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by job title, company, or tech stack (e.g. React, Python, Remote, Fresher)..."
                        className="w-full rounded-2xl border border-neutral-300 bg-white py-4 pl-12 pr-28 text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
                    />
                    <div className="absolute right-3 flex items-center gap-1.5">
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="rounded-lg px-2 py-1 text-xs font-semibold text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                            >
                                Clear
                            </button>
                        )}
                        <button
                            type="submit"
                            className="rounded-xl bg-primary-600 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-primary-700 transition-colors"
                        >
                            Find
                        </button>
                    </div>
                </form>

                {/* Trending 1-Click Search Chips */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mr-1">
                        Trending:
                    </span>
                    {TRENDING_SEARCHES.map((chip, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => {
                                if (chip.query) setSearchQuery(chip.query);
                                if (chip.mode) setWorkMode(chip.mode);
                                if (chip.exp) setExperience(chip.exp);
                                if (chip.cat) setCategory(chip.cat);
                                if (chip.loc) setSelectedLocation(chip.loc);
                            }}
                            className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:border-primary-300 hover:text-primary-600 transition-all shadow-2xs"
                        >
                            {chip.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-4 space-y-3.5">
                {/* Row 1: Category & Experience & Work Mode Chips */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* View Mode Toggle: Top 10 vs All */}
                    <div className="flex items-center rounded-xl bg-neutral-200/70 p-1">
                        <button
                            type="button"
                            onClick={() => setViewMode("top10")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                viewMode === "top10"
                                    ? "bg-white text-primary-900 shadow-xs"
                                    : "text-neutral-600 hover:text-neutral-900"
                            }`}
                        >
                            🏆 The 10 Best Jobs
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("all")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                viewMode === "all"
                                    ? "bg-white text-primary-900 shadow-xs"
                                    : "text-neutral-600 hover:text-neutral-900"
                            }`}
                        >
                            📋 All Matching ({searchResult.totalCount})
                        </button>
                    </div>

                    {/* Work Mode */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-neutral-500 mr-1">Work:</span>
                        {(["all", "remote", "onsite"] as WorkMode[]).map((mode) => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => setWorkMode(mode)}
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-all ${
                                    workMode === mode
                                        ? "bg-primary-600 text-white shadow-2xs"
                                        : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                                }`}
                            >
                                {mode === "all" ? "Any" : mode === "remote" ? "🌍 Remote" : "🏢 On-site"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Row 2: Secondary Dropdowns (Experience, Category, Location, Sort) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-200/60 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Experience */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-neutral-500 font-medium">Level:</span>
                            <select
                                value={experience}
                                onChange={(e) => setExperience(e.target.value as ExperienceLevel)}
                                className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                            >
                                <option value="all">All Experience</option>
                                <option value="fresher">🎓 Fresher / Entry (&lt;2y)</option>
                                <option value="mid">⚡ Mid-Level (2-5y)</option>
                                <option value="senior">💼 Senior / Lead (5y+)</option>
                            </select>
                        </div>

                        {/* Category */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-neutral-500 font-medium">Domain:</span>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                            >
                                <option value="all">All Fields</option>
                                <option value="software">💻 Software Engineering</option>
                                <option value="data">📊 Data &amp; AI</option>
                                <option value="design">🎨 UI/UX Design</option>
                                <option value="devops">☁️ DevOps &amp; Cloud</option>
                                <option value="product">📱 Product Management</option>
                            </select>
                        </div>

                        {/* Location */}
                        {locations.length > 0 && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-neutral-500 font-medium">City:</span>
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                                >
                                    <option value="all">All Locations</option>
                                    {locations.map((loc) => (
                                        <option key={loc} value={loc}>
                                            {loc}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Sort & Reset */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                            <span className="text-neutral-500 font-medium">Sort:</span>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value as SortOption)}
                                className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-800 shadow-2xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                            >
                                <option value="decarank">🎯 DecaRank (Best Match)</option>
                                <option value="newest">⚡ Newest First</option>
                                <option value="trust">🛡️ Highest Trust Score</option>
                            </select>
                        </div>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleClearAll}
                                className="rounded-lg px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                            >
                                Reset ✕
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Display Area: Top 10 Showcase or All Results */}
            {viewMode === "top10" ? (
                <div>
                    <Top10JobShowcase
                        rankedJobs={searchResult.top10}
                        searchQuery={searchQuery}
                        totalMatches={searchResult.totalCount}
                    />
                    {searchResult.totalCount > 10 && (
                        <div className="mt-8 text-center border-t border-neutral-200 pt-6">
                            <p className="text-xs text-neutral-500 mb-3">
                                Showing the 10 best curated matches out of {searchResult.totalCount} verified listings.
                            </p>
                            <button
                                type="button"
                                onClick={() => setViewMode("all")}
                                className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-neutral-800 shadow-xs hover:bg-neutral-50 hover:border-neutral-400 transition-all"
                            >
                                View All {searchResult.totalCount} Results →
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm font-medium text-neutral-500">
                            Showing <span className="font-semibold text-neutral-900">{searchResult.allResults.length}</span> genuine listings
                            {searchQuery && <> for &ldquo;<span className="font-semibold text-neutral-900">{searchQuery}</span>&rdquo;</>}
                        </p>
                        <button
                            type="button"
                            onClick={() => setViewMode("top10")}
                            className="text-xs font-bold text-primary-600 hover:text-primary-800"
                        >
                            ← Back to Top 10 Showcase
                        </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {searchResult.allResults.map((item) => (
                            <JobCard
                                key={item.job.id}
                                job={item.job}
                                rank={item.rank}
                                matchScore={item.score}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function JobSearchFilter(props: JobSearchFilterProps) {
    return (
        <Suspense fallback={<div className="h-48 rounded-2xl bg-neutral-100 animate-pulse" />}>
            <JobSearchFilterContent {...props} />
        </Suspense>
    );
}
