import { describe, expect, it } from "vitest";
import { summarizeProfile, type ProfileInputs } from "./profile";

const inputs: ProfileInputs = {
  xp: 1200,
  levelName: "Middle",
  crystals: 40,
  currentStreak: 3,
  longestStreak: 9,
  assessedSkills: 12,
  totalSkills: 227,
  completedProjects: 2,
  totalProjects: 30,
};

const catalog = [
  { id: "level-up:junior-middle", matches: (a: { type: string }) => a.type === "level_up" },
  {
    id: "streak:7",
    matches: (a: { type: string; metadata: Record<string, unknown> }) =>
      a.type === "streak" && a.metadata.days === 7,
  },
  { id: "path-complete", matches: (a: { type: string }) => a.type === "path_complete" },
];

describe("summarizeProfile", () => {
  it("passes through the raw inputs", () => {
    const summary = summarizeProfile(inputs, [], []);
    expect(summary).toMatchObject(inputs);
  });

  it("counts earned achievements and returns their ids", () => {
    const earned = [
      { type: "level_up", metadata: {} },
      { type: "streak", metadata: { days: 7 } },
    ];
    const summary = summarizeProfile(inputs, catalog, earned);
    expect(summary.earnedAchievementIds).toEqual(["level-up:junior-middle", "streak:7"]);
    expect(summary.earnedAchievements).toBe(2);
    expect(summary.totalAchievements).toBe(3);
  });

  it("returns zeros for an empty catalog", () => {
    const summary = summarizeProfile(inputs, [], [{ type: "level_up", metadata: {} }]);
    expect(summary.earnedAchievementIds).toEqual([]);
    expect(summary.earnedAchievements).toBe(0);
    expect(summary.totalAchievements).toBe(0);
  });

  it("does not double count a definition matched by several achievements", () => {
    const earned = [
      { type: "streak", metadata: { days: 7 } },
      { type: "streak", metadata: { days: 7 } },
    ];
    const summary = summarizeProfile(inputs, catalog, earned);
    expect(summary.earnedAchievementIds).toEqual(["streak:7"]);
    expect(summary.earnedAchievements).toBe(1);
  });
});
