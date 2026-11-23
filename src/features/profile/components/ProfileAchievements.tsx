"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { AchievementDef } from "@/data/achievements";
import TierIcon from "@/features/achievements/components/TierIcon";
import type { Achievement } from "@/types";
import AchievementCard from "@/features/achievements/components/AchievementCard";
import { getAchievementProgress } from "@/core/domain/achievement-conditions";

interface ProfileAchievementsProps {
  catalog: AchievementDef[];
  earnedIds: string[];
  achievements: Achievement[];
  assessmentMap: Record<string, { subtopics?: Record<string, boolean> }>;
  longestStreak: number;
  projectMap: Record<string, boolean>;
  /** Show only the most recent badges (page bento); omit to show all. */
  limit?: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProfileAchievements({
  catalog,
  earnedIds,
  achievements,
  assessmentMap,
  longestStreak,
  projectMap,
  limit,
}: ProfileAchievementsProps) {
  const earned = new Set(earnedIds);
  const earnedDefs = catalog
    .filter((def) => earned.has(def.id))
    .sort((a, b) => {
      const aTime =
        achievements.find((item) => a.matches(item))?.achievedAt?.getTime() ?? 0;
      const bTime =
        achievements.find((item) => b.matches(item))?.achievedAt?.getTime() ?? 0;
      return bTime - aTime;
    })
    .slice(0, limit ?? undefined);

  return (
    <section className="card-surface flex h-full flex-col rounded-lg p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-mono text-sm font-semibold text-slate-300">
          <span className="text-slate-600">##</span> Достижения{" "}
          <span className="text-slate-500">
            [{earned.size}/{catalog.length}]
          </span>
        </h2>
        <Link
          href="/achievements"
          className="font-mono text-xs text-blue-600 underline-offset-4 hover:underline"
        >
          все достижения →
        </Link>
      </div>
      {earnedDefs.length === 0 ? (
        <p className="font-mono text-xs text-slate-500">
          Открытых достижений пока нет.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {earnedDefs.map((def, index) => {
            const achievement = achievements.find((a) => def.matches(a));
            const status = getAchievementProgress(def, {
              assessmentMap,
              streakDays: longestStreak,
              projectMap,
            });
            const tierIcon = status.tier ? (
              <TierIcon tier={status.tier} className="h-7 w-7" />
            ) : (
              def.icon
            );
            return (
              <motion.li
                key={def.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -20px 0px" }}
                transition={{ duration: 0.3, delay: (index % 8) * 0.03, ease: EASE }}
              >
                <AchievementCard
                  title={def.title}
                  icon={tierIcon}
                  condition={def.condition}
                  achievedAt={achievement?.achievedAt ?? null}
                  tier={status.tier}
                  tierProgress={status.tierProgress}
                />
              </motion.li>
            );
          })}
        </ul>
      )}
      {limit && earned.size > earnedDefs.length ? (
        <p className="mt-3 font-mono text-xs text-slate-500">
          ещё {earned.size - earnedDefs.length} — на странице достижений
        </p>
      ) : null}
    </section>
  );
}
