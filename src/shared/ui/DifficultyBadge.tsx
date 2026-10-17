import { getSkillDifficulty, getSkillWeight } from "@/core/domain/weights";
import type { Difficulty } from "@/data";

const LABELS: Record<Difficulty, string> = {
  easy: "легко",
  medium: "средне",
  hard: "сложно",
};

const STYLES: Record<Difficulty, string> = {
  easy: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600",
  medium: "border-blue-500/40 bg-blue-500/10 text-blue-600",
  hard: "border-amber-500/40 bg-amber-500/10 text-amber-600",
};

interface DifficultyBadgeProps {
  skillId: string;
}

export default function DifficultyBadge({ skillId }: DifficultyBadgeProps) {
  const difficulty = getSkillDifficulty(skillId);
  const weight = getSkillWeight(skillId);

  if (weight <= 0) return null;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-xs ${STYLES[difficulty]}`}
    >
      <span>{LABELS[difficulty]}</span>
      <span className="opacity-70">{weight} XP</span>
    </span>
  );
}
