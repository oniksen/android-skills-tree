"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSkillById } from "@/data";
import { getLevelBySlug, levels } from "@/data/levels";
import { useUserProgress } from "@/hooks";
import { useSkillDetail } from "@/hooks/useSkillDetail";
import SkillDetailContent from "@/features/tree/components/SkillDetailContent";
import CelebrationModal from "@/shared/ui/CelebrationModal";
import { SkillDetailSkeleton } from "@/shared/ui/skeletons";

interface SkillDetailPageClientProps {
  slug: string;
  skillId: string;
}

export default function SkillDetailPageClient({ slug, skillId }: SkillDetailPageClientProps) {
  const router = useRouter();
  const { progress, loading } = useUserProgress();
  const {
    subtopicState,
    subtopicPercent,
    award,
    toggle,
    levelUp,
    clearLevelUp,
  } = useSkillDetail(skillId);

  const skill = getSkillById(skillId);
  if (!skill) return null;

  const level = getLevelBySlug(slug);
  const currentLevelId = progress?.currentLevelId;
  const currentLevelIndex = levels.findIndex((l) => l.id === currentLevelId);
  const viewingLevelIndex = levels.findIndex((l) => l.id === level?.id);

  const isFuture = !!progress && viewingLevelIndex > currentLevelIndex;
  const isPast = !!progress && viewingLevelIndex < currentLevelIndex;

  const disabled = isFuture;
  const readonly = !progress || isPast;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <Link
        href={`/tree/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад к дереву
      </Link>

      <div className="card-surface relative overflow-hidden rounded-lg p-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
        {loading ? (
          <SkillDetailSkeleton />
        ) : (
          <SkillDetailContent
            skillId={skillId}
            name={skill.name}
            description={skill.description}
            subtopics={skill.subtopics}
            subtopicState={subtopicState}
            subtopicPercent={subtopicPercent}
            required={skill.requiredForLevelUp}
            readonly={readonly}
            disabled={disabled}
            award={award}
            onToggleSubtopic={toggle}
            studyHref={skill.studyMaterial ? `/tree/${slug}/skill/${skillId}/study` : undefined}
          />
        )}
      </div>

      {levelUp && (
        <CelebrationModal
          open
          levelName={levelUp.toLevel}
          onClose={() => {
            clearLevelUp();
            router.push(`/tree/${slug}`);
          }}
        />
      )}
    </div>
  );
}