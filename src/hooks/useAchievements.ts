"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { userAchievementsPath } from "@/adapters/firestore-client/paths";
import type { Achievement } from "@/types";

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { uid, loading: authLoading } = useFirebaseAuth();

  useEffect(() => {
    if (authLoading || !uid) return;

    const achievementsRef = collection(db, ...userAchievementsPath(uid));

    const unsubscribe = onSnapshot(achievementsRef, (snapshot) => {
      const list: Achievement[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          type: data.type,
          metadata: data.metadata,
          achievedAt: data.achievedAt?.toDate() ?? new Date(),
        });
      });
      list.sort((a, b) => b.achievedAt.getTime() - a.achievedAt.getTime());
      setAchievements(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid, authLoading]);

  const signedOut = !authLoading && !uid;

  return {
    achievements: signedOut ? EMPTY_ACHIEVEMENTS : achievements,
    loading: signedOut ? false : loading,
  };
}

const EMPTY_ACHIEVEMENTS: Achievement[] = [];
