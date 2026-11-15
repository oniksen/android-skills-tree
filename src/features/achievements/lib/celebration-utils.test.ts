import { describe, expect, it } from "vitest";
import {
  detectNewAchievementIds,
  getConfettiCount,
  getTierIcon,
} from "@/features/achievements/lib/celebration-utils";
import { ACHIEVEMENT_TIERS } from "@/core/domain/achievement-tiers";

describe("celebration-utils", () => {
  it("detects only newly added ids", () => {
    const prev = new Set(["a", "b"]);
    const next = new Set(["a", "b", "c", "d"]);
    expect(detectNewAchievementIds(prev, next).sort()).toEqual(["c", "d"]);
  });

  it("returns empty list on first load", () => {
    const next = new Set(["a", "b"]);
    expect(detectNewAchievementIds(null, next)).toEqual([]);
  });

  it("increases confetti count by tier index", () => {
    const counts = ACHIEVEMENT_TIERS.map((tier) => getConfettiCount(tier.name));
    for (let i = 1; i < counts.length; i += 1) {
      expect(counts[i]).toBeGreaterThan(counts[i - 1]);
    }
  });

  it("returns base count for unknown tier", () => {
    expect(getConfettiCount(null)).toBe(48);
    expect(getConfettiCount("unknown-tier")).toBe(48);
  });

  it("caps confetti count", () => {
    expect(getConfettiCount("Алмаз")).toBeLessThanOrEqual(432);
  });

  it("returns tier icon or fallback", () => {
    expect(getTierIcon("Алмаз", "🏆")).toBe("💎");
    expect(getTierIcon("missing", "🏆")).toBe("🏆");
    expect(getTierIcon(null, "🏆")).toBe("🏆");
  });
});
