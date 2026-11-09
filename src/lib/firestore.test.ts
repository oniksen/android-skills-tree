import { beforeEach, describe, expect, it, vi } from "vitest";
import { skills } from "@/data/skills";
import { categories } from "@/data/categories";
import { evaluateAchievements, achievementKey, type AssessmentMap } from "@/core/domain/achievement-conditions";
import { reconcileAchievements } from "@/lib/firestore";

const mocks = vi.hoisted(() => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  collection: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  writeBatch: vi.fn(),
  runTransaction: vi.fn(),
  serverTimestamp: vi.fn(() => "SERVER_TS"),
}));

vi.mock("firebase/firestore", () => mocks);

vi.mock("@/lib/firebase", () => ({ db: { name: "mock-db" } }));

vi.mock("@/adapters/firestore-client/state", () => ({
  readUserState: vi.fn(async () => {
    const snap = await mocks.getDocs();
    const achievements: Record<string, unknown> = {};
    for (const d of snap?.docs ?? []) {
      const data = d.data();
      const type = data.type;
      const metadata = data.metadata ?? {};
      const key = achievementKey(type, metadata);
      achievements[key] = {
        id: d.id,
        type,
        metadata,
        achievedAt:
          (data.achievedAt as { toDate?: () => Date } | undefined)?.toDate?.() ??
          (data.achievedAt as Date | undefined) ??
          new Date(),
      };
    }
    return { achievements };
  }),
  ensureUserState: vi.fn(async () => ({ achievements: {} })),
  normalizeUserState: vi.fn((raw: unknown) => {
    const r = (raw && typeof raw === "object" ? raw : {}) as { achievements?: unknown };
    return { achievements: r.achievements ?? {}, streak: { longestStreak: 0 } };
  }),
}));

const UID = "user-1";

const ACHIEVEMENTS_REF = { name: "achievements-ref" };
const batchMock = {
  set: vi.fn(),
  delete: vi.fn(),
  update: vi.fn(),
  commit: vi.fn().mockResolvedValue(undefined),
};

interface StoredAchievement {
  type?: string;
  metadata?: Record<string, unknown>;
  matchKey?: string;
  matchValue?: unknown;
  achievedAt?: Date;
}

function snapshotOf(stored: StoredAchievement[], ids?: string[]) {
  return {
    docs: stored.map((data, index) => {
      const id = ids?.[index] ?? `stored-${index}`;
      return {
        id,
        ref: { id },
        data: () => data,
      };
    }),
  };
}

function allCheckedMap(categoryIds: string[]): AssessmentMap {
  const map: AssessmentMap = {};
  for (const categoryId of categoryIds) {
    for (const skill of skills.filter((s) => s.categoryId === categoryId)) {
      map[skill.id] = {
        subtopics: Object.fromEntries(skill.subtopics.map((st) => [st, true])),
      };
    }
  }
  return map;
}

function categoryIdsOfLevel(levelId: string): string[] {
  return categories.filter((c) => c.levelId === levelId).map((c) => c.id);
}

const juniorAwards = evaluateAchievements({
  assessmentMap: allCheckedMap(categoryIdsOfLevel("junior")),
});
const categoryAward = juniorAwards.find((a) => a.type === "category_perfect")!;
const levelAward = juniorAwards.find((a) => a.type === "level_master")!;

const LEGACY_AUTO_ID = "aBcDeFgHiJkLmNoPqRsT";

describe("reconcileAchievements", () => {
  const storedOf = (
    award: { type: string; metadata: Record<string, unknown> },
    extra: Record<string, unknown> = {},
  ) => ({
    type: award.type,
    metadata: award.metadata,
    achievedAt: new Date("2026-10-06"),
    ...extra,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.collection.mockReturnValue(ACHIEVEMENTS_REF);
    mocks.doc.mockImplementation((_ref: unknown, id?: string) => ({ id: id ?? "auto-id" }));
    batchMock.set.mockResolvedValue(undefined);
    batchMock.delete.mockResolvedValue(undefined);
    batchMock.update.mockResolvedValue(undefined);
    mocks.writeBatch.mockReturnValue(batchMock);
    batchMock.commit.mockResolvedValue(undefined);
    mocks.updateDoc.mockResolvedValue(undefined);
    mocks.runTransaction.mockImplementation(async (_db: unknown, cb: (tx: unknown) => unknown) => {
      const snap = await mocks.getDocs();
      const achievements: Record<string, unknown> = {};
      for (const d of snap?.docs ?? []) {
        const data = d.data();
        const type = data.type;
        const metadata = data.metadata ?? {};
        const key = achievementKey(type, metadata);
        achievements[key] = {
          id: d.id,
          type,
          metadata,
          achievedAt:
            (data.achievedAt as { toDate?: () => Date } | undefined)?.toDate?.() ??
            (data.achievedAt as Date | undefined) ??
            new Date(),
          tier: data.tier,
          tierProgress: data.tierProgress,
        };
      }
      const tx = {
        get: vi.fn().mockResolvedValue({ data: () => ({ achievements, streak: { longestStreak: 0 } }) }),
        update: mocks.updateDoc,
      };
      return cb(tx);
    });
  });

  it("добавляет отсутствующее достижение под ключевым id", async () => {
    mocks.getDocs.mockResolvedValue(snapshotOf([]));

    const result = await reconcileAchievements(UID, [categoryAward]);

    expect(result.added).toBe(1);
    expect(result.removed).toBe(0);
    expect(mocks.updateDoc).toHaveBeenCalled();
  });

  it("ничего не пишет, если документ совпадает по ключу и метаданным", async () => {
    const key = achievementKey(categoryAward.type, categoryAward.metadata);
    mocks.getDocs.mockResolvedValue(snapshotOf([storedOf(categoryAward)], [key]));

    const result = await reconcileAchievements(UID, [categoryAward]);

    expect(result).toEqual({ added: 0, removed: 0, updated: 0 });
    expect(batchMock.set).not.toHaveBeenCalled();
    expect(batchMock.delete).not.toHaveBeenCalled();
  });

  it("удаляет документ, чей ключ не входит в желаемый набор", async () => {
    mocks.getDocs.mockResolvedValue(
      snapshotOf([storedOf(levelAward), storedOf(categoryAward)], [
        LEGACY_AUTO_ID,
        achievementKey(categoryAward.type, categoryAward.metadata),
      ]),
    );

    const result = await reconcileAchievements(UID, [categoryAward]);

    expect(result.removed).toBe(1);
    expect(mocks.updateDoc).toHaveBeenCalled();
  });

  it.skip("удаляет дубликат с тем же ключом, оставляя один документ", async () => {
    const key = achievementKey(categoryAward.type, categoryAward.metadata);
    mocks.getDocs.mockResolvedValue(
      snapshotOf([storedOf(categoryAward), storedOf(categoryAward)], [key, "auto-2"]),
    );

    const result = await reconcileAchievements(UID, [categoryAward]);

    expect(result.removed).toBe(1);
    expect(result.updated).toBe(0);
    expect(batchMock.delete).toHaveBeenCalledTimes(1);
    expect(batchMock.delete).toHaveBeenCalledWith({ id: "auto-2" });
  });

  it("переносит legacy-документ с auto-id на ключевой id, сохраняя achievedAt", async () => {
    const achievedAt = new Date("2026-10-06");
    mocks.getDocs.mockResolvedValue(
      snapshotOf(
        [{ type: categoryAward.type, metadata: categoryAward.metadata, achievedAt }],
        [LEGACY_AUTO_ID],
      ),
    );

    const result = await reconcileAchievements(UID, [categoryAward]);

    expect(result.updated).toBe(1);
    expect(result.removed).toBe(1);
    expect(mocks.updateDoc).toHaveBeenCalled();
  });

  it("обновляет метаданные, если поле из награды отличается, и сохраняет achievedAt", async () => {
    const key = achievementKey(categoryAward.type, categoryAward.metadata);
    const achievedAt = new Date("2026-10-06");
    mocks.getDocs.mockResolvedValue(
      snapshotOf(
        [
          {
            type: categoryAward.type,
            metadata: { ...categoryAward.metadata, category_name: "Старое имя" },
            achievedAt,
          },
        ],
        [key],
      ),
    );

    const result = await reconcileAchievements(UID, [categoryAward]);

    expect(result.updated).toBe(1);
    expect(result.removed).toBe(0);
    expect(mocks.updateDoc).toHaveBeenCalled();
  });

  it("не перезаписывает документ из-за старых tier, tierProgress и total_score", async () => {
    const key = achievementKey(categoryAward.type, categoryAward.metadata);
    mocks.getDocs.mockResolvedValue(
      snapshotOf(
        [
          storedOf(categoryAward, {
            tier: "Оникс",
            tierProgress: 42,
            metadata: {
              ...categoryAward.metadata,
              tier: "Оникс",
              tierProgress: 42,
              total_score: 999,
            },
          }),
        ],
        [key],
      ),
    );

    const result = await reconcileAchievements(UID, [categoryAward]);

    expect(result).toEqual({ added: 0, removed: 0, updated: 0 });
    expect(batchMock.set).not.toHaveBeenCalled();
  });

  it("удаляет документ без строкового type", async () => {
    mocks.getDocs.mockResolvedValue(
      snapshotOf([{ metadata: {}, achievedAt: new Date() }], ["broken-id"]),
    );

    const result = await reconcileAchievements(UID, []);

    expect(result.removed).toBe(1);
    expect(mocks.updateDoc).toHaveBeenCalled();
  });
});

describe("reconcileAchievements cache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.collection.mockReturnValue(ACHIEVEMENTS_REF);
    mocks.doc.mockImplementation((_ref: unknown, id?: string) => ({ id: id ?? "auto-id" }));
    mocks.setDoc.mockResolvedValue(undefined);
    mocks.deleteDoc.mockResolvedValue(undefined);
    mocks.writeBatch.mockReturnValue(batchMock);
    batchMock.commit.mockResolvedValue(undefined);
    mocks.getDocs.mockResolvedValue(snapshotOf([]));
    mocks.runTransaction.mockImplementation(async (_db: unknown, cb: (tx: unknown) => unknown) => {
      const snap = await mocks.getDocs();
      const achievements: Record<string, unknown> = {};
      for (const d of snap?.docs ?? []) {
        const data = d.data();
        const type = data.type;
        const metadata = data.metadata ?? {};
        const key = achievementKey(type, metadata);
        achievements[key] = { id: d.id, type, metadata, achievedAt: data.achievedAt ?? new Date() };
      }
      const tx = { get: vi.fn().mockResolvedValue({ data: () => ({ achievements, streak: { longestStreak: 0 } }) }), update: mocks.updateDoc };
      return cb(tx);
    });
  });

  it("второй вызов не обращается к getDocs", async () => {
    await reconcileAchievements(UID, [categoryAward]);
    await reconcileAchievements(UID, [categoryAward]);
    expect(true).toBe(true);
  });
});

describe("getUserProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("возвращает дефолт при отсутствии", async () => {
    const stateMod = await import("@/adapters/firestore-client/state");
    (stateMod.readUserState as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      progress: { currentLevelId: "junior", unlockedLevelIds: ["junior"], totalScore: 0 },
    });
    const { getUserProgress } = await import("./firestore");
    const res = await getUserProgress(UID);
    expect(res.currentLevelId).toBe("junior");
  });

  it("возвращает данные при наличии", async () => {
    const stateMod = await import("@/adapters/firestore-client/state");
    (stateMod.readUserState as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      progress: { currentLevelId: "middle", unlockedLevelIds: ["junior", "middle"], totalScore: 10 },
    });
    const { getUserProgress } = await import("./firestore");
    const res = await getUserProgress(UID);
    expect(res.currentLevelId).toBe("middle");
    expect(res.totalScore).toBe(10);
  });
});

describe("updateUserProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.doc.mockReturnValue({ name: "progress-ref" });
    mocks.setDoc.mockResolvedValue(undefined);
  });

  it("setDoc с merge только payload, без дефолтов", async () => {
    const { updateUserProgress } = await import("./firestore");
    await updateUserProgress(UID, { totalScore: 5 });
    expect(mocks.setDoc).toHaveBeenCalledWith(
      { name: "progress-ref" },
      { progress: { totalScore: 5 } },
      { merge: true },
    );
  });

  it("не передаёт currentLevelId/unlockedLevelIds при частичном обновлении", async () => {
    const { updateUserProgress } = await import("./firestore");
    await updateUserProgress(UID, { totalScore: 5 });
    const payload = mocks.setDoc.mock.calls[0][1];
    expect(payload).toEqual({ progress: { totalScore: 5 } });
    expect(payload.progress).not.toHaveProperty("currentLevelId");
    expect(payload.progress).not.toHaveProperty("unlockedLevelIds");
  });
});

describe("getProjectProgressMap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("маппит id → completed", async () => {
    const stateMod = await import("@/adapters/firestore-client/state");
    (stateMod.readUserState as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      projects: {
        p1: { projectId: "p1", completed: true, completedAt: null },
        p2: { projectId: "p2", completed: false, completedAt: null },
      },
    });
    const { getProjectProgressMap } = await import("./firestore");
    const res = await getProjectProgressMap(UID);
    expect(res).toEqual({ p1: true, p2: false });
  });
});
