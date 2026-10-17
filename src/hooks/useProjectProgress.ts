"use client";

import { useState, useEffect } from "react";
import { useServices } from "@/composition/services-context";
import { useFirebaseAuth } from "./useFirebaseAuth";
import {
  toggleProjectCompletionAction,
  deleteProjectProgressAction,
} from "@/features/projects/actions";

const EMPTY_PROJECT_MAP: Record<string, boolean> = {};

export function useProjectProgress() {
  const { projects: repository } = useServices();
  const [projectMap, setProjectMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { uid, loading: authLoading } = useFirebaseAuth();

  useEffect(() => {
    if (authLoading || !uid) return;

    return repository.subscribe(uid, {
      next: (map) => {
        setProjectMap(map);
        setLoading(false);
      },
      error: (error) => {
        console.error("Error listening to projects:", error);
        setLoading(false);
      },
    });
  }, [uid, authLoading, repository]);

  const toggleProjectCompletion = async (
    projectId: string,
    completed: boolean,
  ) => {
    if (!uid) return;
    try {
      await toggleProjectCompletionAction(projectId, completed);
    } catch (error) {
      console.error("Error toggling project completion:", error);
    }
  };

  const deleteProjectProgress = async (projectIds: string[]) => {
    if (!uid) return;
    try {
      await deleteProjectProgressAction(projectIds);
    } catch (error) {
      console.error("Error deleting project progress:", error);
    }
  };

  const signedOut = !authLoading && !uid;

  return {
    projectMap: signedOut ? EMPTY_PROJECT_MAP : projectMap,
    loading: signedOut ? false : loading,
    toggleProjectCompletion,
    deleteProjectProgress,
  };
}
