"use client";

import { useState, useEffect, useCallback } from "react";
import { useServices } from "@/composition/services-context";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { buyItem } from "@/adapters/firestore-client/currency-commands";
import {
  getFreezeCount,
  EMPTY_CURRENCY,
  type BuyResult,
} from "@/core/domain/currency";
import { STREAK_FREEZE_ITEM_ID } from "@/data/shop";
import type { CurrencyData } from "@/types";

interface CurrencyState {
  currency: CurrencyData;
  loading: boolean;
}

const INITIAL_STATE: CurrencyState = { currency: EMPTY_CURRENCY, loading: true };

export function useCurrency() {
  const { currency: repository } = useServices();
  const [state, setState] = useState<CurrencyState>(INITIAL_STATE);
  const [buying, setBuying] = useState(false);
  const { uid, loading: authLoading } = useFirebaseAuth();

  useEffect(() => {
    if (authLoading || !uid) return;

    return repository.subscribe(uid, {
      next: (currency) => setState({ currency, loading: false }),
      error: (error) => {
        console.error("Error listening to currency:", error);
        setState((prev) => ({ ...prev, loading: false }));
      },
    });
  }, [uid, authLoading, repository]);

  const signedOut = !authLoading && !uid;
  const currency = signedOut ? EMPTY_CURRENCY : state.currency;
  const loading = signedOut ? false : state.loading;

  const buyFreeze = useCallback(async (): Promise<BuyResult> => {
    setBuying(true);
    try {
      return await buyItem(STREAK_FREEZE_ITEM_ID);
    } finally {
      setBuying(false);
    }
  }, []);

  return {
    balance: currency.balance,
    freezes: getFreezeCount(currency),
    loading,
    buying,
    buyFreeze,
  };
}
