"use client";

import { useState } from "react";
import { SECTIONS } from "@/config/sections";
import Button from "@/components/ui/button";

export default function AdminExport() {
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("submitted");

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/applications");
      const applications = await res.json();

      const filtered = statusFilter
        ? applications.filter((a: { status: string }) => a.status === statusFilter)
        : applications;

      // Build CSV
      const allQuestionIds = SECTIONS.flatMap((s) =>
        s.questions.map((q) => q.id)
      );
      const allQuestionLabels = SECTIONS.flatMap((s) =>
        s.questions.map((q) => q.label)
      );

      const headers = [
        "Email",
        "Status",
        "Created At",
        "Frozen At",
        "Submitted At",
        "Matched Homes",
        ...allQuestionLabels,
      ];

      const rows = filtered.map((app: { email: string; status: string; created_at: string; frozen_at: string | null; submitted_at: string | null; matched_home_ids: string[] | null; answers: Record<string, string> }) => {
        const base = [
          app.email,
          app.status,
          app.created_at,
          app.frozen_at || "",
          app.submitted_at || "",
          (app.matched_home_ids || []).join("; "),
        ];
        const answers = allQuestionIds.map((qid) => app.answers?.[qid] || "");
        return [...base, ...answers];
      });

      const csvContent = [
        headers.map(escapeCSV).join(","),
        ...rows.map((row: string[]) => row.map(escapeCSV).join(",")),
      ].join("\n");

      // Download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `applications_${statusFilter || "all"}_${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-xl font-normal text-ink-dark mb-6">Export Applications</h1>

      <div className="bg-cream rounded-sm p-8 shadow-sm">
        <div className="mb-6">
          <label className="block text-sm text-ink-dark mb-2">Filter by status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-sand rounded-sm px-4 py-2 text-sm font-serif bg-cream text-ink-dark outline-none cursor-pointer"
          >
            <option value="">All</option>
            <option value="in_progress">In Progress</option>
            <option value="frozen">Frozen</option>
            <option value="submitted">Submitted</option>
          </select>
        </div>

        <Button onClick={handleExport} loading={loading}>
          Download CSV
        </Button>

        <p className="text-xs text-stone-dark mt-4">
          Export includes all application answers, status, timestamps, and matched homes.
        </p>
      </div>
    </div>
  );
}

function escapeCSV(value: string): string {
  const str = String(value || "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
