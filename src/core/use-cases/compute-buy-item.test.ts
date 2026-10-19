import { describe, it, expect } from "vitest";
import { computeBuyItem } from "./compute-buy-item";

describe("computeBuyItem", () => {
  const item = { price: 5, maxOwned: 3 };

  it("fails when the item does not exist", () => {
    expect(computeBuyItem({ item: undefined, balance: 10, owned: 0 })).toEqual({
      ok: false,
      reason: "not-found",
    });
  });

  it("fails when the max owned is reached", () => {
    expect(computeBuyItem({ item, balance: 10, owned: 3 })).toEqual({
      ok: false,
      reason: "max-owned",
    });
  });

  it("fails when the balance is insufficient", () => {
    expect(computeBuyItem({ item, balance: 4, owned: 0 })).toEqual({
      ok: false,
      reason: "not-enough",
    });
  });

  it("returns the next balance and owned count on success", () => {
    expect(computeBuyItem({ item, balance: 10, owned: 1 })).toEqual({
      ok: true,
      nextBalance: 5,
      nextOwned: 2,
    });
  });
});
