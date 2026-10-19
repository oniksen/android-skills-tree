export interface ToastState {
  message: string | null;
  id: number;
}

export type ToastAction =
  | { type: "show"; message: string; id: number }
  | { type: "dismiss" };

export function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case "show":
      return { message: action.message, id: action.id };
    case "dismiss":
      return { ...state, message: null };
    default:
      return state;
  }
}

export const INITIAL_TOAST_STATE: ToastState = { message: null, id: 0 };
