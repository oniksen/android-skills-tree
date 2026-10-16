export type RoadmapSortKey = "xp-asc" | "xp-desc" | "completion-desc";

export interface SortableRoadmapItem {
  currentScore: number;
  completionPercent: number;
}

export function sortRoadmapItems<T extends SortableRoadmapItem>(
  items: T[],
  key: RoadmapSortKey,
): T[] {
  const sorted = [...items];
  switch (key) {
    case "xp-asc":
      sorted.sort((a, b) => a.currentScore - b.currentScore);
      break;
    case "xp-desc":
      sorted.sort((a, b) => b.currentScore - a.currentScore);
      break;
    case "completion-desc":
      sorted.sort((a, b) => b.completionPercent - a.completionPercent);
      break;
  }
  return sorted;
}
