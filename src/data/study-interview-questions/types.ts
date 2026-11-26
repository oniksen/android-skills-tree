export interface StudyInterviewQuestion {
  question: string;
  answer: string;
  rubric?: string;
  priority?: number;
}

export interface StudyInterviewTopic {
  grade: "junior" | "middle" | "strong-middle" | "senior";
  materialId: string;
  skillId: string;
  topic: string;
  questions: StudyInterviewQuestion[];
}
