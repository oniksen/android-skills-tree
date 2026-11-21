import { describe, expect, it } from "vitest";
import { levelProgressPercent } from "./profile-level";

describe("levelProgressPercent", () => {
  it("clamps the ratio to 0..100", () => {
    expect(levelProgressPercent(0, 1000)).toBe(0);
    expect(levelProgressPercent(500, 1000)).toBe(50);
    expect(levelProgressPercent(2000, 1000)).toBe(100);
  });

  it("is 100 when there is no next threshold", () => {
    expect(levelProgressPercent(123, null)).toBe(100);
    expect(levelProgressPercent(123, 0)).toBe(100);
  });
});
