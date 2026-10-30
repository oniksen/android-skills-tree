import { levels } from "@/data/levels";
import { categories } from "@/data/categories";
import { skills } from "@/data/skills";
import { calcTotalScore, isSkillComplete, calcCategoryCompletionPercent, calcLevelCompletionPercent, calcTotalCompletionPercent } from "@/core/domain/scoring";
import { getLevelMinScore } from "@/core/domain/weights";
import { getAchievementTier, getTierProgress } from "@/core/domain/achievement-tiers";

export type AssessmentMap = Record<string, { subtopics?: Record<string, boolean> }>;

export interface AchievementProgressContext {
  assessmentMap: AssessmentMap;
  streakDays?: number;
}

export interface AchievementAward {
  type: string;
  metadata: Record<string, unknown>;
  matchKey?: string;
  matchValue?: unknown;
  tier?: string | null;
  tierProgress?: number;
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

  return levelCategories.every((cat) => isCategoryPerfect(cat.id, assessmentMap));
}

export function evaluateAchievements(assessmentMap: AssessmentMap): AchievementAward[] {
  const awards: AchievementAward[] = [];

  for (const cat of categories) {
    if (!isCategoryPerfect(cat.id, assessmentMap)) continue;
    const progress = calcCategoryCompletionPercent(cat.id, assessmentMap);
    awards.push({
      type: "category_perfect",
      metadata: {
        category_id: cat.id,
        category_name: cat.name,
        level_id: cat.levelId,
        tier: getAchievementTier(progress),
        tierProgress: getTierProgress(progress),
      },
      matchKey: ACHIEVEMENT_MATCH_KEY.category_perfect,
      matchValue: cat.id,
      tier: getAchievementTier(progress),
      tierProgress: getTierProgress(progress),
    });
  }

  const masteredLevelIds = new Set(
    levels.filter((level) => isLevelMastered(level.id, assessmentMap)).map((level) => level.id),
  );

  for (const level of levels) {
    if (!masteredLevelIds.has(level.id)) continue;
    const progress = calcLevelCompletionPercent(level.id, assessmentMap);
    awards.push({
      type: "level_master",
      metadata: {
        level_id: level.id,
        level_name: level.name,
        level_slug: level.slug,
        tier: getAchievementTier(progress),
        tierProgress: getTierProgress(progress),
      },
      matchKey: ACHIEVEMENT_MATCH_KEY.level_master,
      matchValue: level.id,
      tier: getAchievementTier(progress),
      tierProgress: getTierProgress(progress),
    });
  }

  const allLevelsMastered =
    levels.length > 0 && levels.every((level) => masteredLevelIds.has(level.id));
  if (allLevelsMastered) {
    const progress = calcTotalCompletionPercent(assessmentMap);
    awards.push({
      type: "path_complete",
      metadata: {
        total_score: calcTotalScore(assessmentMap),
        tier: getAchievementTier(progress),
        tierProgress: getTierProgress(progress),
      },
      tier: getAchievementTier(progress),
      tierProgress: getTierProgress(progress),
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


export function getAchievementProgress(
  def: { type: string; id: string },
  context: AchievementProgressContext,
): { progress: number; tier: string | null; tierProgress: number } {
  let progress = 0;

  if (def.type === "category_perfect") {
    const categoryId = def.id.split(":")[1];
    if (categoryId) progress = calcCategoryCompletionPercent(categoryId, context.assessmentMap);
  } else if (def.type === "level_master") {
    const levelId = def.id.split(":")[1];
    if (levelId) progress = calcLevelCompletionPercent(levelId, context.assessmentMap);
  } else if (def.type === "path_complete") {
    progress = calcTotalCompletionPercent(context.assessmentMap);
  } else if (def.type.startsWith("streak_")) {
    const days = Number(def.id.split(":")[1]);
    progress = days > 0 ? Math.min(((context.streakDays ?? 0) / days) * 100, 100) : 0;
  } else if (def.type === "level_up") {
    const toLevelId = def.id.split(":")[1]?.split("-")[1];
    const nextLevel = toLevelId ? levels.find((level) => level.id === toLevelId) : undefined;
    const threshold = nextLevel ? getLevelMinScore(nextLevel.id) : 0;
    const totalScore = calcTotalScore(context.assessmentMap);
    progress = threshold > 0 ? Math.min((totalScore / threshold) * 100, 100) : 100;
  }

  return {
    progress,
    tier: getAchievementTier(progress),
    tierProgress: getTierProgress(progress),
  };
}
