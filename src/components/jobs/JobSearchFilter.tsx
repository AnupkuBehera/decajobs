"use client";

import { useState, useMemo } from "react";
import { JobCardGrid } from "@/components/jobs/JobCard";
import type { ExternalJob } from "@/lib/public-jobs";
import { daysSincePosted, isRemoteJob } from "@/lib/public-jobs";

interface JobSearchFilterProps {
    allJobs: ExternalJob[];
    curatedTop10: ExternalJob[];
}

type TabType = "all" | "curated" | "fresh" | "remote" | "software" | "data" | "design";

export function JobSearchFilter({ allJobs, curatedTop10 }: JobSearchFilterProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<TabType>("curated");
    const [selectedLocation, setSelectedLocation] = useState<string>("all");

    // Extract unique locations
    const locations = useMemo(() => {
        const set = new Set<string>();
        for (const j of allJobs) {
            if (j.location) {
                const loc = j.location.split(",")[0].trim();
                if (loc.length > 2 && !loc.toLowerCase().includes("remote")) {
                    set.add(loc);
                }
            }
        }
        return Array.from(set).slice(0, 8);
    }, [allJobs]);

    const filteredJobs = useMemo(() => {
        let list = activeTab === "curated" ? curatedTop10 : allJobs;

        if (activeTab === "fresh") {
            list = list.filter((j) => {
                const days = daysSincePosted(j.postedAt);
                return days !== null && days <= 2;
            });
        } else if (activeTab === "remote") {
            list = list.filter((j) => isRemoteJob(j));
        } else if (activeTab === "software") {
            list = list.filter((j) =>
                /software|developer|engineer|frontend|backend|fullstack|react|python|node/i.test(
                    `${j.title} ${j.description}`
                )
            );
        } else if (activeTab === "data") {
            list = list.filter((j) =>
                /data|analyst|analytics|scientist|sql|machine learning|bi/i.test(
                    `${j.title} ${j.description}`
                )
            );
        } else if (activeTab === "design") {
            list = list.filter((j) =>
                /design|designer|ui|ux|product design|figma/i.test(`${j.title} ${j.description}`)
            );
        }

        if (selectedLocation !== "all") {
            list = list.filter((j) =>
                j.location.toLowerCase().includes(selectedLocation.toLowerCase())
            );
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            list = list.filter(
                (j) =>
                    j.title.toLowerCase().includes(query) ||
                    j.company.toLowerCase().includes(query) ||
                    j.location.toLowerCase().includes(query) ||
                    j.description.toLowerCase().includes(query)
            );
        }

        return list;
    }, [allJobs, curatedTop10, activeTab, selectedLocation, searchQuery]);

    return (
        <div>
            {/* Search Input Bar */}
            <div className="relative mb-6">
                <div className="relative flex items-center">
                    <span className="absolute left-4 text-neutral-400 text-lg">🔍</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by job title, company name, skill (e.g. React, Python, Product)..."
                        className="w-full rounded-2xl border border-neutral-300 bg-white py-3.5 pl-12 pr-10 text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 text-xs font-semibold text-neutral-400 hover:text-neutral-600"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab("curated")}
                        className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                            activeTab === "curated"
                                ? "bg-primary-600 text-white shadow-sm"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                    >
                        🌟 10 Curated Daily
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("all")}
                        className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                            activeTab === "all"
                                ? "bg-primary-600 text-white shadow-sm"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                    >
                        All Listings ({allJobs.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("fresh")}
                        className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                            activeTab === "fresh"
                                ? "bg-primary-600 text-white shadow-sm"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                    >
                        ⚡ New (Last 48h)
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("remote")}
                        className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                            activeTab === "remote"
                                ? "bg-primary-600 text-white shadow-sm"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                    >
                        🌍 Remote Only
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("software")}
                        className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                            activeTab === "software"
                                ? "bg-primary-600 text-white shadow-sm"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                    >
                        💻 Software
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("data")}
                        className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                            activeTab === "data"
                                ? "bg-primary-600 text-white shadow-sm"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                    >
                        📊 Data & AI
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("design")}
                        className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                            activeTab === "design"
                                ? "bg-primary-600 text-white shadow-sm"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                    >
                        🎨 Design
                    </button>
                </div>

                {/* Location dropdown */}
                {locations.length > 0 && (
                    <div className="flex items-center gap-2">
                        <label htmlFor="city-filter" className="text-xs text-neutral-500 font-medium">
                            City:
                        </label>
                        <select
                            id="city-filter"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                            <option value="all">All Cities</option>
                            {locations.map((loc) => (
                                <option key={loc} value={loc}>
                                    {loc}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Curated Banner if in curated mode */}
            {activeTab === "curated" && !searchQuery && (
                <div className="mb-6 rounded-2xl border border-primary-100 bg-gradient-to-r from-primary-50 via-teal-50/40 to-blue-50/50 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white text-lg">
                                🎯
                            </span>
                            <div>
                                <h3 className="text-sm font-bold text-neutral-900 sm:text-base">
                                    Today&apos;s 10 Curated Top Matches
                                </h3>
                                <p className="text-xs sm:text-sm text-neutral-600">
                                    Algorithmic selection of genuine, verified, high-paying, active roles updated for today.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-xs sm:text-sm font-medium text-neutral-500">
                    Showing <span className="font-semibold text-neutral-900">{filteredJobs.length}</span> genuine listings
                </p>
            </div>

            {/* Grid */}
            <JobCardGrid jobs={filteredJobs} />
        </div>
    );
}
