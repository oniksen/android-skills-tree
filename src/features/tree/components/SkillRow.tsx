"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import CelebrationModal from "@/shared/ui/CelebrationModal";
import DifficultyBadge from "@/shared/ui/DifficultyBadge";
import QuizInfoIcon from "@/shared/ui/QuizInfoIcon";
import { useSkillDetail } from "@/hooks/useSkillDetail";
import { isDesktopViewport, skillDetailHref } from "@/lib/viewport";
import { getSkillById } from "@/data";
import SkillDetailModal from "./SkillDetailModal";

interface SkillRowProps {
  skillId: string;
  name: string;
  description: string;
  subtopics: string[];
  required: boolean;
  disabled?: boolean;
}

export default function SkillRow({
  skillId,
  name,
  description,
  subtopics,
  required,
  disabled = false,
}: SkillRowProps) {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.slug as string) ?? "";

  const [open, setOpen] = useState(false);
  const {
    subtopicState,
    subtopicPercent,
    completedCount,
    award,
    toggle,
    levelUp,
    clearLevelUp,
  } = useSkillDetail(skillId);

  const hasContent = !!description || subtopics.length > 0;
  const studyHref = getSkillById(skillId)?.studyMaterial
    ? `/tree/${slug}/skill/${skillId}/study`
    : undefined;

  const handleOpen = () => {
    if (!hasContent) return;
    if (isDesktopViewport()) {
      setOpen(true);
    } else if (slug) {
      router.push(skillDetailHref(slug, skillId));
    }
  };

  return (
    <>
      <div className={`rounded-lg transition-colors ${hasContent ? "hover:bg-white/[0.03]" : ""}`}>
        <button
          type="button"
          onClick={handleOpen}
          disabled={!hasContent}
          aria-haspopup={hasContent ? "dialog" : undefined}
          className="flex w-full cursor-pointer flex-col gap-1.5 px-2 py-2 text-left disabled:cursor-default nav-md:flex-row nav-md:items-center nav-md:justify-between nav-md:gap-0"
        >
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={`w-3 shrink-0 text-center font-mono ${
                subtopicPercent === 100
                  ? "text-emerald-600"
                  : subtopicPercent > 0
                    ? "text-blue-500"
                    : "text-slate-600"
              }`}
            >
              {subtopicPercent === 100 ? "+" : subtopicPercent > 0 ? "·" : "-"}
            </span>
            <span className="text-base text-slate-300 nav-md:truncate">{name}</span>
            <QuizInfoIcon skillId={skillId} />
            {required && (
              <span className="shrink-0 rounded border border-blue-500/40 bg-blue-500/10 px-1.5 py-0.5 font-mono text-xs text-blue-600">
                required
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2 pl-5 nav-md:pl-0">
            <AnimatePresence>
              {award && (
                <motion.span
                  key={award.id}
                  initial={{ opacity: 0, y: 8, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="whitespace-nowrap font-mono text-xs text-cyan-600"
                >
                  +{award.amount} 💎
                </motion.span>
              )}
            </AnimatePresence>
            {subtopics.length > 0 && (
              <motion.span
                key={completedCount}
                initial={{ scale: 1.35 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className={`rounded px-1.5 py-0.5 font-mono text-sm ${
                  subtopicPercent === 100
                    ? "bg-emerald-500/10 text-emerald-600"
                    : subtopicPercent > 0
                      ? "bg-blue-500/10 text-blue-600"
                      : "text-slate-600"
                }`}
              >
                {completedCount}/{subtopics.length}
              </motion.span>
            )}
            <DifficultyBadge skillId={skillId} />
          </div>
        </button>
      </div>

      <SkillDetailModal
        open={open}
        onClose={() => setOpen(false)}
        skillId={skillId}
        name={name}
        description={description}
        subtopics={subtopics}
        subtopicState={subtopicState}
        subtopicPercent={subtopicPercent}
        required={required}
        disabled={disabled}
        award={award}
        onToggleSubtopic={toggle}
        studyHref={studyHref}
      />

      {levelUp && (
        <CelebrationModal
          open
          levelName={levelUp.toLevel}
          onClose={() => {
            clearLevelUp();
            setOpen(false);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
