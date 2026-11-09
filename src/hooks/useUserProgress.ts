"use client";

import { useEffect } from "react";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { useUserState } from "./useUserState";
import {
  backfillTotalScore,
  checkAchievementsOnce,
  readAssessmentMap,
} from "@/lib/firestore-actions";
import { userProgressPath, userStatePath } from "@/adapters/firestore-client/paths";
import { ensureUserState } from "@/adapters/firestore-client/state";
import { patchCachedUserState } from "@/shared/lib/user-state-store";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { isQuotaExceeded } from "@/shared/lib/quota";
import { oncePerSession } from "@/shared/lib/once-per-session";
import type { UserProgress } from "@/types";

export function useUserProgress() {
  const { uid, loading: authLoading } = useFirebaseAuth();
  const { state, loading: stateLoading } = useUserState();
  const toast = useToast();
  const showToast = toast.show;

  const signedOut = !authLoading && !uid;
  const progress = signedOut ? null : (state?.progress ?? null);
  const loading = signedOut ? false : stateLoading;

  useEffect(() => {
    if (!uid) return;

    const reportError = (message: string) => (error: unknown) => {
      console.error(message, error);
      if (isPermissionDenied(error)) {
        showToast("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        showToast("Квота Firestore исчерпана. Повторите позже.");
      }
    };

    if (!oncePerSession(`backfill-total-score:${uid}`)) {
      void checkAchievementsOnce(uid).catch(reportError("Error checking achievements:"));
      return;
    }

    const assessments = readAssessmentMap(uid);
    void backfillTotalScore(uid, assessments).catch(
      reportError("Error recalculating total score:"),
    );
    void checkAchievementsOnce(uid, assessments).catch(
      reportError("Error checking achievements:"),
    );
  }, [uid, showToast]);

  const updateProgress = async (data: Partial<UserProgress>) => {
    if (!uid) return;
    await ensureUserState(uid);
    const progressRef = doc(db, ...userProgressPath(uid));
    const stateRef = doc(db, ...userStatePath(uid));
    try {
      const batch = writeBatch(db);
      batch.set(progressRef, data, { merge: true });
      batch.set(stateRef, { progress: data }, { merge: true });
      await batch.commit();
      patchCachedUserState(uid, {
        progress: { ...(state?.progress ?? {}), ...data } as UserProgress,
      });
    } catch (error) {
      console.error("Error updating progress:", error);
      if (isPermissionDenied(error)) {
        showToast("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        showToast("Квота Firestore исчерпана. Повторите позже.");
      }
      throw error;
    }
  };

  return {
    progress,
    loading,
    updateProgress,
  };
}
