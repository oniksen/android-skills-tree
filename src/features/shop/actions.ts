"use server";

import { requireUid } from "@/adapters/auth/session";
import { buyItem } from "@/adapters/firestore-admin/currency-commands";
import type { BuyResult } from "@/core/domain/currency";

export async function buyItemAction(itemId: string): Promise<BuyResult> {
  const uid = await requireUid();
  return buyItem(uid, itemId);
}
