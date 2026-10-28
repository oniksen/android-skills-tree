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

const settingsCache = new Map<
  string,
  {
    value: UserSettings | null;
    loading: boolean;
    listeners: Set<(v: UserSettings | null) => void>;
    errorListeners: Set<(e: unknown) => void>;
    unsub: (() => void) | null;
  }
>();

export function useUserSettings() {
  const { uid, loading: authLoading } = useFirebaseAuth();
  const toast = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !uid) return;

    let entry = settingsCache.get(uid);
    if (!entry) {
      entry = { value: null, loading: true, listeners: new Set(), errorListeners: new Set(), unsub: null };
      settingsCache.set(uid, entry);
      const ref = doc(db, ...userSettingsPath(uid));
      entry.unsub = onSnapshot(
        ref,
        (snap) => {
          const value = snap.exists() ? (snap.data() as UserSettings) : DEFAULT_SETTINGS;
          entry!.value = value;
          entry!.loading = false;
          entry!.listeners.forEach((l) => l(value));
        },
        (error) => {
          entry!.loading = false;
          entry!.errorListeners.forEach((l) => l(error));
        },
      );
    }

    const listener = (value: UserSettings | null) => {
      setSettings(value);
      setLoading(false);
    };
    const errorListener = (error: unknown) => {
      console.error("Error listening to settings:", error);
      setLoading(false);
      if (isPermissionDenied(error)) {
        toast.show("Для отслеживания прогресса обратитесь к администратору.");
      }
    };

    entry.listeners.add(listener);
    entry.errorListeners.add(errorListener);

    if (!entry.loading) {
      setTimeout(() => {
        setSettings(entry.value);
        setLoading(false);
      }, 0);
    }

    return () => {
      entry!.listeners.delete(listener);
      entry!.errorListeners.delete(errorListener);
      if (entry!.listeners.size === 0) {
        entry!.unsub?.();
        settingsCache.delete(uid);
      }
    };
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
