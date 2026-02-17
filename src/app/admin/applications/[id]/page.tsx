"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Application, Home } from "@/lib/types";
import { SECTIONS } from "@/config/sections";

export default function ApplicationDetail() {
  const params = useParams();
  const id = params.id as string;
  const [application, setApplication] = useState<Application | null>(null);
  const [homes, setHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/applications?id=${id}`).then((r) => r.json()),
      fetch("/api/homes").then((r) => r.json()),
    ])
      .then(([app, allHomes]) => {
        setApplication(app);
        setHomes(allHomes);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-stone-dark text-sm">Loading...</p>;
  }

  if (!application) {
    return <p className="text-stone-dark">Application not found</p>;
  }

  const matchedHomes = (application.matched_home_ids || [])
    .map((hid) => homes.find((h) => h.id === hid))
    .filter(Boolean) as Home[];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Link
        href="/admin/applications"
        className="text-sm text-earth hover:text-ink-dark mb-4 inline-block"
      >
        &larr; Back to applications
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-normal text-ink-dark">{application.email}</h1>
          <p className="text-sm text-earth mt-1">
            Status:{" "}
            <span
              className={`px-2 py-0.5 rounded-sm text-xs ${
                application.status === "submitted"
                  ? "bg-green/10 text-green"
                  : application.status === "frozen"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-sand/50 text-earth"
              }`}
            >
              {application.status}
            </span>
          </p>
        </div>
        <div className="text-right text-xs text-stone-dark">
          <p>Created: {new Date(application.created_at).toLocaleString()}</p>
          {application.frozen_at && (
            <p>Frozen: {new Date(application.frozen_at).toLocaleString()}</p>
          )}
          {application.submitted_at && (
            <p>Submitted: {new Date(application.submitted_at).toLocaleString()}</p>
          )}
        </div>
      </div>

      {/* Matched homes */}
      {matchedHomes.length > 0 && (
        <div className="bg-cream rounded-sm p-6 shadow-sm mb-6">
          <h2 className="text-sm text-stone-dark mb-3">Matched Homes (ranked)</h2>
          <div className="flex gap-3">
            {matchedHomes.map((home, i) => (
              <div
                key={home.id}
                className="flex items-center gap-2 px-3 py-2 rounded-sm border border-sand"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[0.6rem] font-semibold"
                  style={{ background: home.color }}
                >
                  {i + 1}
                </div>
                <span className="text-sm text-ink-dark">{home.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Answers by section */}
      {SECTIONS.map((section) => {
        const sectionAnswers = section.questions
          .map((q) => ({
            question: q.label,
            answer: application.answers[q.id],
          }))
          .filter((a) => a.answer);

        if (sectionAnswers.length === 0) return null;

        return (
          <div key={section.id} className="bg-cream rounded-sm p-6 shadow-sm mb-4">
            <h2 className="text-base text-ink-dark mb-4">{section.title}</h2>
            <div className="space-y-4">
              {sectionAnswers.map((a, i) => (
                <div key={i}>
                  <p className="text-xs text-stone-dark mb-1">{a.question}</p>
                  <p className="text-sm text-ink-dark whitespace-pre-wrap">{a.answer}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Home answers */}
      {matchedHomes.some((h) => application.answers[`home_${h.id}`]) && (
        <div className="bg-cream rounded-sm p-6 shadow-sm mb-4">
          <h2 className="text-base text-ink-dark mb-4">Home Question Answers</h2>
          <div className="space-y-4">
            {matchedHomes
              .filter((h) => application.answers[`home_${h.id}`])
              .map((home) => (
                <div key={home.id}>
                  <p className="text-xs text-stone-dark mb-1">
                    {home.name}: {home.question}
                  </p>
                  <p className="text-sm text-ink-dark whitespace-pre-wrap">
                    {application.answers[`home_${home.id}`]}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
