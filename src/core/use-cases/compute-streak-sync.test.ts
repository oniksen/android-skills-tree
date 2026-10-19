import { describe, it, expect } from "vitest";
import { computeStreakSync } from "./compute-streak-sync";

const today = "2026-10-17";

describe("computeStreakSync", () => {
  it("adds today and marks the write as changed on a fresh record", () => {
    const result = computeStreakSync({ today, existing: {} });

    expect(result.changed).toBe(true);
    expect(result.data.activeDays).toEqual([today]);
    expect(result.data.lastActiveDate).toBe(today);
    expect(result.data.currentStreak).toBe(1);
  });

  it("keeps today already counted without marking a change", () => {
    const updatedAt = new Date("2026-10-17T08:00:00.000Z");
    const result = computeStreakSync({
      today,
      existing: { activeDays: [today], frozenDays: [], updatedAt },
    });

    expect(result.changed).toBe(false);
    expect(result.data.updatedAt).toBe(updatedAt);
    expect(result.data.currentStreak).toBe(1);
  });

  it("extends an existing streak when yesterday is covered", () => {
    const result = computeStreakSync({
      today,
      existing: { activeDays: ["2026-10-15", "2026-10-16"], frozenDays: [] },
    });

    expect(result.changed).toBe(true);
    expect(result.data.activeDays).toEqual([
      "2026-10-15",
      "2026-10-16",
      today,
    ]);
    expect(result.data.currentStreak).toBe(3);
  });

  it("counts frozen days towards the streak", () => {
    const result = computeStreakSync({
      today,
      existing: { activeDays: [today], frozenDays: ["2026-10-16"] },
    });

    expect(result.data.currentStreak).toBe(2);
  });
});
