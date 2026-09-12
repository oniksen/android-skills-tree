export default function LevelGate({ isUnlocked, isCompleted, requiredScore, currentScore, levelName }: {
  isUnlocked: boolean; isCompleted: boolean; requiredScore: number; currentScore: number; levelName: string;
}) {
  if (isUnlocked && !isCompleted) return null;
  const progress = Math.min((currentScore / requiredScore) * 100, 100);
  return (
    <div className="relative overflow-hidden card-surface rounded-xl p-10 text-center animate-fade-up">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
      {!isUnlocked && !isCompleted ? (
        <>
          <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center">
            <span className="absolute inset-0 rounded-3xl bg-blue-500/20 blur-2xl animate-pulse-glow" />
            <span className="relative text-5xl animate-float">🔒</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{levelName} заблокирован</h3>
          <p className="text-slate-400 mb-5">Наберите {requiredScore} XP для разблокировки</p>
          <div className="mx-auto mb-3 inline-flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-gradient">{currentScore}</span>
            <span className="font-mono text-slate-500">/ {requiredScore} XP</span>
          </div>
          <div className="relative mx-auto mt-2 w-full max-w-xs h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="relative h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_14px_rgba(59,130,246,0.6)]"
              style={{ width: `${progress}%` }}
            >
              <span className="absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center">
            <span className="absolute inset-0 rounded-3xl bg-emerald-500/20 blur-2xl animate-pulse-glow" />
            <span className="relative text-5xl animate-float">✅</span>
          </div>
          <h3 className="text-xl font-semibold text-emerald-400 mb-2">{levelName} пройден</h3>
          <p className="text-slate-400">Этот уровень завершён. Посмотрите навыки для повторения.</p>
        </>
      )}
    </div>
  );
}