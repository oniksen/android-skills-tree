"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight } from "lucide-react";
import CelebrationModal from "@/components/shared/CelebrationModal";
import DifficultyBadge from "@/components/shared/DifficultyBadge";
import { useSkillDetail } from "@/hooks/useSkillDetail";
import { isDesktopViewport, skillDetailHref } from "@/lib/viewport";
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
          className="flex w-full items-center justify-between px-2 py-2 text-left disabled:cursor-default"
        >
          <div className="flex min-w-0 items-center gap-2">
            {hasContent && <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />}
            <span className="truncate text-base text-slate-300">{name}</span>
            {required && (
              <span className="shrink-0 rounded bg-blue-600/20 px-1.5 py-0.5 text-xs text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                required
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <AnimatePresence>
              {award && (
                <motion.span
                  key={award.id}
                  initial={{ opacity: 0, y: 8, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="whitespace-nowrap font-mono text-xs text-cyan-300"
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
                    ? "bg-green-600/20 text-green-400"
                    : subtopicPercent > 0
                      ? "bg-blue-600/20 text-blue-400"
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
