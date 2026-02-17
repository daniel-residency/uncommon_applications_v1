"use client";

import { useEffect, useState } from "react";

interface Stats {
  total: number;
  inProgress: number;
  frozen: number;
  submitted: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-xl font-normal text-ink-dark mb-6">Dashboard</h1>

      {stats ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total", value: stats.total },
            { label: "In Progress", value: stats.inProgress },
            { label: "Frozen", value: stats.frozen },
            { label: "Submitted", value: stats.submitted },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-cream rounded-sm p-6 shadow-sm text-center"
            >
              <p className="text-2xl text-ink-dark mb-1">{stat.value}</p>
              <p className="text-xs text-stone-dark">{stat.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-stone-dark text-sm">Loading stats...</p>
      )}
    </div>
  );
}
