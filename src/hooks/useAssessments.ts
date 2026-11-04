"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, runTransaction } from "firebase/firestore";
import { syncStreak } from "@/adapters/firestore-client/streak-commands";
import { useServices } from "@/composition/services-context";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { calcSkillScore, calcTotalScore } from "@/core/domain/scoring";
import { computeAssessmentToggle } from "@/core/use-cases/compute-assessment-toggle";
import { checkAchievements } from "@/lib/firestore-actions";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { isQuotaExceeded } from "@/shared/lib/quota";
import { createLiveStore } from "@/shared/lib/live-store";
import { useLiveStore } from "@/shared/lib/use-live-store";
import {
  userAssessmentPath,
  userCurrencyPath,
  userProgressPath,
} from "@/adapters/firestore-client/paths";
import type { Observer } from "@/ports/observation";
import type { AssessmentData, CurrencyData } from "@/types";

export interface CrystalAward {
  skillId: string;
  amount: number;
  id: number;
}

const EMPTY_ASSESSMENT_MAP: Record<string, AssessmentData> = {};

// One collection listener per user for the whole session.
const assessmentStore = createLiveStore<Record<string, AssessmentData>>();

export function useAssessments() {
  const { assessments: repository } = useServices();
  const { uid, loading: authLoading } = useFirebaseAuth();
  const toast = useToast();
  const showToast = toast.show;
  const [lastAwarded, setLastAwarded] = useState<CrystalAward | null>(null);
  const mapRef = useRef<Record<string, AssessmentData>>(EMPTY_ASSESSMENT_MAP);

  const start = useMemo(
    () =>
      uid
        ? (observer: Observer<Record<string, AssessmentData>>) =>
            repository.subscribe(uid, observer)
        : null,
    [uid, repository],
  );

  const snapshot = useLiveStore(assessmentStore, uid, start);
  const assessmentMap = snapshot.data ?? EMPTY_ASSESSMENT_MAP;

  useEffect(() => {
    if (snapshot.data) mapRef.current = snapshot.data;
  }, [snapshot.data]);

  useEffect(() => {
    const error = snapshot.error;
    if (!error) return;
    console.error("Error listening to assessments:", error);
    if (isPermissionDenied(error)) {
      showToast("Для отслеживания прогресса обратитесь к администратору.");
    }
    if (isQuotaExceeded(error)) {
      showToast("Квота Firestore исчерпана. Повторите позже.");
    }
  }, [snapshot.error, showToast]);

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
        // Optimistic update: the listener confirms it a moment later.
        assessmentStore.set(uid, nextMap);

        const totalScore = calcTotalScore(nextMap);
        const progressRef = doc(db, ...userProgressPath(uid));
        await setDoc(progressRef, { totalScore }, { merge: true });

        void checkAchievements(uid, nextMap).catch((error) => {
          console.error("Error syncing achievements:", error);
          if (isPermissionDenied(error)) {
            showToast("Для отслеживания прогресса обратитесь к администратору.");
          }
        });

        if (awarded > 0) {
          setLastAwarded({ skillId, amount: awarded, id: Date.now() });
        }

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

        return { justCompleted };
      } catch (error) {
        console.error("Error saving assessment:", error);
        if (isPermissionDenied(error)) {
          showToast("Для отслеживания прогресса обратитесь к администратору.");
        }
        return null;
      }
    },
    [uid, showToast],
  );

  const signedOut = !authLoading && !uid;
  const loading = signedOut ? false : authLoading || snapshot.loading;

  return {
    assessmentMap: signedOut ? EMPTY_ASSESSMENT_MAP : assessmentMap,
    loading,
    toggleSubtopic,
    lastAwarded,
  };
}
