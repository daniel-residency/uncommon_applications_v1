"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Application, Home } from "@/lib/types";
import EnvelopeCard from "@/components/matching/envelope-card";
import LetterModal from "@/components/matching/letter-modal";
import Button from "@/components/ui/button";

export default function ResultsPage() {
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [homes, setHomes] = useState<Home[]>([]);
  const [matchedHomes, setMatchedHomes] = useState<Home[]>([]);
  const [arrived, setArrived] = useState([false, false, false]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [homeAnswers, setHomeAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data
  useEffect(() => {
    const appId = localStorage.getItem("application_id");
    if (!appId) {
      router.push("/");
      return;
    }

    Promise.all([
      fetch(`/api/applications?id=${appId}`).then((r) => r.json()),
      fetch("/api/homes").then((r) => r.json()),
    ])
      .then(([app, allHomes]) => {
        if (!app.matched_home_ids?.length) {
          router.push("/matching");
          return;
        }

        setApplication(app);
        setHomes(allHomes);

        // Get matched homes in order
        const matched = app.matched_home_ids
          .map((id: string) => allHomes.find((h: Home) => h.id === id))
          .filter(Boolean) as Home[];
        setMatchedHomes(matched);

        // Load existing home answers
        const existingAnswers: Record<string, string> = {};
        for (const [key, value] of Object.entries(app.answers as Record<string, string>)) {
          if (key.startsWith("home_")) {
            existingAnswers[key] = value;
          }
        }
        setHomeAnswers(existingAnswers);
        setLoading(false);

        // Stagger envelope arrivals
        setTimeout(() => setArrived([true, false, false]), 300);
        setTimeout(() => setArrived([true, true, false]), 700);
        setTimeout(() => setArrived([true, true, true]), 1100);
      })
      .catch(() => router.push("/"));
  }, [router]);

  // Save home answer
  const saveHomeAnswer = useCallback(
    async (homeId: string, value: string) => {
      const key = `home_${homeId}`;
      const updated = { ...homeAnswers, [key]: value };
      setHomeAnswers(updated);

      if (!application) return;

      // Debounced save
      const newAnswers = { ...application.answers, ...updated };
      await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: application.id,
          answers: newAnswers,
        }),
      });
    },
    [homeAnswers, application]
  );

  // Submit
  const handleSubmit = async () => {
    if (!application) return;
    setSubmitting(true);
    try {
      await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: application.id,
          status: "submitted",
          submitted_at: new Date().toISOString(),
        }),
      });
      router.push("/submit");
    } catch {
      setSubmitting(false);
    }
  };

  // Check if all home questions are answered
  const homesWithQuestions = matchedHomes.filter((h) => h.question);
  const answeredCount = homesWithQuestions.filter(
    (h) => homeAnswers[`home_${h.id}`]?.trim()
  ).length;
  const allAnswered = answeredCount === homesWithQuestions.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-dark text-sm">Loading your matches...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 pt-12 sm:pt-20">
      <div className="w-full max-w-[1000px] text-center">
        <h2 className="text-xl sm:text-2xl font-normal text-ink-dark mb-2 animate-fade-in">
          We think these homes could be a great fit
        </h2>
        <p className="text-sm sm:text-base text-earth mb-8 sm:mb-12 animate-fade-in-delay">
          Open each letter to learn more
        </p>

        {/* Envelope cards */}
        <div className="flex justify-center gap-6 sm:gap-12 flex-wrap mb-8 sm:mb-12">
          {matchedHomes.map((home, idx) => (
            <EnvelopeCard
              key={home.id}
              home={home}
              arrived={arrived[idx]}
              hasQuestion={!!home.question}
              questionAnswered={!!homeAnswers[`home_${home.id}`]?.trim()}
              onClick={() => setSelectedIdx(idx)}
            />
          ))}
        </div>

        {/* Submit section */}
        <div className="bg-cream rounded-sm px-6 sm:px-8 py-5 sm:py-6 shadow-sm inline-flex flex-col items-center gap-4 animate-fade-in" style={{ animationDelay: "0.8s", animationFillMode: "both" }}>
          {homesWithQuestions.length > 0 && (
            <p className="text-sm text-earth">
              {answeredCount} of {homesWithQuestions.length} home questions answered
            </p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            loading={submitting}
            size="lg"
          >
            Submit application
          </Button>

          {!allAnswered && homesWithQuestions.length > 0 && (
            <p className="text-xs text-stone-dark italic">
              Answer all home questions to submit
            </p>
          )}
        </div>
      </div>

      {/* Letter modal */}
      {selectedIdx !== null && matchedHomes[selectedIdx] && (
        <LetterModal
          home={matchedHomes[selectedIdx]}
          open={true}
          onClose={() => setSelectedIdx(null)}
          applicantName={application?.answers?.citizenship ? "" : "there"}
          homeAnswer={homeAnswers[`home_${matchedHomes[selectedIdx].id}`] || ""}
          onAnswerChange={(value) =>
            saveHomeAnswer(matchedHomes[selectedIdx].id, value)
          }
        />
      )}
    </div>
  );
}
