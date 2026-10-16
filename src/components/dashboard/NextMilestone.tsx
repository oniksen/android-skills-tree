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
        className="relative overflow-hidden rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-6"
      >
        <h2 className="mb-2 font-mono text-sm font-semibold text-emerald-600">[ READY ] условия выполнены</h2>
        <p className="text-sm text-slate-400">
          Вы готовы перейти на уровень <strong className="text-emerald-600">{nextLevelName}</strong>.
        </p>
      </motion.div>
    );
  }
  return (
    <div className="group relative card-surface overflow-hidden rounded-lg p-6 transition-colors duration-200 hover:border-emerald-500/40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Что нужно для {nextLevelName}</h2>
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
              className={`flex h-5 w-5 items-center justify-center rounded border font-mono text-[10px] ${
                item.done
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600"
                  : "border-slate-600 text-slate-600"
              }`}
            >
              {item.done ? "x" : " "}
            </motion.span>
            <span className={item.done ? "text-slate-400" : "text-slate-300"}>{item.label}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}