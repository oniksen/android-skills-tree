import type { QuizQuestion } from "./types";
import { allStudyInterviewTopics } from "@/data/study-interview-questions";

export const studyInterviewQuizQuestions: QuizQuestion[] = allStudyInterviewTopics.flatMap((topic) =>
  topic.questions.map((q, index) => ({
    id: `sq-${topic.grade}-${topic.skillId}-${index}`,
    skillId: topic.skillId,
    grade: topic.grade as QuizQuestion["grade"],
    topic: topic.topic,
    question: q.question,
    rubric: q.rubric || "Оценивается полнота и корректность ответа по теме, соответствие ключевым понятиям и отсутствие фактических ошибок.",
    priority: q.priority ?? 3,
    source: "study",
  } as QuizQuestion)),
);