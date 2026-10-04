import SkillRowReadonly from "./SkillRowReadonly";
import ProgressBar from "@/components/shared/ProgressBar";
import { calcCategoryScore } from "@/lib/scoring";
import { getCategoryMaxScore } from "@/lib/weights";

interface SkillItem {
  id: string;
  name: string;
  description: string;
  subtopics: string[];
  sortOrder: number;
}

export default function CategoryCardReadonly({ categoryId, name, skills, assessments = {} }: {
  categoryId: string;
  name: string;
  skills: SkillItem[];
  assessments?: Record<string, { subtopics?: Record<string, boolean> }>;
}) {
  const sorted = [...skills].sort((a, b) => a.sortOrder - b.sortOrder);
  const maxScore = getCategoryMaxScore(categoryId);
  const catScore = calcCategoryScore(categoryId, assessments);

  return (
    <div className="group relative card-surface overflow-hidden rounded-xl p-5 transition-shadow duration-300 hover:shadow-[0_16px_40px_-12px_rgba(59,130,246,0.18)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg text-white">{name}</h3>
        <span className="font-mono text-sm text-slate-500">{catScore}/{maxScore} XP</span>
      </div>
      <ProgressBar current={catScore} max={maxScore} color="bg-blue-500" showLabel={false} shimmer />
      <div className="mt-3 space-y-0.5">
        {sorted.map(skill => (
          <SkillRowReadonly
            key={skill.id}
            skillId={skill.id}
            name={skill.name}
            description={skill.description}
            subtopics={skill.subtopics}
          />
        ))}
      </div>
    </div>
  );
}