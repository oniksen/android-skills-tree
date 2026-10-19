import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userCurrencyPath } from "./paths";
import { EMPTY_CURRENCY } from "@/core/domain/currency";
import type { CurrencyRepository } from "@/ports/currency-repository";
import type { CurrencyData } from "@/types";

export function createCurrencyRepository(): CurrencyRepository {
  return {
    subscribe(uid, observer) {
      const ref = doc(db, ...userCurrencyPath(uid));
      return onSnapshot(
        ref,
        (snapshot) => {
          if (!snapshot.exists()) {
            observer.next(EMPTY_CURRENCY);
            return;
          }
          const raw = snapshot.data();
          const currency: CurrencyData = {
            balance: typeof raw.balance === "number" ? raw.balance : 0,
            items: (raw.items as Record<string, number>) ?? {},
            updatedAt: (raw.updatedAt as Date) ?? new Date(),
          };
          observer.next(currency);
        },
        (error) => observer.error?.(error),
      );
    },
  };
}
