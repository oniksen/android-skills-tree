"use client";

import { motion } from "motion/react";
import { useStreak } from "@/hooks";
import { parseDayString } from "@/lib/streak";
import { X } from "lucide-react";

const DAYS_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export default function StreakPopover({ onClose }: { onClose: () => void }) {
  const { week, currentStreak, longestStreak } = useStreak();

  return (
    <div
      className="absolute right-0 top-full mt-2 w-72 card-surface rounded-xl p-4 shadow-2xl z-50"
      role="dialog"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.span
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-2xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🔥
          </motion.span>
          <div>
            <div className="font-mono text-xl font-bold text-white leading-none">{currentStreak}</div>
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
          <X className="h-4 w-4" />
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
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              className={`w-full h-9 rounded-lg flex items-center justify-center text-xs border transition-colors duration-300 ${
                d.active
                  ? "bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                  : d.isToday
                    ? "bg-slate-800 text-slate-500 border-orange-500/40"
                    : "bg-slate-800 text-slate-700 border-slate-800"
              }`}
            >
              {d.active ? "🔥" : parseDayString(d.date).getDate()}
            </motion.div>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-xs border-t border-white/[0.06] pt-2">
        <span className="text-slate-500">Рекорд</span>
        <span className="font-mono font-medium text-white">
          {longestStreak}🔥
        </span>
      </div>
    </div>
  );
}