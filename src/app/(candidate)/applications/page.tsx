"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Application {
  id: string;
  job_title: string;
  company: string;
  job_url: string | null;
  status: string;
  notes: string;
  applied_at: string;
}

const KANBAN_COLUMNS = [
  { value: "saved", label: "Saved", emoji: "📌", headerBg: "bg-neutral-100 text-neutral-800", badgeVariant: "default" as const },
  { value: "applied", label: "Applied", emoji: "📩", headerBg: "bg-blue-100 text-blue-800", badgeVariant: "info" as const },
  { value: "interview", label: "Interview", emoji: "🎯", headerBg: "bg-amber-100 text-amber-800", badgeVariant: "warning" as const },
  { value: "offer", label: "Offer", emoji: "🎉", headerBg: "bg-green-100 text-green-800", badgeVariant: "success" as const },
  { value: "rejected", label: "Rejected", emoji: "❌", headerBg: "bg-red-100 text-red-800", badgeVariant: "error" as const },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ job_title: "", company: "", job_url: "", notes: "", status: "saved" });
  const [isSaving, setIsSaving] = useState(false);
  
  // Cold Email Modal state
  const [selectedAppForEmail, setSelectedAppForEmail] = useState<Application | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    const res = await fetch("/api/applications");
    if (res.ok) setApplications(await res.json());
    setIsLoading(false);
  }

  async function handleAdd() {
    if (!formData.job_title || !formData.company) return;
    setIsSaving(true);
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      const newApp = await res.json();
      setApplications([newApp, ...applications]);
      setFormData({ job_title: "", company: "", job_url: "", notes: "", status: "saved" });
      setShowForm(false);
    }
    setIsSaving(false);
  }

  async function updateStatus(id: string, status: string) {
    await fetch("/api/applications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setApplications(applications.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  async function deleteApp(id: string) {
    await fetch(`/api/applications?id=${id}`, { method: "DELETE" });
    setApplications(applications.filter((a) => a.id !== id));
  }

  function generateColdEmail(app: Application) {
    return `Subject: Expressing interest in ${app.job_title} role at ${app.company}

Hi [Hiring Manager / Recruiter Name],

I recently noticed the open ${app.job_title} position at ${app.company} and wanted to reach out directly.

I bring strong relevant technical experience and a track record of building high-performance web applications. Given ${app.company}'s work in the industry, I am confident I can make an immediate impact on your team.

I’d love to connect for 10 minutes to share how my background matches your current requirements. My resume is attached for your review.

Best regards,
[Your Name]
[Your Phone / Portfolio Link]`;
  }

  function handleCopyColdEmail() {
    if (!selectedAppForEmail) return;
    const text = generateColdEmail(selectedAppForEmail);
    navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  }

  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "applied").length,
    interview: applications.filter((a) => a.status === "interview").length,
    offer: applications.filter((a) => a.status === "offer").length,
  };

  if (isLoading) return <div className="py-16 text-center text-neutral-500">Loading your job tracker...</div>;

  return (
    <div className="py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Application Tracker CRM</h1>
            <p className="mt-1 text-neutral-600 text-sm">
              Manage your job search pipeline, track interview stages, and draft recruiter outreach emails.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-lg border border-neutral-200 bg-neutral-100 p-1">
              <button
                onClick={() => setViewMode("kanban")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === "kanban" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                📊 Kanban Board
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === "list" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                📜 List View
              </button>
            </div>

            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "+ Add Job"}
            </Button>
          </div>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-lg bg-white border border-neutral-200 p-3 text-center">
            <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
            <p className="text-xs text-neutral-500">Total Tracked</p>
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-center">
            <p className="text-2xl font-bold text-blue-700">{stats.applied}</p>
            <p className="text-xs text-blue-600">Active Applications</p>
          </div>
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-center">
            <p className="text-2xl font-bold text-yellow-700">{stats.interview}</p>
            <p className="text-xs text-yellow-600">Interviews</p>
          </div>
          <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center">
            <p className="text-2xl font-bold text-green-700">{stats.offer}</p>
            <p className="text-xs text-green-600">Offers 🎉</p>
          </div>
        </div>

        {/* Add Job Form */}
        {showForm && (
          <Card padding="md" className="mb-6 border-primary-200 bg-primary-50/30">
            <h3 className="font-semibold text-neutral-900 text-sm mb-3">Add New Job Application</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Job Title *"
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]"
              />
              <input
                type="text"
                placeholder="Company Name *"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]"
              />
              <input
                type="url"
                placeholder="Job Posting URL (optional)"
                value={formData.job_url}
                onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]"
              >
                {KANBAN_COLUMNS.map((col) => (
                  <option key={col.value} value={col.value}>
                    {col.emoji} {col.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Notes (e.g. Referred by John, Salary $120k)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="sm:col-span-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]"
              />
            </div>
            <Button onClick={handleAdd} isLoading={isSaving} className="mt-3">
              Save Application
            </Button>
          </Card>
        )}

        {/* View Mode: KANBAN BOARD */}
        {viewMode === "kanban" ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {KANBAN_COLUMNS.map((column) => {
              const columnApps = applications.filter((a) => a.status === column.value);
              return (
                <div key={column.value} className="flex flex-col rounded-xl border border-neutral-200 bg-neutral-50/70 p-3 min-w-[220px]">
                  {/* Column Header */}
                  <div className={`flex items-center justify-between px-3 py-1.5 rounded-lg font-semibold text-xs mb-3 ${column.headerBg}`}>
                    <span>
                      {column.emoji} {column.label}
                    </span>
                    <span className="rounded-full bg-white/80 px-2 py-0.5 text-neutral-700 text-[10px] font-bold">
                      {columnApps.length}
                    </span>
                  </div>

                  {/* Cards inside column */}
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px]">
                    {columnApps.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-neutral-300 p-4 text-center text-xs text-neutral-400">
                        No jobs in {column.label}
                      </div>
                    ) : (
                      columnApps.map((app) => (
                        <div
                          key={app.id}
                          className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm hover:shadow transition-shadow flex flex-col justify-between gap-2"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="font-semibold text-neutral-900 text-sm leading-tight">{app.job_title}</h4>
                              <button
                                onClick={() => deleteApp(app.id)}
                                className="text-neutral-300 hover:text-red-500 text-xs shrink-0"
                                title="Delete"
                              >
                                ✕
                              </button>
                            </div>
                            <p className="text-xs text-neutral-600 font-medium mt-0.5">{app.company}</p>

                            {app.notes && (
                              <p className="text-[11px] text-neutral-500 bg-neutral-50 p-1.5 rounded mt-2 line-clamp-2">
                                📝 {app.notes}
                              </p>
                            )}

                            <p className="text-[10px] text-neutral-400 mt-2">
                              Added {new Date(app.applied_at).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="border-t border-neutral-100 pt-2 flex items-center justify-between gap-1 flex-wrap">
                            <button
                              onClick={() => setSelectedAppForEmail(app)}
                              className="text-[11px] text-primary-600 hover:underline font-medium flex items-center gap-1"
                            >
                              ✉️ Cold Email
                            </button>

                            <select
                              value={app.status}
                              onChange={(e) => updateStatus(app.id, e.target.value)}
                              className="rounded border border-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-700 bg-neutral-50 hover:bg-white"
                            >
                              {KANBAN_COLUMNS.map((col) => (
                                <option key={col.value} value={col.value}>
                                  Move to: {col.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* View Mode: LIST VIEW */
          <div className="space-y-3">
            {applications.length === 0 ? (
              <Card padding="lg" className="text-center">
                <p className="text-neutral-600">No applications tracked yet. Click "+ Add Job" to start tracking.</p>
              </Card>
            ) : (
              applications.map((app) => (
                <Card key={app.id} padding="md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-neutral-900 truncate">{app.job_title}</h3>
                        <Badge variant={KANBAN_COLUMNS.find((s) => s.value === app.status)?.badgeVariant || "default"}>
                          {KANBAN_COLUMNS.find((s) => s.value === app.status)?.label || app.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-600">{app.company}</p>
                      {app.notes && <p className="text-xs text-neutral-500 mt-1">{app.notes}</p>}
                      <p className="text-xs text-neutral-400 mt-1">Added {new Date(app.applied_at).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <button
                        onClick={() => setSelectedAppForEmail(app)}
                        className="text-xs font-medium text-primary-600 hover:bg-primary-50 px-2 py-1 rounded border border-primary-200 min-h-[36px] flex items-center gap-1"
                      >
                        ✉️ Cold Email
                      </button>

                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className="rounded border border-neutral-300 px-2 py-1 text-xs min-h-[36px]"
                      >
                        {KANBAN_COLUMNS.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.emoji} {s.label}
                          </option>
                        ))}
                      </select>

                      {app.job_url && (
                        <a
                          href={app.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-neutral-600 hover:underline min-h-[36px] flex items-center"
                        >
                          View Link
                        </a>
                      )}

                      <button onClick={() => deleteApp(app.id)} className="text-xs text-red-500 hover:text-red-700 min-h-[36px] flex items-center">
                        Delete
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Cold Email Modal */}
        {selectedAppForEmail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card padding="lg" className="w-full max-w-xl bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <h3 className="font-bold text-neutral-900 text-lg flex items-center gap-2">
                  <span>✉️</span> Cold Outreach Email Draft
                </h3>
                <button
                  onClick={() => setSelectedAppForEmail(null)}
                  className="text-neutral-400 hover:text-neutral-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-neutral-600">
                Send this tailored outreach message directly to the recruiter or hiring manager at <strong>{selectedAppForEmail.company}</strong> on LinkedIn or email:
              </p>

              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 font-mono text-xs text-neutral-800 whitespace-pre-wrap leading-relaxed max-h-[250px] overflow-y-auto">
                {generateColdEmail(selectedAppForEmail)}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setSelectedAppForEmail(null)}>
                  Close
                </Button>
                <Button onClick={handleCopyColdEmail}>
                  {copiedEmail ? "Copied to Clipboard! ✓" : "Copy Outreach Email"}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
