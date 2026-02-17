"use client";

import { Home } from "@/lib/types";

interface EnvelopeCardProps {
  home: Home;
  arrived: boolean;
  hasQuestion: boolean;
  questionAnswered: boolean;
  onClick: () => void;
}

export default function EnvelopeCard({
  home,
  arrived,
  hasQuestion,
  questionAnswered,
  onClick,
}: EnvelopeCardProps) {
  const initials =
    home.name === "The Inventors Residency"
      ? "IR"
      : home.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2);

  return (
    <div
      onClick={onClick}
      className="cursor-pointer"
      style={{
        transform: arrived ? "translateY(0)" : "translateY(-40px)",
        opacity: arrived ? 1 : 0,
        transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <div className="w-[160px] sm:w-[220px] h-[116px] sm:h-[160px] relative transition-transform duration-200 hover:-translate-y-1.5">
        {/* Envelope body */}
        <div className="absolute inset-0 bg-cream rounded shadow-md overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[60%] bg-gradient-to-b from-cream-dark to-cream" />

          {/* Flap */}
          <svg
            viewBox="0 0 220 80"
            preserveAspectRatio="none"
            className="absolute top-0 left-0 w-full h-[58px] sm:h-[80px]"
          >
            <defs>
              <linearGradient id={`flap-${home.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFEF9" />
                <stop offset="100%" stopColor="#F0EDE6" />
              </linearGradient>
            </defs>
            <polygon
              points="0,0 220,0 110,70"
              fill={`url(#flap-${home.id})`}
              stroke="#E5E0D8"
              strokeWidth="1"
            />
          </svg>

          {/* Logo circle */}
          <div
            className="absolute top-[36px] sm:top-[50px] left-1/2 -translate-x-1/2 w-9 sm:w-11 h-9 sm:h-11 rounded-full flex items-center justify-center z-10"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${home.color}dd, ${home.color})`,
              boxShadow: `0 3px 10px ${home.color}40, inset 0 -2px 6px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.2)`,
            }}
          >
            <span className="text-white text-[0.7rem] sm:text-[0.8rem] font-semibold tracking-wide"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
            >
              {initials}
            </span>
          </div>

          {/* Question indicator */}
          {hasQuestion && (
            <div
              className={`absolute top-2 sm:top-3 right-2 sm:right-3 w-[18px] sm:w-[22px] h-[18px] sm:h-[22px] rounded-full flex items-center justify-center z-[15] transition-colors ${
                questionAnswered ? "bg-green" : "bg-sand"
              }`}
            >
              {questionAnswered ? (
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l4 4 6-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className="text-[0.65rem] sm:text-[0.75rem] text-bark font-semibold">?</span>
              )}
            </div>
          )}

          {/* Lines */}
          <div className="absolute bottom-[14px] sm:bottom-5 left-5 sm:left-[30px] right-5 sm:right-[30px] flex flex-col gap-1">
            <div className="h-[2px] bg-sand rounded-full" />
            <div className="h-[2px] bg-sand rounded-full w-[70%]" />
          </div>
        </div>
      </div>

      <p className="text-[0.85rem] sm:text-[0.95rem] text-ink-dark font-normal mt-3 sm:mt-4 text-center">
        {home.name}
      </p>
      <p className="text-[0.7rem] sm:text-[0.8rem] text-earth mt-1 text-center">
        {home.location}
      </p>
    </div>
  );
}
