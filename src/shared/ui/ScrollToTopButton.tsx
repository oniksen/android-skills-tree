"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 240);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="перейти в начало"
      className="group fixed bottom-24 right-6 z-50 flex h-[var(--app-close-size)] min-w-[var(--app-close-size)] items-center justify-center overflow-hidden rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-3 text-slate-500 shadow-[0_8px_24px_rgb(0_0_0_/_0.14)] transition-colors hover:text-[var(--study-accent-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-95 nav-md:bottom-6"
    >
      <ArrowUp className="h-[18px] w-[18px] shrink-0" aria-hidden />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-[max-width,opacity,margin-left] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:ml-2 group-hover:max-w-56 group-hover:opacity-100 group-focus-visible:ml-2 group-focus-visible:max-w-56 group-focus-visible:opacity-100 nav-lg:inline-block [@media(hover:none)]:hidden">
        перейти в начало
      </span>
    </button>
  );
}