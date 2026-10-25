import SkillRowReadonly from "./SkillRowReadonly";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import ProgressBar from "@/shared/ui/ProgressBar";
import { calcCategoryScore } from "@/core/domain/scoring";
import { getCategoryMaxScore } from "@/core/domain/weights";

interface SkillItem {
  id: string;
  name: string;
  description: string;
  subtopics: string[];
  sortOrder: number;
}

export default function CategoryCardReadonly({ categoryId, name, skills, assessments = {}, studyHref }: {
  categoryId: string;
  name: string;
  skills: SkillItem[];
  assessments?: Record<string, { subtopics?: Record<string, boolean> }>;
  studyHref?: string;
}) {
  const sorted = [...skills].sort((a, b) => a.sortOrder - b.sortOrder);
  const maxScore = getCategoryMaxScore(categoryId);
  const catScore = calcCategoryScore(categoryId, assessments);

  return (
    <div className="group relative card-surface overflow-hidden rounded-lg p-5 transition-colors duration-200 hover:border-blue-500/40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg text-white">{name}</h3>
          {studyHref && (
            <Link
              href={studyHref}
              aria-label="Учебный материал"
              className="inline-flex items-center justify-center rounded-md p-1 text-blue-600 transition-colors hover:text-blue-500"
            >
              <BookOpen className="h-5 w-5" />
            </Link>
          )}
        </div>
        <span className="font-mono text-sm text-slate-500">{catScore}/{maxScore} XP</span>
      </div>
      <ProgressBar current={catScore} max={maxScore} tone="coral" showLabel={false} />
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