import type { AuthStateProvider } from "./auth-state-provider";
import type { StateRepository } from "./state-repository";

export interface Services {
  auth: AuthStateProvider;
  state: StateRepository;
}