import { afterEach, describe, expect, it, vi } from "vitest";
import type { Observer } from "@/ports/observation";
import { createLiveStore } from "./live-store";

function createSource() {
  let observer: Observer<number> | null = null;
  const stop = vi.fn();
  const start = vi.fn((next: Observer<number>) => {
    observer = next;
    return stop;
  });

  return {
    start,
    stop,
    emit(value: number) {
      observer?.next(value);
    },
    fail(error: unknown) {
      observer?.error?.(error);
    },
  };
}

afterEach(() => {
  vi.useRealTimers();
});

describe("createLiveStore", () => {
  it("starts a single subscription per key and notifies every consumer", () => {
    const store = createLiveStore<number>();
    const source = createSource();
    const first = vi.fn();
    const second = vi.fn();

    store.subscribe("uid-1", source.start, first);
    store.subscribe("uid-1", source.start, second);
    source.emit(7);

    expect(source.start).toHaveBeenCalledTimes(1);
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    expect(store.peek("uid-1")).toEqual({ data: 7, loading: false, error: null });
  });

  it("keeps the subscription and data after the last consumer unsubscribes", () => {
    const store = createLiveStore<number>();
    const source = createSource();

    const unsubscribe = store.subscribe("uid-1", source.start, vi.fn());
    source.emit(42);
    unsubscribe();

    expect(source.stop).not.toHaveBeenCalled();
    expect(store.peek("uid-1")).toEqual({ data: 42, loading: false, error: null });

    store.subscribe("uid-1", source.start, vi.fn());
    expect(source.start).toHaveBeenCalledTimes(1);
  });

  it("stops the subscription after the idle ttl elapses", () => {
    vi.useFakeTimers();
    const store = createLiveStore<number>({ idleTtlMs: 1_000 });
    const source = createSource();

    const unsubscribe = store.subscribe("uid-1", source.start, vi.fn());
    source.emit(5);
    unsubscribe();

    vi.advanceTimersByTime(999);
    expect(source.stop).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(source.stop).toHaveBeenCalledTimes(1);
    expect(store.peek("uid-1")).toEqual({ data: undefined, loading: true, error: null });
  });

  it("cancels pending disposal when a consumer returns", () => {
    vi.useFakeTimers();
    const store = createLiveStore<number>({ idleTtlMs: 1_000 });
    const source = createSource();

    const unsubscribe = store.subscribe("uid-1", source.start, vi.fn());
    source.emit(1);
    unsubscribe();
    vi.advanceTimersByTime(500);
    store.subscribe("uid-1", source.start, vi.fn());
    vi.advanceTimersByTime(1_000);

    expect(source.stop).not.toHaveBeenCalled();
    expect(source.start).toHaveBeenCalledTimes(1);
    expect(store.peek("uid-1").data).toBe(1);
  });

  it("keeps the last data when the stream errors", () => {
    const store = createLiveStore<number>();
    const source = createSource();
    const consumer = vi.fn();

    store.subscribe("uid-1", source.start, consumer);
    source.emit(3);
    const failure = new Error("boom");
    source.fail(failure);

    expect(consumer).toHaveBeenCalledTimes(2);
    expect(store.peek("uid-1")).toEqual({ data: 3, loading: false, error: failure });
  });

  it("returns a stable snapshot object between updates", () => {
    const store = createLiveStore<number>();
    const source = createSource();

    store.subscribe("uid-1", source.start, vi.fn());
    const before = store.peek("uid-1");
    expect(store.peek("uid-1")).toBe(before);

    source.emit(1);
    expect(store.peek("uid-1")).not.toBe(before);
  });

  it("disposeAll stops every key", () => {
    const store = createLiveStore<number>();
    const first = createSource();
    const second = createSource();

    store.subscribe("uid-1", first.start, vi.fn());
    store.subscribe("uid-2", second.start, vi.fn());
    store.disposeAll();

    expect(first.stop).toHaveBeenCalledTimes(1);
    expect(second.stop).toHaveBeenCalledTimes(1);
    expect(store.peek("uid-1")).toEqual({ data: undefined, loading: true, error: null });
    expect(store.peek("uid-2")).toEqual({ data: undefined, loading: true, error: null });
  });

  it("restarts the subscription after dispose", () => {
    const store = createLiveStore<number>();
    const source = createSource();

    store.subscribe("uid-1", source.start, vi.fn());
    store.dispose("uid-1");
    store.subscribe("uid-1", source.start, vi.fn());

    expect(source.start).toHaveBeenCalledTimes(2);
    expect(source.stop).toHaveBeenCalledTimes(1);
  });

  it("serves a stable server snapshot without data", () => {
    const store = createLiveStore<number>();
    const snapshot = store.getServerSnapshot();

    expect(snapshot).toEqual({ data: undefined, loading: true, error: null });
    expect(store.getServerSnapshot()).toBe(snapshot);
  });

  it("applies a local value without restarting the subscription", () => {
    const store = createLiveStore<number>();
    const source = createSource();
    const consumer = vi.fn();

    store.subscribe("uid-1", source.start, consumer);
    store.set("uid-1", 9);

    expect(store.peek("uid-1")).toEqual({ data: 9, loading: false, error: null });
    expect(consumer).toHaveBeenCalledTimes(1);
    expect(source.start).toHaveBeenCalledTimes(1);
  });

  it("unsubscribe is idempotent", () => {
    const store = createLiveStore<number>({ idleTtlMs: 1_000 });
    const source = createSource();

    const unsubscribe = store.subscribe("uid-1", source.start, vi.fn());
    unsubscribe();
    unsubscribe();

    expect(source.stop).not.toHaveBeenCalled();
  });
});
