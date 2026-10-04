import { skills, type Difficulty } from "@/data/skills";
import { categories } from "@/data/categories";
import { levels } from "@/data/levels";

export const DIFFICULTY_WEIGHT: Record<Difficulty, number> = {
  easy: 2,
  medium: 3,
  hard: 5,
};

export const LEVEL_MULTIPLIER: Record<string, number> = {
  junior: 2,
  middle: 3,
  "strong-middle": 4,
  senior: 6,
};

export const LEVEL_UP_THRESHOLD = 0.8;

const FALLBACK_DIFFICULTY: Difficulty = "medium";

function levelIdByCategoryId(): Map<string, string> {
  return new Map(categories.map((c) => [c.id, c.levelId]));
}

function buildSkillWeights(): Map<string, number> {
  const categoryLevels = levelIdByCategoryId();
  const weights = new Map<string, number>();

  for (const skill of skills) {
    const multiplier = LEVEL_MULTIPLIER[categoryLevels.get(skill.categoryId) ?? ""] ?? 1;
    const difficulty = skill.difficulty ?? FALLBACK_DIFFICULTY;
    weights.set(skill.id, DIFFICULTY_WEIGHT[difficulty] * multiplier);
  }

  return weights;
}

const skillWeights = buildSkillWeights();

const categoryMaxScores = new Map<string, number>();
const levelMaxScores = new Map<string, number>();
const levelMinScores = new Map<string, number>();

function buildThresholds(): void {
  const sortedLevels = [...levels].sort((a, b) => a.levelOrder - b.levelOrder);
  let cumulative = 0;

  sortedLevels.forEach((level, index) => {
    let levelTotal = 0;

    for (const category of categories.filter((c) => c.levelId === level.id)) {
      const categoryTotal = skills
        .filter((s) => s.categoryId === category.id)
        .reduce((sum, s) => sum + (skillWeights.get(s.id) ?? 0), 0);

      categoryMaxScores.set(category.id, categoryTotal);
      levelTotal += categoryTotal;
    }

    levelMinScores.set(
      level.id,
      index === 0 ? 0 : cumulative + Math.round(levelTotal * LEVEL_UP_THRESHOLD),
    );

    cumulative += levelTotal;
    levelMaxScores.set(level.id, cumulative);
  });
}

buildThresholds();

export function getSkillWeight(skillId: string): number {
  return skillWeights.get(skillId) ?? 0;
}

export function getSkillDifficulty(skillId: string): Difficulty {
  return skills.find((s) => s.id === skillId)?.difficulty ?? FALLBACK_DIFFICULTY;
}

export function getCategoryMaxScore(categoryId: string): number {
  return categoryMaxScores.get(categoryId) ?? 0;
}

export function getLevelMaxScore(levelId: string): number {
  return levelMaxScores.get(levelId) ?? 0;
}

export function getLevelMinScore(levelId: string): number {
  return levelMinScores.get(levelId) ?? 0;
}

export function getTotalMaxScore(): number {
  return getLevelMaxScore(levels[levels.length - 1]?.id ?? "");
}

if (process.env.NODE_ENV !== "production") {
  for (const skill of skills) {
    if (!skill.difficulty) {
      console.warn(
        `[weights] skill "${skill.id}" has no difficulty, using "${FALLBACK_DIFFICULTY}"`,
      );
    }
  }
}