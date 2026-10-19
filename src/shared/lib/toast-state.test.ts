import { describe, expect, it } from "vitest";
import { toastReducer, INITIAL_TOAST_STATE } from "./toast-state";

describe("toastReducer", () => {
  it("initial state has no message", () => {
    expect(INITIAL_TOAST_STATE.message).toBeNull();
  });

  it("show sets message", () => {
    const next = toastReducer(INITIAL_TOAST_STATE, { type: "show", message: "hi", id: 1 });
    expect(next.message).toBe("hi");
    expect(next.id).toBe(1);
  });

  it("show replaces previous message", () => {
    const s1 = toastReducer(INITIAL_TOAST_STATE, { type: "show", message: "a", id: 1 });
    const s2 = toastReducer(s1, { type: "show", message: "b", id: 2 });
    expect(s2.message).toBe("b");
    expect(s2.id).toBe(2);
  });

  it("dismiss clears message", () => {
    const s1 = toastReducer(INITIAL_TOAST_STATE, { type: "show", message: "a", id: 1 });
    const s2 = toastReducer(s1, { type: "dismiss" });
    expect(s2.message).toBeNull();
  });

  it("dismiss on empty state stays empty", () => {
    const s = toastReducer(INITIAL_TOAST_STATE, { type: "dismiss" });
    expect(s.message).toBeNull();
  });
});
