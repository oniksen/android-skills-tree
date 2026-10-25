import { describe, it, expect } from "vitest";
import { getSkillById } from "@/data/skills";
import { levels } from "@/data/levels";
import {
  allQuizQuestions,
  quizQuestionsBySkill,
  getQuizQuestionsBySkill,
  QUIZ_GRADES,
  getGradeLevelOrder,
} from "@/data/quiz-questions";

describe("quiz questions", () => {
  it("has questions", () => {
    expect(allQuizQuestions.length).toBeGreaterThan(0);
  });

  it("every question references an existing skill", () => {
    for (const q of allQuizQuestions) {
      expect(getSkillById(q.skillId), q.id).toBeDefined();
    }
  });

  it("has unique question ids", () => {
    const ids = allQuizQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has non-empty required fields", () => {
    for (const q of allQuizQuestions) {
      expect(q.question.trim().length).toBeGreaterThan(0);
      expect(q.rubric.trim().length).toBeGreaterThan(0);
      expect(q.topic.trim().length).toBeGreaterThan(0);
    }
  });

  it("groups questions by skill id", () => {
    for (const [skillId, questions] of Object.entries(quizQuestionsBySkill)) {
      expect(getSkillById(skillId)).toBeDefined();
      expect(questions.every((q) => q.skillId === skillId)).toBe(true);
      expect(getQuizQuestionsBySkill(skillId)).toEqual(questions);
    }
  });

  it("has valid grades", () => {
    for (const q of allQuizQuestions) {
      expect(QUIZ_GRADES).toContain(q.grade);
    }
  });

  it("has questions for every grade", () => {
    for (const grade of QUIZ_GRADES) {
      expect(allQuizQuestions.some((q) => q.grade === grade)).toBe(true);
    }
  });

  it("has Android Basics questions for every grade", () => {
    const androidQuestions = allQuizQuestions.filter(
      (q) => q.topic === "Android Basics",
    );
    for (const grade of QUIZ_GRADES) {
      expect(androidQuestions.some((q) => q.grade === grade)).toBe(true);
    }
  });

  it("maps grades to level order", () => {
    expect(getGradeLevelOrder("junior")).toBeLessThan(getGradeLevelOrder("senior"));
    expect(levels.map((l) => l.id)).toContain("junior");
  });

  it("includes lower grades when filtering for a higher grade", () => {
    const middlePool = allQuizQuestions.filter(
      (q) => getGradeLevelOrder(q.grade) <= getGradeLevelOrder("middle"),
    );
    expect(middlePool.some((q) => q.grade === "junior")).toBe(true);
    expect(middlePool.some((q) => q.grade === "middle")).toBe(true);
    expect(middlePool.every((q) => getGradeLevelOrder(q.grade) <= 2)).toBe(true);
  });
});
