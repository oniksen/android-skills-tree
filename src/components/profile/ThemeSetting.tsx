"use client";

import { useRef } from "react";
import { Check, Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "@/components/shared/ThemeProvider";
import type { ThemePreference } from "@/lib/theme";

const OPTIONS: { value: ThemePreference; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Светлая", icon: Sun },
  { value: "dark", label: "Тёмная", icon: Moon },
  { value: "system", label: "Системная", icon: Monitor },
];

export default function ThemeSetting() {
  const { preference, setTheme } = useTheme();
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    const count = OPTIONS.length;
    const next = ((index % count) + count) % count;
    setTheme(OPTIONS[next].value);
    itemsRef.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current = itemsRef.current.findIndex(
      (el) => el === document.activeElement,
    );
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      select(current + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      select(current - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      select(0);
    } else if (event.key === "End") {
      event.preventDefault();
      select(OPTIONS.length - 1);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Тема оформления"
      onKeyDown={onKeyDown}
      className="grid grid-cols-3 gap-1 rounded-md border border-slate-700/70 bg-white/[0.02] p-1"
    >
      {OPTIONS.map((option, index) => {
        const active = preference === option.value;
        return (
          <button
            key={option.value}
            ref={(el) => {
              itemsRef.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => setTheme(option.value)}
            className={`flex items-center justify-center gap-1.5 rounded-sm px-2.5 py-2 font-mono text-xs transition-colors ${
              active
                ? "border border-blue-500/40 bg-blue-500/10 text-blue-600"
                : "border border-transparent text-slate-400 hover:bg-blue-500/10 hover:text-blue-600"
            }`}
          >
            <option.icon className="h-3.5 w-3.5 shrink-0" />
            <span>{option.label}</span>
            {active && <Check className="h-3.5 w-3.5 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}
