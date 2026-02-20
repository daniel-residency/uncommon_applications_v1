"use client";

import { useEffect, useCallback } from "react";
import { Home } from "@/lib/types";

interface GoldenLetterOverlayProps {
  home: Home;
  open: boolean;
  onClose: () => void;
  applicantName: string;
  onVideoOpen: () => void;
}

export default function GoldenLetterOverlay({
  home,
  open,
  onClose,
  applicantName,
  onVideoOpen,
}: GoldenLetterOverlayProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const personalizedText = home.description_template.replace(
    /\{\{name\}\}/g,
    applicantName || "there"
  );
  const paragraphs = personalizedText.split("\n\n");

  // Build a display name: add "house" if name doesn't already contain "house" or "residency"
  const nameLower = home.name.toLowerCase();
  const displayName = (nameLower.includes("house") || nameLower.includes("residency"))
    ? nameLower
    : `${nameLower} house`;

  return (
    <>
      {/* light backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-[100] animate-fade-in-fast"
        onClick={onClose}
      />

      {/* golden card */}
      <div
        className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[90%] sm:max-w-[580px] sm:max-h-[80vh] overflow-y-auto z-[101] animate-scale-in"
        style={{
          background: "linear-gradient(160deg, #E8C840 0%, #D4B040 30%, #C5A030 60%, #B89828 100%)",
          borderRadius: 8,
          boxShadow: "0 24px 64px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.1)",
        }}
      >
        <div className="p-6 sm:p-10">
          {/* letter content */}
          <div className="mb-8">
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className="text-sm leading-[1.85] lowercase"
                style={{
                  color: "#2A2A1A",
                  marginBottom: i < paragraphs.length - 1 ? "0.85rem" : 0,
                }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* signature */}
          <div className="mb-8">
            <p className="text-sm italic lowercase" style={{ color: "#3A3A20" }}>
              - {displayName}, {home.location.toLowerCase()}
            </p>
          </div>

          {/* footer row */}
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-sm lowercase cursor-pointer"
              style={{ color: "#4A4A30" }}
            >
              close
            </button>

            {home.video_url && (
              <button
                onClick={onVideoOpen}
                className="text-sm lowercase cursor-pointer underline underline-offset-2"
                style={{ color: "#3A3A20" }}
              >
                listen to our community architect
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
