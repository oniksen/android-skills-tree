"use client";

import { useEffect, useMemo } from "react";
import { useServices } from "@/composition/services-context";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { isQuotaExceeded } from "@/shared/lib/quota";
import { checkAchievementsOnce } from "@/lib/firestore-actions";
import { createLiveStore } from "@/shared/lib/live-store";
import { useLiveStore } from "@/shared/lib/use-live-store";
import type { Observer } from "@/ports/observation";
import type { Achievement } from "@/types";

const EMPTY_ACHIEVEMENTS: Achievement[] = [];

// One collection listener per user for the whole session.
const achievementStore = createLiveStore<Achievement[]>();

export function useAchievements() {
  const { achievements: repository } = useServices();
  const { uid, loading: authLoading } = useFirebaseAuth();
  const toast = useToast();
  const showToast = toast.show;

  const start = useMemo(
    () =>
      uid
        ? (observer: Observer<Achievement[]>) =>
            repository.subscribe(uid, observer)
        : null,
    [uid, repository],
  );

  const snapshot = useLiveStore(achievementStore, uid, start);

  useEffect(() => {
    const error = snapshot.error;
    if (!error) return;
    console.error("Error listening to achievements:", error);
    if (isPermissionDenied(error)) {
      showToast("Для отслеживания прогресса обратитесь к администратору.");
    }
    if (isQuotaExceeded(error)) {
      showToast("Квота Firestore исчерпана. Повторите позже.");
    }
  }, [snapshot.error, showToast]);

  useEffect(() => {
    if (!uid) return;
    void checkAchievementsOnce(uid).catch((error) => {
      console.error("Error syncing achievements:", error);
      if (isPermissionDenied(error)) {
        showToast("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        showToast("Квота Firestore исчерпана. Повторите позже.");
      }
    });
  }, [uid, showToast]);

  const signedOut = !authLoading && !uid;

  return {
    achievements: signedOut ? EMPTY_ACHIEVEMENTS : (snapshot.data ?? EMPTY_ACHIEVEMENTS),
    loading: signedOut ? false : authLoading || snapshot.loading,
  };
}
