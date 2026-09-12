"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { checkLevelUp as checkLevelUpAction } from "@/lib/firestore-actions";
import CelebrationModal from "@/components/shared/CelebrationModal";
import { useAssessments } from "@/hooks";

interface SkillRowProps {
  skillId: string;
  name: string;
  description: string;
  subtopics: string[];
  subtopicPercent: number;
  required: boolean;
  disabled?: boolean;
}

export default function SkillRow({
  skillId,
  name,
  description,
  subtopics,
  subtopicPercent,
  required,
  disabled = false,
}: SkillRowProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [levelResult, setLevelResult] = useState<{ fromLevel: string; toLevel: string; score: number } | null>(null);
  const [expanded, setExpanded] = useState(false);
  const { assessmentMap, toggleSubtopic } = useAssessments();

  const subtopicState = assessmentMap[skillId]?.subtopics || {};
  const completedCount = (subtopics ?? []).filter((st) => subtopicState[st]).length;

  const handleToggleSubtopic = async (subtopicName: string) => {
    if (disabled) return;
    const wasAllComplete = subtopics.length > 0 && subtopics.every((st) => subtopicState[st]);
    await toggleSubtopic(skillId, subtopicName);
    const isNowAllComplete = completedCount + 1 === subtopics.length;
    if (!wasAllComplete && isNowAllComplete) {
      try {
        const result = await checkLevelUpAction();
        if (result) {
          setLevelResult(result);
          setShowCelebration(true);
        }
      } catch {
        // ignore level-up errors
      }
    }
  };

  const hasContent = description || subtopics.length > 0;

  return (
    <>
      <motion.div
        layout="position"
        transition={{ duration: 0.25 }}
        className={`rounded-lg transition-colors ${
          hasContent && !disabled
            ? expanded
              ? "bg-white/[0.03]"
              : "hover:bg-white/[0.03]"
            : ""
        }`}
      >
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2 min-w-0">
            {hasContent && (
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setExpanded(!expanded)}
                className="text-slate-500 hover:text-slate-300 transition-colors shrink-0"
                aria-label={expanded ? "Свернуть" : "Развернуть"}
              >
                <svg
                  className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            )}
            <span className="text-base text-slate-300 truncate">{name}</span>
            {required && (
              <span className="text-xs bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                required
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {subtopics.length > 0 && (
              <motion.span
                key={completedCount}
                initial={{ scale: 1.35 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className={`font-mono text-sm px-1.5 py-0.5 rounded ${
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
          </div>
        </div>

        <AnimatePresence initial={false}>
          {expanded && hasContent && (
            <motion.div
              key="panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="ml-8 mr-2 mb-2 pl-3 border-l border-white/[0.08] space-y-2">
                {description && (
                  <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
                )}
                {subtopics.length > 0 && (
                  <div className="space-y-1">
                    {subtopics.map((st) => {
                      const checked = !!subtopicState[st];
                      return (
                        <label
                          key={st}
                          className={`flex items-center gap-2 text-sm cursor-pointer group ${
                            disabled ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <motion.button
                            type="button"
                            role="checkbox"
                            aria-checked={checked}
                            aria-label={st}
                            disabled={disabled}
                            whileTap={disabled ? undefined : { scale: 0.8 }}
                            onClick={() => handleToggleSubtopic(st)}
                            className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors duration-200 shrink-0 ${
                              disabled
                                ? "cursor-not-allowed"
                                : checked
                                  ? "bg-blue-500 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                  : "border-slate-600 hover:border-slate-400 hover:bg-blue-500/10"
                            }`}
                          >
                            <AnimatePresence>
                              {checked && (
                                <motion.span
                                  key="check"
                                  initial={{ scale: 0, rotate: -30 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0 }}
                                  transition={{ type: "spring", stiffness: 600, damping: 24 }}
                                  className="inline-flex"
                                >
                                  <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.button>
                          <span
                            className={`transition-colors duration-200 ${
                              subtopicState[st]
                                ? "text-slate-600 line-through"
                                : "text-slate-400 group-hover:text-slate-300"
                            }`}
                          >
                            {st}
                          </span>
                        </label>
                      );
                    })}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${subtopicPercent}%` }}
                        >
                          {subtopicPercent > 0 && subtopicPercent < 100 && (
                            <span className="block h-full w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                          )}
                        </div>
                      </div>
                      <span className="font-mono text-xs text-slate-600">{subtopicPercent}%</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {showCelebration && levelResult && (
        <CelebrationModal
          open={true}
          levelName={levelResult.toLevel}
          onClose={() => {
            setShowCelebration(false);
            setLevelResult(null);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}