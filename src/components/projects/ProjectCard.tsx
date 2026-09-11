"use client";
import { useState } from "react";
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
    try { await toggleProjectCompletion(projectId, newVal); }
    catch { setDone(!newVal); }
    finally { setSaving(false); }
  };

  return (
    <div
      onClick={handleToggle}
      className={`border rounded-xl p-5 transition-all cursor-pointer select-none ${done ? "bg-emerald-900/20 border-emerald-800 hover:border-emerald-700" : "bg-slate-900 border-slate-800 hover:border-slate-600"}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white">{name}</h3>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{levelName}</span>
          </div>
          <p className="text-sm text-slate-400 mt-1">{description}</p>
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {requiredTechnologies.map(tech => (
              <span key={tech} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">{tech}</span>
            ))}
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); void handleToggle(); }}
          disabled={saving}
          aria-label={done ? "Отметить проект как невыполненный" : "Отметить проект как выполненный"}
          aria-pressed={done}
          className={`ml-4 w-7 h-7 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
            done ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-600 hover:border-slate-400"
          }`}>
          {saving ? <span className="text-xs text-slate-400">...</span> : done ? <Check className="w-4 h-4" strokeWidth={3} /> : null}
        </button>
      </div>
    </div>
  );
}
