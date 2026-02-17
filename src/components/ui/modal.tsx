"use client";

import { useEffect, useCallback } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  accentColor?: string;
}

export default function Modal({ open, onClose, children, title, accentColor }: ModalProps) {
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-dark/50 backdrop-blur-sm z-[100] animate-fade-in-fast"
        onClick={onClose}
      />

      {/* Mobile: full screen, Desktop: centered card */}
      <div className="fixed inset-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[90%] sm:max-w-[560px] sm:max-h-[85vh] overflow-y-auto z-[101]">
        {/* Close bar */}
        <button
          onClick={onClose}
          className="sticky top-0 sm:absolute sm:-top-11 sm:right-0 w-full sm:w-auto bg-cream sm:bg-transparent border-b border-sand sm:border-none text-ink-dark sm:text-white/90 text-sm font-serif cursor-pointer flex items-center justify-between sm:justify-end gap-2 p-4 sm:p-2 z-10"
        >
          {title && <span className="sm:hidden font-normal">{title}</span>}
          <span className="flex items-center gap-2">
            <span className="hidden sm:inline">Close</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        </button>

        {/* Content */}
        <div className="bg-cream sm:rounded-sm p-6 sm:px-12 sm:py-10 shadow-none sm:shadow-2xl relative min-h-[calc(100%-53px)] sm:min-h-0">
          {accentColor && (
            <div
              className="hidden sm:block absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: accentColor }}
            />
          )}
          {children}
        </div>
      </div>
    </>
  );
}
