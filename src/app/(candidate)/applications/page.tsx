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

const STATUS_OPTIONS = [
  { value: "saved", label: "Saved", variant: "default" as const },
  { value: "applied", label: "Applied", variant: "info" as const },
  { value: "interview", label: "Interview", variant: "warning" as const },
  { value: "offer", label: "Offer 🎉", variant: "success" as const },
  { value: "rejected", label: "Rejected", variant: "error" as const },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ job_title: "", company: "", job_url: "", notes: "" });
  const [isSaving, setIsSaving] = useState(false);

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
      setFormData({ job_title: "", company: "", job_url: "", notes: "" });
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
    setApplications(applications.map((a) => a.id === id ? { ...a, status } : a));
  }

  async function deleteApp(id: string) {
    await fetch(`/api/applications?id=${id}`, { method: "DELETE" });
    setApplications(applications.filter((a) => a.id !== id));
  }

  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "applied").length,
    interview: applications.filter((a) => a.status === "interview").length,
    offer: applications.filter((a) => a.status === "offer").length,
  };

  if (isLoading) return <div className="py-16 text-center text-neutral-500">Loading...</div>;

  return (
    <div className="py-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Application Tracker</h1>
            <p className="mt-1 text-neutral-600">Track every job you apply to.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "+ Add"}</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-lg bg-white border border-neutral-200 p-3 text-center">
            <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
            <p className="text-xs text-neutral-500">Total</p>
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-center">
            <p className="text-2xl font-bold text-blue-700">{stats.applied}</p>
            <p className="text-xs text-blue-600">Applied</p>
          </div>
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-center">
            <p className="text-2xl font-bold text-yellow-700">{stats.interview}</p>
            <p className="text-xs text-yellow-600">Interviews</p>
          </div>
          <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center">
            <p className="text-2xl font-bold text-green-700">{stats.offer}</p>
            <p className="text-xs text-green-600">Offers</p>
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <Card padding="md" className="mb-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <input type="text" placeholder="Job Title *" value={formData.job_title} onChange={(e) => setFormData({ ...formData, job_title: e.target.value })} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
              <input type="text" placeholder="Company *" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
              <input type="url" placeholder="Job URL (optional)" value={formData.job_url} onChange={(e) => setFormData({ ...formData, job_url: e.target.value })} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
              <input type="text" placeholder="Notes (optional)" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[44px]" />
            </div>
            <Button onClick={handleAdd} isLoading={isSaving} className="mt-3">Save Application</Button>
          </Card>
        )}

        {/* Applications List */}
        {applications.length === 0 ? (
          <Card padding="lg" className="text-center">
            <p className="text-neutral-600">No applications tracked yet. Click &quot;+ Add&quot; to start tracking.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <Card key={app.id} padding="md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-neutral-900 truncate">{app.job_title}</h3>
                      <Badge variant={STATUS_OPTIONS.find((s) => s.value === app.status)?.variant || "default"}>
                        {STATUS_OPTIONS.find((s) => s.value === app.status)?.label || app.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-600">{app.company}</p>
                    {app.notes && <p className="text-xs text-neutral-500 mt-1">{app.notes}</p>}
                    <p className="text-xs text-neutral-400 mt-1">
                      {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className="rounded border border-neutral-300 px-2 py-1 text-xs min-h-[36px]"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                    {app.job_url && (
                      <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline">
                        View
                      </a>
                    )}
                    <button onClick={() => deleteApp(app.id)} className="text-xs text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
