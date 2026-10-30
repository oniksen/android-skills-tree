export interface AchievementTier {
  name: string;
  threshold: number;
}

export const ACHIEVEMENT_TIERS: AchievementTier[] = [
  { name: "Камень", threshold: 7 },
  { name: "Агат", threshold: 14 },
  { name: "Оникс", threshold: 21 },
  { name: "Опал", threshold: 29 },
  { name: "Жемчуг", threshold: 36 },
  { name: "Бирюза", threshold: 43 },
  { name: "Гранат", threshold: 50 },
  { name: "Аметист", threshold: 57 },
  { name: "Топаз", threshold: 64 },
  { name: "Аквамарин", threshold: 71 },
  { name: "Изумруд", threshold: 79 },
  { name: "Рубин", threshold: 86 },
  { name: "Сапфир", threshold: 93 },
  { name: "Алмаз", threshold: 100 },
];

export const ACHIEVEMENT_TIER_ICONS: Record<string, string> = {
  "Камень": "🪨",
  "Агат": "🟤",
  "Оникс": "⚫",
  "Опал": "🌈",
  "Жемчуг": "⚪",
  "Бирюза": "🟦",
  "Гранат": "🔴",
  "Аметист": "🟣",
  "Топаз": "🟡",
  "Аквамарин": "🔵",
  "Изумруд": "🟢",
  "Рубин": "❤️",
  "Сапфир": "💙",
  "Алмаз": "💎",
};

export function getAchievementTier(progress: number): string | null {
  let current: string | null = null;
  for (const tier of ACHIEVEMENT_TIERS) {
    if (progress >= tier.threshold) current = tier.name;
  }
  return current;
}

export function getTierProgress(progress: number): number {
  const tier = getAchievementTier(progress);
  if (!tier) return Math.min((progress / ACHIEVEMENT_TIERS[0].threshold) * 100, 100);

  const currentIndex = ACHIEVEMENT_TIERS.findIndex((item) => item.name === tier);
  const currentThreshold = ACHIEVEMENT_TIERS[currentIndex].threshold;
  const nextTier = ACHIEVEMENT_TIERS[currentIndex + 1];
  if (!nextTier) return 100;

  const span = nextTier.threshold - currentThreshold;
  if (span <= 0) return 100;
  return Math.min(Math.max(((progress - currentThreshold) / span) * 100, 0), 100);
}
