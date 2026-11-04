import { describe, expect, it } from "vitest";
import { createOncePerSession, type OnceStorage } from "./once-per-session";

function createStorage(): OnceStorage & { size: () => number } {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    size: () => data.size,
  };
}

describe("createOncePerSession", () => {
  it("returns true only for the first call with a key", () => {
    const once = createOncePerSession(createStorage());

    expect(once("backfill:uid-1")).toBe(true);
    expect(once("backfill:uid-1")).toBe(false);
    expect(once("backfill:uid-1")).toBe(false);
  });

  it("keeps different keys independent", () => {
    const once = createOncePerSession(createStorage());

    expect(once("backfill:uid-1")).toBe(true);
    expect(once("backfill:uid-2")).toBe(true);
  });

  it("remembers keys across instances that share storage", () => {
    const storage = createStorage();
    const first = createOncePerSession(storage);
    const second = createOncePerSession(storage);

    expect(first("backfill:uid-1")).toBe(true);
    expect(second("backfill:uid-1")).toBe(false);
  });

  it("falls back to memory when storage is unavailable", () => {
    const once = createOncePerSession(null);

    expect(once("backfill:uid-1")).toBe(true);
    expect(once("backfill:uid-1")).toBe(false);
  });

  it("keeps working when storage throws", () => {
    const broken: OnceStorage = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    const once = createOncePerSession(broken);

    expect(once("backfill:uid-1")).toBe(true);
    expect(once("backfill:uid-1")).toBe(false);
  });
});
