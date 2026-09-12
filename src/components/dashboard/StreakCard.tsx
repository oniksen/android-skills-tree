"use client";

import { motion } from "motion/react";
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
    <div className="group relative card-surface overflow-hidden rounded-xl p-6 transition-shadow duration-300 hover:shadow-[0_16px_40px_-12px_rgba(245,158,11,0.18)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent" />
      <h2 className="text-lg font-semibold text-white mb-4">Стрик</h2>
      <div className="flex items-center gap-3.5 mb-5">
        <motion.span
          className="relative flex h-14 w-14 items-center justify-center text-4xl"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="absolute inset-0 rounded-2xl bg-orange-500/20 blur-xl" />
          <span className="relative">🔥</span>
        </motion.span>
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
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              className={`w-full h-10 rounded-lg flex items-center justify-center text-xs border transition-colors duration-300 ${
                d.active
                  ? "bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                  : d.isToday
                    ? "bg-slate-800 text-slate-500 border-orange-500/40"
                    : "bg-slate-800 text-slate-700 border-slate-800"
              }`}
            >
              {d.active ? "🔥" : ""}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}