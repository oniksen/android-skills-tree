import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearAchievementsCache } from "@/shared/lib/achievement-cache";
import { skills } from "@/data/skills";
import { categories } from "@/data/categories";
import { calcTotalScore } from "@/core/domain/scoring";
import { type AssessmentMap } from "@/core/domain/achievement-conditions";
import {
  backfillTotalScore,
  checkAchievements,
  readAssessmentMap,
} from "@/lib/firestore-actions";

const mocks = vi.hoisted(() => {
  const batchMock = {
    set: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
    commit: vi.fn().mockResolvedValue(undefined),
  };
  return {
    collection: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    query: vi.fn(),
    runTransaction: vi.fn(),
    writeBatch: vi.fn(() => batchMock),
    batch: batchMock,
  };
});

vi.mock("firebase/firestore", () => mocks);

vi.mock("@/lib/firebase", () => ({
  auth: { currentUser: { uid: "user-1" } },
  db: { name: "mock-db" },
}));

vi.mock("@/adapters/firestore-client/streak-commands", () => ({
  getStreak: vi.fn().mockResolvedValue({ longestStreak: 0 }),
  syncStreak: vi.fn(),
}));

const stateMock = vi.hoisted(() => ({ current: null as unknown }));

vi.mock("@/adapters/firestore-client/state", () => ({
  readUserState: vi.fn(() => Promise.resolve(stateMock.current)),
  ensureUserState: vi.fn().mockResolvedValue({}),
}));

const UID = "user-1";

beforeEach(() => {
  clearAchievementsCache();
});
const JUNIOR_ID = "junior";

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

interface MockDoc {
  id: string;
  data: () => Record<string, unknown>;
}

function snapshotOf(docs: MockDoc[]) {
  return {
    docs,
    forEach: (cb: (doc: MockDoc) => void) => docs.forEach(cb),
  };
}

function assessmentSnapshot(map: AssessmentMap) {
  return snapshotOf(
    Object.entries(map).map(([id, value]) => ({
      id,
      data: () => ({ subtopics: value.subtopics }),
    })),
  );
}

const juniorCategoryIds = categoryIdsOfLevel(JUNIOR_ID);
const juniorMap = allCheckedMap(juniorCategoryIds);

describe("checkAchievements", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.collection.mockImplementation(
      (...segments: unknown[]) => ({ path: segments.slice(1).join("/") }),
    );
    mocks.getDocs.mockImplementation((ref: { path: string }) =>
      Promise.resolve(
        ref.path.endsWith("/assessments")
          ? assessmentSnapshot(juniorMap)
          : snapshotOf([]),
      ),
    );
    mocks.doc.mockImplementation((_ref: unknown, id?: string) => ({ id: id ?? "auto-id" }));
    mocks.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        currentLevelId: "junior",
        unlockedLevelIds: ["junior"],
        totalScore: 0,
      }),
    });
    mocks.setDoc.mockResolvedValue(undefined);
    stateMock.current = {
      assessments: juniorMap,
      progress: { currentLevelId: "junior", unlockedLevelIds: ["junior"], totalScore: 0 },
      streak: { longestStreak: 0 },
      achievements: {},
    };
  });

  it("с готовой картой использует achievements cache, без неё — fallback", async () => {
    await checkAchievements(UID, juniorMap);

    expect(mocks.getDocs).toHaveBeenCalledTimes(0);

    mocks.getDocs.mockClear();

    await checkAchievements(UID);

    expect(mocks.getDocs).toHaveBeenCalledTimes(0);
  });

  it("передаёт награды на сохранение: по category_perfect на каждую категорию уровня", async () => {
    await checkAchievements(UID, juniorMap);

    const updateCall = mocks.updateDoc.mock.calls[0];
    const payload = updateCall?.[1] as { achievements?: Record<string, { type: string }> };
    const writtenTypes = Object.values(payload?.achievements ?? {}).map((a) => a.type);
    expect(writtenTypes.filter((type) => type === "category_perfect")).toHaveLength(
      juniorCategoryIds.length,
    );
    expect(writtenTypes).toContain("category_perfect");
  });

  it("возвращает список наград, который вычислил evaluateAchievements", async () => {
    const awards = await checkAchievements(UID, juniorMap);

    expect(Array.isArray(awards)).toBe(true);
    const awardedCategoryIds = awards
      .filter((award) => award.type === "category_perfect")
      .map((award) => award.metadata.category_id);
    expect(awardedCategoryIds).toEqual(juniorCategoryIds);
  });
});

describe("backfillTotalScore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.collection.mockImplementation(
      (...segments: unknown[]) => ({ path: segments.slice(1).join("/") }),
    );
    mocks.getDocs.mockImplementation((ref: { path: string }) =>
      Promise.resolve(
        ref.path.endsWith("/assessments")
          ? assessmentSnapshot(juniorMap)
          : snapshotOf([]),
      ),
    );
    mocks.doc.mockReturnValue({ name: "doc-ref" });
    mocks.setDoc.mockResolvedValue(undefined);
    mocks.updateDoc.mockResolvedValue(undefined);
    mocks.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ totalScore: 0 }),
    });
    stateMock.current = {
      assessments: juniorMap,
      progress: { currentLevelId: "junior", unlockedLevelIds: ["junior"], totalScore: 0 },
      streak: { longestStreak: 0 },
      achievements: {},
    };
  });

  function assessmentReads(): number {
    return mocks.getDocs.mock.calls.filter(([ref]) =>
      (ref as { path: string }).path.endsWith("/assessments"),
    ).length;
  }

  it("с готовой картой не читает коллекцию assessments, без неё — читает один раз", async () => {
    await backfillTotalScore(UID, juniorMap);

    expect(assessmentReads()).toBe(0);

    await backfillTotalScore(UID);

    expect(assessmentReads()).toBe(0);
  });

  it("принимает общий промис с картой: обе функции читают assessments один раз и считают по ней", async () => {
    const shared = readAssessmentMap(UID);

    const [totalScore, awards] = await Promise.all([
      backfillTotalScore(UID, shared),
      checkAchievements(UID, shared),
    ]);

    expect(assessmentReads()).toBe(0);
    expect(totalScore).toBe(calcTotalScore(juniorMap));
    expect(
      awards.filter((award) => award.type === "category_perfect"),
    ).toHaveLength(juniorCategoryIds.length);
  });
});

describe("toggleProjectCompletion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.collection.mockImplementation(
      (...segments: unknown[]) => ({ path: segments.slice(1).join("/") }),
    );
    mocks.doc.mockReturnValue({ name: "doc-ref" });
    mocks.setDoc.mockResolvedValue(undefined);
    mocks.writeBatch.mockReturnValue(mocks.batch);
    mocks.batch.set.mockClear();
    mocks.batch.commit.mockResolvedValue(undefined);
    mocks.runTransaction.mockImplementation(async (_db: unknown, cb: (tx: unknown) => unknown) =>
      cb({ get: vi.fn().mockResolvedValue({ exists: () => false }), set: vi.fn() }),
    );
  });

  it("пишет документ проекта", async () => {
    const { toggleProjectCompletion } = await import("./firestore-actions");
    await toggleProjectCompletion("proj-1", true);

    expect(mocks.setDoc).toHaveBeenCalled();
  });
});
