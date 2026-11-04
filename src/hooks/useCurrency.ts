"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useServices } from "@/composition/services-context";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { isQuotaExceeded } from "@/shared/lib/quota";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { buyItem } from "@/adapters/firestore-client/currency-commands";
import {
  getFreezeCount,
  EMPTY_CURRENCY,
  type BuyResult,
} from "@/core/domain/currency";
import { STREAK_FREEZE_ITEM_ID } from "@/data/shop";
import { createLiveStore } from "@/shared/lib/live-store";
import { useLiveStore } from "@/shared/lib/use-live-store";
import type { Observer } from "@/ports/observation";
import type { CurrencyData } from "@/types";

// One listener per user for the whole session.
const currencyStore = createLiveStore<CurrencyData>();

export function useCurrency() {
  const { currency: repository } = useServices();
  const [buying, setBuying] = useState(false);
  const { uid, loading: authLoading } = useFirebaseAuth();
  const toast = useToast();
  const showToast = toast.show;

  const start = useMemo(
    () =>
      uid
        ? (observer: Observer<CurrencyData>) => repository.subscribe(uid, observer)
        : null,
    [uid, repository],
  );

  const snapshot = useLiveStore(currencyStore, uid, start);

  useEffect(() => {
    const error = snapshot.error;
    if (!error) return;
    console.error("Error listening to currency:", error);
    if (isPermissionDenied(error)) {
      showToast("Для отслеживания прогресса обратитесь к администратору.");
    }
    if (isQuotaExceeded(error)) {
      showToast("Квота Firestore исчерпана. Повторите позже.");
    }
  }, [snapshot.error, showToast]);

  const signedOut = !authLoading && !uid;
  const currency = signedOut ? EMPTY_CURRENCY : (snapshot.data ?? EMPTY_CURRENCY);
  const loading = signedOut ? false : authLoading || snapshot.loading;

  const buyFreeze = useCallback(async (): Promise<BuyResult> => {
    setBuying(true);
    try {
      const result = await buyItem(STREAK_FREEZE_ITEM_ID);
      if (result && (result as { reason?: string }).reason === "permission-denied") {
        showToast("Для отслеживания прогресса обратитесь к администратору.");
      }
      return result;
    } finally {
      setBuying(false);
    }
  }, [showToast]);

  return {
    balance: currency.balance,
    freezes: getFreezeCount(currency),
    loading,
    buying,
    buyFreeze,
  };
}
