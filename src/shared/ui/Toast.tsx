"use client";

import { AnimatePresence, motion } from "motion/react";
import { useToast } from "@/shared/lib/toast-context";

export default function Toast() {
  const { message, dismiss } = useToast();
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={dismiss}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 cursor-pointer rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 shadow-lg"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
