import { describe, expect, it } from "vitest";
import {
  clearAchievementsCache,
  getAchievementsCache,
  setAchievementsCache,
} from "./achievement-cache";
import type { Achievement } from "@/types";

const make = (id: string): Achievement => ({
  id,
  type: "t",
  metadata: {},
  achievedAt: new Date(),
});

describe("achievement-cache", () => {
  it("returns null when empty", () => {
    clearAchievementsCache();
    expect(getAchievementsCache("u")).toBeNull();
  });

  it("stores and retrieves per uid", () => {
    clearAchievementsCache();
    const list = [make("a")];
    setAchievementsCache("u1", list);
    expect(getAchievementsCache("u1")).toBe(list);
    expect(getAchievementsCache("u2")).toBeNull();
  });

  it("clears one uid", () => {
    clearAchievementsCache();
    setAchievementsCache("u1", [make("a")]);
    setAchievementsCache("u2", [make("b")]);
    clearAchievementsCache("u1");
    expect(getAchievementsCache("u1")).toBeNull();
    expect(getAchievementsCache("u2")).toHaveLength(1);
  });

  it("clears all when no arg", () => {
    clearAchievementsCache();
    setAchievementsCache("u1", [make("a")]);
    setAchievementsCache("u2", [make("b")]);
    clearAchievementsCache();
    expect(getAchievementsCache("u1")).toBeNull();
    expect(getAchievementsCache("u2")).toBeNull();
  });
});
