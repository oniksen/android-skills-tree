export default function LevelGate({ isUnlocked, isCompleted, requiredScore, currentScore, levelName }: {
  isUnlocked: boolean; isCompleted: boolean; requiredScore: number; currentScore: number; levelName: string;
}) {
  if (isUnlocked && !isCompleted) return null;
  const progress = Math.min((currentScore / requiredScore) * 100, 100);
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-8 text-center backdrop-blur-sm">
      {!isUnlocked && !isCompleted ? (
        <>
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="text-xl font-semibold text-white mb-2">{levelName} заблокирован</h3>
          <p className="text-slate-400 mb-4">Наберите {requiredScore} XP для разблокировки</p>
          <div className="text-2xl font-bold text-blue-400">{currentScore} / {requiredScore} XP</div>
          <div className="w-full max-w-xs mx-auto mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </>
      ) : (
        <>
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-xl font-semibold text-emerald-400 mb-2">{levelName} пройден</h3>
          <p className="text-slate-400">Этот уровень завершён. Посмотрите навыки для повторения.</p>
        </>
      )}
    </div>
  );
}
