"use client";

import { useAchievements } from "@/hooks";
import AchievementCard from "@/components/achievements/AchievementCard";

export default function AchievementsClient() {
  const { achievements, loading } = useAchievements();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Достижения</h1>
      {achievements.length === 0 ? (
        <p className="text-slate-400">Пока нет достижений</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {achievements.map((a) => (
            <AchievementCard
              key={a.id}
              type={a.type}
              metadata={a.metadata as Record<string, string> | null}
              achieved_at={a.achievedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
