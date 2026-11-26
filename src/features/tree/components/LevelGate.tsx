export default function LevelGate({ isUnlocked, isCompleted, levelName }: {
  isUnlocked: boolean; isCompleted: boolean; levelName: string;
}) {
  if (isUnlocked && !isCompleted) return null;

  return (
    <div className="term-panel rounded-lg p-8 text-center animate-fade-in">
      {!isUnlocked && !isCompleted ? (
        <>
          <div className="mb-3 font-mono text-sm font-semibold text-amber-600">[ LOCKED ]</div>
          <h3 className="mb-2 text-lg font-semibold text-white">{levelName} заблокирован</h3>
          <p className="font-mono text-sm text-slate-400">
            Сначала завершите базовый грейд: обязательные навыки текущего уровня и проекты.
          </p>
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
