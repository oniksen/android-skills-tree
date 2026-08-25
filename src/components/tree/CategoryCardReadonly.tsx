import SkillRowReadonly from "./SkillRowReadonly";
import ProgressBar from "@/components/shared/ProgressBar";

interface SkillItem {
  id: string;
  name: string;
  description: string;
  subtopics: string[];
  maxWeight: number;
  sortOrder: number;
}

function calcSkillScore(subtopics: string[], subtopicState: Record<string, boolean> | undefined, maxWeight: number): number {
  if (!subtopics || subtopics.length === 0) return 0;
  const completed = subtopics.filter((st) => subtopicState?.[st]).length;
  return Math.round((completed / subtopics.length) * maxWeight);
}

export default function CategoryCardReadonly({ name, maxScore, skills, assessments = {} }: {
  name: string;
  maxScore: number;
  skills: SkillItem[];
  assessments?: Record<string, { subtopics?: Record<string, boolean> }>;
}) {
  const sorted = [...skills].sort((a, b) => a.sortOrder - b.sortOrder);
  const catScore = sorted.reduce((sum, s) => {
    const subtopicState = assessments[s.id]?.subtopics;
    return sum + calcSkillScore(s.subtopics, subtopicState, s.maxWeight);
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
          <SkillRowReadonly
            key={skill.id}
            name={skill.name}
            description={skill.description}
            subtopics={skill.subtopics}
            maxWeight={skill.maxWeight}
          />
        ))}
      </div>
    </div>
  );
}
