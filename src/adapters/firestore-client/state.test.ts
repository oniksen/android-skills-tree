import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  normalizeUserState,
  readLegacyUserState,
  migrateUserState,
  ensureUserState,
  readUserState,
  subscribeUserState,
  clearUserStateCache,
} from "./state";

const mocks = vi.hoisted(() => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  collection: vi.fn(),
  onSnapshot: vi.fn(),
  runTransaction: vi.fn(),
}));

vi.mock("firebase/firestore", () => mocks);

vi.mock("@/lib/firebase", () => ({
  auth: { currentUser: null },
  db: { name: "mock-db" },
}));

describe("state", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearUserStateCache();
    mocks.doc.mockImplementation((_db: unknown, ...path: string[]) => ({
      path: path.join("/"),
    }));
    mocks.collection.mockImplementation((_db: unknown, ...path: string[]) => ({
      path: path.join("/"),
    }));
  });

  describe("normalizeUserState", () => {
    it("handles empty/malformed input", () => {
      for (const input of [undefined, null, 42, "x", [], {}]) {
        const s = normalizeUserState(input);
        expect(s.schemaVersion).toBe(1);
        expect(s.progress.currentLevelId).toBe("junior");
        expect(s.assessments).toEqual({});
        expect(s.projects).toEqual({});
        expect(s.achievements).toEqual({});
      }
    });

    it("converts Timestamp-like values and fills ids", () => {
      const ts = { toDate: () => new Date("2024-06-01T12:00:00.000Z") };
      const s = normalizeUserState({
        schemaVersion: 2,
        migratedAt: ts,
        progress: { currentLevelId: "mid", unlockedLevelIds: ["junior", "mid"], totalScore: 5 },
        assessments: { sk: { score: 3, subtopics: { a: true }, updatedAt: ts } },
        projects: { pj: { completed: true, completedAt: ts } },
        achievements: { ach: { type: "t", metadata: { x: 1 }, achievedAt: ts } },
        currency: { balance: 7, items: { i: 1 }, updatedAt: ts },
        streak: { activeDays: ["d"], frozenDays: [], lastActiveDate: "d", currentStreak: 1, longestStreak: 2, updatedAt: ts },
        settings: { maxDailyQuestions: 3, updatedAt: ts },
      });
      expect(s.schemaVersion).toBe(2);
      expect(s.migratedAt).toEqual(new Date("2024-06-01T12:00:00.000Z"));
      expect(s.projects.pj.projectId).toBe("pj");
      expect(s.achievements.ach.id).toBe("ach");
      expect(s.assessments.sk.updatedAt).toEqual(new Date("2024-06-01T12:00:00.000Z"));
      expect(s.currency.updatedAt).toEqual(new Date("2024-06-01T12:00:00.000Z"));
      expect(s.streak.updatedAt).toEqual(new Date("2024-06-01T12:00:00.000Z"));
      expect(s.settings.updatedAt).toEqual(new Date("2024-06-01T12:00:00.000Z"));
      expect(s.achievements.ach.achievedAt).toEqual(new Date("2024-06-01T12:00:00.000Z"));
      expect(s.projects.pj.completedAt).toEqual(new Date("2024-06-01T12:00:00.000Z"));
    });

    it("uses map key for missing achievement id and project projectId", () => {
      const s = normalizeUserState({
        achievements: { keyA: { type: "t", metadata: {}, achievedAt: null } },
        projects: { keyP: { completed: false, completedAt: null } },
      });
      expect(s.achievements.keyA.id).toBe("keyA");
      expect(s.projects.keyP.projectId).toBe("keyP");
      expect(s.projects.keyP.completedAt).toBeNull();
    });
  });

  describe("readLegacyUserState", () => {
    it("maps old docs/collections into state shape", async () => {
      const ts = new Date("2024-05-05T00:00:00.000Z");
      mocks.getDoc.mockImplementation(async (ref: { path: string }) => {
        switch (ref.path) {
          case "users/u1/progress/current":
            return { exists: () => true, data: () => ({ currentLevelId: "mid", unlockedLevelIds: ["junior", "mid"], totalScore: 12 }) };
          case "users/u1/currency/current":
            return { exists: () => true, data: () => ({ balance: 9, items: { x: 2 }, updatedAt: ts }) };
          case "users/u1/streaks/current":
            return { exists: () => true, data: () => ({ activeDays: ["a"], frozenDays: [], lastActiveDate: "a", currentStreak: 1, longestStreak: 2, updatedAt: ts }) };
          case "users/u1/settings/current":
            return { exists: () => true, data: () => ({ maxDailyQuestions: 7, dailyCounts: { "2024-01-01": 1 }, updatedAt: ts }) };
          default:
            return { exists: () => false };
        }
      });
      mocks.getDocs.mockImplementation(async (ref: { path: string }) => {
        if (ref.path === "users/u1/assessments") {
          return {
            forEach: (cb: (d: unknown) => void) => {
              cb({ id: "sk1", data: () => ({ score: 4, subtopics: { t: true }, updatedAt: ts }) });
            },
          };
        }
        if (ref.path === "users/u1/projects") {
          return {
            forEach: (cb: (d: unknown) => void) => {
              cb({ id: "pr1", data: () => ({ completed: true, completedAt: ts }) });
            },
          };
        }
        if (ref.path === "users/u1/achievements") {
          return {
            forEach: (cb: (d: unknown) => void) => {
              cb({ id: "auto", data: () => ({ type: "level_up", metadata: { from_level: "Junior", to_level: "Middle" }, achievedAt: ts }) });
            },
          };
        }
        return { forEach: () => {} };
      });

      const s = await readLegacyUserState("u1");
      expect(s.progress.currentLevelId).toBe("mid");
      expect(s.progress.totalScore).toBe(12);
      expect(s.currency.balance).toBe(9);
      expect(s.streak.activeDays).toEqual(["a"]);
      expect(s.settings.maxDailyQuestions).toBe(7);
      expect(s.assessments.sk1.score).toBe(4);
      expect(s.projects.pr1.completed).toBe(true);
      const key = "level_up::Middle";
      expect(s.achievements[key].id).toBe(key);
    });
  });

  describe("migrateUserState", () => {
    it("returns existing state without writing", async () => {
      mocks.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          schemaVersion: 1,
          progress: { currentLevelId: "junior", unlockedLevelIds: ["junior"], totalScore: 0 },
          assessments: {},
          projects: {},
          achievements: {},
          currency: { balance: 0, items: {}, updatedAt: new Date() },
          streak: { activeDays: [], frozenDays: [], lastActiveDate: "", currentStreak: 0, longestStreak: 0, updatedAt: new Date() },
          settings: { maxDailyQuestions: 5, updatedAt: new Date() },
        }),
      });
      const s = await migrateUserState("u2");
      expect(s.progress.currentLevelId).toBe("junior");
      expect(mocks.runTransaction).not.toHaveBeenCalled();
    });

    it("writes state doc when missing", async () => {
      mocks.getDoc.mockResolvedValue({ exists: () => false });
      mocks.getDocs.mockResolvedValue({ forEach: () => {} });
      const setMock = vi.fn();
      mocks.runTransaction.mockImplementation(async (_db: unknown, cb: (tx: unknown) => Promise<void>) => {
        const tx = { get: vi.fn().mockResolvedValue({ exists: () => false }), set: setMock };
        return cb(tx);
      });
      await migrateUserState("u3");
      expect(mocks.runTransaction).toHaveBeenCalled();
      expect(setMock).toHaveBeenCalled();
    });

    it("rejects and does not write when a legacy read fails", async () => {
      mocks.getDoc.mockResolvedValue({ exists: () => false });
      mocks.getDocs.mockImplementation(async (ref: { path: string }) => {
        if (ref.path === "users/u-fail/assessments") {
          throw new Error("boom");
        }
        return { forEach: () => {} };
      });
      const setMock = vi.fn();
      mocks.runTransaction.mockImplementation(async (_db: unknown, cb: (tx: unknown) => Promise<unknown>) => {
        const tx = { get: vi.fn().mockResolvedValue({ exists: () => false }), set: setMock };
        return cb(tx);
      });
      await expect(migrateUserState("u-fail")).rejects.toThrow("boom");
      expect(mocks.runTransaction).not.toHaveBeenCalled();
      expect(setMock).not.toHaveBeenCalled();
    });

    it("readLegacyUserState rejects when a legacy collection read fails", async () => {
      mocks.getDoc.mockResolvedValue({ exists: () => false });
      mocks.getDocs.mockImplementation(async (ref: { path: string }) => {
        if (ref.path === "users/u-fail2/assessments") {
          throw new Error("boom2");
        }
        return { forEach: () => {} };
      });
      await expect(readLegacyUserState("u-fail2")).rejects.toThrow("boom2");
    });

    it("rejects when state doc write fails", async () => {
      mocks.getDoc.mockResolvedValue({ exists: () => false });
      mocks.getDocs.mockResolvedValue({ forEach: () => {} });
      mocks.runTransaction.mockRejectedValue(new Error("write-fail"));
      await expect(migrateUserState("u-writefail")).rejects.toThrow("write-fail");
    });

    it("ensureUserState rejects and does not cache on write failure", async () => {
      mocks.getDoc.mockResolvedValue({ exists: () => false });
      mocks.getDocs.mockResolvedValue({ forEach: () => {} });
      mocks.runTransaction.mockRejectedValue(new Error("write-fail"));
      await expect(ensureUserState("u-ensfail")).rejects.toThrow("write-fail");
      const callsBefore = mocks.getDoc.mock.calls.length;
      await expect(ensureUserState("u-ensfail")).rejects.toThrow("write-fail");
      expect(mocks.getDoc.mock.calls.length).toBeGreaterThan(callsBefore);
    });

    it("readUserState returns legacy data when migration write fails", async () => {
      mocks.getDoc.mockResolvedValue({ exists: () => false });
      mocks.getDocs.mockResolvedValue({ forEach: () => {} });
      mocks.runTransaction.mockRejectedValue(new Error("write-fail"));
      const s = await readUserState("u-ro");
      expect(s.schemaVersion).toBe(1);
    });

    it("is idempotent when doc appears during transaction", async () => {
      mocks.getDoc.mockResolvedValue({ exists: () => false });
      mocks.getDocs.mockResolvedValue({ forEach: () => {} });
      const setMock = vi.fn();
      mocks.runTransaction.mockImplementation(async (_db: unknown, cb: (tx: unknown) => Promise<unknown>) => {
        const tx = {
          get: vi.fn().mockResolvedValue({
            exists: () => true,
            data: () => ({
              schemaVersion: 1,
              progress: { currentLevelId: "junior", unlockedLevelIds: ["junior"], totalScore: 0 },
              assessments: {},
              projects: {},
              achievements: {},
              currency: { balance: 0, items: {}, updatedAt: new Date() },
              streak: { activeDays: [], frozenDays: [], lastActiveDate: "", currentStreak: 0, longestStreak: 0, updatedAt: new Date() },
              settings: { maxDailyQuestions: 5, updatedAt: new Date() },
            }),
          }),
          set: setMock,
        };
        return cb(tx);
      });
      const s = await migrateUserState("u4");
      expect(s.progress.currentLevelId).toBe("junior");
      expect(setMock).not.toHaveBeenCalled();
    });
  });

  describe("ensureUserState", () => {
    it("caches result and dedupes concurrent calls", async () => {
      mocks.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          schemaVersion: 1,
          progress: { currentLevelId: "junior", unlockedLevelIds: ["junior"], totalScore: 0 },
          assessments: {},
          projects: {},
          achievements: {},
          currency: { balance: 0, items: {}, updatedAt: new Date() },
          streak: { activeDays: [], frozenDays: [], lastActiveDate: "", currentStreak: 0, longestStreak: 0, updatedAt: new Date() },
          settings: { maxDailyQuestions: 5, updatedAt: new Date() },
        }),
      });
      const [a, b] = await Promise.all([ensureUserState("u5"), ensureUserState("u5")]);
      expect(a).toBe(b);
      // state doc getDoc called once
      expect(mocks.getDoc).toHaveBeenCalledTimes(1);
      // second call uses cache
      const c = await ensureUserState("u5");
      expect(c).toBe(a);
      expect(mocks.getDoc).toHaveBeenCalledTimes(1);
    });
  });

  describe("subscribeUserState", () => {
    it("shares one onSnapshot and forwards updates", async () => {
      const unsubFirestore = vi.fn();
      const callbacks: ((snap: unknown) => void)[] = [];
      mocks.onSnapshot.mockImplementation((_ref: unknown, onNext: (s: unknown) => void) => {
        callbacks.push(onNext);
        return unsubFirestore;
      });
      mocks.getDoc.mockResolvedValue({ exists: () => false });
      mocks.getDocs.mockResolvedValue({ forEach: () => {} });
      mocks.runTransaction.mockImplementation(async (_db: unknown, cb: (tx: unknown) => Promise<unknown>) => {
        const tx = { get: vi.fn().mockResolvedValue({ exists: () => false }), set: vi.fn() };
        return cb(tx);
      });

      const cb1 = vi.fn();
      const cb2 = vi.fn();
      const u1 = subscribeUserState("u6", { next: cb1, error: vi.fn() });
      const u2 = subscribeUserState("u6", { next: cb2, error: vi.fn() });

      expect(mocks.onSnapshot).toHaveBeenCalledTimes(1);

      const snap = {
        exists: () => true,
        data: () => ({
          schemaVersion: 1,
          progress: { currentLevelId: "junior", unlockedLevelIds: ["junior"], totalScore: 0 },
          assessments: {},
          projects: {},
          achievements: {},
          currency: { balance: 5, items: {}, updatedAt: new Date() },
          streak: { activeDays: [], frozenDays: [], lastActiveDate: "", currentStreak: 0, longestStreak: 0, updatedAt: new Date() },
          settings: { maxDailyQuestions: 5, updatedAt: new Date() },
        }),
      };
      // invoke the shared snapshot callback
      callbacks.forEach((cb) => cb(snap));

      // allow microtasks
      await Promise.resolve();
      await Promise.resolve();

      expect(cb1).toHaveBeenCalled();
      expect(cb2).toHaveBeenCalled();

      u1();
      u2();
      expect(unsubFirestore).toHaveBeenCalled();
    });
  });
});
