"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Input,
  Spinner,
  useToast,
} from "@/components/ui";

interface Candidate {
  id: string;
  email: string;
  is_active: boolean;
  preferred_delivery_time: string;
  created_at: string;
  subscription_status: string;
  subscription_ends_at: string | null;
}

interface Employer {
  id: string;
  email: string;
  company_name: string | null;
  is_verified: boolean;
  created_at: string;
}

interface DashboardMetrics {
  totalCandidates: number;
  totalEmployers: number;
  totalJobs: number;
  activePro: number;
  totalPageViews?: number;
  totalUniqueVisitors?: number;
}

export default function AdminDashboardPage() {
  const { addToast } = useToast();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [debugInfo, setDebugInfo] = useState<{
    supabaseUrl: string;
    serviceKeyLength: number;
    isServiceKeyPrefixValid: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"candidates" | "employers" | "system">("candidates");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setIsLoading(true);
    setAuthError(false);

    try {
      const res = await fetch("/api/admin/users");
      if (res.status === 403 || res.status === 401) {
        setAuthError(true);
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load dashboard data");
      }

      const json = await res.json();
      setMetrics(json.metrics);
      setCandidates(json.candidates);
      setEmployers(json.employers);
      setDebugInfo(json.debug || null);
    } catch (err: any) {
      console.error(err);
      addToast(err.message || "Failed to load admin dashboard data.", "error");
    } finally {
      setIsLoading(false);
    }
  }

  // --- Actions ---

  async function handleToggleSubscription(candidateId: string, currentStatus: string) {
    const nextStatus = currentStatus === "active" ? "expired" : "active";
    setActionLoading(`sub-${candidateId}`);

    try {
      const res = await fetch("/api/admin/toggle-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId, status: nextStatus }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to update subscription");
      }

      addToast(`Successfully updated subscription to ${nextStatus}.`, "success");

      // Update state locally
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidateId
            ? {
                ...c,
                subscription_status: nextStatus,
                subscription_ends_at:
                  nextStatus === "active"
                    ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                    : new Date().toISOString(),
              }
            : c
        )
      );

      // Refresh stats
      setMetrics((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          activePro: prev.activePro + (nextStatus === "active" ? 1 : -1),
        };
      });
    } catch (err: any) {
      addToast(err.message || "Action failed.", "error");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleToggleMatching(candidateId: string, currentActive: boolean) {
    const nextActive = !currentActive;
    setActionLoading(`match-${candidateId}`);

    try {
      const res = await fetch("/api/admin/toggle-matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId, isActive: nextActive }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to update matching state");
      }

      addToast(`Matching status ${nextActive ? "enabled" : "paused"}.`, "success");

      setCandidates((prev) =>
        prev.map((c) => (c.id === candidateId ? { ...c, is_active: nextActive } : c))
      );
    } catch (err: any) {
      addToast(err.message || "Action failed.", "error");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleVerifyEmployer(employerId: string, currentVerified: boolean) {
    const nextVerified = !currentVerified;
    setActionLoading(`verify-${employerId}`);

    try {
      const res = await fetch("/api/admin/verify-employer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employerId, isVerified: nextVerified }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to verify employer");
      }

      addToast(`Employer account ${nextVerified ? "verified" : "unverified"}.`, "success");

      setEmployers((prev) =>
        prev.map((e) => (e.id === employerId ? { ...e, is_verified: nextVerified } : e))
      );
    } catch (err: any) {
      addToast(err.message || "Action failed.", "error");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeleteUser(userId: string, type: "candidate" | "employer") {
    if (!confirm(`Are you sure you want to permanently delete this ${type}? This action CANNOT be undone.`)) {
      return;
    }

    setActionLoading(`delete-${userId}`);

    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete user");
      }

      addToast(`Successfully removed user account from database and auth storage.`, "success");

      if (type === "candidate") {
        setCandidates((prev) => prev.filter((c) => c.id !== userId));
        setMetrics((prev) => {
          if (!prev) return null;
          return { ...prev, totalCandidates: Math.max(0, prev.totalCandidates - 1) };
        });
      } else {
        setEmployers((prev) => prev.filter((e) => e.id !== userId));
        setMetrics((prev) => {
          if (!prev) return null;
          return { ...prev, totalEmployers: Math.max(0, prev.totalEmployers - 1) };
        });
      }
    } catch (err: any) {
      addToast(err.message || "Deletion failed.", "error");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleForceTriggerDigest() {
    if (!confirm("Are you sure you want to trigger the daily digest emails right now? This will immediately email all active candidates.")) {
      return;
    }

    setActionLoading("trigger-digest");

    try {
      const res = await fetch("/api/cron/daily-digest");
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to trigger cron job");
      }

      addToast(json.message || "Daily digest cron successfully running.", "success");
    } catch (err: any) {
      addToast(err.message || "Trigger failed.", "error");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCleanHistory() {
    setActionLoading("clean-history");

    try {
      const res = await fetch("/api/admin/clean-history", { method: "POST" });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to clean history");
      }

      addToast(json.message || "Successfully deleted old digest histories.", "success");
    } catch (err: any) {
      addToast(err.message || "Action failed.", "error");
    } finally {
      setActionLoading(null);
    }
  }

  // --- Filtering ---

  const filteredCandidates = candidates.filter(
    (c) =>
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.includes(searchQuery)
  );

  const filteredEmployers = employers.filter(
    (e) =>
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.company_name && e.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      e.id.includes(searchQuery)
  );

  // --- Render Sub-states ---

  if (authError) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Access Denied</h1>
          <p className="mt-2 text-neutral-600">
            You do not have permission to view the Super Admin User Module. If you believe this is an error, please ensure your email is added to the <code>ADMIN_EMAILS</code> configuration.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 min-h-[44px]"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" className="text-primary-600" />
        <p className="text-sm font-medium text-neutral-500">Loading Super Admin Module...</p>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Super Admin Dashboard</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Centralized portal to control user accounts, modify subscriptions, verify employers, and monitor crons.
          </p>
        </div>
      </div>

      {/* Metrics Section */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Candidates</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">{metrics.totalCandidates}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Active Pro Users</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-green-600 mt-1">{metrics.activePro}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Employers</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">{metrics.totalEmployers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Job Listings Count</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-primary-600 mt-1">{metrics.totalJobs}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Page Views</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">{metrics.totalPageViews ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Unique Visitors</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-1">{metrics.totalUniqueVisitors ?? 0}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation tabs + Search filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-4 mb-6 gap-4">
        <div className="flex gap-2 p-1 bg-neutral-100 rounded-lg shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("candidates")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
              activeTab === "candidates" ? "bg-white text-primary-600 shadow-sm" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Candidates ({filteredCandidates.length})
          </button>
          <button
            onClick={() => setActiveTab("employers")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
              activeTab === "employers" ? "bg-white text-primary-600 shadow-sm" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Employers ({filteredEmployers.length})
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
              activeTab === "system" ? "bg-white text-primary-600 shadow-sm" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            System Action
          </button>
        </div>

        {activeTab !== "system" && (
          <div className="w-full sm:max-w-xs">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by email or details..."
            />
          </div>
        )}
      </div>

      {/* Main tab contents */}
      <div className="mt-4">
        {activeTab === "candidates" && (
          <Card>
            <div className="overflow-x-auto">
              {filteredCandidates.length === 0 ? (
                <div className="py-12 text-center text-sm text-neutral-400">No candidates match your search query.</div>
              ) : (
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-left">
                    <tr>
                      <th className="px-6 py-3">Email / ID</th>
                      <th className="px-6 py-3">Registered At</th>
                      <th className="px-6 py-3">Preferred Time</th>
                      <th className="px-6 py-3">Subscription</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 bg-white text-sm text-neutral-700">
                    {filteredCandidates.map((c) => (
                      <tr key={c.id} className="hover:bg-neutral-50/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-neutral-900">{c.email}</div>
                          <div className="text-xs text-neutral-400 font-mono mt-0.5">{c.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-neutral-500">
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="default" className="text-xs">{c.preferred_delivery_time}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={c.subscription_status === "active" ? "success" : c.subscription_status === "trial" ? "warning" : "default"}
                              className="text-xs font-semibold"
                            >
                              {c.subscription_status === "active" ? "Pro" : c.subscription_status === "trial" ? "Trial" : "Expired"}
                            </Badge>
                            {c.subscription_ends_at && (
                              <span className="text-[10px] text-neutral-400">
                                ends {new Date(c.subscription_ends_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled={actionLoading !== null}
                              onClick={() => handleToggleSubscription(c.id, c.subscription_status)}
                              className="min-w-[90px] text-xs py-1 px-2"
                            >
                              {actionLoading === `sub-${c.id}` ? (
                                <Spinner size="sm" />
                              ) : c.subscription_status === "active" ? (
                                "Revoke Pro"
                              ) : (
                                "Make Pro"
                              )}
                            </Button>

                            <Button
                              variant={c.is_active ? "secondary" : "primary"}
                              size="sm"
                              disabled={actionLoading !== null}
                              onClick={() => handleToggleMatching(c.id, c.is_active)}
                              className="min-w-[75px] text-xs py-1 px-2"
                            >
                              {actionLoading === `match-${c.id}` ? (
                                <Spinner size="sm" />
                              ) : c.is_active ? (
                                "Pause"
                              ) : (
                                "Resume"
                              )}
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={actionLoading !== null}
                              onClick={() => handleDeleteUser(c.id, "candidate")}
                              className="px-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                            >
                              {actionLoading === `delete-${c.id}` ? <Spinner size="sm" /> : "🗑️"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        )}

        {activeTab === "employers" && (
          <Card>
            <div className="overflow-x-auto">
              {filteredEmployers.length === 0 ? (
                <div className="py-12 text-center text-sm text-neutral-400">No employers match your search query.</div>
              ) : (
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-left">
                    <tr>
                      <th className="px-6 py-3">Email / ID</th>
                      <th className="px-6 py-3">Company Name</th>
                      <th className="px-6 py-3">Registered At</th>
                      <th className="px-6 py-3">Verification</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 bg-white text-sm text-neutral-700">
                    {filteredEmployers.map((e) => (
                      <tr key={e.id} className="hover:bg-neutral-50/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-neutral-900">{e.email}</div>
                          <div className="text-xs text-neutral-400 font-mono mt-0.5">{e.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-neutral-900">
                          {e.company_name || <span className="text-neutral-400 italic">Not set</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-neutral-500">
                          {new Date(e.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={e.is_verified ? "success" : "default"}
                            className="text-xs font-semibold"
                          >
                            {e.is_verified ? "Verified" : "Unverified"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled={actionLoading !== null}
                              onClick={() => handleVerifyEmployer(e.id, e.is_verified)}
                              className="min-w-[90px] text-xs py-1 px-2"
                            >
                              {actionLoading === `verify-${e.id}` ? (
                                <Spinner size="sm" />
                              ) : e.is_verified ? (
                                "Revoke"
                              ) : (
                                "Verify"
                              )}
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={actionLoading !== null}
                              onClick={() => handleDeleteUser(e.id, "employer")}
                              className="px-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                            >
                              {actionLoading === `delete-${e.id}` ? <Spinner size="sm" /> : "🗑️"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        )}

        {activeTab === "system" && (
          <div className="grid gap-6 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Trigger Digest Cron</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-500 mb-4 leading-relaxed">
                  Trigger the entire daily digest process immediately. This will run matching algorithms for all active candidates and send their matches via Resend.
                </p>
                <Button
                  onClick={handleForceTriggerDigest}
                  disabled={actionLoading !== null}
                  className="bg-primary-600 text-white hover:bg-primary-700"
                >
                  {actionLoading === "trigger-digest" ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" /> Running Digest...
                    </div>
                  ) : (
                    "Force Run Daily Digest"
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clean Up Database History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-500 mb-4 leading-relaxed">
                  Deduplication history is used to prevent sending the same job twice. This deletes histories older than 7 days to free database row counts and memory capacity.
                </p>
                <Button
                  onClick={handleCleanHistory}
                  disabled={actionLoading !== null}
                  variant="secondary"
                >
                  {actionLoading === "clean-history" ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" /> Cleaning...
                    </div>
                  ) : (
                    "Clean Up History (>7 days)"
                  )}
                </Button>
              </CardContent>
            </Card>

            {debugInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>System Diagnostics (Admin Only)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs font-mono text-neutral-600 bg-neutral-50 p-4 rounded-lg">
                  <div>Supabase URL: <span className="font-semibold text-neutral-900">{debugInfo.supabaseUrl}</span></div>
                  <div>Service Key Length: <span className="font-semibold text-neutral-900">{debugInfo.serviceKeyLength} characters</span></div>
                  <div>Service Key Prefix Valid (starts with sb_): <span className={`font-semibold ${debugInfo.isServiceKeyPrefixValid ? "text-green-600" : "text-red-600"}`}>{debugInfo.isServiceKeyPrefixValid ? "Yes" : "No"}</span></div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
