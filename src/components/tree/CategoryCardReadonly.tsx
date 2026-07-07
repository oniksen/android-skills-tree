import SkillRowReadonly from "./SkillRowReadonly";
import ProgressBar from "@/components/shared/ProgressBar";

const SCORE_MULTIPLIER: Record<number, number> = { 1: 0.1, 2: 0.25, 3: 0.5, 4: 0.8, 5: 1.0 };

export default function CategoryCardReadonly({ name, maxScore, skills, assessments = {} }: {
  name: string; maxScore: number; skills: { id: string; name: string; max_weight: number; sort_order: number }[];
  assessments?: Record<string, number>;
}) {
  const sorted = [...skills].sort((a,b) => a.sort_order - b.sort_order);
  const catScore = sorted.reduce((sum, s) => {
    const score = assessments[s.id] || 0;
    const multiplier = SCORE_MULTIPLIER[score] ?? 0;
    return sum + Math.floor(score * s.max_weight * multiplier);
  }, 0);
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-white">{name}</h3>
        <span className="text-xs text-slate-500">{catScore}/{maxScore} XP</span>
      </div>
      <ProgressBar current={catScore} max={maxScore} color="bg-blue-500" showLabel={false} />
      <div className="mt-3 space-y-0.5">
        {sorted.map(skill => (
          <SkillRowReadonly key={skill.id} name={skill.name} maxWeight={skill.max_weight} />
        ))}
      </div>
    </div>
  );
}
