"use client";

import { useState, useEffect } from "react";
import { useServices } from "@/composition/services-context";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { isQuotaExceeded } from "@/shared/lib/quota";
import type { Achievement } from "@/types";

const EMPTY_ACHIEVEMENTS: Achievement[] = [];

const achievementCache = new Map<
  string,
  {
    value: Achievement[];
    loading: boolean;
    listeners: Set<(v: Achievement[]) => void>;
    errorListeners: Set<(e: unknown) => void>;
    unsub: (() => void) | null;
  }
>();

export function useAchievements() {
  const { achievements: repository } = useServices();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { uid, loading: authLoading } = useFirebaseAuth();
  const toast = useToast();

  useEffect(() => {
    if (authLoading || !uid) return;

    let entry = achievementCache.get(uid);
    if (!entry) {
      entry = { value: [], loading: true, listeners: new Set(), errorListeners: new Set(), unsub: null };
      achievementCache.set(uid, entry);
      entry.unsub = repository.subscribe(uid, {
        next: (list) => {
          entry!.value = list;
          entry!.loading = false;
          entry!.listeners.forEach((l) => l(list));
        },
        error: (error) => {
          entry!.loading = false;
          entry!.errorListeners.forEach((l) => l(error));
        },
      });
    }

    const listener = (list: Achievement[]) => {
      setAchievements(list);
      setLoading(false);
    };
    const errorListener = (error: unknown) => {
      console.error("Error listening to achievements:", error);
      setLoading(false);
      if (isPermissionDenied(error)) {
        toast.show("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        toast.show("Квота Firestore исчерпана. Повторите позже.");
      }
    };

    entry.listeners.add(listener);
    entry.errorListeners.add(errorListener);

    if (!entry.loading) {
      setTimeout(() => {
        setAchievements(entry.value);
        setLoading(false);
      }, 0);
    }

    return () => {
      entry!.listeners.delete(listener);
      entry!.errorListeners.delete(errorListener);
      if (entry!.listeners.size === 0) {
        entry!.unsub?.();
        achievementCache.delete(uid);
      }
    };
  }, [uid, authLoading, repository, toast]);

  const signedOut = !authLoading && !uid;

  return {
    achievements: signedOut ? EMPTY_ACHIEVEMENTS : achievements,
    loading: signedOut ? false : loading,
  };
}
