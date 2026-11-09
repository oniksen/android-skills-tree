import {
  ACHIEVEMENT_TIERS,
  ACHIEVEMENT_TIER_ICONS,
} from "@/core/domain/achievement-tiers";

export function detectNewAchievementIds(
  prev: ReadonlySet<string> | null,
  next: ReadonlySet<string>,
): string[] {
  if (!prev) return [];
  const added: string[] = [];
  for (const id of next) {
    if (!prev.has(id)) added.push(id);
  }
  return added;
}

export function getConfettiCount(tier: string | null): number {
  if (!tier) return 48;
  const index = ACHIEVEMENT_TIERS.findIndex((item) => item.name === tier);
  if (index < 0) return 48;
  return Math.min(48 + (index + 1) * 24, 432);
}

export function getTierIcon(tier: string | null, fallback: string): string {
  if (tier && ACHIEVEMENT_TIER_ICONS[tier]) {
    return ACHIEVEMENT_TIER_ICONS[tier];
  }
  return fallback;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
