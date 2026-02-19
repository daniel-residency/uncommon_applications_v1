"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ANALYSIS_STEPS = [
  { label: "Reading your responses", duration: 1500 },
  { label: "Analyzing work style", duration: 1200 },
  { label: "Evaluating community fit", duration: 1400 },
  { label: "Matching with homes", duration: 1600 },
  { label: "Found your matches", duration: 800 },
];

export default function MatchingPage() {
  const [step, setStep] = useState(0);
  const [matchDone, setMatchDone] = useState(false);
  const [animDone, setAnimDone] = useState(false);
  const router = useRouter();

  // Start AI matching
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
          setMatchDone(true);
        } else {
          router.push("/");
        }
      })
      .catch(() => {
        router.push("/");
      });
  }, [router]);

  // Step animation
  useEffect(() => {
    if (step < ANALYSIS_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setStep((s) => s + 1);
      }, ANALYSIS_STEPS[step].duration);
      return () => clearTimeout(timer);
    } else {
      // Final step
      const timer = setTimeout(() => {
        setAnimDone(true);
      }, ANALYSIS_STEPS[step].duration);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Navigate when both done
  useEffect(() => {
    if (matchDone && animDone) {
      const timer = setTimeout(() => router.push("/results"), 500);
      return () => clearTimeout(timer);
    }
  }, [matchDone, animDone, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-10 animate-fade-in">
        <div className="flex flex-col gap-3 min-w-[280px]">
          {ANALYSIS_STEPS.map((s, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-4 transition-opacity duration-400 ${
                idx <= step ? "opacity-100" : "opacity-30"
              }`}
            >
              <div
                className={`w-5 h-5 min-w-[20px] rounded-full flex items-center justify-center transition-all duration-300 ${
                  idx < step
                    ? "bg-accent"
                    : idx === step
                    ? "border-2 border-ink bg-transparent"
                    : "bg-frost"
                }`}
              >
                {idx < step && (
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l4 4 6-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {idx === step && (
                  <div className="w-2 h-2 rounded-full bg-ink animate-pulse-dot" />
                )}
              </div>
              <span
                className={`text-sm sm:text-base transition-colors duration-300 ${
                  idx <= step ? "text-ink" : "text-mid-gray"
                }`}
              >
                {s.label}
                {idx === step && idx < ANALYSIS_STEPS.length - 1 && (
                  <span className="ml-1">...</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
