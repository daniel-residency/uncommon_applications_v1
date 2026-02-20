"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Application, Home } from "@/lib/types";
import ArchBackground from "@/components/matching/arch-background";
import GoldenLetterOverlay from "@/components/matching/golden-letter-overlay";
import VideoModal from "@/components/matching/video-modal";
import QuestionsCard from "@/components/matching/questions-card";

/*
 * Layout constants from Figma (1440×900 frame).
 * Every position is expressed as a % of the viewport so
 * the result is pixel-perfect at 1440 × 900 and scales
 * proportionally at other sizes.
 *
 * Slot order: 0 = left, 1 = center, 2 = right
 */
const LEFT_SLOT = {
  pillar: { left: "-6.667%", top: "46%", width: "45.139%" },
  scroll: { left: "8.958%", top: "42.444%", width: "13.889%" },
};
const CENTER_SLOT = {
  pillar: { left: "23.611%", top: "29.556%", width: "52.708%" },
  scroll: { left: "42.014%", top: "25.889%", width: "15.903%" },
};
const RIGHT_SLOT = {
  pillar: { left: "61.528%", top: "46%", width: "45.139%" },
  scroll: { left: "77.153%", top: "42.444%", width: "13.889%" },
};

/** Map home count to slot assignments (supports 1–3 homes) */
function getSlots(count: number) {
  if (count === 1) return [CENTER_SLOT];
  if (count === 2) return [LEFT_SLOT, RIGHT_SLOT];
  return [LEFT_SLOT, CENTER_SLOT, RIGHT_SLOT];
}

export default function ResultsPage() {
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [matchedHomes, setMatchedHomes] = useState<Home[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [showVideo, setShowVideo] = useState<string | null>(null);
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
      <ArchBackground>
        <div className="h-full flex items-center justify-center">
          <p className="text-mid-gray text-sm lowercase">loading your matches...</p>
        </div>
      </ArchBackground>
    );
  }

  return (
    <ArchBackground>
      <div className="relative w-full h-full">
        {/* ── Title ── */}
        <h1
          className="absolute left-1/2 -translate-x-1/2 text-center lowercase animate-fade-in"
          style={{
            top: "9.2%",
            width: "29.2%",
            fontFamily: "'STIX Two Text', serif",
            fontSize: "clamp(28px, 3.33vw, 48px)",
            fontWeight: 400,
            letterSpacing: "-1.44px",
            lineHeight: "1.1",
            color: "#000",
          }}
        >
          we think these homes<br />could be a great fit
        </h1>

        {/* ── Subtitle ── */}
        <p
          className="absolute left-1/2 -translate-x-1/2 text-center lowercase animate-fade-in-delay"
          style={{
            top: "22.2%",
            width: "29.2%",
            fontFamily: "'Manrope', sans-serif",
            fontSize: "clamp(14px, 1.667vw, 24px)",
            fontWeight: 500,
            letterSpacing: "-0.72px",
            lineHeight: "1.1",
            color: "rgba(0,0,0,0.7)",
          }}
        >
          open each scroll to learn more
        </p>

        {/* ── Pillars ── */}
        {matchedHomes.map((home, idx) => {
          const slots = getSlots(matchedHomes.length);
          const slot = slots[idx];
          if (!slot) return null;
          return (
            <div key={home.id}>
              {/* pillar image */}
              <img
                src="/pillar.png"
                alt=""
                className="absolute pointer-events-none"
                style={{
                  left: slot.pillar.left,
                  top: slot.pillar.top,
                  width: slot.pillar.width,
                  height: "auto",
                }}
              />
              {/* scroll image */}
              <img
                src="/scroll.png"
                alt="scroll"
                className="absolute pointer-events-none"
                style={{
                  left: slot.scroll.left,
                  top: slot.scroll.top,
                  width: slot.scroll.width,
                  height: "auto",
                }}
              />
              {/* clickable area over scroll + pillar top */}
              <button
                data-testid={`column-${home.slug}`}
                onClick={() => setSelectedIdx(idx)}
                className="absolute cursor-pointer z-[5] transition-transform duration-300 hover:scale-[1.03]"
                style={{
                  left: slot.scroll.left,
                  top: slot.scroll.top,
                  width: slot.scroll.width,
                  aspectRatio: "1",
                }}
              />
            </div>
          );
        })}

        {/* ── Bottom fade gradient (Figma: y=708 → y=900, transparent→white) ── */}
        <div
          className="absolute left-0 right-0 pointer-events-none z-[3]"
          style={{
            top: "78.67%",
            bottom: 0,
            background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
          }}
        />

        {/* ── Button area ── */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-[6] animate-fade-in flex flex-col items-center"
          style={{ top: "85.1%", animationDelay: "0.5s", animationFillMode: "both" }}
        >
          {allAnswered ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="lowercase cursor-pointer text-white font-semibold tracking-wide disabled:opacity-60"
              style={{
                width: 305,
                height: 76,
                borderRadius: 10,
                background: "linear-gradient(90deg, #AE8625 0%, #F7EF8A 40%, #D2AC47 75%, #EDC967 100%)",
                boxShadow: "0 6px 20px rgba(247,239,138,0.35)",
                border: "none",
                fontFamily: "'Manrope', sans-serif",
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "-0.84px",
                color: "#000",
              }}
            >
              {submitting ? "..." : "submit your application"}
            </button>
          ) : (
            <button
              onClick={() => setShowAllQuestions(true)}
              className="lowercase cursor-pointer"
              style={{
                width: 305,
                height: 76,
                borderRadius: 10,
                background: "linear-gradient(90deg, #AE8625 0%, #F7EF8A 40%, #D2AC47 75%, #EDC967 100%)",
                boxShadow: "0 6px 20px rgba(247,239,138,0.35)",
                border: "none",
                fontFamily: "'Manrope', sans-serif",
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "-0.84px",
                color: "#000",
              }}
            >
              answer questions
            </button>
          )}

          {homesWithQuestions.length > 0 && !allAnswered && (
            <p className="text-xs text-mid-gray mt-2 lowercase">
              {answeredCount}/{homesWithQuestions.length} questions answered
            </p>
          )}
        </div>

        {/* ── Golden letter overlay ── */}
        {selectedIdx !== null && matchedHomes[selectedIdx] && (
          <GoldenLetterOverlay
            home={matchedHomes[selectedIdx]}
            open={true}
            onClose={() => setSelectedIdx(null)}
            applicantName={application?.answers?.citizenship ? "" : "there"}
            onVideoOpen={() => {
              const videoUrl = matchedHomes[selectedIdx].video_url;
              if (videoUrl) {
                setShowVideo(videoUrl);
              }
            }}
          />
        )}

        {/* ── Video modal ── */}
        {showVideo && (
          <VideoModal
            videoUrl={showVideo}
            open={true}
            onClose={() => setShowVideo(null)}
          />
        )}

        {/* ── Questions card ── */}
        <QuestionsCard
          open={showAllQuestions}
          onClose={() => setShowAllQuestions(false)}
          homes={matchedHomes}
          homeAnswers={homeAnswers}
          onAnswerChange={saveHomeAnswer}
        />
      </div>
    </ArchBackground>
  );
}
