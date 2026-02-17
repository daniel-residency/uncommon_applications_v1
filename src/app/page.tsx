"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";

export default function Home() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      // Store application id
      localStorage.setItem("application_id", data.id);

      // Route based on status
      if (data.status === "submitted") {
        router.push("/submit");
      } else if (data.status === "frozen") {
        if (data.matched_home_ids?.length) {
          router.push("/results");
        } else {
          router.push("/matching");
        }
      } else {
        const section = data.current_section || "about-you";
        router.push(`/apply/${section}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-[600px] animate-fade-in">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-normal text-ink-dark mb-3">
            The Residency
          </h1>
          <p className="text-sm sm:text-base text-earth">
            Start or continue your application
          </p>
        </div>

        <div className="bg-cream rounded-sm p-8 sm:p-12 shadow-sm">
          <form onSubmit={handleSubmit}>
            <label className="block text-base text-ink-dark mb-2">
              Your email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="you@example.com"
              className="w-full border-b border-sand bg-transparent py-3 text-lg font-serif text-ink-dark outline-none placeholder:text-stone transition-colors focus:border-ink-dark"
              autoFocus
              disabled={loading}
            />
            {error && (
              <p className="mt-2 text-xs text-red-500">{error}</p>
            )}

            <div className="flex justify-end mt-8">
              <Button type="submit" loading={loading} size="lg">
                Continue
              </Button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-stone-dark mt-6">
          We&apos;ll use your email to save your progress. You can return anytime.
        </p>
      </div>
    </div>
  );
}
