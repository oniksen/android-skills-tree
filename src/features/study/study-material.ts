import { STUDY_MATERIALS } from "./study-materials.generated";

export interface StudyMaterialContent {
  id: string;
  title: string;
  grade: string;
  categoryId: string;
  content: string;
}

export async function fetchStudyMaterial(
  id: string,
): Promise<StudyMaterialContent | null> {
  return STUDY_MATERIALS[id] ?? null;
}