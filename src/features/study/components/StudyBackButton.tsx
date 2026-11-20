"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { blockClass } from "../model/study-blocks";

const FLOAT = blockClass("backFloat");
const LABEL = blockClass("backFloatLabel");

const SPRING = { type: "spring", stiffness: 420, damping: 32, mass: 0.7 } as const;

export default function StudyBackButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduced = useReducedMotion();
  const open = hovered || focused;

  return (
    <Link
      href={href}
      aria-label={label}
      className={FLOAT}
      onPointerEnter={(event) => {
        // Наведение имеет смысл только для мыши/пера; на тач подпись скрыта CSS.
        if (event.pointerType !== "touch") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <X className="h-[18px] w-[18px] shrink-0" aria-hidden />
      <motion.span
        className={LABEL}
        initial={false}
        animate={{
          width: open ? "auto" : 0,
          opacity: open ? 1 : 0,
          marginLeft: open ? 8 : 0,
        }}
        transition={reduced ? { duration: 0 } : SPRING}
      >
        {label}
      </motion.span>
    </Link>
  );
}
