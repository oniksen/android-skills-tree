"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getCategoriesByLevelId, getLevelBySlug, getSkillById, levels } from "@/data";
import { useUserProgress } from "@/hooks";
import { useSkillDetail } from "@/hooks/useSkillDetail";
import CelebrationModal from "@/shared/ui/CelebrationModal";
import SkillDetailModal from "./SkillDetailModal";

interface DeepLinkedSkillModalProps {
  slug: string;
}

/**
 * Opens a skill card on top of the tree when the URL carries `?skill=<id>`.
 * Roadmap links here on desktop so it behaves like clicking a skill inside the tree.
 */
export default function DeepLinkedSkillModal({ slug }: DeepLinkedSkillModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { progress } = useUserProgress();

  const requestedSkillId = searchParams.get("skill");
  const level = getLevelBySlug(slug);
  const requestedSkill = requestedSkillId ? getSkillById(requestedSkillId) : undefined;
  const belongsToLevel =
    !!level &&
    !!requestedSkill &&
    getCategoriesByLevelId(level.id).some((category) => category.id === requestedSkill.categoryId);

  const {
    subtopicState,
    subtopicPercent,
    award,
    toggle,
    levelUp,
    clearLevelUp,
  } = useSkillDetail(requestedSkillId ?? "");

  const close = () => {
    router.replace(`/tree/${slug}`, { scroll: false });
  };

  if (!requestedSkill || !belongsToLevel) return null;

  const levelIndex = level ? levels.findIndex((item) => item.id === level.id) : -1;
  const currentLevelIndex = levels.findIndex((item) => item.id === progress?.currentLevelId);
  const isPast = currentLevelIndex >= 0 && levelIndex < currentLevelIndex;
  const isFuture = currentLevelIndex >= 0 && levelIndex > currentLevelIndex;

  return (
    <>
      <SkillDetailModal
        open
        onClose={close}
        skillId={requestedSkill.id}
        name={requestedSkill.name}
        description={requestedSkill.description}
        subtopics={requestedSkill.subtopics}
        subtopicState={subtopicState}
        subtopicPercent={subtopicPercent}
        required={requestedSkill.requiredForLevelUp}
        readonly={!progress || isPast}
        disabled={isFuture}
        award={award}
        onToggleSubtopic={toggle}
        studyHref={
          requestedSkill.studyMaterial
            ? `/tree/${slug}/skill/${requestedSkill.id}/study`
            : undefined
        }
      />

      {levelUp && (
        <CelebrationModal
          open
          levelName={levelUp.toLevel}
          onClose={() => {
            clearLevelUp();
            close();
          }}
        />
      )}
    </>
  );
}
