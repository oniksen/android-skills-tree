"use client";

const achievementConfig: Record<string, { title: string; icon: string }> = {
  level_master: { title: "Мастер уровня", icon: "🏆" },
  path_complete: { title: "Путь пройден", icon: "🌟" },
  category_perfect: { title: "Идеальная тема", icon: "⭐" },
  streak_7: { title: "Стрик 7 дней", icon: "🔥" },
  streak_30: { title: "Стрик 30 дней", icon: "🔥" },
  streak_60: { title: "Стрик 60 дней", icon: "🔥" },
  streak_100: { title: "Стрик 100 дней", icon: "🌋" },
};

export default function AchievementCard({
  type,
  metadata,
  achieved_at,
}: {
  type: string;
  metadata: Record<string, string> | null;
  achieved_at: string | Date;
}) {
  const config = achievementConfig[type] ?? { title: type, icon: "🎖️" };
  const subtitle = metadata?.level_name ?? metadata?.category_name ?? null;

  const date = new Date(achieved_at);
  const formattedDate = date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
      <span className="text-4xl">{config.icon}</span>
      <div>
        <h3 className="font-semibold text-white">{config.title}</h3>
        {subtitle && (
          <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
        )}
        <p className="text-xs text-slate-500 mt-1">{formattedDate}</p>
      </div>
    </div>
  );
}
