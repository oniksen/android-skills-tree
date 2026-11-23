"use client";

import Link from "next/link";
import { X } from "lucide-react";

interface AppCloseButtonProps {
  href: string;
  label: string;
}

/**
 * App-level close control. Sits in the header row to the right of the glass
 * panel; because that panel is `flex-1`, revealing the label shrinks the panel
 * by exactly the same width.
 */
export default function AppCloseButton({ href, label }: AppCloseButtonProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="group flex h-[var(--app-close-size)] min-w-[var(--app-close-size)] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-3 text-slate-500 shadow-[0_8px_24px_rgb(0_0_0_/_0.14)] transition-colors hover:text-[var(--study-accent-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-95"
    >
      <X className="h-[18px] w-[18px] shrink-0" aria-hidden />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-[max-width,opacity,margin-left] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:ml-2 group-hover:max-w-56 group-hover:opacity-100 group-focus-visible:ml-2 group-focus-visible:max-w-56 group-focus-visible:opacity-100 nav-lg:inline-block [@media(hover:none)]:hidden">
        {label}
      </span>
    </Link>
  );
}
