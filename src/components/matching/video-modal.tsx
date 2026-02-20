"use client";

import { useEffect, useCallback } from "react";

interface VideoModalProps {
  videoUrl: string;
  open: boolean;
  onClose: () => void;
}

export default function VideoModal({ videoUrl, open, onClose }: VideoModalProps) {
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

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[110] animate-fade-in-fast"
        onClick={onClose}
      />

      {/* video container */}
      <div className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[90%] sm:max-w-[720px] sm:max-h-[85vh] z-[111] animate-scale-in flex flex-col items-center justify-center">
        <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl w-full" style={{ aspectRatio: "16/9" }}>
          {/* close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full cursor-pointer shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* video player */}
          <video
            src={videoUrl}
            className="w-full h-full object-cover"
            controls
            autoPlay
          />
        </div>
      </div>
    </>
  );
}
