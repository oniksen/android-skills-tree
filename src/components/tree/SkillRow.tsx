"use client";
import { useState, useCallback } from "react";
import { saveAssessment } from "@/app/actions/assessments";

export default function SkillRow({ skillId, name, maxWeight, currentScore, required, disabled }: {
  skillId: string; name: string; maxWeight: number; currentScore: number; required: boolean; disabled?: boolean;
}) {
  const [score, setScore] = useState(currentScore);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleClick = useCallback(async (n: number) => {
    if (disabled) return;
    setScore(n);
    setSaving(true);
    try {
      await saveAssessment(skillId, n);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1500);
    } catch { setScore(currentScore); }
    finally { setSaving(false); }
  }, [skillId, currentScore, disabled]);

  const points = score * maxWeight;
  const btnColor = (n: number) => score >= n
    ? (["bg-red-900/50 text-red-400","bg-orange-900/50 text-orange-400","bg-yellow-900/50 text-yellow-400","bg-green-900/50 text-green-400","bg-emerald-900/50 text-emerald-400"][n-1] || "bg-slate-800 text-slate-600")
    : "bg-slate-800 text-slate-600 hover:bg-slate-700";
  const cursorClass = disabled ? "cursor-not-allowed opacity-60" : "";

  return (
    <div className={`flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-slate-800/50 transition-colors group ${cursorClass}`}>
      <div className="flex items-center gap-2 flex-1">
        <span className="text-sm text-slate-300">{name}</span>
        {required && <span className="text-xs text-yellow-500" title="Обязательный навык">★</span>}
        <span className="text-xs text-slate-600">({points} XP)</span>
      </div>
      <div className="flex items-center gap-1.5">
        {saving && <span className="text-xs text-slate-500">...</span>}
        {justSaved && <span className="text-xs text-emerald-400">✓</span>}
        <div className="flex gap-1">
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => handleClick(n)} disabled={disabled}
              className={`w-6 h-6 rounded text-xs font-medium transition-all ${btnColor(n)}`}>
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
