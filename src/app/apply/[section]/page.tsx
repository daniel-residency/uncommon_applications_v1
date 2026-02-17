"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { SECTIONS, getSectionIndex, getNextSection, getPrevSection } from "@/config/sections";
import { useApplication } from "@/hooks/use-application";
import ProgressBar from "@/components/application/progress-bar";
import QuestionRenderer from "@/components/application/question-renderer";
import Button from "@/components/ui/button";

export default function SectionPage() {
  const params = useParams();
  const router = useRouter();
  const sectionId = params.section as string;
  const [appId, setAppId] = useState<string | null>(null);
  const [showFreezeWarning, setShowFreezeWarning] = useState(false);
  const [freezing, setFreezing] = useState(false);

  const section = SECTIONS.find((s) => s.id === sectionId);
  const sectionIndex = getSectionIndex(sectionId);
  const isLastSection = sectionIndex === SECTIONS.length - 1;

  useEffect(() => {
    const id = localStorage.getItem("application_id");
    setAppId(id);
  }, []);

  const { answers, loading, saving, lastSaved, updateAnswer, saveNow } =
    useApplication(appId);

  // Save on blur / visibility change
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) saveNow(sectionId);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [saveNow, sectionId]);

  const handleNext = useCallback(async () => {
    await saveNow(sectionId);
    const next = getNextSection(sectionId);
    if (next) {
      router.push(`/apply/${next}`);
    }
  }, [saveNow, sectionId, router]);

  const handlePrev = useCallback(async () => {
    await saveNow(sectionId);
    const prev = getPrevSection(sectionId);
    if (prev) {
      router.push(`/apply/${prev}`);
    }
  }, [saveNow, sectionId, router]);

  const handleFreeze = async () => {
    if (!appId) return;
    setFreezing(true);
    try {
      await saveNow(sectionId);
      await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: appId,
          status: "frozen",
          frozen_at: new Date().toISOString(),
        }),
      });
      router.push("/matching");
    } catch {
      setFreezing(false);
    }
  };

  if (!section) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-dark">Section not found</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-dark text-sm">Loading your answers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 pt-8 sm:pt-16">
      <ProgressBar
        currentSection={sectionId}
        saving={saving}
        lastSaved={lastSaved}
      />

      <div className="w-full max-w-[600px] animate-fade-in">
        <div className="bg-cream rounded-sm p-6 sm:p-10 shadow-sm">
          {/* Section title */}
          <h2 className="text-xl sm:text-2xl font-normal text-ink-dark mb-6 sm:mb-8">
            {section.title}
          </h2>

          {/* Questions */}
          <div className="flex flex-col gap-6 sm:gap-8">
            {section.questions.map((question) => (
              <QuestionRenderer
                key={question.id}
                question={question}
                value={answers[question.id] || ""}
                onChange={(value) => updateAnswer(question.id, value, sectionId)}
                allAnswers={answers}
              />
            ))}
          </div>

          {/* Freeze warning for last section */}
          {isLastSection && !showFreezeWarning && (
            <div className="mt-8 p-4 bg-cream-dark/50 rounded-sm border border-sand">
              <p className="text-sm text-earth leading-relaxed">
                Once you continue, your application answers will be locked and can&apos;t be changed.
                You&apos;ll see which homes matched with you.
              </p>
            </div>
          )}

          {/* Freeze confirmation modal */}
          {showFreezeWarning && (
            <div className="mt-8 p-6 bg-cream-dark rounded-sm border border-sand">
              <p className="text-base text-ink-dark mb-4 font-normal">
                Are you sure? Your answers will be locked.
              </p>
              <p className="text-sm text-earth mb-6">
                Once you see your matches, you won&apos;t be able to change your application
                answers. You&apos;ll still be able to answer questions from your matched homes.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowFreezeWarning(false)}
                >
                  Go back
                </Button>
                <Button size="sm" onClick={handleFreeze} loading={freezing}>
                  See your matches
                </Button>
              </div>
            </div>
          )}

          {/* Navigation */}
          {!showFreezeWarning && (
            <div className="flex justify-between items-center mt-8 sm:mt-10">
              {sectionIndex > 0 ? (
                <button
                  onClick={handlePrev}
                  className="text-sm text-earth hover:text-ink-dark transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back
                </button>
              ) : (
                <div />
              )}

              {isLastSection ? (
                <Button onClick={() => setShowFreezeWarning(true)} size="md">
                  See your matches
                </Button>
              ) : (
                <button
                  onClick={handleNext}
                  className="text-sm text-ink-dark hover:text-ink transition-colors flex items-center gap-2 cursor-pointer"
                >
                  Continue
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
