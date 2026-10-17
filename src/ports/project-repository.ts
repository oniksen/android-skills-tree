import type { Observer, Unsubscribe } from "./observation";

export type ProjectMap = Record<string, boolean>;

export interface ProjectRepository {
  subscribe(uid: string, observer: Observer<ProjectMap>): Unsubscribe;
}
