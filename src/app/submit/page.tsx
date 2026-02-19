"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SubmitPage() {
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const appId = localStorage.getItem("application_id");
    if (!appId) {
      router.push("/");
      return;
    }

    fetch(`/api/applications?id=${appId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "submitted") {
          setVerified(true);
        } else if (data.status === "frozen") {
          router.push("/results");
        } else {
          router.push("/apply");
        }
      })
      .catch(() => router.push("/"));
  }, [router]);

  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-mid-gray text-sm lowercase">loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-[500px] text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8l4 4 6-8"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-normal text-ink mb-3">
          Application submitted
        </h1>
        <p className="text-base text-mid-gray mb-8 leading-relaxed">
          Thank you for applying to The Residency. We&apos;ll review your
          application and get back to you soon.
        </p>

        <div className="bg-frost rounded-sm p-6 shadow-sm">
          <p className="text-sm text-mid-gray">
            Keep an eye on your email for updates. In the meantime, feel free to
            explore our community.
          </p>
        </div>
      </div>
    </div>
  );
}
