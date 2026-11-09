"use client";

import { useCallback } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { useUserState } from "./useUserState";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { isQuotaExceeded } from "@/shared/lib/quota";
import { userStatePath } from "@/adapters/firestore-client/paths";
import { ensureUserState } from "@/adapters/firestore-client/state";
import { patchCachedUserState } from "@/shared/lib/user-state-store";
import type { UserSettings } from "@/types";

const DEFAULT_SETTINGS: UserSettings = {
  maxDailyQuestions: 5,
  updatedAt: new Date(),
};

export function useUserSettings() {
  const { uid, loading: authLoading } = useFirebaseAuth();
  const { state, loading: stateLoading } = useUserState();
  const toast = useToast();
  const showToast = toast.show;

  const signedOut = !authLoading && !uid;
  const settings = signedOut ? null : (state?.settings ?? null);
  const loading = signedOut ? false : stateLoading;

  const todayKey = new Date().toISOString().slice(0, 10);

  const getTodayCount = useCallback(() => {
    return settings?.dailyCounts?.[todayKey] ?? 0;
  }, [settings, todayKey]);

  const incrementDailyCount = useCallback(async () => {
    if (!uid) return;
    await ensureUserState(uid);
    const stateRef = doc(db, ...userStatePath(uid));
    const current = settings?.dailyCounts?.[todayKey] ?? 0;
    const nextCounts = { ...(settings?.dailyCounts ?? {}), [todayKey]: current + 1 };
    const next: UserSettings = {
      ...(settings ?? DEFAULT_SETTINGS),
      dailyCounts: nextCounts,
      updatedAt: new Date(),
    };
    try {
      await setDoc(stateRef, { settings: next }, { merge: true });
      patchCachedUserState(uid, { settings: next });
    } catch (error) {
      console.error("Error incrementing daily count:", error);
      if (isPermissionDenied(error)) {
        showToast("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        showToast("Квота Firestore исчерпана. Повторите позже.");
      }
      throw error;
    }
  }, [uid, settings, todayKey, showToast]);

  const saveSettings = useCallback(
    async (patch: Partial<UserSettings>) => {
      if (!uid) return;
      await ensureUserState(uid);
      const stateRef = doc(db, ...userStatePath(uid));
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
      try {
        await setDoc(stateRef, { settings: next }, { merge: true });
        patchCachedUserState(uid, { settings: next });
      } catch (error) {
        console.error("Error saving settings:", error);
        if (isPermissionDenied(error)) {
          showToast("Для отслеживания прогресса обратитесь к администратору.");
        }
        if (isQuotaExceeded(error)) {
          showToast("Квота Firestore исчерпана. Повторите позже.");
        }
        throw error;
      }
    },
    [uid, settings, showToast],
  );

  return { settings, loading, saveSettings, uid, getTodayCount, incrementDailyCount, todayKey };
}
