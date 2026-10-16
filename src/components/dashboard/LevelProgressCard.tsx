"use client";
import ProgressBar from "@/components/shared/ProgressBar";
import AnimatedNumber from "@/components/shared/AnimatedNumber";

interface LevelProgressCardProps {
  currentLevel: string;
  currentScore: number;
  nextLevel: string | null;
  nextThreshold: number | null;
  levelColor: string;
}

export default function LevelProgressCard({ currentLevel, currentScore, nextLevel, nextThreshold, levelColor }: LevelProgressCardProps) {
  return (
    <div className="group relative card-surface overflow-hidden rounded-lg p-6 transition-colors duration-200 hover:border-blue-500/40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">Текущий уровень</h2>
      <p className={`text-3xl font-bold tracking-tight mb-4 ${levelColor}`}>{currentLevel}</p>
      {nextLevel && nextThreshold ? (
        <>
          <ProgressBar current={currentScore} max={nextThreshold} tone="coral" />
          <p className="text-sm text-slate-400 mt-2">
            До уровня <span className="text-slate-300">{nextLevel}</span> осталось{" "}
            <AnimatedNumber value={Math.max(0, nextThreshold - currentScore)} className="font-mono text-slate-200" /> XP
          </p>
        </>
      ) : (
        <p className="text-emerald-400 font-medium">Максимальный уровень достигнут!</p>
      )}
    </div>
  );
}