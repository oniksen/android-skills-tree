"use client";

import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { userSettingsPath } from "@/adapters/firestore-client/paths";
import type { UserSettings } from "@/types";

const DEFAULT_SETTINGS: UserSettings = {
  maxDailyQuestions: 5,
  updatedAt: new Date(),
};

export function useUserSettings() {
  const { uid, loading: authLoading } = useFirebaseAuth();
  const toast = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !uid) return;
    const ref = doc(db, ...userSettingsPath(uid));
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setSettings(snap.data() as UserSettings);
        } else {
          setSettings(DEFAULT_SETTINGS);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to settings:", error);
        setLoading(false);
        if (isPermissionDenied(error)) {
          toast.show("Для отслеживания прогресса обратитесь к администратору.");
        }
      },
    );
    return () => unsub();
  }, [uid, authLoading, toast]);

  const todayKey = new Date().toISOString().slice(0, 10);

  const getTodayCount = useCallback(() => {
    return settings?.dailyCounts?.[todayKey] ?? 0;
  }, [settings, todayKey]);

  const incrementDailyCount = useCallback(async () => {
    if (!uid) return;
    const ref = doc(db, ...userSettingsPath(uid));
    const current = settings?.dailyCounts?.[todayKey] ?? 0;
    const nextCounts = { ...(settings?.dailyCounts ?? {}), [todayKey]: current + 1 };
    const next: UserSettings = {
      ...(settings ?? DEFAULT_SETTINGS),
      dailyCounts: nextCounts,
      updatedAt: new Date(),
    };
    await setDoc(ref, { dailyCounts: nextCounts, updatedAt: new Date() }, { merge: true });
    setSettings(next);
  }, [uid, settings, todayKey]);

  const saveSettings = useCallback(
    async (patch: Partial<UserSettings>) => {
      if (!uid) return;
      const ref = doc(db, ...userSettingsPath(uid));
      const next: UserSettings = {
        ...(settings ?? DEFAULT_SETTINGS),
        ...patch,
        updatedAt: new Date(),
      };
      if (patch.groqApiKey !== undefined) {
        next.groqKeyLast4 = patch.groqApiKey
          ? patch.groqApiKey.slice(-6)
          : undefined;
      }
      await setDoc(ref, next, { merge: true });
      setSettings(next);
    },
    [uid, settings],
  );

  return { settings, loading, saveSettings, uid, getTodayCount, incrementDailyCount, todayKey };
}
