"use client";

import { useEffect, useMemo } from "react";
import { useServices } from "@/composition/services-context";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { useLiveStore } from "@/shared/lib/use-live-store";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { isQuotaExceeded } from "@/shared/lib/quota";
import { userStateStore } from "@/shared/lib/user-state-store";
import type { Observer } from "@/ports/observation";
import type { UserState } from "@/types";

export function useUserState() {
  const { state: repository } = useServices();
  const { uid, loading: authLoading } = useFirebaseAuth();
  const toast = useToast();
  const showToast = toast.show;

  const start = useMemo(
    () =>
      uid
        ? (observer: Observer<UserState>) => repository.subscribe(uid, observer)
        : null,
    [uid, repository],
  );

  const snapshot = useLiveStore(userStateStore, uid, start);
  const signedOut = !authLoading && !uid;
  const loading = signedOut ? false : authLoading || snapshot.loading;

  useEffect(() => {
    const error = snapshot.error;
    if (!error) return;
    console.error("Error listening to user state:", error);
    if (isPermissionDenied(error)) {
      showToast("Для отслеживания прогресса обратитесь к администратору.");
    }
    if (isQuotaExceeded(error)) {
      showToast("Квота Firestore исчерпана. Повторите позже.");
    }
  }, [snapshot.error, showToast]);

  return {
    state: signedOut ? null : (snapshot.data ?? null),
    loading,
  };
}
