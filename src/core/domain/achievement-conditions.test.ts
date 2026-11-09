import { describe, expect, it } from "vitest";
import { skills } from "@/data/skills";
import { categories } from "@/data/categories";
import { levels } from "@/data/levels";
import {
  achievementKey,
  evaluateAchievements,
  getAssessmentAwardKeys,
  isCategoryPerfect,
  isLevelMastered,
  selectMissingAwards,
  type AssessmentMap,
} from "@/core/domain/achievement-conditions";
const OSNOVY = "junior-osnovy";

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

describe("isCategoryPerfect", () => {
  it("возвращает true когда все подтемы категории отмечены", () => {
    expect(isCategoryPerfect(OSNOVY, allCheckedMap([OSNOVY]))).toBe(true);
  });

  it("возвращает false когда один подтем не отмечен", () => {
    const map = allCheckedMap([OSNOVY]);
    const firstSkill = skills.find((s) => s.categoryId === OSNOVY)!;
    const subtopics = { ...map[firstSkill.id].subtopics };
    subtopics[firstSkill.subtopics[0]] = false;
    map[firstSkill.id] = { subtopics };

    expect(isCategoryPerfect(OSNOVY, map)).toBe(false);
  });

  it("возвращает false когда у скилла нет документа assessment", () => {
    const map = allCheckedMap([OSNOVY]);
    delete map[skills.find((s) => s.categoryId === OSNOVY)!.id];

    expect(isCategoryPerfect(OSNOVY, map)).toBe(false);
  });

  it("возвращает false для несуществующей категории", () => {
    expect(isCategoryPerfect("no-such-category", allCheckedMap([OSNOVY]))).toBe(false);
  });

  it("после снятия одного подтема ломает только свою категорию, а не соседние", () => {
    const sibling = categoryIdsOfLevel("junior").find((id) => id !== OSNOVY)!;
    const map = allCheckedMap([OSNOVY, sibling]);
    const unticked = skills.find((s) => s.categoryId === OSNOVY)!;
    map[unticked.id] = {
      subtopics: { ...map[unticked.id].subtopics, [unticked.subtopics[0]]: false },
    };

    expect(isCategoryPerfect(OSNOVY, map)).toBe(false);
    expect(isCategoryPerfect(sibling, map)).toBe(true);
  });
});

describe("isLevelMastered", () => {
  it("возвращает false когда закрыта не каждая категория уровня", () => {
    const all = categoryIdsOfLevel("junior");
    expect(isLevelMastered("junior", allCheckedMap(all.slice(0, all.length - 1)))).toBe(
      false,
    );
  });

  it("возвращает true когда все категории уровня закрыты", () => {
    expect(isLevelMastered("junior", allCheckedMap(categoryIdsOfLevel("junior")))).toBe(
      true,
    );
  });

  it("не расходится с isCategoryPerfect: один подтем ломает и категорию, и уровень", () => {
    const map = allCheckedMap(categoryIdsOfLevel("junior"));
    const skill = skills.find((s) => s.id === "junior-osnovy-tipy")!;
    const subtopics = { ...map[skill.id].subtopics };
    subtopics[skill.subtopics[0]] = false;
    map[skill.id] = { subtopics };

    expect(isCategoryPerfect("junior-osnovy", map)).toBe(false);
    expect(isLevelMastered("junior", map)).toBe(false);
  });
});

describe("evaluateAchievements", () => {
  it("пустая карта не даёт ни одной ачивки", () => {
    expect(evaluateAchievements({ assessmentMap: {} })).toEqual([]);
  });

  it("даёт category_perfect с category_id в matchValue", () => {
    const award = evaluateAchievements({ assessmentMap: allCheckedMap([OSNOVY]) }).find(
      (a) => a.type === "category_perfect",
    );

    expect(award).toBeDefined();
    expect(award!.metadata.category_id).toBe(OSNOVY);
    expect(award!.metadata.category_name).toBe("Основы программирования");
    expect(award!.metadata.level_id).toBe("junior");
    expect(award!.matchKey).toBe("category_id");
    expect(award!.matchValue).toBe(OSNOVY);
  });

  it("даёт category_perfect для каждой категории на пороге первого тира", () => {
    const allCategoriesChecked = allCheckedMap(categories.map((c) => c.id));

    expect(
      evaluateAchievements({ assessmentMap: allCategoriesChecked }).filter(
        (a) => a.type === "category_perfect",
      ),
    ).toHaveLength(categories.length);
  });

  it("не даёт category_perfect за одну подтему большой категории", () => {
    const firstSkill = skills.filter((s) => s.categoryId === OSNOVY)[0];
    const map: AssessmentMap = {
      [firstSkill.id]: {
        subtopics: { [firstSkill.subtopics[0]]: true },
      },
    };

    const awards = evaluateAchievements({ assessmentMap: map });

    expect(
      awards.some(
        (a) => a.type === "category_perfect" && a.metadata.category_id === OSNOVY,
      ),
    ).toBe(false);
  });

  it("даёт level_master для уровня выше порога первого тира", () => {
    const award = evaluateAchievements({
      assessmentMap: allCheckedMap([OSNOVY]),
    }).find((a) => a.type === "level_master" && a.metadata.level_id === "junior");

    expect(award).toBeDefined();
    expect(award!.metadata.level_id).toBe("junior");
    expect(award!.metadata.level_name).toBe("Junior");
    expect(award!.matchKey).toBe("level_id");
    expect(award!.matchValue).toBe("junior");
  });

  it("пустая карта не даёт level_master и path_complete", () => {
    const awards = evaluateAchievements({ assessmentMap: {} });

    expect(awards.some((a) => a.type === "level_master")).toBe(false);
    expect(awards.some((a) => a.type === "path_complete")).toBe(false);
  });

  it("даёт level_master для каждого уровня, прошедшего порог", () => {
    const allLevelsChecked = allCheckedMap(categories.map((c) => c.id));

    expect(
      evaluateAchievements({ assessmentMap: allLevelsChecked }).filter(
        (a) => a.type === "level_master",
      ),
    ).toHaveLength(levels.length);
  });

  it("даёт path_complete с пустыми метаданными когда путь выше порога", () => {
    const award = evaluateAchievements({
      assessmentMap: allCheckedMap(categories.map((c) => c.id)),
    }).find((a) => a.type === "path_complete");

    expect(award).toBeDefined();
    expect(award!.metadata).toEqual({});
  });

  it("не пишет total_score в метаданные наград", () => {
    const awards = evaluateAchievements({
      assessmentMap: allCheckedMap(categories.map((c) => c.id)),
    });

    for (const award of awards) {
      expect(award.metadata).not.toHaveProperty("total_score");
      expect(award.metadata).not.toHaveProperty("tier");
      expect(award.metadata).not.toHaveProperty("tierProgress");
    }
  });

  it("даёт level_up по unlockedLevelIds с дедупликацией по to_level", () => {
    const awards = evaluateAchievements({
      assessmentMap: {},
      unlockedLevelIds: ["junior", "middle"],
    }).filter((a) => a.type === "level_up");

    expect(awards).toHaveLength(1);
    expect(awards[0].metadata).toEqual({
      from_level: "Junior",
      to_level: "Middle",
    });
    expect(awards[0].matchKey).toBe("to_level");
    expect(awards[0].matchValue).toBe("Middle");
  });

  it("даёт отдельное level_up на каждый следующий разблокированный уровень", () => {
    const awards = evaluateAchievements({
      assessmentMap: {},
      unlockedLevelIds: levels.map((level) => level.id),
    }).filter((a) => a.type === "level_up");

    expect(awards).toHaveLength(levels.length - 1);
  });

  it("не даёт level_up без разблокированных уровней", () => {
    expect(
      evaluateAchievements({ assessmentMap: {} }).filter((a) => a.type === "level_up"),
    ).toHaveLength(0);
  });

  it("не даёт streak_7 при максимальном стрике 6", () => {
    const awards = evaluateAchievements({
      assessmentMap: {},
      longestStreak: 6,
    });

    expect(awards.some((a) => a.type === "streak_7")).toBe(false);
  });

  it("даёт streak_7 при максимальном стрике 7", () => {
    const awards = evaluateAchievements({
      assessmentMap: {},
      longestStreak: 7,
    });
    const streak = awards.find((a) => a.type === "streak_7");

    expect(streak).toBeDefined();
    expect(streak!.metadata).toEqual({ days: 7 });
  });

  it("даёт все стрики при максимальном стрике 100", () => {
    const awards = evaluateAchievements({
      assessmentMap: {},
      longestStreak: 100,
    }).filter((a) => a.type.startsWith("streak_"));

    expect(awards).toHaveLength(4);
  });
});

describe("achievementKey", () => {
  it("использует matchKey из ACHIEVEMENT_MATCH_KEY", () => {
    expect(achievementKey("category_perfect", { category_id: OSNOVY })).toBe(
      "category_perfect::junior-osnovy",
    );
  });

  it("для типа без matchKey возвращает только type", () => {
    expect(achievementKey("path_complete", { total_score: 10 })).toBe("path_complete");
  });

  it("не падает на undefined metadata", () => {
    expect(achievementKey("level_up", undefined)).toBe("level_up");
  });

  it("разделяет разные значения одного типа", () => {
    expect(achievementKey("level_master", { level_id: "junior" })).not.toBe(
      achievementKey("level_master", { level_id: "middle" }),
    );
  });

  it("совпадает для двух ачивок типа с одним значением", () => {
    expect(achievementKey("category_perfect", { category_id: OSNOVY })).toBe(
      achievementKey("category_perfect", { category_id: OSNOVY, level_id: "junior" }),
    );
  });

  it("для level_up использует to_level", () => {
    expect(
      achievementKey("level_up", { from_level: "Junior", to_level: "Middle" }),
    ).toBe("level_up::Middle");
  });
});

describe("selectMissingAwards", () => {
  it("возвращает пустой массив на пустых входных данных", () => {
    expect(selectMissingAwards([], [])).toEqual([]);
  });

  it("возвращает award которого ещё нет", () => {
    const award = evaluateAchievements({ assessmentMap: allCheckedMap([OSNOVY]) })[0];

    expect(selectMissingAwards([award], [])).toEqual([award]);
  });

  it("исключает award который уже есть", () => {
    const award = evaluateAchievements({ assessmentMap: allCheckedMap([OSNOVY]) })[0];
    const key = achievementKey(award.type, award.metadata);

    expect(selectMissingAwards([award], [key])).toEqual([]);
  });

  it("убирает дубликаты внутри одного вызова", () => {
    const award = evaluateAchievements({ assessmentMap: allCheckedMap([OSNOVY]) })[0];

    expect(selectMissingAwards([award, award], [])).toEqual([award]);
  });

  it("matchValue каждого award совпадает с ключом дедупликации", () => {
    const awards = evaluateAchievements({
      assessmentMap: allCheckedMap(categories.map((c) => c.id)),
    }).filter((a) => a.matchKey !== undefined);

    expect(awards.length).toBeGreaterThan(0);
    for (const award of awards) {
      expect(award.matchValue).toBeDefined();
      expect(achievementKey(award.type, award.metadata)).toBe(
        `${award.type}::${award.matchValue}`,
      );
    }
  });
});

describe("getAssessmentAwardKeys", () => {
  it("empty map produces empty set", () => {
    expect(getAssessmentAwardKeys({}).size).toBe(0);
  });

  it("ordinary partial map crossing 7% produces category_perfect key", () => {
    const cat = categories[0].id;
    const skill = skills.find((s) => s.categoryId === cat)!;
    const subs = skill.subtopics.slice(0, 5);
    const map: AssessmentMap = {
      [skill.id]: { subtopics: Object.fromEntries(subs.map((st) => [st, true])) },
    };
    const keys = getAssessmentAwardKeys(map);
    expect([...keys].some((k) => k.startsWith("category_perfect::"))).toBe(true);
  });

  it("fully completed level produces category and level keys", () => {
    const map = allCheckedMap(categoryIdsOfLevel("junior"));
    const keys = getAssessmentAwardKeys(map);
    for (const catId of categoryIdsOfLevel("junior")) {
      expect(keys.has("category_perfect::" + catId)).toBe(true);
    }
    expect(keys.has("level_master::junior")).toBe(true);
  });

  it("fully completed all levels produces path_complete key", () => {
    const map = allCheckedMap(categories.map((c) => c.id));
    const keys = getAssessmentAwardKeys(map);
    expect(keys.has("path_complete")).toBe(true);
  });
});
