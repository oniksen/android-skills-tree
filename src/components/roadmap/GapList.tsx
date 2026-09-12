"use client";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface Gap {
  skillName: string;
  categoryName: string;
  levelName: string;
  currentScore: number;
  maxScore: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function GapList({ gaps }: { gaps: Gap[] }) {
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
        <p className="text-emerald-400 font-medium">Все навыки оценены! Отличная работа!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      {gaps.map((gap, i) => {
        const pct = Math.min((gap.currentScore / gap.maxScore) * 100, 100);
        const critical = gap.currentScore === 0;
        return (
          <motion.div
            key={`${gap.skillName}-${i}`}
            variants={{
              hidden: { opacity: 0, y: 14 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
            }}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`group relative flex items-center justify-between gap-3 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-colors ${
              critical ? "hover:border-red-400/40" : "hover:border-yellow-400/40"
            }`}
          >
            <div className="flex min-w-0 items-start gap-3">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  critical
                    ? "bg-red-500/15 text-red-400"
                    : "bg-yellow-500/15 text-yellow-400"
                }`}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <span className="font-medium text-white">{gap.skillName}</span>
                <span className="ml-2 text-sm text-slate-500">
                  {gap.categoryName} · {gap.levelName}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="font-mono text-sm text-slate-500">
                {gap.currentScore}/{gap.maxScore}
              </span>
              <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    critical
                      ? "bg-gradient-to-r from-red-500 to-orange-400"
                      : "bg-gradient-to-r from-yellow-500 to-amber-400"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}