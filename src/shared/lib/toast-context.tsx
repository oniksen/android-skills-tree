"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useReducer,
  type ReactNode,
} from "react";
import { toastReducer, INITIAL_TOAST_STATE } from "./toast-state";

interface ToastContextValue {
  message: string | null;
  show: (message: string) => void;
  dismiss: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DURATION_MS = 2000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(toastReducer, INITIAL_TOAST_STATE);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    dispatch({ type: "dismiss" });
  }, []);

  const show = useCallback(
    (message: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      dispatch({ type: "show", message, id: Date.now() });
      timerRef.current = setTimeout(() => {
        dispatch({ type: "dismiss" });
        timerRef.current = null;
      }, DURATION_MS);
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ message: state.message, show, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
