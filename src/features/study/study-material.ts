import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  const snap = await getDoc(doc(db, "studyMaterials", id));
  if (!snap.exists()) return null;
  const data = snap.data() as Omit<StudyMaterialContent, "id">;
  return { id: snap.id, ...data };
}
