import { describe, expect, it } from "vitest";
import { skills } from "@/data/skills";
import { categories } from "@/data/categories";
import { levels } from "@/data/levels";
import {
  achievementKey,
  evaluateAchievements,
  isCategoryPerfect,
  isLevelMastered,
  selectMissingAwards,
  type AssessmentMap,
} from "@/lib/achievement-conditions";
import { getTotalMaxScore } from "@/lib/weights";

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
    expect(evaluateAchievements({})).toEqual([]);
  });

  it("даёт category_perfect с category_id в matchValue", () => {
    const award = evaluateAchievements(allCheckedMap([OSNOVY])).find(
      (a) => a.type === "category_perfect",
    );

    expect(award).toBeDefined();
    expect(award!.metadata.category_id).toBe(OSNOVY);
    expect(award!.metadata.category_name).toBe("Основы программирования");
    expect(award!.metadata.level_id).toBe("junior");
    expect(award!.matchKey).toBe("category_id");
    expect(award!.matchValue).toBe(OSNOVY);
  });

  it("даёт category_perfect для каждой закрытой категории, а не только для первой", () => {
    const allCategoriesChecked = allCheckedMap(categories.map((c) => c.id));

    expect(
      evaluateAchievements(allCategoriesChecked).filter((a) => a.type === "category_perfect"),
    ).toHaveLength(categories.length);
  });

  it("не даёт level_master при неполном уровне", () => {
    const all = categoryIdsOfLevel("junior");
    const awards = evaluateAchievements(allCheckedMap(all.slice(0, all.length - 1)));

    expect(awards.some((a) => a.type === "level_master")).toBe(false);
  });

  it("даёт level_master когда закрыт весь уровень", () => {
    const award = evaluateAchievements(allCheckedMap(categoryIdsOfLevel("junior"))).find(
      (a) => a.type === "level_master",
    );

    expect(award).toBeDefined();
    expect(award!.metadata.level_id).toBe("junior");
    expect(award!.matchKey).toBe("level_id");
    expect(award!.matchValue).toBe("junior");
  });

  it("даёт level_master для каждого закрытого уровня, а не только для первого", () => {
    const allLevelsChecked = allCheckedMap(categories.map((c) => c.id));

    expect(
      evaluateAchievements(allLevelsChecked).filter((a) => a.type === "level_master"),
    ).toHaveLength(levels.length);
  });

  it("не даёт path_complete пока закрыт не весь путь", () => {
    const awards = evaluateAchievements(allCheckedMap(categoryIdsOfLevel("junior")));

    expect(awards.some((a) => a.type === "path_complete")).toBe(false);
  });

  it("даёт path_complete с total_score когда закрыты все уровни", () => {
    const award = evaluateAchievements(allCheckedMap(categories.map((c) => c.id))).find(
      (a) => a.type === "path_complete",
    );

    expect(award).toBeDefined();
    expect(award!.metadata.total_score).toBe(getTotalMaxScore());
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
});

describe("selectMissingAwards", () => {
  it("возвращает пустой массив на пустых входных данных", () => {
    expect(selectMissingAwards([], [])).toEqual([]);
  });

  it("возвращает award которого ещё нет", () => {
    const award = evaluateAchievements(allCheckedMap([OSNOVY]))[0];

    expect(selectMissingAwards([award], [])).toEqual([award]);
  });

  it("исключает award который уже есть", () => {
    const award = evaluateAchievements(allCheckedMap([OSNOVY]))[0];
    const key = achievementKey(award.type, award.metadata);

    expect(selectMissingAwards([award], [key])).toEqual([]);
  });

  it("убирает дубликаты внутри одного вызова", () => {
    const award = evaluateAchievements(allCheckedMap([OSNOVY]))[0];

    expect(selectMissingAwards([award, award], [])).toEqual([award]);
  });

  it("matchValue каждого award совпадает с ключом дедупликации", () => {
    const awards = evaluateAchievements(allCheckedMap(categories.map((c) => c.id))).filter(
      (a) => a.matchKey !== undefined,
    );

    expect(awards.length).toBeGreaterThan(0);
    for (const award of awards) {
      expect(award.matchValue).toBeDefined();
      expect(achievementKey(award.type, award.metadata)).toBe(
        `${award.type}::${award.matchValue}`,
      );
    }
  });
});
