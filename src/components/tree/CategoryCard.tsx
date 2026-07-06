"use client";
import SkillRow from "./SkillRow";
import ProgressBar from "@/components/shared/ProgressBar";

interface SkillItem { id: string; name: string; max_weight: number; sort_order: number; required_for_level_up: boolean; }
interface CategoryCardProps {
  name: string; maxScore: number; skills: SkillItem[]; assessments: Record<string, number>;
}
export default function CategoryCard({ name, maxScore, skills, assessments }: CategoryCardProps) {
  const sorted = [...skills].sort((a,b) => a.sort_order - b.sort_order);
  const catScore = sorted.reduce((sum, s) => sum + (assessments[s.id] || 0) * s.max_weight, 0);
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-white">{name}</h3>
        <span className="text-xs text-slate-500">{catScore}/{maxScore} XP</span>
      </div>
      <ProgressBar current={catScore} max={maxScore} color="bg-blue-500" showLabel={false} />
      <div className="mt-3 space-y-0.5">
        {sorted.map(skill => (
          <SkillRow key={skill.id} skillId={skill.id} name={skill.name}
            maxWeight={skill.max_weight} currentScore={assessments[skill.id] || 0}
            required={skill.required_for_level_up} />
        ))}
      </div>
    </div>
  );
}
