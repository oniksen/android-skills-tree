import { getCategoryById, getSkillById } from "@/data";
import { STREAK_FREEZE_ITEM_ID } from "@/data/shop";
import type { CurrencyData } from "@/types";

export const CRYSTAL_REWARDS: Record<string, number> = {
  junior: 2,
  middle: 3,
  "strong-middle": 5,
  senior: 8,
};

export const DEFAULT_CRYSTAL_REWARD = 2;

export const EMPTY_CURRENCY: CurrencyData = {
  balance: 0,
  items: {},
  updatedAt: new Date(0),
};

export function getCrystalRewardForLevelId(levelId: string): number {
  return CRYSTAL_REWARDS[levelId] ?? DEFAULT_CRYSTAL_REWARD;
}

export function getCrystalRewardForSkill(skillId: string): number {
  const skill = getSkillById(skillId);
  if (!skill) return DEFAULT_CRYSTAL_REWARD;
  const category = getCategoryById(skill.categoryId);
  if (!category) return DEFAULT_CRYSTAL_REWARD;
  return getCrystalRewardForLevelId(category.levelId);
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
