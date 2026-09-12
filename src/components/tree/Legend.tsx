"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Legend({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card-surface rounded-xl p-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2 pl-1 pr-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
      >
        <span>Условные обозначения</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs"
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-3 pt-3 border-t border-white/[0.06] space-y-1 text-sm">
              <div className="flex items-start gap-3 pl-1">
                <span className="text-xs bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded font-medium shrink-0 mt-0.5">required</span>
                <span className="text-slate-400 leading-snug">Обязательный навык для перехода на следующий уровень</span>
              </div>
              <div className="flex items-start gap-3 pl-1">
                <span className="w-6 h-6 rounded bg-slate-800 text-xs font-medium flex items-center justify-center text-slate-500 border border-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.3)] shrink-0">
                  ✓
                </span>
                <span className="text-slate-400 leading-snug">Отмечайте подтемы — XP считаются по количеству чекбоксов</span>
              </div>
              <div className="flex items-start gap-3 pl-1">
                <span className="text-xs text-slate-500 font-mono mt-0.5 shrink-0">(3/5)</span>
                <span className="text-slate-400 leading-snug">Прогресс: выполнено подтем из общего количества</span>
              </div>
              {isAuthenticated && (
                <div className="flex items-start gap-3 pl-1">
                  <span className="text-emerald-400 text-xs mt-0.5 shrink-0">✓</span>
                  <span className="text-slate-400 leading-snug">Автосохранение при нажатии чекбокса</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}