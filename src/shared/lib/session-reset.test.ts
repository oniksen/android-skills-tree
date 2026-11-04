import { describe, expect, it, vi } from "vitest";
import { registerSessionReset, resetSession } from "./session-reset";

describe("session reset registry", () => {
  it("runs every registered reset", () => {
    const first = vi.fn();
    const second = vi.fn();
    const offFirst = registerSessionReset(first);
    const offSecond = registerSessionReset(second);

    resetSession();

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    offFirst();
    offSecond();
  });

  it("stops running a reset after it is unregistered", () => {
    const reset = vi.fn();
    const off = registerSessionReset(reset);

    off();
    resetSession();

    expect(reset).not.toHaveBeenCalled();
  });

  it("keeps running other resets when one throws", () => {
    const failing = vi.fn(() => {
      throw new Error("boom");
    });
    const healthy = vi.fn();
    const offFailing = registerSessionReset(failing);
    const offHealthy = registerSessionReset(healthy);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    resetSession();

    expect(healthy).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
    offFailing();
    offHealthy();
  });
});
