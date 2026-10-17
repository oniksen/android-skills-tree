import { FieldValue } from "firebase-admin/firestore";
import { fsPath, getAdminDb } from "@/adapters/firestore-admin/admin-app";
import { type BuyResult } from "@/core/domain/currency";
import { computeBuyItem } from "@/core/use-cases/compute-buy-item";
import { getShopItem } from "@/data/shop";
import { userCurrencyPath } from "@/adapters/firestore-client/paths";
import type { CurrencyData } from "@/types";

export async function buyItem(
  uid: string,
  itemId: string,
): Promise<BuyResult> {
  const item = getShopItem(itemId);
  if (!item) return { ok: false, reason: "not-found" };

  const db = getAdminDb();
  const currencyRef = db.doc(fsPath(userCurrencyPath(uid)));

  try {
    return await db.runTransaction(async (tx) => {
      const snap = await tx.get(currencyRef);
      const existing = (snap.data() ?? {}) as Partial<CurrencyData>;
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
          updatedAt: FieldValue.serverTimestamp(),
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
