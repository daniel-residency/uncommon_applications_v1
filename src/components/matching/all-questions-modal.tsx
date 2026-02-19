"use client";

import { Home } from "@/lib/types";
import Modal from "@/components/ui/modal";

interface AllQuestionsModalProps {
  open: boolean;
  onClose: () => void;
  homes: Home[];
  homeAnswers: Record<string, string>;
  onAnswerChange: (homeId: string, value: string) => void;
}

export default function AllQuestionsModal({
  open,
  onClose,
  homes,
  homeAnswers,
  onAnswerChange,
}: AllQuestionsModalProps) {
  const homesWithQuestions = homes.filter((h) => h.question);

  return (
    <Modal open={open} onClose={onClose} title="answer all questions">
      <div className="flex flex-col gap-8">
        {homesWithQuestions.map((home) => {
          const key = `home_${home.id}`;
          const answered = !!homeAnswers[key]?.trim();

          return (
            <div key={home.id}>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: answered ? home.color : "#E0E0EA" }}
                />
                <h3 className="text-sm font-semibold text-ink lowercase">
                  {home.name.toLowerCase()}
                </h3>
              </div>
              <p className="text-sm text-ink leading-relaxed mb-3 italic">
                &ldquo;{home.question}&rdquo;
              </p>
              <textarea
                value={homeAnswers[key] || ""}
                onChange={(e) => onAnswerChange(home.id, e.target.value)}
                placeholder="your answer..."
                className="w-full border border-border rounded-md p-3.5 text-sm text-ink bg-white/40 resize-none min-h-[80px] outline-none leading-relaxed transition-colors focus:border-ink"
              />
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
