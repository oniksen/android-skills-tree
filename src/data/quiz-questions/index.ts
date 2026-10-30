import { juniorQuizQuestions } from "./junior";
import { middleQuizQuestions } from "./middle";
import { strongMiddleQuizQuestions } from "./strong-middle";
import { seniorQuizQuestions } from "./senior";

import type { QuizQuestion, QuizGrade } from "./types";

export type { QuizQuestion, QuizGrade } from "./types";

export const allQuizQuestions: QuizQuestion[] = [
  ...juniorQuizQuestions,
  ...middleQuizQuestions,
  ...strongMiddleQuizQuestions,
  ...seniorQuizQuestions,
];

export const quizQuestionsBySkill: Record<string, QuizQuestion[]> = allQuizQuestions.reduce(
  (acc, question) => {
    (acc[question.skillId] ??= []).push(question);
    return acc;
  },
  {} as Record<string, QuizQuestion[]>,
);

export function getQuizQuestionsBySkill(skillId: string): QuizQuestion[] {
  return quizQuestionsBySkill[skillId] ?? [];
}

export const QUIZ_GRADES: QuizGrade[] = [
  "junior",
  "middle",
  "strong-middle",
  "senior",
];

export function getGradeLevelOrder(grade: QuizGrade): number {
  switch (grade) {
    case "junior":
      return 1;
    case "middle":
      return 2;
    case "strong-middle":
      return 3;
    case "senior":
      return 4;
  }
}

export function getQuizGradeCounts(skillId: string): Record<QuizGrade, number> {
  const counts = QUIZ_GRADES.reduce((acc, grade) => {
    acc[grade] = 0;
    return acc;
  }, {} as Record<QuizGrade, number>);
  for (const q of getQuizQuestionsBySkill(skillId)) counts[q.grade] += 1;
  return counts;
}

export function getTotalQuizQuestions(skillId: string): number {
  return getQuizQuestionsBySkill(skillId).length;
}

/** @deprecated Use allQuizQuestions */
export const juniorProgrammingBasicsQuestions = allQuizQuestions;
