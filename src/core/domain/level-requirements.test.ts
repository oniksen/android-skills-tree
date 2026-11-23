import { describe, expect, it } from "vitest";
import { getLevelUpRequirements, getNextLevel } from "./level-requirements";
import { getCategoriesByLevelId } from "@/data/categories";
import { getSkillsByLevelId } from "@/data/skills";
import {
  getCategoryMaxScore,
  getLevelMinScore,
  LEVEL_UP_THRESHOLD,
} from "./weights";
import { calcCategoryScore, calcTotalScore } from "./scoring";
import type { Level } from "@/data/levels";
import type { AssessmentData } from "@/types";

function fullyDone(subtopics: string[]): AssessmentData {
  return {
    score: 0,
    subtopics: Object.fromEntries(subtopics.map((name) => [name, true])),
  };
}

function completedLevelAssessments(
  levelId: string,
): Record<string, AssessmentData> {
  return Object.fromEntries(
    getSkillsByLevelId(levelId).map((skill) => [
      skill.id,
      fullyDone(skill.subtopics),
    ]),
  );
}

describe("getNextLevel", () => {
  it("returns the next level in order", () => {
    expect(getNextLevel("junior")?.id).toBe("middle");
    expect(getNextLevel("middle")?.id).toBe("strong-middle");
    expect(getNextLevel("strong-middle")?.id).toBe("senior");
  });

  it("returns null at the maximum level", () => {
    expect(getNextLevel("senior")).toBeNull();
  });

  it("returns null for an unknown level id", () => {
    expect(getNextLevel("unknown")).toBeNull();
  });
});

describe("getLevelUpRequirements", () => {
  it("returns no requirements without a next level", () => {
    expect(
      getLevelUpRequirements({
        currentLevelId: "senior",
        nextLevel: null,
        assessmentMap: {},
        projectMap: {},
      }),
    ).toEqual([]);
  });

  it("returns categories, xp, skills and projects for junior -> middle", () => {
    const requirements = getLevelUpRequirements({
      currentLevelId: "junior",
      nextLevel: getNextLevel("junior"),
      assessmentMap: {},
      projectMap: {},
    });

    expect(requirements.map((item) => item.id)).toEqual([
      "categories",
      "xp",
      "skills",
      "projects",
    ]);
    const byId = Object.fromEntries(requirements.map((item) => [item.id, item]));
    expect(byId.categories).toMatchObject({
      current: 0,
      target: getCategoriesByLevelId("junior").length,
      done: false,
    });
    expect(byId.xp).toMatchObject({
      current: 0,
      target: getLevelMinScore("middle"),
      done: false,
    });
    expect(byId.skills).toMatchObject({
      current: 0,
      target: getSkillsByLevelId("middle").filter((s) => s.requiredForLevelUp)
        .length,
      done: false,
    });
    expect(byId.projects).toMatchObject({
      current: 0,
      target: 2,
      done: false,
    });
  });

  it("marks the categories item done only when every category reaches the threshold", () => {
    const juniorSkills = getSkillsByLevelId("junior");
    const assessmentMap = Object.fromEntries(
      juniorSkills.map((skill) => [
        skill.id,
        fullyDone(skill.subtopics),
      ]),
    );
    const categories = getCategoriesByLevelId("junior");
    const expectedCurrent = categories.filter(
      (category) =>
        calcCategoryScore(category.id, assessmentMap) >=
        getCategoryMaxScore(category.id) * LEVEL_UP_THRESHOLD,
    ).length;

    const item = getLevelUpRequirements({
      currentLevelId: "junior",
      nextLevel: getNextLevel("junior"),
      assessmentMap,
      projectMap: {},
    }).find((requirement) => requirement.id === "categories");

    expect(item).toMatchObject({
      current: expectedCurrent,
      target: categories.length,
      done: expectedCurrent === categories.length,
    });
  });

  it("marks required skills done when each has a score of at least 1", () => {
    const required = getSkillsByLevelId("middle").filter(
      (skill) => skill.requiredForLevelUp,
    );
    const assessmentMap = Object.fromEntries(
      required.map((skill) => [skill.id, { score: 1, subtopics: {} }]),
    );

    const item = getLevelUpRequirements({
      currentLevelId: "junior",
      nextLevel: getNextLevel("junior"),
      assessmentMap,
      projectMap: {},
    }).find((requirement) => requirement.id === "skills");

    expect(item).toMatchObject({
      current: required.length,
      target: required.length,
      done: true,
    });
  });

  it("counts completed projects against the next level requirement", () => {
    const item = getLevelUpRequirements({
      currentLevelId: "junior",
      nextLevel: getNextLevel("junior"),
      assessmentMap: {},
      projectMap: { a: true, b: true },
    }).find((requirement) => requirement.id === "projects");

    expect(item).toMatchObject({ current: 2, target: 2, done: true });
  });

  it("reports partial category progress between zero and the target", () => {
    const categories = getCategoriesByLevelId("junior");
    const skipped = categories[categories.length - 1];
    const assessmentMap = Object.fromEntries(
      getSkillsByLevelId("junior")
        .filter((skill) => skill.categoryId !== skipped.id)
        .map((skill) => [skill.id, fullyDone(skill.subtopics)]),
    );

    const item = getLevelUpRequirements({
      currentLevelId: "junior",
      nextLevel: getNextLevel("junior"),
      assessmentMap,
      projectMap: {},
    }).find((requirement) => requirement.id === "categories");

    expect(item?.current).toBeGreaterThan(0);
    expect(item?.current).toBeLessThan(categories.length);
    expect(item).toMatchObject({ done: false, target: categories.length });
  });

  it("reports partial XP progress between zero and the target", () => {
    const assessmentMap = completedLevelAssessments("junior");
    const target = getLevelMinScore("middle");

    const item = getLevelUpRequirements({
      currentLevelId: "junior",
      nextLevel: getNextLevel("junior"),
      assessmentMap,
      projectMap: {},
    }).find((requirement) => requirement.id === "xp");

    expect(item?.current).toBe(calcTotalScore(assessmentMap));
    expect(item?.current).toBeGreaterThan(0);
    expect(item?.current).toBeLessThan(target);
    expect(item).toMatchObject({ done: false, target });
  });

  it("reports partial required-skill progress between zero and the target", () => {
    const required = getSkillsByLevelId("middle").filter(
      (skill) => skill.requiredForLevelUp,
    );
    const passed = required.slice(0, required.length - 1);
    const assessmentMap = Object.fromEntries(
      passed.map((skill) => [skill.id, { score: 1, subtopics: {} }]),
    );

    const item = getLevelUpRequirements({
      currentLevelId: "junior",
      nextLevel: getNextLevel("junior"),
      assessmentMap,
      projectMap: {},
    }).find((requirement) => requirement.id === "skills");

    expect(item?.current).toBe(passed.length);
    expect(item?.current).toBeGreaterThan(0);
    expect(item?.current).toBeLessThan(required.length);
    expect(item).toMatchObject({ done: false, target: required.length });
  });

  it("reports partial project progress between zero and the target", () => {
    const target = getNextLevel("junior")?.requiredProjectCount ?? 0;
    const item = getLevelUpRequirements({
      currentLevelId: "junior",
      nextLevel: getNextLevel("junior"),
      assessmentMap: {},
      projectMap: { first: true },
    }).find((requirement) => requirement.id === "projects");

    expect(item?.current).toBe(1);
    expect(item?.current).toBeGreaterThan(0);
    expect(item?.current).toBeLessThan(target);
    expect(item).toMatchObject({ done: false, target });
  });

  it("omits requirements whose target is zero", () => {
    const synthetic: Level = {
      id: "synthetic",
      name: "Synthetic",
      slug: "synthetic",
      description: "",
      levelOrder: 99,
      requiredProjectCount: 0,
    };

    const requirements = getLevelUpRequirements({
      currentLevelId: "junior",
      nextLevel: synthetic,
      assessmentMap: {},
      projectMap: {},
    });

    expect(requirements.map((item) => item.id)).toEqual(["categories", "xp"]);
  });
});
