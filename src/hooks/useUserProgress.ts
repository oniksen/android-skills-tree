"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useServices } from "@/composition/services-context";
import { useFirebaseAuth } from "./useFirebaseAuth";
import {
  backfillTotalScore,
  checkAchievements,
  readAssessmentMap,
} from "@/lib/firestore-actions";
import { userProgressPath } from "@/adapters/firestore-client/paths";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { isQuotaExceeded } from "@/shared/lib/quota";
import type { UserProgress } from "@/types";

const DEFAULT_PROGRESS: UserProgress = {
  currentLevelId: "junior",
  unlockedLevelIds: ["junior"],
  totalScore: 0,
};

// Shared listener cache: one Firestore listener per uid across all hook instances.
const progressCache = new Map<
  string,
  {
    value: UserProgress | null;
    loading: boolean;
    listeners: Set<(v: UserProgress | null) => void>;
    errorListeners: Set<(e: unknown) => void>;
    unsub: (() => void) | null;
  }
>();

export function useUserProgress() {
  const { progress: repository } = useServices();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const { uid, loading: authLoading } = useFirebaseAuth();
  const toast = useToast();

  useEffect(() => {
    if (authLoading || !uid) return;

    let entry = progressCache.get(uid);
    if (!entry) {
      entry = { value: null, loading: true, listeners: new Set(), errorListeners: new Set(), unsub: null };
      progressCache.set(uid, entry);
      entry.unsub = repository.subscribe(uid, {
        next: (value) => {
          entry!.value = value;
          entry!.loading = false;
          entry!.listeners.forEach((l) => l(value));
        },
        error: (error) => {
          entry!.loading = false;
          entry!.errorListeners.forEach((l) => l(error));
        },
      });
    }

    const listener = (value: UserProgress | null) => {
      setProgress(value);
      setLoading(false);
    };
    const errorListener = (error: unknown) => {
      console.error("Error listening to progress:", error);
      setLoading(false);
      if (isPermissionDenied(error)) {
        toast.show("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        toast.show("Квота Firestore исчерпана. Повторите позже.");
      }
    };

    entry.listeners.add(listener);
    entry.errorListeners.add(errorListener);

    if (!entry.loading) {
      setTimeout(() => {
        setProgress(entry.value);
        setLoading(false);
      }, 0);
    }

    return () => {
      entry!.listeners.delete(listener);
      entry!.errorListeners.delete(errorListener);
      if (entry!.listeners.size === 0) {
        entry!.unsub?.();
        progressCache.delete(uid);
      }
    };
  }, [uid, authLoading, repository, toast]);

  useEffect(() => {
    if (!uid) return;
    const assessments = readAssessmentMap(uid);
    void backfillTotalScore(uid, assessments).catch((error) => {
      console.error("Error recalculating total score:", error);
      if (isPermissionDenied(error)) {
        toast.show("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        toast.show("Квота Firestore исчерпана. Повторите позже.");
      }
    });
    void checkAchievements(uid, assessments).catch((error) => {
      console.error("Error checking achievements:", error);
      if (isPermissionDenied(error)) {
        toast.show("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        toast.show("Квота Firestore исчерпана. Повторите позже.");
      }
    });
  }, [uid, toast]);

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
        toast.show("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        toast.show("Квота Firestore исчерпана. Повторите позже.");
      }
      throw error;
    }
  };

  const signedOut = !authLoading && !uid;

  return {
    progress: signedOut ? null : progress,
    loading: signedOut ? false : loading,
    updateProgress,
  };
}
