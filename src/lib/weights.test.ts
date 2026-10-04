import { describe, expect, it } from "vitest";
import { skills } from "@/data/skills";
import { categories } from "@/data/categories";
import { levels } from "@/data/levels";
import {
  DIFFICULTY_WEIGHT,
  LEVEL_MULTIPLIER,
  LEVEL_UP_THRESHOLD,
  getCategoryMaxScore,
  getLevelMaxScore,
  getLevelMinScore,
  getSkillDifficulty,
  getSkillWeight,
  getTotalMaxScore,
} from "@/lib/weights";

const VALID_DIFFICULTIES = ["easy", "medium", "hard"];

function skillsOfCategory(categoryId: string) {
  return skills.filter((s) => s.categoryId === categoryId);
}

function levelIdOfCategory(categoryId: string) {
  return categories.find((c) => c.id === categoryId)?.levelId;
}

describe("difficulty data", () => {
  it("каждый скилл имеет валидную сложность", () => {
    for (const skill of skills) {
      expect(VALID_DIFFICULTIES, `скилл ${skill.id}`).toContain(skill.difficulty);
    }
  });

  it("каждый скилл принадлежит существующей категории с известным множителем уровня", () => {
    for (const skill of skills) {
      const levelId = levelIdOfCategory(skill.categoryId);
      expect(levelId, `скилл ${skill.id} -> категория ${skill.categoryId}`).toBeDefined();
      expect(LEVEL_MULTIPLIER[levelId as string]).toBeDefined();
    }
  });

  it("каждый скилл имеет хотя бы одну подтему", () => {
    for (const skill of skills) {
      expect(skill.subtopics.length, `скилл ${skill.id}`).toBeGreaterThan(0);
    }
  });
});

describe("вес скилла", () => {
  it("равен произведению веса тира на множитель уровня", () => {
    for (const skill of skills) {
      const levelId = levelIdOfCategory(skill.categoryId) as string;
      const expected = DIFFICULTY_WEIGHT[skill.difficulty] * LEVEL_MULTIPLIER[levelId];
      expect(getSkillWeight(skill.id), `скилл ${skill.id}`).toBe(expected);
    }
  });

  it("даёт весь диапазон заявленных значений 4..30", () => {
    const weights = skills.map((s) => getSkillWeight(s.id));
    expect(Math.min(...weights)).toBe(4);
    expect(Math.max(...weights)).toBe(30);
  });

  it("внутри одного уровня тяжёлый скилл всегда дороже лёгкого", () => {
    for (const category of categories) {
      const weights = skillsOfCategory(category.id).map((s) => getSkillWeight(s.id));
      const byDifficulty = new Map(skillsOfCategory(category.id).map((s) => [s.difficulty, getSkillWeight(s.id)]));
      if (byDifficulty.has("easy") && byDifficulty.has("hard")) {
        expect(byDifficulty.get("hard") as number).toBeGreaterThan(byDifficulty.get("easy") as number);
      }
      expect(new Set(weights).size).toBeGreaterThan(0);
    }
  });

  it("одна и та же тема дороже на старшем уровне", () => {
    const easyJunior = skills.find((s) => s.difficulty === "easy" && levelIdOfCategory(s.categoryId) === "junior");
    const hardSenior = skills.find((s) => s.difficulty === "hard" && levelIdOfCategory(s.categoryId) === "senior");

    expect(easyJunior).toBeDefined();
    expect(hardSenior).toBeDefined();
    expect(getSkillWeight(hardSenior!.id)).toBeGreaterThan(getSkillWeight(easyJunior!.id));
  });

  it("неизвестный скилл даёт нулевой вес и среднюю сложность", () => {
    expect(getSkillWeight("no-such-skill")).toBe(0);
    expect(getSkillDifficulty("no-such-skill")).toBe("medium");
  });
});

describe("пороги категорий", () => {
  it("каждая категория равна сумме весов своих скиллов", () => {
    for (const category of categories) {
      const expected = skillsOfCategory(category.id).reduce((sum, s) => sum + getSkillWeight(s.id), 0);
      expect(getCategoryMaxScore(category.id), `категория ${category.id}`).toBe(expected);
    }
  });

  it("неизвестная категория даёт ноль", () => {
    expect(getCategoryMaxScore("no-such-category")).toBe(0);
  });
});

describe("пороги уровней", () => {
  it("maxScore накопительный и строго возрастает", () => {
    const sorted = [...levels].sort((a, b) => a.levelOrder - b.levelOrder);
    let previous = 0;

    sorted.forEach((level, index) => {
      const max = getLevelMaxScore(level.id);
      if (index === 0) {
        expect(max, `${level.id} — первый уровень должен совпадать со своей суммой`).toBe(
          categories.filter((c) => c.levelId === level.id).reduce((sum, c) => sum + getCategoryMaxScore(c.id), 0),
        );
      } else {
        expect(max).toBeGreaterThan(previous);
      }
      previous = max;
    });
  });

  it("minScore = maxScore предыдущего уровня + 80% своего", () => {
    const sorted = [...levels].sort((a, b) => a.levelOrder - b.levelOrder);

    sorted.forEach((level, index) => {
      if (index === 0) {
        expect(getLevelMinScore(level.id)).toBe(0);
        return;
      }

      const previousMax = getLevelMaxScore(sorted[index - 1].id);
      const ownMax = getLevelMaxScore(level.id) - previousMax;
      expect(getLevelMinScore(level.id)).toBe(previousMax + Math.round(ownMax * LEVEL_UP_THRESHOLD));
    });
  });

  it("порог перехода всегда ниже потолка своего уровня", () => {
    for (const level of levels) {
      expect(getLevelMinScore(level.id)).toBeLessThanOrEqual(getLevelMaxScore(level.id));
    }
  });

  it("итоговый потолок равен сумме весов всех скиллов", () => {
    const sumOfWeights = skills.reduce((sum, s) => sum + getSkillWeight(s.id), 0);
    expect(getTotalMaxScore()).toBe(sumOfWeights);
    expect(getTotalMaxScore()).toBe(3206);
  });
});