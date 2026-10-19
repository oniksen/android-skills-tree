import { STREAK_FREEZE_ITEM_ID } from "@/data/shop";
import { getSkillWeight } from "@/core/domain/weights";
import type { CurrencyData } from "@/types";

export const CRYSTALS_PER_XP = 0.5;

export const EMPTY_CURRENCY: CurrencyData = {
  balance: 0,
  items: {},
  updatedAt: new Date(0),
};

export function getCrystalRewardForSkill(skillId: string): number {
  return Math.round(getSkillWeight(skillId) * CRYSTALS_PER_XP);
}

export function getOwnedCount(
  currency: CurrencyData | null | undefined,
  itemId: string,
): number {
  return currency?.items?.[itemId] ?? 0;
}

export function getFreezeCount(
  currency: CurrencyData | null | undefined,
): number {
  return getOwnedCount(currency, STREAK_FREEZE_ITEM_ID);
}

export type BuyResult =
  | { ok: true }
  | {
      ok: false;
      reason: "not-found" | "not-enough" | "max-owned" | "signed-out" | "error" | "permission-denied";
    };
