"use client";

import { useMemo } from "react";
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

const EMPTY_PROJECT_MAP: Record<string, boolean> = {};

export function useProjectProgress() {
  const { uid, loading: authLoading } = useFirebaseAuth();
  const { state, loading: stateLoading } = useUserState();
  const toast = useToast();
  const showToast = toast.show;

  const projectMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    if (state?.projects) {
      for (const key of Object.keys(state.projects)) {
        map[key] = state.projects[key].completed;
      }
    }
    return map;
  }, [state]);

  const toggleProjectCompletion = async (
    projectId: string,
    completed: boolean,
  ) => {
    if (!uid) return;
    await ensureUserState(uid);
    const stateRef = doc(db, ...userStatePath(uid));
    try {
      const completedAt = completed ? new Date() : null;
      await setDoc(
        stateRef,
        {
          projects: {
            [projectId]: {
              projectId,
              completed,
              completedAt,
            },
          },
        },
        { merge: true },
      );
      const nextProjects = {
        ...(state?.projects ?? {}),
        [projectId]: {
          projectId,
          completed,
          completedAt: completed ? new Date() : null,
        },
      };
      patchCachedUserState(uid, { projects: nextProjects });
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
    projectMap: signedOut ? EMPTY_PROJECT_MAP : projectMap,
    loading: signedOut ? false : stateLoading,
    toggleProjectCompletion,
  };
}
