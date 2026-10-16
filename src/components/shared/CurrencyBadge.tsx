"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useCurrency } from "@/hooks";
import { CURRENCY_ICON } from "@/data/shop";

export default function CurrencyBadge() {
  const { balance, loading } = useCurrency();

  if (loading) return <div className="w-14 h-6" aria-hidden />;

  return (
    <Link
      href="/shop"
      title="Кристаллы — магазин"
      className="flex items-center gap-1.5 rounded-md border border-slate-700 px-2 py-1 font-mono text-xs text-slate-500 transition-colors hover:border-cyan-500/40 hover:text-cyan-600"
    >
      <motion.span
        key={balance}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 22 }}
        className="text-sm leading-none"
      >
        {CURRENCY_ICON}
      </motion.span>
      <motion.span
        key={`b-${balance}`}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 22 }}
        className="font-semibold"
      >
        {balance}
      </motion.span>
    </Link>
  );
}
