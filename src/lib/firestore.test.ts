import { beforeEach, describe, expect, it, vi } from "vitest";
import { skills } from "@/data/skills";
import { categories } from "@/data/categories";
import { evaluateAchievements, type AssessmentMap } from "@/lib/achievement-conditions";
import { addAchievementsIfNotExists } from "@/lib/firestore";

const mocks = vi.hoisted(() => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  collection: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
}));

vi.mock("firebase/firestore", () => mocks);

vi.mock("@/lib/firebase", () => ({ db: { name: "mock-db" } }));

const UID = "user-1";
const ACHIEVEMENTS_REF = { name: "achievements-ref" };
const AUTO_DOC_REF = { name: "auto-id-doc" };

interface StoredAchievement {
  type?: string;
  metadata?: Record<string, unknown>;
  matchKey?: string;
  matchValue?: unknown;
  achievedAt?: Date;
}

function snapshotOf(stored: StoredAchievement[]) {
  return {
    docs: stored.map((data, index) => ({
      id: `stored-${index}`,
      data: () => data,
    })),
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

const juniorAwards = evaluateAchievements(allCheckedMap(categoryIdsOfLevel("junior")));
const categoryAward = juniorAwards.find((a) => a.type === "category_perfect")!;
const levelAward = juniorAwards.find((a) => a.type === "level_master")!;

describe("addAchievementsIfNotExists", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.collection.mockReturnValue(ACHIEVEMENTS_REF);
    mocks.doc.mockReturnValue(AUTO_DOC_REF);
    mocks.setDoc.mockResolvedValue(undefined);
    mocks.getDocs.mockResolvedValue(snapshotOf([]));
  });

  it("читает achievements один раз на весь пакет и пишет каждую награду", async () => {
    await addAchievementsIfNotExists(UID, [categoryAward, levelAward]);

    expect(mocks.collection).toHaveBeenCalledWith({ name: "mock-db" }, "users", UID, "achievements");
    expect(mocks.getDocs).toHaveBeenCalledTimes(1);
    expect(mocks.getDocs).toHaveBeenCalledWith(ACHIEVEMENTS_REF);
    expect(mocks.setDoc).toHaveBeenCalledTimes(2);
  });

  it("не пишет награду, которую уже держит сохранённый документ", async () => {
    mocks.getDocs.mockResolvedValue(
      snapshotOf([
        { type: categoryAward.type, metadata: categoryAward.metadata, achievedAt: new Date() },
      ]),
    );

    await addAchievementsIfNotExists(UID, [categoryAward]);

    expect(mocks.setDoc).not.toHaveBeenCalled();
  });

  it("игнорирует записанные matchKey и matchValue, сверяясь по type и metadata", async () => {
    mocks.getDocs.mockResolvedValue(
      snapshotOf([
        {
          type: categoryAward.type,
          metadata: categoryAward.metadata,
          matchKey: "чужой_ключ",
          matchValue: "чужое_значение",
          achievedAt: new Date(),
        },
      ]),
    );

    await addAchievementsIfNotExists(UID, [categoryAward]);

    expect(mocks.setDoc).not.toHaveBeenCalled();
  });

  it("не ходит в Firestore на пустом списке наград", async () => {
    await addAchievementsIfNotExists(UID, []);

    expect(mocks.getDocs).not.toHaveBeenCalled();
    expect(mocks.setDoc).not.toHaveBeenCalled();
  });

  it("добавляет документ с авто-id, а не перезаписывает существующий", async () => {
    await addAchievementsIfNotExists(UID, [categoryAward]);

    expect(mocks.doc).toHaveBeenCalledWith(ACHIEVEMENTS_REF);
    expect(mocks.setDoc).toHaveBeenCalledWith(AUTO_DOC_REF, {
      type: categoryAward.type,
      metadata: categoryAward.metadata,
      achievedAt: expect.any(Date),
    });
  });

  it("пишет награду того же типа, если у сохранённой другой category_id", async () => {
    mocks.getDocs.mockResolvedValue(
      snapshotOf([
        {
          type: categoryAward.type,
          metadata: { ...categoryAward.metadata, category_id: "junior-types" },
          achievedAt: new Date(),
        },
      ]),
    );

    await addAchievementsIfNotExists(UID, [categoryAward]);

    expect(mocks.setDoc).toHaveBeenCalledTimes(1);
  });
});
