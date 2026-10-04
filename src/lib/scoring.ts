import { skills } from "@/data/skills";
import { categories } from "@/data/categories";
import { getSkillWeight } from "@/lib/weights";

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