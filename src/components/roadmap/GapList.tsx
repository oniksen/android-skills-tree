"use client";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import DifficultyBadge from "@/components/shared/DifficultyBadge";

interface Gap {
  skillId: string;
  skillName: string;
  categoryName: string;
  levelName: string;
  completionPercent: number;
  currentScore: number;
  maxScore: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function GapList({
  gaps,
  emptyMessage = "Нет навыков для текущего грейда",
}: {
  gaps: Gap[];
  emptyMessage?: string;
}) {
  if (gaps.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] p-6 text-center"
      >
        <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/20 blur-3xl" />
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-400" />
        <p className="text-emerald-400 font-medium">{emptyMessage}</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
            {gaps.map((gap, i) => {
        const done = gap.completionPercent === 100;
        const critical = !done && gap.currentScore === 0;
        return (
          <motion.div
            key={`${gap.skillName}-${i}`}
            variants={{
              hidden: { opacity: 0, y: 14 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
            }}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-colors nav-md:flex-row nav-md:items-center nav-md:justify-between ${
              done
                ? "hover:border-emerald-400/40"
                : critical
                  ? "hover:border-red-400/40"
                  : "hover:border-yellow-400/40"
            }`}
          >
            <div className="flex min-w-0 items-start gap-3">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  done
                    ? "bg-emerald-500/15 text-emerald-400"
                    : critical
                      ? "bg-red-500/15 text-red-400"
                      : "bg-yellow-500/15 text-yellow-400"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5" />
                )}
              </span>
              <div className="min-w-0">
                <span className="font-medium text-white">{gap.skillName}</span>
                <span className="block text-sm text-slate-500 nav-md:ml-2 nav-md:inline">
                  {gap.categoryName} · {gap.levelName}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <DifficultyBadge skillId={gap.skillId} />
              <span className="font-mono text-sm text-slate-500">
                {gap.currentScore}/{gap.maxScore} XP
              </span>
              <div className="h-1.5 w-24 flex-1 rounded-full bg-slate-800 overflow-hidden nav-md:flex-none">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    done
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                      : critical
                        ? "bg-gradient-to-r from-red-500 to-orange-400"
                        : "bg-gradient-to-r from-yellow-500 to-amber-400"
                  }`}
                  style={{ width: `${gap.completionPercent}%` }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}