import { describe, it, expect } from "vitest";
import { sortRoadmapItems } from "@/lib/roadmap-sort";

const make = (currentScore: number, completionPercent: number) => ({
  currentScore,
  completionPercent,
});

describe("sortRoadmapItems", () => {
  const items = [make(10, 50), make(30, 20), make(0, 100), make(20, 0)];

  it("сортирует по опыту по возрастанию", () => {
    const result = sortRoadmapItems(items, "xp-asc");
    expect(result.map((i) => i.currentScore)).toEqual([0, 10, 20, 30]);
  });

  it("сортирует по опыту по убыванию", () => {
    const result = sortRoadmapItems(items, "xp-desc");
    expect(result.map((i) => i.currentScore)).toEqual([30, 20, 10, 0]);
  });

  it("сортирует по проценту закрытия по убыванию", () => {
    const result = sortRoadmapItems(items, "completion-desc");
    expect(result.map((i) => i.completionPercent)).toEqual([100, 50, 20, 0]);
  });

  it("не изменяет исходный массив", () => {
    const original = [...items];
    sortRoadmapItems(items, "xp-desc");
    expect(items).toEqual(original);
  });
});
