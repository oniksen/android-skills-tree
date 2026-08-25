"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";

interface UserProgress {
  currentLevelId: string;
  unlockedLevelIds: string[];
  totalScore: number;
}

const DEFAULT_PROGRESS: UserProgress = {
  currentLevelId: "junior",
  unlockedLevelIds: ["junior"],
  totalScore: 0,
};

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
      if (!user) {
        setProgress(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!uid) return;

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
