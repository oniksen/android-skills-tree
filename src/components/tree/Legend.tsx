"use client";

import { useState } from "react";

export default function Legend({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900/50 p-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-sm text-slate-400 hover:text-slate-300 transition-colors"
      >
        <span>Условные обозначения</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
      </button>
      {open && (
        <div className="px-5 pb-4 pt-3 border-t border-slate-800 space-y-1 text-sm">
          <div className="flex items-start gap-3 pl-1">
            <span className="text-yellow-500 text-xs mt-0.5">★</span>
            <span className="text-slate-400 leading-snug">Обязательный навык для перехода на следующий уровень</span>
          </div>
          <div className="flex items-start gap-3 pl-1">
            <span className="flex gap-1 shrink-0 mt-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className="w-6 h-6 rounded text-xs font-medium flex items-center justify-center bg-slate-800 text-slate-600"
                >
                  {n}
                </span>
              ))}
            </span>
            <span className="text-slate-400 leading-snug">Оценка владения (1 — знаю термин, 5 — могу обучать)</span>
          </div>
          <div className="flex items-start gap-3 pl-1">
            <span className="text-xs text-slate-500 font-mono mt-0.5 shrink-0">(12 XP)</span>
            <span className="text-slate-400 leading-snug">Баллы = оценка × вес навыка</span>
          </div>
          {isAuthenticated && (
            <div className="flex items-start gap-3 pl-1">
              <span className="text-emerald-400 text-xs mt-0.5 shrink-0">✓</span>
              <span className="text-slate-400 leading-snug">Автосохранение при нажатии</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
