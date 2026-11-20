"use client";

interface LegendProps {
  isAuthenticated?: boolean;
}

export default function Legend({ isAuthenticated }: LegendProps) {
  return (
    <div className="card-surface mt-3 rounded-lg p-4">
      <div className="grid gap-x-6 gap-y-2.5 text-sm nav-md:grid-cols-2">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0 rounded bg-blue-600/20 px-1.5 py-0.5 text-xs font-medium text-blue-400">
            required
          </span>
          <span className="leading-snug text-slate-400">
            Обязательный навык для перехода на следующий уровень
          </span>
        </div>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded bg-amber-500/15 px-1.5 py-0.5 text-xs font-medium text-amber-400">
            сложно <span className="font-mono opacity-80">30 XP</span>
          </span>
          <span className="leading-snug text-slate-400">
            XP зависят от сложности навыка: у лёгких тем меньше, у сложных — больше. За полностью
            закрытый навык ещё начисляются 💎
          </span>
        </div>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border border-blue-500/50 font-mono text-xs font-medium text-slate-600">
            ✓
          </span>
          <span className="leading-snug text-slate-400">
            Отмечайте подтемы — доля отмеченных даёт соответствующую долю XP навыка
          </span>
        </div>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0 font-mono text-xs text-slate-500">(3/5)</span>
          <span className="leading-snug text-slate-400">
            Прогресс: выполнено подтем из общего количества
          </span>
        </div>
        {isAuthenticated && (
          <div className="flex items-start gap-3">
            <span className="mt-0.5 shrink-0 text-xs text-emerald-400">✓</span>
            <span className="leading-snug text-slate-400">Автосохранение при нажатии чекбокса</span>
          </div>
        )}
      </div>
    </div>
  );
}
