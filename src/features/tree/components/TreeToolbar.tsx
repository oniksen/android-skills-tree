"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Level } from "@/data/levels";
import LevelTabs from "./LevelTabs";
import Legend from "./Legend";

interface TreeToolbarProps {
  levels: Level[];
  isAuthenticated?: boolean;
}

export default function TreeToolbar({ levels, isAuthenticated }: TreeToolbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/[0.06] pb-4">
      <div className="flex flex-col gap-2 nav-md:flex-row nav-md:items-center nav-md:justify-between">
        <LevelTabs levels={levels} />
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-md px-2 py-2 font-mono text-sm text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-slate-200"
        >
          <span>Условные обозначения</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs"
            aria-hidden
          >
            ▼
          </motion.span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="legend"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <Legend isAuthenticated={isAuthenticated} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
