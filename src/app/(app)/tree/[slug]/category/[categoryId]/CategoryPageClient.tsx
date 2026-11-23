"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getCategoryById, getSkillsByCategoryId } from "@/data";
import { getLevelBySlug, levels } from "@/data/levels";
import { useAssessments, useUserProgress } from "@/hooks";
import { calcCategoryScore, isSkillComplete } from "@/core/domain/scoring";
import { getCategoryMaxScore } from "@/core/domain/weights";
import { categoryHref } from "@/lib/viewport";
import ProgressBar from "@/shared/ui/ProgressBar";
import { CategorySkeleton } from "@/shared/ui/skeletons";
import CategorySkillBlock from "@/features/tree/components/CategorySkillBlock";

interface CategoryPageClientProps {
  slug: string;
  categoryId: string;
}

export default function CategoryPageClient({
  slug,
  categoryId,
}: CategoryPageClientProps) {
  const { progress, loading: progressLoading } = useUserProgress();
  const { assessmentMap, loading: assessmentsLoading } = useAssessments();

  const category = getCategoryById(categoryId);
  if (!category) return null;

  if (progressLoading || assessmentsLoading) {
    return <CategorySkeleton />;
  }

  const skills = getSkillsByCategoryId(categoryId);
  const level = getLevelBySlug(slug);
  const currentLevelIndex = levels.findIndex(
    (item) => item.id === (progress?.currentLevelId ?? levels[0].id),
  );
  const viewingLevelIndex = levels.findIndex((item) => item.id === level?.id);
  const isFuture = !!progress && viewingLevelIndex > currentLevelIndex;
  const isPast = !!progress && viewingLevelIndex < currentLevelIndex;
  const disabled = isFuture;
  const readonly = !progress || isPast;

  const score = calcCategoryScore(categoryId, assessmentMap);
  const maxScore = getCategoryMaxScore(categoryId);
  const completed = skills.filter((skill) =>
    isSkillComplete(skill.id, assessmentMap[skill.id]?.subtopics),
  ).length;
  const studyHref = category.studyMaterial
    ? `${categoryHref(slug, categoryId)}/study`
    : undefined;

  return (
    <div className="w-full space-y-4">
      <header className="glass-panel relative overflow-hidden p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {level?.name}
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
          {category.name}
        </h1>

        <div className="mt-3 flex items-center justify-between gap-3 font-mono text-sm">
          <span className="text-slate-500">
            {completed}/{skills.length} тем
          </span>
          <span className="flex items-center gap-2">
            {studyHref && (
              <Link
                href={studyHref}
                aria-label="Учебный материал"
                className="inline-flex items-center justify-center rounded-md p-0.5 text-blue-600 transition-colors hover:text-blue-500"
              >
                <BookOpen className="h-5 w-5" />
              </Link>
            )}
            <span className="text-slate-300">
              {score}/{maxScore} XP
            </span>
          </span>
        </div>
        <div className="mt-1.5">
          <ProgressBar current={score} max={maxScore} tone="coral" showLabel={false} />
        </div>
      </header>

      <div className="grid gap-3 xl:grid-cols-2">
        {skills.map((skill) => (
          <CategorySkillBlock
            key={skill.id}
            slug={slug}
            skill={skill}
            readonly={readonly}
            disabled={disabled}
          />
        ))}
      </div>

      {skills.length === 0 && (
        <p className="text-sm text-slate-500">В этом блоке пока нет тем.</p>
      )}
    </div>
  );
}
