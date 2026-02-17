"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Application } from "@/lib/types";

const STORAGE_KEY = "residency_application";
const SAVE_DEBOUNCE_LOCAL = 300;
const SAVE_DEBOUNCE_REMOTE = 2000;

interface StoredData {
  answers: Record<string, string>;
  currentSection: string;
  timestamp: number;
}

export function useApplication(applicationId: string | null) {
  const [application, setApplication] = useState<Application | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const localTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const remoteTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  // Load application from server
  const loadApplication = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/applications?id=${id}`);
      if (!res.ok) throw new Error("Failed to load");
      const data: Application = await res.json();
      setApplication(data);

      // Compare with localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const local: StoredData = JSON.parse(stored);
        const serverTime = new Date(data.updated_at).getTime();
        if (local.timestamp > serverTime) {
          // Local is newer
          setAnswers(local.answers);
          return data;
        }
      }
      setAnswers(data.answers || {});
      return data;
    } catch {
      // Try localStorage fallback
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const local: StoredData = JSON.parse(stored);
        setAnswers(local.answers);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (applicationId) {
      loadApplication(applicationId);
    } else {
      setLoading(false);
    }
  }, [applicationId, loadApplication]);

  // Save to localStorage (fast)
  const saveToLocal = useCallback(
    (newAnswers: Record<string, string>, section?: string) => {
      const data: StoredData = {
        answers: newAnswers,
        currentSection: section || "",
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },
    []
  );

  // Save to Supabase (slower, debounced)
  const saveToServer = useCallback(
    async (newAnswers: Record<string, string>, section?: string) => {
      if (!applicationId) return;
      setSaving(true);
      try {
        await fetch("/api/applications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: applicationId,
            answers: newAnswers,
            current_section: section,
          }),
        });
        setLastSaved(new Date());
      } catch {
        // Silent fail — localStorage has the data
      } finally {
        setSaving(false);
      }
    },
    [applicationId]
  );

  // Update a single answer
  const updateAnswer = useCallback(
    (questionId: string, value: string, section?: string) => {
      setAnswers((prev) => {
        const next = { ...prev, [questionId]: value };

        // Debounced local save
        if (localTimerRef.current) clearTimeout(localTimerRef.current);
        localTimerRef.current = setTimeout(() => saveToLocal(next, section), SAVE_DEBOUNCE_LOCAL);

        // Debounced remote save
        if (remoteTimerRef.current) clearTimeout(remoteTimerRef.current);
        remoteTimerRef.current = setTimeout(() => saveToServer(next, section), SAVE_DEBOUNCE_REMOTE);

        return next;
      });
    },
    [saveToLocal, saveToServer]
  );

  // Force save now (on navigation, blur)
  const saveNow = useCallback(
    async (section?: string) => {
      if (localTimerRef.current) clearTimeout(localTimerRef.current);
      if (remoteTimerRef.current) clearTimeout(remoteTimerRef.current);
      saveToLocal(answersRef.current, section);
      await saveToServer(answersRef.current, section);
    },
    [saveToLocal, saveToServer]
  );

  return {
    application,
    answers,
    setAnswers,
    loading,
    saving,
    lastSaved,
    updateAnswer,
    saveNow,
    loadApplication,
  };
}
