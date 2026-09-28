"use client";

import { motion } from "motion/react";
import type { ShopItem } from "@/data/shop";

interface Props {
  item: ShopItem;
  owned: number;
  balance: number;
  buying: boolean;
  onBuy: () => void;
}

export default function ShopItemCard({ item, owned, balance, buying, onBuy }: Props) {
  const atMax = owned >= item.maxOwned;
  const canAfford = balance >= item.price;
  const disabled = atMax || !canAfford || buying;

  let label = `Купить за ${item.price} 💎`;
  let hint: string | null = null;
  if (atMax) {
    label = "Максимум";
  } else if (buying) {
    label = "Покупка...";
  } else if (!canAfford) {
    hint = `Не хватает ${item.price - balance} 💎`;
  }

  return (
    <div className="card-surface flex items-start gap-4 rounded-xl p-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-3xl">
        {item.icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="truncate font-semibold text-white">{item.name}</h2>
          <span className="shrink-0 font-mono text-sm font-semibold text-cyan-300">
            {item.price} 💎
          </span>
        </div>

        <p className="mt-1 text-sm leading-relaxed text-slate-400">{item.description}</p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="font-mono text-xs text-slate-500">
            У вас: {owned} / {item.maxOwned}
          </span>

          <motion.button
            type="button"
            onClick={onBuy}
            disabled={disabled}
            whileTap={disabled ? undefined : { scale: 0.97 }}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              disabled
                ? "cursor-not-allowed bg-slate-800 text-slate-500"
                : "bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25"
            }`}
          >
            {label}
          </motion.button>
        </div>

        {hint && <p className="mt-1.5 text-right text-xs text-slate-600">{hint}</p>}
      </div>
    </div>
  );
}
