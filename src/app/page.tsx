"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const appId = localStorage.getItem("application_id");
    if (!appId) {
      router.replace("/apply");
      return;
    }

    fetch(`/api/applications?id=${appId}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        if (data.status === "submitted") {
          router.replace("/submit");
        } else if (data.status === "frozen") {
          router.replace(data.matched_home_ids?.length ? "/results" : "/matching");
        } else {
          router.replace("/apply");
        }
      })
      .catch(() => {
        localStorage.removeItem("application_id");
        router.replace("/apply");
      });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-mid-gray text-sm lowercase">loading...</p>
    </div>
  );
}
