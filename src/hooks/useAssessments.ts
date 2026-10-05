"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { syncStreak } from "@/lib/streak";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { calcSkillScore, calcTotalScore, isSkillComplete } from "@/lib/scoring";
import { getCrystalRewardForSkill } from "@/lib/currency";
import { checkAchievements } from "@/lib/firestore-actions";
import { deleteCategoryPerfectAchievement } from "@/lib/firestore";
import { isCategoryPerfect } from "@/lib/achievement-conditions";
import { skills } from "@/data/skills";
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
  const mapRef = useRef<Record<string, AssessmentData>>({});

  useEffect(() => {
    if (authLoading) return;
    if (!uid) {
      mapRef.current = {};
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
      mapRef.current = map;
      setAssessmentMap(map);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid, authLoading]);

  const toggleSubtopic = useCallback(
    async (skillId: string, subtopicName: string) => {
      if (!uid) return null;

      const assessmentRef = doc(db, "users", uid, "assessments", skillId);
      const currencyRef = doc(db, "users", uid, "currency", "current");

      try {
        const result = await runTransaction(db, async (tx) => {
          const [assessmentSnap, currencySnap] = await Promise.all([
            tx.get(assessmentRef),
            tx.get(currencyRef),
          ]);

          const storedSubtopics =
            (assessmentSnap.data()?.subtopics as Record<string, boolean> | undefined) ?? {};
          const nextSubtopics = {
            ...storedSubtopics,
            [subtopicName]: !storedSubtopics[subtopicName],
          };
          const nextValue = nextSubtopics[subtopicName] === true;
          const complete = isSkillComplete(skillId, nextSubtopics);
          const newScore = calcSkillScore(skillId, nextSubtopics);

          const currency = currencySnap.exists()
            ? (currencySnap.data() as Partial<CurrencyData>)
            : {};
          const balance = typeof currency.balance === "number" ? currency.balance : 0;
          const claimedSkills =
            currency.claimedSkills && typeof currency.claimedSkills === "object"
              ? currency.claimedSkills
              : {};

          const alreadyClaimed = typeof claimedSkills[skillId] === "string";
          const awarded = complete && !alreadyClaimed ? getCrystalRewardForSkill(skillId) : 0;

          tx.set(
            assessmentRef,
            {
              subtopics: nextSubtopics,
              score: newScore,
              updatedAt: new Date(),
            },
            { merge: true },
          );

          if (awarded > 0) {
            tx.set(
              currencyRef,
              {
                balance: balance + awarded,
                claimedSkills: { ...claimedSkills, [skillId]: new Date().toISOString() },
                updatedAt: new Date(),
              },
              { merge: true },
            );
          }

          return {
            nextValue,
            nextSubtopics,
            newScore,
            complete,
            awarded,
            justCompleted: complete && !isSkillComplete(skillId, storedSubtopics),
          };
        });

        const { nextValue, nextSubtopics, newScore, awarded, justCompleted } = result;

        const nextMap = {
          ...mapRef.current,
          [skillId]: { score: newScore, subtopics: nextSubtopics },
        };
        mapRef.current = nextMap;
        setAssessmentMap(nextMap);

        const totalScore = calcTotalScore(nextMap);
        const progressRef = doc(db, "users", uid, "progress", "current");
        await setDoc(progressRef, { totalScore }, { merge: true });

        const categoryId = skills.find((s) => s.id === skillId)?.categoryId;

        if (justCompleted) {
          void checkAchievements(uid, nextMap).catch((error) => {
            console.error("Error checking achievements:", error);
          });
        }

        if (categoryId && nextValue === false && !isCategoryPerfect(categoryId, nextMap)) {
          await deleteCategoryPerfectAchievement(uid, categoryId).catch((error) => {
            console.error("Error revoking achievement:", error);
          });
        }

        if (awarded > 0) {
          setLastAwarded({ skillId, amount: awarded, id: Date.now() });
        }

        if (nextValue) {
          void syncStreak();
        }

        return { justCompleted };
      } catch (error) {
        console.error("Error saving assessment:", error);
        return null;
      }
    },
    [uid],
  );

  return {
    assessmentMap,
    loading,
    toggleSubtopic,
    lastAwarded,
  };
}
