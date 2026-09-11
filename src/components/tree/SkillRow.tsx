"use client";

import { useState } from "react";
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
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2 min-w-0">
          {hasContent && (
            <button
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
            </button>
          )}
          <span className="text-base text-slate-300 truncate">{name}</span>
          {required && (
            <span className="text-xs bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded shrink-0">
              required
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {subtopics.length > 0 && (
            <span className={`text-sm px-1.5 py-0.5 rounded ${
              subtopicPercent === 100
                ? "bg-green-600/20 text-green-400"
                : subtopicPercent > 0
                  ? "bg-blue-600/20 text-blue-400"
                  : "text-slate-600"
            }`}>
              {completedCount}/{subtopics.length}
            </span>
          )}
        </div>
      </div>

      {expanded && hasContent && (
        <div className="ml-5 mb-2 pl-3 border-l border-slate-800 space-y-2">
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
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      aria-label={st}
                      disabled={disabled}
                      onClick={() => handleToggleSubtopic(st)}
                      className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                        disabled
                          ? "cursor-not-allowed"
                          : checked
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "border-slate-600 hover:border-slate-400"
                      }`}
                    >
                      {checked && (
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      )}
                    </button>
                    <span
                      className={`transition-colors ${
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
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${subtopicPercent}%` }}
                  />
                </div>
                <span className="text-xs text-slate-600">{subtopicPercent}%</span>
              </div>
            </div>
          )}
        </div>
      )}

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
