"use client";

import { motion } from "motion/react";
import { useAchievements, useStreak } from "@/hooks";
import { useAssessments } from "@/hooks/useAssessments";
import AchievementCard from "@/features/achievements/components/AchievementCard";
import TierIcon from "@/features/achievements/components/TierIcon";
import PageHero from "@/shared/ui/PageHero";
import PageSummaryCard from "@/shared/ui/PageSummaryCard";
import { AchievementsSkeleton } from "@/shared/ui/skeletons";
import {
  getAchievementCatalog,
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
  const { currentStreak, longestStreak } = useStreak();
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
        <PageHero
          title="Достижения"
          description="Награды за пройденные уровни, идеальные темы и серии дней."
          aside={
            <PageSummaryCard
              title="Открыто"
              value={`${earnedIds.size}/${catalog.length}`}
              valueLabel="достижений"
              progress={{ current: earnedIds.size, max: catalog.length || 1 }}
              stats={[
                { label: "Осталось", value: catalog.length - earnedIds.size },
              ]}
            />
          }
        />
      </motion.div>
      {GROUPS.map((group) => {
        const items = catalog.filter((def) => groupKeyOf(def) === group.key);
        if (items.length === 0) return null;

        return (
          <div key={group.key}>
            <h2 className="mb-4 font-mono text-lg font-semibold text-slate-300">
              <span className="text-slate-600">##</span> {group.label}
            </h2>
            <div className="content-grid">
              {items.map((def, index) => {
                const earned = earnedIds.has(def.id);
                const achievement = achievements.find((a) => def.matches(a));
                const status = getAchievementProgress(def, { assessmentMap, streakDays: longestStreak });
                const tierIcon = status.tier ? (
                  <TierIcon tier={status.tier} className="h-7 w-7" />
                ) : (
                  def.icon
                );
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