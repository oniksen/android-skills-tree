"use client";

import type { Skill } from "@/data";
import { useSkillDetail } from "@/hooks/useSkillDetail";
import CelebrationModal from "@/shared/ui/CelebrationModal";
import SkillDetailContent from "./SkillDetailContent";

interface CategorySkillBlockProps {
  slug: string;
  skill: Skill;
  readonly: boolean;
  disabled: boolean;
}

/**
 * One topic on the category page. Everything — description, subtopics and
 * progress — is visible immediately; there is no modal or extra click.
 */
export default function CategorySkillBlock({
  slug,
  skill,
  readonly,
  disabled,
}: CategorySkillBlockProps) {
  const {
    subtopicState,
    subtopicPercent,
    award,
    toggle,
    levelUp,
    clearLevelUp,
  } = useSkillDetail(skill.id);

  const studyHref = skill.studyMaterial
    ? `/tree/${slug}/skill/${skill.id}/study`
    : undefined;

  return (
    <>
      <section
        id={`skill-${skill.id}`}
        className="card-surface relative scroll-mt-24 overflow-hidden rounded-lg p-5"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
        <SkillDetailContent
          skillId={skill.id}
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
          studyHref={studyHref}
          showCategory={false}
        />
      </section>

      {levelUp && (
        <CelebrationModal
          open
          levelName={levelUp.toLevel}
          onClose={clearLevelUp}
        />
      )}
    </>
  );
}
