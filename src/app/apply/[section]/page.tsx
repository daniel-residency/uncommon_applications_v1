"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SectionRedirect() {
  const params = useParams();
  const router = useRouter();
  const sectionId = params.section as string;

  useEffect(() => {
    router.replace(`/apply#${sectionId}`);
  }, [sectionId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-mid-gray text-sm lowercase">loading...</p>
    </div>
  );
}
