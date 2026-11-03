import { levels } from "@/data/levels";
import { categories } from "@/data/categories";
import { skills } from "@/data/skills";
import { calcTotalScore, isSkillComplete, calcCategoryCompletionPercent, calcLevelCompletionPercent, calcTotalCompletionPercent } from "@/core/domain/scoring";
import { getLevelMinScore } from "@/core/domain/weights";
import { ACHIEVEMENT_TIERS, getAchievementTier, getTierProgress } from "@/core/domain/achievement-tiers";
import { STREAK_ACHIEVEMENT_DAYS } from "@/core/domain/streak";

export type AssessmentMap = Record<string, { subtopics?: Record<string, boolean> }>;

export const ACHIEVEMENT_UNLOCK_THRESHOLD = ACHIEVEMENT_TIERS[0].threshold;
export const PATH_COMPLETE_UNLOCK_THRESHOLD = ACHIEVEMENT_UNLOCK_THRESHOLD;

export interface AchievementContext {
  assessmentMap: AssessmentMap;
  longestStreak?: number;
  unlockedLevelIds?: string[];
}

export interface AchievementProgressContext {
  assessmentMap: AssessmentMap;
  streakDays?: number;
}

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
  level_up: "to_level",
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

export function evaluateAchievements(context: AchievementContext): AchievementAward[] {
  const { assessmentMap, longestStreak = 0, unlockedLevelIds = [] } = context;
  const awards: AchievementAward[] = [];

  for (const cat of categories) {
    const progress = calcCategoryCompletionPercent(cat.id, assessmentMap);
    if (progress < ACHIEVEMENT_UNLOCK_THRESHOLD) continue;
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
    const progress = calcLevelCompletionPercent(level.id, assessmentMap);
    if (progress < ACHIEVEMENT_UNLOCK_THRESHOLD) continue;
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

  const totalProgress = calcTotalCompletionPercent(assessmentMap);
  if (totalProgress >= PATH_COMPLETE_UNLOCK_THRESHOLD) {
    awards.push({ type: "path_complete", metadata: {} });
  }

  const unlocked = new Set(unlockedLevelIds);
  for (let i = 0; i < levels.length - 1; i += 1) {
    const from = levels[i];
    const to = levels[i + 1];
    if (!unlocked.has(to.id)) continue;
    awards.push({
      type: "level_up",
      metadata: { from_level: from.name, to_level: to.name },
      matchKey: ACHIEVEMENT_MATCH_KEY.level_up,
      matchValue: to.name,
    });
  }

  for (const days of STREAK_ACHIEVEMENT_DAYS) {
    if (longestStreak < days) continue;
    awards.push({ type: `streak_${days}`, metadata: { days } });
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
  def: { type: string; id: string; toLevelId?: string },
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
    const nextLevel = def.toLevelId
      ? levels.find((level) => level.id === def.toLevelId)
      : undefined;
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
