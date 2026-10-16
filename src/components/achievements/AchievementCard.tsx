"use client";

import { motion } from "motion/react";
import { Lock } from "lucide-react";

interface AchievementCardProps {
  title: string;
  icon: string;
  condition: string;
  achievedAt: Date | null;
  hint?: string;
}

export default function AchievementCard({
  title,
  icon,
  condition,
  achievedAt,
  hint,
}: AchievementCardProps) {
  const earned = achievedAt !== null;

  const formattedDate = earned
    ? achievedAt!.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`group relative overflow-hidden rounded-lg p-5 flex items-center gap-4 transition-colors ${
        earned
          ? "card-surface border-blue-500/40 hover:border-blue-500/60"
          : "border border-slate-700 bg-white/[0.02] hover:border-slate-600"
      }`}
    >
      {earned && (
        <>
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
          <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
            <span className="absolute -left-1/3 top-0 h-full w-1/2 animate-shimmer bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" style={{ animationDuration: "4s" }} />
          </span>
        </>
      )}
      <motion.span
        whileHover={earned ? { scale: 1.12, rotate: -4 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-3xl ${
          earned
            ? "border-blue-500/40 bg-blue-500/10"
            : "border-slate-700 bg-white/[0.02]"
        } ${earned ? "" : "opacity-50 grayscale"}`}
      >
        {earned ? icon : <Lock className="h-5 w-5 text-slate-500" />}
      </motion.span>
      <div className="min-w-0">
        <h3
          className={`font-semibold ${
            earned ? "text-white" : "text-slate-500"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-sm mt-0.5 truncate ${
            earned ? "text-slate-400" : "text-slate-600"
          }`}
          title={condition}
        >
          {condition}
        </p>
        {earned ? (
          <p className="font-mono text-xs text-blue-600/80 mt-1">{formattedDate}</p>
        ) : (
          <p className="text-xs text-slate-600 mt-1">
            Не получено{hint ? ` · ${hint}` : ""}
          </p>
        )}
      </div>
    </motion.div>
  );
}