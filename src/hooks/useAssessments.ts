"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, runTransaction } from "firebase/firestore";
import { syncStreak } from "@/adapters/firestore-client/streak-commands";
import { useServices } from "@/composition/services-context";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { calcSkillScore, calcTotalScore } from "@/core/domain/scoring";
import { computeAssessmentToggle } from "@/core/use-cases/compute-assessment-toggle";
import { checkAchievements } from "@/lib/firestore-actions";
import { deleteCategoryPerfectAchievement } from "@/lib/firestore";
import { isCategoryPerfect } from "@/core/domain/achievement-conditions";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { skills } from "@/data/skills";
import {
  userAssessmentPath,
  userCurrencyPath,
  userProgressPath,
} from "@/adapters/firestore-client/paths";
import type { AssessmentData, CurrencyData } from "@/types";

export interface CrystalAward {
  skillId: string;
  amount: number;
  id: number;
}

const EMPTY_ASSESSMENT_MAP: Record<string, AssessmentData> = {};

export function useAssessments() {
  const { assessments: repository } = useServices();
  const [assessmentMap, setAssessmentMap] = useState<
    Record<string, AssessmentData>
  >({});
  const [loading, setLoading] = useState(true);
  const [lastAwarded, setLastAwarded] = useState<CrystalAward | null>(null);
  const { uid, loading: authLoading } = useFirebaseAuth();
  const toast = useToast();
  const mapRef = useRef<Record<string, AssessmentData>>({});

  useEffect(() => {
    if (authLoading || !uid) return;

    return repository.subscribe(uid, {
      next: (map) => {
        mapRef.current = map;
        setAssessmentMap(map);
        setLoading(false);
      },
      error: (error) => {
        console.error("Error listening to assessments:", error);
        setLoading(false);
      },
    });
  }, [uid, authLoading, repository]);

  const toggleSubtopic = useCallback(
    async (skillId: string, subtopicName: string) => {
      if (!uid) return null;

      const assessmentRef = doc(db, ...userAssessmentPath(uid, skillId));
      const currencyRef = doc(db, ...userCurrencyPath(uid));

      try {
        const result = await runTransaction(db, async (tx) => {
          const [assessmentSnap, currencySnap] = await Promise.all([
            tx.get(assessmentRef),
            tx.get(currencyRef),
          ]);

          const storedSubtopics =
            (assessmentSnap.data()?.subtopics as Record<string, boolean> | undefined) ?? {};
          const currency = currencySnap.exists()
            ? (currencySnap.data() as Partial<CurrencyData>)
            : {};
          const balance = typeof currency.balance === "number" ? currency.balance : 0;
          const claimedSkills =
            currency.claimedSkills && typeof currency.claimedSkills === "object"
              ? (currency.claimedSkills as Record<string, string>)
              : {};

          const { nextSubtopics, nextValue, complete, justCompleted, awarded } =
            computeAssessmentToggle({
              skillId,
              subtopicName,
              storedSubtopics,
              claimedSkills,
            });
          const newScore = calcSkillScore(skillId, nextSubtopics);

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

          return { nextValue, nextSubtopics, newScore, complete, awarded, justCompleted };
        });

        const { nextValue, nextSubtopics, newScore, awarded, justCompleted } = result;

        const nextMap = {
          ...mapRef.current,
          [skillId]: { score: newScore, subtopics: nextSubtopics },
        };
        mapRef.current = nextMap;
        setAssessmentMap(nextMap);

        const totalScore = calcTotalScore(nextMap);
        const progressRef = doc(db, ...userProgressPath(uid));
        await setDoc(progressRef, { totalScore }, { merge: true });

        const categoryId = skills.find((s) => s.id === skillId)?.categoryId;

        if (justCompleted) {
          void checkAchievements(uid, nextMap).catch((error) => {
            console.error("Error checking achievements:", error);
            if (isPermissionDenied(error)) {
              toast.show("Для отслеживания прогресса обратитесь к администратору.");
            }
          });
        }

        if (categoryId && nextValue === false && !isCategoryPerfect(categoryId, nextMap)) {
          await deleteCategoryPerfectAchievement(uid, categoryId).catch((error) => {
            console.error("Error revoking achievement:", error);
            if (isPermissionDenied(error)) {
              toast.show("Для отслеживания прогресса обратитесь к администратору.");
            }
          });
        }

        if (awarded > 0) {
          setLastAwarded({ skillId, amount: awarded, id: Date.now() });
        }

        if (nextValue) {
          void syncStreak().then((res) => {
            if (res === null) return;
          }).catch((error) => {
            console.error("Error syncing streak:", error);
            if (isPermissionDenied(error)) {
              toast.show("Для отслеживания прогресса обратитесь к администратору.");
            }
          });
        }

        return { justCompleted };
      } catch (error) {
        console.error("Error saving assessment:", error);
        if (isPermissionDenied(error)) {
          toast.show("Для отслеживания прогресса обратитесь к администратору.");
        }
        return null;
      }
    },
    [uid, toast],
  );

  const signedOut = !authLoading && !uid;

  return {
    assessmentMap: signedOut ? EMPTY_ASSESSMENT_MAP : assessmentMap,
    loading: signedOut ? false : loading,
    toggleSubtopic,
    lastAwarded,
  };
}
