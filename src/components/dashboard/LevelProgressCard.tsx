import ProgressBar from "@/components/shared/ProgressBar";

interface LevelProgressCardProps {
  currentLevel: string;
  currentScore: number;
  nextLevel: string | null;
  nextThreshold: number | null;
  levelColor: string;
}

export default function LevelProgressCard({ currentLevel, currentScore, nextLevel, nextThreshold, levelColor }: LevelProgressCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-1">Текущий уровень</h2>
      <p className={`text-3xl font-bold mb-4 ${levelColor}`}>{currentLevel}</p>
      {nextLevel && nextThreshold ? (
        <>
          <ProgressBar current={currentScore} max={nextThreshold} color="bg-blue-500" />
          <p className="text-sm text-slate-400 mt-2">
            До уровня <span className="text-slate-300">{nextLevel}</span> осталось {Math.max(0, nextThreshold - currentScore)} XP
          </p>
        </>
      ) : (
        <p className="text-emerald-400 font-medium">Максимальный уровень достигнут!</p>
      )}
    </div>
  );
}
