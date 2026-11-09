import { isSkillComplete } from "@/core/domain/scoring";
import { getCrystalRewardForSkill } from "@/core/domain/currency";

export interface AssessmentToggleInput {
  skillId: string;
  subtopicName: string;
  storedSubtopics: Record<string, boolean>;
  claimedSkills: Record<string, string>;
}

export interface AssessmentToggleResult {
  nextSubtopics: Record<string, boolean>;
  nextValue: boolean;
  complete: boolean;
  justCompleted: boolean;
  completionChanged: boolean;
  awarded: number;
}

export function computeAssessmentToggle(
  input: AssessmentToggleInput,
): AssessmentToggleResult {
  const { skillId, subtopicName, storedSubtopics, claimedSkills } = input;

  const nextSubtopics = {
    ...storedSubtopics,
    [subtopicName]: !storedSubtopics[subtopicName],
  };
  const nextValue = nextSubtopics[subtopicName] === true;
  const complete = isSkillComplete(skillId, nextSubtopics);
  const wasComplete = isSkillComplete(skillId, storedSubtopics);
  const alreadyClaimed = typeof claimedSkills[skillId] === "string";
  const awarded =
    complete && !alreadyClaimed ? getCrystalRewardForSkill(skillId) : 0;
  const justCompleted = complete && !wasComplete;
  const completionChanged = complete !== wasComplete;

  return { nextSubtopics, nextValue, complete, justCompleted, completionChanged, awarded };
}
