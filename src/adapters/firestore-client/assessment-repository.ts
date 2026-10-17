import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userAssessmentsPath } from "./paths";
import { calcSkillScore } from "@/lib/scoring";
import type {
  AssessmentMap,
  AssessmentRepository,
} from "@/ports/assessment-repository";

export function createAssessmentRepository(): AssessmentRepository {
  return {
    subscribe(uid, observer) {
      const ref = collection(db, ...userAssessmentsPath(uid));
      return onSnapshot(
        ref,
        (snapshot) => {
          const map: AssessmentMap = {};
          snapshot.forEach((doc) => {
            const data = doc.data();
            const subtopics = data.subtopics;
            map[doc.id] = {
              score: subtopics ? calcSkillScore(doc.id, subtopics) : data.score || 0,
              subtopics,
            };
          });
          observer.next(map);
        },
        (error) => observer.error?.(error),
      );
    },
  };
}
