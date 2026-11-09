import { createFirebaseAuthStateProvider } from "@/adapters/auth/firebase-auth-state";
import { createStateRepository } from "./state-repository";
import type { Services } from "@/ports/services";

export function createClientServices(): Services {
  return {
    auth: createFirebaseAuthStateProvider(),
    state: createStateRepository(),
  };
}