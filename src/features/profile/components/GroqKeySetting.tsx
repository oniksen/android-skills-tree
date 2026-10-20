"use client";

import { useState } from "react";
import { useUserSettings } from "@/hooks/useUserSettings";

export default function GroqKeySetting() {
  const { settings, saveSettings } = useUserSettings();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  const hasKey = !!settings?.groqApiKey;

  async function handleSave() {
    if (!value.trim()) return;
    setSaving(true);
    try {
      await saveSettings({ groqApiKey: value.trim() });
      setValue("");
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      {hasKey && !editing ? (
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs text-slate-400">
            ключ: ...{settings?.groqKeyLast4}
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="font-mono text-xs text-blue-600 transition-colors hover:text-blue-500"
          >
            изменить
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="gsk_..."
            className="flex-1 rounded-md border border-slate-700/70 bg-white/[0.02] px-2 py-1.5 font-mono text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !value.trim()}
            className="rounded-md border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 font-mono text-xs text-blue-600 transition-colors hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "..." : "сохранить"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setValue("");
              }}
              className="font-mono text-xs text-slate-400 transition-colors hover:text-slate-200"
            >
              отмена
            </button>
          )}
        </div>
      )}
    </div>
  );
}