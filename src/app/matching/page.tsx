"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ArchBackground from "@/components/matching/arch-background";

/*
 * Figma loading page (1440×900):
 *   Content container: x=539 y=192  362×518
 *   Scroll badge:      x=620 y=192  200×200  (centered in container)
 *   Steps frame:       x=539 y=401  362×309
 *   Each step row:     height 49px + 16px gap
 *     Ellipse: 12×12, active = gold gradient fill, inactive = #959595 stroke
 *     Text: Manrope 24px w500 ls=-1.2, active = #000, inactive = #838383
 */

type StepDef = {
  label: (counts: { homeCount: number; matchCount: number }) => string;
  duration: number;
};

const ANALYSIS_STEPS: StepDef[] = [
  { label: () => "reading your responses", duration: 1500 },
  { label: () => "analyzing ability", duration: 1200 },
  { label: () => "evaluating community fit", duration: 1400 },
  { label: ({ homeCount }) => `matching with ${homeCount} homes`, duration: 1600 },
  { label: ({ matchCount }) => `found ${matchCount} strong matches`, duration: 800 },
];

export default function MatchingPage() {
  const [step, setStep] = useState(0);
  const [matchDone, setMatchDone] = useState(false);
  const [animDone, setAnimDone] = useState(false);
  const [homeCount, setHomeCount] = useState(12);
  const [matchCount, setMatchCount] = useState(3);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/homes")
      .then((res) => res.json())
      .then((homes) => {
        if (Array.isArray(homes)) setHomeCount(homes.length);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const appId = localStorage.getItem("application_id");
    if (!appId) {
      router.push("/");
      return;
    }

    fetch("/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: appId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.matched_home_ids) {
          setMatchCount(data.matched_home_ids.length);
          setMatchDone(true);
        } else {
          router.push("/");
        }
      })
      .catch(() => {
        router.push("/");
      });
  }, [router]);

  useEffect(() => {
    if (step < ANALYSIS_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setStep((s) => s + 1);
      }, ANALYSIS_STEPS[step].duration);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setAnimDone(true);
      }, ANALYSIS_STEPS[step].duration);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    if (matchDone && animDone) {
      const timer = setTimeout(() => router.push("/results"), 500);
      return () => clearTimeout(timer);
    }
  }, [matchDone, animDone, router]);

  return (
    <ArchBackground>
      <div className="h-full flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6 animate-fade-in" style={{ width: 362 }}>
          {/* scroll badge — Figma: 200×200, centered */}
          <img
            src="/scroll.png"
            alt="scroll"
            width={200}
            height={200}
            className="object-contain"
          />

          {/* step list — Figma: 362 wide, 65px row spacing */}
          <div className="flex flex-col w-full" style={{ gap: 16 }}>
            {ANALYSIS_STEPS.map((s, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-4 transition-opacity duration-400 ${
                  idx <= step ? "opacity-100" : "opacity-30"
                }`}
                style={{ height: 49 }}
              >
                {/* dot indicator — Figma: 12×12 */}
                <div
                  className="min-w-[12px] min-h-[12px] rounded-full"
                  style={{
                    width: 12,
                    height: 12,
                    ...(idx < step
                      ? {
                          background:
                            "linear-gradient(180deg, #AE8625 0%, #F7EF8A 40%, #D2AC47 75%, #EDC967 100%)",
                        }
                      : idx === step
                      ? {
                          background:
                            "linear-gradient(180deg, #AE8625 0%, #F7EF8A 40%, #D2AC47 75%, #EDC967 100%)",
                        }
                      : {
                          background: "transparent",
                          border: "0.75px solid #959595",
                        }),
                  }}
                />
                <span
                  className="lowercase"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 24,
                    fontWeight: 500,
                    letterSpacing: "-1.2px",
                    lineHeight: "31.2px",
                    color: idx <= step ? "#000" : "#838383",
                  }}
                >
                  {s.label({ homeCount, matchCount })}
                  {idx === step && idx < ANALYSIS_STEPS.length - 1 && (
                    <span className="ml-0.5">...</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ArchBackground>
  );
}
