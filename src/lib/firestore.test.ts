import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearAchievementsCache } from "@/shared/lib/achievement-cache";
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
}));

vi.mock("firebase/firestore", () => mocks);

vi.mock("@/lib/firebase", () => ({ db: { name: "mock-db" } }));

const UID = "user-1";

beforeEach(() => {
  clearAchievementsCache();
});
const ACHIEVEMENTS_REF = { name: "achievements-ref" };
const batchMock = {
  set: vi.fn(),
  delete: vi.fn(),
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
    mocks.writeBatch.mockReturnValue(batchMock);
    batchMock.commit.mockResolvedValue(undefined);
  });

  it("добавляет отсутствующее достижение под ключевым id", async () => {
    mocks.getDocs.mockResolvedValue(snapshotOf([]));

    const result = await reconcileAchievements(UID, [categoryAward]);

    expect(result.added).toBe(1);
    expect(result.removed).toBe(0);
    expect(mocks.doc).toHaveBeenCalledWith(
      ACHIEVEMENTS_REF,
      achievementKey(categoryAward.type, categoryAward.metadata),
    );
    expect(batchMock.set).toHaveBeenCalledTimes(1);
    expect(batchMock.set).toHaveBeenCalledWith(
      { id: achievementKey(categoryAward.type, categoryAward.metadata) },
      {
        type: categoryAward.type,
        metadata: categoryAward.metadata,
        achievedAt: expect.any(Date),
      },
    );
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
    expect(batchMock.delete).toHaveBeenCalledTimes(1);
    expect(batchMock.delete).toHaveBeenCalledWith({ id: LEGACY_AUTO_ID });
  });

  it("удаляет дубликат с тем же ключом, оставляя один документ", async () => {
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
    const key = achievementKey(categoryAward.type, categoryAward.metadata);
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
    expect(batchMock.set).toHaveBeenCalledWith(
      { id: key },
      {
        type: categoryAward.type,
        metadata: categoryAward.metadata,
        achievedAt,
      },
    );
    expect(batchMock.delete).toHaveBeenCalledWith({ id: LEGACY_AUTO_ID });
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
    expect(batchMock.set).toHaveBeenCalledWith(
      { id: key },
      {
        type: categoryAward.type,
        metadata: categoryAward.metadata,
        achievedAt,
      },
    );
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
    expect(batchMock.delete).toHaveBeenCalledWith({ id: "broken-id" });
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
  });

  it("второй вызов не обращается к getDocs", async () => {
    await reconcileAchievements(UID, [categoryAward]);

    mocks.getDocs.mockClear();

    await reconcileAchievements(UID, [categoryAward]);

    expect(mocks.getDocs).not.toHaveBeenCalled();
  });
});

describe("getUserProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.doc.mockReturnValue({ name: "progress-ref" });
    mocks.setDoc.mockResolvedValue(undefined);
    mocks.getDoc.mockResolvedValue({ exists: () => false });
  });

  it("создаёт дефолт при отсутствии", async () => {
    const { getUserProgress } = await import("./firestore");
    const res = await getUserProgress(UID);
    expect(mocks.setDoc).toHaveBeenCalled();
    expect(res.currentLevelId).toBe("junior");
  });

  it("возвращает данные при наличии", async () => {
    mocks.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ currentLevelId: "middle", unlockedLevelIds: ["junior", "middle"], totalScore: 10 }),
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
      { totalScore: 5 },
      { merge: true },
    );
  });

  it("не передаёт currentLevelId/unlockedLevelIds при частичном обновлении", async () => {
    const { updateUserProgress } = await import("./firestore");
    await updateUserProgress(UID, { totalScore: 5 });
    const payload = mocks.setDoc.mock.calls[0][1];
    expect(payload).not.toHaveProperty("currentLevelId");
    expect(payload).not.toHaveProperty("unlockedLevelIds");
  });
});

describe("getProjectProgressMap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.collection.mockReturnValue({ name: "projects-ref" });
    mocks.getDocs.mockResolvedValue({
      forEach: (cb: (d: { id: string; data: () => { completed: boolean } }) => void) => {
        cb({ id: "p1", data: () => ({ completed: true }) });
        cb({ id: "p2", data: () => ({ completed: false }) });
      },
    });
  });

  it("маппит id → completed", async () => {
    const { getProjectProgressMap } = await import("./firestore");
    const res = await getProjectProgressMap(UID);
    expect(res).toEqual({ p1: true, p2: false });
  });
});
