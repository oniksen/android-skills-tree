import { levels } from "./levels";
import { categories } from "./categories";

export const STREAK_ACHIEVEMENT_DAYS = [7, 30, 60, 100];

export interface AchievementLike {
  type: string;
  metadata: Record<string, unknown>;
}

export interface AchievementDef {
  id: string;
  type: string;
  title: string;
  icon: string;
  condition: string;
  levelId?: string;
  fromLevelId?: string;
  toLevelId?: string;
  matches: (achievement: AchievementLike) => boolean;
}

export function getAchievementCatalog(): AchievementDef[] {
  const defs: AchievementDef[] = [];

  levels.forEach((level) => {
    defs.push({
      id: `level-master:${level.id}`,
      type: "level_master",
      title: `Прогресс грейда: ${level.name}`,
      icon: "🏆",
      condition: `Освоение навыков уровня "${level.name}" по тирам`,
      levelId: level.id,
      matches: (a) =>
        a.type === "level_master" && a.metadata?.level_id === level.id,
    });

    defs.push({
      id: `grade-complete:${level.id}`,
      type: "grade_complete",
      title: `Полный грейд: ${level.name}`,
      icon: "💠",
      condition: `Все навыки уровня "${level.name}" на 100%`,
      levelId: level.id,
      matches: (a) =>
        a.type === "grade_complete" && a.metadata?.level_id === level.id,
    });
  });

  for (let i = 0; i < levels.length - 1; i += 1) {
    const from = levels[i];
    const to = levels[i + 1];
    defs.push({
      id: `level-up:${from.id}-${to.id}`,
      type: "level_up",
      title: `Переход на ${to.name}`,
      icon: "🚀",
      condition: `Обязательные навыки уровня "${from.name}" на 100% и проекты`,
      fromLevelId: from.id,
      toLevelId: to.id,
      matches: (a) =>
        a.type === "level_up" &&
        a.metadata?.from_level === from.name &&
        a.metadata?.to_level === to.name,
    });
  }

  defs.push({
    id: "path-complete",
    type: "path_complete",
    title: "Путь пройден",
    icon: "🌟",
    condition: "Все уровни пройдены на 100%",
    matches: (a) => a.type === "path_complete",
  });

  categories.forEach((cat) => {
    defs.push({
      id: `category-perfect:${cat.id}`,
      type: "category_perfect",
      title: cat.name,
      icon: "⭐",
      condition: "Все скиллы раздела на 100%",
      matches: (a) =>
        a.type === "category_perfect" && a.metadata?.category_id === cat.id,
    });
  });

  STREAK_ACHIEVEMENT_DAYS.forEach((days) => {
    defs.push({
      id: `streak:${days}`,
      type: `streak_${days}`,
      title: `Стрик ${days} дней`,
      icon: days >= 100 ? "🌋" : "🔥",
      condition: `Занимайся ${days} дней подряд`,
      matches: (a) => a.type === `streak_${days}`,
    });
  });

  return defs;
}
export { ACHIEVEMENT_TIERS, ACHIEVEMENT_TIER_ICONS, getAchievementTier, getTierProgress } from "@/core/domain/achievement-tiers";
