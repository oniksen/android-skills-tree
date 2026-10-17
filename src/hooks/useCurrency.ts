"use client";

import { useState, useEffect, useCallback } from "react";
import { useServices } from "@/composition/services-context";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { buyItemAction } from "@/features/shop/actions";
import { getFreezeCount, EMPTY_CURRENCY } from "@/core/domain/currency";
import type { BuyResult } from "@/core/domain/currency";
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

  const buyFreeze = useCallback(
    async (): Promise<BuyResult> => {
      setBuying(true);
      try {
        return await buyItemAction("streak_freeze");
      } finally {
        setBuying(false);
      }
    },
    [],
  );

  const signedOut = !authLoading && !uid;
  const currency = signedOut ? EMPTY_CURRENCY : state.currency;

  return {
    balance: currency.balance,
    freezes: getFreezeCount(currency),
    loading: signedOut ? false : state.loading,
    buying,
    buyFreeze,
  };
}
