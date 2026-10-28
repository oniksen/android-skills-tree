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
import type { UserProgress } from "@/types";

const DEFAULT_PROGRESS: UserProgress = {
  currentLevelId: "junior",
  unlockedLevelIds: ["junior"],
  totalScore: 0,
};

export function useUserProgress() {
  const { progress: repository } = useServices();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const { uid, loading: authLoading } = useFirebaseAuth();
  const toast = useToast();

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
        if (isPermissionDenied(error)) {
          toast.show("Для отслеживания прогресса обратитесь к администратору.");
        }
      },
    });
  }, [uid, authLoading, repository, toast]);

  useEffect(() => {
    if (!uid) return;
    const assessments = readAssessmentMap(uid);
    void backfillTotalScore(uid, assessments).catch((error) => {
      console.error("Error recalculating total score:", error);
      if (isPermissionDenied(error)) {
        toast.show("Для отслеживания прогресса обратитесь к администратору.");
      }
    });
    void checkAchievements(uid, assessments).catch((error) => {
      console.error("Error checking achievements:", error);
      if (isPermissionDenied(error)) {
        toast.show("Для отслеживания прогресса обратитесь к администратору.");
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
