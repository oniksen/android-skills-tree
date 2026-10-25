"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";
import {
  QUIZ_GRADES,
  getQuizGradeCounts,
  getTotalQuizQuestions,
} from "@/data/quiz-questions";

export default function QuizInfoIcon({ skillId }: { skillId: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLSpanElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const total = getTotalQuizQuestions(skillId);
  const counts = getQuizGradeCounts(skillId);

  useEffect(() => {
    if (open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const half = 88;
      const padding = 8;
      const center = r.left + r.width / 2;
      const left = Math.min(
        Math.max(center, half + padding),
        window.innerWidth - half - padding,
      );
      setPos({ top: r.bottom + 4, left });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open]);

  const tooltip = (
    <span
      style={{
        position: "fixed",
        top: pos?.top ?? 0,
        left: pos?.left ?? 0,
        transform: "translateX(-50%)",
        zIndex: 100,
      }}
      className="w-44 rounded-md border border-slate-700 bg-slate-900 p-2 text-xs text-slate-300 shadow-lg"
    >
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
  );

  return (
    <span
      ref={wrapperRef}
      className="relative inline-flex"
      onClick={(e) => e.stopPropagation()}
    >
      <span
        ref={btnRef}
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
      {open && pos && typeof document !== "undefined"
        ? createPortal(tooltip, document.body)
        : null}
    </span>
  );
}
