import type { AssessmentData } from "@/types";
import type { Observer, Unsubscribe } from "./observation";

export type AssessmentMap = Record<string, AssessmentData>;

export interface AssessmentRepository {
  subscribe(uid: string, observer: Observer<AssessmentMap>): Unsubscribe;
}
