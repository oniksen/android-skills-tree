"use client";

import { useState } from "react";
import QuizConsole from "./QuizConsole";

export default function JuniorQuizModal() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative h-[90vh] w-[95%] max-w-5xl">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="close"
          className="absolute right-3 top-3 z-10 cursor-pointer text-slate-400 transition-colors hover:text-slate-200"
        >
          [✕]
        </button>
        <QuizConsole />
      </div>
    </div>
  );
}