export type QuizGrade = "junior" | "middle" | "strong-middle" | "senior";

export interface QuizQuestion {
  id: string;
  skillId: string;
  grade: QuizGrade;
  topic: string;
  question: string;
  rubric: string;
}
