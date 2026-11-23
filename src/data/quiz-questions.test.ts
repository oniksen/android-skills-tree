import { describe, it, expect } from "vitest";
import { getSkillById } from "@/data/skills";
import { levels } from "@/data/levels";
import {
  allQuizQuestions,
  quizQuestionsBySkill,
  getQuizQuestionsBySkill,
  QUIZ_GRADES,
  getGradeLevelOrder,
  getQuizGradeCounts,
  getTotalQuizQuestions,
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

  it("каждый грейд покрыт вопросами по платформе Android", () => {
    const platformCategoryByGrade: Record<string, string> = {
      junior: "junior-android",
      middle: "middle-components",
      "strong-middle": "strong-arch",
      senior: "senior-platform",
    };

    for (const grade of QUIZ_GRADES) {
      const categoryId = platformCategoryByGrade[grade];
      expect(categoryId, `грейд ${grade} без platform-категории`).toBeDefined();
      const covered = allQuizQuestions.some(
        (q) => q.grade === grade && getSkillById(q.skillId)?.categoryId === categoryId,
      );
      expect(covered, `грейд ${grade}: нет вопросов по категории ${categoryId}`).toBe(true);
    }
  });

  it("maps grades to level order", () => {
    expect(getGradeLevelOrder("junior")).toBeLessThan(getGradeLevelOrder("senior"));
    expect(levels.map((l) => l.id)).toContain("junior");
  });

  it("counts quiz questions per grade for a skill", () => {
    const sample = allQuizQuestions[0];
    const questions = getQuizQuestionsBySkill(sample.skillId);
    const counts = getQuizGradeCounts(sample.skillId);

    expect(getTotalQuizQuestions(sample.skillId)).toBe(questions.length);
    expect(QUIZ_GRADES.reduce((sum, grade) => sum + counts[grade], 0)).toBe(questions.length);
    expect(counts[sample.grade]).toBeGreaterThan(0);
    expect(Object.keys(counts).sort()).toEqual([...QUIZ_GRADES].sort());
  });

  it("returns zero counts for unknown skill", () => {
    const counts = getQuizGradeCounts("non-existent-skill");
    expect(getTotalQuizQuestions("non-existent-skill")).toBe(0);
    for (const grade of QUIZ_GRADES) expect(counts[grade]).toBe(0);
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
