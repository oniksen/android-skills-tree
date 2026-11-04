"use client";

import { useEffect, useMemo } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useServices } from "@/composition/services-context";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { isQuotaExceeded } from "@/shared/lib/quota";
import { createLiveStore } from "@/shared/lib/live-store";
import { useLiveStore } from "@/shared/lib/use-live-store";
import { registerSessionReset } from "@/shared/lib/session-reset";
import { userProjectPath } from "@/adapters/firestore-client/paths";
import type { Observer } from "@/ports/observation";

const EMPTY_PROJECT_MAP: Record<string, boolean> = {};

// One collection listener per user for the whole session.
const projectStore = createLiveStore<Record<string, boolean>>();
registerSessionReset(() => projectStore.disposeAll());

export function useProjectProgress() {
  const { projects: repository } = useServices();
  const { uid, loading: authLoading } = useFirebaseAuth();
  const toast = useToast();
  const showToast = toast.show;

  const start = useMemo(
    () =>
      uid
        ? (observer: Observer<Record<string, boolean>>) =>
            repository.subscribe(uid, observer)
        : null,
    [uid, repository],
  );

  const snapshot = useLiveStore(projectStore, uid, start);

  useEffect(() => {
    const error = snapshot.error;
    if (!error) return;
    console.error("Error listening to projects:", error);
    if (isPermissionDenied(error)) {
      showToast("Для отслеживания прогресса обратитесь к администратору.");
    }
    if (isQuotaExceeded(error)) {
      showToast("Квота Firestore исчерпана. Повторите позже.");
    }
  }, [snapshot.error, showToast]);

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
        showToast("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        showToast("Квота Firestore исчерпана. Повторите позже.");
      }
      throw error;
    }
  };

  const signedOut = !authLoading && !uid;

  return {
    projectMap: signedOut ? EMPTY_PROJECT_MAP : (snapshot.data ?? EMPTY_PROJECT_MAP),
    loading: signedOut ? false : authLoading || snapshot.loading,
    toggleProjectCompletion,
  };
}
