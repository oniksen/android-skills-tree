// Mirrors the write-path gate in checkLevelUp (src/lib/firestore-actions.ts):
// same category threshold, XP target, required-skill and project checks. Both
// implementations must change together; firestore-actions-levelup.test.ts
// cross-checks them so the checklist cannot drift from the actual level-up.
import { levels, type Level } from "@/data/levels";
import { getSkillsByLevelId } from "@/data/skills";
import type { AssessmentData } from "@/types";
import { isSkillComplete } from "./scoring";

export interface LevelRequirement {
  id: "categories" | "xp" | "skills" | "projects";
  label: string;
  done: boolean;
  current?: number;
  target?: number;
}

export function getNextLevel(currentLevelId: string): Level | null {
  const index = levels.findIndex((level) => level.id === currentLevelId);
  if (index === -1 || index >= levels.length - 1) return null;
  return levels[index + 1];
}

export function getLevelUpRequirements(params: {
  currentLevelId: string;
  nextLevel: Level | null;
  assessmentMap: Record<string, AssessmentData>;
  projectMap: Record<string, boolean>;
}): LevelRequirement[] {
  const { currentLevelId, nextLevel, assessmentMap, projectMap } = params;

  if (!nextLevel) return [];

  const requirements: LevelRequirement[] = [];

  const requiredSkills = getSkillsByLevelId(currentLevelId).filter(
    (skill) => skill.requiredForLevelUp,
  );

  if (requiredSkills.length > 0) {
    const passedSkills = requiredSkills.filter((skill) =>
      isSkillComplete(skill.id, assessmentMap[skill.id]?.subtopics),
    ).length;

    requirements.push({
      id: "skills",
      label: "Обязательные навыки текущего грейда",
      done: passedSkills === requiredSkills.length,
      current: passedSkills,
      target: requiredSkills.length,
    });
  }

  const projectTarget = nextLevel.requiredProjectCount;

  if (projectTarget > 0) {
    const completedProjects = Object.values(projectMap).filter(Boolean).length;

    requirements.push({
      id: "projects",
      label: "Проекты",
      done: completedProjects >= projectTarget,
      current: completedProjects,
      target: projectTarget,
    });
  }

  return requirements;
}
