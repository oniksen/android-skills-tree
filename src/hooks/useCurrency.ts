"use client";

import { useState, useEffect, useCallback } from "react";
import { useServices } from "@/composition/services-context";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
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

const currencyCache = new Map<
  string,
  {
    value: CurrencyData;
    loading: boolean;
    listeners: Set<(v: CurrencyData) => void>;
    errorListeners: Set<(e: unknown) => void>;
    unsub: (() => void) | null;
  }
>();

const INITIAL_STATE: CurrencyState = { currency: EMPTY_CURRENCY, loading: true };

export function useCurrency() {
  const { currency: repository } = useServices();
  const [state, setState] = useState<CurrencyState>(INITIAL_STATE);
  const [buying, setBuying] = useState(false);
  const { uid, loading: authLoading } = useFirebaseAuth();
  const toast = useToast();

  useEffect(() => {
    if (authLoading || !uid) return;

    let entry = currencyCache.get(uid);
    if (!entry) {
      entry = { value: EMPTY_CURRENCY, loading: true, listeners: new Set(), errorListeners: new Set(), unsub: null };
      currencyCache.set(uid, entry);
      entry.unsub = repository.subscribe(uid, {
        next: (currency) => {
          entry!.value = currency;
          entry!.loading = false;
          entry!.listeners.forEach((l) => l(currency));
        },
        error: (error) => {
          entry!.loading = false;
          entry!.errorListeners.forEach((l) => l(error));
        },
      });
    }

    const listener = (currency: CurrencyData) => setState({ currency, loading: false });
    const errorListener = (error: unknown) => {
      console.error("Error listening to currency:", error);
      if (isPermissionDenied(error)) {
        toast.show("Для отслеживания прогресса обратитесь к администратору.");
      }
      setState((prev) => ({ ...prev, loading: false }));
    };

    entry.listeners.add(listener);
    entry.errorListeners.add(errorListener);

    if (!entry.loading) {
      setTimeout(() => {
        setState({ currency: entry.value, loading: false });
      }, 0);
    }

    return () => {
      entry!.listeners.delete(listener);
      entry!.errorListeners.delete(errorListener);
      if (entry!.listeners.size === 0) {
        entry!.unsub?.();
        currencyCache.delete(uid);
      }
    };
  }, [uid, authLoading, repository, toast]);

  const signedOut = !authLoading && !uid;
  const currency = signedOut ? EMPTY_CURRENCY : state.currency;
  const loading = signedOut ? false : state.loading;

  const buyFreeze = useCallback(async (): Promise<BuyResult> => {
    setBuying(true);
    try {
      const result = await buyItem(STREAK_FREEZE_ITEM_ID);
      if (result && (result as { reason?: string }).reason === "permission-denied") {
        toast.show("Для отслеживания прогресса обратитесь к администратору.");
      }
      return result;
    } finally {
      setBuying(false);
    }
  }, [toast]);

  return {
    balance: currency.balance,
    freezes: getFreezeCount(currency),
    loading,
    buying,
    buyFreeze,
  };
}
