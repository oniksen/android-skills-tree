"use client";

import { useCallback, useState } from "react";
import { getSkillById } from "@/data";
import { calcSkillCompletionPercent } from "@/core/domain/scoring";
import { useAssessments } from "./useAssessments";
import type { LevelUpResult } from "@/adapters/firestore-admin/progress";

export function useSkillDetail(skillId: string) {
  const { assessmentMap, toggleSubtopic, lastAwarded } = useAssessments();
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
      if (!result) return;
      if (result.levelUp) setLevelUp(result.levelUp);
    },
    [skillId, toggleSubtopic],
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
