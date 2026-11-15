"use client";

import { auth, db } from "@/lib/firebase";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { getShopItem } from "@/data/shop";
import { type BuyResult } from "@/core/domain/currency";
import { computeBuyItem } from "@/core/use-cases/compute-buy-item";
import { userStatePath } from "@/adapters/firestore-client/paths";
import { ensureUserState, normalizeUserState } from "@/adapters/firestore-client/state";
import { recordWrite } from "@/shared/lib/firestore-metrics";
import type { CurrencyData } from "@/types";

export async function buyItem(itemId: string): Promise<BuyResult> {
  const user = auth.currentUser;
  if (!user) return { ok: false, reason: "signed-out" };

  const item = getShopItem(itemId);
  if (!item) return { ok: false, reason: "not-found" };

  const stateRef = doc(db, ...userStatePath(user.uid));

  await ensureUserState(user.uid);

  try {
    const result = await runTransaction(db, async (tx) => {
      const snap = await tx.get(stateRef);
      const state = normalizeUserState(snap.data());
      const existing = state.currency ?? {};
      const balance = typeof existing.balance === "number" ? existing.balance : 0;
      const items =
        existing.items && typeof existing.items === "object" ? existing.items : {};
      const owned = typeof items[itemId] === "number" ? items[itemId] : 0;
      const claimedSkills =
        existing.claimedSkills && typeof existing.claimedSkills === "object"
          ? (existing.claimedSkills as Record<string, string>)
          : {};

      const plan = computeBuyItem({ item, balance, owned });
      if (!plan.ok) return plan;

      const nextItems = { ...(items as Record<string, number>), [itemId]: plan.nextOwned };

      const nextCurrency: CurrencyData = {
        balance: plan.nextBalance,
        items: nextItems,
        claimedSkills,
        updatedAt: serverTimestamp() as unknown as Date, // Firestore resolves this server-side; normalizeUserState converts it back to Date on read.
      };
      tx.set(stateRef, { currency: nextCurrency }, { merge: true });

      return { ok: true as const };
    });
    if (result && result.ok) recordWrite("buyItem", 1);
    return result;
  } catch (error) {
    console.error("Error buying item:", error);
    if (error && typeof error === "object" && (error as { code?: string }).code === "permission-denied") {
      return { ok: false, reason: "permission-denied" };
    }
    return { ok: false, reason: "error" };
  }
}