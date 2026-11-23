import { describe, expect, it } from "vitest";
import { categories } from "./categories";
import { levels } from "./levels";
import { getSkillsByLevelId, skills } from "./skills";

// `requiredForLevelUp` is the knowledge gate for the next grade and, for the
// final grade, the core set shown as solid nodes in the roadmap. A grade that
// loses its required skills falls back to "everything is optional", which is
// exactly the regression this floor guards against.
const MIN_REQUIRED_SHARE = 0.3;

describe("обязательные навыки грейдов", () => {
  it.each(levels)(
    "$name: минимум 30% навыков грейда обязательны",
    ({ id }) => {
      const gradeSkills = getSkillsByLevelId(id);
      const required = gradeSkills.filter((skill) => skill.requiredForLevelUp);

      expect(gradeSkills.length, `грейд ${id} без навыков`).toBeGreaterThan(0);
      expect(
        required.length / gradeSkills.length,
        `грейд ${id}: обязательно ${required.length} из ${gradeSkills.length}`,
      ).toBeGreaterThanOrEqual(MIN_REQUIRED_SHARE);
    },
  );

  it("каждая категория содержит хотя бы один обязательный навык", () => {
    for (const category of categories) {
      const required = skills.filter(
        (skill) => skill.categoryId === category.id && skill.requiredForLevelUp,
      );

      expect(
        required.length,
        `категория без обязательных навыков: ${category.id}`,
      ).toBeGreaterThan(0);
    }
  });
});
