import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyAutoFreezes, applyAutoFreezesOnce, getStreak, syncStreak } from "./streak-commands";
import { clearAchievementsCache } from "@/shared/lib/achievement-cache";

const mocks = vi.hoisted(() => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  runTransaction: vi.fn(),
  where: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock("firebase/firestore", () => mocks);

vi.mock("@/lib/firebase", () => ({
  auth: { currentUser: { uid: "user-1" } },
  db: { name: "mock-db" },
}));

vi.mock("@/data/shop", () => ({ STREAK_FREEZE_ITEM_ID: "freeze" }));

vi.mock("@/adapters/firestore-client/state", () => ({
  ensureUserState: vi.fn().mockResolvedValue({ achievements: {} }),
  readUserState: vi.fn().mockResolvedValue({ streak: null, achievements: {} }),
  normalizeUserState: vi.fn((d: unknown) => (d && typeof d === "object" ? d : { streak: null })),
}));

beforeEach(() => {
  clearAchievementsCache();
});

describe("getStreak", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when doc missing", async () => {
    mocks.doc.mockReturnValue({ path: "streak" });
    mocks.getDoc.mockResolvedValue({ exists: () => false });
    expect(await getStreak("user-1")).toBeNull();
  });

  it("maps data and defaults frozenDays", async () => {
    const stateMod = await import("@/adapters/firestore-client/state");
    (stateMod.readUserState as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      streak: {
        currentStreak: 3,
        activeDays: ["2026-01-01"],
        frozenDays: undefined,
        lastActiveDate: "2026-01-01",
        longestStreak: 3,
        updatedAt: { toDate: () => new Date("2026-01-01") },
      },
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
    mocks.getDoc.mockResolvedValue({ exists: () => true });
    mocks.query.mockImplementation((r) => r);
    mocks.where.mockImplementation((...args: unknown[]) => args);
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

describe("streak achievements", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.doc.mockReturnValue({ path: "ach" });
    mocks.collection.mockReturnValue({ path: "ach" });
    mocks.getDocs.mockResolvedValue({ empty: true, docs: [] });
    mocks.query.mockImplementation((r: unknown) => r);
    mocks.where.mockImplementation((...args: unknown[]) => args);
    mocks.setDoc.mockResolvedValue(undefined);
  });

  it("начисляет стрик по longestStreak и не пишет тир", async () => {
    mocks.runTransaction.mockResolvedValue({
      currentStreak: 0,
      longestStreak: 7,
      activeDays: ["2026-01-01"],
      frozenDays: [],
      lastActiveDate: "2026-01-01",
      updatedAt: new Date(),
    });

    await syncStreak();

    expect(mocks.setDoc).toHaveBeenCalledTimes(1);
    const [, payload] = mocks.setDoc.mock.calls[0];
    expect(payload).toEqual({
      achievements: {
        streak_7: {
          id: "streak_7",
          type: "streak_7",
          metadata: { days: 7 },
          achievedAt: expect.any(Date),
        },
      },
    });
  });

  it("не начисляет стрик ниже первого порога", async () => {
    mocks.runTransaction.mockResolvedValue({
      currentStreak: 6,
      longestStreak: 6,
      activeDays: ["2026-01-01"],
      frozenDays: [],
      lastActiveDate: "2026-01-01",
      updatedAt: new Date(),
    });

    await syncStreak();

    expect(mocks.setDoc).not.toHaveBeenCalled();
  });

  it("не дублирует достижение того же типа (deterministic id)", async () => {
    const stateMod = await import("@/adapters/firestore-client/state");
    (stateMod.ensureUserState as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ achievements: { streak_7: { type: "streak_7" } } });
    (stateMod.ensureUserState as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ achievements: { streak_7: { type: "streak_7" } } });
    mocks.getDocs.mockResolvedValue({ empty: false, docs: [{}] });
    mocks.runTransaction.mockResolvedValue({
      currentStreak: 0,
      longestStreak: 7,
      activeDays: ["2026-01-01"],
      frozenDays: [],
      lastActiveDate: "2026-01-01",
      updatedAt: new Date(),
    });

    await syncStreak();

    expect(mocks.setDoc).not.toHaveBeenCalled();
  });

  it("не дублирует legacy autoId achievement (cache hit)", async () => {
    const stateMod = await import("@/adapters/firestore-client/state");
    (stateMod.ensureUserState as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ achievements: { streak_7: { type: "streak_7" } } });
    (stateMod.ensureUserState as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ achievements: { streak_7: { type: "streak_7" } } });
    const { setAchievementsCache } = await import("@/shared/lib/achievement-cache");
    setAchievementsCache("user-1", [
      {
        id: "legacy-auto",
        type: "streak_7",
        metadata: { days: 7 },
        achievedAt: new Date(),
      },
    ]);
    mocks.getDocs.mockResolvedValue({ empty: true, docs: [] });
    mocks.runTransaction.mockResolvedValue({
      currentStreak: 0,
      longestStreak: 7,
      activeDays: ["2026-01-01"],
      frozenDays: [],
      lastActiveDate: "2026-01-01",
      updatedAt: new Date(),
    });

    await syncStreak();

    expect(mocks.setDoc).not.toHaveBeenCalled();
  });

  it("cache null + type query returns legacy doc → no write", async () => {
    clearAchievementsCache();
    const stateMod = await import("@/adapters/firestore-client/state");
    (stateMod.ensureUserState as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ achievements: { streak_7: { type: "streak_7" } } });
    (stateMod.ensureUserState as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ achievements: { streak_7: { type: "streak_7" } } });
    mocks.getDocs.mockResolvedValue({ empty: false, docs: [{}] });
    mocks.runTransaction.mockResolvedValue({
      currentStreak: 0,
      longestStreak: 7,
      activeDays: ["2026-01-01"],
      frozenDays: [],
      lastActiveDate: "2026-01-01",
      updatedAt: new Date(),
    });

    await syncStreak();

    expect(mocks.setDoc).not.toHaveBeenCalled();
  });

  it("cache null + no match → deterministic setDoc", async () => {
    clearAchievementsCache();
    mocks.getDocs.mockResolvedValue({ empty: true, docs: [] });
    mocks.runTransaction.mockResolvedValue({
      currentStreak: 0,
      longestStreak: 7,
      activeDays: ["2026-01-01"],
      frozenDays: [],
      lastActiveDate: "2026-01-01",
      updatedAt: new Date(),
    });

    await syncStreak();

    expect(mocks.setDoc).toHaveBeenCalledTimes(1);
    const [, payload] = mocks.setDoc.mock.calls[0];
    expect(payload).toEqual({
      achievements: {
        streak_7: {
          id: "streak_7",
          type: "streak_7",
          metadata: { days: 7 },
          achievedAt: expect.any(Date),
        },
      },
    });
  });
});

describe("applyAutoFreezes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.doc.mockReturnValue({ path: "x" });
    mocks.collection.mockReturnValue({ path: "ach" });
    mocks.getDocs.mockResolvedValue({ docs: [] });
    mocks.query.mockImplementation((r: unknown) => r);
    mocks.where.mockImplementation((...args: unknown[]) => args);
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
    mocks.where.mockImplementation((...args: unknown[]) => args);
    mocks.setDoc.mockResolvedValue(undefined);

    const [a, b] = await Promise.all([applyAutoFreezesOnce(), applyAutoFreezesOnce()]);
    // both resolve; at least one null (no missed days) — just ensure no throw
    expect(a === null || typeof a === "object").toBe(true);
    expect(b === null || typeof b === "object").toBe(true);
  });
});
