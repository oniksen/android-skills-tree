"use client";

import { motion } from "motion/react";
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

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AchievementsClient() {
  const { achievements, loading } = useAchievements();
  const { currentStreak } = useStreak();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-blue-400" />
          Загрузка...
        </div>
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
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-white">Достижения</h1>
        <p className="mt-1 text-slate-400">
          Получено {earnedIds.size} из {catalog.length}
        </p>
      </motion.div>
      {GROUPS.map((group) => {
        const items = catalog.filter((def) => groupKeyOf(def) === group.key);
        if (items.length === 0) return null;

        return (
          <div key={group.key}>
            <h2 className="text-xl font-semibold text-slate-200 mb-4">
              {group.label}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((def, index) => {
                const earned = earnedIds.has(def.id);
                const achievement = achievements.find((a) => def.matches(a));
                return (
                  <motion.div
                    key={def.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                    transition={{ duration: 0.4, delay: (index % 4) * 0.06, ease: EASE }}
                  >
                    <AchievementCard
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
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}