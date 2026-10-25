"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import {
  QUIZ_GRADES,
  getQuizGradeCounts,
  getTotalQuizQuestions,
} from "@/data/quiz-questions";

export default function QuizInfoIcon({ skillId }: { skillId: string }) {
  const [open, setOpen] = useState(false);
  const total = getTotalQuizQuestions(skillId);
  const counts = getQuizGradeCounts(skillId);

  return (
    <span
      className="relative inline-flex"
      onClick={(e) => e.stopPropagation()}
    >
      <span
        role="button"
        tabIndex={0}
        aria-label="Информация о вопросах квиза"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        className="inline-flex items-center justify-center rounded p-0.5 text-slate-500 transition-colors hover:text-slate-300"
      >
        <Info className="h-4 w-4" />
      </span>
      {open && (
        <span className="absolute left-1/2 top-full z-50 mt-1 w-44 -translate-x-1/2 rounded-md border border-slate-700 bg-slate-900 p-2 text-xs text-slate-300 shadow-lg">
          {total === 0 ? (
            "Вопросов для квиза пока нет"
          ) : (
            <>
              <span className="font-semibold">Вопросы квиза: {total}</span>
              <ul className="mt-1 space-y-0.5">
                {QUIZ_GRADES.map((grade) =>
                  counts[grade] > 0 ? (
                    <li key={grade} className="flex justify-between">
                      <span>{grade}</span>
                      <span className="font-mono">{counts[grade]}</span>
                    </li>
                  ) : null,
                )}
              </ul>
            </>
          )}
        </span>
      )}
    </span>
  );
}
