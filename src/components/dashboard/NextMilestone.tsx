"use client";
import { motion } from "motion/react";

interface MilestoneItem {
  label: string;
  done: boolean;
}

interface NextMilestoneProps {
  items: MilestoneItem[];
  canLevelUp: boolean;
  nextLevelName: string;
}

export default function NextMilestone({ items, canLevelUp, nextLevelName }: NextMilestoneProps) {
  if (canLevelUp) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] p-6"
      >
        <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
        <h2 className="text-lg font-semibold text-emerald-400 mb-2">🎉 Условия выполнены!</h2>
        <p className="text-slate-300">
          Вы готовы перейти на уровень <strong className="text-emerald-300">{nextLevelName}</strong>.
        </p>
      </motion.div>
    );
  }
  return (
    <div className="group relative card-surface overflow-hidden rounded-xl p-6 transition-shadow duration-300 hover:shadow-[0_16px_40px_-12px_rgba(34,197,94,0.15)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
      <h2 className="text-lg font-semibold text-white mb-3">Что нужно для {nextLevelName}</h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 text-sm"
          >
            <motion.span
              whileHover={{ scale: 1.15 }}
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                item.done
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                  : "bg-slate-800 text-slate-600 border border-slate-700"
              }`}
            >
              {item.done ? "✓" : "○"}
            </motion.span>
            <span className={item.done ? "text-slate-400" : "text-slate-300"}>{item.label}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}