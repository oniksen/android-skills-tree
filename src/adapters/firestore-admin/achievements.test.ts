import { beforeEach, describe, expect, it, vi } from "vitest";
import { skills } from "@/data/skills";
import { categories } from "@/data/categories";
import {
  evaluateAchievements,
  achievementKey,
  type AssessmentMap,
} from "@/core/domain/achievement-conditions";
import {
  addAchievementsIfNotExists,
  addAchievementIfNotExists,
  deleteAchievementsByLevel,
  deleteCategoryPerfectAchievement,
} from "@/adapters/firestore-admin/achievements";

const UID = "user-1";

const writes: Array<{ path: string; data: unknown }> = [];
const deletes: string[] = [];
const stored: Map<string, Record<string, unknown>> = new Map();

function fakeDb() {
  return {
    doc(path: string) {
      return {
        async get() {
          return {
            exists: stored.has(path),
            data: () => stored.get(path),
          };
        },
        async set(data: Record<string, unknown>) {
          writes.push({ path, data });
          stored.set(path, data);
        },
        async delete() {
          deletes.push(path);
        },
      };
    },
    collection(path: string) {
      const prefix = `${path}/`;
      return {
        async get() {
          return {
            docs: [...stored.entries()]
              .filter(([p]) => p.startsWith(prefix))
              .map(([p, data]) => ({
                ref: { path: p },
                data: () => data,
              })),
          };
        },
        async add(data: Record<string, unknown>) {
          const autoId = `auto-${stored.size}`;
          stored.set(`${path}/${autoId}`, data);
          return { path: `${path}/${autoId}` };
        },
      };
    },
    batch() {
      const ops: Promise<void>[] = [];
      return {
        delete(ref: { path: string }) {
          deletes.push(ref.path);
          ops.push(Promise.resolve());
          return this;
        },
        set(ref: { path: string }, data: Record<string, unknown>) {
          writes.push({ path: ref.path, data });
          ops.push(Promise.resolve());
          return this;
        },
        async commit() {
          await Promise.all(ops);
        },
      };
    },
  };
}

vi.mock("@/adapters/firestore-admin/admin-app", async () => {
  return {
    fsPath: (segments: readonly string[]) => segments.join("/"),
    getAdminDb: () => fakeDb(),
  };
});

interface StoredAchievementData {
  type?: string;
  metadata?: Record<string, unknown>;
  matchKey?: string;
  matchValue?: unknown;
}

function storeAchievement(id: string, data: StoredAchievementData): void {
  stored.set(
    `users/${UID}/achievements/${id}`,
    data as Record<string, unknown>,
  );
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

const juniorAwards = evaluateAchievements(
  allCheckedMap(categoryIdsOfLevel("junior")),
);
const categoryAward = juniorAwards.find((a) => a.type === "category_perfect")!;
const levelAward = juniorAwards.find((a) => a.type === "level_master")!;

const CATEGORY_ID = categoryAward.metadata.category_id as string;

describe("addAchievementsIfNotExists", () => {
  beforeEach(() => {
    writes.length = 0;
    deletes.length = 0;
    stored.clear();
  });

  it("writes every missing award under its deterministic key id", async () => {
    await addAchievementsIfNotExists(UID, [categoryAward, levelAward]);

    const paths = writes.map((w) => w.path);
    expect(paths).toContain(
      `users/${UID}/achievements/${achievementKey(categoryAward.type, categoryAward.metadata)}`,
    );
    expect(paths).toContain(
      `users/${UID}/achievements/${achievementKey(levelAward.type, levelAward.metadata)}`,
    );
    expect(writes[0].data).toMatchObject({
      type: categoryAward.type,
      metadata: categoryAward.metadata,
    });
  });

  it("skips an award the stored document already holds", async () => {
    storeAchievement(
      achievementKey(categoryAward.type, categoryAward.metadata),
      { type: categoryAward.type, metadata: categoryAward.metadata },
    );

    await addAchievementsIfNotExists(UID, [categoryAward]);

    expect(writes).toHaveLength(0);
  });

  it("compares by type and metadata, ignoring stored match fields", async () => {
    storeAchievement("legacy-1", {
      type: categoryAward.type,
      metadata: categoryAward.metadata,
      matchKey: "чужой_ключ",
      matchValue: "чужое_значение",
    });

    await addAchievementsIfNotExists(UID, [categoryAward]);

    expect(writes).toHaveLength(0);
  });

  it("does not touch the storage for an empty award list", async () => {
    await addAchievementsIfNotExists(UID, []);

    expect(writes).toHaveLength(0);
  });

  it("writes an award of the same type when the stored category_id differs", async () => {
    storeAchievement("junior-types-perfect", {
      type: categoryAward.type,
      metadata: { ...categoryAward.metadata, category_id: "junior-types" },
    });

    await addAchievementsIfNotExists(UID, [categoryAward]);

    expect(writes).toHaveLength(1);
  });

  it("does not write twice for an award already on the storage", async () => {
    await addAchievementsIfNotExists(UID, [categoryAward]);
    expect(writes).toHaveLength(1);

    writes.length = 0;
    await addAchievementsIfNotExists(UID, [categoryAward]);
    expect(writes).toHaveLength(0);
  });
});

describe("addAchievementIfNotExists", () => {
  beforeEach(() => {
    writes.length = 0;
    deletes.length = 0;
    stored.clear();
  });

  it("writes only when the type is not stored yet", async () => {
    await addAchievementIfNotExists(UID, "level_up", { from_level: "Junior", to_level: "Middle", score: 100 });
    expect(stored.size).toBe(1);

    await addAchievementIfNotExists(UID, "level_up", { from_level: "Junior", to_level: "Middle", score: 200 });
    expect(stored.size).toBe(1);

    await addAchievementIfNotExists(UID, "level_up", { from_level: "Junior", to_level: "Middle", score: 300 }, "score", 300);
    expect(stored.size).toBe(2);
  });
});

describe("deleteAchievementsByLevel", () => {
  beforeEach(() => {
    writes.length = 0;
    deletes.length = 0;
    stored.clear();
  });

  it("deletes level-scoped awards and path_complete, keeps the rest", async () => {
    storeAchievement("cp", { type: "category_perfect", metadata: { level_id: "junior" } });
    storeAchievement("lm", { type: "level_master", metadata: { level_id: "junior" } });
    storeAchievement("pc", { type: "path_complete", metadata: {} });
    storeAchievement("cp-other", { type: "category_perfect", metadata: { level_id: "middle" } });
    storeAchievement("other", { type: "streak_7", metadata: { days: 7 } });

    await deleteAchievementsByLevel(UID, "junior");

    expect(deletes.sort()).toEqual(
      ["users/user-1/achievements/cp", "users/user-1/achievements/lm", "users/user-1/achievements/pc"].sort(),
    );
  });

  it("commits an empty batch quietly when nothing matches", async () => {
    storeAchievement("other", { type: "streak_7", metadata: { days: 7 } });

    await expect(
      deleteAchievementsByLevel(UID, "junior"),
    ).resolves.toBeUndefined();
    expect(deletes).toHaveLength(0);
  });
});

describe("deleteCategoryPerfectAchievement", () => {
  beforeEach(() => {
    writes.length = 0;
    deletes.length = 0;
    stored.clear();
  });

  it("deletes only the stored award whose key matches the revoked one", async () => {
    const key = achievementKey("category_perfect", { category_id: CATEGORY_ID });
    storeAchievement(key, { type: "category_perfect", metadata: { category_id: CATEGORY_ID } });
    storeAchievement("junior-types-perfect", {
      type: "category_perfect",
      metadata: { category_id: "junior-types" },
    });

    await deleteCategoryPerfectAchievement(UID, CATEGORY_ID);

    expect(deletes).toEqual([`users/${UID}/achievements/${key}`]);
  });

  it("deletes nothing when the category award is not stored", async () => {
    await expect(
      deleteCategoryPerfectAchievement(UID, CATEGORY_ID),
    ).resolves.toBeUndefined();
    expect(deletes).toHaveLength(0);
  });
});
