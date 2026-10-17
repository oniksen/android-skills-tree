import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import type { AuthStateProvider } from "@/ports/auth-state-provider";

export function createFirebaseAuthStateProvider(): AuthStateProvider {
  return {
    subscribe(observer) {
      return onAuthStateChanged(auth, (user) => {
        observer.next({
          uid: user?.uid ?? null,
          email: user?.email ?? null,
          loading: false,
        });
      });
    },
  };
}
