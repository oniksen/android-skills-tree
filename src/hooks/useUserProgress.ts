"use client";

import { useEffect, useMemo } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
    const assessments = readAssessmentMap(uid);
    void backfillTotalScore(uid, assessments).catch((error) => {
      console.error("Error recalculating total score:", error);
      if (isPermissionDenied(error)) {
        showToast("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        showToast("Квота Firestore исчерпана. Повторите позже.");
      }
    });
    void checkAchievementsOnce(uid, assessments).catch((error) => {
      console.error("Error checking achievements:", error);
      if (isPermissionDenied(error)) {
        showToast("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        showToast("Квота Firestore исчерпана. Повторите позже.");
      }
    });
  }, [uid, showToast]);

  const updateProgress = async (data: Partial<UserProgress>) => {
    if (!uid) return;
    const progressRef = doc(db, ...userProgressPath(uid));
    try {
      const snap = await getDoc(progressRef);
      if (snap.exists()) {
        const { updateDoc } = await import("firebase/firestore");
        await updateDoc(progressRef, data);
      } else {
        await setDoc(progressRef, { ...DEFAULT_PROGRESS, ...data });
      }
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
