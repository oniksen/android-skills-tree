"use client";

import { useState, useEffect } from "react";
import { useServices } from "@/composition/services-context";
import { useFirebaseAuth } from "./useFirebaseAuth";
import type { Achievement } from "@/types";

const EMPTY_ACHIEVEMENTS: Achievement[] = [];

export function useAchievements() {
  const { achievements: repository } = useServices();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { uid, loading: authLoading } = useFirebaseAuth();

  useEffect(() => {
    if (authLoading || !uid) return;

    return repository.subscribe(uid, {
      next: (list) => {
        setAchievements(list);
        setLoading(false);
      },
      error: (error) => {
        console.error("Error listening to achievements:", error);
        setLoading(false);
      },
    });
  }, [uid, authLoading, repository]);

  const signedOut = !authLoading && !uid;

  return {
    achievements: signedOut ? EMPTY_ACHIEVEMENTS : achievements,
    loading: signedOut ? false : loading,
  };
}
