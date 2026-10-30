export type Difficulty = "easy" | "medium" | "hard";

export interface Skill {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  subtopics: string[];
  difficulty: Difficulty;
  sortOrder: number;
  requiredForLevelUp: boolean;
  studyMaterial?: string;
}
