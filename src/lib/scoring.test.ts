import { describe, expect, it } from "vitest";
import { skills } from "@/data/skills";
import { categories } from "@/data/categories";
import {
  calcCategoryScore,
  calcLevelScore,
  calcSkillCompletionPercent,
  calcSkillScore,
  calcTotalScore,
} from "@/lib/scoring";
import { getCategoryMaxScore, getSkillWeight } from "@/lib/weights";

function allSubtopicsChecked(skillId: string) {
  const skill = skills.find((s) => s.id === skillId)!;
  return Object.fromEntries(skill.subtopics.map((st) => [st, true]));
}

function noneChecked(skillId: string) {
  const skill = skills.find((s) => s.id === skillId)!;
  return Object.fromEntries(skill.subtopics.map((st) => [st, false]));
}

function firstNChecked(skillId: string, count: number) {
  const skill = skills.find((s) => s.id === skillId)!;
  return Object.fromEntries(skill.subtopics.map((st, i) => [st, i < count]));
}

const sampleSkillId = "junior-osnovy-perem";

describe("calcSkillScore", () => {
  it("возвращает 0 без отметок", () => {
    expect(calcSkillScore(sampleSkillId, noneChecked(sampleSkillId))).toBe(0);
  });

  it("возвращает 0 если карта не передана", () => {
    expect(calcSkillScore(sampleSkillId, undefined)).toBe(0);
  });

  it("возвращает 0 для неизвестного скилла", () => {
    expect(calcSkillScore("no-such-skill", { whatever: true })).toBe(0);
  });

  it("возвращает полный вес когда закрыты все подтемы", () => {
    for (const skill of skills) {
      expect(calcSkillScore(skill.id, allSubtopicsChecked(skill.id)), skill.id).toBe(
        getSkillWeight(skill.id),
      );
    }
  });

  it("считает пропорционально доле закрытых подтем", () => {
    const skill = skills.find((s) => s.id === sampleSkillId)!;
    const weight = getSkillWeight(sampleSkillId);

    for (let done = 0; done <= skill.subtopics.length; done++) {
      const expected = Math.round((done / skill.subtopics.length) * weight);
      expect(calcSkillScore(sampleSkillId, firstNChecked(sampleSkillId, done))).toBe(expected);
    }
  });

  it("даёт лёгкой теме меньше XP чем такой же по сложности теме старшего уровня", () => {
    const juniorEasy = skills.find((s) => s.difficulty === "easy" && s.categoryId.startsWith("junior"))!;
    const middleEasy = skills.find((s) => s.difficulty === "easy" && s.categoryId.startsWith("middle"))!;

    expect(calcSkillScore(middleEasy.id, allSubtopicsChecked(middleEasy.id))).toBeGreaterThan(
      calcSkillScore(juniorEasy.id, allSubtopicsChecked(juniorEasy.id)),
    );
  });

  it("даёт тяжёлой теме больше XP чем лёгкой того же уровня", () => {
    const hard = skills.find((s) => s.difficulty === "hard" && s.categoryId.startsWith("middle"))!;
    const easy = skills.find((s) => s.difficulty === "easy" && s.categoryId.startsWith("middle"))!;

    expect(calcSkillScore(hard.id, allSubtopicsChecked(hard.id))).toBeGreaterThan(
      calcSkillScore(easy.id, allSubtopicsChecked(easy.id)),
    );
  });
});

describe("calcSkillCompletionPercent", () => {
  it("считает процент независимо от веса", () => {
    expect(calcSkillCompletionPercent(sampleSkillId, noneChecked(sampleSkillId))).toBe(0);
    expect(calcSkillCompletionPercent(sampleSkillId, allSubtopicsChecked(sampleSkillId))).toBe(100);
    expect(calcSkillCompletionPercent(sampleSkillId, undefined)).toBe(0);
  });
});

describe("calcCategoryScore", () => {
  it("равна 0 для пустой карты", () => {
    expect(calcCategoryScore("junior-osnovy", {})).toBe(0);
  });

  it("равна сумме очков скиллов категории", () => {
    const assessmentMap = {
      [sampleSkillId]: { subtopics: allSubtopicsChecked(sampleSkillId) },
    };
    const expected = getSkillWeight(sampleSkillId);
    expect(calcCategoryScore("junior-osnovy", assessmentMap)).toBe(expected);
  });

  it("достигает потолка категории когда закрыты все скиллы", () => {
    const assessmentMap = Object.fromEntries(
      skills.map((s) => [s.id, { subtopics: allSubtopicsChecked(s.id) }]),
    );

    for (const category of categories) {
      expect(calcCategoryScore(category.id, assessmentMap), category.id).toBe(
        getCategoryMaxScore(category.id),
      );
    }
  });
});

describe("calcTotalScore и calcLevelScore", () => {
  const complete = Object.fromEntries(
    skills.map((s) => [s.id, { subtopics: allSubtopicsChecked(s.id) }]),
  );

  it("итоговый XP равен сумме всех скиллов", () => {
    const expected = skills.reduce((sum, s) => sum + getSkillWeight(s.id), 0);
    expect(calcTotalScore(complete)).toBe(expected);
  });

  it("итоговый XP не зависит от порядка и лишних ключей", () => {
    const withNoise = { ...complete, "ghost-skill": { subtopics: { x: true } } };
    expect(calcTotalScore(withNoise)).toBe(calcTotalScore(complete));
  });

  it("сумма по уровням сходится с общим итогом", () => {
    const perLevel = ["junior", "middle", "strong-middle", "senior"].reduce(
      (sum, levelId) => sum + calcLevelScore(levelId, complete),
      0,
    );
    expect(perLevel).toBe(calcTotalScore(complete));
  });

  it("уровень полностью закрыт даёт ровно 80% от своего потолка", () => {
    for (const levelId of ["junior", "middle", "strong-middle", "senior"]) {
      const levelMax = categories
        .filter((c) => c.levelId === levelId)
        .reduce((sum, c) => sum + getCategoryMaxScore(c.id), 0);

      const closed = Object.fromEntries(
        skills
          .filter((s) => categories.find((c) => c.id === s.categoryId)?.levelId === levelId)
          .map((s) => [s.id, { subtopics: allSubtopicsChecked(s.id) }]),
      );

      expect(calcLevelScore(levelId, complete), levelId).toBe(levelMax);
      expect(calcLevelScore(levelId, closed), levelId).toBe(levelMax);
    }
  });
});