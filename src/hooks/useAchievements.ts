"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import { useFirebaseAuth } from "./useFirebaseAuth";
import type { Achievement } from "@/types";

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { uid, loading: authLoading } = useFirebaseAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!uid) {
      setAchievements([]);
      setLoading(false);
      return;
    }

    const achievementsRef = collection(db, "users", uid, "achievements");

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

  return { achievements, loading };
}
