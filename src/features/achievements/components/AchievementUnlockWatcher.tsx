"use client";

import { useEffect, useRef, useState } from "react";
import { useAchievements } from "@/hooks/useAchievements";
import { useAssessments } from "@/hooks/useAssessments";
import { useStreak } from "@/hooks/useStreak";
import { getAchievementCatalog } from "@/data/achievements";
import { getAchievementProgress } from "@/core/domain/achievement-conditions";
import { ACHIEVEMENT_TIERS } from "@/core/domain/achievement-tiers";
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
  const { longestStreak } = useStreak();

  const [queue, setQueue] = useState<CelebrationItem[]>([]);
  const [current, setCurrent] = useState<CelebrationItem | null>(null);
  const [debugEnabled] = useState(() => {
    if (typeof window === "undefined") {
      return process.env.NODE_ENV !== "production";
    }
    const params = new URLSearchParams(window.location.search);
    return (
      process.env.NODE_ENV !== "production" ||
      params.get("debug") === "confetti"
    );
  });

  const knownIdsRef = useRef<Set<string> | null>(null);
  const latestRef = useRef({ assessmentMap, longestStreak });

  useEffect(() => {
    latestRef.current = { assessmentMap, longestStreak };
  }, [assessmentMap, longestStreak]);

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

  function testRandom(): void {
    const catalog = getAchievementCatalog();
    if (catalog.length === 0) return;
    const def = catalog[Math.floor(Math.random() * catalog.length)];
    const tier =
      ACHIEVEMENT_TIERS[Math.floor(Math.random() * ACHIEVEMENT_TIERS.length)]
        ?.name ?? null;

    setQueue((previous) => [
      ...previous,
      {
        id: `debug-${Date.now()}`,
        title: def.title,
        tier,
        count: getConfettiCount(tier),
      },
    ]);
  }

  function testAllTiers(): void {
    ACHIEVEMENT_TIERS.forEach((tier, index) => {
      window.setTimeout(() => {
        setQueue((previous) => [
          ...previous,
          {
            id: `debug-all-${index}-${Date.now()}`,
            title: tier.name,
            tier: tier.name,
            count: getConfettiCount(tier.name),
          },
        ]);
      }, index * 3800);
    });
  }

  return (
    <>
      {current && (
        <AchievementCelebration item={current} onDone={() => setCurrent(null)} />
      )}
      {debugEnabled && (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={testRandom}
            className="rounded-md border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-white cursor-pointer"
          >
            Тест конфети (random)
          </button>
          <button
            type="button"
            onClick={testAllTiers}
            className="rounded-md border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-white cursor-pointer"
          >
            Все тиры
          </button>
        </div>
      )}
    </>
  );
}
