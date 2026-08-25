import { getAssessmentMap as getAssessmentMapFirestore } from "@/lib/firestore";

export async function getAssessmentMap(userId: string): Promise<Record<string, number>> {
  return getAssessmentMapFirestore(userId);
}
