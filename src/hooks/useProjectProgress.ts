"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { useFirebaseAuth } from "./useFirebaseAuth";

export function useProjectProgress() {
  const [projectMap, setProjectMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { uid, loading: authLoading } = useFirebaseAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!uid) {
      setProjectMap({});
      setLoading(false);
      return;
    }

    const projectsRef = collection(db, "users", uid, "projects");

    const unsubscribe = onSnapshot(projectsRef, (snapshot) => {
      const map: Record<string, boolean> = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        map[doc.id] = data.completed;
      });
      setProjectMap(map);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid, authLoading]);

  const toggleProjectCompletion = async (
    projectId: string,
    completed: boolean,
  ) => {
    if (!uid) return;
    const projectRef = doc(db, "users", uid, "projects", projectId);
    await setDoc(projectRef, {
      completed,
      completedAt: completed ? new Date() : null,
    });
  };

  const deleteProjectProgress = async (projectIds: string[]) => {
    if (!uid) return;
    for (const projectId of projectIds) {
      const projectRef = doc(db, "users", uid, "projects", projectId);
      await deleteDoc(projectRef);
    }
  };

  return { projectMap, loading, toggleProjectCompletion, deleteProjectProgress };
}
