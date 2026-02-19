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
      {/* video area — only shown if home has a video */}
      {home.video_url && (
        <div className="w-full max-w-[280px] sm:max-w-[200px] mx-auto aspect-[9/16] rounded-lg mb-7 overflow-hidden">
          <video
            src={home.video_url}
            className="w-full h-full object-cover"
            controls
          />
        </div>
      )}

      {/* letter content */}
      <div className="mb-6">
        {paragraphs.map((para, i) => (
          <p
            key={i}
            className="text-sm leading-[1.8] text-ink"
            style={{ marginBottom: i < paragraphs.length - 1 ? "0.75rem" : 0 }}
          >
            {para}
          </p>
        ))}
      </div>

      {/* signature */}
      <p className="text-sm italic mb-1" style={{ color: home.color }}>
        — {home.name.toLowerCase()}
      </p>
      <p className="text-xs text-mid-gray">{home.location}</p>

      {/* question section */}
      <div className="border-t border-border pt-6 mt-6">
        {home.question ? (
          <>
            <p className="text-[10px] text-mid-gray mb-2 tracking-wider uppercase">
              p.s. — a question for you
            </p>
            <p className="text-sm text-ink leading-relaxed mb-4 italic">
              &ldquo;{home.question}&rdquo;
            </p>
            <textarea
              value={homeAnswer || ""}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="your answer..."
              className="w-full border border-border rounded-md p-3.5 text-sm text-ink bg-white/40 resize-none min-h-[80px] outline-none leading-relaxed transition-colors focus:border-ink"
            />
            {homeAnswer?.trim() && (
              <p className="text-xs text-accent mt-2 flex items-center gap-1 lowercase">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8l4 4 6-8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                saved
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-mid-gray italic lowercase">
            no additional questions from this home
          </p>
        )}
      </div>
    </Modal>
  );
}
