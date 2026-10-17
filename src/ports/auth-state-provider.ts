import type { Observer, Unsubscribe } from "./observation";

export interface AuthState {
  uid: string | null;
  email: string | null;
  loading: boolean;
}

export interface AuthStateProvider {
  subscribe(observer: Observer<AuthState>): Unsubscribe;
}
