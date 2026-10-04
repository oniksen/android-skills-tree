import { getSkillDifficulty, getSkillWeight } from "@/lib/weights";
import type { Difficulty } from "@/data";

const LABELS: Record<Difficulty, string> = {
  easy: "легко",
  medium: "средне",
  hard: "сложно",
};

const STYLES: Record<Difficulty, string> = {
  easy: "bg-emerald-500/15 text-emerald-400",
  medium: "bg-blue-500/15 text-blue-400",
  hard: "bg-amber-500/15 text-amber-400",
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
      className={`inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium ${STYLES[difficulty]}`}
    >
      <span>{LABELS[difficulty]}</span>
      <span className="font-mono opacity-80">{weight} XP</span>
    </span>
  );
}