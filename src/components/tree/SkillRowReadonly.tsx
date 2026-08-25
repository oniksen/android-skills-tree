"use client";

import { useState } from "react";

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
    <div className="py-1.5">
      <div className="flex items-center justify-between px-3 rounded-lg hover:bg-slate-800/50 transition-colors">
        <div className="flex items-center gap-2 min-w-0">
          {hasContent && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-slate-600 hover:text-slate-400 transition-colors shrink-0"
              aria-label={expanded ? "Свернуть" : "Развернуть"}
            >
              <svg
                className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          <span className="text-sm text-slate-300 truncate">{name}</span>
        </div>
        <span className="text-xs text-slate-600 shrink-0">вес: {maxWeight}</span>
      </div>

      {expanded && hasContent && (
        <div className="ml-8 mr-3 mb-1 mt-1 pl-3 border-l border-slate-800 space-y-1.5">
          {description && (
            <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
          )}
          {subtopics.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {subtopics.map((st) => (
                <span
                  key={st}
                  className="text-[11px] text-slate-600 bg-slate-800/50 px-2 py-0.5 rounded"
                >
                  {st}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
