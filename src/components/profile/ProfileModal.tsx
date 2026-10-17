"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import ProfileContent from "@/components/profile/ProfileContent";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileModal({ open, onClose }: ProfileModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const mql = window.matchMedia("(min-width: 600px)");
    const onResize = (event: MediaQueryListEvent) => {
      if (!event.matches) onClose();
    };
    mql.addEventListener("change", onResize);

    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      mql.removeEventListener("change", onResize);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    const triggers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-profile-trigger]"),
    );
    triggers.find((element) => element.offsetParent !== null)?.focus();
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="profile-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-950/70 p-4 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)] backdrop-blur-md"
        >
          <motion.div
            key="profile-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-heading"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(event) => event.stopPropagation()}
            className="relative my-auto w-full max-w-2xl rounded-lg border border-slate-700 bg-slate-950/98 p-5 shadow-[0_20px_60px_rgba(26,25,21,0.28)] outline-none"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть профиль"
              className="absolute right-3 top-3 rounded-md p-1.5 text-slate-500 transition-colors hover:bg-blue-500/10 hover:text-blue-600"
            >
              <X className="h-4 w-4" />
            </button>
            <ProfileContent />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
