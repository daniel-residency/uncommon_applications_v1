"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const appId = localStorage.getItem("application_id");
    if (!appId) {
      router.push("/");
      return;
    }

    // Check if frozen/submitted — redirect away
    fetch(`/api/applications?id=${appId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "submitted") {
          router.push("/submit");
        } else if (data.status === "frozen") {
          if (data.matched_home_ids?.length) {
            router.push("/results");
          } else {
            router.push("/matching");
          }
        } else {
          setChecked(true);
        }
      })
      .catch(() => {
        router.push("/");
      });
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-dark text-sm">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
