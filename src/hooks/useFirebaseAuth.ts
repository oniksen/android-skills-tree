"use client";

import { useState, useEffect } from "react";
import { useServices } from "@/composition/services-context";
import type { AuthState } from "@/ports/auth-state-provider";

const INITIAL_STATE: AuthState = { uid: null, email: null, loading: true };

export function useFirebaseAuth(): AuthState {
  const { auth } = useServices();
  const [state, setState] = useState<AuthState>(INITIAL_STATE);

  useEffect(() => {
    return auth.subscribe({ next: setState });
  }, [auth]);

  return state;
}
