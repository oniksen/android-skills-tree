"use client";

import { useMemo } from "react";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { useUserState } from "./useUserState";

const EMPTY_PROJECT_MAP: Record<string, boolean> = {};

export function useProjectProgress() {
  const { uid, loading: authLoading } = useFirebaseAuth();
  const { state, loading: stateLoading } = useUserState();

  const projectMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    if (state?.projects) {
      for (const key of Object.keys(state.projects)) {
        map[key] = state.projects[key].completed;
      }
    }
    return map;
  }, [state]);

  const signedOut = !authLoading && !uid;

  return {
    projectMap: signedOut ? EMPTY_PROJECT_MAP : projectMap,
    loading: signedOut ? false : stateLoading,
  };
}