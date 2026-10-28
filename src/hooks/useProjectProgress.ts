"use client";

import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useServices } from "@/composition/services-context";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { isQuotaExceeded } from "@/shared/lib/quota";
import { userProjectPath } from "@/adapters/firestore-client/paths";

const EMPTY_PROJECT_MAP: Record<string, boolean> = {};

const projectCache = new Map<
  string,
  {
    value: Record<string, boolean>;
    loading: boolean;
    listeners: Set<(v: Record<string, boolean>) => void>;
    errorListeners: Set<(e: unknown) => void>;
    unsub: (() => void) | null;
  }
>();

export function useProjectProgress() {
  const { projects: repository } = useServices();
  const [projectMap, setProjectMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { uid, loading: authLoading } = useFirebaseAuth();
  const toast = useToast();

  useEffect(() => {
    if (authLoading || !uid) return;

    let entry = projectCache.get(uid);
    if (!entry) {
      entry = { value: {}, loading: true, listeners: new Set(), errorListeners: new Set(), unsub: null };
      projectCache.set(uid, entry);
      entry.unsub = repository.subscribe(uid, {
        next: (map) => {
          entry!.value = map;
          entry!.loading = false;
          entry!.listeners.forEach((l) => l(map));
        },
        error: (error) => {
          entry!.loading = false;
          entry!.errorListeners.forEach((l) => l(error));
        },
      });
    }

    const listener = (map: Record<string, boolean>) => {
      setProjectMap(map);
      setLoading(false);
    };
    const errorListener = (error: unknown) => {
      console.error("Error listening to projects:", error);
      if (isPermissionDenied(error)) {
        toast.show("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        toast.show("Квота Firestore исчерпана. Повторите позже.");
      }
      setLoading(false);
    };

    entry.listeners.add(listener);
    entry.errorListeners.add(errorListener);

    if (!entry.loading) {
      setTimeout(() => {
        setProjectMap(entry.value);
        setLoading(false);
      }, 0);
    }

    return () => {
      entry!.listeners.delete(listener);
      entry!.errorListeners.delete(errorListener);
      if (entry!.listeners.size === 0) {
        entry!.unsub?.();
        projectCache.delete(uid);
      }
    };
  }, [uid, authLoading, repository, toast]);

  const toggleProjectCompletion = async (
    projectId: string,
    completed: boolean,
  ) => {
    if (!uid) return;
    const projectRef = doc(db, ...userProjectPath(uid, projectId));
    try {
      await setDoc(projectRef, {
        completed,
        completedAt: completed ? new Date() : null,
      });
    } catch (error) {
      console.error("Error toggling project:", error);
      if (isPermissionDenied(error)) {
        toast.show("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        toast.show("Квота Firestore исчерпана. Повторите позже.");
      }
      throw error;
    }
  };

  const signedOut = !authLoading && !uid;

  return {
    projectMap: signedOut ? EMPTY_PROJECT_MAP : projectMap,
    loading: signedOut ? false : loading,
    toggleProjectCompletion,
  };
}
