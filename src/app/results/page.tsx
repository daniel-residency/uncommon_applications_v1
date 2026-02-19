"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Application, Home } from "@/lib/types";
import LetterModal from "@/components/matching/letter-modal";
import AllQuestionsModal from "@/components/matching/all-questions-modal";
import Button from "@/components/ui/button";

const HOME_COVERS: Record<string, string> = {
  vienna: "linear-gradient(160deg, #4A6741 0%, #2D4A28 30%, #3A5A35 50%, #1A3A1A 80%, #0D2D0D 100%)",
  homebrew: "linear-gradient(160deg, #D4A060 0%, #B8844A 20%, #8B6A40 40%, #6A5030 60%, #4A3A20 80%, #3A2A18 100%)",
  arcadia: "linear-gradient(160deg, #5A8A4A 0%, #3A7A3A 25%, #2A6A2A 50%, #1A5A1A 75%, #0A4A0A 100%)",
  sf2: "linear-gradient(160deg, #7B8FD4 0%, #5A6FB8 40%, #4A5FA8 70%, #3A4F98 100%)",
  inventors: "linear-gradient(160deg, #9B7BB8 0%, #8A6AA8 40%, #7B5B98 70%, #5B3B78 100%)",
  bangalore: "linear-gradient(160deg, #D4A84A 0%, #C8983A 40%, #B88A2A 70%, #986A1A 100%)",
  biopunk: "linear-gradient(160deg, #4A8A7A 0%, #3A7A6A 40%, #2A6A5A 70%, #1A4A3A 100%)",
  "c-house": "linear-gradient(160deg, #D4451A 0%, #B8350E 40%, #9A2A08 70%, #7A1A04 100%)",
  cornell: "linear-gradient(160deg, #B31B1B 0%, #9A1515 40%, #7A0E0E 70%, #5A0808 100%)",
  odyssey: "linear-gradient(160deg, #1B365D 0%, #152A4A 40%, #0E1E38 70%, #081428 100%)",
  sf_parc: "linear-gradient(160deg, #7B5B98 0%, #6A4A88 40%, #5A3A78 70%, #4A2A68 100%)",
};

function getHomeCover(home: Home) {
  if (home.slug && HOME_COVERS[home.slug]) return HOME_COVERS[home.slug];
  const lower = home.name.toLowerCase();
  for (const [k, v] of Object.entries(HOME_COVERS)) {
    if (lower.includes(k)) return v;
  }
  return "linear-gradient(160deg, #5A6A7A 0%, #3A4A5A 60%, #1A2A3A 100%)";
}

export default function ResultsPage() {
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [matchedHomes, setMatchedHomes] = useState<Home[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [homeAnswers, setHomeAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

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

        const matched = app.matched_home_ids
          .map((id: string) => allHomes.find((h: Home) => h.id === id))
          .filter(Boolean) as Home[];
        setMatchedHomes(matched);

        const existingAnswers: Record<string, string> = {};
        for (const [key, value] of Object.entries(app.answers as Record<string, string>)) {
          if (key.startsWith("home_")) {
            existingAnswers[key] = value;
          }
        }
        setHomeAnswers(existingAnswers);
        setLoading(false);
      })
      .catch(() => router.push("/"));
  }, [router]);

  const saveHomeAnswer = useCallback(
    async (homeId: string, value: string) => {
      const key = `home_${homeId}`;
      const updated = { ...homeAnswers, [key]: value };
      setHomeAnswers(updated);

      if (!application) return;

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

  const homesWithQuestions = matchedHomes.filter((h) => h.question);
  const answeredCount = homesWithQuestions.filter(
    (h) => homeAnswers[`home_${h.id}`]?.trim()
  ).length;
  const allAnswered = homesWithQuestions.length === 0 || answeredCount === homesWithQuestions.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-mid-gray text-sm lowercase">loading your matches...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 py-12">
      <div className="w-full max-w-[960px] text-center">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink lowercase mb-3 animate-fade-in">
          your matches
        </h1>
        <p className="text-sm text-mid-gray lowercase mb-12 sm:mb-16 animate-fade-in-delay max-w-[420px] mx-auto leading-relaxed">
          we found {matchedHomes.length} amazing houses for you! click each to
          learn more and answer their question.
        </p>

        {/* magazine cards */}
        <div className="flex justify-center items-center gap-4 sm:gap-5 mb-12 sm:mb-14">
          {matchedHomes.map((home, idx) => {
            const cover = getHomeCover(home);
            const isCenter = idx === 1;
            const cardWidth = isCenter ? 230 : 210;
            const cardHeight = isCenter ? 310 : 285;

            return (
              <button
                key={home.id}
                onClick={() => setSelectedIdx(idx)}
                className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] animate-fade-in"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  animationDelay: `${idx * 0.15}s`,
                  animationFillMode: "both",
                  background: cover,
                  boxShadow: isCenter
                    ? "0 16px 48px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12)"
                    : "0 10px 32px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08)",
                  zIndex: isCenter ? 2 : 1,
                }}
              >
                {/* dark gradient overlay for text readability */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.5) 100%)" }}
                />

                {/* home name - magazine cover style */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                  <h3 className="font-serif text-white lowercase leading-[0.9]" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                    <span className="block font-bold italic" style={{ fontSize: isCenter ? "40px" : "36px" }}>
                      {home.name.toLowerCase().replace(" residency", "").replace("the ", "")}
                    </span>
                    <span className="block font-bold italic mt-1 text-white/85" style={{ fontSize: isCenter ? "32px" : "28px" }}>
                      house
                    </span>
                  </h3>
                </div>

                {/* question indicator */}
                {home.question && (
                  <div className="absolute top-3 right-3">
                    <div className={`w-2 h-2 rounded-full ${homeAnswers[`home_${home.id}`]?.trim() ? "bg-green-400" : "bg-white/50"}`} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* submit / answer section */}
        <div className="animate-fade-in flex flex-col items-center gap-3" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
          <Button
            onClick={allAnswered ? handleSubmit : () => setShowAllQuestions(true)}
            disabled={submitting}
            loading={submitting}
            size="lg"
          >
            {allAnswered ? "submit your application" : "answer questions"}
          </Button>

          {homesWithQuestions.length > 0 && !allAnswered && (
            <p className="text-xs text-mid-gray mt-1 lowercase">
              {answeredCount}/{homesWithQuestions.length} questions answered
            </p>
          )}
        </div>
      </div>

      {/* letter modal */}
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

      {/* all questions modal */}
      <AllQuestionsModal
        open={showAllQuestions}
        onClose={() => setShowAllQuestions(false)}
        homes={matchedHomes}
        homeAnswers={homeAnswers}
        onAnswerChange={saveHomeAnswer}
      />
    </div>
  );
}
