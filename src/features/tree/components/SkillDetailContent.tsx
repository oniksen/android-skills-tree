"use client";

import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import DifficultyBadge from "@/shared/ui/DifficultyBadge";
import { getCrystalRewardForSkill } from "@/core/domain/currency";
import { getCategoryById, getSkillById } from "@/data";

export interface SkillDetailContentProps {
  skillId: string;
  name: string;
  description: string;
  subtopics: string[];
  subtopicState: Record<string, boolean>;
  subtopicPercent: number;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  award?: { amount: number } | null;
  onToggleSubtopic?: (subtopicName: string) => void;
}

export default function SkillDetailContent({
  skillId,
  name,
  description,
  subtopics,
  subtopicState,
  subtopicPercent,
  required = false,
  disabled = false,
  readonly = false,
  award = null,
  onToggleSubtopic,
}: SkillDetailContentProps) {
  const categoryName = getCategoryById(getSkillById(skillId)?.categoryId ?? "")?.name;
  const completedCount = subtopics.filter((st) => subtopicState[st]).length;
  const crystalReward = getCrystalRewardForSkill(skillId);
  const pendingReward = !readonly && crystalReward > 0 && completedCount < subtopics.length;
  const interactive = !readonly && !disabled;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {categoryName && (
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {categoryName}
          </p>
        )}
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-semibold leading-snug text-white">{name}</h2>
          <div className="flex shrink-0 items-center gap-2 pt-0.5">
            <AnimatePresence>
              {award && (
                <motion.span
                  key={award.amount}
                  initial={{ opacity: 0, y: 8, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="whitespace-nowrap font-mono text-sm text-cyan-600"
                >
                  +{award.amount} 💎
                </motion.span>
              )}
            </AnimatePresence>
            <DifficultyBadge skillId={skillId} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {required && (
            <span className="rounded border border-blue-500/40 bg-blue-500/10 px-1.5 py-0.5 font-mono text-xs text-blue-600">
              required
            </span>
          )}
          {subtopics.length > 0 && (
            <span className="font-mono text-sm text-slate-500">
              {completedCount}/{subtopics.length}
            </span>
          )}
        </div>
      </div>

      {description && (
        <p className="text-sm leading-relaxed text-slate-300 sm:text-base">{description}</p>
      )}

      {subtopics.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Подтемы</h3>
            <span className="font-mono text-xs text-slate-600">{subtopicPercent}%</span>
          </div>

          {readonly ? (
            <div className="flex flex-wrap gap-1.5">
              {subtopics.map((st) => (
                <span
                  key={st}
                  className="rounded-full bg-slate-800/60 px-3 py-1 text-sm text-slate-400"
                >
                  {st}
                </span>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {subtopics.map((st) => {
                const checked = !!subtopicState[st];
                return (
                  <motion.button
                    key={st}
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    aria-label={st}
                    disabled={disabled}
                    whileTap={interactive ? { scale: 0.98 } : undefined}
                    onClick={() => interactive && onToggleSubtopic?.(st)}
                    className={`flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors ${
                      disabled
                        ? "cursor-not-allowed opacity-50"
                        : "group hover:bg-white/[0.03]"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200 ${
                        disabled
                          ? "cursor-not-allowed"
                          : checked
                            ? "border-blue-600 bg-blue-600 text-[#faf9f5]"
                            : "border-slate-600 group-hover:border-slate-400 group-hover:bg-blue-500/10"
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
                            <Check className="h-4 w-4" strokeWidth={3.5} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span
                      className={`text-sm transition-colors duration-200 sm:text-base ${
                        checked
                          ? "text-slate-600 line-through"
                          : "text-slate-300 group-hover:text-slate-100"
                      }`}
                    >
                      {st}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-500 ease-out"
                style={{ width: `${subtopicPercent}%` }}
              >
                {subtopicPercent > 0 && subtopicPercent < 100 && (
                  <span className="block h-full w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                )}
              </div>
            </div>
          </div>

          {pendingReward && (
            <p className="text-xs text-cyan-600/90">
              Закрой все подпункты — <span className="font-mono">+{crystalReward} 💎</span>
            </p>
          )}
        </div>
      )}

      {!description && subtopics.length === 0 && (
        <p className="text-sm text-slate-500">Для этого навыка пока нет дополнительной информации.</p>
      )}
    </div>
  );
}
