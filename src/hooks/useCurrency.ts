"use client";

import { useState, useEffect, useCallback } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useFirebaseAuth } from "./useFirebaseAuth";
import {
  buyItem,
  getFreezeCount,
  EMPTY_CURRENCY,
  type BuyResult,
} from "@/lib/currency";
import { STREAK_FREEZE_ITEM_ID } from "@/data/shop";
import type { CurrencyData } from "@/types";

interface CurrencyState {
  currency: CurrencyData;
  loading: boolean;
}

const INITIAL_STATE: CurrencyState = { currency: EMPTY_CURRENCY, loading: true };

export function useCurrency() {
  const [state, setState] = useState<CurrencyState>(INITIAL_STATE);
  const [buying, setBuying] = useState(false);
  const { uid, loading: authLoading } = useFirebaseAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!uid) return;

    const currencyRef = doc(db, "users", uid, "currency", "current");
    const unsubscribe = onSnapshot(currencyRef, (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.data();
        setState({
          currency: {
            balance: typeof raw.balance === "number" ? raw.balance : 0,
            items: (raw.items as Record<string, number>) ?? {},
            updatedAt: (raw.updatedAt as Date) ?? new Date(),
          },
          loading: false,
        });
      } else {
        setState({ currency: EMPTY_CURRENCY, loading: false });
      }
    });

    return () => unsubscribe();
  }, [uid, authLoading]);

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
