"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import ThemeIcon from "@/components/shared/ThemeIcon";
import { useTheme } from "@/components/shared/ThemeProvider";
import type { ThemePreference } from "@/lib/theme";

const OPTIONS: {
  value: ThemePreference;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "light", label: "Светлая", icon: Sun },
  { value: "dark", label: "Тёмная", icon: Moon },
  { value: "system", label: "Системная", icon: Monitor },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ThemeToggle() {
  const { preference, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const items = itemsRef.current.filter(
      (el): el is HTMLButtonElement => el !== null
    );
    const index = OPTIONS.findIndex((option) => option.value === preference);
    items[index >= 0 ? index : 0]?.focus();
  }, [open, preference]);

  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key !== "ArrowDown" &&
      event.key !== "ArrowUp" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }
    event.preventDefault();
    const items = itemsRef.current.filter(
      (el): el is HTMLButtonElement => el !== null
    );
    if (items.length === 0) return;
    const current = items.findIndex((el) => el === document.activeElement);
    let next = 0;
    if (event.key === "ArrowDown") {
      next = current < 0 ? 0 : (current + 1) % items.length;
    } else if (event.key === "ArrowUp") {
      next = current <= 0 ? items.length - 1 : current - 1;
    } else if (event.key === "End") {
      next = items.length - 1;
    }
    items[next]?.focus();
  };

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        ref={buttonRef}
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((value) => !value)}
        aria-label="Тема оформления"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-xs text-slate-400 transition-colors hover:bg-blue-500/10 hover:text-blue-600"
      >
        <ThemeIcon theme="light" className="theme-icon-sun h-4 w-4" />
        <ThemeIcon theme="dark" className="theme-icon-moon h-4 w-4" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Тема оформления"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: EASE }}
            onKeyDown={onMenuKeyDown}
            className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-44 overflow-hidden rounded-md border border-slate-700/70 bg-slate-950/95 p-1 shadow-[0_10px_30px_rgba(26,25,21,0.18)] backdrop-blur-xl"
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
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    setTheme(option.value);
                    setOpen(false);
                    buttonRef.current?.focus();
                  }}
                  className={`flex w-full items-center gap-2 rounded-sm px-2.5 py-1.5 font-mono text-xs transition-colors ${
                    active
                      ? "text-blue-600"
                      : "text-slate-400 hover:bg-blue-500/10 hover:text-blue-600"
                  }`}
                >
                  <option.icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1 text-left">{option.label}</span>
                  {active && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
