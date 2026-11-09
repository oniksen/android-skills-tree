"use client";

import { useEffect } from "react";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { useUserState } from "./useUserState";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { isQuotaExceeded } from "@/shared/lib/quota";
import { checkAchievementsOnce } from "@/lib/firestore-actions";
import type { Achievement } from "@/types";

const EMPTY_ACHIEVEMENTS: Achievement[] = [];

export function useAchievements() {
  const { uid, loading: authLoading } = useFirebaseAuth();
  const { state, loading: stateLoading } = useUserState();
  const toast = useToast();
  const showToast = toast.show;

  useEffect(() => {
    if (!uid) return;
    void checkAchievementsOnce(uid).catch((error) => {
      console.error("Error syncing achievements:", error);
      if (isPermissionDenied(error)) {
        showToast("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        showToast("Квота Firestore исчерпана. Повторите позже.");
      }
    });
  }, [uid, showToast]);

  const signedOut = !authLoading && !uid;

  const achievements = signedOut
    ? EMPTY_ACHIEVEMENTS
    : Object.values(state?.achievements ?? {}).sort(
        (a, b) => b.achievedAt.getTime() - a.achievedAt.getTime(),
      );

  return {
    achievements,
    loading: signedOut ? false : stateLoading,
  };
}