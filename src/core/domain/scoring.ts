import { skills } from "@/data/skills";
import { categories } from "@/data/categories";
import { getSkillWeight } from "@/core/domain/weights";

export function calcSkillScore(
  skillId: string,
  subtopics: Record<string, boolean> | undefined,
): number {
  const skill = skills.find((s) => s.id === skillId);
  if (!skill || skill.subtopics.length === 0 || !subtopics) return 0;
  const completed = skill.subtopics.filter((st) => subtopics[st]).length;
  return Math.round((completed / skill.subtopics.length) * getSkillWeight(skillId));
}

export function calcSkillCompletionPercent(
  skillId: string,
  subtopics: Record<string, boolean> | undefined,
): number {
  const skill = skills.find((s) => s.id === skillId);
  if (!skill || skill.subtopics.length === 0) return 0;
  const completed = skill.subtopics.filter((st) => subtopics?.[st]).length;
  return Math.round((completed / skill.subtopics.length) * 100);
}

export function isSkillComplete(
  skillId: string,
  subtopics: Record<string, boolean> | undefined,
): boolean {
  const skill = skills.find((s) => s.id === skillId);
  if (!skill || skill.subtopics.length === 0 || !subtopics) return false;
  return skill.subtopics.every((st) => subtopics[st] === true);
}

export function calcCategoryScore(
  categoryId: string,
  assessmentMap: Record<string, { subtopics?: Record<string, boolean> }>,
): number {
  return skills
    .filter((s) => s.categoryId === categoryId)
    .reduce(
      (sum, s) => sum + calcSkillScore(s.id, assessmentMap[s.id]?.subtopics),
      0,
    );
}

export function calcTotalScore(
  assessmentMap: Record<string, { subtopics?: Record<string, boolean> }>,
): number {
  return skills.reduce(
    (sum, s) => sum + calcSkillScore(s.id, assessmentMap[s.id]?.subtopics),
    0,
  );
}

export function calcLevelScore(
  levelId: string,
  assessmentMap: Record<string, { subtopics?: Record<string, boolean> }>,
): number {
  return categories
    .filter((c) => c.levelId === levelId)
    .reduce((sum, c) => sum + calcCategoryScore(c.id, assessmentMap), 0);
}


export function calcCategoryCompletionPercent(
  categoryId: string,
  assessmentMap: Record<string, { subtopics?: Record<string, boolean> }>,
): number {
  const categorySkills = skills.filter((s) => s.categoryId === categoryId);
  const total = categorySkills.reduce((sum, s) => sum + s.subtopics.length, 0);
  if (total === 0) return 0;

  const completed = categorySkills.reduce((sum, s) => {
    const subtopics = assessmentMap[s.id]?.subtopics;
    return sum + s.subtopics.filter((st) => subtopics?.[st] === true).length;
  }, 0);

  return Math.round((completed / total) * 100);
}

export function calcLevelCompletionPercent(
  levelId: string,
  assessmentMap: Record<string, { subtopics?: Record<string, boolean> }>,
): number {
  const levelCategories = categories.filter((c) => c.levelId === levelId);
  const total = levelCategories.reduce(
    (sum, c) =>
      sum +
      skills
        .filter((s) => s.categoryId === c.id)
        .reduce((skillSum, s) => skillSum + s.subtopics.length, 0),
    0,
  );
  if (total === 0) return 0;

  const completed = levelCategories.reduce(
    (sum, c) =>
      sum +
      skills
        .filter((s) => s.categoryId === c.id)
        .reduce((skillSum, s) => {
          const subtopics = assessmentMap[s.id]?.subtopics;
          return skillSum + s.subtopics.filter((st) => subtopics?.[st] === true).length;
        }, 0),
    0,
  );

  return Math.round((completed / total) * 100);
}

export function calcTotalCompletionPercent(
  assessmentMap: Record<string, { subtopics?: Record<string, boolean> }>,
): number {
  const total = skills.reduce((sum, s) => sum + s.subtopics.length, 0);
  if (total === 0) return 0;

  const completed = skills.reduce((sum, s) => {
    const subtopics = assessmentMap[s.id]?.subtopics;
    return sum + s.subtopics.filter((st) => subtopics?.[st] === true).length;
  }, 0);

  return Math.round((completed / total) * 100);
}
