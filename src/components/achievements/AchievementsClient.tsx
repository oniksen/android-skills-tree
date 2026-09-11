"use client";

import { useAchievements, useStreak } from "@/hooks";
import AchievementCard from "@/components/achievements/AchievementCard";
import {
  getAchievementCatalog,
  type AchievementDef,
} from "@/data/achievements";

const GROUPS: { key: string; label: string }[] = [
  { key: "level_master", label: "Мастерство уровней" },
  { key: "level_up", label: "Повышение уровня" },
  { key: "category_perfect", label: "Идеальные темы" },
  { key: "streak", label: "Стрики" },
  { key: "path_complete", label: "Путь разработчика" },
];

function groupKeyOf(def: AchievementDef): string {
  return def.type.startsWith("streak") ? "streak" : def.type;
}

export default function AchievementsClient() {
  const { achievements, loading } = useAchievements();
  const { currentStreak } = useStreak();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Загрузка...</div>
      </div>
    );
  }

  const catalog = getAchievementCatalog();
  const earnedIds = new Set(
    catalog
      .filter((def) => achievements.some((a) => def.matches(a)))
      .map((def) => def.id),
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Достижения</h1>
      {GROUPS.map((group) => {
        const items = catalog.filter((def) => groupKeyOf(def) === group.key);
        if (items.length === 0) return null;

        return (
          <div key={group.key}>
            <h2 className="text-xl font-semibold text-slate-200 mb-4">
              {group.label}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((def) => {
                const earned = earnedIds.has(def.id);
                const achievement = achievements.find((a) => def.matches(a));
                return (
                  <AchievementCard
                    key={def.id}
                    title={def.title}
                    icon={def.icon}
                    condition={def.condition}
                    achievedAt={achievement?.achievedAt ?? null}
                    hint={
                      group.key === "streak" &&
                      !earned &&
                      currentStreak > 0
                        ? `Стрик сейчас: ${currentStreak}`
                        : undefined
                    }
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}