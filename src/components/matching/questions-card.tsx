"use client";

import { useEffect, useCallback } from "react";
import { Home } from "@/lib/types";

interface QuestionsCardProps {
  open: boolean;
  onClose: () => void;
  homes: Home[];
  homeAnswers: Record<string, string>;
  onAnswerChange: (homeId: string, value: string) => void;
}

export default function QuestionsCard({
  open,
  onClose,
  homes,
  homeAnswers,
  onAnswerChange,
}: QuestionsCardProps) {
  const homesWithQuestions = homes.filter((h) => h.question);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <>
      {/* very light backdrop */}
      <div
        className="fixed inset-0 bg-black/10 z-[100] animate-fade-in-fast"
        onClick={onClose}
      />

      {/* floating card */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[480px] max-h-[80vh] overflow-y-auto z-[101] bg-white rounded-xl shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <h2 className="font-serif text-lg text-ink lowercase mb-6">questions</h2>

          <div className="flex flex-col gap-6">
            {homesWithQuestions.map((home) => {
              const key = `home_${home.id}`;
              return (
                <div key={home.id}>
                  <p className="text-xs text-mid-gray lowercase mb-1.5 font-medium">
                    {home.name.toLowerCase()}
                  </p>
                  <p className="text-sm text-ink leading-relaxed mb-3 italic">
                    &ldquo;{home.question}&rdquo;
                  </p>
                  <textarea
                    value={homeAnswers[key] || ""}
                    onChange={(e) => onAnswerChange(home.id, e.target.value)}
                    placeholder="type your answer here..."
                    className="w-full border border-border rounded-md p-3 text-sm text-ink bg-white resize-none min-h-[72px] outline-none leading-relaxed transition-colors focus:border-ink"
                  />
                </div>
              );
            })}
          </div>

          {/* submit button */}
          <button
            onClick={onClose}
            className="mt-6 w-full py-2.5 rounded-md text-sm text-white lowercase cursor-pointer transition-colors"
            style={{ background: "var(--color-ink)" }}
          >
            submit
          </button>
        </div>
      </div>
    </>
  );
}
