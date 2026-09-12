"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SkillRowReadonlyProps {
  name: string;
  description: string;
  subtopics: string[];
  maxWeight: number;
}

export default function SkillRowReadonly({ name, description, subtopics, maxWeight }: SkillRowReadonlyProps) {
  const [expanded, setExpanded] = useState(false);
  const hasContent = description || subtopics.length > 0;

  return (
    <div className="py-1">
      <div
        className={`flex items-center justify-between px-3 rounded-lg transition-colors ${
          hasContent && expanded ? "bg-white/[0.03]" : "hover:bg-white/[0.03]"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {hasContent && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-slate-600 hover:text-slate-400 transition-colors shrink-0"
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
        </div>
        <span className="font-mono text-sm text-slate-600 shrink-0">вес: {maxWeight}</span>
      </div>

      <AnimatePresence initial={false}>
        {expanded && hasContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-9 mr-3 mb-1 mt-1 pl-3 border-l border-white/[0.08] space-y-1.5">
              {description && (
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              )}
              {subtopics.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {subtopics.map((st) => (
                    <span
                      key={st}
                      className="text-sm text-slate-600 bg-slate-800/60 px-2 py-0.5 rounded-full"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}