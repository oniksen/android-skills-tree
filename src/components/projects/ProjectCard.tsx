"use client";
import { useState } from "react";
import { toggleProjectCompletion } from "@/app/actions/projects";

export default function ProjectCard({ projectId, name, description, requiredTechnologies, levelName, completed }: {
  projectId: string; name: string; description: string; requiredTechnologies: string[]; levelName: string; completed: boolean;
}) {
  const [done, setDone] = useState(completed);
  const [saving, setSaving] = useState(false);

  const handleToggle = async () => {
    setSaving(true);
    const newVal = !done;
    setDone(newVal);
    try { await toggleProjectCompletion(projectId, newVal); }
    catch { setDone(!newVal); }
    finally { setSaving(false); }
  };

  return (
    <div className={`border rounded-xl p-5 transition-all ${done ? "bg-emerald-900/20 border-emerald-800" : "bg-slate-900 border-slate-800"}`}>
      <div className="flex items-start justify-between">
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
        <button onClick={handleToggle} disabled={saving}
          className={`ml-4 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
            done ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-600 hover:border-slate-500"
          }`}>
          {saving ? <span className="text-xs text-slate-400">...</span> : done ? <span className="text-lg">✓</span> : null}
        </button>
      </div>
    </div>
  );
}
