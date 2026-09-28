import { auth, db } from "@/lib/firebase";
import { doc, runTransaction } from "firebase/firestore";
import { getCategoryById, getSkillById } from "@/data";
import { getShopItem, STREAK_FREEZE_ITEM_ID } from "@/data/shop";
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

export type BuyResult =
  | { ok: true }
  | {
      ok: false;
      reason: "not-found" | "not-enough" | "max-owned" | "signed-out" | "error";
    };

export async function buyItem(itemId: string): Promise<BuyResult> {
  const user = auth.currentUser;
  if (!user) return { ok: false, reason: "signed-out" };

  const item = getShopItem(itemId);
  if (!item) return { ok: false, reason: "not-found" };

  const currencyRef = doc(db, "users", user.uid, "currency", "current");

  try {
    return await runTransaction(db, async (tx) => {
      const snap = await tx.get(currencyRef);
      const existing = snap.exists()
        ? (snap.data() as Partial<CurrencyData>)
        : {};
      const balance = typeof existing.balance === "number" ? existing.balance : 0;
      const items =
        existing.items && typeof existing.items === "object" ? existing.items : {};
      const owned = typeof items[itemId] === "number" ? items[itemId] : 0;

      if (owned >= item.maxOwned) {
        return { ok: false as const, reason: "max-owned" as const };
      }
      if (balance < item.price) {
        return { ok: false as const, reason: "not-enough" as const };
      }

      tx.set(currencyRef, {
        balance: balance - item.price,
        items: { ...items, [itemId]: owned + 1 },
        updatedAt: new Date(),
      });
      return { ok: true as const };
    });
  } catch (error) {
    console.error("Error buying item:", error);
    return { ok: false, reason: "error" };
  }
}
