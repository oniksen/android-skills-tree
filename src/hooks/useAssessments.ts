"use client";

import { useState, useEffect, useCallback } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { skills } from "@/data/skills";

export interface AssessmentData {
  score: number;
  subtopics?: Record<string, boolean>;
}

function calcSkillScore(skillId: string, subtopics: Record<string, boolean>): number {
  const skill = skills.find((s) => s.id === skillId);
  if (!skill || !skill.subtopics || skill.subtopics.length === 0) return 0;
  const completed = skill.subtopics.filter((st) => subtopics[st]).length;
  return Math.round((completed / skill.subtopics.length) * skill.maxWeight);
}

export function useAssessments() {
  const [assessmentMap, setAssessmentMap] = useState<
    Record<string, AssessmentData>
  >({});
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
      if (!user) {
        setAssessmentMap({});
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!uid) return;

    const assessmentsRef = collection(db, "users", uid, "assessments");

    const unsubscribe = onSnapshot(assessmentsRef, (snapshot) => {
      const map: Record<string, AssessmentData> = {};
      snapshot.forEach((d) => {
        const data = d.data();
        map[d.id] = {
          score: data.score,
          subtopics: data.subtopics,
        };
      });
      setAssessmentMap(map);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  const toggleSubtopic = useCallback(
    async (skillId: string, subtopicName: string) => {
      if (!uid) return;
      const assessmentRef = doc(db, "users", uid, "assessments", skillId);

      const current = assessmentMap[skillId];
      const currentSubtopics = current?.subtopics || {};
      const newValue = !currentSubtopics[subtopicName];

      const updatedSubtopics = { ...currentSubtopics, [subtopicName]: newValue };
      const newScore = calcSkillScore(skillId, updatedSubtopics);

      await setDoc(assessmentRef, {
        subtopics: updatedSubtopics,
        score: newScore,
        updatedAt: new Date(),
      }, { merge: true });

      const updatedMap = { ...assessmentMap, [skillId]: { score: newScore, subtopics: updatedSubtopics } };
      const totalScore = Object.values(updatedMap).reduce((sum, d) => sum + d.score, 0);
      const progressRef = doc(db, "users", uid, "progress", "current");
      await setDoc(progressRef, { totalScore }, { merge: true });
    },
    [uid, assessmentMap],
  );

  const deleteAssessmentsByLevel = async (skillIds: string[]) => {
    if (!uid) return;
    for (const skillId of skillIds) {
      const assessmentRef = doc(db, "users", uid, "assessments", skillId);
      await deleteDoc(assessmentRef);
    }
  };

  return {
    assessmentMap,
    loading,
    toggleSubtopic,
    deleteAssessmentsByLevel,
  };
}
