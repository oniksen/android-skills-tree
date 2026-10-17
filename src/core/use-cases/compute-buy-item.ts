export interface BuyItemInput {
  item: { price: number; maxOwned: number } | undefined;
  balance: number;
  owned: number;
}

export type BuyItemPlan =
  | { ok: true; nextBalance: number; nextOwned: number }
  | { ok: false; reason: "not-found" | "not-enough" | "max-owned" };

export function computeBuyItem(input: BuyItemInput): BuyItemPlan {
  const { item, balance, owned } = input;

  if (!item) return { ok: false, reason: "not-found" };
  if (owned >= item.maxOwned) return { ok: false, reason: "max-owned" };
  if (balance < item.price) return { ok: false, reason: "not-enough" };

  return {
    ok: true,
    nextBalance: balance - item.price,
    nextOwned: owned + 1,
  };
}
