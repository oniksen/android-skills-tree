"use client";

import { useEffect, useRef, useState } from "react";
import { useAchievements } from "@/hooks/useAchievements";
import { useAssessments } from "@/hooks/useAssessments";
import { useProjectProgress } from "@/hooks/useProjectProgress";
import { useStreak } from "@/hooks/useStreak";
import { getAchievementCatalog } from "@/data/achievements";
import { getAchievementProgress } from "@/core/domain/achievement-conditions";
import {
  detectNewAchievementIds,
  getConfettiCount,
} from "@/features/achievements/lib/celebration-utils";
import AchievementCelebration, {
  type CelebrationItem,
} from "@/features/achievements/components/AchievementCelebration";

export default function AchievementUnlockWatcher() {
  const { achievements, loading: achievementsLoading } = useAchievements();
  const { assessmentMap } = useAssessments();
  const { projectMap } = useProjectProgress();
  const { longestStreak } = useStreak();

  const [queue, setQueue] = useState<CelebrationItem[]>([]);
  const [current, setCurrent] = useState<CelebrationItem | null>(null);

  const knownIdsRef = useRef<Set<string> | null>(null);
  const latestRef = useRef({ assessmentMap, longestStreak, projectMap });

  useEffect(() => {
    latestRef.current = { assessmentMap, longestStreak, projectMap };
  }, [assessmentMap, longestStreak, projectMap]);

  useEffect(() => {
    if (achievementsLoading) return;

    const ids = new Set(achievements.map((achievement) => achievement.id));
    const added = detectNewAchievementIds(knownIdsRef.current, ids);

    if (knownIdsRef.current === null) {
      knownIdsRef.current = ids;
      return;
    }

    if (added.length > 0) {
      const catalog = getAchievementCatalog();
      const items: CelebrationItem[] = added.map((id) => {
        const achievement = achievements.find((item) => item.id === id);
        const def = achievement
          ? catalog.find((candidate) => candidate.matches(achievement))
          : undefined;

        const status = def
          ? getAchievementProgress(def, {
              assessmentMap: latestRef.current.assessmentMap,
              streakDays: latestRef.current.longestStreak,
              projectMap: latestRef.current.projectMap,
            })
          : { tier: achievement?.tier ?? null };

        const tier = status.tier ?? achievement?.tier ?? null;

        return {
          id,
          title: def?.title ?? "Достижение",
          tier,
          count: getConfettiCount(tier),
        };
      });

      setQueue((previous) => [...previous, ...items]);
    }

    knownIdsRef.current = ids;
  }, [achievements, achievementsLoading]);

  useEffect(() => {
    if (current || queue.length === 0) return;
    const timer = window.setTimeout(() => {
      setCurrent(queue[0]);
      setQueue((previous) => previous.slice(1));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [current, queue]);

  if (!current) return null;

  return (
    <AchievementCelebration item={current} onDone={() => setCurrent(null)} />
  );
}
