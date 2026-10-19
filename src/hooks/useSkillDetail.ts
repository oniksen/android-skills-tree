"use client";

import { useCallback, useState } from "react";
import { getSkillById } from "@/data";
import { checkLevelUp as checkLevelUpAction } from "@/lib/firestore-actions";
import { calcSkillCompletionPercent } from "@/core/domain/scoring";
import { useAssessments } from "./useAssessments";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";

export interface LevelUpResult {
  fromLevel: string;
  toLevel: string;
  score: number;
}

export function useSkillDetail(skillId: string) {
  const { assessmentMap, toggleSubtopic, lastAwarded } = useAssessments();
  const toast = useToast();
  const [levelUp, setLevelUp] = useState<LevelUpResult | null>(null);

  const skill = getSkillById(skillId);
  const subtopics = skill?.subtopics ?? [];
  const subtopicState = assessmentMap[skillId]?.subtopics ?? {};
  const award = lastAwarded?.skillId === skillId ? lastAwarded : null;
  const subtopicPercent = calcSkillCompletionPercent(skillId, subtopicState);
  const completedCount = subtopics.filter((st) => subtopicState[st]).length;

  const toggle = useCallback(
    async (subtopicName: string) => {
      const result = await toggleSubtopic(skillId, subtopicName);
      if (!result?.justCompleted) return;

      try {
        const levelResult = await checkLevelUpAction();
        if (levelResult) setLevelUp(levelResult);
      } catch (error) {
        if (isPermissionDenied(error)) {
          toast.show("Для отслеживания прогресса обратитесь к администратору.");
        }
      }
    },
    [skillId, toggleSubtopic, toast],
  );

  const clearLevelUp = useCallback(() => setLevelUp(null), []);

  return {
    subtopics,
    subtopicState,
    subtopicPercent,
    completedCount,
    award,
    toggle,
    levelUp,
    clearLevelUp,
  };
}
