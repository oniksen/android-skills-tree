"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, runTransaction } from "firebase/firestore";
import { syncStreak } from "@/adapters/firestore-client/streak-commands";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { useUserState } from "./useUserState";
import { calcSkillScore, calcTotalScore } from "@/core/domain/scoring";
import { computeAssessmentToggle } from "@/core/use-cases/compute-assessment-toggle";
import { checkAchievements } from "@/lib/firestore-actions";
import {
  ASSESSMENT_AWARD_TYPES,
  achievementKey,
  getAssessmentAwardKeys,
} from "@/core/domain/achievement-conditions";

import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import {
  userAssessmentPath,
  userCurrencyPath,
  userProgressPath,
  userStatePath,
} from "@/adapters/firestore-client/paths";
import { ensureUserState } from "@/adapters/firestore-client/state";
import { patchCachedUserState } from "@/shared/lib/user-state-store";
import type { AssessmentData, CurrencyData, UserProgress } from "@/types";

export interface CrystalAward {
  skillId: string;
  amount: number;
  id: number;
}

const EMPTY_ASSESSMENT_MAP: Record<string, AssessmentData> = {};

export function useAssessments() {
  const { uid, loading: authLoading } = useFirebaseAuth();
  const { state, loading: stateLoading } = useUserState();
  const toast = useToast();
  const showToast = toast.show;
  const [lastAwarded, setLastAwarded] = useState<CrystalAward | null>(null);
  const mapRef = useRef<Record<string, AssessmentData>>(EMPTY_ASSESSMENT_MAP);

  const assessmentMap = state?.assessments ?? EMPTY_ASSESSMENT_MAP;

  useEffect(() => {
    if (state?.assessments) mapRef.current = state.assessments;
  }, [state?.assessments]);

  const signedOut = !authLoading && !uid;
  const loading = signedOut ? false : stateLoading;

  const toggleSubtopic = useCallback(
    async (skillId: string, subtopicName: string) => {
      if (!uid) return null;

      await ensureUserState(uid);

      const assessmentRef = doc(db, ...userAssessmentPath(uid, skillId));
      const currencyRef = doc(db, ...userCurrencyPath(uid));
      const progressRef = doc(db, ...userProgressPath(uid));
      const stateRef = doc(db, ...userStatePath(uid));

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
          const items =
            currency.items && typeof currency.items === "object" && !Array.isArray(currency.items)
              ? (currency.items as Record<string, number>)
              : {};

          const { nextSubtopics, nextValue, complete, justCompleted, completionChanged, awarded } =
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

          let nextCurrency: CurrencyData | undefined;
          if (awarded > 0) {
            nextCurrency = {
              balance: balance + awarded,
              items,
              claimedSkills: { ...claimedSkills, [skillId]: new Date().toISOString() },
              updatedAt: new Date(),
            };
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

          const nextMap = {
            ...mapRef.current,
            [skillId]: { score: newScore, subtopics: nextSubtopics },
          };
          const totalScore = calcTotalScore(nextMap);

          tx.set(progressRef, { totalScore }, { merge: true });

          const statePayload: Record<string, unknown> = {
            assessments: { [skillId]: { score: newScore, subtopics: nextSubtopics, updatedAt: new Date() } },
            progress: { totalScore },
          };
          if (awarded > 0 && nextCurrency) {
            statePayload.currency = nextCurrency;
          }
          tx.set(stateRef, statePayload, { merge: true });

          return { nextValue, nextSubtopics, newScore, complete, awarded, justCompleted, completionChanged, nextCurrency };
        });

        const { nextValue, nextSubtopics, newScore, awarded, justCompleted, completionChanged, nextCurrency } = result;

        const nextMap = {
          ...mapRef.current,
          [skillId]: { score: newScore, subtopics: nextSubtopics },
        };
        mapRef.current = nextMap;

        const desiredKeys = getAssessmentAwardKeys(nextMap);
        const cached = state ? Object.values(state.achievements) : null;
        let shouldCheckAchievements = cached === null;
        if (!shouldCheckAchievements && cached) {
          const cachedKeys = new Set(
            cached
              .filter((a) => ASSESSMENT_AWARD_TYPES.has(a.type))
              .map((a) => achievementKey(a.type, a.metadata)),
          );
          shouldCheckAchievements =
            desiredKeys.size !== cachedKeys.size ||
            [...desiredKeys].some((key) => !cachedKeys.has(key));
        }

        if (shouldCheckAchievements) {
          void checkAchievements(uid, nextMap).catch((error) => {
            console.error("Error syncing achievements:", error);
            if (isPermissionDenied(error)) {
              showToast("Для отслеживания прогресса обратитесь к администратору.");
            }
          });
        }

        if (awarded > 0) {
          setLastAwarded({ skillId, amount: awarded, id: Date.now() });
        }

        patchCachedUserState(uid, {
          assessments: nextMap,
          progress: { ...(state?.progress ?? {}), totalScore: calcTotalScore(nextMap) } as UserProgress,
          ...(awarded > 0 && nextCurrency ? { currency: nextCurrency } : {}),
        });

        if (nextValue) {
          void syncStreak().then((res) => {
            if (res === null) return;
          }).catch((error) => {
            console.error("Error syncing streak:", error);
            if (isPermissionDenied(error)) {
              showToast("Для отслеживания прогресса обратитесь к администратору.");
            }
          });
        }

        return { justCompleted, completionChanged };
      } catch (error) {
        console.error("Error saving assessment:", error);
        if (isPermissionDenied(error)) {
          showToast("Для отслеживания прогресса обратитесь к администратору.");
        }
        return null;
      }
    },
    [uid, showToast, state],
  );

  return {
    assessmentMap: signedOut ? EMPTY_ASSESSMENT_MAP : assessmentMap,
    loading,
    toggleSubtopic,
    lastAwarded,
  };
}
