export default function LevelGate({ isUnlocked, isCompleted, requiredScore, currentScore, levelName }: {
  isUnlocked: boolean; isCompleted: boolean; requiredScore: number; currentScore: number; levelName: string;
}) {
  if (isUnlocked && !isCompleted) return null;
  const pct = requiredScore > 0 ? Math.min((currentScore / requiredScore) * 100, 100) : 100;
  const filled = Math.round((pct / 100) * 20);
  const bar = "█".repeat(filled) + "░".repeat(Math.max(0, 20 - filled));

  return (
    <div className="term-panel rounded-lg p-8 text-center animate-fade-up">
      {!isUnlocked && !isCompleted ? (
        <>
          <div className="mb-3 font-mono text-sm font-semibold text-amber-600">[ LOCKED ]</div>
          <h3 className="mb-2 text-lg font-semibold text-white">{levelName} заблокирован</h3>
          <p className="mb-5 font-mono text-sm text-slate-400">
            Осталось {Math.max(0, requiredScore - currentScore)} XP для разблокировки
          </p>
          <div className="inline-flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-600">[</span>
            <span className="text-amber-500">{bar}</span>
            <span className="text-slate-600">]</span>
            <span className="text-slate-500">
              {currentScore}/{requiredScore} XP
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="mb-3 font-mono text-sm font-semibold text-emerald-600">[ DONE ]</div>
          <h3 className="mb-2 text-lg font-semibold text-emerald-600">{levelName} пройден</h3>
          <p className="text-sm text-slate-400">
            Этот уровень завершён. Посмотрите навыки для повторения.
          </p>
        </>
      )}
    </div>
  );
}
