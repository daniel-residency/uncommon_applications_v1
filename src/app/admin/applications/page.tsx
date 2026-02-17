"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Application } from "@/lib/types";

export default function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/applications")
      .then((r) => r.json())
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = applications.filter((app) => {
    const matchSearch = !search || app.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <h1 className="text-xl font-normal text-ink-dark mb-6">Applications</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email..."
          className="border border-sand rounded-sm px-4 py-2 text-sm font-serif bg-cream text-ink-dark outline-none focus:border-ink-dark flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-sand rounded-sm px-4 py-2 text-sm font-serif bg-cream text-ink-dark outline-none cursor-pointer"
        >
          <option value="">All statuses</option>
          <option value="in_progress">In Progress</option>
          <option value="frozen">Frozen</option>
          <option value="submitted">Submitted</option>
        </select>
      </div>

      {loading ? (
        <p className="text-stone-dark text-sm">Loading...</p>
      ) : (
        <div className="bg-cream rounded-sm shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand">
                <th className="text-left p-4 text-stone-dark font-normal">Email</th>
                <th className="text-left p-4 text-stone-dark font-normal">Status</th>
                <th className="text-left p-4 text-stone-dark font-normal">Section</th>
                <th className="text-left p-4 text-stone-dark font-normal">Created</th>
                <th className="text-left p-4 text-stone-dark font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} className="border-b border-sand/50 hover:bg-cream-dark/30 transition-colors">
                  <td className="p-4 text-ink-dark">{app.email}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-sm ${
                        app.status === "submitted"
                          ? "bg-green/10 text-green"
                          : app.status === "frozen"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-sand/50 text-earth"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 text-earth">{app.current_section || "—"}</td>
                  <td className="p-4 text-earth">
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="text-xs text-ink-dark hover:text-ink underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-dark">
                    No applications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-stone-dark mt-4">
        {filtered.length} of {applications.length} applications
      </p>
    </div>
  );
}
