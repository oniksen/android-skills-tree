"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCurrency } from "@/hooks";
import { SHOP_ITEMS, CURRENCY_ICON } from "@/data/shop";
import { CRYSTAL_REWARDS } from "@/lib/currency";
import { levels } from "@/data/levels";
import type { BuyResult } from "@/lib/currency";
import ShopItemCard from "./ShopItemCard";

const EASE = [0.22, 1, 0.36, 1] as const;

const ERROR_MESSAGES: Record<Exclude<BuyResult, { ok: true }>["reason"], string> = {
  "not-found": "Товар не найден",
  "not-enough": "Не хватает кристаллов",
  "max-owned": "Достигнут максимум",
  "signed-out": "Нужно войти в аккаунт",
  error: "Не удалось купить, попробуй ещё раз",
};

export default function ShopClient() {
  const { balance, freezes, loading, buying, buyFreeze } = useCurrency();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 4000);
    return () => clearTimeout(t);
  }, [error]);

  const handleBuy = async () => {
    const result = await buyFreeze();
    if (!result.ok) setError(ERROR_MESSAGES[result.reason]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-blue-400" />
          Загрузка...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-white">Магазин</h1>
        <p className="mt-1 text-sm text-slate-400">
          Трать {CURRENCY_ICON} на бонусы за прогресс в обучении.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: EASE }}
        className="grid gap-4 sm:grid-cols-2"
      >
        {SHOP_ITEMS.map((item) => (
          <ShopItemCard
            key={item.id}
            item={item}
            owned={item.id === "streak_freeze" ? freezes : 0}
            balance={balance}
            buying={buying}
            onBuy={handleBuy}
          />
        ))}
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
        className="card-surface rounded-xl p-4"
      >
        <h2 className="text-sm font-semibold text-white">Как заработать {CURRENCY_ICON}</h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          Кристаллы начисляются один раз за каждую отмеченную подтему. Сколько даётся —
          зависит от уровня навыка:
        </p>
        <ul className="mt-3 space-y-1.5">
          {levels.map((level) => (
            <li key={level.id} className="flex items-center justify-between text-sm">
              <span className="text-slate-400">{level.name}</span>
              <span className="font-mono text-slate-200">
                +{CRYSTAL_REWARDS[level.id] ?? 0} {CURRENCY_ICON}
              </span>
            </li>
          ))}
        </ul>
      </motion.section>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-red-500/40 bg-red-500/15 px-4 py-2 text-sm text-red-300"
            role="alert"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
