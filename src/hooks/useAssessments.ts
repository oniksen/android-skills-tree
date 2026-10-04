"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { syncStreak } from "@/lib/streak";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { calcSkillScore, calcTotalScore } from "@/lib/scoring";
import { getCrystalRewardForSkill } from "@/lib/currency";
import type { AssessmentData, CurrencyData } from "@/types";

export interface CrystalAward {
  skillId: string;
  amount: number;
  id: number;
}

export function useAssessments() {
  const [assessmentMap, setAssessmentMap] = useState<
    Record<string, AssessmentData>
  >({});
  const [loading, setLoading] = useState(true);
  const [lastAwarded, setLastAwarded] = useState<CrystalAward | null>(null);
  const { uid, loading: authLoading } = useFirebaseAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!uid) {
      setAssessmentMap({});
      setLoading(false);
      return;
    }

    const assessmentsRef = collection(db, "users", uid, "assessments");

    const unsubscribe = onSnapshot(assessmentsRef, (snapshot) => {
      const map: Record<string, AssessmentData> = {};
      snapshot.forEach((d) => {
        const data = d.data();
        const subtopics = data.subtopics;
        map[d.id] = {
          score: subtopics ? calcSkillScore(d.id, subtopics) : data.score || 0,
          subtopics,
        };
      });
      setAssessmentMap(map);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid, authLoading]);

  const toggleSubtopic = useCallback(
    async (skillId: string, subtopicName: string) => {
      if (!uid) return;
      const assessmentRef = doc(db, "users", uid, "assessments", skillId);
      const currencyRef = doc(db, "users", uid, "currency", "current");

      const current = assessmentMap[skillId];
      const currentSubtopics = current?.subtopics || {};
      const newValue = !currentSubtopics[subtopicName];

      const updatedSubtopics = { ...currentSubtopics, [subtopicName]: newValue };
      const newScore = calcSkillScore(skillId, updatedSubtopics);

      let awarded = 0;

      try {
        await runTransaction(db, async (tx) => {
          const [assessmentSnap, currencySnap] = await Promise.all([
            tx.get(assessmentRef),
            tx.get(currencyRef),
          ]);

          const stored = assessmentSnap.exists()
            ? (assessmentSnap.data() as { claimed?: unknown })
            : {};
          const claimed = Array.isArray(stored.claimed)
            ? (stored.claimed as string[])
            : [];
          const currency = currencySnap.exists()
            ? (currencySnap.data() as Partial<CurrencyData>)
            : {};
          const balance = typeof currency.balance === "number" ? currency.balance : 0;

          const isNewClaim = newValue && !claimed.includes(subtopicName);
          awarded = isNewClaim ? getCrystalRewardForSkill(skillId) : 0;

          tx.set(
            assessmentRef,
            {
              subtopics: updatedSubtopics,
              score: newScore,
              claimed: isNewClaim ? [...claimed, subtopicName] : claimed,
              updatedAt: new Date(),
            },
            { merge: true },
          );

          if (awarded > 0) {
            tx.set(
              currencyRef,
              { balance: balance + awarded, updatedAt: new Date() },
              { merge: true },
            );
          }
        });
      } catch (error) {
        console.error("Error saving assessment:", error);
        return;
      }

      const updatedMap = { ...assessmentMap, [skillId]: { score: newScore, subtopics: updatedSubtopics } };
      const totalScore = calcTotalScore(updatedMap);
      const progressRef = doc(db, "users", uid, "progress", "current");
      await setDoc(progressRef, { totalScore }, { merge: true });

      if (awarded > 0) {
        setLastAwarded({ skillId, amount: awarded, id: Date.now() });
      }

      if (newValue) {
        void syncStreak();
      }
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
    lastAwarded,
  };
}
