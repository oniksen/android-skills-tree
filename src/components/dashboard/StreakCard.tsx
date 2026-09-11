"use client";

import { useStreak } from "@/hooks";
import { parseDayString } from "@/lib/streak";

const DAYS_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

function pluralDays(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return "день";
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) return "дня";
  return "дней";
}

export default function StreakCard() {
  const { week, currentStreak, longestStreak } = useStreak();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Стрик</h2>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-4xl">🔥</span>
        <div>
          <div className="text-3xl font-bold text-white leading-none">
            {currentStreak} {pluralDays(currentStreak)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Рекорд: {longestStreak} {pluralDays(longestStreak)}
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-1">
        {week.map((d) => (
          <div key={d.date} className="flex flex-col items-center gap-1 flex-1">
            <span
              className={`text-[9px] uppercase ${d.isToday ? "text-orange-400" : "text-slate-600"}`}
            >
              {DAYS_SHORT[parseDayString(d.date).getDay()]}
            </span>
            <div
              className={`w-full h-10 rounded-lg flex items-center justify-center text-xs border ${
                d.active
                  ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
                  : d.isToday
                    ? "bg-slate-800 text-slate-500 border-orange-500/40"
                    : "bg-slate-800 text-slate-700 border-slate-800"
              }`}
            >
              {d.active ? "🔥" : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}