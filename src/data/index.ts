export { levels, getLevelBySlug, getLevelById } from "./levels";
export type { Level } from "./levels";

export { categories, getCategoriesByLevelId, getCategoryById } from "./categories";
export type { Category } from "./categories";

export { skills, getSkillsByCategoryId, getSkillById, getSkillsByLevelId } from "./skills";
export type { Skill } from "./skills";

export { projects, getProjectsByLevelId, getProjectById } from "./projects";
export type { Project } from "./projects";

import { levels } from "./levels";
import { categories } from "./categories";
import { skills } from "./skills";
import { projects } from "./projects";

export function getLevelWithDetails(slug: string) {
  const level = levels.find((l) => l.slug === slug);
  if (!level) return null;

  const levelCategories = categories
    .filter((c) => c.levelId === level.id)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((cat) => ({
      ...cat,
      skills: skills
        .filter((s) => s.categoryId === cat.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }));

  const levelProjects = projects
    .filter((p) => p.levelId === level.id)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    ...level,
    categories: levelCategories,
    projects: levelProjects,
  };
}
