"use client";

import { Home } from "@/lib/types";
import Modal from "@/components/ui/modal";

interface LetterModalProps {
  home: Home;
  open: boolean;
  onClose: () => void;
  applicantName: string;
  homeAnswer: string;
  onAnswerChange: (value: string) => void;
}

export default function LetterModal({
  home,
  open,
  onClose,
  applicantName,
  homeAnswer,
  onAnswerChange,
}: LetterModalProps) {
  const personalizedText = home.description_template.replace(
    /\{\{name\}\}/g,
    applicantName || "there"
  );
  const paragraphs = personalizedText.split("\n\n");

  return (
    <Modal open={open} onClose={onClose} title={home.name} accentColor={home.color}>
      {/* Video area */}
      {home.video_url ? (
        <div className="w-full max-w-[280px] sm:max-w-[200px] mx-auto aspect-[9/16] rounded-lg mb-7 overflow-hidden">
          <video
            src={home.video_url}
            className="w-full h-full object-cover"
            controls
          />
        </div>
      ) : (
        <div
          className="w-full max-w-[280px] sm:max-w-[200px] mx-auto aspect-[9/16] rounded-lg mb-7 flex items-center justify-center relative"
          style={{
            background: `linear-gradient(135deg, ${home.color}10 0%, ${home.color}18 100%)`,
            border: `1px solid ${home.color}12`,
          }}
        >
          <div className="w-[52px] h-[52px] rounded-full bg-white/95 flex items-center justify-center shadow-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill={home.color}>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span
            className="absolute bottom-3 right-3 text-[0.7rem] bg-white/90 px-2 py-0.5 rounded-sm"
            style={{ color: home.color }}
          >
            Coming soon
          </span>
        </div>
      )}

      {/* Letter content */}
      <div className="mb-6">
        {paragraphs.map((para, i) => (
          <p
            key={i}
            className="text-base sm:text-[1.0625rem] leading-[1.85] text-ink"
            style={{ marginBottom: i < paragraphs.length - 1 ? "1rem" : 0 }}
          >
            {para}
          </p>
        ))}
      </div>

      {/* Signature */}
      <p className="text-base italic mb-1" style={{ color: home.color }}>
        — {home.name}
      </p>
      <p className="text-[0.85rem] text-earth">{home.location}</p>

      {/* Question section */}
      <div className="border-t border-sand pt-6 mt-6">
        {home.question ? (
          <>
            <p className="text-[0.75rem] text-stone-dark mb-2 tracking-wider uppercase">
              P.S. — A question for you
            </p>
            <p className="text-base sm:text-[1.0625rem] text-ink-dark leading-relaxed mb-4 italic">
              &ldquo;{home.question}&rdquo;
            </p>
            <textarea
              value={homeAnswer || ""}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Your answer..."
              className="w-full border border-sand rounded-sm p-4 text-base font-serif text-ink-dark bg-cream-dark/20 resize-none min-h-[90px] outline-none leading-relaxed transition-colors"
              style={{
                borderColor: undefined,
              }}
              onFocus={(e) => (e.target.style.borderColor = home.color)}
              onBlur={(e) => (e.target.style.borderColor = "")}
            />
            {homeAnswer?.trim() && (
              <p className="text-[0.75rem] text-green mt-2 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8l4 4 6-8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Saved
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-stone-dark italic">
            No additional questions from this home
          </p>
        )}
      </div>
    </Modal>
  );
}
