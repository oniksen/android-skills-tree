import { levels } from "@/data/levels";
import { categories } from "@/data/categories";
import { skills } from "@/data/skills";
import { calcCategoryScore, calcTotalScore, isSkillComplete } from "@/lib/scoring";
import { getCategoryMaxScore } from "@/lib/weights";

export type AssessmentMap = Record<string, { subtopics?: Record<string, boolean> }>;

export interface AchievementAward {
  type: string;
  metadata: Record<string, unknown>;
  matchKey?: string;
  matchValue?: unknown;
}

// Типы без записи здесь дедуплицируются только по type.
export const ACHIEVEMENT_MATCH_KEY: Record<string, string | undefined> = {
  category_perfect: "category_id",
  level_master: "level_id",
};

export function achievementKey(
  type: string,
  metadata: Record<string, unknown> | undefined,
): string {
  const matchKey = ACHIEVEMENT_MATCH_KEY[type];
  if (!matchKey || !metadata) return type;
  const value = metadata[matchKey];
  return value === undefined ? type : `${type}::${String(value)}`;
}

export function isCategoryPerfect(
  categoryId: string,
  assessmentMap: AssessmentMap,
): boolean {
  const categorySkills = skills.filter((s) => s.categoryId === categoryId);
  if (categorySkills.length === 0) return false;

  return categorySkills.every((skill) =>
    isSkillComplete(skill.id, assessmentMap[skill.id]?.subtopics),
  );
}

export function isLevelMastered(
  levelId: string,
  assessmentMap: AssessmentMap,
): boolean {
  const levelCategories = categories.filter((c) => c.levelId === levelId);
  if (levelCategories.length === 0) return false;

  return levelCategories.every(
    (cat) => calcCategoryScore(cat.id, assessmentMap) >= getCategoryMaxScore(cat.id),
  );
}

export function evaluateAchievements(assessmentMap: AssessmentMap): AchievementAward[] {
  const awards: AchievementAward[] = [];

  for (const cat of categories) {
    if (!isCategoryPerfect(cat.id, assessmentMap)) continue;
    awards.push({
      type: "category_perfect",
      metadata: {
        category_id: cat.id,
        category_name: cat.name,
        level_id: cat.levelId,
      },
      matchKey: ACHIEVEMENT_MATCH_KEY.category_perfect,
      matchValue: cat.id,
    });
  }

  for (const level of levels) {
    if (!isLevelMastered(level.id, assessmentMap)) continue;
    awards.push({
      type: "level_master",
      metadata: {
        level_id: level.id,
        level_name: level.name,
        level_slug: level.slug,
      },
      matchKey: ACHIEVEMENT_MATCH_KEY.level_master,
      matchValue: level.id,
    });
  }

  const allLevelsMastered =
    levels.length > 0 && levels.every((l) => isLevelMastered(l.id, assessmentMap));
  if (allLevelsMastered) {
    awards.push({
      type: "path_complete",
      metadata: { total_score: calcTotalScore(assessmentMap) },
    });
  }

  return awards;
}

export function selectMissingAwards(
  awards: AchievementAward[],
  existingKeys: Iterable<string>,
): AchievementAward[] {
  const seen = new Set(existingKeys);
  const missing: AchievementAward[] = [];

  for (const award of awards) {
    const key = achievementKey(award.type, award.metadata);
    if (seen.has(key)) continue;
    seen.add(key);
    missing.push(award);
  }

  return missing;
}
