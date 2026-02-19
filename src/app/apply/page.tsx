"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SECTIONS } from "@/config/sections";
import { useApplication } from "@/hooks/use-application";
import QuestionRenderer from "@/components/application/question-renderer";
import Button from "@/components/ui/button";

export default function ApplyPage() {
  const router = useRouter();
  const [appId, setAppId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [showFreezeWarning, setShowFreezeWarning] = useState(false);
  const [freezing, setFreezing] = useState(false);

  // Email inline state (shown when no application_id yet)
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("application_id");
    if (id) setAppId(id);
  }, []);

  const { application, answers, loading, saving, lastSaved, updateAnswer, saveNow, setAnswers } =
    useApplication(appId);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("please enter a valid email address");
      return;
    }

    setEmailLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "something went wrong");

      localStorage.setItem("application_id", data.id);

      if (data.status === "submitted") {
        router.push("/submit");
        return;
      }
      if (data.status === "frozen") {
        router.push(data.matched_home_ids?.length ? "/results" : "/matching");
        return;
      }

      // In-progress: set app ID and pre-fill answers if returning user
      setAppId(data.id);
      if (data.answers && Object.keys(data.answers).length > 0) {
        setAnswers(data.answers);
      }
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "something went wrong");
    } finally {
      setEmailLoading(false);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading, appId]);

  // Scroll to section from hash
  useEffect(() => {
    if (!appId) return;
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [loading, appId]);

  // Save on visibility change
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) saveNow(activeSection);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [saveNow, activeSection]);

  const handleFreeze = async () => {
    if (!appId) return;
    setFreezing(true);
    try {
      await saveNow(activeSection);
      await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: appId,
          status: "frozen",
          frozen_at: new Date().toISOString(),
        }),
      });
      router.push("/matching");
    } catch {
      setFreezing(false);
    }
  };

  const scrollTo = useCallback((sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  if (appId && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-mid-gray text-sm lowercase">loading your answers...</p>
      </div>
    );
  }

  const formDisabled = !appId;

  return (
    <div className="min-h-screen flex">
      {/* sidebar */}
      <nav className="w-[220px] shrink-0 sticky top-0 h-screen overflow-y-auto px-6 py-8 border-r border-border-light">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <img src="/logo.png" alt="the residency" className="h-5 w-auto" />
          </div>
        </div>

        <ul className="flex flex-col gap-1">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollTo(section.id)}
                className={`w-full text-left px-2 py-1.5 text-xs rounded transition-colors cursor-pointer lowercase ${
                  activeSection === section.id
                    ? "text-ink font-bold"
                    : "text-mid-gray hover:text-ink"
                }`}
              >
                <span className="mr-1.5">{activeSection === section.id ? "•" : "›"}</span>
                {section.title.toLowerCase()}
              </button>
            </li>
          ))}
        </ul>

        {/* save status */}
        {appId && (
          <div className="mt-6 text-xs text-mid-gray lowercase">
            {saving ? "saving..." : lastSaved ? "saved" : ""}
          </div>
        )}
      </nav>

      {/* main content */}
      <main className="flex-1 max-w-[800px] px-12 py-10">
        <div className="mb-10 animate-fade-in">
          <h1 className="font-serif text-3xl font-bold text-ink lowercase mb-1">
            the residency application
          </h1>
          <p className="text-sm text-mid-gray lowercase mb-4">
            june 1st – august 31st
          </p>
          <p className="text-xs text-mid-gray leading-relaxed lowercase">
            note: please don&apos;t include links except where we specifically ask. part of what we&apos;re
            evaluating is how well you can explain your work without leaning on external references.
          </p>
        </div>

        {/* inline email field — first field when no app yet */}
        {!appId && (
          <div className="mb-10 animate-fade-in">
            <form onSubmit={handleEmailSubmit}>
              <label className="block text-sm text-ink font-semibold mb-1.5 lowercase">
                your email address
              </label>
              <p className="text-xs text-mid-gray mb-3 lowercase">
                we&apos;ll use your email to save your progress. you can return anytime.
              </p>
              <div className="flex items-end gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  placeholder="you@example.com"
                  className="flex-1 border-b border-border bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-mid-gray transition-colors focus:border-ink"
                  autoFocus
                  disabled={emailLoading}
                />
                <Button type="submit" loading={emailLoading} size="sm">
                  start
                </Button>
              </div>
              {emailError && (
                <p className="mt-2 text-xs text-red-500 lowercase">{emailError}</p>
              )}
            </form>
            <div className="section-divider" />
          </div>
        )}

        {/* returning user welcome message */}
        {appId && !loading && application?.email && (
          <div className="mb-8 animate-fade-in">
            <p className="text-xs text-mid-gray lowercase">
              picked up where you left off for{" "}
              <span className="text-ink font-semibold">{application.email}</span>
            </p>
            <div className="section-divider" />
          </div>
        )}

        {/* all sections */}
        <div className={formDisabled ? "opacity-50 pointer-events-none select-none" : ""}>
          {SECTIONS.map((section, sectionIdx) => (
            <div key={section.id}>
              {sectionIdx > 0 && <div className="section-divider" />}

              <section id={section.id} className="scroll-mt-12">
                <h2 className="font-serif text-2xl font-bold text-ink lowercase mb-6">
                  {section.title.toLowerCase()}
                </h2>

                <div className="flex flex-col gap-6">
                  {section.questions.map((question) => (
                    <QuestionRenderer
                      key={question.id}
                      question={question}
                      value={answers[question.id] || ""}
                      onChange={(value) => updateAnswer(question.id, value, section.id)}
                      allAnswers={answers}
                    />
                  ))}
                </div>
              </section>
            </div>
          ))}
        </div>

        {/* submit area */}
        {appId && (
          <div className="mt-12 mb-16">
            {!showFreezeWarning ? (
              <div className="flex justify-center">
                <Button size="lg" onClick={() => setShowFreezeWarning(true)}>
                  next
                </Button>
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-border bg-white/40">
                <p className="text-sm text-ink mb-2 font-semibold lowercase">
                  ready to see your matches?
                </p>
                <p className="text-xs text-mid-gray mb-5 lowercase leading-relaxed">
                  your application answers will be locked and our AI will match you with the
                  best homes for your project. after matching, you&apos;ll answer a few questions
                  from each home before submitting.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowFreezeWarning(false)}
                  >
                    keep editing
                  </Button>
                  <Button size="sm" onClick={handleFreeze} loading={freezing}>
                    see my matches
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
