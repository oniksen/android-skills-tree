"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { toggleProjectCompletion } from "@/lib/firestore-actions";

export default function ProjectCard({ projectId, name, description, requiredTechnologies, levelName, completed }: {
  projectId: string; name: string; description: string; requiredTechnologies: string[]; levelName: string; completed: boolean;
}) {
  const [done, setDone] = useState(completed);
  const [saving, setSaving] = useState(false);

  const handleToggle = async () => {
    if (saving) return;
    setSaving(true);
    const newVal = !done;
    setDone(newVal);
    try {
      await toggleProjectCompletion(projectId, newVal);
    } catch {
      setDone(!newVal);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      onClick={handleToggle}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`group relative overflow-hidden rounded-xl border p-5 transition-colors cursor-pointer select-none ${
        done
          ? "border-emerald-500/30 bg-emerald-500/[0.07] hover:border-emerald-400/50 shadow-[0_10px_30px_-12px_rgba(34,197,94,0.3)]"
          : "card-surface hover:border-blue-400/40 hover:shadow-[0_10px_30px_-12px_rgba(59,130,246,0.25)]"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
          done ? "via-emerald-400/50" : "via-blue-400/40"
        } to-transparent`}
      />
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${done ? "text-emerald-300" : "text-white"}`}>{name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              done ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-800 text-slate-400"
            }`}>
              {levelName}
            </span>
          </div>
          <p className={`text-sm mt-1 ${done ? "text-slate-400" : "text-slate-400"}`}>{description}</p>
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {requiredTechnologies.map(tech => (
              <span
                key={tech}
                className="text-xs bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-full border border-white/[0.04]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            void handleToggle();
          }}
          disabled={saving}
          aria-label={done ? "Отметить проект как невыполненный" : "Отметить проект как выполненный"}
          aria-pressed={done}
          className={`relative ml-4 w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
            done
              ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_14px_rgba(34,197,94,0.5)]"
              : "border-slate-600 hover:border-slate-400 hover:bg-emerald-500/10"
          }`}
        >
          {saving ? (
            <span className="text-xs text-slate-400">...</span>
          ) : (
            <AnimatePresence>
              {done && (
                <motion.span
                  key="check"
                  initial={{ scale: 0, rotate: -40 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 600, damping: 22 }}
                  className="inline-flex"
                >
                  <Check className="w-4 h-4" strokeWidth={3.5} />
                </motion.span>
              )}
            </AnimatePresence>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}