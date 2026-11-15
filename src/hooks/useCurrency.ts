"use client";

import { useCallback, useState } from "react";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { useUserState } from "./useUserState";
import { buyItem } from "@/adapters/firestore-client/currency-commands";
import {
  getFreezeCount,
  EMPTY_CURRENCY,
  type BuyResult,
} from "@/core/domain/currency";
import { STREAK_FREEZE_ITEM_ID } from "@/data/shop";
import { useToast } from "@/shared/lib/toast-context";

export function useCurrency() {
  const [buying, setBuying] = useState(false);
  const { uid, loading: authLoading } = useFirebaseAuth();
  const { state, loading: stateLoading } = useUserState();
  const toast = useToast();
  const showToast = toast.show;

  const signedOut = !authLoading && !uid;
  const currency = signedOut ? EMPTY_CURRENCY : (state?.currency ?? EMPTY_CURRENCY);
  const loading = signedOut ? false : stateLoading;

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