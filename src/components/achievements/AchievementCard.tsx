"use client";

interface AchievementCardProps {
  title: string;
  icon: string;
  condition: string;
  achievedAt: Date | null;
  hint?: string;
}

export default function AchievementCard({
  title,
  icon,
  condition,
  achievedAt,
  hint,
}: AchievementCardProps) {
  const earned = achievedAt !== null;

  const formattedDate = earned
    ? achievedAt!.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div
      className={`border rounded-xl p-5 flex items-center gap-4 transition-colors ${
        earned
          ? "bg-slate-900 border-slate-800"
          : "bg-slate-900/40 border-slate-800/60"
      }`}
    >
      <span
        className={`text-4xl ${
          earned ? "" : "opacity-30 grayscale"
        }`}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <h3
          className={`font-semibold ${
            earned ? "text-white" : "text-slate-500"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-sm mt-0.5 truncate ${
            earned ? "text-slate-400" : "text-slate-600"
          }`}
          title={condition}
        >
          {condition}
        </p>
        {earned ? (
          <p className="text-xs text-slate-500 mt-1">{formattedDate}</p>
        ) : (
          <p className="text-xs text-slate-600 mt-1">
            🔒 Не получено{hint ? ` · ${hint}` : ""}
          </p>
        )}
      </div>
    </div>
  );
}