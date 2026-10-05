"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { useFirebaseAuth } from "./useFirebaseAuth";
import {
  backfillTotalScore,
  checkAchievements,
  getAssessmentMap,
} from "@/lib/firestore-actions";
import type { UserProgress } from "@/types";

const DEFAULT_PROGRESS: UserProgress = {
  currentLevelId: "junior",
  unlockedLevelIds: ["junior"],
  totalScore: 0,
};

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const { uid, loading: authLoading } = useFirebaseAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!uid) {
      setProgress(null);
      setLoading(false);
      return;
    }

    const progressRef = doc(db, "users", uid, "progress", "current");

    const unsubscribe = onSnapshot(
      progressRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          setProgress(snapshot.data() as UserProgress);
        } else {
          await setDoc(progressRef, DEFAULT_PROGRESS);
          setProgress(DEFAULT_PROGRESS);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to progress:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [uid, authLoading]);

  useEffect(() => {
    if (!uid) return;
    const assessments = getAssessmentMap(uid);
    void backfillTotalScore(uid, assessments).catch((error) => {
      console.error("Error recalculating total score:", error);
    });
    void checkAchievements(uid, assessments).catch((error) => {
      console.error("Error checking achievements:", error);
    });
  }, [uid]);

  const updateProgress = async (data: Partial<UserProgress>) => {
    if (!uid) return;
    const progressRef = doc(db, "users", uid, "progress", "current");
    const snap = await getDoc(progressRef);
    if (snap.exists()) {
      const { updateDoc } = await import("firebase/firestore");
      await updateDoc(progressRef, data);
    } else {
      await setDoc(progressRef, { ...DEFAULT_PROGRESS, ...data });
    }
  };

  return { progress, loading, updateProgress };
}
