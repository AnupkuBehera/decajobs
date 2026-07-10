"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardMatches from "./dashboard-matches";

interface Application {
  id: string;
  job_title: string;
  company: string;
  job_url?: string;
  status: "saved" | "applied" | "interview" | "offer" | "rejected";
  notes?: string;
  applied_at: string;
}

interface DashboardTabsProps {
  isProfileComplete: boolean;
  referralCode?: string;
  referralBonusDays: number;
}

export default function DashboardTabs({
  isProfileComplete,
  referralCode,
  referralBonusDays,
}: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<"matches" | "tracker" | "referrals">("matches");
  
  // Tracker State
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [isAddingApp, setIsAddingApp] = useState(false);
  
  // Add Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newStatus, setNewStatus] = useState<Application["status"]>("applied");
  const [newNotes, setNewNotes] = useState("");

  // Referral State
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (activeTab === "tracker") {
      fetchApplications();
    }
  }, [activeTab]);

  async function fetchApplications() {
    setIsLoadingApps(true);
    try {
      const res = await fetch("/api/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setIsLoadingApps(false);
    }
  }

  async function handleAddApplication(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle || !newCompany) return;

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_title: newTitle,
          company: newCompany,
          job_url: newUrl,
          status: newStatus,
          notes: newNotes,
        }),
      });

      if (res.ok) {
        const newApp = await res.json();
        setApplications((prev) => [newApp, ...prev]);
        setIsAddingApp(false);
        // Reset form
        setNewTitle("");
        setNewCompany("");
        setNewUrl("");
        setNewStatus("applied");
        setNewNotes("");
      }
    } catch (err) {
      console.error("Failed to add application:", err);
    }
  }

  async function handleUpdateStatus(id: string, currentApp: Application, nextStatus: Application["status"]) {
    try {
      const res = await fetch("/api/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...currentApp,
          status: nextStatus,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? updated : app))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  async function handleDeleteApplication(id: string) {
    if (!confirm("Are you sure you want to delete this tracked job?")) return;

    try {
      const res = await fetch(`/api/applications?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setApplications((prev) => prev.filter((app) => app.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete application:", err);
    }
  }

  const copyReferralLink = () => {
    if (!referralCode) return;
    const link = `${window.location.origin}/login?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "saved": return "default";
      case "applied": return "success";
      case "interview": return "warning";
      case "offer": return "success";
      case "rejected": return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation tabs */}
      <div className="flex border-b border-neutral-200">
        <button
          onClick={() => setActiveTab("matches")}
          className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all ${
            activeTab === "matches"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-neutral-500 hover:text-neutral-900"
          }`}
        >
          🔍 Job Matches
        </button>
        <button
          onClick={() => setActiveTab("tracker")}
          className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all ${
            activeTab === "tracker"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-neutral-500 hover:text-neutral-900"
          }`}
        >
          💼 Application Tracker (CRM)
        </button>
        <button
          onClick={() => setActiveTab("referrals")}
          className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all ${
            activeTab === "referrals"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-neutral-500 hover:text-neutral-900"
          }`}
        >
          🎁 Referrals & Rewards
        </button>
      </div>

      {/* Matches Tab */}
      {activeTab === "matches" && (
        <DashboardMatches isProfileComplete={isProfileComplete} />
      )}

      {/* Tracker Tab */}
      {activeTab === "tracker" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Tracked Applications</h2>
            <Button
              onClick={() => setIsAddingApp(!isAddingApp)}
              className="bg-primary-600 text-white hover:bg-primary-700 text-xs py-1.5"
            >
              {isAddingApp ? "Close Form" : "➕ Add Custom Application"}
            </Button>
          </div>

          {/* Add Form */}
          {isAddingApp && (
            <Card className="p-4 bg-neutral-50 border border-neutral-200">
              <form onSubmit={handleAddApplication} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Job Title *</label>
                    <Input
                      required
                      placeholder="e.g. Frontend Engineer"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Company *</label>
                    <Input
                      required
                      placeholder="e.g. Google"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Job URL</label>
                    <Input
                      placeholder="e.g. https://google.com/jobs"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Status</label>
                    <select
                      className="w-full text-sm rounded-md border border-neutral-200 p-2 bg-white"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as Application["status"])}
                    >
                      <option value="saved">Saved</option>
                      <option value="applied">Applied</option>
                      <option value="interview">Interviewing</option>
                      <option value="offer">Offer Received</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Private Notes</label>
                  <Input
                    placeholder="e.g. Tech stack is React and Node. Recruiter email is info@google.com."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white text-xs mt-2">
                  Save Application
                </Button>
              </form>
            </Card>
          )}

          {/* Applications list */}
          {isLoadingApps ? (
            <div className="py-8 text-center text-sm text-neutral-400">Loading tracker data...</div>
          ) : applications.length === 0 ? (
            <div className="py-12 text-center text-sm text-neutral-400 border-2 border-dashed border-neutral-200 rounded-lg">
              <p>You haven't tracked any job applications yet.</p>
              <p className="text-xs text-neutral-400 mt-1">Start by clicking "Add Custom Application" above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <Card key={app.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="font-bold text-neutral-900 flex items-center gap-2">
                        {app.job_url ? (
                          <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 hover:underline">
                            {app.job_title}
                          </a>
                        ) : (
                          app.job_title
                        )}
                        <span className="text-sm font-normal text-neutral-400">at {app.company}</span>
                      </div>
                      {app.notes && (
                        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{app.notes}</p>
                      )}
                      <span className="text-[10px] text-neutral-400 block mt-2">
                        Added on {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                      {/* Status select dropdown */}
                      <select
                        className="text-xs rounded border border-neutral-200 p-1.5 bg-neutral-50 text-neutral-700 font-semibold"
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app.id, app, e.target.value as Application["status"])}
                      >
                        <option value="saved">Saved</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interviewing</option>
                        <option value="offer">Offer Received</option>
                        <option value="rejected">Rejected</option>
                      </select>

                      <Badge variant={getStatusColor(app.status)} className="capitalize text-[10px] py-1 font-bold">
                        {app.status === "interview" ? "Interviewing" : app.status === "offer" ? "Offer" : app.status}
                      </Badge>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteApplication(app.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Referrals Tab */}
      {activeTab === "referrals" && (
        <Card className="p-6 border border-primary-100 bg-gradient-to-br from-white to-primary-50/20">
          <div className="text-center max-w-md mx-auto space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xl">
              🎁
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">DecaJobs Referral Program</h2>
              <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                Invite fellow job seekers to sign up! When they complete their profile, they get **7 extra trial days** of Pro features, and you get **15 days of Pro features** added to your account!
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 border-y border-neutral-100 py-4">
              <div>
                <span className="text-xs font-semibold text-neutral-400 uppercase">Referral Bonus days</span>
                <p className="text-2xl font-extrabold text-green-600 mt-1">{referralBonusDays} Days</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-400 uppercase">Your Referral Code</span>
                <p className="text-xl font-extrabold text-neutral-800 mt-1 font-mono">{referralCode || "N/A"}</p>
              </div>
            </div>

            {referralCode ? (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-left text-neutral-600">Your Share Link</label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    className="font-mono text-xs text-neutral-500 bg-neutral-50"
                    value={`${window.location.origin}/login?ref=${referralCode}`}
                  />
                  <Button
                    onClick={copyReferralLink}
                    className="bg-primary-600 hover:bg-primary-700 text-white text-xs whitespace-nowrap shrink-0 px-4"
                  >
                    {copied ? "Copied! ✓" : "Copy Link"}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-red-500 italic">No referral code set yet. Please complete your profile to activate referrals.</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
