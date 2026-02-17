"use client";

import { useEffect, useState } from "react";
import { Home } from "@/lib/types";

export default function AdminHomes() {
  const [homes, setHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Home>>({});

  const loadHomes = () => {
    fetch("/api/homes")
      .then((r) => r.json())
      .then((data) => {
        setHomes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadHomes();
  }, []);

  const startEdit = (home: Home) => {
    setEditing(home.id);
    setEditData({
      name: home.name,
      color: home.color,
      location: home.location,
      description_template: home.description_template,
      matching_prompt: home.matching_prompt,
      question: home.question,
      video_url: home.video_url,
      active: home.active,
      display_order: home.display_order,
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    await fetch("/api/homes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editing, ...editData }),
    });
    setEditing(null);
    loadHomes();
  };

  const toggleActive = async (home: Home) => {
    await fetch("/api/homes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: home.id, active: !home.active }),
    });
    loadHomes();
  };

  if (loading) {
    return <p className="text-stone-dark text-sm">Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <h1 className="text-xl font-normal text-ink-dark mb-6">Homes</h1>

      <div className="space-y-4">
        {homes.map((home) => (
          <div key={home.id} className="bg-cream rounded-sm p-6 shadow-sm">
            {editing === home.id ? (
              /* Edit form */
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-stone-dark">Name</label>
                    <input
                      value={editData.name || ""}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full border border-sand rounded-sm px-3 py-2 text-sm font-serif bg-transparent outline-none focus:border-ink-dark"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-stone-dark">Location</label>
                    <input
                      value={editData.location || ""}
                      onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                      className="w-full border border-sand rounded-sm px-3 py-2 text-sm font-serif bg-transparent outline-none focus:border-ink-dark"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-stone-dark">Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={editData.color || "#000000"}
                        onChange={(e) => setEditData({ ...editData, color: e.target.value })}
                        className="w-8 h-8 cursor-pointer"
                      />
                      <input
                        value={editData.color || ""}
                        onChange={(e) => setEditData({ ...editData, color: e.target.value })}
                        className="flex-1 border border-sand rounded-sm px-3 py-2 text-sm font-serif bg-transparent outline-none focus:border-ink-dark"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-stone-dark">Letter Template</label>
                  <textarea
                    value={editData.description_template || ""}
                    onChange={(e) => setEditData({ ...editData, description_template: e.target.value })}
                    className="w-full border border-sand rounded-sm px-3 py-2 text-sm font-serif bg-transparent outline-none focus:border-ink-dark min-h-[100px] resize-y"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-dark">Matching Prompt</label>
                  <textarea
                    value={editData.matching_prompt || ""}
                    onChange={(e) => setEditData({ ...editData, matching_prompt: e.target.value })}
                    className="w-full border border-sand rounded-sm px-3 py-2 text-sm font-serif bg-transparent outline-none focus:border-ink-dark min-h-[100px] resize-y"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-dark">Question (optional)</label>
                  <input
                    value={editData.question || ""}
                    onChange={(e) => setEditData({ ...editData, question: e.target.value || null })}
                    className="w-full border border-sand rounded-sm px-3 py-2 text-sm font-serif bg-transparent outline-none focus:border-ink-dark"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 bg-ink-dark text-cream text-sm rounded-sm cursor-pointer hover:bg-ink transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="px-4 py-2 border border-sand text-sm rounded-sm cursor-pointer hover:border-ink-dark transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Display */
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                    style={{ background: home.color }}
                  >
                    {home.display_order}
                  </div>
                  <div>
                    <h3 className="text-base text-ink-dark">{home.name}</h3>
                    <p className="text-xs text-earth">{home.location}</p>
                    {home.question && (
                      <p className="text-xs text-stone-dark mt-1 italic">Q: {home.question}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleActive(home)}
                    className={`text-xs px-3 py-1 rounded-sm cursor-pointer transition-colors ${
                      home.active
                        ? "bg-green/10 text-green"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {home.active ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => startEdit(home)}
                    className="text-xs text-ink-dark hover:text-ink underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
