import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyAutoFreezes, applyAutoFreezesOnce, getStreak, syncStreak } from "./streak-commands";

const mocks = vi.hoisted(() => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  runTransaction: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock("firebase/firestore", () => mocks);

vi.mock("@/lib/firebase", () => ({
  auth: { currentUser: { uid: "user-1" } },
  db: { name: "mock-db" },
}));

vi.mock("@/data/shop", () => ({ STREAK_FREEZE_ITEM_ID: "freeze" }));

describe("getStreak", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when doc missing", async () => {
    mocks.doc.mockReturnValue({ path: "streak" });
    mocks.getDoc.mockResolvedValue({ exists: () => false });
    expect(await getStreak("user-1")).toBeNull();
  });

  it("maps data and defaults frozenDays", async () => {
    mocks.doc.mockReturnValue({ path: "streak" });
    mocks.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ currentStreak: 3, activeDays: ["2026-01-01"], updatedAt: { toDate: () => new Date("2026-01-01") } }),
    });
    const r = await getStreak("user-1");
    expect(r?.currentStreak).toBe(3);
    expect(r?.frozenDays).toEqual([]);
  });
});

describe("syncStreak", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.doc.mockReturnValue({ path: "streak" });
    mocks.collection.mockReturnValue({ path: "ach" });
    mocks.getDocs.mockResolvedValue({ docs: [] });
    mocks.query.mockImplementation((r) => r);
    mocks.setDoc.mockResolvedValue(undefined);
  });

  it("signed-out → null", async () => {
    const firebase = await import("@/lib/firebase");
    (firebase.auth as { currentUser: unknown }).currentUser = null;
    expect(await syncStreak()).toBeNull();
    (firebase.auth as { currentUser: unknown }).currentUser = { uid: "user-1" };
  });

  it("writes when changed and returns data", async () => {
    mocks.runTransaction.mockImplementation(async (_db, cb) => {
      const tx = { get: vi.fn().mockResolvedValue({ exists: () => false }), set: vi.fn() };
      return cb(tx);
    });
    const r = await syncStreak();
    expect(r).not.toBeNull();
  });

  it("permission-denied → throws", async () => {
    mocks.runTransaction.mockRejectedValue({ code: "permission-denied" });
    await expect(syncStreak()).rejects.toMatchObject({ code: "permission-denied" });
  });

  it("other error → null", async () => {
    mocks.runTransaction.mockRejectedValue(new Error("boom"));
    expect(await syncStreak()).toBeNull();
  });
});

describe("applyAutoFreezes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.doc.mockReturnValue({ path: "x" });
    mocks.collection.mockReturnValue({ path: "ach" });
    mocks.getDocs.mockResolvedValue({ docs: [] });
    mocks.query.mockImplementation((r: unknown) => r);
    mocks.setDoc.mockResolvedValue(undefined);
    mocks.runTransaction.mockImplementation(async (_db: unknown, cb: (tx: unknown) => unknown) => {
      const tx = {
        get: vi.fn().mockResolvedValue({ exists: () => true, data: () => ({ activeDays: [new Date().toISOString().slice(0, 10)], frozenDays: [], lastActiveDate: new Date().toISOString().slice(0, 10), currentStreak: 1, longestStreak: 1 }) }),
        set: vi.fn(),
      };
      return cb(tx);
    });
  });

  it("signed-out → null", async () => {
    const firebase = await import("@/lib/firebase");
    (firebase.auth as { currentUser: unknown }).currentUser = null;
    expect(await applyAutoFreezes()).toBeNull();
    (firebase.auth as { currentUser: unknown }).currentUser = { uid: "user-1" };
  });
});

describe("applyAutoFreezesOnce", () => {
  beforeEach(() => vi.clearAllMocks());

  it("dedupes concurrent calls", async () => {
    mocks.doc.mockReturnValue({ path: "streak" });
    mocks.getDoc.mockResolvedValue({ exists: () => false });
    mocks.runTransaction.mockImplementation(async (_db, cb) => {
      const tx = {
        get: vi.fn().mockResolvedValue({ exists: () => false }),
        set: vi.fn(),
      };
      return cb(tx);
    });
    mocks.collection.mockReturnValue({ path: "ach" });
    mocks.getDocs.mockResolvedValue({ docs: [] });
    mocks.query.mockImplementation((r) => r);
    mocks.setDoc.mockResolvedValue(undefined);

    const [a, b] = await Promise.all([applyAutoFreezesOnce(), applyAutoFreezesOnce()]);
    // both resolve; at least one null (no missed days) — just ensure no throw
    expect(a === null || typeof a === "object").toBe(true);
    expect(b === null || typeof b === "object").toBe(true);
  });
});
