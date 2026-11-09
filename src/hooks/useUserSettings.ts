"use client";

import { useCallback, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { isQuotaExceeded } from "@/shared/lib/quota";
import { userSettingsPath } from "@/adapters/firestore-client/paths";
import { createLiveStore } from "@/shared/lib/live-store";
import { useLiveStore } from "@/shared/lib/use-live-store";
import { registerSessionReset } from "@/shared/lib/session-reset";
import type { Observer } from "@/ports/observation";
import type { UserSettings } from "@/types";

const DEFAULT_SETTINGS: UserSettings = {
  maxDailyQuestions: 5,
  updatedAt: new Date(),
};

// One listener per user for the whole session.
const settingsStore = createLiveStore<UserSettings>();
registerSessionReset(() => settingsStore.disposeAll());

export function useUserSettings() {
  const { uid, loading: authLoading } = useFirebaseAuth();
  const toast = useToast();
  const showToast = toast.show;

  const start = useMemo(
    () =>
      uid
        ? (observer: Observer<UserSettings>) => {
            const ref = doc(db, ...userSettingsPath(uid));
            getDoc(ref)
              .then((snap) => {
                observer.next(
                  snap.exists() ? (snap.data() as UserSettings) : DEFAULT_SETTINGS,
                );
              })
              .catch((error) => observer.error?.(error));
            return () => {};
          }
        : null,
    [uid],
  );

  const snapshot = useLiveStore(settingsStore, uid, start);

  useEffect(() => {
    const error = snapshot.error;
    if (!error) return;
    console.error("Error listening to settings:", error);
    if (isPermissionDenied(error)) {
      showToast("Для отслеживания прогресса обратитесь к администратору.");
    }
    if (isQuotaExceeded(error)) {
      showToast("Квота Firestore исчерпана. Повторите позже.");
    }
  }, [snapshot.error, showToast]);

  const signedOut = !authLoading && !uid;
  const settings = signedOut ? null : (snapshot.data ?? null);
  const loading = signedOut ? false : authLoading || snapshot.loading;

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
    settingsStore.set(uid, next);
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
      settingsStore.set(uid, next);
    },
    [uid, settings],
  );

  return { settings, loading, saveSettings, uid, getTodayCount, incrementDailyCount, todayKey };
}
