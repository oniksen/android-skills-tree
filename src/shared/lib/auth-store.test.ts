import { describe, expect, it, vi } from "vitest";
import type { Observer } from "@/ports/observation";
import type { AuthState } from "@/ports/auth-state-provider";
import { createAuthStore } from "./auth-store";

const SIGNED_IN: AuthState = { uid: "uid-1", email: "a@b.c", loading: false };

function createSource() {
  let observer: Observer<AuthState> | null = null;
  const stop = vi.fn();
  const start = vi.fn((next: Observer<AuthState>) => {
    observer = next;
    return stop;
  });

  return {
    start,
    stop,
    emit(state: AuthState) {
      observer?.next(state);
    },
    fail(error: unknown) {
      observer?.error?.(error);
    },
  };
}

describe("createAuthStore", () => {
  it("uses a single underlying subscription for every consumer", () => {
    const source = createSource();
    const store = createAuthStore({ subscribe: source.start });
    const first = vi.fn();
    const second = vi.fn();

    store.subscribe(first);
    store.subscribe(second);
    source.emit(SIGNED_IN);

    expect(source.start).toHaveBeenCalledTimes(1);
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot()).toEqual(SIGNED_IN);
  });

  it("shares the resolved state with a consumer that subscribes later", () => {
    const source = createSource();
    const store = createAuthStore({ subscribe: source.start });

    store.subscribe(vi.fn());
    source.emit(SIGNED_IN);

    const late = vi.fn();
    store.subscribe(late);

    expect(store.getSnapshot()).toEqual(SIGNED_IN);
    expect(source.start).toHaveBeenCalledTimes(1);
    expect(late).not.toHaveBeenCalled();
  });

  it("reports a user change once, not on every auth event", () => {
    const source = createSource();
    const onUserChange = vi.fn();
    const store = createAuthStore({ subscribe: source.start, onUserChange });

    store.subscribe(vi.fn());
    source.emit(SIGNED_IN);
    expect(onUserChange).not.toHaveBeenCalled();

    source.emit({ uid: "uid-2", email: "b@c.d", loading: false });
    source.emit({ uid: "uid-2", email: "b@c.d", loading: false });

    expect(onUserChange).toHaveBeenCalledTimes(1);
    expect(onUserChange).toHaveBeenCalledWith("uid-2");
  });

  it("reports sign-out as a user change", () => {
    const source = createSource();
    const onUserChange = vi.fn();
    const store = createAuthStore({ subscribe: source.start, onUserChange });

    store.subscribe(vi.fn());
    source.emit(SIGNED_IN);
    source.emit({ uid: null, email: null, loading: false });

    expect(onUserChange).toHaveBeenCalledWith(null);
  });

  it("resolves to signed out instead of hanging when auth fails", () => {
    const source = createSource();
    const store = createAuthStore({ subscribe: source.start });

    store.subscribe(vi.fn());
    source.fail(new Error("auth unavailable"));

    expect(store.getSnapshot()).toEqual({ uid: null, email: null, loading: false });
  });

  it("serves a stable server snapshot without a user", () => {
    const store = createAuthStore({ subscribe: vi.fn() });
    const snapshot = store.getServerSnapshot();

    expect(snapshot).toEqual({ uid: null, email: null, loading: true });
    expect(store.getServerSnapshot()).toBe(snapshot);
  });
});
