import { describe, expect, it } from "vitest";
import { getLevelUpRequirements, getNextLevel } from "./level-requirements";
import { getSkillsByLevelId } from "@/data/skills";
import type { Level } from "@/data/levels";
import type { AssessmentData } from "@/types";

function fullyDone(subtopics: string[]): AssessmentData {
  return {
    score: 0,
    subtopics: Object.fromEntries(subtopics.map((name) => [name, true])),
  };
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

  it("returns skills and projects for junior -> middle", () => {
    const requirements = getLevelUpRequirements({
      currentLevelId: "junior",
      nextLevel: getNextLevel("junior"),
      assessmentMap: {},
      projectMap: {},
    });

    expect(requirements.map((item) => item.id)).toEqual(["skills", "projects"]);
    const byId = Object.fromEntries(requirements.map((item) => [item.id, item]));
    expect(byId.skills).toMatchObject({
      current: 0,
      target: getSkillsByLevelId("junior").filter((s) => s.requiredForLevelUp)
        .length,
      done: false,
    });
    expect(byId.projects).toMatchObject({
      current: 0,
      target: 2,
      done: false,
    });
  });

  it("marks required skills done only when every required skill is fully complete", () => {
    const required = getSkillsByLevelId("junior").filter(
      (skill) => skill.requiredForLevelUp,
    );
    const assessmentMap = Object.fromEntries(
      required.map((skill) => [skill.id, fullyDone(skill.subtopics)]),
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

  it("reports partial required-skill progress between zero and the target", () => {
    const required = getSkillsByLevelId("junior").filter(
      (skill) => skill.requiredForLevelUp,
    );
    const passed = required.slice(0, required.length - 1);
    const assessmentMap = Object.fromEntries(
      passed.map((skill) => [skill.id, fullyDone(skill.subtopics)]),
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

  it("counts completed projects against the next level requirement", () => {
    const item = getLevelUpRequirements({
      currentLevelId: "junior",
      nextLevel: getNextLevel("junior"),
      assessmentMap: {},
      projectMap: { a: true, b: true },
    }).find((requirement) => requirement.id === "projects");

    expect(item).toMatchObject({ current: 2, target: 2, done: true });
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

  it("omits skills and projects when both targets are zero", () => {
    const synthetic: Level = {
      id: "synthetic",
      name: "Synthetic",
      slug: "synthetic",
      description: "",
      levelOrder: 99,
      requiredProjectCount: 0,
    };

    const requirements = getLevelUpRequirements({
      currentLevelId: "senior",
      nextLevel: synthetic,
      assessmentMap: {},
      projectMap: {},
    });

    expect(requirements).toEqual([]);
  });

  it("omits skills when the current grade has no required skills", () => {
    const synthetic: Level = {
      id: "synthetic",
      name: "Synthetic",
      slug: "synthetic",
      description: "",
      levelOrder: 99,
      requiredProjectCount: 2,
    };

    const requirements = getLevelUpRequirements({
      currentLevelId: "senior",
      nextLevel: synthetic,
      assessmentMap: {},
      projectMap: { first: true },
    });

    expect(requirements.map((item) => item.id)).toEqual(["projects"]);
  });
});
