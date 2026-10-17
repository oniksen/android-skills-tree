"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useServices } from "@/composition/services-context";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { toggleSubtopicAction } from "@/features/progress/actions";
import type { AssessmentData } from "@/types";
import type { ToggleSubtopicResult } from "@/adapters/firestore-admin/assessment";

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
    async (
      skillId: string,
      subtopicName: string,
    ): Promise<ToggleSubtopicResult | null> => {
      if (!uid) return null;

      try {
        const result = await toggleSubtopicAction(skillId, subtopicName);

        if (result.awarded > 0) {
          setLastAwarded({ skillId, amount: result.awarded, id: Date.now() });
        }

        return result;
      } catch (error) {
        console.error("Error saving assessment:", error);
        return null;
      }
    },
    [uid],
  );

  const signedOut = !authLoading && !uid;

  return {
    assessmentMap: signedOut ? EMPTY_ASSESSMENT_MAP : assessmentMap,
    loading: signedOut ? false : loading,
    toggleSubtopic,
    lastAwarded,
  };
}
