"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

export function useProjectProgress() {
  const [projectMap, setProjectMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
      if (!user) {
        setProjectMap({});
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!uid) return;

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
  }, [uid]);

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
