"use client";

import { motion } from "motion/react";
import { useAchievements, useStreak } from "@/hooks";
import { useAssessments } from "@/hooks/useAssessments";
import AchievementCard from "@/features/achievements/components/AchievementCard";
import { AchievementsSkeleton } from "@/shared/ui/skeletons";
import {
  getAchievementCatalog,
  ACHIEVEMENT_TIER_ICONS,
  type AchievementDef,
} from "@/data/achievements";
import { getAchievementProgress } from "@/core/domain/achievement-conditions";

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
  const { assessmentMap, loading: assessmentsLoading } = useAssessments();

  if (loading || assessmentsLoading) {
    return <AchievementsSkeleton />;
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
        <h1 className="text-2xl font-bold tracking-tight text-white">
          <span className="text-blue-600">#</span> Достижения
        </h1>
        <p className="mt-1 font-mono text-sm text-slate-400">
          [{earnedIds.size}/{catalog.length}]
        </p>
      </motion.div>
      {GROUPS.map((group) => {
        const items = catalog.filter((def) => groupKeyOf(def) === group.key);
        if (items.length === 0) return null;

        return (
          <div key={group.key}>
            <h2 className="mb-4 font-mono text-lg font-semibold text-slate-300">
              <span className="text-slate-600">##</span> {group.label}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {items.map((def, index) => {
                const earned = earnedIds.has(def.id);
                const achievement = achievements.find((a) => def.matches(a));
                const status = getAchievementProgress(def, { assessmentMap, streakDays: currentStreak });
                const tierIcon = status.tier ? ACHIEVEMENT_TIER_ICONS[status.tier] : def.icon;
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
                      icon={earned ? tierIcon : def.icon}
                      condition={def.condition}
                      achievedAt={achievement?.achievedAt ?? null}
                      tier={status.tier}
                      tierProgress={status.tierProgress}
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