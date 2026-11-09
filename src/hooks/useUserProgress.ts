"use client";

import { useEffect, useMemo } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useServices } from "@/composition/services-context";
import { useFirebaseAuth } from "./useFirebaseAuth";
import {
  backfillTotalScore,
  checkAchievementsOnce,
  readAssessmentMap,
} from "@/lib/firestore-actions";
import { userProgressPath } from "@/adapters/firestore-client/paths";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { isQuotaExceeded } from "@/shared/lib/quota";
import { createLiveStore } from "@/shared/lib/live-store";
import { useLiveStore } from "@/shared/lib/use-live-store";
import { registerSessionReset } from "@/shared/lib/session-reset";
import { oncePerSession } from "@/shared/lib/once-per-session";
import type { Observer } from "@/ports/observation";
import type { UserProgress } from "@/types";

const DEFAULT_PROGRESS: UserProgress = {
  currentLevelId: "junior",
  unlockedLevelIds: ["junior"],
  totalScore: 0,
};

// One subscription per user for the whole session: keeping it alive between
// pages lets the next page paint real data instead of a skeleton.
const progressStore = createLiveStore<UserProgress | null>();
registerSessionReset(() => progressStore.disposeAll());

export function useUserProgress() {
  const { progress: repository } = useServices();
  const { uid, loading: authLoading } = useFirebaseAuth();
  const toast = useToast();
  const showToast = toast.show;

  const start = useMemo(
    () =>
      uid
        ? (observer: Observer<UserProgress | null>) =>
            repository.subscribe(uid, observer)
        : null,
    [uid, repository],
  );

  const snapshot = useLiveStore(progressStore, uid, start);
  const signedOut = !authLoading && !uid;
  const loading = signedOut ? false : authLoading || snapshot.loading;

  useEffect(() => {
    const error = snapshot.error;
    if (!error) return;
    console.error("Error listening to progress:", error);
    if (isPermissionDenied(error)) {
      showToast("Для отслеживания прогресса обратитесь к администратору.");
    }
    if (isQuotaExceeded(error)) {
      showToast("Квота Firestore исчерпана. Повторите позже.");
    }
  }, [snapshot.error, showToast]);

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

    // One repair pass per user per session instead of one per page mount.
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
    const progressRef = doc(db, ...userProgressPath(uid));
    try {
      await setDoc(progressRef, { ...DEFAULT_PROGRESS, ...data }, { merge: true });
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
    progress: signedOut ? null : (snapshot.data ?? null),
    loading,
    updateProgress,
  };
}
