import { categories } from "../categories";

import { juniorSkills } from "./junior";
import { middleSkills } from "./middle";
import { strongMiddleSkills } from "./strong-middle";
import { seniorSkills } from "./senior";

import type { Skill } from "./types";

export type { Skill, Difficulty } from "./types";

export const skills: Skill[] = [
  ...juniorSkills,
  ...middleSkills,
  ...strongMiddleSkills,
  ...seniorSkills,
];

export function getSkillsByCategoryId(categoryId: string): Skill[] {
  return skills.filter((s) => s.categoryId === categoryId).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getSkillById(id: string): Skill | undefined {
  return skills.find((s) => s.id === id);
}

export function getSkillsByLevelId(levelId: string): Skill[] {
  const levelCategoryIds = categories
    .filter((c) => c.levelId === levelId)
    .map((c) => c.id);
  return skills.filter((s) => levelCategoryIds.includes(s.categoryId));
}
