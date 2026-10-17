import { describe, it, expect } from "vitest";
import { computeAssessmentToggle } from "./compute-assessment-toggle";
import { getCrystalRewardForSkill } from "@/core/domain/currency";
import { skills } from "@/data/skills";

const skill = skills.find((s) => s.id === "junior-osnovy-perem")!;
const allSubtopics = Object.fromEntries(skill.subtopics.map((st) => [st, true]));
const reward = getCrystalRewardForSkill(skill.id);

describe("computeAssessmentToggle", () => {
  it("marks a subtopic as done without awarding until the skill completes", () => {
    const result = computeAssessmentToggle({
      skillId: skill.id,
      subtopicName: skill.subtopics[0],
      storedSubtopics: {},
      claimedSkills: {},
    });

    expect(result.nextValue).toBe(true);
    expect(result.nextSubtopics[skill.subtopics[0]]).toBe(true);
    expect(result.complete).toBe(false);
    expect(result.justCompleted).toBe(false);
    expect(result.awarded).toBe(0);
  });

  it("awards crystals when the last subtopic completes the skill", () => {
    const stored = { ...allSubtopics, [skill.subtopics[0]]: false };

    const result = computeAssessmentToggle({
      skillId: skill.id,
      subtopicName: skill.subtopics[0],
      storedSubtopics: stored,
      claimedSkills: {},
    });

    expect(result.complete).toBe(true);
    expect(result.justCompleted).toBe(true);
    expect(result.awarded).toBe(reward);
  });

  it("does not award again for an already claimed skill", () => {
    const stored = { ...allSubtopics, [skill.subtopics[0]]: false };

    const result = computeAssessmentToggle({
      skillId: skill.id,
      subtopicName: skill.subtopics[0],
      storedSubtopics: stored,
      claimedSkills: { [skill.id]: "2026-01-01T00:00:00.000Z" },
    });

    expect(result.complete).toBe(true);
    expect(result.awarded).toBe(0);
  });

  it("unchecking a subtopic never awards and is not a completion", () => {
    const result = computeAssessmentToggle({
      skillId: skill.id,
      subtopicName: skill.subtopics[0],
      storedSubtopics: allSubtopics,
      claimedSkills: {},
    });

    expect(result.nextValue).toBe(false);
    expect(result.complete).toBe(false);
    expect(result.justCompleted).toBe(false);
    expect(result.awarded).toBe(0);
  });
});
