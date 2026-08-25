"use client";
import SkillRow from "./SkillRow";
import ProgressBar from "@/components/shared/ProgressBar";

interface SkillItem {
  id: string;
  name: string;
  description: string;
  subtopics: string[];
  maxWeight: number;
  sortOrder: number;
  requiredForLevelUp: boolean;
}

interface CategoryCardProps {
  name: string;
  maxScore: number;
  skills: SkillItem[];
  assessments: Record<string, { subtopics?: Record<string, boolean> }>;
  isLocked?: boolean;
}

function calcSkillScore(subtopics: string[], subtopicState: Record<string, boolean> | undefined, maxWeight: number): number {
  if (!subtopics || subtopics.length === 0) return 0;
  const completed = subtopics.filter((st) => subtopicState?.[st]).length;
  return Math.round((completed / subtopics.length) * maxWeight);
}

export default function CategoryCard({ name, maxScore, skills, assessments, isLocked = false }: CategoryCardProps) {
  const sorted = [...skills].sort((a, b) => a.sortOrder - b.sortOrder);
  const catScore = sorted.reduce((sum, s) => {
    const subtopicState = assessments[s.id]?.subtopics;
    return sum + calcSkillScore(s.subtopics, subtopicState, s.maxWeight);
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
        {sorted.map(skill => {
          const subtopicState = assessments[skill.id]?.subtopics;
          const completed = (skill.subtopics ?? []).filter((st) => subtopicState?.[st]).length;
          const percent = skill.subtopics.length > 0 ? Math.round((completed / skill.subtopics.length) * 100) : 0;
          return (
            <SkillRow
              key={skill.id}
              skillId={skill.id}
              name={skill.name}
              description={skill.description}
              subtopics={skill.subtopics}
              subtopicPercent={percent}
              required={skill.requiredForLevelUp}
              disabled={isLocked}
            />
          );
        })}
      </div>
    </div>
  );
}
