"use client";
import SkillRow from "./SkillRow";
import ProgressBar from "@/components/shared/ProgressBar";

const SCORE_MULTIPLIER: Record<number, number> = { 1: 0.1, 2: 0.25, 3: 0.5, 4: 0.8, 5: 1.0 };

interface SkillItem { id: string; name: string; max_weight: number; sort_order: number; required_for_level_up: boolean; }
interface CategoryCardProps {
  name: string; maxScore: number; skills: SkillItem[]; assessments: Record<string, number>; isLocked?: boolean;
}
export default function CategoryCard({ name, maxScore, skills, assessments, isLocked = false }: CategoryCardProps) {
  const sorted = [...skills].sort((a,b) => a.sort_order - b.sort_order);
  const catScore = sorted.reduce((sum, s) => {
    const score = assessments[s.id] || 0;
    const multiplier = SCORE_MULTIPLIER[score] ?? 0;
    return sum + Math.floor(score * s.max_weight * multiplier);
  }, 0);
  return (
    <div className={`bg-slate-900 border rounded-xl p-5 ${isLocked ? "border-yellow-600/40" : "border-slate-800"}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-white">{name}</h3>
        <span className="flex items-center gap-2">
          {isLocked && <span className="text-xs bg-yellow-600/20 text-yellow-500 px-2 py-0.5 rounded-full font-medium">макс</span>}
          <span className="text-xs text-slate-500">{catScore}/{maxScore} XP</span>
        </span>
      </div>
      <ProgressBar current={catScore} max={maxScore} color={isLocked ? "bg-yellow-500" : "bg-blue-500"} showLabel={false} />
      <div className="mt-3 space-y-0.5">
        {sorted.map(skill => (
          <SkillRow key={skill.id} skillId={skill.id} name={skill.name}
            maxWeight={skill.max_weight} currentScore={assessments[skill.id] || 0}
            required={skill.required_for_level_up} disabled={isLocked} />
        ))}
      </div>
    </div>
  );
}
