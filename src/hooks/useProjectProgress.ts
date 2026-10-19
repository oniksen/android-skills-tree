"use client";

import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useServices } from "@/composition/services-context";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { userProjectPath } from "@/adapters/firestore-client/paths";

const EMPTY_PROJECT_MAP: Record<string, boolean> = {};

export function useProjectProgress() {
  const { projects: repository } = useServices();
  const [projectMap, setProjectMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { uid, loading: authLoading } = useFirebaseAuth();
  const toast = useToast();

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
