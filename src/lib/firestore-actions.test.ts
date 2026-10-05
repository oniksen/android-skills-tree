import { beforeEach, describe, expect, it, vi } from "vitest";
import { skills } from "@/data/skills";
import { categories } from "@/data/categories";
import { calcTotalScore } from "@/lib/scoring";
import { type AssessmentMap } from "@/lib/achievement-conditions";
import {
  backfillTotalScore,
  checkAchievements,
  readAssessmentMap,
} from "@/lib/firestore-actions";

const mocks = vi.hoisted(() => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  runTransaction: vi.fn(),
}));

vi.mock("firebase/firestore", () => mocks);

vi.mock("@/lib/firebase", () => ({
  auth: { currentUser: { uid: "user-1" } },
  db: { name: "mock-db" },
}));

const UID = "user-1";
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
    mocks.doc.mockReturnValue({ name: "doc-ref" });
    mocks.setDoc.mockResolvedValue(undefined);
  });

  it("с готовой картой читает Firestore один раз, без неё — дважды", async () => {
    await checkAchievements(UID, juniorMap);

    expect(mocks.getDocs).toHaveBeenCalledTimes(1);

    mocks.getDocs.mockClear();

    await checkAchievements(UID);

    expect(mocks.getDocs).toHaveBeenCalledTimes(2);
  });

  it("передаёт награды на сохранение: по category_perfect на каждую категорию уровня", async () => {
    await checkAchievements(UID, juniorMap);

    const writtenTypes = mocks.setDoc.mock.calls.map(
      ([, payload]) => (payload as { type: string }).type,
    );
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

    expect(assessmentReads()).toBe(1);
  });

  it("принимает общий промис с картой: обе функции читают assessments один раз и считают по ней", async () => {
    const shared = readAssessmentMap(UID);

    const [totalScore, awards] = await Promise.all([
      backfillTotalScore(UID, shared),
      checkAchievements(UID, shared),
    ]);

    expect(assessmentReads()).toBe(1);
    expect(totalScore).toBe(calcTotalScore(juniorMap));
    expect(
      awards.filter((award) => award.type === "category_perfect"),
    ).toHaveLength(juniorCategoryIds.length);
  });
});
