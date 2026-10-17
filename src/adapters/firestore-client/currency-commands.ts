"use client";

import { auth, db } from "@/lib/firebase";
import { doc, runTransaction } from "firebase/firestore";
import { getShopItem } from "@/data/shop";
import { type BuyResult } from "@/core/domain/currency";
import { computeBuyItem } from "@/core/use-cases/compute-buy-item";
import { userCurrencyPath } from "@/adapters/firestore-client/paths";
import type { CurrencyData } from "@/types";

export async function buyItem(itemId: string): Promise<BuyResult> {
  const user = auth.currentUser;
  if (!user) return { ok: false, reason: "signed-out" };

  const item = getShopItem(itemId);
  if (!item) return { ok: false, reason: "not-found" };

  const currencyRef = doc(db, ...userCurrencyPath(user.uid));

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

      const plan = computeBuyItem({ item, balance, owned });
      if (!plan.ok) return plan;

      tx.set(
        currencyRef,
        {
          balance: plan.nextBalance,
          items: { ...items, [itemId]: plan.nextOwned },
          updatedAt: new Date(),
        },
        { merge: true },
      );
      return { ok: true as const };
    });
  } catch (error) {
    console.error("Error buying item:", error);
    return { ok: false, reason: "error" };
  }
}
