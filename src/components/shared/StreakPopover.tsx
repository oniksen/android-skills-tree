"use client";

import { useStreak } from "@/hooks";
import { parseDayString } from "@/lib/streak";

const DAYS_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export default function StreakPopover({ onClose }: { onClose: () => void }) {
  const { week, currentStreak, longestStreak } = useStreak();

  return (
    <div
      className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl z-50"
      role="dialog"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <div>
            <div className="text-xl font-bold text-white leading-none">{currentStreak}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wide pt-1">
              дней подряд
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-300 transition-colors"
          aria-label="Закрыть"
        >
          ✕
        </button>
      </div>

      <div className="flex justify-between gap-1 mb-3">
        {week.map((d) => (
          <div key={d.date} className="flex flex-col items-center gap-1 flex-1">
            <span
              className={`text-[9px] uppercase ${d.isToday ? "text-orange-400" : "text-slate-600"}`}
            >
              {DAYS_SHORT[parseDayString(d.date).getDay()]}
            </span>
            <div
              className={`w-full h-9 rounded-lg flex items-center justify-center text-xs border ${
                d.active
                  ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
                  : d.isToday
                    ? "bg-slate-800 text-slate-500 border-orange-500/40"
                    : "bg-slate-800 text-slate-700 border-slate-800"
              }`}
            >
              {d.active ? "🔥" : parseDayString(d.date).getDate()}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-xs border-t border-slate-800 pt-2">
        <span className="text-slate-500">Рекорд</span>
        <span className="text-white font-medium">
          {longestStreak}🔥
        </span>
      </div>
    </div>
  );
}