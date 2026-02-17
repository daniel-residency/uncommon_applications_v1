"use client";

import { SECTIONS } from "@/config/sections";

interface ProgressBarProps {
  currentSection: string;
  saving?: boolean;
  lastSaved?: Date | null;
}

export default function ProgressBar({ currentSection, saving, lastSaved }: ProgressBarProps) {
  const currentIndex = SECTIONS.findIndex((s) => s.id === currentSection);
  const progress = ((currentIndex + 1) / SECTIONS.length) * 100;

  return (
    <div className="w-full max-w-[600px] mx-auto mb-6 sm:mb-10">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-4">
        {SECTIONS.map((section, idx) => (
          <div
            key={section.id}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              idx <= currentIndex ? "bg-ink-dark" : "bg-sand-dark"
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full h-[2px] bg-sand rounded-full overflow-hidden">
        <div
          className="h-full bg-ink-dark transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Save indicator */}
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-stone-dark">
          {currentIndex + 1} of {SECTIONS.length}
        </span>
        <span
          className={`text-xs text-stone-dark transition-opacity duration-300 ${
            saving ? "opacity-100" : lastSaved ? "opacity-100" : "opacity-0"
          }`}
        >
          {saving ? "saving..." : lastSaved ? "saved" : ""}
        </span>
      </div>
    </div>
  );
}
