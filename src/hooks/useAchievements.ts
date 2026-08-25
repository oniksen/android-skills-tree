"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  onSnapshot,
} from "firebase/firestore";

interface Achievement {
  id: string;
  type: string;
  metadata: Record<string, unknown>;
  achievedAt: Date;
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
      if (!user) {
        setAchievements([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!uid) return;

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
  }, [uid]);

  const addAchievementIfNotExists = async (
    type: string,
    metadata: Record<string, unknown>,
    matchKey?: string,
    matchValue?: unknown,
  ) => {
    if (!uid) return;

    const achievementsRef = collection(db, "users", uid, "achievements");
    const snap = await getDocs(query(achievementsRef));

    const exists = snap.docs.some((doc) => {
      const data = doc.data();
      if (data.type !== type) return false;
      if (matchKey && matchValue !== undefined) {
        return data.metadata?.[matchKey] === matchValue;
      }
      return true;
    });

    if (!exists) {
      const newRef = doc(achievementsRef);
      await setDoc(newRef, {
        type,
        metadata,
        achievedAt: new Date(),
      });
    }
  };

  return { achievements, loading, addAchievementIfNotExists };
}
