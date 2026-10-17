import type { CurrencyData } from "@/types";
import type { Observer, Unsubscribe } from "./observation";

export interface CurrencyRepository {
  subscribe(uid: string, observer: Observer<CurrencyData>): Unsubscribe;
}
