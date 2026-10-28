"use client";

import { useState, useEffect } from "react";
import { useServices } from "@/composition/services-context";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import type { Achievement } from "@/types";

const EMPTY_ACHIEVEMENTS: Achievement[] = [];

export function useAchievements() {
  const { achievements: repository } = useServices();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { uid, loading: authLoading } = useFirebaseAuth();
  const toast = useToast();

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
        if (isPermissionDenied(error)) {
          toast.show("Для отслеживания прогресса обратитесь к администратору.");
        }
      },
    });
  }, [uid, authLoading, repository, toast]);

  const signedOut = !authLoading && !uid;

  return {
    achievements: signedOut ? EMPTY_ACHIEVEMENTS : achievements,
    loading: signedOut ? false : loading,
  };
}
