import { skills } from "@/data/skills";

export function calcSkillScore(
  skillId: string,
  subtopics: Record<string, boolean> | undefined,
): number {
  const skill = skills.find((s) => s.id === skillId);
  if (!skill || skill.subtopics.length === 0 || !subtopics) return 0;
  const completed = skill.subtopics.filter((st) => subtopics[st]).length;
  return Math.round((completed / skill.subtopics.length) * skill.maxWeight);
}

export function calcCategoryScore(
  catSkills: { id: string; subtopics: string[]; maxWeight: number }[],
  assessmentMap: Record<string, { subtopics?: Record<string, boolean> }>,
): number {
  return catSkills.reduce((sum, s) => {
    return sum + calcSkillScore(s.id, assessmentMap[s.id]?.subtopics);
  }, 0);
}
