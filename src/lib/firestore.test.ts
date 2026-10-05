import { beforeEach, describe, expect, it, vi } from "vitest";
import { skills } from "@/data/skills";
import { categories } from "@/data/categories";
import { evaluateAchievements, type AssessmentMap } from "@/lib/achievement-conditions";
import { addAchievementsIfNotExists, deleteAchievementsByLevel } from "@/lib/firestore";

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
    docs: stored.map((data, index) => {
      const id = `stored-${index}`;
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

const juniorAwards = evaluateAchievements(allCheckedMap(categoryIdsOfLevel("junior")));
const categoryAward = juniorAwards.find((a) => a.type === "category_perfect")!;
const levelAward = juniorAwards.find((a) => a.type === "level_master")!;

const middleAwards = evaluateAchievements(allCheckedMap(categoryIdsOfLevel("middle")));
const middleCategoryAward = middleAwards.find((a) => a.type === "category_perfect")!;

const fullPathAwards = evaluateAchievements(
  allCheckedMap(categories.map((c) => c.id)),
);
const pathAward = fullPathAwards.find((a) => a.type === "path_complete")!;

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

describe("deleteAchievementsByLevel", () => {
  const storedOf = (award: { type: string; metadata: Record<string, unknown> }) => ({
    type: award.type,
    metadata: award.metadata,
    achievedAt: new Date(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.collection.mockReturnValue(ACHIEVEMENTS_REF);
    mocks.deleteDoc.mockResolvedValue(undefined);
  });

  it("удаляет category_perfect, у которого metadata.level_id совпадает со сбрасываемым уровнем", async () => {
    mocks.getDocs.mockResolvedValue(snapshotOf([storedOf(categoryAward)]));

    await deleteAchievementsByLevel(UID, "junior");

    expect(mocks.collection).toHaveBeenCalledWith({ name: "mock-db" }, "users", UID, "achievements");
    expect(mocks.deleteDoc).toHaveBeenCalledTimes(1);
    expect(mocks.deleteDoc).toHaveBeenCalledWith({ id: "stored-0" });
  });

  it("удаляет level_master, у которого metadata.level_id совпадает со сбрасываемым уровнем", async () => {
    mocks.getDocs.mockResolvedValue(snapshotOf([storedOf(levelAward)]));

    await deleteAchievementsByLevel(UID, "junior");

    expect(mocks.deleteDoc).toHaveBeenCalledTimes(1);
    expect(mocks.deleteDoc).toHaveBeenCalledWith({ id: "stored-0" });
  });

  it("удаляет path_complete, хотя у него нет level_id", async () => {
    expect(pathAward.metadata).not.toHaveProperty("level_id");

    mocks.getDocs.mockResolvedValue(snapshotOf([storedOf(pathAward)]));

    await deleteAchievementsByLevel(UID, "junior");

    expect(mocks.deleteDoc).toHaveBeenCalledTimes(1);
    expect(mocks.deleteDoc).toHaveBeenCalledWith({ id: "stored-0" });
  });

  it("не трогает category_perfect за другой уровень", async () => {
    expect(middleCategoryAward.metadata.level_id).toBe("middle");

    mocks.getDocs.mockResolvedValue(
      snapshotOf([storedOf(categoryAward), storedOf(middleCategoryAward)]),
    );

    await deleteAchievementsByLevel(UID, "junior");

    expect(mocks.deleteDoc).toHaveBeenCalledTimes(1);
    expect(mocks.deleteDoc).toHaveBeenCalledWith({ id: "stored-0" });
  });

  it("не трогает level_up и streak_N", async () => {
    mocks.getDocs.mockResolvedValue(
      snapshotOf([
        { type: "level_up", metadata: { from_level: "Junior", to_level: "Middle" }, achievedAt: new Date() },
        { type: "streak_3", metadata: { days: 3 }, achievedAt: new Date() },
      ]),
    );

    await deleteAchievementsByLevel(UID, "junior");

    expect(mocks.deleteDoc).not.toHaveBeenCalled();
  });

  it("на пустой коллекции ни разу не вызывает deleteDoc", async () => {
    mocks.getDocs.mockResolvedValue(snapshotOf([]));

    await deleteAchievementsByLevel(UID, "junior");

    expect(mocks.getDocs).toHaveBeenCalledWith(ACHIEVEMENTS_REF);
    expect(mocks.deleteDoc).not.toHaveBeenCalled();
  });
});
