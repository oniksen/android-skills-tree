"use client";

import { useState, useEffect } from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useServices } from "@/composition/services-context";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { userProjectPath } from "@/adapters/firestore-client/paths";

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
    const projectRef = doc(db, ...userProjectPath(uid, projectId));
    await setDoc(projectRef, {
      completed,
      completedAt: completed ? new Date() : null,
    });
  };

  const deleteProjectProgress = async (projectIds: string[]) => {
    if (!uid) return;
    for (const projectId of projectIds) {
      const projectRef = doc(db, ...userProjectPath(uid, projectId));
      await deleteDoc(projectRef);
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
