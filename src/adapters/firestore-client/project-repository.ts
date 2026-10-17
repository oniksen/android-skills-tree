import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userProjectsPath } from "./paths";
import type {
  ProjectMap,
  ProjectRepository,
} from "@/ports/project-repository";

export function createProjectRepository(): ProjectRepository {
  return {
    subscribe(uid, observer) {
      const ref = collection(db, ...userProjectsPath(uid));
      return onSnapshot(
        ref,
        (snapshot) => {
          const map: ProjectMap = {};
          snapshot.forEach((doc) => {
            map[doc.id] = doc.data().completed;
          });
          observer.next(map);
        },
        (error) => observer.error?.(error),
      );
    },
  };
}
