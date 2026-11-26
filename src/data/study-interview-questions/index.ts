import type { StudyInterviewTopic } from "./types";
import { juniorStudyInterviewQuestions } from "./junior";
import { middleStudyInterviewQuestions } from "./middle";
import { strongmiddleStudyInterviewQuestions } from "./strong-middle";
import { seniorStudyInterviewQuestions } from "./senior";

export type { StudyInterviewTopic, StudyInterviewQuestion } from "./types";

export const allStudyInterviewTopics: StudyInterviewTopic[] = [
  ...juniorStudyInterviewQuestions,
  ...middleStudyInterviewQuestions,
  ...strongmiddleStudyInterviewQuestions,
  ...seniorStudyInterviewQuestions,
];

export function getStudyInterviewTopics(materialId: string): StudyInterviewTopic[] {
  return allStudyInterviewTopics.filter((t) => t.materialId === materialId);
}
