"use client";

import { useState, useEffect } from "react";
import { useServices } from "@/composition/services-context";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { recalculateAction } from "@/features/progress/actions";
import type { UserProgress } from "@/types";

export function useUserProgress() {
  const { progress: repository } = useServices();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const { uid, loading: authLoading } = useFirebaseAuth();

  useEffect(() => {
    if (authLoading || !uid) return;

    return repository.subscribe(uid, {
      next: (value) => {
        setProgress(value);
        setLoading(false);
      },
      error: (error) => {
        console.error("Error listening to progress:", error);
        setLoading(false);
      },
    });
  }, [uid, authLoading, repository]);

  useEffect(() => {
    if (!uid) return;
    void recalculateAction().catch((error) => {
      console.error("Error recalculating progress:", error);
    });
  }, [uid]);

  const signedOut = !authLoading && !uid;

  return {
    progress: signedOut ? null : progress,
    loading: signedOut ? false : loading,
  };
}
